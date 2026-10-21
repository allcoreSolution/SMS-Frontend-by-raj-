import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { 
  Download, Zap, Info, ChevronRight, FileText, CheckCircle2, AlertTriangle, 
  ArrowUpRight, IndianRupee, Clock, ListFilter, SlidersHorizontal, Users,
  HandCoins, FileSearch, ArrowRightLeft, UserPlus, 
  WalletCards, LayoutGrid, Percent, Hash, Receipt, TrendingUp, Sparkles,
  ShieldCheck, RefreshCw, Eye
} from 'lucide-react';
import QuickSetupModal from '../../components/finance/QuickSetupModal';
import FinanceTabs from '../../components/finance/FinanceTabs';
import { feeCollectionService } from '../../api/feeCollectionService';

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const [isQuickSetupOpen, setIsQuickSetupOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentTxns, setRecentTxns] = useState([]);
  const [topDefaulters, setTopDefaulters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, txnRes, dueRes] = await Promise.all([
        feeCollectionService.getFinanceDashboard(),
        feeCollectionService.getAllTransactions({ limit: 6 }),
        feeCollectionService.searchDueFees({ limit: 6 })
      ]);

      if (dashRes?.data) setStats(dashRes.data);
      if (txnRes?.data) {
        setRecentTxns(txnRes.data.slice(0, 6));
      }
      if (dueRes?.data) {
        setTopDefaulters(dueRes.data.slice(0, 6));
      }
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Finance dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fmt = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;
  const pct = stats ? Math.min(100, ((stats.totalCollected || 0) / Math.max(stats.totalAssigned || 1, 1)) * 100).toFixed(1) : '0.0';

  // Chart data
  const trendData = (stats?.collectionTrend || []).map(d => ({ name: d.date, amount: d.amount }));
  const paymentModeData = (stats?.paymentModes || []).map((m, i) => ({
    name: m.mode,
    value: m.amount || m.count * 10000,
    count: m.count,
    color: ['#10b981', '#6366f1', '#f59e0b', '#ec4899'][i % 4]
  }));
  const feeTypeData = (stats?.feeTypes || []).map((m, i) => ({
    name: m.type,
    amount: m.amount,
    color: ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][i % 5]
  }));
  const dueVsPaidData = (stats?.dueVsPaidByClass || []).map(d => ({
    name: d.className,
    paid: d.paid,
    due: d.due
  }));

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto bg-slate-50/70 min-h-screen text-slate-800 pb-24 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-indigo-950/10 mb-6 relative overflow-hidden border border-indigo-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold backdrop-blur-md border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Academic Year 2024–2025 • Active Financial Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              Fee & Financial Intelligence
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE
              </span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Consolidated real-time fee collection analytics, dues recovery ledger, payment gateways breakdown, and institutional cash flow audits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
              title="Refresh live metrics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button 
              onClick={() => setIsQuickSetupOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/15 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick Setup</span>
            </button>
            <button 
              onClick={() => navigate('/finance/search-due-fees')}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileSearch className="w-3.5 h-3.5 text-sky-400" />
              <span>Search Dues</span>
            </button>
            <button 
              onClick={() => navigate('/finance/collect')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <HandCoins className="w-4 h-4" />
              <span>Collect Fees</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <FinanceTabs />

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
        {[
          { 
            label: 'Total Demanded', 
            val: fmt(stats?.totalAssigned), 
            sub: `${stats?.totalAssignedCount || 0} students assigned`, 
            color: 'from-blue-600 to-indigo-600',
            bg: 'bg-blue-50/60',
            textColor: 'text-blue-700',
            icon: Users
          },
          { 
            label: 'Total Realized', 
            val: fmt(stats?.totalCollected), 
            sub: `${fmt(stats?.onlineCollected || 0)} online/UPI`, 
            color: 'from-emerald-600 to-teal-600',
            bg: 'bg-emerald-50/60',
            textColor: 'text-emerald-700',
            icon: CheckCircle2
          },
          { 
            label: 'Outstanding Dues', 
            val: fmt(stats?.totalDue), 
            sub: `${stats?.studentsWithDue || 0} students pending`, 
            color: 'from-rose-600 to-red-600',
            bg: 'bg-rose-50/60',
            textColor: 'text-rose-700',
            icon: AlertTriangle
          },
          { 
            label: 'Collected Today', 
            val: fmt(stats?.collectedToday), 
            sub: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), 
            color: 'from-violet-600 to-purple-600',
            bg: 'bg-violet-50/60',
            textColor: 'text-violet-700',
            icon: TrendingUp
          },
          { 
            label: 'Concessions & Relief', 
            val: fmt(stats?.totalConcession), 
            sub: 'Scholarship waivers granted', 
            color: 'from-amber-500 to-orange-600',
            bg: 'bg-amber-50/60',
            textColor: 'text-amber-700',
            icon: Percent
          },
          { 
            label: 'Late Fines Realized', 
            val: fmt(stats?.totalFine), 
            sub: 'Default penalties added', 
            color: 'from-pink-600 to-rose-600',
            bg: 'bg-pink-50/60',
            textColor: 'text-pink-700',
            icon: ShieldCheck
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div 
              key={i} 
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{card.label}</span>
                <div className={`w-8 h-8 rounded-xl ${card.bg} ${card.textColor} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mb-1">
                  {loading ? '...' : card.val}
                </h3>
                <p className="text-[11px] font-medium text-slate-500 truncate">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Collection Efficiency Gauge Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Aggregate Collection Progress</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${Number(pct) >= 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {Number(pct) >= 70 ? 'Excellent Health' : Number(pct) >= 50 ? 'Healthy' : 'Needs Follow-up'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Net collected revenue across academic terms compared against assigned fee demand.
            </p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600">{pct}%</span>
            <span className="text-xs font-semibold text-slate-400">cleared</span>
          </div>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.max(5, Math.min(100, Number(pct)))}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium mt-2">
          <span>Collected: <strong className="text-emerald-600">{fmt(stats?.totalCollected)}</strong></span>
          <span>Pending Dues: <strong className="text-rose-600">{fmt(stats?.totalDue)}</strong></span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
        
        {/* Trend Area Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                <span>Fee Collection Trend (Past 15 Days)</span>
              </h3>
              <p className="text-xs text-slate-500">Daily realization velocity across all payment channels</p>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-100">
              Live Audited
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorAmountGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(val) => `₹${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`} 
                />
                <RechartsTooltip 
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Collections']}
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    color: '#fff', 
                    borderRadius: '12px', 
                    border: 'none', 
                    fontSize: '11px',
                    padding: '8px 12px' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#6366f1" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorAmountGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Modes Donut (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span>Channels Share</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-500">By Amount</span>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={paymentModeData} 
                  innerRadius={50} 
                  outerRadius={75} 
                  paddingAngle={3} 
                  dataKey="value"
                >
                  {paymentModeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-2 pt-3 border-t border-slate-100">
            {paymentModeData.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="font-medium text-slate-700">{m.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">{fmt(m.value)}</span>
                  <span className="text-[10px] text-slate-400 ml-1.5">({m.count} txns)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Due vs Paid by Class & Fee Types Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
        
        {/* Due vs Paid by Class (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-blue-600" />
                <span>Class-wise Realization vs Dues</span>
              </h3>
              <p className="text-xs text-slate-500">Comparison of paid fees vs outstanding balances by grade</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Paid
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-rose-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Due
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dueVsPaidData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(val) => `₹${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`}
                />
                <RechartsTooltip 
                  formatter={(val, name) => [`₹${Number(val).toLocaleString('en-IN')}`, name === 'paid' ? 'Paid Amount' : 'Due Balance']}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', fontSize: '11px' }}
                />
                <Bar dataKey="paid" fill="#10b981" radius={[4, 4, 0, 0]} barSize={14} />
                <Bar dataKey="due" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Types Distribution (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ListFilter className="w-4 h-4 text-violet-600" />
                <span>Revenue by Fee Heads</span>
              </h3>
              <p className="text-xs text-slate-500">Distribution across tuition, laboratory, sports, and transport</p>
            </div>
            <button 
              onClick={() => navigate('/finance/types')}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              View Heads
            </button>
          </div>

          <div className="space-y-3 my-auto">
            {feeTypeData.map((ft, idx) => {
              const maxVal = Math.max(...feeTypeData.map(d => d.amount), 1);
              const barPercent = Math.min(100, (ft.amount / maxVal) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">{ft.name}</span>
                    <span className="font-bold text-slate-900">{fmt(ft.amount)}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${barPercent}%`, backgroundColor: ft.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Row 3: Top Defaulters Table & Recent Collections Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
        
        {/* Top Defaulters (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>High Priority Outstanding Balances</span>
              </h3>
              <p className="text-xs text-slate-500">Students with highest pending amounts requiring collection</p>
            </div>
            <button 
              onClick={() => navigate('/finance/search-due-fees')}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              View All ({stats?.studentsWithDue || 0})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3 text-right">Total Demand</th>
                  <th className="py-2.5 px-3 text-right">Balance Due</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {topDefaulters.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">
                      No outstanding dues recorded.
                    </td>
                  </tr>
                ) : (
                  topDefaulters.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0">
                            {s.firstName?.charAt(0) || s.name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim()}</span>
                            <span className="text-[10px] text-slate-400">{s.admissionNo || s.aparId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold">
                          {s.academicClass?.className || s.class || 'Class I'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-600">
                        {fmt(s.totalAssigned)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-rose-600">
                        {fmt(s.totalDue)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button 
                          onClick={() => navigate(`/finance/collect/${s.id || s._id || s.admissionNo}`)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                        >
                          <HandCoins className="w-3.5 h-3.5" />
                          <span>Collect</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Collections Feed (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Recent Fee Receipts</span>
              </h3>
              <button 
                onClick={() => navigate('/finance/transactions')}
                className="text-xs text-indigo-600 font-semibold hover:underline"
              >
                All Txns
              </button>
            </div>

            <div className="space-y-3">
              {recentTxns.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No collections recorded yet.</p>
              ) : (
                recentTxns.map((r, i) => {
                  const sName = r.student ? `${r.student.firstName || ''} ${r.student.lastName || ''}`.trim() : 'Enrolled Student';
                  return (
                    <div key={i} className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-3 hover:bg-slate-100/60 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                          ₹
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 truncate max-w-[150px]">{sName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-600">
                              {r.paymentMode || 'Cash'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {r.receiptNo || `REC-${i+1001}`}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-600 block">
                          +{fmt(r.amountPaid || r.amount)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {r.paymentDate ? new Date(r.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'Today'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Audit Status: <strong className="text-emerald-600">Reconciled</strong></span>
            <span>Ledger v2.4 Pro</span>
          </div>
        </div>

      </div>

      {/* Quick Setup Modal */}
      <QuickSetupModal isOpen={isQuickSetupOpen} onClose={() => setIsQuickSetupOpen(false)} />
    </div>
  );
};

export default FinanceDashboard;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Wallet, ArrowDownToLine, ArrowUpFromLine, Receipt, 
  Printer, TrendingUp, TrendingDown, DollarSign, 
  Calendar, CheckCircle2, PlusCircle, ArrowRight, 
  RefreshCw, FileText, Building2, Sparkles, AlertCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import AccountsTabs from '../../components/accounts/AccountsTabs';
import { accountsService } from '../../api/accountsService';

const AccountsDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      todaysCollection: 0,
      monthIncome: 0,
      monthExpense: 0,
      cashAndBank: 0
    },
    chartData: [],
    recentVouchers: []
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await accountsService.getDashboard();
      if (res && res.success) {
        setDashboardData({
          stats: res.stats || dashboardData.stats,
          chartData: res.chartData || [],
          recentVouchers: res.recentVouchers || []
        });
      }
    } catch (err) {
      console.error('Accounts dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (val) => `₹${(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const { stats, chartData, recentVouchers } = dashboardData;
  const netSurplus = (stats.monthIncome || 0) - (stats.monthExpense || 0);

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto bg-slate-50/60 min-h-screen text-slate-800 pb-24 font-sans">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white p-3.5 rounded-2xl text-xs flex items-center justify-between gap-3 mb-5 shadow-sm shadow-blue-500/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-xs">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <p className="leading-relaxed">
            <strong className="font-semibold">Accounts & Double-Entry Bookkeeping:</strong> Live synchronization between fee collection receipts, institutional incomes, departmental expenses, and bank ledgers.
          </p>
        </div>
        <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/15 text-xs font-medium backdrop-blur-xs shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-cyan-200" /> FY 2025-26
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Accounts &amp; Bookkeeping</h1>
          <p className="text-xs text-slate-500">Track institutional income, expenses, vouchers, and audit-ready books</p>
        </div>

        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          <button
            onClick={() => navigate('/accounts/income/add')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Record Income
          </button>
          <button
            onClick={() => navigate('/accounts/expense/add')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-500/20 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Record Expense
          </button>
          <button
            onClick={fetchDashboard}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-xs"
            title="Refresh Dashboard"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <AccountsTabs />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Card 1: Today's Collection */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TODAY'S INFLOW</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-0.5">{loading ? '...' : fmt(stats.todaysCollection)}</h2>
          <p className="text-xs text-blue-600 font-medium">Receipts &amp; direct income today</p>
        </div>

        {/* Card 2: This Month Income */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">THIS MONTH INCOME</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownToLine className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-emerald-600 mb-0.5">{loading ? '...' : fmt(stats.monthIncome)}</h2>
          <p className="text-xs text-slate-500 font-medium">Fees + departmental income</p>
        </div>

        {/* Card 3: This Month Expense */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">THIS MONTH EXPENSE</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpFromLine className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-rose-600 mb-0.5">{loading ? '...' : fmt(stats.monthExpense)}</h2>
          <p className="text-xs text-slate-500 font-medium">Operating &amp; maintenance costs</p>
        </div>

        {/* Card 4: Bank & Cash Balances */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CASH &amp; BANK HOLDINGS</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-indigo-700 mb-0.5">{loading ? '...' : fmt(stats.cashAndBank)}</h2>
          <p className="text-xs text-slate-500 font-medium">Sum across verified bank accounts</p>
        </div>

      </div>

      {/* Charts & Surplus Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Left: 6-Month Income vs Expense Bar Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Revenue vs. Expenditure Trend (6 Months)</h2>
              <p className="text-xs text-slate-500">Monthly fiscal cash inflow compared against expenditures</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> Income
              </span>
              <span className="flex items-center gap-1.5 text-rose-500">
                <span className="w-3 h-3 rounded-full bg-rose-500" /> Expense
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar dataKey="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Net Operating Surplus & Liquidity Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Current Month Net Margin</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                netSurplus >= 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {netSurplus >= 0 ? 'SURPLUS' : 'DEFICIT'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                NET OPERATING CASH FLOW
              </span>
              <div className={`text-2xl font-black ${netSurplus >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {fmt(netSurplus)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {netSurplus >= 0 ? 'Institutional income exceeds expenses this month.' : 'Current expenditures exceed cash inflow this month.'}
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Total Monthly Receipts:</span>
                <span className="font-bold text-emerald-600">{fmt(stats.monthIncome)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Total Monthly Outflow:</span>
                <span className="font-bold text-rose-600">{fmt(stats.monthExpense)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Liquid Reserves:</span>
                <span className="font-bold text-indigo-700">{fmt(stats.cashAndBank)}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex gap-2">
            <Link
              to="/accounts/bank-accounts"
              className="flex-1 py-2 text-center text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              View Banks
            </Link>
            <Link
              to="/accounts/income"
              className="flex-1 py-2 text-center text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all"
            >
              Income Ledger
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Vouchers Feed Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        
        <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> Recent Accounting Vouchers &amp; Day Book
            </h2>
            <p className="text-xs text-slate-500">Real-time ledger entries logged into school accounts</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/accounts/income"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View All</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">Voucher No</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Particulars</th>
                <th className="py-3 px-4">Category / Head</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4 text-center">Type</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    <span>Loading recent day book vouchers...</span>
                  </td>
                </tr>
              ) : recentVouchers.length > 0 ? (
                recentVouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                      {v.voucherNo}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {new Date(v.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {v.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {v.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {v.paymentMode}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        v.type === 'INCOME' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {v.type}
                      </span>
                    </td>
                    <td className={`py-3.5 px-4 text-right font-bold ${
                      v.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {v.type === 'INCOME' ? '+' : '-'}₹{(v.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-700">No vouchers recorded yet</p>
                    <p className="text-xs text-slate-400 mt-1">Record an income or expense voucher to populate this journal.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

export default AccountsDashboard;

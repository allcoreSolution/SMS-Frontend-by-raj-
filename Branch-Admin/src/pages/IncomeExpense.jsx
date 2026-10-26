import React, { useEffect, useState } from 'react';
import { 
  Filter, ChevronDown, Download, RotateCcw, TrendingDown, TrendingUp, 
  Scale, Building2, AlertTriangle, LineChart as LineChartIcon, Search, DollarSign 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Swal from 'sweetalert2';
import branchLocalDb from '../api/branchLocalDb';
import KpiCard from '../components/common/KpiCard';

const IncomeExpense = () => {
  const [branches, setBranches] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('All');
  const [dateFrom, setDateFrom] = useState('2026-04-01');
  const [dateTo, setDateTo] = useState('2027-03-31');
  const [activeTabHeads, setActiveTabHeads] = useState('Income');

  useEffect(() => {
    try {
      const data = branchLocalDb.getBranches();
      setBranches(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Compute school financial accounts
  const accounts = branches.map((b, i) => {
    const rawIncome = b.collectedRaw || 500000;
    const feeCol = rawIncome * 0.92;
    const otherInc = rawIncome * 0.08;
    const totalInc = rawIncome;
    const expense = rawIncome * 0.65;
    const net = totalInc - expense;

    return {
      id: `${i + 1}.`,
      school: b.name,
      code: b.code,
      feeColRaw: feeCol,
      otherIncRaw: otherInc,
      totalIncRaw: totalInc,
      expenseRaw: expense,
      netRaw: net,
      feeCol: feeCol.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
      otherInc: otherInc.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
      totalInc: totalInc.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
      expense: expense.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
      net: net.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
    };
  });

  const filteredAccounts = selectedSchool === 'All' 
    ? accounts 
    : accounts.filter(a => a.school.toLowerCase().includes(selectedSchool.toLowerCase()));

  // Aggregate metrics
  const totalIncome = filteredAccounts.reduce((sum, a) => sum + a.totalIncRaw, 0);
  const totalExpense = filteredAccounts.reduce((sum, a) => sum + a.expenseRaw, 0);
  const netSurplus = totalIncome - totalExpense;

  const chartData = [
    { name: 'Apr', income: Math.round(totalIncome * 0.08), expense: Math.round(totalExpense * 0.07) },
    { name: 'May', income: Math.round(totalIncome * 0.06), expense: Math.round(totalExpense * 0.07) },
    { name: 'Jun', income: Math.round(totalIncome * 0.12), expense: Math.round(totalExpense * 0.09) },
    { name: 'Jul', income: Math.round(totalIncome * 0.15), expense: Math.round(totalExpense * 0.10) },
    { name: 'Aug', income: Math.round(totalIncome * 0.10), expense: Math.round(totalExpense * 0.08) },
    { name: 'Sep', income: Math.round(totalIncome * 0.09), expense: Math.round(totalExpense * 0.08) },
    { name: 'Oct', income: Math.round(totalIncome * 0.07), expense: Math.round(totalExpense * 0.06) },
    { name: 'Nov', income: Math.round(totalIncome * 0.08), expense: Math.round(totalExpense * 0.08) },
    { name: 'Dec', income: Math.round(totalIncome * 0.05), expense: Math.round(totalExpense * 0.07) },
    { name: 'Jan', income: Math.round(totalIncome * 0.09), expense: Math.round(totalExpense * 0.09) },
    { name: 'Feb', income: Math.round(totalIncome * 0.06), expense: Math.round(totalExpense * 0.10) },
    { name: 'Mar', income: Math.round(totalIncome * 0.05), expense: Math.round(totalExpense * 0.11) },
  ];

  const handleExportCsv = () => {
    const headers = [
      { key: 'school', label: 'School Name' },
      { key: 'code', label: 'Campus Code' },
      { key: 'feeCol', label: 'Fee Collection (₹)' },
      { key: 'otherInc', label: 'Other Income (₹)' },
      { key: 'totalInc', label: 'Total Revenue (₹)' },
      { key: 'expense', label: 'Operating Expense (₹)' },
      { key: 'net', label: 'Net Operating Surplus (₹)' }
    ];
    const ok = branchLocalDb.exportToCsv('income_expense_financial_audit', headers, filteredAccounts);
    if (ok) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Financial report exported to CSV!',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleReset = () => {
    setSelectedSchool('All');
    setDateFrom('2026-04-01');
    setDateTo('2027-03-31');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-[#f4f7fa] min-h-[calc(100vh-70px)]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-600 mb-1">
            <Scale className="w-4 h-4" /> Multi-Campus P&L Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Income &amp; Expense Global Audit
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Consolidated revenue, operating costs, and net margins across all registered educational sites.
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

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-tight">
            <Filter className="w-4 h-4 text-orange-600" /> Accounting Period & Scope Filter
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
                  <option value="All">All Campuses Combined</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-[11px] text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Fiscal Period From</label>
              <input 
                type="date" 
                value={dateFrom} 
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Fiscal Period To</label>
              <input 
                type="date" 
                value={dateTo} 
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
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
               onClick={() => {
                 Swal.fire({
                   toast: true,
                   position: 'top-end',
                   icon: 'success',
                   title: 'Financial data calculated for scope!',
                   timer: 1500,
                   showConfirmButton: false
                 });
               }}
               className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md shadow-orange-500/20 transition-all hover:scale-[1.01]"
             >
               <Search className="w-4 h-4" /> Run Consolidated Audit
             </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid - Standardized h-[110px] */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard 
          title="Gross Revenue"
          value={`₹${(totalIncome / 100000).toFixed(2)}L`}
          subText="Fees & auxiliary receipts"
          icon={TrendingUp}
          glowColor="#0891b2"
          stroke="#0891b2"
          iconBg="linear-gradient(135deg, #06b6d4, #0891b2)"
          iconColor="#ffffff"
          spark={[30, 35, 42, 45, 50, 55, 60]}
          badge="Gross"
        />
        <KpiCard 
          title="Operating Expenses"
          value={`₹${(totalExpense / 100000).toFixed(2)}L`}
          subText="Salaries, utilities & supplies"
          icon={TrendingDown}
          glowColor="#ef4444"
          stroke="#ef4444"
          iconBg="linear-gradient(135deg, #f87171, #ef4444)"
          iconColor="#ffffff"
          spark={[22, 25, 28, 27, 30, 32, 34]}
          badge="Opex"
        />
        <KpiCard 
          title="Net Operating Surplus"
          value={`₹${(netSurplus / 100000).toFixed(2)}L`}
          subText="Positive net EBITDA margin"
          icon={Scale}
          glowColor="#10b981"
          stroke="#10b981"
          iconBg="linear-gradient(135deg, #34d399, #10b981)"
          iconColor="#ffffff"
          spark={[8, 10, 14, 18, 20, 23, 26]}
          badge="EBITDA"
        />
        <KpiCard 
          title="Campuses Audited"
          value={String(filteredAccounts.length)}
          subText="Active ledger branches"
          isLive={true}
          icon={Building2}
          glowColor="#8b5cf6"
          stroke="#8b5cf6"
          iconBg="linear-gradient(135deg, #a78bfa, #8b5cf6)"
          iconColor="#ffffff"
          spark={[2, 3, 3, 4, 4, 4, 4]}
          badge="Reconciled"
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0b1329] uppercase tracking-tight">
            <LineChartIcon className="w-4 h-4 text-teal-600" /> Income vs Expense Trajectory (FY 2026–27)
          </div>
          <div className="flex gap-3 text-xs font-bold">
            <button 
              onClick={() => setActiveTabHeads('Income')}
              className={`px-3 py-1 rounded-md transition-colors ${activeTabHeads === 'Income' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-gray-500'}`}
            >
              Revenue Line
            </button>
            <button 
              onClick={() => setActiveTabHeads('Expense')}
              className={`px-3 py-1 rounded-md transition-colors ${activeTabHeads === 'Expense' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'text-gray-500'}`}
            >
              Cost Line
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11}} dy={10} />
                <YAxis hide={true} />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, '']} />
                <Line type="monotone" dataKey="income" stroke="#17a2b8" strokeWidth={3} dot={{r: 4, fill: '#17a2b8', strokeWidth: 2, stroke: '#fff'}} />
                <Line type="monotone" dataKey="expense" stroke="#dc3545" strokeWidth={3} dot={{r: 4, fill: '#dc3545', strokeWidth: 2, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-8 mt-2 text-xs font-bold text-gray-600">
             <div className="flex items-center gap-2">
               <div className="w-4 h-2 bg-[#17a2b8] rounded-full"></div> Total Revenue Inflows
             </div>
             <div className="flex items-center gap-2">
               <div className="w-4 h-2 bg-[#dc3545] rounded-full"></div> Operational Outflows
             </div>
          </div>
        </div>
      </div>

      {/* Account Summary Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="text-sm font-bold text-[#0b1329] uppercase tracking-tight flex items-center gap-2">
            <Building2 className="w-4 h-4 text-orange-600" /> Campus Ledger Breakdown
          </div>
          <span className="text-xs font-medium text-gray-500">
            Currency: INR (₹)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0b1329] text-white">
              <tr className="text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-3.5 text-center">#</th>
                <th className="py-3 px-3.5">Campus Name</th>
                <th className="py-3 px-3.5 text-right">Fee Collections</th>
                <th className="py-3 px-3.5 text-right">Other Receipts</th>
                <th className="py-3 px-3.5 text-right">Total Revenue</th>
                <th className="py-3 px-3.5 text-right">Operating Opex</th>
                <th className="py-3 px-3.5 text-right">Net Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[13px]">
              {filteredAccounts.map((row, i) => (
                <tr key={i} className="hover:bg-teal-50/20 transition-colors">
                  <td className="py-3.5 px-3.5 text-center text-gray-400 font-mono text-xs">{row.id}</td>
                  <td className="py-3.5 px-3.5 font-bold text-gray-900 text-xs">
                    {row.school}
                    <div className="text-[10px] text-gray-400 font-mono">{row.code}</div>
                  </td>
                  <td className="py-3.5 px-3.5 text-right font-medium text-gray-700">₹{row.feeCol}</td>
                  <td className="py-3.5 px-3.5 text-right font-medium text-gray-500">₹{row.otherInc}</td>
                  <td className="py-3.5 px-3.5 text-right font-bold text-teal-800">₹{row.totalInc}</td>
                  <td className="py-3.5 px-3.5 text-right font-medium text-rose-600">₹{row.expense}</td>
                  <td className="py-3.5 px-3.5 text-right font-black text-emerald-600 text-sm">
                    ₹{row.net}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IncomeExpense;

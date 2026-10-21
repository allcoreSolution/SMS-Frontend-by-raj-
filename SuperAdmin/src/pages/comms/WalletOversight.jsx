import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingDown, RefreshCcw, DollarSign, Activity, PieChart, MoreHorizontal, Tag, X, CheckCircle, Plus, Minus } from 'lucide-react';

const initSchools = [
  { id: 1, name: 'Risma high school', balance: 0.00, credited: 200.00, spent: 0.00, refunded: 0.00, lastActivity: '08 Jun 2026, 13:52', wa: true, sms: true },
  { id: 2, name: 'Silver Academy', balance: 0.00, credited: 0.00, spent: 0.00, refunded: 0.00, lastActivity: '—', wa: true, sms: true },
  { id: 3, name: 'APNA COLLEGE 2', balance: 0.00, credited: 0.00, spent: 0.00, refunded: 0.00, lastActivity: '—', wa: true, sms: true },
  { id: 4, name: 'SSVP 2.0', balance: 0.00, credited: 0.00, spent: 0.00, refunded: 0.00, lastActivity: '—', wa: true, sms: true },
  { id: 5, name: 'Beer School', balance: 0.00, credited: 0.00, spent: 0.00, refunded: 0.00, lastActivity: '—', wa: true, sms: true },
  { id: 6, name: 'Alif Academy', balance: 0.00, credited: 0.00, spent: 0.00, refunded: 0.00, lastActivity: '—', wa: true, sms: true },
  { id: 7, name: 'Success point', balance: 0.00, credited: 0.00, spent: 0.00, refunded: 0.00, lastActivity: '—', wa: true, sms: true },
];

export default function WalletOversight() {
  const [schools, setSchools] = useState(initSchools);
  const [adjustMenuOpen, setAdjustMenuOpen] = useState(null);
  const [adjustModal, setAdjustModal] = useState(null);
  const [adjustType, setAdjustType] = useState('credit');
  const [amount, setAmount] = useState('');
  const [toast, setToast] = useState(null);

  const openModal = (school, type) => {
    setAdjustType(type);
    setAmount('');
    setAdjustModal(school);
  };
  const navigate = useNavigate();

  const { totalSold, totalConsumed, totalBalance } = useMemo(() => {
    return schools.reduce((acc, curr) => {
      acc.totalSold += curr.credited;
      acc.totalConsumed += curr.spent;
      acc.totalBalance += curr.balance;
      return acc;
    }, { totalSold: 21100, totalConsumed: 0, totalBalance: 21100 });
  }, [schools]);

  const stats = [
    { label: 'SOLD (CREDITED)', value: `₹${(totalSold + 200).toLocaleString('en-IN', {minimumFractionDigits: 2})}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100' },
    { label: 'CONSUMED', value: `₹${totalConsumed.toLocaleString('en-IN', {minimumFractionDigits: 2})}`, icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-50/50', border: 'border-red-100' },
    { label: 'REFUNDED', value: '₹0.00', icon: RefreshCcw, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' },
    { label: 'LIABILITY (BALANCES)', value: `₹${totalBalance.toLocaleString('en-IN', {minimumFractionDigits: 2})}`, icon: Wallet, color: 'text-orange-500', bg: 'bg-orange-50/50', border: 'border-orange-100' },
    { label: 'EST. WHOLESALE COST', value: '₹0.00', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-50/50', border: 'border-purple-100' },
    { label: 'EST. MARGIN', value: '₹0.00', icon: PieChart, color: 'text-emerald-500', bg: 'bg-emerald-50/50', border: 'border-emerald-100' },
  ];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    const amt = Number(amount);
    if (!amt || amt <= 0 || !adjustModal) return;

    setSchools(prev => prev.map(s => {
      if (s.id === adjustModal.id) {
        return {
          ...s,
          balance: adjustType === 'credit' ? s.balance + amt : Math.max(0, s.balance - amt),
          credited: adjustType === 'credit' ? s.credited + amt : s.credited,
          spent: adjustType === 'debit' ? s.spent + amt : s.spent,
          lastActivity: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };
      }
      return s;
    }));

    showToast(`₹${amt} successfully ${adjustType === 'credit' ? 'credited to' : 'deducted from'} ${adjustModal.name}`);
    setAdjustModal(null);
    setAmount('');
  };

  return (
    <div className="p-4 sm:p-6 mb-8 w-full bg-[#f8f9fa] min-h-screen" onClick={() => setAdjustMenuOpen(null)}>
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-none text-sm font-semibold shadow-sm bg-gray-900 text-white border border-gray-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-4 h-4 text-green-400" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-800 tracking-tight">Communication Wallet Oversight</h1>
          <p className="text-[13px] text-gray-500 mt-1">Platform-wide WA/SMS wallet reconciliation</p>
        </div>
        <button onClick={() => navigate('/comms/rate-cards')} className="flex items-center gap-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-none shadow-sm text-sm font-medium transition-all">
          <Tag className="w-4 h-4 text-gray-500" /> Rate Cards
        </button>
      </div>

      {/* Modern Grid Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-none border border-gray-200 p-4 shadow-sm flex items-center justify-between xl:block transition-all hover:border-gray-300">
            <div className={`w-9 h-9 rounded-none flex items-center justify-center shrink-0 xl:mb-3 border ${stat.bg} ${stat.border}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="text-right xl:text-left">
              <p className="text-[17px] font-bold text-gray-900 tracking-tight">{stat.value}</p>
              <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Classic Excel-like Table Section */}
      <div className="bg-white rounded-none border border-gray-200 shadow-sm flex flex-col">
        <div className="px-4 py-3 flex items-center gap-2 bg-[#fdfdfd] border-b border-gray-200">
          <Wallet className="w-4 h-4 text-[#554bb9]" />
          <h3 className="font-semibold text-gray-800 text-[13px] uppercase tracking-wide">School Wallets</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] text-left border-collapse">
            <thead>
              <tr className="bg-[#f5f6fa]">
                <th className="px-4 py-3 border border-gray-200 text-[#554bb9] font-bold uppercase tracking-wider w-[20%]">School</th>
                <th className="px-4 py-3 border border-gray-200 text-[#554bb9] font-bold uppercase tracking-wider text-right">Balance</th>
                <th className="px-4 py-3 border border-gray-200 text-[#554bb9] font-bold uppercase tracking-wider text-center bg-[#f0f1fa]">Platform WA / SMS</th>
                <th className="px-4 py-3 border border-gray-200 text-[#554bb9] font-bold uppercase tracking-wider text-right">Credited</th>
                <th className="px-4 py-3 border border-gray-200 text-[#554bb9] font-bold uppercase tracking-wider text-right">Spent</th>
                <th className="px-4 py-3 border border-gray-200 text-[#554bb9] font-bold uppercase tracking-wider text-right">Refunded</th>
                <th className="px-4 py-3 border border-gray-200 text-[#554bb9] font-bold uppercase tracking-wider">Last Activity</th>
                <th className="px-4 py-3 border border-gray-200 text-[#554bb9] font-bold uppercase tracking-wider text-center w-[8%]">Adjust</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((school) => (
                <tr key={school.id} className="hover:bg-[#fcfdff] transition-colors">
                  <td className="px-4 py-2.5 border border-gray-200 text-gray-700 font-medium">{school.name}</td>
                  <td className="px-4 py-2.5 border border-gray-200 text-gray-900 font-bold text-right text-[13.5px]">
                    ₹{school.balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                  </td>
                  <td className="px-4 py-2.5 border border-gray-200 text-center bg-gray-50/30">
                    <div className="flex items-center justify-center gap-2">
                       {school.wa && <span className="text-teal-600 font-semibold text-[11px] tracking-wide">WA</span>}
                       {school.sms && <span className="text-emerald-700 font-semibold text-[11px] tracking-wide bg-emerald-50 px-1.5 py-0.5 rounded-none">SMS</span>}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 border border-gray-200 text-teal-700 font-medium text-right text-[13.5px]">
                    ₹{school.credited.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                  </td>
                  <td className="px-4 py-2.5 border border-gray-200 text-red-600 font-medium text-right text-[13.5px]">
                    ₹{school.spent.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                  </td>
                  <td className="px-4 py-2.5 border border-gray-200 text-gray-500 font-medium text-right text-[13.5px]">
                    ₹{school.refunded.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                  </td>
                  <td className="px-4 py-2.5 border border-gray-200 text-gray-500 text-[12px]">{school.lastActivity}</td>
                  <td className="px-4 py-2.5 border border-gray-200 text-center relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setAdjustMenuOpen(adjustMenuOpen === school.id ? null : school.id); }}
                      className="p-1 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-none transition-colors focus:outline-none"
                    >
                      <MoreHorizontal className="w-5 h-5 mx-auto" />
                    </button>

                    {/* Action Dropdown Menu */}
                    {adjustMenuOpen === school.id && (
                      <div className="absolute right-10 top-8 bg-white border border-gray-200 shadow-sm w-44 z-20 overflow-hidden text-left" onClick={e => e.stopPropagation()}>
                        <button onClick={() => {openModal(school, 'credit'); setAdjustMenuOpen(null); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-green-700 flex items-center gap-2 transition-colors border-b border-gray-100">
                          <Plus className="w-3.5 h-3.5" /> Credit Wallet
                        </button>
                        <button onClick={() => {openModal(school, 'debit'); setAdjustMenuOpen(null); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-red-700 flex items-center gap-2 transition-colors">
                          <Minus className="w-3.5 h-3.5" /> Deduct (Spent)
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Classic Minimalist Adjust Modal */}
      {adjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/20 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 shadow-lg w-full max-w-sm rounded-none" onClick={e => e.stopPropagation()}>
            <div className={`p-4 border-b border-gray-200 flex items-center justify-between ${adjustType === 'credit' ? 'bg-[#f8f9fa]' : 'bg-[#fff5f5]'}`}>
              <div>
                <h3 className={`text-sm font-bold uppercase tracking-wide ${adjustType === 'credit' ? 'text-gray-800' : 'text-red-800'}`}>
                  {adjustType === 'credit' ? 'Credit Wallet Balance' : 'Deduct Wallet Balance'}
                </h3>
              </div>
              <button onClick={() => setAdjustModal(null)} className="p-1 hover:bg-white rounded-none text-gray-500 hover:text-gray-800 transition-colors border border-transparent hover:border-gray-200 shadow-sm">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAdjustSubmit} className="p-5">
              <div className="mb-4 flex flex-col items-center">
                 <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Target Account</p>
                 <p className="text-lg font-bold text-gray-800">{adjustModal.name}</p>
              </div>

              <div className="flex items-center justify-between mb-5 border-y border-dashed border-gray-200 py-3">
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Current Balance</span>
                <span className="font-bold text-gray-900">₹{adjustModal.balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Amount (<span className={adjustType === 'credit' ? 'text-green-600' : 'text-red-600'}>₹</span>)
                </label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-none px-3 py-2 text-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all font-medium"
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setAdjustModal(null)} 
                  className="w-1/2 py-2 border border-gray-300 bg-white text-gray-700 font-semibold text-[13px] rounded-none hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!amount || Number(amount) <= 0}
                  className={`w-1/2 py-2 border font-bold text-[13px] rounded-none shadow-sm transition-all disabled:opacity-50
                    ${adjustType === 'credit' ? 'bg-white border-green-600 text-green-700 hover:bg-green-50' : 'bg-white border-red-600 text-red-700 hover:bg-red-50'}
                  `}
                >
                  Confirm Process
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

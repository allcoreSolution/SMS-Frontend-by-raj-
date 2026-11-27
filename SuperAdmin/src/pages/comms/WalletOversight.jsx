import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, TrendingDown, RefreshCcw, DollarSign, Activity, PieChart, 
  MoreHorizontal, Tag, X, CheckCircle, Plus, Minus, Building2, MessageSquare, 
  Search, ShieldCheck, Zap, Sparkles, Send
} from 'lucide-react';
import Swal from 'sweetalert2';
import { tenantService } from '../../api/tenantService';
import { toArray } from '../../utils/helpers';

export default function WalletOversight() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [rechargeModal, setRechargeModal] = useState(null);
  const [smsAdd, setSmsAdd] = useState('1000');
  const [waAdd, setWaAdd] = useState('1000');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const res = await tenantService.getTenants();
      const rawList = toArray(res);
      const mapped = rawList.map((t, i) => {
        const idNum = t.schoolCode?.replace(/\D/g, '') || String(i + 1);
        return {
          id: t._id,
          numericId: `#${idNum}`,
          schoolCode: t.schoolCode || `SCH-${String(t._id).slice(-4).toUpperCase()}`,
          name: t.schoolName || 'Campus Institution',
          email: t.email || 'admin@school.com',
          phone: t.phone || 'N/A',
          plan: t.plan || 'Trial',
          status: t.status || 'Active',
          smsQuota: Number(t.smsQuota) || 2500,
          whatsappQuota: Number(t.whatsappQuota) || 5000,
          emailQuota: Number(t.emailQuota) || 10000,
          lastActivity: t.updatedAt ? new Date(t.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today'
        };
      });
      setSchools(mapped);
    } catch (err) {
      console.warn('Failed to load real tenant wallets:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchools = useMemo(() => {
    return schools.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.schoolCode.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [schools, search]);

  const { totalSms, totalWa, totalInstitutions } = useMemo(() => {
    return schools.reduce((acc, curr) => {
      acc.totalSms += curr.smsQuota;
      acc.totalWa += curr.whatsappQuota;
      return acc;
    }, { totalSms: 0, totalWa: 0, totalInstitutions: schools.length });
  }, [schools]);

  const stats = [
    { label: 'TOTAL INSTITUTIONS', value: totalInstitutions, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'ACTIVE SMS QUOTA', value: totalSms.toLocaleString('en-IN'), icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'ACTIVE WHATSAPP QUOTA', value: totalWa.toLocaleString('en-IN'), icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'LIVE GATEWAYS', value: 'DLT + Meta Cloud', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  ];

  const handleRechargeSubmit = async (e) => {
    e.preventDefault();
    if (!rechargeModal) return;

    try {
      setIsSubmitting(true);
      const res = await tenantService.rechargeWallet(
        rechargeModal.id, 
        Number(smsAdd) || 0, 
        Number(waAdd) || 0
      );

      Swal.fire({
        icon: 'success',
        title: 'Wallet Recharged!',
        text: `Successfully added ${smsAdd} SMS and ${waAdd} WhatsApp credits to ${rechargeModal.name}.`,
        timer: 2500,
        showConfirmButton: false
      });

      setRechargeModal(null);
      setSmsAdd('1000');
      setWaAdd('1000');
      fetchWallets();
    } catch (err) {
      Swal.fire('Recharge Failed', err.response?.data?.message || err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 mb-8 w-full bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-sm">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Communication Wallet Oversight</h1>
              <p className="text-xs text-slate-500 font-medium">Real-time school WhatsApp &amp; SMS quota balances and instant recharge</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/comms/rate-cards')} 
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-3.5 py-2 rounded-xl shadow-xs text-xs font-bold transition-all cursor-pointer"
          >
            <Tag className="w-4 h-4 text-slate-500" /> Rate Cards
          </button>
          <button 
            onClick={fetchWallets} 
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-3.5 py-2 rounded-xl shadow-xs text-xs font-bold transition-all cursor-pointer"
          >
            <RefreshCcw className="w-4 h-4 text-slate-500" /> Refresh
          </button>
        </div>
      </div>

      {/* Modern Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${stat.bg} ${stat.border}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Search & Actions Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs mb-6 p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search school name, code or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Real School Wallets Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 flex items-center justify-between bg-slate-50/50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wide">Live School Quota Ledgers</h3>
          </div>
          <span className="text-xs font-bold text-slate-400">{filteredSchools.length} Schools Enrolled</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3.5">School / Tenant</th>
                <th className="px-4 py-3.5">Plan</th>
                <th className="px-4 py-3.5 text-right">SMS Quota</th>
                <th className="px-4 py-3.5 text-right">WhatsApp Quota</th>
                <th className="px-4 py-3.5 text-center">Channels</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400 font-semibold">
                    <RefreshCcw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                    Loading Live School Wallets...
                  </td>
                </tr>
              ) : filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400 font-semibold">
                    No school records found.
                  </td>
                </tr>
              ) : (
                filteredSchools.map((school) => (
                  <tr key={school.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{school.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-semibold">{school.schoolCode}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">{school.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {school.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-black text-emerald-700 font-mono text-[13px]">
                        {school.smsQuota.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">credits</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-black text-teal-700 font-mono text-[13px]">
                        {school.whatsappQuota.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">credits</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded">WA</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded">SMS</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        school.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {school.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setRechargeModal(school)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Recharge</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Wallet Recharge Modal */}
      {rechargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Recharge Communication Quota</h3>
                  <p className="text-[11px] text-slate-500 font-medium">{rechargeModal.name} ({rechargeModal.schoolCode})</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setRechargeModal(null)} 
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleRechargeSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Current SMS</span>
                  <span className="font-black text-slate-900 text-sm">{rechargeModal.smsQuota.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Current WhatsApp</span>
                  <span className="font-black text-slate-900 text-sm">{rechargeModal.whatsappQuota.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Add SMS Credits
                </label>
                <input 
                  type="number" 
                  value={smsAdd} 
                  onChange={(e) => setSmsAdd(e.target.value)}
                  placeholder="e.g. 1000"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Add WhatsApp Credits
                </label>
                <input 
                  type="number" 
                  value={waAdd} 
                  onChange={(e) => setWaAdd(e.target.value)}
                  placeholder="e.g. 1000"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                  min="0"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button 
                  type="button" 
                  onClick={() => setRechargeModal(null)} 
                  className="w-1/2 py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || (!Number(smsAdd) && !Number(waAdd))}
                  className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Recharge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

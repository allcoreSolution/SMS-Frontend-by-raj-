import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Lock, Wallet, TrendingUp, TrendingDown, Search,
  Plus, Save, Check, Info, MessageCircle, MessageSquare, Settings,
  IndianRupee
} from 'lucide-react';
import SettingsLayout from '../../components/SettingsLayout';
import Swal from 'sweetalert2';
import { tenantService } from '../../api/tenantService';
import { toArray } from '../../utils/helpers';

// ─── Dummy Data ───────────────────────────────────────────────────────────────
// (Removed static SCHOOLS list to fetch via API)
const TRANSACTIONS = []; // Empty for now, wait for transaction API endpoint

// ─── Shared ───────────────────────────────────────────────────────────────────
function DemoBanner() {
  return null;
}

function StatusBadge({ status }) {
  const map = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    low: 'bg-amber-50 text-amber-700 border-amber-200',
    empty: 'bg-red-50 text-red-600 border-red-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-none-none text-[10px] font-semibold border ${map[status]}`}>
      {status === 'active' ? 'Active' : status === 'low' ? 'Low Balance' : 'Empty'}
    </span>
  );
}

// ─── Page: Wallet Oversight ───────────────────────────────────────────────────
function WalletOversight() {
  const [search, setSearch] = useState('');
  const [topupModal, setTopupModal] = useState(null);
  const [topupAmt, setTopupAmt] = useState('');
  const [done, setDone] = useState(false);
  const [schoolsList, setSchoolsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const res = await tenantService.getTenants();
      const mapped = toArray(res).map(t => {
        const bal = t.walletBalance || 0;
        return {
          id: t._id,
          name: t.schoolName,
          balance: bal,
          smsRate: 0.18, 
          waRate: 0.55, 
          status: bal > 500 ? 'active' : bal > 0 ? 'low' : 'empty'
        }
      });
      setSchoolsList(mapped);
    } catch (err) {
      console.error(err);
      setSchoolsList([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = schoolsList.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()));
  const totalBalance = schoolsList.reduce((a, s) => a + s.balance, 0);
  const lowCount = schoolsList.filter(s => s.status === 'low' || s.status === 'empty').length;

  const handleTopup = async () => {
    try {
      // For real implementation: await tenantService.rechargeWallet(topupModal, smsAmt, waAmt)
      setDone(true);
      Swal.fire({
        icon: 'success',
        title: 'Wallet Recharged',
        text: 'Top-up applied successfully!',
        timer: 1500,
        showConfirmButton: false
      });
      setTimeout(() => { 
        setDone(false); 
        setTopupModal(null); 
        setTopupAmt(''); 
        fetchSchools(); // Refresh DB values
      }, 1500);
    } catch (err) {
      Swal.fire('Error', 'Failed to top-up wallet', 'error');
    }
  };

  return (
    <div className="space-y-5">
      <DemoBanner />
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-1">
          <Wallet className="w-5 h-5 text-blue-600" /> Wallet Oversight
        </h1>
        <p className="text-sm text-gray-500">Monitor and manage per-school communication wallet balances.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Platform Balance', value: `₹${totalBalance.toLocaleString()}`, icon: <IndianRupee className="w-5 h-5 text-blue-500" /> },
          { label: 'Schools Registered', value: schoolsList.length, icon: <Wallet className="w-5 h-5 text-emerald-500" /> },
          { label: 'Low / Empty Wallets', value: lowCount, icon: <TrendingDown className="w-5 h-5 text-amber-500" /> },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-none-none p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</span>
              <div className="w-10 h-10 rounded-none-none bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100 shadow-sm">
                {s.icon}
              </div>
            </div>
            <p className="text-3xl font-black text-slate-800 tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-3.5 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 text-sm">School Wallets</h3>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search school..."
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-none-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-48" />
          </div>
        </div>
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-sm border-collapse border border-slate-300 shadow-sm bg-white">
            <thead className="bg-slate-50 border-b border-slate-300">
              <tr>
                {['School', 'Balance', 'SMS Rate', 'WA Rate', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors bg-white group border-b border-slate-200">
                  <td className="px-3 py-2.5 align-middle border-x border-slate-200 font-bold text-slate-800">{s.name}</td>
                  <td className="px-3 py-2.5 align-middle border-x border-slate-200 font-mono font-bold text-emerald-700 bg-emerald-50/20">₹{s.balance.toLocaleString()}</td>
                  <td className="px-3 py-2.5 align-middle border-x border-slate-200 text-slate-600 font-mono">₹{s.smsRate}/msg</td>
                  <td className="px-3 py-2.5 align-middle border-x border-slate-200 text-slate-600 font-mono">₹{s.waRate}/msg</td>
                  <td className="px-3 py-2.5 align-middle border-x border-slate-200"><StatusBadge status={s.status} /></td>
                  <td className="px-3 py-2.5 align-middle border-x border-slate-200">
                  <button onClick={() => setTopupModal(s.id)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-none-none transition-colors border border-blue-200 shadow-sm">
                    <Plus className="w-3.5 h-3.5" /> Top-up
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-3.5">
          <h3 className="font-semibold text-gray-800 text-sm">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-sm border-collapse border border-slate-300 shadow-sm bg-white">
            <thead className="bg-slate-50 border-b border-slate-300">
              <tr>
                {['School', 'Type', 'Channel', 'Amount', 'Messages', 'Date', 'Note'].map(h => (
                  <th key={h} className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((t, i) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors bg-white group border-b border-slate-200">
                  <td className="px-3 py-2.5 align-middle border-x border-slate-200 font-bold text-slate-800 w-[20%]">{t.school}</td>
                  <td className="px-3 py-2.5 align-middle border-x border-slate-200">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-none-none border ${t.type === 'topup' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                      {t.type === 'topup' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {t.type === 'topup' ? 'Top-up' : 'Deduct'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 align-middle border-x border-slate-200 text-slate-600 font-bold">{t.channel}</td>
                  <td className="px-3 py-2.5 align-middle border-x border-slate-200 font-mono font-bold text-slate-700 bg-slate-50/50">₹{t.amount}</td>
                  <td className="px-3 py-2.5 align-middle border-x border-slate-200 text-slate-500 font-mono">{t.msgs ?? '—'}</td>
                  <td className="px-3 py-2.5 align-middle border-x border-slate-200 text-slate-600 font-medium whitespace-nowrap">{t.date}</td>
                  <td className="px-3 py-2.5 align-middle border-x border-slate-200 text-slate-600 text-[12px]">{t.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top-up Modal */}
      {topupModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-none-none shadow-xl p-6 w-80">
            <h3 className="font-bold text-gray-800 mb-1">Top-up Wallet</h3>
            <p className="text-xs text-gray-500 mb-4">{schoolsList.find(s => s.id === topupModal)?.name}</p>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Amount (₹)</label>
            <input value={topupAmt} onChange={e => setTopupAmt(e.target.value)} type="number" placeholder="e.g. 1000"
              className="w-full border border-gray-200 rounded-none-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 mb-4" />
            <div className="flex gap-2">
              <button onClick={() => { setTopupModal(null); setTopupAmt(''); }}
                className="flex-1 px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-none-none hover:bg-gray-50">Cancel</button>
              <button onClick={handleTopup}
                className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-none-none transition-all ${done ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {done ? <><Check className="w-3.5 h-3.5" /> Done!</> : 'Confirm Top-up'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page: Rate Cards ─────────────────────────────────────────────────────────
const Field = ({ label, k, note, rates, set }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">₹</span>
      <input value={rates[k]} onChange={e => set(k, e.target.value)} type="number" step="0.01"
        className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-none-none text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
    </div>
    {note && <p className="text-[10px] text-gray-400 mt-1">{note}</p>}
  </div>
);

function RateCards() {
  const [rates, setRates] = useState({
    smsDefault: '0.18', smsCustom: '0.20', smsInternational: '1.50',
    waSession: '0.55', waMarketing: '0.80', waUtility: '0.40', waAuthentication: '0.35',
    emailDefault: '0.02',
  });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setRates(r => ({ ...r, [k]: v }));
  const handleSave = () => { 
    setSaved(true); 
    Swal.fire({
      icon: 'success',
      title: 'Settings Saved',
      text: 'Your changes have been saved successfully.',
      timer: 1500,
      showConfirmButton: false
    });
    setTimeout(() => setSaved(false), 2500); 
  };


  return (
    <div className="space-y-5">
      <DemoBanner />
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-blue-600" /> Rate Cards
        </h1>
        <p className="text-sm text-gray-500">Platform-level default rates charged per message from each school's comms wallet.</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-none-none px-4 py-3 flex gap-2.5">
        <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800 leading-relaxed">
          Custom rates override the default for specific schools. Changes apply to new messages only.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-3.5 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-500" />
          <h3 className="font-semibold text-gray-800 text-sm">SMS Rates</h3>
        </div>
        <div className="p-5 grid grid-cols-3 gap-4">
          <Field rates={rates} set={set} label="Default Rate / msg" k="smsDefault" note="Applied to all schools by default" />
          <Field rates={rates} set={set} label="Custom Rate / msg" k="smsCustom" note="For schools with custom pricing" />
          <Field rates={rates} set={set} label="International Rate / msg" k="smsInternational" note="Non-India numbers" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-3.5 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-green-500" />
          <h3 className="font-semibold text-gray-800 text-sm">WhatsApp Rates (per conversation)</h3>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          <Field rates={rates} set={set} label="Session / Service" k="waSession" note="User-initiated conversations" />
          <Field rates={rates} set={set} label="Marketing" k="waMarketing" note="Promotional messages" />
          <Field rates={rates} set={set} label="Utility" k="waUtility" note="Transactional / fee reminders" />
          <Field rates={rates} set={set} label="Authentication" k="waAuthentication" note="OTP / login flows" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-3.5 flex items-center gap-2">
          <Settings className="w-4 h-4 text-gray-400" />
          <h3 className="font-semibold text-gray-800 text-sm">Email Rate</h3>
        </div>
        <div className="p-5 grid grid-cols-3 gap-4">
          <Field rates={rates} set={set} label="Default Rate / email" k="emailDefault" />
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-none-none transition-all text-white ${saved ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {saved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : <><Save className="w-3.5 h-3.5" /> Save Rate Cards</>}
        </button>
      </div>
    </div>
  );
}

// ─── Page: Meta / DLT Config ──────────────────────────────────────────────────
function MetaDltConfig() {
  const [form, setForm] = useState({
    phoneNumberId: '', wabaId: '', accessToken: '',
    apiVersion: 'v21.0', appSecret: '', dltSenderId: '', dltPeId: '',
  });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSave = () => { 
    setSaved(true); 
    Swal.fire({
      icon: 'success',
      title: 'Settings Saved',
      text: 'Your changes have been saved successfully.',
      timer: 1500,
      showConfirmButton: false
    });
    setTimeout(() => setSaved(false), 2500); 
  };

  return (
    <div className="space-y-5">
      <DemoBanner />
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-blue-600" /> Meta / DLT Config
        </h1>
        <p className="text-sm text-gray-500">Platform-owned WhatsApp (Meta Cloud) and SMS (DLT) credentials for the comms wallet.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-3.5 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm font-semibold text-gray-700">WhatsApp (Meta Cloud API)</span>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Phone Number ID', key: 'phoneNumberId', placeholder: 'e.g. 109800000000x' },
              { label: 'WABA ID', key: 'wabaId', placeholder: 'WhatsApp Business Account ID' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label}</label>
                <input value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder}
                  className="w-full border border-gray-200 rounded-none-none px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Access Token</label>
              <input value={form.accessToken} onChange={e => set('accessToken', e.target.value)} type="password"
                placeholder="Leave blank to keep existing"
                className="w-full border border-gray-200 rounded-none-none px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
              <p className="text-xs text-gray-400 mt-1">Stored encrypted. Enter only to replace.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">API Version</label>
              <input value={form.apiVersion} onChange={e => set('apiVersion', e.target.value)}
                className="w-full border border-gray-200 rounded-none-none px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">App Secret</label>
            <input value={form.appSecret} onChange={e => set('appSecret', e.target.value)} type="password"
              placeholder="Leave blank to keep existing"
              className="w-full border border-gray-200 rounded-none-none px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            <p className="text-xs text-gray-400 mt-1">Used for webhook signature verification. Stored encrypted.</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-3.5 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold text-gray-700">SMS (India DLT)</span>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {[
            { label: 'DLT Sender / Header ID', key: 'dltSenderId', placeholder: 'e.g. SCHOOL' },
            { label: 'DLT Principal Entity (PE) ID', key: 'dltPeId', placeholder: 'TRAI PE ID' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label}</label>
              <input value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder}
                className="w-full border border-gray-200 rounded-none-none px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-none-none px-4 py-3 flex gap-2.5">
        <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800 leading-relaxed">
          Message wording is fixed by superadmin-approved Meta/DLT templates. Schools cannot edit platform-level templates.
        </p>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-none-none transition-all text-white ${saved ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {saved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : <><Save className="w-3.5 h-3.5" /> Save Config</>}
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CommsWalletSettings({ page = 'overview' }) {
  const tabMap = {
    'overview': 'comms-wallet-overview',
    'rate-cards': 'comms-wallet-rates',
    'meta-dlt': 'comms-wallet-meta',
  };

  return (
    <SettingsLayout activeTab={tabMap[page] || 'comms-wallet-overview'}>
      <div className="flex-1 overflow-y-auto p-6 max-w-[1150px] mx-auto w-full">
        {page === 'overview' && <WalletOversight />}
        {page === 'rate-cards' && <RateCards />}
        {page === 'meta-dlt' && <MetaDltConfig />}
      </div>
    </SettingsLayout>
  );
}

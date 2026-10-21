import React, { useState, useEffect } from 'react';
import { Wallet, Plus, MessageSquare, Phone, Mail, Download, X, CheckCircle } from 'lucide-react';
import { tenantService } from '../api/tenantService';
import { toArray } from '../utils/helpers';

const initTransactions = [
  { id: 1, type: 'SMS', school: 'Montessori School', count: 500, cost: 99, date: 'Sep 01, 2024', balance: 1200 },
  { id: 2, type: 'Email', school: 'SSVP School', count: 1000, cost: 49, date: 'Aug 31, 2024', balance: 1151 },
  { id: 3, type: 'WhatsApp', school: 'Green Valley', count: 200, cost: 79, date: 'Aug 30, 2024', balance: 1072 },
  { id: 4, type: 'SMS', school: 'Oxford International', count: 1000, cost: 199, date: 'Aug 29, 2024', balance: 873 },
  { id: 5, type: 'Recharge', school: '—', count: 0, cost: -2000, date: 'Aug 28, 2024', balance: 2873 },
];

export default function CommsWallet() {
  const [transactions, setTransactions] = useState(initTransactions);
  const [showRecharge, setShowRecharge] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schoolsList, setSchoolsList] = useState([]);
  const [toast, setToast] = useState(null);
  const [balance, setBalance] = useState(873);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    tenantService.getTenants().then(res => {
      setSchoolsList(toArray(res));
    }).catch(console.error);
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRecharge = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0 || !selectedSchool) {
        showToast("Please enter a valid amount and select a school", "error");
        return;
    }
    const amt = Number(amount);
    
    try {
      setLoading(true);
      // Let's assume 1 Rs = 1 SMS logic for this simple mock integration
      await tenantService.rechargeWallet(selectedSchool, amt, 0); 
      
      const targetSchoolName = schoolsList.find(s => s._id === selectedSchool)?.schoolName || selectedSchool;

      const newBalance = balance - amt; // Superadmin pool decreases, school quota increases
      const newTxn = {
        id: Date.now(), type: 'Recharge', school: targetSchoolName, count: amt, cost: -amt,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        balance: newBalance,
      };
      setTransactions(prev => [newTxn, ...prev]);
      setBalance(newBalance);
      setShowRecharge(false);
      setAmount('');
      setSelectedSchool('');
      showToast(`Allocated ${amt.toLocaleString()} SMS credits to ${targetSchoolName}!`);
    } catch (err) {
      showToast(err.response?.data?.message || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-none shadow-lg text-white text-sm font-semibold transition-all ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          <CheckCircle className="w-4 h-4" /> {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Comms Wallet</h1>
          <p className="text-sm text-gray-500 mt-1">Manage SMS, Email and WhatsApp communication credits</p>
        </div>
        <button onClick={() => setShowRecharge(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-none text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Recharge Wallet
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Wallet Balance', value: `₹${balance.toLocaleString()}`, icon: Wallet, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'SMS Sent (Month)', value: '1,500', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Calls Made', value: '0', icon: Phone, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Emails Sent', value: '1,000', icon: Mail, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map((c, i) => (
          <div key={i} className="bg-white rounded-none border border-gray-200 p-4 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-none ${c.bg} flex items-center justify-center`}>
              <c.icon className={`w-5 h-5 ${c.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{c.value}</p>
              <p className="text-xs text-gray-500">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-none border border-gray-200 shadow-sm mb-6">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">Communication Rates</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 p-4">
          {[
            { type: 'SMS', rate: '₹0.20 / SMS', icon: MessageSquare, color: 'text-blue-500' },
            { type: 'WhatsApp', rate: '₹0.40 / message', icon: MessageSquare, color: 'text-green-500' },
            { type: 'Email', rate: '₹0.05 / email', icon: Mail, color: 'text-purple-500' },
          ].map((r, i) => (
            <div key={i} className="border border-gray-200 rounded-none p-4 text-center">
              <r.icon className={`w-6 h-6 ${r.color} mx-auto mb-2`} />
              <p className="font-bold text-gray-700 text-sm">{r.type}</p>
              <p className="text-xs text-gray-500 mt-1">{r.rate}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-none border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-700">Transaction History</h3>
          <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-none">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Type', 'School', 'Count', 'Cost', 'Date', 'Balance After'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-none text-xs font-semibold ${t.type === 'Recharge' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>{t.type}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{t.school}</td>
                  <td className="px-4 py-3 text-gray-600">{t.count || '—'}</td>
                  <td className={`px-4 py-3 font-semibold ${t.type === 'Recharge' ? 'text-green-600' : 'text-red-500'}`}>
                    {t.type === 'Recharge' ? `+₹${Math.abs(t.cost).toLocaleString()}` : `₹${t.cost}`}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{t.date}</td>
                  <td className="px-4 py-3 font-semibold text-gray-700">₹{t.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECHARGE MODAL */}
      {showRecharge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-800">Recharge Wallet</h2>
                <p className="text-xs text-gray-500 mt-0.5">Current balance: <span className="font-semibold text-orange-500">₹{balance.toLocaleString()}</span></p>
              </div>
              <button onClick={() => setShowRecharge(false)} className="p-2 hover:bg-gray-100 rounded-none"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-5">
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Select Client (School) *</label>
                <select value={selectedSchool} onChange={e => setSelectedSchool(e.target.value)} className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                   <option value="">-- Choose School --</option>
                   {schoolsList.map(s => (
                     <option key={s._id} value={s._id}>{s.schoolName}</option>
                   ))}
                </select>
              </div>
              <p className="text-xs font-semibold text-gray-600 mb-3">Quick Select (SMS Count)</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {['500', '1000', '2000', '5000', '10000', '20000'].map(a => (
                  <button key={a} onClick={() => setAmount(a)}
                    className={`py-2 rounded-none text-sm font-semibold border transition-colors ${amount === a ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    ₹{Number(a).toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Custom Amount (₹)</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount"
                  className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
              {amount && Number(amount) > 0 && (
                <div className="bg-orange-50 border border-orange-100 rounded-none p-3 mb-4 text-xs text-orange-700">
                  New balance after recharge: <span className="font-bold">₹{(balance + Number(amount)).toLocaleString()}</span>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setShowRecharge(false)} className="flex-1 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={handleRecharge} disabled={loading || !amount || Number(amount) <= 0 || !selectedSchool}
                  className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-none text-sm font-semibold">
                  {loading ? 'Processing...' : `Recharge ${amount ? Number(amount).toLocaleString() : '0'}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

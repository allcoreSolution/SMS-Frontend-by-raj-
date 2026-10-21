import React, { useState } from 'react';
import { Save, Edit, MessageSquare, Mail, Phone, Plus, X, Trash2, AlertTriangle } from 'lucide-react';

const defaultRates = [
  { id: 1, channel: 'SMS', provider: 'Textlocal', rate: 0.20, unit: 'per SMS', country: 'India', status: 'Active' },
  { id: 2, channel: 'SMS', provider: 'MSG91', rate: 0.18, unit: 'per SMS', country: 'India', status: 'Active' },
  { id: 3, channel: 'WhatsApp', provider: 'Twilio', rate: 0.40, unit: 'per message', country: 'Global', status: 'Active' },
  { id: 4, channel: 'WhatsApp', provider: 'Gupshup', rate: 0.35, unit: 'per message', country: 'India', status: 'Active' },
  { id: 5, channel: 'Email', provider: 'SendGrid', rate: 0.05, unit: 'per email', country: 'Global', status: 'Active' },
  { id: 6, channel: 'Email', provider: 'Mailgun', rate: 0.04, unit: 'per email', country: 'Global', status: 'Inactive' },
  { id: 7, channel: 'Voice Call', provider: 'Exotel', rate: 0.30, unit: 'per minute', country: 'India', status: 'Active' },
];

const channelIcon = (ch) => {
  if (ch === 'SMS') return <MessageSquare className="w-4 h-4 text-blue-500" />;
  if (ch === 'Email') return <Mail className="w-4 h-4 text-purple-500" />;
  if (ch === 'Voice Call') return <Phone className="w-4 h-4 text-green-500" />;
  return <MessageSquare className="w-4 h-4 text-green-500" />;
};

const channels = ['SMS', 'WhatsApp', 'Email', 'Voice Call'];
const units = { SMS: 'per SMS', WhatsApp: 'per message', Email: 'per email', 'Voice Call': 'per minute' };
const emptyForm = { channel: 'SMS', provider: '', rate: '', unit: 'per SMS', country: 'India', status: 'Active' };

const CommsRates = () => {
  const [rates, setRates] = useState(defaultRates);
  const [editId, setEditId] = useState(null);
  const [editRate, setEditRate] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [deleteRate, setDeleteRate] = useState(null);

  const saveEdit = (id) => {
    setRates(r => r.map(x => x.id === id ? { ...x, rate: parseFloat(editRate) } : x));
    setEditId(null);
  };

  const handleAdd = () => {
    setRates(prev => [...prev, { ...form, id: Date.now(), rate: parseFloat(form.rate) || 0 }]);
    setShowAdd(false);
    setForm(emptyForm);
  };

  const handleDelete = () => {
    setRates(prev => prev.filter(r => r.id !== deleteRate.id));
    setDeleteRate(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Comms Rates</h1>
          <p className="text-sm text-gray-500 mt-1">Manage communication channel rates and providers</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setShowAdd(true); }} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-none text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Add Rate
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'SMS Rate', value: '₹0.18–0.20', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'WhatsApp Rate', value: '₹0.35–0.40', icon: MessageSquare, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Email Rate', value: '₹0.04–0.05', icon: Mail, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Voice Rate', value: '₹0.30/min', icon: Phone, color: 'text-orange-500', bg: 'bg-orange-50' },
        ].map((c, i) => (
          <div key={i} className="bg-white rounded-none border border-gray-200 p-4 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-none ${c.bg} flex items-center justify-center`}>
              <c.icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{c.value}</p>
              <p className="text-xs text-gray-500">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-none border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Channel', 'Provider', 'Rate', 'Unit', 'Country', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rates.map(r => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">{channelIcon(r.channel)}<span className="font-semibold text-gray-700">{r.channel}</span></div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.provider}</td>
                  <td className="px-4 py-3">
                    {editId === r.id
                      ? <input type="number" value={editRate} onChange={e => setEditRate(e.target.value)} step="0.01"
                          className="w-20 border border-orange-300 rounded-none px-2 py-1 text-sm focus:outline-none" />
                      : <span className="font-bold text-gray-800">₹{r.rate}</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{r.unit}</td>
                  <td className="px-4 py-3 text-gray-600">{r.country}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-none ${r.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {editId === r.id
                        ? <button onClick={() => saveEdit(r.id)} className="flex items-center gap-1 text-xs bg-green-500 text-white px-2 py-1 rounded-none font-semibold"><Save className="w-3 h-3" />Save</button>
                        : <button onClick={() => { setEditId(r.id); setEditRate(r.rate); }} className="p-1.5 hover:bg-blue-50 rounded-none text-blue-500"><Edit className="w-4 h-4" /></button>
                      }
                      {editId !== r.id && <button onClick={() => setDeleteRate(r)} className="p-1.5 hover:bg-red-50 rounded-none text-red-400"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* ADD RATE MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">Add Rate</h2>
              <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 rounded-none"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Channel</label>
                  <select value={form.channel} onChange={e => setForm({ ...form, channel: e.target.value, unit: units[e.target.value] })}
                    className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                    {channels.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Provider</label>
                  <input value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })} placeholder="e.g. MSG91"
                    className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Rate (₹)</label>
                  <input type="number" step="0.01" value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} placeholder="0.20"
                    className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Country</label>
                  <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} placeholder="India"
                    className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                    <option>Active</option><option>Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={handleAdd} className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-none text-sm font-semibold">
                <Plus className="w-4 h-4" /> Add Rate
              </button>
              <button onClick={() => setShowAdd(false)} className="px-5 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteRate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-none flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="font-bold text-gray-800 text-lg mb-2">Delete Rate?</h2>
            <p className="text-sm text-gray-500 mb-6">Delete <span className="font-semibold text-gray-700">{deleteRate.provider} ({deleteRate.channel})</span>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteRate(null)} className="flex-1 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-none text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommsRates;

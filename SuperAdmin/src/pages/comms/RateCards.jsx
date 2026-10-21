import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, PlusCircle, Save, Trash2, Wallet, CheckCircle, X } from 'lucide-react';
import Swal from 'sweetalert2';

const initRates = [
  { id: 1, channel: 'WhatsApp', category: 'Any (fallback)', country: 'Any', rate: '1.1000', cost: '', active: true },
  { id: 2, channel: 'WhatsApp', category: 'authentication', country: 'Any', rate: '0.8500', cost: '', active: true },
  { id: 3, channel: 'WhatsApp', category: 'marketing', country: 'Any', rate: '1.1000', cost: '', active: true },
  { id: 4, channel: 'WhatsApp', category: 'utility', country: 'Any', rate: '0.8500', cost: '', active: true },
  { id: 5, channel: 'SMS', category: 'Any (fallback)', country: 'Any', rate: '0.2500', cost: '', active: true },
  { id: 6, channel: 'SMS', category: 'promotional', country: 'Any', rate: '0.2500', cost: '', active: true },
  { id: 7, channel: 'SMS', category: 'transactional', country: 'Any', rate: '0.2000', cost: '', active: true },
];

export default function RateCards() {
  const navigate = useNavigate();
  const [rates, setRates] = useState(() => {
    const saved = localStorage.getItem('comms_rate_cards');
    if (saved) return JSON.parse(saved);
    return initRates;
  });

  useEffect(() => {
    localStorage.setItem('comms_rate_cards', JSON.stringify(rates));
  }, [rates]);

  const [showModal, setShowModal] = useState(false);

  // Add Rate Form State
  const [newChannel, setNewChannel] = useState('WhatsApp');
  const [newCategory, setNewCategory] = useState('Any (per-channel fallback)');
  const [newCountry, setNewCountry] = useState('');
  const [newRate, setNewRate] = useState('');
  const [newCost, setNewCost] = useState('');

  const handleRateChange = (id, field, value) => {
    setRates(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const toggleActive = (id) => {
    setRates(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const saveRate = () => {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Rate updated successfully!',
      timer: 1500,
      showConfirmButton: false,
      confirmButtonColor: '#554bb9'
    });
  };

  const deleteRate = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this rate card?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setRates(prev => prev.filter(r => r.id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Rate deleted!',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const calculateMargin = (rate, cost) => {
    const r = parseFloat(rate);
    const c = parseFloat(cost);
    if (!isNaN(r) && !isNaN(c) && c > 0) return (r - c).toFixed(4);
    return '—';
  };

  const handleAddRate = (e) => {
    e.preventDefault();
    if (!newRate) return;
    setRates([...rates, {
      id: Date.now(),
      channel: newChannel,
      category: newCategory,
      country: newCountry || 'Any',
      rate: parseFloat(newRate).toFixed(4),
      cost: newCost ? parseFloat(newCost).toFixed(4) : '',
      active: true,
    }]);
    
    Swal.fire({
      icon: 'success',
      title: 'Added!',
      text: 'New rate added successfully!',
      timer: 1500,
      showConfirmButton: false
    });
    
    setShowModal(false);
    setNewCountry(''); setNewRate(''); setNewCost('');
  };

  return (
    <div className="p-4 sm:p-6 pb-12 w-full bg-[#f8f9fa] min-h-screen">

      {/* Toast removed in favor of SweetAlert2 */}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-200 gap-3">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-800 tracking-tight">Communication Rate Cards</h1>
          <p className="text-[13px] text-gray-500 mt-1">Per-message WhatsApp &amp; SMS pricing</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#554bb9] hover:bg-[#463ca0] text-white px-4 py-2 rounded-none shadow-sm text-sm font-semibold transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Add Rate
          </button>
          <button
            onClick={() => navigate('/comms/wallets')}
            className="flex items-center gap-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-none shadow-sm text-sm font-medium transition-all"
          >
            <Wallet className="w-4 h-4 text-gray-500" /> Wallet Oversight
          </button>
        </div>
      </div>

      {/* Full-width Table */}
      <div className="bg-white rounded-none border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 flex items-center gap-2 border-b border-gray-200 bg-[#fdfdfd]">
          <Tag className="w-4 h-4 text-[#554bb9]" />
          <h3 className="font-bold text-gray-900 text-[14px]">Per-message Pricing (₹)</h3>
          <span className="ml-auto text-[12px] text-gray-400 font-medium">{rates.length} rates configured</span>
        </div>

        <table className="w-full text-[13px] text-left border-collapse">
          <thead>
            <tr className="bg-[#f5f6fa]">
              {['Channel', 'Category', 'Country', 'Rate (₹)', 'Cost (₹)', 'Margin', 'Active', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 border border-gray-200 text-[#554bb9] font-bold uppercase text-[11px] tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rates.map(rate => (
              <tr key={rate.id} className="hover:bg-[#f8f9ff] transition-colors">
                {/* Channel Badge */}
                <td className="px-4 py-2.5 border border-gray-200 align-middle whitespace-nowrap">
                  {rate.channel === 'WhatsApp'
                    ? <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-none text-[10px] font-bold uppercase">WhatsApp</span>
                    : <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-none text-[10px] font-bold uppercase">SMS</span>
                  }
                </td>

                {/* Category */}
                <td className="px-4 py-2.5 border border-gray-200 text-gray-700 font-medium align-middle">{rate.category}</td>

                {/* Country */}
                <td className="px-4 py-2.5 border border-gray-200 text-gray-500 align-middle">{rate.country}</td>

                {/* Rate */}
                <td className="px-4 py-2.5 border border-gray-200 align-middle">
                  <input
                    type="text"
                    value={rate.rate}
                    onChange={e => handleRateChange(rate.id, 'rate', e.target.value)}
                    className="w-[90px] border border-gray-200 hover:border-[#554bb9] rounded-none px-2 py-1 text-[12px] font-mono font-semibold text-gray-800 text-center focus:outline-none focus:border-[#554bb9] focus:ring-1 focus:ring-[#554bb9]/30 transition-all bg-gray-50 focus:bg-white"
                  />
                </td>

                {/* Cost */}
                <td className="px-4 py-2.5 border border-gray-200 align-middle">
                  <input
                    type="text"
                    value={rate.cost}
                    onChange={e => handleRateChange(rate.id, 'cost', e.target.value)}
                    placeholder="—"
                    className="w-[90px] border border-gray-200 hover:border-[#554bb9] rounded-none px-2 py-1 text-[12px] font-mono font-semibold text-gray-800 text-center focus:outline-none focus:border-[#554bb9] focus:ring-1 focus:ring-[#554bb9]/30 transition-all bg-gray-50 focus:bg-white placeholder-gray-300"
                  />
                </td>

                {/* Margin */}
                <td className="px-4 py-2.5 border border-gray-200 align-middle">
                  {(() => {
                    const m = calculateMargin(rate.rate, rate.cost);
                    const isPos = m !== '—' && parseFloat(m) > 0;
                    const isNeg = m !== '—' && parseFloat(m) < 0;
                    return (
                      <span className={`text-[12px] font-semibold font-mono ${m === '—' ? 'text-gray-300' : isPos ? 'text-emerald-600' : isNeg ? 'text-red-500' : 'text-gray-500'}`}>
                        {m}
                      </span>
                    );
                  })()}
                </td>

                {/* Active Toggle */}
                <td className="px-4 py-2.5 border border-gray-200 text-center align-middle">
                  <div
                    onClick={() => toggleActive(rate.id)}
                    className={`w-9 h-[20px] rounded-none inline-flex items-center p-0.5 cursor-pointer transition-colors ${rate.active ? 'bg-[#554bb9]' : 'bg-gray-300'}`}
                  >
                    <div className={`w-[16px] h-[16px] bg-white rounded-none shadow-sm transform transition-transform ${rate.active ? 'translate-x-[16px]' : 'translate-x-0'}`} />
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-2.5 border border-gray-200 text-center align-middle">
                  <div className="flex justify-center items-center gap-2">
                    <button onClick={saveRate} className="p-1.5 text-gray-400 hover:text-[#554bb9] hover:bg-indigo-50 rounded-none transition-colors" title="Save">
                      <Save className="w-[14px] h-[14px]" />
                    </button>
                    <button onClick={() => deleteRate(rate.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-none transition-colors" title="Delete">
                      <Trash2 className="w-[14px] h-[14px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rates.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-10 text-gray-400 text-sm">
                  No rate cards configured yet. Click <strong className="text-[#554bb9]">Add Rate</strong> to start.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Rate Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 shadow-xl w-full max-w-md rounded-none overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-gray-200 bg-[#fdfdfd] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#554bb9]" />
                <h3 className="font-bold text-gray-900 text-[14px]">Add Rate</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-none text-gray-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRate} className="p-5 space-y-4">
              {/* Channel */}
              <div>
                <label className="block text-[12px] font-bold text-gray-800 mb-1.5">Channel</label>
                <select
                  value={newChannel}
                  onChange={e => setNewChannel(e.target.value)}
                  className="w-full border border-gray-300 rounded-none px-3 py-2 text-[13px] text-gray-800 focus:outline-none focus:border-[#554bb9]"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="SMS">SMS</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[12px] font-bold text-gray-800 mb-1.5">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-none px-3 py-2 text-[13px] text-gray-800 focus:outline-none focus:border-[#554bb9]"
                >
                  <option value="Any (per-channel fallback)">Any (per-channel fallback)</option>
                  {newChannel === 'WhatsApp' ? (
                    <>
                      <option value="authentication">authentication</option>
                      <option value="marketing">marketing</option>
                      <option value="utility">utility</option>
                    </>
                  ) : (
                    <>
                      <option value="promotional">promotional</option>
                      <option value="transactional">transactional</option>
                    </>
                  )}
                </select>
              </div>

              {/* Country */}
              <div>
                <label className="block text-[12px] font-bold text-gray-800 mb-1.5">Destination Country</label>
                <input
                  type="text"
                  value={newCountry}
                  onChange={e => setNewCountry(e.target.value)}
                  placeholder="E.G. IN, US, NG — BLANK = ANY"
                  className="w-full border border-gray-300 rounded-none px-3 py-2 text-[13px] text-gray-800 focus:outline-none focus:border-[#554bb9]"
                />
                <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
                  2-letter ISO code. Recipients matched by number's dial code (+91 → IN). Country row overrides the generic "Any" rate.
                </p>
              </div>

              {/* Rate + Cost side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-gray-800 mb-1.5">Rate (₹ / msg)</label>
                  <input
                    type="number" step="0.0001"
                    value={newRate}
                    onChange={e => setNewRate(e.target.value)}
                    className="w-full border border-gray-300 rounded-none px-3 py-2 text-[13px] focus:outline-none focus:border-[#554bb9]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-800 mb-1.5">Cost (₹, optional)</label>
                  <input
                    type="number" step="0.0001"
                    value={newCost}
                    onChange={e => setNewCost(e.target.value)}
                    placeholder="For margin"
                    className="w-full border border-gray-300 rounded-none px-3 py-2 text-[13px] focus:outline-none focus:border-[#554bb9]"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 border border-gray-300 text-gray-600 font-semibold text-[13px] rounded-none hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newRate}
                  className="flex-1 py-2 bg-[#554bb9] hover:bg-[#463ca0] text-white font-bold text-[13px] rounded-none disabled:opacity-50 transition-colors"
                >
                  Add Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

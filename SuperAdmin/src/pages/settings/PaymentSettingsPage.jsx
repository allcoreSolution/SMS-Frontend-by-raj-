import React, { useState } from 'react';
import { Lock, CreditCard, Save, Check } from 'lucide-react';
import SettingsLayout from '../../components/SettingsLayout';
import Swal from 'sweetalert2';

export default function PaymentSettingsPage() {
  const [currency, setCurrency] = useState('Indian Rupee (₹)');
  const [mode, setMode] = useState('Live (Accept Real Payments)');
  const [saved, setSaved] = useState(false);
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
    <SettingsLayout activeTab="payment-settings">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 max-w-[1150px] mx-auto w-full">

          

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-1">
              <CreditCard className="w-5 h-5 text-blue-600" /> Payment Settings
            </h1>
            <p className="text-sm text-gray-500">Platform payment mode (sandbox/live) and default currency.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-3.5">
              <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-400" /> Subscription Payment Settings
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Default Currency for Subscriptions</label>
                <select value={currency} onChange={e => setCurrency(e.target.value)}
                  className="w-full border border-gray-200 rounded-none-none px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                  <option>Indian Rupee (₹)</option>
                  <option>US Dollar ($)</option>
                  <option>Euro (€)</option>
                  <option>British Pound (£)</option>
                  <option>UAE Dirham (AED)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Platform Payment Mode</label>
                <select value={mode} onChange={e => setMode(e.target.value)}
                  className="w-full border border-gray-200 rounded-none-none px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                  <option>Live (Accept Real Payments)</option>
                  <option>Sandbox (Test Mode)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-100 px-6 py-3 flex justify-end flex-shrink-0">
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-none-none transition-all text-white ${saved ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {saved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : <><Save className="w-3.5 h-3.5" /> Save Payments</>}
          </button>
        </div>
      </div>
    </SettingsLayout>
  );
}

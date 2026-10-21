import React from 'react';
import SettingsLayout from '../../components/SettingsLayout';
import { Lock, FileText, MessageCircle, MessageSquare, AlertCircle, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MetaDltConfig() {
  const mainContent = (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-[1200px] w-full mx-auto space-y-6 text-slate-800 font-sans">
      
      {/* Page Header */}
      <div>
        <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Platform Settings</h1>
      </div>

      {/* Demo Mode Alert Banner */}
      <div className="bg-[#fffbeb] border border-[#fde68a] text-[#92400e] px-4 py-3 rounded-none text-[13px] font-medium flex items-center gap-2.5 shadow-sm">
        <Lock className="w-[18px] h-[18px] text-amber-600 flex-shrink-0" />
        <span>
          <strong className="font-bold">Demo mode:</strong> these settings are read-only — saving, testing and deleting are disabled for security.
        </span>
      </div>

      {/* Main Configuration Card */}
      <div className="bg-white border border-slate-200 rounded-none overflow-hidden shadow-sm">
        <div className="p-6">

          {/* Card Header & Description */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-blue-500" fill="currentColor" fillOpacity={0.2} /> 
              Platform Meta / DLT Configuration
            </h2>
            <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
              These are the <strong className="text-slate-800">platform-owned</strong> WhatsApp (Meta Cloud) and SMS (DLT) credentials used for the prepaid Communication Wallet. Schools opt in and pay per message from their wallet — they do not enter these. Manage per-message pricing in <Link to="/comms/rate-cards" className="text-orange-500 hover:underline">Rate Cards</Link> and balances in <Link to="/comms/wallets" className="text-orange-500 hover:underline">Wallet Oversight</Link>.
            </p>
          </div>

          <div className="space-y-8">
            {/* Section 1: WhatsApp */}
            <div>
              <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-emerald-500" />
                WhatsApp (Meta Cloud API)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-[13px] font-bold text-slate-800 mb-1.5">Phone Number ID</label>
                  <input type="text" placeholder="e.g. 1098xxxxxxxxxx" className="w-full border border-slate-300 rounded-none px-3 py-2 text-[14px] placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" disabled />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-800 mb-1.5">WABA ID</label>
                  <input type="text" placeholder="WhatsApp Business Account ID" className="w-full border border-slate-300 rounded-none px-3 py-2 text-[14px] placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" disabled />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-800 mb-1.5">
                    Access Token
                    <span className="bg-slate-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-none">Not set</span>
                  </label>
                  <input type="password" placeholder="Leave blank to keep the existing token" className="w-full border border-slate-300 rounded-none px-3 py-2 text-[14px] placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" disabled />
                  <p className="text-[11px] text-slate-500 mt-1">Stored encrypted. Enter a value only to replace it.</p>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-800 mb-1.5">API Version</label>
                  <input type="text" placeholder="v21.0" className="w-full border border-slate-300 rounded-none px-3 py-2 text-[14px] placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" disabled />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-slate-800 mb-1.5">App Secret</label>
                  <input type="password" placeholder="Leave blank to keep the existing secret" className="w-full border border-slate-300 rounded-none px-3 py-2 text-[14px] placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" disabled />
                  <p className="text-[11px] text-slate-500 mt-1">Used for webhook signature verification. Stored encrypted.</p>
                </div>
              </div>
            </div>

            {/* Section 2: SMS (India DLT) */}
            <div>
              <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-cyan-500" />
                SMS (India DLT)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-[13px] font-bold text-slate-800 mb-1.5">DLT Sender / Header ID</label>
                  <input type="text" placeholder="e.g. SCHOOL" className="w-full border border-slate-300 rounded-none px-3 py-2 text-[14px] placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" disabled />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-800 mb-1.5">DLT Principal Entity (PE) ID</label>
                  <input type="text" placeholder="TRAI PE ID" className="w-full border border-slate-300 rounded-none px-3 py-2 text-[14px] placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" disabled />
                </div>
              </div>
            </div>

            {/* Warning Info Box */}
            <div className="bg-[#ffbb00] text-amber-900 px-4 py-3 rounded-none text-[13px] font-medium flex items-start gap-2.5 shadow-sm mt-6">
              <AlertCircle className="w-[18px] h-[18px] text-amber-900 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                Message wording on the platform path is fixed by the <strong className="font-extrabold">superadmin-approved</strong> Meta/DLT templates (schools cannot edit it). Approved templates live in the platform notification templates (school not set).
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button className="bg-[#448ce7] hover:bg-[#3476c9] text-white px-5 py-2.5 rounded-none text-[13px] font-bold shadow-sm transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-75" disabled>
                <Save className="w-[18px] h-[18px]" />
                Save Comms Config
              </button>
            </div>

          </div>
        </div>
      </div>
    </div >
  );

  return (
    <SettingsLayout activeTab="comms-wallet-meta">
      {mainContent}
    </SettingsLayout>
  );
}

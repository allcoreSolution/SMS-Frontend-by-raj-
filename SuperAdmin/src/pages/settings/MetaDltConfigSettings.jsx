import React, { useState, useEffect } from 'react';
import { Lock, Settings, Save, Info, MessageCircle, MessageSquare, Check } from 'lucide-react';
import SettingsLayout from '../../components/SettingsLayout';
import Swal from 'sweetalert2';
import { settingsService } from '../../api/settingsService';

export default function MetaDltConfigSettings() {
  const [form, setForm] = useState({
    phoneNumberId: '', wabaId: '', accessToken: '',
    apiVersion: 'v21.0', appSecret: '', dltSenderId: '', dltPeId: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    settingsService.getSetting('meta_dlt_config').then(res => {
      if (res.success && res.data) {
        setForm(prev => ({ ...prev, ...res.data }));
      }
    }).catch(console.error);
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSave = async () => { 
    try {
      await settingsService.saveSetting('meta_dlt_config', form);
      setSaved(true); 
      Swal.fire({
        icon: 'success',
        title: 'Settings Saved',
        text: 'Your DLT configuration has been saved successfully.',
        timer: 1500,
        showConfirmButton: false
      });
      setTimeout(() => setSaved(false), 2500); 
    } catch (error) {
      Swal.fire('Error', 'Failed to save configuration: ' + error.message, 'error');
    }
  };

  return (
    <SettingsLayout activeTab="meta-dlt">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 max-w-[1150px] mx-auto w-full">

          

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-1">
              <Settings className="w-5 h-5 text-blue-600" /> Meta / DLT Config
            </h1>
            <p className="text-sm text-gray-500">Platform Meta WhatsApp + DLT SMS credentials for the comms wallet.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden mb-5">
            <div className="border-b border-gray-100 px-5 py-3.5">
              <h3 className="font-semibold text-gray-800 text-sm">Platform Meta / DLT Configuration</h3>
            </div>
            <div className="p-5 space-y-5">
              <p className="text-xs text-gray-500 leading-relaxed">
                These are the <strong>platform-owned</strong> WhatsApp (Meta Cloud) and SMS (DLT) credentials used for the prepaid Communication Wallet.
              </p>

              {/* WhatsApp Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-gray-700">WhatsApp (Meta Cloud API)</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
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
                <div className="grid grid-cols-2 gap-4 mb-4">
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

              {/* DLT Section */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-700">SMS (India DLT)</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
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

              {/* Info */}
              <div className="bg-blue-50 border border-blue-100 rounded-none-none px-4 py-3 flex gap-2.5">
                <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed">
                  Message wording is fixed by superadmin-approved Meta/DLT templates. Schools cannot edit platform-level templates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-100 px-6 py-3 flex justify-end flex-shrink-0">
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-none-none transition-all text-white ${saved ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {saved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : <><Save className="w-3.5 h-3.5" /> Save Comms Config</>}
          </button>
        </div>
      </div>
    </SettingsLayout>
  );
}

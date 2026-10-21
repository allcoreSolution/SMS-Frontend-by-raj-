import React, { useState, useEffect } from 'react';
import { Lock, RefreshCw, Save, Check } from 'lucide-react';
import SettingsLayout from '../../components/SettingsLayout';
import Swal from 'sweetalert2';
import { settingsService } from '../../api/settingsService';

function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-none-none transition-colors duration-200 flex-shrink-0 focus:outline-none ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-none-none bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  );
}

export default function SubscriptionsSettings() {
  const [reminderDays, setReminderDays] = useState('7, 3, 1');
  const [gracePeriod, setGracePeriod] = useState('7');
  const [smsReminders, setSmsReminders] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    settingsService.getSetting('subscription_settings').then(res => {
      if (res.success && res.data) {
        setReminderDays(res.data.reminderDays || '7, 3, 1');
        setGracePeriod(res.data.gracePeriod || '7');
        setSmsReminders(res.data.smsReminders ?? true);
      }
    }).catch(console.error);
  }, []);

  const handleSave = async () => { 
    try {
      await settingsService.saveSetting('subscription_settings', { reminderDays, gracePeriod, smsReminders });
      setSaved(true); 
      Swal.fire({
        icon: 'success',
        title: 'Settings Saved',
        text: 'Your changes have been saved to the database successfully.',
        timer: 1500,
        showConfirmButton: false
      });
      setTimeout(() => setSaved(false), 2500); 
    } catch (error) {
      Swal.fire('Error', 'Failed to save settings: ' + error.message, 'error');
    }
  };

  return (
    <SettingsLayout activeTab="subscriptions">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 max-w-[1150px] mx-auto w-full">

          

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-1">
              <RefreshCw className="w-5 h-5 text-blue-600" /> Subscriptions
            </h1>
            <p className="text-sm text-gray-500">Renewal reminders, grace period and multi-channel billing alerts.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-none-none shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-3.5">
              <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-gray-400" /> Subscription &amp; Renewal Management
              </h3>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Reminder Intervals (Days before expiry)</label>
                  <input value={reminderDays} onChange={e => setReminderDays(e.target.value)}
                    className="w-full border border-gray-200 rounded-none-none px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                  <p className="text-xs text-gray-400 mt-1">Comma separated days to send renewal reminders.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Grace Period (Days after expiry)</label>
                  <input value={gracePeriod} onChange={e => setGracePeriod(e.target.value)}
                    className="w-full border border-gray-200 rounded-none-none px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                  <p className="text-xs text-gray-400 mt-1">Days to allow access after subscription ends.</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Multi-Channel Reminders</p>
                <div className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-none-none p-4">
                  <Toggle checked={smsReminders} onChange={setSmsReminders} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Enable SMS/WhatsApp reminders for renewals</p>
                    <p className="text-xs text-gray-500 mt-0.5">Reminders will be sent via Email by default. Enable this to include SMS/WhatsApp.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-100 px-6 py-3 flex justify-end flex-shrink-0">
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-none-none transition-all text-white ${saved ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {saved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : <><Save className="w-3.5 h-3.5" /> Save Subscriptions</>}
          </button>
        </div>
      </div>
    </SettingsLayout>
  );
}

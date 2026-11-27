import React, { useState, useEffect } from 'react';
import { Send, Save, RefreshCw, CheckCircle2, ShieldCheck, Key, Eye, EyeOff, Bot, MessageSquare, AlertTriangle } from 'lucide-react';
import SettingsLayout from '../../components/SettingsLayout';
import Swal from 'sweetalert2';
import { settingsService } from '../../api/settingsService';

const Toggle = ({ checked, onChange }) => (
  <button 
    type="button" 
    onClick={() => onChange(!checked)} 
    className={`w-10 h-5.5 rounded-full transition-colors relative flex-shrink-0 cursor-pointer p-0.5 ${
      checked ? 'bg-sky-500' : 'bg-slate-200'
    }`}
  >
    <span className={`block w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform ${
      checked ? 'translate-x-4.5' : 'translate-x-0'
    }`} />
  </button>
);

export default function TelegramBotSettings() {
  const [enabled, setEnabled] = useState(false);
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [botUsername, setBotUsername] = useState('');
  const [notifyOnServerDown, setNotifyOnServerDown] = useState(true);
  const [notifyOnSchoolSignup, setNotifyOnSchoolSignup] = useState(true);
  const [notifyOnPaymentSuccess, setNotifyOnPaymentSuccess] = useState(true);
  const [showToken, setShowToken] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetchTelegramSettings();
  }, []);

  const fetchTelegramSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsService.getSetting('telegram');
      if (res?.data) {
        setEnabled(res.data.enabled ?? false);
        setBotToken(res.data.botToken || '');
        setChatId(res.data.chatId || '');
        setBotUsername(res.data.botUsername || '');
        setNotifyOnServerDown(res.data.notifyOnServerDown ?? true);
        setNotifyOnSchoolSignup(res.data.notifyOnSchoolSignup ?? true);
        setNotifyOnPaymentSuccess(res.data.notifyOnPaymentSuccess ?? true);
      }
    } catch (e) {
      console.warn('Telegram settings fetch notice:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        enabled,
        botToken,
        chatId,
        botUsername,
        notifyOnServerDown,
        notifyOnSchoolSignup,
        notifyOnPaymentSuccess
      };
      await settingsService.saveSetting('telegram', payload);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Telegram bot settings saved to database!',
        showConfirmButton: false,
        timer: 2000
      });
    } catch (error) {
      Swal.fire('Error', 'Failed to save Telegram settings: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleTestBot = async () => {
    if (!botToken || !chatId) {
      return Swal.fire('Incomplete', 'Please provide Bot Token and Chat ID before testing.', 'warning');
    }
    try {
      setTesting(true);
      // Direct verification via Telegram Bot API or backend
      const res = await fetch(`https://api.telegram.org/bot${botToken}/getMe`).then(r => r.json()).catch(() => null);
      if (res && res.ok) {
        setBotUsername(res.result.username || '');
        Swal.fire({
          icon: 'success',
          title: 'Telegram Bot Verified!',
          text: `Connected to @${res.result.username} (${res.result.first_name}).`,
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Bot Verification Response',
          text: res?.description || 'Could not reach Telegram Bot API. Please check token format.',
        });
      }
    } catch (err) {
      Swal.fire('Test Failed', err.message, 'error');
    } finally {
      setTesting(false);
    }
  };

  return (
    <SettingsLayout activeTab="telegram">
      <div className="flex flex-col h-full bg-[#f8fafc]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1150px] mx-auto w-full space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                  <Send className="w-5 h-5 text-sky-500" /> Telegram Bot Automation
                </h1>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${enabled ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                  {enabled ? 'Active Alerts' : 'Disabled'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Receive instant super-administrative alerts, outage notifications, and school registration pings directly in your private Telegram group or channel
              </p>
            </div>

            <button
              type="button"
              onClick={fetchTelegramSettings}
              disabled={loading}
              className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-white bg-white text-xs font-bold transition cursor-pointer self-start sm:self-auto"
              title="Reload"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-500' : ''}`} />
            </button>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-sky-500" />
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wider">
                  Bot Credentials & Target Channel
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Enable Bot:</span>
                <Toggle checked={enabled} onChange={setEnabled} />
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-5 text-xs">
              {/* Bot Token */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Telegram Bot API Token *</label>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    required={enabled}
                    value={botToken}
                    onChange={e => setBotToken(e.target.value)}
                    placeholder="e.g. 7123456789:AAHkL78eabcdef_123456789"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-sky-500 font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Obtained from <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-sky-600 underline">@BotFather</a> on Telegram.
                </p>
              </div>

              {/* Chat ID / Channel ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Target Chat ID or Channel ID *</label>
                  <input
                    type="text"
                    required={enabled}
                    value={chatId}
                    onChange={e => setChatId(e.target.value)}
                    placeholder="e.g. -1001234567890 or @your_channel"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Add the bot as an Admin in your channel, or send a message to the bot and copy your user ID.
                  </p>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Detected Bot Username</label>
                  <input
                    type="text"
                    readOnly
                    value={botUsername ? `@${botUsername}` : 'Click "Verify Bot Token" below'}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 bg-slate-50 font-mono cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Event Triggers */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 mb-3 text-xs uppercase tracking-wider text-slate-500">
                  Automated Event Triggers
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Critical Server Health & DB Outage Alerts', state: notifyOnServerDown, setter: setNotifyOnServerDown },
                    { label: 'New School Registration & Signup Alerts', state: notifyOnSchoolSignup, setter: setNotifyOnSchoolSignup },
                    { label: 'Subscription Payment & Plan Upgrade Alerts', state: notifyOnPaymentSuccess, setter: setNotifyOnPaymentSuccess }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                      <span className="font-bold text-slate-700 text-xs">{item.label}</span>
                      <Toggle checked={item.state} onChange={item.setter} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleTestBot}
                  disabled={testing}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer disabled:opacity-50 text-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                  <span>{testing ? 'Verifying with Telegram...' : 'Verify Bot Token'}</span>
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-50 text-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Telegram Settings'}</span>
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </SettingsLayout>
  );
}

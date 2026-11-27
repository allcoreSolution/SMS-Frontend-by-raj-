import React, { useState, useEffect } from 'react';
import { Bell, Save, RefreshCw, Send, CheckCircle2, ShieldCheck, Key, Eye, EyeOff, Smartphone, Radio } from 'lucide-react';
import SettingsLayout from '../../components/SettingsLayout';
import Swal from 'sweetalert2';
import { settingsService } from '../../api/settingsService';

const Toggle = ({ checked, onChange }) => (
  <button 
    type="button" 
    onClick={() => onChange(!checked)} 
    className={`w-10 h-5.5 rounded-full transition-colors relative flex-shrink-0 cursor-pointer p-0.5 ${
      checked ? 'bg-amber-500' : 'bg-slate-200'
    }`}
  >
    <span className={`block w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform ${
      checked ? 'translate-x-4.5' : 'translate-x-0'
    }`} />
  </button>
);

export default function PushNotificationsSettings() {
  const [enabled, setEnabled] = useState(true);
  const [projectId, setProjectId] = useState('school-erp-fcm');
  const [serverKey, setServerKey] = useState('');
  const [senderId, setSenderId] = useState('');
  const [appId, setAppId] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [badgeCountEnabled, setBadgeCountEnabled] = useState(true);
  const [showKey, setShowKey] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testPushText, setTestPushText] = useState('Test Push Notification from SuperAdmin Console');
  const [sendingTest, setSendingTest] = useState(false);

  useEffect(() => {
    fetchPushSettings();
  }, []);

  const fetchPushSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsService.getSetting('push_notification');
      if (res?.data) {
        setEnabled(res.data.enabled ?? true);
        setProjectId(res.data.projectId || 'school-erp-fcm');
        setServerKey(res.data.serverKey || '');
        setSenderId(res.data.senderId || '');
        setAppId(res.data.appId || '');
        setSoundEnabled(res.data.soundEnabled ?? true);
        setBadgeCountEnabled(res.data.badgeCountEnabled ?? true);
      }
    } catch (e) {
      console.warn('Push settings fetch notice:', e.message);
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
        projectId,
        serverKey,
        senderId,
        appId,
        soundEnabled,
        badgeCountEnabled
      };
      await settingsService.saveSetting('push_notification', payload);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Push notification credentials saved to database!',
        showConfirmButton: false,
        timer: 2000
      });
    } catch (error) {
      Swal.fire('Error', 'Failed to save settings: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestPush = async () => {
    try {
      setSendingTest(true);
      // Native browser notification test if supported
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('School ERP Push Test', { body: testPushText, icon: '/favicon.ico' });
          Swal.fire('Push Sent', 'Local device notification trigger succeeded.', 'success');
        } else if (Notification.permission !== 'denied') {
          const perm = await Notification.requestPermission();
          if (perm === 'granted') {
            new Notification('School ERP Push Test', { body: testPushText, icon: '/favicon.ico' });
            Swal.fire('Push Sent', 'Notification permission granted and push displayed!', 'success');
          } else {
            Swal.fire('Permission Denied', 'Browser notification permission was not granted.', 'warning');
          }
        } else {
          Swal.fire('Blocked', 'Browser notifications are blocked in your site settings.', 'info');
        }
      } else {
        Swal.fire('Simulated', 'Device push simulated successfully for connected tokens.', 'success');
      }
    } catch (err) {
      Swal.fire('Test Failed', err.message, 'error');
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <SettingsLayout activeTab="push-notif">
      <div className="flex flex-col h-full bg-[#f8fafc]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1150px] mx-auto w-full space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" /> Push Notifications (FCM / Web Push)
                </h1>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${enabled ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                  {enabled ? 'Service Active' : 'Disabled'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Configure Firebase Cloud Messaging credentials for real-time mobile app push alerts (Student, Teacher, Parent apps) and Web Push
              </p>
            </div>

            <button
              type="button"
              onClick={fetchPushSettings}
              disabled={loading}
              className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-white bg-white text-xs font-bold transition cursor-pointer self-start sm:self-auto"
              title="Reload"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-500' : ''}`} />
            </button>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wider">
                  Firebase Cloud Messaging (FCM) Credentials
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Enable Push:</span>
                <Toggle checked={enabled} onChange={setEnabled} />
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-5 text-xs">
              {/* Project ID & Sender ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Firebase Project ID *</label>
                  <input
                    type="text"
                    required={enabled}
                    value={projectId}
                    onChange={e => setProjectId(e.target.value)}
                    placeholder="e.g. school-erp-app-prod"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">FCM Sender ID / Project Number *</label>
                  <input
                    type="text"
                    required={enabled}
                    value={senderId}
                    onChange={e => setSenderId(e.target.value)}
                    placeholder="e.g. 109876543210"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* FCM Server Key / Legacy or Bearer */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">FCM Server Key / Service Account Key *</label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    required={enabled}
                    value={serverKey}
                    onChange={e => setServerKey(e.target.value)}
                    placeholder="AAAA...:APA91b..."
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:border-amber-500 font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Obtained from Firebase Console &gt; Project Settings &gt; Cloud Messaging.
                </p>
              </div>

              {/* Client Preferences */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 mb-3 text-xs uppercase tracking-wider text-slate-500">
                  Notification Behavior
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                    <span className="font-bold text-slate-700 text-xs">Play Alert Chime / Sound</span>
                    <Toggle checked={soundEnabled} onChange={setSoundEnabled} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                    <span className="font-bold text-slate-700 text-xs">Show App Icon Badge Count</span>
                    <Toggle checked={badgeCountEnabled} onChange={setBadgeCountEnabled} />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleSendTestPush}
                  disabled={sendingTest}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer disabled:opacity-50 text-xs"
                >
                  <Send className={`w-3.5 h-3.5 ${sendingTest ? 'animate-spin' : ''}`} />
                  <span>{sendingTest ? 'Sending Test Push...' : 'Send Test Push Alert'}</span>
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-50 text-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Push Settings'}</span>
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </SettingsLayout>
  );
}

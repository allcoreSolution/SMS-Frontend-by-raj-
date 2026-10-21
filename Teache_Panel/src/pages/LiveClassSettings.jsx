import React, { useState, useEffect } from 'react';
import { Settings, Video, Bell, Shield, Clock, Monitor, Save, ToggleLeft, ToggleRight, Info, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { liveClassService } from '../api/liveClassService';

const Toggle = ({ enabled, onToggle, label, desc }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
    <div className="flex-1 pr-4">
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
    </div>
    <button onClick={onToggle} className="flex-shrink-0">
      {enabled
        ? <ToggleRight className="w-9 h-9 text-indigo-500" />
        : <ToggleLeft className="w-9 h-9 text-gray-300" />}
    </button>
  </div>
);

const SectionCard = ({ icon: Icon, title, color, children }) => (
  <div className="bg-white border border-gray-200 shadow-sm">
    <div className={`flex items-center gap-2 px-5 py-4 border-b border-gray-100 ${color}`}>
      <Icon className="w-4 h-4" />
      <h2 className="text-sm font-bold uppercase tracking-wider">{title}</h2>
    </div>
    <div className="px-5">{children}</div>
  </div>
);

const LiveClassSettings = () => {
  const [settings, setSettings] = useState({
    autoRecord: true,
    waitingRoom: true,
    chatEnabled: true,
    raiseHand: true,
    screenShare: false,
    attendance: true,
    notifications: true,
    emailReminder: true,
    smsReminder: false,
    studentVideo: true,
    studentMic: false,
    breakoutRooms: false,
    pollsQuizzes: true,
    whiteBoard: true,
  });

  const [general, setGeneral] = useState({
    defaultPlatform: 'Google Meet',
    defaultDuration: '45',
    reminderBefore: '15',
    maxParticipants: '50',
    defaultQuality: 'HD (720p)',
    timezone: 'Asia/Kolkata (IST)',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await liveClassService.getSettings();
      if (res && res.success && res.data) {
        const data = res.data;
        if (data.general) {
          setGeneral(prev => ({ ...prev, ...data.general }));
        }
        if (data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }));
        }
      }
    } catch (err) {
      console.error('Error fetching live class settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await liveClassService.updateSettings({
        general,
        settings
      });

      if (res && res.success) {
        setSaved(true);
        setToastMessage('Live class settings saved successfully!');
        setTimeout(() => {
          setSaved(false);
          setToastMessage('');
        }, 3500);
      }
    } catch (err) {
      console.error('Error saving live class settings:', err);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-100 text-green-600 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Live Class Settings</h1>
              <p className="text-sm text-gray-500">Configure your live class preferences and defaults</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-colors ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-green-50 border-b border-green-200 px-6 py-2.5 flex items-center gap-2 text-sm text-green-700">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="p-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* General Settings */}
        <SectionCard icon={Video} title="General Defaults" color="text-indigo-600">
          <div className="py-4 space-y-4">
            {[
              { label: 'Default Platform', key: 'defaultPlatform', options: ['Google Meet', 'Zoom', 'MS Teams', 'Jitsi Meet'] },
              { label: 'Default Duration (min)', key: 'defaultDuration', options: ['30', '45', '60', '90', '120'] },
              { label: 'Reminder Before (min)', key: 'reminderBefore', options: ['5', '10', '15', '30', '60'] },
              { label: 'Max Participants', key: 'maxParticipants', options: ['25', '50', '100', '200'] },
              { label: 'Default Video Quality', key: 'defaultQuality', options: ['SD (480p)', 'HD (720p)', 'Full HD (1080p)'] },
              { label: 'Timezone', key: 'timezone', options: ['Asia/Kolkata (IST)', 'UTC', 'America/New_York (EST)'] },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{field.label}</label>
                <select
                  value={general[field.key]}
                  onChange={e => setGeneral(g => ({ ...g, [field.key]: e.target.value }))}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
                >
                  {field.options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Recording & Session */}
        <SectionCard icon={Monitor} title="Session Controls" color="text-blue-600">
          <Toggle enabled={settings.autoRecord} onToggle={() => toggle('autoRecord')} label="Auto Record Classes" desc="Automatically record every live session" />
          <Toggle enabled={settings.waitingRoom} onToggle={() => toggle('waitingRoom')} label="Enable Waiting Room" desc="Students wait for host approval before entering" />
          <Toggle enabled={settings.attendance} onToggle={() => toggle('attendance')} label="Auto-Mark Attendance" desc="Mark students present when they join" />
          <Toggle enabled={settings.breakoutRooms} onToggle={() => toggle('breakoutRooms')} label="Breakout Rooms" desc="Allow splitting class into smaller groups" />
          <Toggle enabled={settings.whiteBoard} onToggle={() => toggle('whiteBoard')} label="Whiteboard" desc="Enable digital whiteboard during sessions" />
          <Toggle enabled={settings.screenShare} onToggle={() => toggle('screenShare')} label="Teacher Screen Share" desc="Allow teacher to share screen" />
        </SectionCard>

        {/* Student Permissions */}
        <SectionCard icon={Shield} title="Student Permissions" color="text-purple-600">
          <Toggle enabled={settings.chatEnabled} onToggle={() => toggle('chatEnabled')} label="Enable Chat" desc="Students can send messages during class" />
          <Toggle enabled={settings.raiseHand} onToggle={() => toggle('raiseHand')} label="Raise Hand" desc="Students can raise hand to ask questions" />
          <Toggle enabled={settings.studentVideo} onToggle={() => toggle('studentVideo')} label="Student Video On" desc="Students can turn on their camera" />
          <Toggle enabled={settings.studentMic} onToggle={() => toggle('studentMic')} label="Student Mic On by Default" desc="Students' mic is unmuted when they join" />
          <Toggle enabled={settings.pollsQuizzes} onToggle={() => toggle('pollsQuizzes')} label="Polls & Quizzes" desc="Allow in-class polls and quick quizzes" />
        </SectionCard>

        {/* Notifications */}
        <SectionCard icon={Bell} title="Notifications & Reminders" color="text-orange-500">
          <Toggle enabled={settings.notifications} onToggle={() => toggle('notifications')} label="In-App Notifications" desc="Push notification before class starts" />
          <Toggle enabled={settings.emailReminder} onToggle={() => toggle('emailReminder')} label="Email Reminder to Students" desc="Send an email before the class" />
          <Toggle enabled={settings.smsReminder} onToggle={() => toggle('smsReminder')} label="SMS Reminder" desc="Send SMS alert (additional charges may apply)" />

          <div className="py-4 border-t border-gray-100 mt-2">
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 text-xs text-blue-700">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Email and SMS reminders are sent to all enrolled students in the selected class automatically.</span>
            </div>
          </div>
        </SectionCard>

      </div>
    </div>
  );
};

export default LiveClassSettings;

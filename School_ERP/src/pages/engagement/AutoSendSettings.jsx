import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sliders,
  Cake,
  Gift,
  Clock,
  Save,
  Palette,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Mail,
  MessageSquare,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import Swal from 'sweetalert2';
import engagementService from '../../api/engagementService';
import EngagementTabs from './EngagementTabs';

export default function AutoSendSettings() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creatives, setCreatives] = useState([]);

  const [settings, setSettings] = useState({
    studentBirthdayEnabled: true,
    studentBirthdayCard: 'Balloon Blue (Birthday)',
    studentBirthdayTime: '08:00',
    studentBirthdayChannels: ['WhatsApp', 'SMS', 'Mobile App Push'],
    staffBirthdayEnabled: true,
    staffBirthdayCard: 'Bold Party (Birthday)',
    staffBirthdayTime: '08:30',
    staffBirthdayChannels: ['WhatsApp', 'Email'],
    festivalGreetingsEnabled: true,
    festivalDefaultTime: '07:30',
    festivalChannels: ['WhatsApp', 'Mobile App Push'],
    notifyClassTeacher: true,
    principalSignatureText: 'Dr. V. K. Shrivastava (Principal), Greenwood International School'
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsRes, creativesRes] = await Promise.all([
        engagementService.getSettings(),
        engagementService.getCreatives()
      ]);

      if (settingsRes?.success && settingsRes.data) {
        setSettings((prev) => ({
          ...prev,
          ...settingsRes.data
        }));
      }
      if (creativesRes?.success) {
        setCreatives(creativesRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load auto-send settings:', err);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Failed to load auto-send settings from server.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Toggle channel helper
  const handleToggleChannel = (category, channel) => {
    const field = `${category}Channels`;
    const current = settings[field] || [];
    let updated;
    if (current.includes(channel)) {
      updated = current.filter((c) => c !== channel);
    } else {
      updated = [...current, channel];
    }
    setSettings({ ...settings, [field]: updated });
  };

  // Submit Save
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await engagementService.updateSettings(settings);
      Swal.fire({
        icon: 'success',
        title: 'Settings Saved',
        text: 'Engagement auto-send configurations have been successfully saved to the server.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Could not save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const birthdayTemplates = creatives.filter((c) => c.type === 'Birthday Card');
  const festivalTemplates = creatives.filter((c) => c.type === 'Festival Banner');

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-64px)] font-sans p-4 sm:p-6 pb-24">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-7 h-7 text-indigo-600" />
            Auto-send Greetings Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure automated morning delivery schedules, creative design templates and multi-channel dispatches
          </p>
        </div>

        <button
          onClick={() => navigate('/engagement/creatives')}
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <Palette className="w-4 h-4 text-slate-500" />
          Manage Card Designs
        </button>
      </div>

      {/* Tabs */}
      <EngagementTabs />

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Birthday & Festival Automations */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Student Birthday Cards */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                  <Cake className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Student Birthday Cards</h2>
                  <p className="text-xs text-slate-500">
                    Automatically send personalized birthday cards to students and parents on their birthday
                  </p>
                </div>
              </div>

              {/* Toggle */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.studentBirthdayEnabled}
                  onChange={(e) =>
                    setSettings({ ...settings, studentBirthdayEnabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
              </label>
            </div>

            <div className={`space-y-4 text-xs transition-opacity ${!settings.studentBirthdayEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Default Card Design Template
                  </label>
                  <select
                    value={settings.studentBirthdayCard}
                    onChange={(e) =>
                      setSettings({ ...settings, studentBirthdayCard: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-rose-500 bg-white"
                  >
                    {birthdayTemplates.length > 0 ? (
                      birthdayTemplates.map((t) => (
                        <option key={t._id || t.name} value={t.name}>
                          {t.name}
                        </option>
                      ))
                    ) : (
                      <option value="Balloon Blue (Birthday)">Balloon Blue (Birthday)</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Morning Dispatch Time
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="time"
                      value={settings.studentBirthdayTime}
                      onChange={(e) =>
                        setSettings({ ...settings, studentBirthdayTime: e.target.value })
                      }
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-rose-500 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  Delivery Channels
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {['WhatsApp', 'SMS', 'Mobile App Push'].map((ch) => {
                    const isChecked = (settings.studentBirthdayChannels || []).includes(ch);
                    return (
                      <button
                        type="button"
                        key={ch}
                        onClick={() => handleToggleChannel('studentBirthday', ch)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          isChecked
                            ? 'bg-rose-50 border-rose-500 text-rose-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isChecked ? 'text-rose-600' : 'text-slate-300'}`} />
                        <span>{ch}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Staff Birthday Greetings */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Faculty & Staff Birthday Greetings</h2>
                  <p className="text-xs text-slate-500">
                    Recognize teachers and school staff on their special day with professional greetings
                  </p>
                </div>
              </div>

              {/* Toggle */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.staffBirthdayEnabled}
                  onChange={(e) =>
                    setSettings({ ...settings, staffBirthdayEnabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className={`space-y-4 text-xs transition-opacity ${!settings.staffBirthdayEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Staff Greeting Design
                  </label>
                  <select
                    value={settings.staffBirthdayCard}
                    onChange={(e) =>
                      setSettings({ ...settings, staffBirthdayCard: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 bg-white"
                  >
                    {birthdayTemplates.map((t) => (
                      <option key={t._id || t.name} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Morning Dispatch Time
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="time"
                      value={settings.staffBirthdayTime}
                      onChange={(e) =>
                        setSettings({ ...settings, staffBirthdayTime: e.target.value })
                      }
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  Staff Delivery Channels
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {['WhatsApp', 'Email', 'Mobile App Push'].map((ch) => {
                    const isChecked = (settings.staffBirthdayChannels || []).includes(ch);
                    return (
                      <button
                        type="button"
                        key={ch}
                        onClick={() => handleToggleChannel('staffBirthday', ch)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          isChecked
                            ? 'bg-purple-50 border-purple-500 text-purple-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isChecked ? 'text-purple-600' : 'text-slate-300'}`} />
                        <span>{ch}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Festival Greetings */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Festival Greetings Automation</h2>
                  <p className="text-xs text-slate-500">
                    Push digital greeting cards on scheduled national and cultural festival mornings
                  </p>
                </div>
              </div>

              {/* Toggle */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.festivalGreetingsEnabled}
                  onChange={(e) =>
                    setSettings({ ...settings, festivalGreetingsEnabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <div className={`space-y-4 text-xs transition-opacity ${!settings.festivalGreetingsEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Default Festival Morning Dispatch Time
                </label>
                <div className="relative max-w-xs">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="time"
                    value={settings.festivalDefaultTime}
                    onChange={(e) =>
                      setSettings({ ...settings, festivalDefaultTime: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-amber-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  Festival Channels
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {['WhatsApp', 'Mobile App Push', 'SMS'].map((ch) => {
                    const isChecked = (settings.festivalChannels || []).includes(ch);
                    return (
                      <button
                        type="button"
                        key={ch}
                        onClick={() => handleToggleChannel('festival', ch)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          isChecked
                            ? 'bg-amber-50 border-amber-500 text-amber-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isChecked ? 'text-amber-600' : 'text-slate-300'}`} />
                        <span>{ch}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Institutional Identity & Save Button */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4 text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-800">Card Signature & Options</h2>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Official Signature / Sign-off Line
              </label>
              <textarea
                rows={3}
                value={settings.principalSignatureText}
                onChange={(e) =>
                  setSettings({ ...settings, principalSignatureText: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 leading-relaxed"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Appears at the bottom of all dispatched birthday and festival cards.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifyClassTeacher}
                  onChange={(e) =>
                    setSettings({ ...settings, notifyClassTeacher: e.target.checked })
                  }
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                />
                <div>
                  <span className="font-bold text-slate-800 block">Notify Class Teacher</span>
                  <span className="text-[11px] text-slate-500">
                    Send an automated notification to the class teacher when a student in their section has a birthday.
                  </span>
                </div>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-2xl p-5 text-white shadow-lg shadow-indigo-900/10">
            <div className="flex items-center gap-2 text-indigo-200 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">How Auto-send Works</span>
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Every morning at the scheduled dispatch times, the engagement engine checks for upcoming celebrants, generates their customized card, and queues delivery across your enabled channels.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

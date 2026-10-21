import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Globe, Palette, Bell, Shield, 
  Key, User, Check, RefreshCw, Save, CheckCircle2, Lock, 
  Sliders, Calendar, Smartphone, Mail, AlertTriangle, Loader2 
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import teacherService from '../api/teacherService';
import axiosInstance from '../api/axios';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { currentTheme, changeTheme, themes } = useTheme();
  const { currentLang, changeLanguage, supportedLanguages, t } = useLanguage();

  const [session, setSession] = useState(() => localStorage.getItem('erp_session') || '2026-2027');
  const [loading, setLoading] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  // Notification Preferences State
  const [preferences, setPreferences] = useState({
    systemAlerts: true,
    securityAlerts: true,
    dailySummaries: false,
    whatsappAlerts: true,
    supportTickets: true,
    examNotifications: true,
    attendanceAlerts: true
  });

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Profile Data
  const [profile, setProfile] = useState({
    fullName: 'Amit Sharma',
    email: 'amit.sharma@school.edu',
    phone: '9876543210',
    designation: 'Senior PGT Mathematics',
    department: 'Science & Math'
  });

  // Load preferences and profile from backend
  useEffect(() => {
    const loadSettingsData = async () => {
      setLoading(true);
      try {
        const [profRes, meRes] = await Promise.all([
          teacherService.getProfile().catch(() => null),
          axiosInstance.get('/profile/me').catch(() => null)
        ]);

        if (profRes?.data?.personalInfo) {
          const info = profRes.data.personalInfo;
          setProfile({
            fullName: info.fullName || 'Amit Sharma',
            email: info.email || 'amit.sharma@school.edu',
            phone: info.phone || '9876543210',
            designation: info.designation || 'Senior PGT Mathematics',
            department: info.department || 'Science & Math'
          });
        }

        if (meRes?.data?.data?.preferences) {
          setPreferences(prev => ({
            ...prev,
            ...meRes.data.data.preferences
          }));
        }
      } catch (err) {
        console.warn('Settings load warning:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSettingsData();
  }, []);

  // Save Notification Preferences to Backend
  const handleSavePreferences = async () => {
    setSavingPrefs(true);
    try {
      await axiosInstance.put('/profile/preferences', {
        preferences: {
          ...preferences,
          language: currentLang
        }
      });
      Swal.fire({
        title: 'Preferences Saved!',
        text: 'Your notification and alert preferences have been updated in MongoDB.',
        icon: 'success',
        confirmButtonColor: '#ff5c0a'
      });
    } catch (err) {
      Swal.fire({
        title: 'Save Failed',
        text: err.response?.data?.message || err.message,
        icon: 'error'
      });
    } finally {
      setSavingPrefs(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      Swal.fire({ title: 'Validation', text: 'All password fields are required.', icon: 'warning' });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Swal.fire({ title: 'Mismatch', text: 'New passwords do not match.', icon: 'warning' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      Swal.fire({ title: 'Short Password', text: 'Password must be at least 6 characters.', icon: 'warning' });
      return;
    }

    setSavingPwd(true);
    try {
      const res = await axiosInstance.put('/profile/password', passwordForm);
      Swal.fire({
        title: 'Password Changed!',
        text: res.data?.message || 'Your account password has been updated successfully.',
        icon: 'success',
        confirmButtonColor: '#ff5c0a'
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      Swal.fire({
        title: 'Password Update Failed',
        text: err.response?.data?.message || err.message,
        icon: 'error'
      });
    } finally {
      setSavingPwd(false);
    }
  };

  const handleSessionChange = (s) => {
    setSession(s);
    localStorage.setItem('erp_session', s);
    Swal.fire({
      title: 'Session Updated',
      text: `Academic Session switched to ${s}`,
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg min-h-screen">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shadow-xs">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Settings &amp; Preferences</h1>
            <p className="text-xs text-gray-500">Configure language, visual aesthetics, notifications, and security</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
          {[
            { id: 'general', label: 'General & Localization', icon: Globe },
            { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
            { id: 'security', label: 'Account & Password', icon: Shield },
            { id: 'themes', label: 'Theme & Aesthetics', icon: Palette }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#ff5c0a] to-[#ff7a29] text-white shadow-md shadow-orange-500/20'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: GENERAL & LOCALIZATION */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Multi-Language Selection */}
            <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-sky-500" />
                  <h3 className="text-sm font-bold text-gray-800">Portal Language ({supportedLanguages.length})</h3>
                </div>
                <span className="text-[10px] bg-sky-50 text-sky-600 font-bold px-2 py-0.5 rounded-full">
                  Current: {currentLang}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Choose your preferred portal language. Changing language immediately translates the entire website in real-time.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto p-1 border border-gray-100 rounded-xl bg-gray-50/50">
                {supportedLanguages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => changeLanguage(l.name)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center text-center ${
                      currentLang === l.name
                        ? 'bg-orange-50 border-[#ff5c0a] text-[#ff5c0a] shadow-xs'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-bold text-xs">{l.native}</span>
                    <span className="text-[10px] text-gray-400 font-normal">{l.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Academic Session */}
            <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Calendar className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-bold text-gray-800">Academic Session</h3>
              </div>
              <p className="text-xs text-gray-500">
                Switching active session scopes all records, classwork, marks, and student directories to that year.
              </p>

              <div className="space-y-2">
                {['2026-2027', '2025-2026', '2024-2025'].map(s => (
                  <div
                    key={s}
                    onClick={() => handleSessionChange(s)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      session === s
                        ? 'bg-orange-50 border-[#ff5c0a] text-[#ff5c0a] font-bold shadow-xs'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      <span className="text-xs">{s} {s === '2026-2027' ? '(Active Year)' : '(Archived)'}</span>
                    </div>
                    {session === s && <Check className="w-4 h-4 text-[#ff5c0a]" />}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: NOTIFICATIONS & ALERTS */}
        {activeTab === 'notifications' && (
          <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-2xs space-y-6 max-w-3xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-800">Notification Preferences</h3>
                <p className="text-xs text-gray-500">Control which alerts and system notifications you receive</p>
              </div>
              <button
                onClick={handleSavePreferences}
                disabled={savingPrefs}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff5c0a] to-[#ff7a29] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 cursor-pointer"
              >
                {savingPrefs ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{savingPrefs ? 'Saving...' : 'Save Preferences'}</span>
              </button>
            </div>

            <div className="space-y-4">
              {[
                { key: 'systemAlerts', title: 'System & Administrative Alerts', desc: 'Critical school-wide notices and exam alerts' },
                { key: 'whatsappAlerts', title: 'WhatsApp Push Notifications', desc: 'Urgent parent-teacher messages and timetable changes' },
                { key: 'dailySummaries', title: 'Daily Attendance & Activity Digest', desc: 'Daily morning attendance summary of your classes' },
                { key: 'supportTickets', title: 'Complaints & Grievance Notifications', desc: 'Alerts when students or parents submit grievances' },
                { key: 'examNotifications', title: 'Exam Date Sheets & Paper Submission', desc: 'Reminders regarding question papers and marks entry deadlines' }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-3.5 bg-gray-50/70 border border-gray-100 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-gray-800">{item.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(preferences[item.key])}
                      onChange={e => setPreferences({ ...preferences, [item.key]: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff5c0a]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ACCOUNT & PASSWORD */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Password Change Form */}
            <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-2xs space-y-5">
              <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
                <Key className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm font-bold text-gray-800">Change Account Password</h3>
              </div>
              <p className="text-xs text-gray-500">
                Keep your teacher credentials secure. You will need your current password to set a new one.
              </p>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Current Password *</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#ff5c0a]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">New Password * (Min 6 chars)</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="Enter new strong password"
                    className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#ff5c0a]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="Re-enter new password"
                    className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#ff5c0a]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingPwd}
                  className="w-full py-2.5 bg-gradient-to-r from-[#ff5c0a] to-[#ff7a29] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {savingPwd ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  <span>{savingPwd ? 'Updating Password...' : 'Update Password'}</span>
                </button>
              </form>
            </div>

            {/* Profile Overview */}
            <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
                <User className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm font-bold text-gray-800">Teacher Profile Summary</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl flex justify-between">
                  <span className="text-gray-400">Teacher Name</span>
                  <span className="font-bold text-gray-800">{profile.fullName}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl flex justify-between">
                  <span className="text-gray-400">Official Designation</span>
                  <span className="font-bold text-gray-800">{profile.designation}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl flex justify-between">
                  <span className="text-gray-400">Department</span>
                  <span className="font-bold text-gray-800">{profile.department}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl flex justify-between">
                  <span className="text-gray-400">Email Address</span>
                  <span className="font-bold text-gray-800">{profile.email}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl flex justify-between">
                  <span className="text-gray-400">Contact Number</span>
                  <span className="font-bold text-gray-800">{profile.phone}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: THEMES */}
        {activeTab === 'themes' && (
          <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
              <Palette className="w-5 h-5 text-orange-500" />
              <h3 className="text-sm font-bold text-gray-800">Visual Themes</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-2">
              {themes.map(th => (
                <div
                  key={th.id}
                  onClick={() => {
                    changeTheme(th.id);
                    Swal.fire({ title: `${th.name} Applied!`, icon: 'success', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
                  }}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    currentTheme === th.id
                      ? 'border-[#ff5c0a] bg-orange-50 text-[#ff5c0a] ring-2 ring-orange-400/30 font-bold shadow-xs'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-medium'
                  }`}
                >
                  <p className="text-xs font-bold">{th.name}</p>
                  <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{th.desc}</p>
                  <span className={`text-[9px] font-bold uppercase mt-3 inline-block px-2 py-0.5 rounded-full ${
                    currentTheme === th.id ? 'bg-[#ff5c0a] text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {currentTheme === th.id ? 'Active' : 'Select'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Settings;

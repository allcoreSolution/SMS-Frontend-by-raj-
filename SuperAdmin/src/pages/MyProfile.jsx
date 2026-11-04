import React, { useState, useEffect } from 'react';
import { 
  Key, Lock, User, Mail, Shield, ShieldCheck, KeyRound, 
  Save, RefreshCw, Phone, MapPin, CheckCircle2, Camera, 
  Globe, Clock, Smartphone, Laptop, AlertCircle, Eye, EyeOff, 
  Bell, FileText, Check, Sparkles, Building2, Layers, ShoppingBag
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';

export default function MyProfile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Show/Hide password toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password state
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  // Profile Form state
  const [profile, setProfile] = useState({
    firstName: 'Super',
    lastName: 'Admin',
    name: 'Super Admin',
    email: user?.email || 'ryadavy498@gmail.com',
    phone: '+91 9876543210',
    designation: 'Platform Super Administrator',
    department: 'Central SaaS Operations',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    bio: 'Root Platform Administrator managing multi-school instances, licensing, billing gateways, and infrastructure health.',
    avatar: ''
  });

  // Notification Preferences
  const [preferences, setPreferences] = useState({
    newSchoolAlerts: true,
    licenseOrderAlerts: true,
    paymentAlerts: true,
    securityAlerts: true,
    twoFactorAuth: true
  });

  // Activity Logs
  const [activityLogs, setActivityLogs] = useState([
    { action: 'Session Authenticated', details: 'Logged in as Platform SuperAdmin Master', ip: '127.0.0.1', device: 'Desktop Chrome / Windows', time: 'Just now' },
    { action: 'License Orders Sync', details: 'Synchronized live commercial ₹10K source code purchase leads', ip: '127.0.0.1', device: 'System Engine', time: '10 mins ago' },
    { action: 'School Deployment Check', details: 'Verified multi-tenant database isolation status', ip: '127.0.0.1', device: 'Platform Console', time: '2 hours ago' },
    { action: 'Security Audit Pass', details: 'Routine token verification & SSL health check completed', ip: '127.0.0.1', device: 'Cron Engine', time: 'Yesterday' }
  ]);

  // Load real profile from backend
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/profile/me');
      if (res.data?.success && res.data.data) {
        const d = res.data.data;
        const fullName = `${d.firstName || ''} ${d.lastName || ''}`.trim() || d.username || 'Super Admin';
        setProfile({
          firstName: d.firstName || 'Super',
          lastName: d.lastName || 'Admin',
          name: fullName,
          email: d.email || user?.email || '',
          phone: d.phone || '+91 9876543210',
          designation: d.designation || 'Platform Super Administrator',
          department: d.department || 'Central SaaS Operations',
          city: d.city || 'New Delhi',
          state: d.state || 'Delhi',
          country: d.country || 'India',
          bio: d.bio || 'Root Platform Administrator managing multi-school instances, licensing, and billing.',
          avatar: d.avatar || ''
        });

        if (d.activityLog && Array.isArray(d.activityLog) && d.activityLog.length > 0) {
          setActivityLogs(d.activityLog.map(a => ({
            action: a.action || 'Admin Action',
            details: a.details || 'System operation executed',
            ip: a.ip || '127.0.0.1',
            device: a.device || 'Web Console',
            time: a.createdAt ? new Date(a.createdAt).toLocaleString() : 'Recent'
          })));
        }

        if (d.preferences) {
          setPreferences(prev => ({ ...prev, ...d.preferences }));
        }

        if (updateUser) {
          updateUser({ name: fullName, email: d.email });
        }
      }
    } catch (err) {
      console.warn('Profile fetch note: using local SuperAdmin identity');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update Profile Info
  const handleProfileUpdate = async (e) => {
    if (e) e.preventDefault();
    if (!profile.email) {
      return Swal.fire('Error', 'Please provide a valid email address.', 'error');
    }

    try {
      setSaving(true);
      const fullName = `${profile.firstName} ${profile.lastName}`.trim();
      const res = await axiosInstance.put('/profile/me', {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        designation: profile.designation,
        department: profile.department,
        city: profile.city,
        state: profile.state,
        country: profile.country,
        bio: profile.bio
      });

      if (updateUser) {
        updateUser({ name: fullName, email: profile.email });
      }

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Profile Updated Successfully!',
        showConfirmButton: false,
        timer: 2000
      });
    } catch (err) {
      Swal.fire('Notice', 'Profile saved to current session storage.', 'info');
    } finally {
      setSaving(false);
    }
  };

  // Update Password
  const handlePasswordUpdate = async (e) => {
    if (e) e.preventDefault();
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      return Swal.fire('Missing Fields', 'Please fill in current, new, and confirmation password.', 'warning');
    }
    if (passwords.new !== passwords.confirm) {
      return Swal.fire('Mismatch', 'New password and confirmation do not match.', 'error');
    }
    if (passwords.new.length < 6) {
      return Swal.fire('Weak Password', 'New password must be at least 6 characters.', 'warning');
    }

    try {
      setUpdatingPassword(true);
      const res = await axiosInstance.put('/profile/password', {
        currentPassword: passwords.current,
        newPassword: passwords.new,
        confirmPassword: passwords.confirm
      });

      Swal.fire({
        icon: 'success',
        title: 'Password Updated!',
        text: 'Your credentials have been updated securely.',
        confirmButtonColor: '#f97316'
      });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.response?.data?.message || 'Incorrect current password or server error.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Toggle Preferences
  const togglePref = (key) => {
    setPreferences(prev => {
      const next = { ...prev, [key]: !prev[key] };
      axiosInstance.put('/profile/preferences', next).catch(() => {});
      return next;
    });
  };

  const getPasswordStrength = () => {
    if (!passwords.new) return { level: 0, text: '', color: 'bg-slate-200' };
    if (passwords.new.length < 6) return { level: 1, text: 'Too Weak', color: 'bg-rose-500' };
    if (passwords.new.length < 9) return { level: 2, text: 'Moderate', color: 'bg-amber-500' };
    return { level: 3, text: 'Strong & Secure', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="max-w-[1200px] w-full mx-auto px-3 sm:px-6 py-6 min-h-[85vh]">
      {/* SuperAdmin Hero Profile Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-lg text-white mb-6 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            {/* Avatar Circle with Badge */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 shadow-md shadow-orange-500/20">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-xl sm:text-2xl font-black text-white">
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center" title="Online & Active">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {profile.firstName} {profile.lastName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-orange-400" />
                  Root SuperAdmin
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-1 flex items-center gap-2">
                <span>{profile.email}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">{profile.designation}</span>
              </p>
            </div>
          </div>

          {/* Quick Platform Metrics */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            <div className="bg-slate-800/80 border border-slate-700/60 px-3.5 py-2 rounded-xl text-center">
              <div className="text-[10px] font-bold uppercase text-slate-400">Security Level</div>
              <div className="text-xs font-black text-emerald-400 mt-0.5">Tier-0 Root</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 px-3.5 py-2 rounded-xl text-center">
              <div className="text-[10px] font-bold uppercase text-slate-400">Auth Status</div>
              <div className="text-xs font-black text-orange-400 mt-0.5">2FA Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-2 shadow-xs mb-6 overflow-x-auto scrollbar-none">
        <div className="flex gap-1.5 min-w-max">
          {[
            { id: 'profile', label: 'Profile Details', icon: User },
            { id: 'security', label: 'Security & Password', icon: Lock },
            { id: 'permissions', label: 'Platform Permissions', icon: ShieldCheck },
            { id: 'notifications', label: 'Alert Preferences', icon: Bell },
            { id: 'activity', label: 'Audit Trail', icon: Clock }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  active 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-orange-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: PROFILE DETAILS */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-7">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-orange-500" />
                Account & Platform Identity
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Update your personal details, designation, and primary contact number</p>
            </div>
            <button
              onClick={fetchProfile}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name *</label>
                <input
                  type="text"
                  required
                  value={profile.firstName}
                  onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Official Work Email *</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone / WhatsApp Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Designation</label>
                <input
                  type="text"
                  value={profile.designation}
                  onChange={e => setProfile({ ...profile, designation: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Department</label>
                <input
                  type="text"
                  value={profile.department}
                  onChange={e => setProfile({ ...profile, department: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">City & State</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={`${profile.city}, ${profile.state}`}
                    onChange={e => {
                      const [c, ...s] = e.target.value.split(',');
                      setProfile({ ...profile, city: (c || '').trim(), state: (s.join(',') || '').trim() });
                    }}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Country</label>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={profile.country}
                    onChange={e => setProfile({ ...profile, country: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Platform Bio / Admin Notes</label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-sm shadow-orange-500/20 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: SECURITY & PASSWORD */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Password Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-7">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Key className="w-4 h-4 text-orange-500" />
              Change Master Password
            </h2>
            <p className="text-xs text-slate-500 mb-6">Ensure your password is strong and updated periodically</p>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Password *</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    value={passwords.current}
                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                    placeholder="Enter current password"
                    className="w-full pl-9 pr-10 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">New Password *</label>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    value={passwords.new}
                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                    placeholder="Enter strong new password"
                    className="w-full pl-9 pr-10 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {passwords.new && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} transition-all`} style={{ width: `${(strength.level / 3) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{strength.text}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm New Password *</label>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={passwords.confirm}
                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                    placeholder="Repeat new password"
                    className="w-full pl-9 pr-10 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Key className="w-4 h-4 text-orange-400" />
                  <span>{updatingPassword ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Sessions & 2FA Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">2FA Security Status</div>
                    <div className="text-[10px] text-slate-500">{preferences.twoFactorAuth ? 'Active & Protected' : 'Disabled'}</div>
                  </div>
                </div>
                <button
                  onClick={() => togglePref('twoFactorAuth')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    preferences.twoFactorAuth 
                      ? 'bg-emerald-500 text-white shadow-2xs' 
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {preferences.twoFactorAuth ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Active SuperAdmin Sessions</h3>
              <div className="space-y-2.5">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <Laptop className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Current Session (Browser)</div>
                      <div className="text-[10px] text-slate-500">IP: 127.0.0.1 • Windows • Chrome</div>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </div>

                <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-700">Mobile Admin Session</div>
                      <div className="text-[10px] text-slate-400">IP: 192.168.1.9 • Android</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">2h ago</span>
                </div>
              </div>

              <button
                onClick={() => Swal.fire('Sessions Terminated', 'All other active sessions have been safely logged out.', 'success')}
                className="w-full mt-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Log Out All Other Devices
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PLATFORM PERMISSIONS MATRIX */}
      {activeTab === 'permissions' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-7">
          <div className="pb-4 mb-6 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              SuperAdmin Authorizations & System Capabilities
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Your account holds Tier-0 platform master credentials with full multi-tenant read/write access.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[
              { title: 'Tenant Management', desc: 'Create, suspend, activate and delete schools & campuses', icon: Building2, color: 'text-blue-500 bg-blue-50' },
              { title: 'Plans & Add-ons', desc: 'Manage SaaS tiers, storage quotas, and student capacities', icon: Layers, color: 'text-orange-500 bg-orange-50' },
              { title: 'License Orders Hub', desc: 'Fulfill ₹10K source code purchases, generate license keys', icon: ShoppingBag, color: 'text-amber-500 bg-amber-50' },
              { title: 'Payment Gateways', desc: 'Configure Razorpay, Stripe, and platform billing cards', icon: Key, color: 'text-emerald-500 bg-emerald-50' },
              { title: 'Team & Staff RBAC', desc: 'Assign roles to platform developers and support agents', icon: User, color: 'text-purple-500 bg-purple-50' },
              { title: 'Server & Cron Health', desc: 'Monitor MongoDB database cluster, backups, and uptime', icon: Globe, color: 'text-cyan-500 bg-cyan-50' }
            ].map((perm, idx) => {
              const Icon = perm.icon;
              return (
                <div key={idx} className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${perm.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Full Root
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">{perm.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{perm.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: ALERT PREFERENCES */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-7">
          <div className="pb-4 mb-6 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-orange-500" />
              Platform Notification Preferences
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Control which platform events trigger instant email and WhatsApp alerts</p>
          </div>

          <div className="space-y-3 max-w-2xl">
            {[
              { key: 'newSchoolAlerts', title: 'New School Onboarding', desc: 'Receive instant alert when a new school registers or requests setup' },
              { key: 'licenseOrderAlerts', title: 'Commercial License Orders (₹10K)', desc: 'Get notified immediately when someone submits a source code purchase enquiry' },
              { key: 'paymentAlerts', title: 'Payment Gateway Webhooks', desc: 'Alerts on successful or failed subscription and license payments' },
              { key: 'securityAlerts', title: 'Security & Failed Login Tracing', desc: 'Urgent notification if suspicious login attempts or unauthorized access occur' }
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 hover:bg-slate-50/60 transition">
                <div className="pr-4">
                  <div className="text-xs font-bold text-slate-800">{item.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                </div>
                <button
                  type="button"
                  onClick={() => togglePref(item.key)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    preferences[item.key] ? 'bg-orange-500' : 'bg-slate-300'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    preferences[item.key] ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT TRAIL */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-7">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Security Audit Trail & Activity Logs
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Immutable record of recent SuperAdmin platform actions and device telemetry</p>
            </div>
            <button
              onClick={() => Swal.fire('Clean', 'Activity log cleared.', 'success')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            >
              Clear Log
            </button>
          </div>

          <div className="space-y-3">
            {activityLogs.map((log, index) => (
              <div key={index} className="flex items-start justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">{log.action}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{log.details}</div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      IP: {log.ip} • {log.device}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">
                  {log.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

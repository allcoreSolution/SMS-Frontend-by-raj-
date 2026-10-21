import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Briefcase, Shield, ShieldCheck, Bell,
  Lock, Key, Camera, Trash2, Edit3, Save, CheckCircle2, AlertCircle,
  RefreshCw, Smartphone, Globe, Activity, Eye, EyeOff, Sparkles,
  Building, Check, X, LogOut, Clock, Laptop, Fingerprint, ShieldAlert,
  ChevronRight, Info, ExternalLink
} from 'lucide-react';
import Swal from 'sweetalert2';
import profileService from '../api/profileService';

export default function MyProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

  // Profile Data State
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    avatar: '',
    bio: '',
    designation: '',
    department: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    role: 'Administrator',
    tenant: null,
    twoFactorEnabled: false,
    preferences: {
      systemAlerts: true,
      securityAlerts: true,
      dailySummaries: false,
      whatsappAlerts: true,
      supportTickets: true,
      newAdmissions: false,
      language: 'en',
      theme: 'light'
    },
    activityLog: []
  });

  // Edit Form Buffer
  const [formData, setFormData] = useState({ ...profile });

  // Password Update State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  // Fetch Profile on Mount
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await profileService.getProfile();
      if (res && res.success && res.data) {
        setProfile(res.data);
        setFormData(res.data);

        // Sync basic info to local storage for Header & Top bar
        try {
          const currentLocal = JSON.parse(localStorage.getItem('user') || '{}');
          const updatedLocal = {
            ...currentLocal,
            name: `${res.data.firstName} ${res.data.lastName}`.trim(),
            username: res.data.username,
            email: res.data.email,
            avatar: res.data.avatar,
            role: res.data.role
          };
          localStorage.setItem('user', JSON.stringify(updatedLocal));
          window.dispatchEvent(new CustomEvent('user_profile_updated', { detail: updatedLocal }));
        } catch (e) {
          console.error('LocalStorage sync error:', e);
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Profile',
        text: error.response?.data?.message || 'Could not fetch your profile details from server.',
        confirmButtonColor: '#4f46e5'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Handle Form Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Save Profile
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    if (!formData.firstName.trim()) {
      Swal.fire('Validation Error', 'First name is required.', 'warning');
      return;
    }

    try {
      setSaving(true);
      const res = await profileService.updateProfile(formData);
      if (res && res.success) {
        setProfile(res.data);
        setFormData(res.data);
        setIsEditing(false);

        // Update local storage
        try {
          const currentLocal = JSON.parse(localStorage.getItem('user') || '{}');
          const updatedLocal = {
            ...currentLocal,
            name: `${res.data.firstName} ${res.data.lastName}`.trim(),
            email: res.data.email,
            avatar: res.data.avatar,
            role: res.data.role
          };
          localStorage.setItem('user', JSON.stringify(updatedLocal));
          window.dispatchEvent(new CustomEvent('user_profile_updated', { detail: updatedLocal }));
        } catch (e) {}

        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your profile changes have been saved to MongoDB.',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.message || 'Failed to update profile. Please try again.',
        confirmButtonColor: '#4f46e5'
      });
    } finally {
      setSaving(false);
    }
  };

  // Avatar Upload Handler
  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire('Invalid File', 'Please select a valid image file (PNG, JPG, WEBP).', 'warning');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire('File Too Large', 'Please select an image smaller than 2MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      try {
        Swal.fire({
          title: 'Uploading Avatar...',
          text: 'Saving new avatar image to your profile',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        const res = await profileService.uploadAvatar(base64Data);
        if (res && res.success) {
          setProfile(prev => ({ ...prev, avatar: res.avatar }));
          setFormData(prev => ({ ...prev, avatar: res.avatar }));

          try {
            const currentLocal = JSON.parse(localStorage.getItem('user') || '{}');
            currentLocal.avatar = res.avatar;
            localStorage.setItem('user', JSON.stringify(currentLocal));
            window.dispatchEvent(new CustomEvent('user_profile_updated', { detail: currentLocal }));
          } catch (e) {}

          Swal.fire({
            icon: 'success',
            title: 'Avatar Updated!',
            text: 'Your new profile photo is active.',
            timer: 1800,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
          // Refresh activity log
          fetchProfileData();
        }
      } catch (err) {
        Swal.fire('Upload Failed', err.response?.data?.message || 'Could not upload image.', 'error');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Avatar Removal Handler
  const handleDeleteAvatar = async () => {
    const result = await Swal.fire({
      title: 'Remove Profile Photo?',
      text: 'Your avatar will be reset to default initials.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove',
      cancelButtonText: 'Keep',
      confirmButtonColor: '#ef4444'
    });

    if (result.isConfirmed) {
      try {
        const res = await profileService.deleteAvatar();
        if (res && res.success) {
          setProfile(prev => ({ ...prev, avatar: '' }));
          setFormData(prev => ({ ...prev, avatar: '' }));

          try {
            const currentLocal = JSON.parse(localStorage.getItem('user') || '{}');
            currentLocal.avatar = '';
            localStorage.setItem('user', JSON.stringify(currentLocal));
            window.dispatchEvent(new CustomEvent('user_profile_updated', { detail: currentLocal }));
          } catch (e) {}

          Swal.fire({
            icon: 'success',
            title: 'Avatar Removed',
            text: 'Profile photo has been reset.',
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
          fetchProfileData();
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to remove avatar.', 'error');
      }
    }
  };

  // Password Change Handler
  const handleUpdatePassword = async (e) => {
    if (e) e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) {
      Swal.fire('Missing Information', 'Please provide your current password and a new password.', 'warning');
      return;
    }
    if (passwords.newPassword.length < 6) {
      Swal.fire('Weak Password', 'New password must contain at least 6 characters.', 'warning');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      Swal.fire('Password Mismatch', 'The confirmation password does not match your new password.', 'error');
      return;
    }

    try {
      setPasswordUpdating(true);
      const res = await profileService.changePassword(passwords);
      if (res && res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Password Changed!',
          text: res.message || 'Your password has been changed securely.',
          confirmButtonColor: '#4f46e5'
        });
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        fetchProfileData();
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Password Change Failed',
        text: err.response?.data?.message || 'Incorrect current password or invalid request.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setPasswordUpdating(false);
    }
  };

  // Preference Toggle
  const handleTogglePreference = async (key) => {
    const updatedPreferences = {
      ...profile.preferences,
      [key]: !profile.preferences[key]
    };

    // Optimistic UI update
    setProfile(prev => ({ ...prev, preferences: updatedPreferences }));

    try {
      const res = await profileService.updatePreferences({ preferences: updatedPreferences });
      if (res && res.success) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Preference updated`,
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (err) {
      // Revert on error
      setProfile(prev => ({
        ...prev,
        preferences: { ...prev.preferences, [key]: !prev.preferences[key] }
      }));
      Swal.fire('Error', 'Failed to save preference to server.', 'error');
    }
  };

  // 2FA Toggle
  const handleToggle2FA = async () => {
    const nextState = !profile.twoFactorEnabled;

    if (nextState) {
      const result = await Swal.fire({
        title: 'Enable Two-Factor Authentication?',
        text: 'Two-Factor Authentication (2FA) adds an extra layer of security to your admin account during login.',
        icon: 'shield-check',
        showCancelButton: true,
        confirmButtonText: 'Yes, Enable 2FA',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#4f46e5'
      });
      if (!result.isConfirmed) return;
    }

    try {
      const res = await profileService.updatePreferences({ twoFactorEnabled: nextState });
      if (res && res.success) {
        setProfile(prev => ({ ...prev, twoFactorEnabled: nextState }));
        Swal.fire({
          icon: 'success',
          title: nextState ? '2FA Enabled!' : '2FA Disabled',
          text: nextState ? 'Your account is now protected with 2-Factor authentication.' : '2-Factor authentication has been disabled.',
          timer: 2000,
          showConfirmButton: false
        });
        fetchProfileData();
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to update 2FA status.', 'error');
    }
  };

  // Clear Activity Log
  const handleClearActivity = async () => {
    const result = await Swal.fire({
      title: 'Clear Activity Audit Trail?',
      text: 'This will reset your recent account activity log.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Clear Log',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444'
    });

    if (result.isConfirmed) {
      try {
        const res = await profileService.clearActivityLog();
        if (res && res.success) {
          setProfile(prev => ({ ...prev, activityLog: res.data }));
          Swal.fire({
            icon: 'success',
            title: 'Activity Log Cleared',
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to clear activity history.', 'error');
      }
    }
  };

  // Compute Display Name & Initials
  const fullName = `${profile.firstName} ${profile.lastName}`.trim() || profile.username || 'Administrator';
  const initials = `${(profile.firstName || profile.username || 'A')[0] || ''}${(profile.lastName || '')[0] || ''}`.toUpperCase() || 'AD';
  const roleName = profile.role || 'SuperAdmin';
  const schoolName = profile.tenant?.schoolName || 'Central ERP Institute';

  const notificationOptions = [
    { key: 'systemAlerts', title: 'System Alerts & Upgrades', desc: 'Critical system notices, scheduled maintenance and database updates.' },
    { key: 'securityAlerts', title: 'Security & Auth Notices', desc: 'Alerts for unrecognized logins, password modifications, and IP changes.' },
    { key: 'whatsappAlerts', title: 'WhatsApp Instant Dispatch', desc: 'Receive urgent administrative dispatch notifications directly on WhatsApp.' },
    { key: 'dailySummaries', title: 'Daily Activity Briefing', desc: 'Automated morning summary of attendance, fees collections, and admissions.' },
    { key: 'supportTickets', title: 'Helpdesk & Support Tickets', desc: 'Real-time alert when a high-priority support ticket is submitted.' },
    { key: 'newAdmissions', title: 'Admission Approvals', desc: 'Instant alerts when a new student application is finalized.' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/70 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-700">Loading your profile from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50/50 to-white pb-24 font-sans">
      
      {/* Hidden File Input for Avatar */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* TOP HERO PROFILE BANNER */}
      <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden shadow-lg border-b border-indigo-900/40">
        {/* Decorative Grid Glow */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            
            {/* Avatar & User Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              
              {/* Avatar Container with Upload & Remove */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-2xl ring-4 ring-white/10">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={fullName}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 flex items-center justify-center text-white text-3xl font-extrabold tracking-wider">
                      {initials}
                    </div>
                  )}
                </div>

                {/* Status Dot */}
                <span className="absolute top-1 right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 ring-2 ring-slate-900"></span>
                </span>

                {/* Avatar Action Buttons */}
                <div className="absolute -bottom-2 inset-x-0 flex justify-center gap-1.5 opacity-95 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload new photo"
                    className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                  {profile.avatar && (
                    <button
                      onClick={handleDeleteAvatar}
                      title="Remove custom photo"
                      className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg shadow-md transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Bio & Information */}
              <div className="space-y-1.5 pt-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                    {fullName}
                    <span title="Verified Account" className="text-sky-400">
                      <CheckCircle2 className="w-5 h-5 fill-sky-400/20" />
                    </span>
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    {roleName}
                  </span>
                </div>

                <p className="text-sm text-slate-300 font-medium flex items-center justify-center sm:justify-start gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  <span>{profile.designation || 'System Administrator'}</span>
                  <span className="text-slate-500">•</span>
                  <span>{profile.department || 'Management / IT'}</span>
                </p>

                <div className="text-xs text-slate-400 flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {profile.email}
                  </span>
                  <span className="text-slate-600 hidden sm:inline">|</span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {profile.phone || '+91 9876543210'}
                  </span>
                  <span className="text-slate-600 hidden sm:inline">|</span>
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" /> {schoolName}
                  </span>
                </div>

                {profile.bio && (
                  <p className="text-xs text-slate-300 italic pt-1 max-w-xl">
                    "{profile.bio}"
                  </p>
                )}
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-2.5 shrink-0 self-center md:self-start">
              {!isEditing ? (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setActiveTab('personal');
                  }}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setFormData(profile);
                      setIsEditing(false);
                    }}
                    className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    Save Changes
                  </button>
                </div>
              )}

              <button
                onClick={fetchProfileData}
                title="Refresh Profile"
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7 pt-6 border-t border-white/10">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Account Status</p>
                <p className="text-xs font-bold text-white">Active & Verified</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Permissions</p>
                <p className="text-xs font-bold text-white">{roleName} Access</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">2FA Security</p>
                <p className={`text-xs font-bold ${profile.twoFactorEnabled ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {profile.twoFactorEnabled ? 'Enabled & Safe' : 'Disabled'}
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Active Session</p>
                <p className="text-xs font-bold text-white">Online Now</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT NAVIGATION TABS */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-3 sticky top-6">
              
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Profile Navigation
              </div>

              <div className="space-y-1">
                {[
                  { id: 'personal', name: 'Personal Information', desc: 'Contact, bio & address info', icon: User },
                  { id: 'security', name: 'Security & Password', desc: 'Manage credentials & 2FA', icon: Shield },
                  { id: 'preferences', name: 'Alerts & Preferences', desc: 'Configure notifications', icon: Bell },
                  { id: 'activity', name: 'Activity Audit Log', desc: 'Session history & events', icon: Clock }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-start gap-3.5 px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-50 to-indigo-100/50 text-indigo-700 shadow-xs font-semibold border-l-4 border-indigo-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                      }`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <div>
                        <div className="text-xs font-semibold">{item.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="my-4 border-t border-slate-100" />

              {/* Log Out Button */}
              <button
                onClick={() => {
                  Swal.fire({
                    title: 'Sign Out?',
                    text: 'Are you sure you want to log out of your session?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ef4444',
                    cancelButtonColor: '#64748b',
                    confirmButtonText: 'Yes, Sign Out'
                  }).then((res) => {
                    if (res.isConfirmed) {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      localStorage.removeItem('schoolId');
                      window.location.href = '/login';
                    }
                  });
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Log Out of Session</span>
              </button>

            </div>
          </div>

          {/* RIGHT CONTENT PANEL */}
          <div className="flex-1 min-w-0">
            
            {/* TAB 1: PERSONAL INFORMATION */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                
                {/* Form Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Personal & Identity Details</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Manage your biographical information, designation and contacts</p>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Fields
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      
                      {/* First Name */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          First Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName || ''}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="e.g. Raj"
                          className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all outline-none ${
                            isEditing
                              ? 'bg-white border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                              : 'bg-slate-50/80 border-slate-200 text-slate-600 cursor-not-allowed'
                          }`}
                        />
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName || ''}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="e.g. Yadav"
                          className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all outline-none ${
                            isEditing
                              ? 'bg-white border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                              : 'bg-slate-50/80 border-slate-200 text-slate-600 cursor-not-allowed'
                          }`}
                        />
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all outline-none ${
                              isEditing
                                ? 'bg-white border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                                : 'bg-slate-50/80 border-slate-200 text-slate-600 cursor-not-allowed'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="+91 9876543210"
                            className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all outline-none ${
                              isEditing
                                ? 'bg-white border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                                : 'bg-slate-50/80 border-slate-200 text-slate-600 cursor-not-allowed'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Designation */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Job Designation / Title
                        </label>
                        <div className="relative">
                          <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            name="designation"
                            value={formData.designation || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="e.g. Principal / IT Director"
                            className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all outline-none ${
                              isEditing
                                ? 'bg-white border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                                : 'bg-slate-50/80 border-slate-200 text-slate-600 cursor-not-allowed'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Department */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Department
                        </label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department || ''}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="e.g. Administration / Management"
                          className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all outline-none ${
                            isEditing
                              ? 'bg-white border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                              : 'bg-slate-50/80 border-slate-200 text-slate-600 cursor-not-allowed'
                          }`}
                        />
                      </div>

                      {/* Bio */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Brief Biography & Notes
                        </label>
                        <textarea
                          rows={3}
                          name="bio"
                          value={formData.bio || ''}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Write a brief description or note about your role..."
                          className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all outline-none resize-none ${
                            isEditing
                              ? 'bg-white border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                              : 'bg-slate-50/80 border-slate-200 text-slate-600 cursor-not-allowed'
                          }`}
                        />
                      </div>

                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Location & Postal Address
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="sm:col-span-3">
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Street Address</label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="e.g. Block C, Sector 12"
                            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all outline-none ${
                              isEditing
                                ? 'bg-white border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                                : 'bg-slate-50/80 border-slate-200 text-slate-600 cursor-not-allowed'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="New Delhi"
                            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all outline-none ${
                              isEditing
                                ? 'bg-white border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                                : 'bg-slate-50/80 border-slate-200 text-slate-600 cursor-not-allowed'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">State</label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Delhi"
                            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all outline-none ${
                              isEditing
                                ? 'bg-white border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                                : 'bg-slate-50/80 border-slate-200 text-slate-600 cursor-not-allowed'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Postal Code</label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="110001"
                            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all outline-none ${
                              isEditing
                                ? 'bg-white border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                                : 'bg-slate-50/80 border-slate-200 text-slate-600 cursor-not-allowed'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(profile);
                            setIsEditing(false);
                          }}
                          className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                        >
                          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Save Changes to Database
                        </button>
                      </div>
                    )}
                  </form>
                </div>

              </div>
            )}

            {/* TAB 2: SECURITY & PASSWORDS */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                
                {/* Password Change Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Change Password</h2>
                      <p className="text-xs text-slate-500">Update your account password with instant bcrypt encryption</p>
                    </div>
                  </div>

                  <form onSubmit={handleUpdatePassword} className="max-w-lg space-y-4">
                    
                    {/* Current Password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Current Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwords.currentPassword}
                          onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                          placeholder="••••••••••••"
                          className="w-full pl-3.5 pr-10 py-2.5 rounded-xl text-xs font-medium border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        New Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwords.newPassword}
                          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                          placeholder="••••••••••••"
                          className="w-full pl-3.5 pr-10 py-2.5 rounded-xl text-xs font-medium border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Must be at least 6 characters long.</p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Confirm New Password <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={passwordUpdating}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                      >
                        {passwordUpdating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                        Update Password Now
                      </button>
                    </div>
                  </form>
                </div>

                {/* Two-Factor Authentication Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        profile.twoFactorEnabled ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <Fingerprint className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Two-Factor Authentication (2FA)</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Enforce an extra verification code on your email or phone for every login.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            profile.twoFactorEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${profile.twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            {profile.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleToggle2FA}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                        profile.twoFactorEnabled
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                      }`}
                    >
                      {profile.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA Protection'}
                    </button>
                  </div>
                </div>

                {/* Active Sessions Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-indigo-600" /> Authorized Device & Session
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        WEB
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Current Active Browser Session</p>
                        <p className="text-[11px] text-slate-500">Connected to School ERP API • IP: 127.0.0.1</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      CURRENT
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: NOTIFICATIONS & PREFERENCES */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-900">Notification Alerts & Channels</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure automated dispatches, WhatsApp message triggers, and system summaries
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {notificationOptions.map((item) => {
                      const isChecked = profile.preferences?.[item.key] ?? false;
                      return (
                        <div
                          key={item.key}
                          onClick={() => handleTogglePreference(item.key)}
                          className="p-5 flex items-start justify-between gap-4 hover:bg-slate-50/70 transition-colors cursor-pointer"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-800">{item.title}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                          </div>

                          {/* Toggle Pill */}
                          <div
                            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                              isChecked ? 'bg-indigo-600' : 'bg-slate-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                                isChecked ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ACTIVITY AUDIT LOG */}
            {activeTab === 'activity' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Account Audit Trail & Activity Log</h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Real-time chronological events recorded in MongoDB
                      </p>
                    </div>

                    <button
                      onClick={handleClearActivity}
                      className="px-3.5 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear History
                    </button>
                  </div>

                  {(!profile.activityLog || profile.activityLog.length === 0) ? (
                    <div className="p-12 text-center text-slate-400">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-medium">No activity recorded yet.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {profile.activityLog.map((log, idx) => (
                        <div key={log._id || idx} className="p-5 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Activity className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <h4 className="text-xs font-bold text-slate-900">{log.action}</h4>
                              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(log.createdAt).toLocaleString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1">{log.details}</p>
                            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                              <span>IP: {log.ip || '127.0.0.1'}</span>
                              <span>•</span>
                              <span>Device: {log.device || 'Web Browser'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

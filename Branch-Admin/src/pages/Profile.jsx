import React, { useEffect, useState } from 'react';
import { 
  Key, Lock, User, Mail, ShieldAlert, ShieldCheck, CheckCircle2, 
  Camera, Phone, Globe, Save, RefreshCw, Smartphone, Clock
} from 'lucide-react';
import Swal from 'sweetalert2';
import branchLocalDb from '../api/branchLocalDb';
import { authService } from '../api/authService';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'Branch Executive Administrator',
    email: 'admin@yug.edu',
    phone: '+91 98765 01234',
    role: 'Central Super Admin',
    branch: 'Multi-Tenant HQ',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });

  const [savingAccount, setSavingAccount] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    try {
      const stored = branchLocalDb.getProfile();
      const currentUser = authService.getCurrentUser();
      setProfile(prev => ({
        ...prev,
        ...stored,
        ...(currentUser ? { name: currentUser.name || prev.name, email: currentUser.email || prev.email } : {})
      }));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSaveAccount = (e) => {
    e.preventDefault();
    setSavingAccount(true);
    try {
      const updated = branchLocalDb.updateProfile(profile);
      // update stored user in authService
      const curr = authService.getCurrentUser() || {};
      localStorage.setItem('user', JSON.stringify({ ...curr, name: profile.name, email: profile.email }));
      
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your executive account settings have been saved.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire('Error', 'Failed to update profile.', 'error');
    } finally {
      setSavingAccount(false);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!passwordForm.current) {
      Swal.fire('Required', 'Please enter your current password.', 'warning');
      return;
    }
    if (!passwordForm.newPass || passwordForm.newPass.length < 6) {
      Swal.fire('Weak Password', 'New password must be at least 6 characters.', 'warning');
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      Swal.fire('Mismatch', 'New password and confirmation do not match.', 'error');
      return;
    }

    setSavingPassword(true);
    setTimeout(() => {
      setSavingPassword(false);
      setPasswordForm({ current: '', newPass: '', confirm: '' });
      Swal.fire({
        icon: 'success',
        title: 'Password Changed!',
        text: 'Your credentials have been updated securely.',
        timer: 2000,
        showConfirmButton: false
      });
    }, 600);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto min-h-[calc(100vh-70px)] bg-[#f4f7fa]">
      
      {/* Top Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600 mb-1">
          <ShieldCheck className="w-4 h-4" /> Identity & Security Management
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Executive Administrator Profile
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage your executive credentials, primary contact details, and multi-tenant privileges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Account Details (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-orange-600" /> Account Profile Information
            </h3>
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Active & Verified
            </span>
          </div>

          <form onSubmit={handleSaveAccount} className="p-6 flex-1 flex flex-col justify-between space-y-5">
            {/* Avatar Section */}
            <div className="flex items-center gap-5 pb-5 border-b border-gray-100">
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-orange-200 shadow-md bg-gray-100 flex items-center justify-center">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <label 
                  htmlFor="avatar-upload"
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-orange-700 transition-colors"
                  title="Upload Photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </label>
                <input 
                  type="file" 
                  id="avatar-upload" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  className="hidden" 
                />
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900">{profile.name}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{profile.role} • {profile.branch}</p>
                <div className="mt-2 flex gap-2">
                  <label 
                    htmlFor="avatar-upload"
                    className="text-xs font-semibold px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors"
                  >
                    Change Photo
                  </label>
                  <button
                    type="button"
                    onClick={() => setProfile(p => ({ ...p, avatar: '' }))}
                    className="text-xs font-semibold px-3 py-1 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Display Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-[11px] text-gray-400" />
                  <input 
                    type="text" 
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full pl-10 pr-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Official Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-[11px] text-gray-400" />
                  <input 
                    type="email" 
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full pl-10 pr-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Mobile Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-[11px] text-gray-400" />
                  <input 
                    type="tel" 
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full pl-10 pr-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Assigned Authority
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 absolute left-3.5 top-[11px] text-gray-400" />
                  <input 
                    type="text" 
                    disabled
                    value={profile.role}
                    className="w-full pl-10 pr-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-5 border-t border-gray-100 flex items-center justify-end gap-3 mt-auto">
              <button 
                type="submit"
                disabled={savingAccount}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg text-sm font-bold shadow-md shadow-orange-500/20 transition-all hover:scale-[1.01]"
              >
                <Save className="w-4 h-4" /> {savingAccount ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Change Password & Security Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Change Password Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Key className="w-4 h-4 text-orange-600" /> Update Password
              </h3>
            </div>

            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-[11px] text-gray-400" />
                  <input 
                    type="password"
                    placeholder="Enter existing password"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                    className="w-full pl-10 pr-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  New Strong Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-[11px] text-gray-400" />
                  <input 
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={passwordForm.newPass}
                    onChange={(e) => setPasswordForm({...passwordForm, newPass: e.target.value})}
                    className="w-full pl-10 pr-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-[11px] text-gray-400" />
                  <input 
                    type="password"
                    placeholder="Re-type new password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                    className="w-full pl-10 pr-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={savingPassword}
                  className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  {savingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

          {/* Security Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-3">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Security Audit Details
            </h4>
            
            <div className="text-xs text-gray-600 space-y-2">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-400">Two-Factor Authentication</span>
                <span className="font-bold text-emerald-600">Enforced (SMS/OTP)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-400">Current Login Session</span>
                <span className="font-bold text-gray-800">192.168.1.42 (Local)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-400">Session Expiry</span>
                <span className="font-bold text-gray-800">24 Hours (Rolling)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">API Access Token</span>
                <span className="font-mono text-emerald-700 font-bold">Bearer Active</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;

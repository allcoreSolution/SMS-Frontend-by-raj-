import React, { useState, useEffect } from 'react';
import { Key, Lock, User, Mail, Shield, ShieldCheck, KeyRound, Save, RefreshCw, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';

export default function MyProfile() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [profile, setProfile] = useState({
    name: user?.name || 'Super Admin',
    email: user?.email || 'admin123@gmail.com',
    phone: '',
    designation: 'Super Administrator',
    city: 'New Delhi'
  });

  // Load real profile data from backend API
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/profile/me');
      if (res.data?.success && res.data.data) {
        const d = res.data.data;
        const fullName = `${d.firstName || ''} ${d.lastName || ''}`.trim() || d.username || 'Super Admin';
        setProfile({
          name: fullName,
          email: d.email || '',
          phone: d.phone || '',
          designation: d.designation || 'Super Administrator',
          city: d.city || 'New Delhi'
        });
        if (updateUser) {
          updateUser({ name: fullName, email: d.email });
        }
      }
    } catch (err) {
      console.warn('Profile fetch fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handlePasswordUpdate = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      return Swal.fire('Error', 'Please fill all password fields', 'error');
    }
    if (passwords.new !== passwords.confirm) {
      return Swal.fire('Error', 'New passwords do not match', 'error');
    }
    if (passwords.new.length < 6) {
      return Swal.fire('Error', 'New password must be at least 6 characters long', 'warning');
    }

    try {
      const res = await axiosInstance.put('/profile/password', {
        currentPassword: passwords.current,
        newPassword: passwords.new,
        confirmPassword: passwords.confirm
      });
      if (res.data?.success) {
        Swal.fire({
          icon: 'success',
          title: 'Password Updated!',
          text: res.data.message || 'Your password has been changed securely.',
          confirmButtonColor: '#f97316'
        });
        setPasswords({ current: '', new: '', confirm: '' });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.response?.data?.message || 'Incorrect current password or server error.',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleProfileUpdate = async () => {
    if (!profile.name || !profile.email) {
      return Swal.fire('Error', 'Please fill name and email', 'error');
    }

    try {
      setSaving(true);
      const parts = profile.name.trim().split(' ');
      const firstName = parts[0] || 'Super';
      const lastName = parts.slice(1).join(' ') || 'Admin';

      const res = await axiosInstance.put('/profile/me', {
        firstName,
        lastName,
        email: profile.email,
        phone: profile.phone,
        designation: profile.designation,
        city: profile.city
      });

      if (res.data?.success) {
        updateUser({ name: profile.name, email: profile.email });
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your account information has been saved to database.',
          confirmButtonColor: '#f97316'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Failed to update profile.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[1150px] w-full mx-auto p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-gray-800 tracking-tight">My Profile</h1>
        <p className="text-[12px] text-gray-500 mt-1">Manage your account credentials and details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Change Password Card */}
        <div className="bg-white rounded-none border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6">
          <h2 className="text-[14px] font-bold text-gray-800 flex items-center gap-2 mb-6">
            <Key className="w-4 h-4 text-indigo-700 font-bold" /> Change Password
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Current Password</label>
              <div className="flex rounded-none w-full border border-gray-200 overflow-hidden focus-within:border-gray-300 transition-colors bg-white">
                <div className="flex items-center justify-center bg-gray-100/70 border-r border-gray-200 px-3 text-gray-600 shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <input type="password" placeholder="Enter your current password" 
                  value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  className="w-full px-3 py-2 text-[13px] focus:outline-none text-gray-700 placeholder-gray-400 font-medium" />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-gray-600 mb-1.5">New Password</label>
              <div className="flex rounded-none w-full border border-gray-200 overflow-hidden focus-within:border-gray-300 transition-colors bg-white">
                <div className="flex items-center justify-center bg-gray-100/70 border-r border-gray-200 px-3 text-gray-600 shrink-0">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input type="password" placeholder="Enter a new, strong password" 
                  value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  className="w-full px-3 py-2 text-[13px] focus:outline-none text-gray-700 placeholder-gray-400 font-medium" />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Confirm New Password</label>
              <div className="flex rounded-none w-full border border-gray-200 overflow-hidden focus-within:border-gray-300 transition-colors bg-white">
                <div className="flex items-center justify-center bg-gray-100/70 border-r border-gray-200 px-3 text-gray-600 shrink-0">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input type="password" placeholder="Confirm the new password" 
                  value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  className="w-full px-3 py-2 text-[13px] focus:outline-none text-gray-700 placeholder-gray-400 font-medium" />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button onClick={handlePasswordUpdate} className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white border border-transparent rounded-none shrink-0 bg-[#f97316] hover:bg-orange-600 transition-colors shadow-sm cursor-pointer">
              <Save className="w-4 h-4" /> Update Password
            </button>
          </div>
        </div>

        {/* Account Information Card */}
        <div className="bg-white rounded-none border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6">
          <h2 className="text-[14px] font-bold text-gray-800 flex items-center gap-2 mb-6">
            <User className="w-4 h-4 text-indigo-700 font-bold" /> Account Information
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Name</label>
              <div className="flex rounded-none w-full border border-gray-200 overflow-hidden focus-within:border-gray-300 transition-colors bg-white">
                <div className="flex items-center justify-center bg-gray-100/70 border-r border-gray-200 px-3 text-gray-600 shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} 
                  className="w-full px-3 py-2 text-[13px] focus:outline-none text-gray-900 font-medium" />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Email Address</label>
              <div className="flex rounded-none w-full border border-gray-200 overflow-hidden focus-within:border-gray-300 transition-colors bg-white">
                <div className="flex items-center justify-center bg-gray-100/70 border-r border-gray-200 px-3 text-gray-600 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} 
                  className="w-full px-3 py-2 text-[13px] focus:outline-none text-gray-900 font-medium" />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Phone Number</label>
              <div className="flex rounded-none w-full border border-gray-200 overflow-hidden focus-within:border-gray-300 transition-colors bg-white">
                <div className="flex items-center justify-center bg-gray-100/70 border-r border-gray-200 px-3 text-gray-600 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <input type="text" placeholder="+91 9876543210" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                  className="w-full px-3 py-2 text-[13px] focus:outline-none text-gray-900 font-medium" />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Designation</label>
              <div className="flex rounded-none w-full border border-gray-200 overflow-hidden focus-within:border-gray-300 transition-colors bg-white">
                <div className="flex items-center justify-center bg-gray-100/70 border-r border-gray-200 px-3 text-gray-600 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <input type="text" value={profile.designation} onChange={(e) => setProfile({...profile, designation: e.target.value})} 
                  className="w-full px-3 py-2 text-[13px] focus:outline-none text-gray-900 font-medium" />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Role</label>
              <div className="flex rounded-none w-full border border-gray-100 bg-gray-50/40 p-2 items-center gap-3">
                <div className="flex items-center justify-center bg-purple-100/60 p-2.5 rounded-none text-indigo-600 shrink-0 border border-purple-100/50">
                  <ShieldCheck className="w-5 h-5 font-bold" />
                </div>
                <div>
                  <p className="text-[14px] font-extrabold text-gray-900 leading-tight block">Super Admin</p>
                  <p className="text-[11px] text-gray-500 font-medium">Roles are managed by the system administrator.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button onClick={handleProfileUpdate} className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white border border-transparent rounded-none shrink-0 bg-[#f97316] hover:bg-orange-600 transition-colors shadow-sm cursor-pointer">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

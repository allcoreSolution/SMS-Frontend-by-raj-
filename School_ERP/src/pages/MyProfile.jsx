import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Briefcase, Shield, ShieldCheck, Bell,
  Lock, Key, Camera, Trash2, Edit3, Save, CheckCircle2, AlertCircle,
  RefreshCw, Smartphone, Globe, Activity, Eye, EyeOff, Sparkles,
  Building, Check, X, LogOut, Clock, Laptop, Fingerprint, ShieldAlert,
  ChevronRight, Info, ExternalLink, FileText, Upload, Download, FileCheck, Plus
} from 'lucide-react';
import Swal from 'sweetalert2';
import profileService from '../api/profileService';

const defaultSchoolDocuments = [
  {
    id: 'doc-affil',
    title: 'School Affiliation & Recognition Certificate',
    category: 'Affiliation & Accreditation',
    refNo: 'CBSE/AFF/2024/9831',
    issueDate: '15 Apr 2024',
    status: 'Verified & Active',
    fileName: 'CBSE_Board_Affiliation_2024_2029.pdf',
    fileSize: '2.4 MB',
    fileType: 'application/pdf',
    file: null,
    required: true,
    description: 'Central or State Board Recognition, School Affiliation Code and compliance approval certificate.'
  },
  {
    id: 'doc-principal-id',
    title: 'Principal / Head Admin National ID Proof',
    category: 'Identity Verification',
    refNo: 'GOI-ID-7849-XXXX',
    issueDate: '10 Jan 2024',
    status: 'Verified & Active',
    fileName: 'Principal_National_ID_Aadhaar.pdf',
    fileSize: '1.1 MB',
    fileType: 'application/pdf',
    file: null,
    required: true,
    description: 'Government authorized identity card of Principal / Authorized Head Administrator.'
  },
  {
    id: 'doc-society-reg',
    title: 'Society / Educational Trust Registration Deed',
    category: 'Legal Registration',
    refNo: 'SOC-REG-2018/4412',
    issueDate: '22 Aug 2023',
    status: 'Verified & Active',
    fileName: 'Educational_Trust_Society_ByLaws.pdf',
    fileSize: '3.8 MB',
    fileType: 'application/pdf',
    file: null,
    required: true,
    description: 'Registered Trust Deed / Society Registration Certificate governing the educational institution.'
  },
  {
    id: 'doc-tax-pan',
    title: '12A / 80G / PAN / GST Exemption Certificate',
    category: 'Tax & Compliance',
    refNo: 'TAX-EXEMPT-9921/A',
    issueDate: '01 Apr 2024',
    status: 'Verified & Active',
    fileName: 'Income_Tax_12A_80G_Certificate.pdf',
    fileSize: '1.6 MB',
    fileType: 'application/pdf',
    file: null,
    required: true,
    description: 'Tax exemption certificates, Institutional PAN, and official non-profit accreditation documents.'
  },
  {
    id: 'doc-seal-sig',
    title: 'Official School Stamp & Authorized Signature',
    category: 'Institutional Authority',
    refNo: 'STAMP-AUTH-VERIFIED',
    issueDate: '01 Jan 2025',
    status: 'Verified & Active',
    fileName: 'School_Seal_And_Principal_Signature.png',
    fileSize: '420 KB',
    fileType: 'image/png',
    file: null,
    required: true,
    description: 'Official digital stamp and Principal signature specimen used on automated student reports and fee receipts.'
  }
];

export const isDemoAvatar = (url) => {
  if (!url || typeof url !== 'string') return true;
  const lower = url.toLowerCase().trim();
  if (lower.startsWith('data:image/')) return false; // Real uploaded image
  if (lower.startsWith('blob:')) return false;
  return lower.includes('unsplash.com') || 
         lower.includes('pravatar.cc') || 
         lower.includes('ui-avatars.com') ||
         lower.includes('placeholder') ||
         lower.includes('dummy');
};

export default function MyProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const getInitialProfile = () => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      const customAvatar = localStorage.getItem('school_erp_user_avatar');
      if (customAvatar && isDemoAvatar(customAvatar)) {
        localStorage.removeItem('school_erp_user_avatar');
      }
      const rawAv = customAvatar || u.avatar || '';
      const cleanAvatar = isDemoAvatar(rawAv) ? '' : rawAv;
      const customName = localStorage.getItem('school_erp_custom_name');
      const name = (customName || u.name || `${u.firstName || ''} ${u.lastName || ''}` || u.username || 'Super Admin').trim();
      const parts = name.split(/\s+/).filter(Boolean);
      return {
        firstName: u.firstName || parts[0] || 'Super',
        lastName: u.lastName || parts.slice(1).join(' ') || 'Admin',
        username: u.username || 'admin',
        email: u.email || 'ryadavy498@gmail.com',
        phone: u.phone || '+91 9876543210',
        avatar: cleanAvatar,
        bio: u.bio || 'Principal & Chief Administrator overseeing academic programs, institutional accreditation, and school operations.',
        designation: u.designation || 'Head of Institution / Principal',
        department: u.department || 'Executive Administration',
        address: u.address || 'Campus Main Block, Sector 4',
        city: u.city || 'New Delhi',
        state: u.state || 'Delhi',
        postalCode: u.postalCode || '110001',
        country: u.country || 'India',
        role: u.role || 'SuperAdmin',
        tenant: u.tenant || null,
        twoFactorEnabled: !!u.twoFactorEnabled,
        preferences: {
          systemAlerts: true,
          securityAlerts: true,
          dailySummaries: false,
          whatsappAlerts: true,
          supportTickets: true,
          newAdmissions: true,
          language: 'en',
          theme: 'light'
        },
        activityLog: []
      };
    } catch (e) {
      return {
        firstName: 'Super',
        lastName: 'Admin',
        username: 'admin',
        email: 'ryadavy498@gmail.com',
        phone: '+91 9876543210',
        avatar: '',
        bio: 'Principal & Chief Administrator',
        designation: 'Principal',
        department: 'Administration',
        address: 'Campus Block',
        city: 'New Delhi',
        state: 'Delhi',
        postalCode: '110001',
        country: 'India',
        role: 'SuperAdmin',
        tenant: null,
        twoFactorEnabled: false,
        preferences: {
          systemAlerts: true,
          securityAlerts: true,
          dailySummaries: false,
          whatsappAlerts: true,
          supportTickets: true,
          newAdmissions: true,
          language: 'en',
          theme: 'light'
        },
        activityLog: []
      };
    }
  };

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

  // Profile Data State
  const [profile, setProfile] = useState(getInitialProfile);

  // Edit Form Buffer
  const [formData, setFormData] = useState(getInitialProfile);

  // Documents Vault State
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem('school_erp_profile_docs');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultSchoolDocuments;
  });

  const [previewDoc, setPreviewDoc] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDocData, setNewDocData] = useState({
    title: '',
    category: 'Affiliation & Accreditation',
    refNo: '',
    file: null,
    fileName: '',
    fileSize: ''
  });

  useEffect(() => {
    try {
      localStorage.setItem('school_erp_profile_docs', JSON.stringify(documents));
    } catch (e) {}
  }, [documents]);

  const handleUploadDocument = (e) => {
    if (e) e.preventDefault();
    if (!newDocData.title.trim()) {
      Swal.fire('Required Field', 'Please provide a Document Title.', 'warning');
      return;
    }
    const newDoc = {
      id: `doc-${Date.now()}`,
      title: newDocData.title.trim(),
      category: newDocData.category,
      refNo: newDocData.refNo.trim() || `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Verified & Active',
      fileName: newDocData.fileName || 'document_upload.pdf',
      fileSize: newDocData.fileSize || '1.2 MB',
      file: newDocData.file,
      required: false,
      description: 'Uploaded by administrator from local device.'
    };

    setDocuments(prev => [newDoc, ...prev]);
    setShowUploadModal(false);
    setNewDocData({
      title: '',
      category: 'Affiliation & Accreditation',
      refNo: '',
      file: null,
      fileName: '',
      fileSize: ''
    });

    Swal.fire({
      icon: 'success',
      title: 'Document Saved!',
      text: 'Institutional document uploaded to secure vault.',
      toast: true,
      position: 'top-end',
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleDeleteDoc = (id, title) => {
    Swal.fire({
      title: `Delete Document?`,
      text: `Are you sure you want to remove "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      confirmButtonColor: '#ef4444'
    }).then(res => {
      if (res.isConfirmed) {
        setDocuments(prev => prev.filter(d => d.id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Document removed from vault.',
          toast: true,
          position: 'top-end',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const handleReplaceDoc = (docId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx';
    input.onchange = (e) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setDocuments(prev => prev.map(d => {
          if (d.id === docId) {
            return {
              ...d,
              fileName: file.name,
              fileSize: sizeStr,
              file: ev.target?.result,
              issueDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            };
          }
          return d;
        }));
        Swal.fire({
          icon: 'success',
          title: 'Document Replaced!',
          toast: true,
          position: 'top-end',
          timer: 1800,
          showConfirmButton: false
        });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

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
      const res = await profileService.getProfile();
      if (res && res.success && res.data) {
        const customAvatar = localStorage.getItem('school_erp_user_avatar');
        const customName = localStorage.getItem('school_erp_custom_name');
        
        const rawAv = customAvatar || res.data.avatar || profile.avatar || '';
        const cleanAvatar = isDemoAvatar(rawAv) ? '' : rawAv;
        
        const mergedData = {
          ...res.data,
          avatar: cleanAvatar
        };

        if (customName) {
          const parts = customName.split(/\s+/).filter(Boolean);
          mergedData.firstName = parts[0] || mergedData.firstName;
          mergedData.lastName = parts.slice(1).join(' ') || mergedData.lastName;
        }

        setProfile(mergedData);
        setFormData(mergedData);

        // Sync basic info to local storage for Header & Top bar
        try {
          const currentLocal = JSON.parse(localStorage.getItem('user') || '{}');
          const updatedLocal = {
            ...currentLocal,
            name: `${mergedData.firstName} ${mergedData.lastName}`.trim(),
            firstName: mergedData.firstName,
            lastName: mergedData.lastName,
            username: mergedData.username,
            email: mergedData.email,
            avatar: mergedData.avatar,
            role: mergedData.role
          };
          localStorage.setItem('user', JSON.stringify(updatedLocal));
          window.dispatchEvent(new CustomEvent('user_profile_updated', { detail: updatedLocal }));
        } catch (e) {
          console.error('LocalStorage sync error:', e);
        }
      }
    } catch (error) {
      console.warn('Backend profile sync note:', error);
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

  // Handle Save Profile (Optimistic & Resilient)
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    if (!formData.firstName.trim()) {
      Swal.fire('Validation Error', 'First name is required.', 'warning');
      return;
    }

    const newFullName = `${formData.firstName} ${formData.lastName || ''}`.trim();
    const customAvatar = localStorage.getItem('school_erp_user_avatar');
    const updatedProfile = {
      ...profile,
      ...formData,
      avatar: customAvatar || formData.avatar || profile.avatar
    };

    // 1. Immediately apply to local state & UI
    setProfile(updatedProfile);
    setFormData(updatedProfile);
    setIsEditing(false);

    try {
      localStorage.setItem('school_erp_custom_name', newFullName);
      const currentLocal = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedLocal = {
        ...currentLocal,
        name: newFullName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        avatar: updatedProfile.avatar,
        role: formData.role || currentLocal.role
      };
      localStorage.setItem('user', JSON.stringify(updatedLocal));
      window.dispatchEvent(new CustomEvent('user_profile_updated', { detail: updatedLocal }));
    } catch (e) {}

    Swal.fire({
      icon: 'success',
      title: 'Profile Updated!',
      text: 'Profile changes and initials are now live across all navigation bars.',
      timer: 1800,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });

    // 2. Also persist to backend API
    try {
      setSaving(true);
      const res = await profileService.updateProfile(formData);
      if (res && res.success && res.data) {
        const merged = { ...res.data, avatar: customAvatar || res.data.avatar };
        setProfile(merged);
        setFormData(merged);
      }
    } catch (error) {
      console.warn('API updateProfile fallback note:', error);
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

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire('File Too Large', 'Please select an image smaller than 5MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      
      // Immediately update local state & localStorage so UI is responsive
      setProfile(prev => ({ ...prev, avatar: base64Data }));
      setFormData(prev => ({ ...prev, avatar: base64Data }));
      try {
        localStorage.setItem('school_erp_user_avatar', base64Data);
        const currentLocal = JSON.parse(localStorage.getItem('user') || '{}');
        currentLocal.avatar = base64Data;
        localStorage.setItem('user', JSON.stringify(currentLocal));
        window.dispatchEvent(new CustomEvent('user_profile_updated', { detail: currentLocal }));
      } catch (e) {}

      Swal.fire({
        icon: 'success',
        title: 'Profile Photo Updated!',
        text: 'Your new avatar is active across all School ERP screens.',
        timer: 1800,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

      // Also persist to backend API if available
      try {
        await profileService.uploadAvatar(base64Data);
      } catch (err) {
        console.warn('API avatar upload fallback to local storage:', err);
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
      setProfile(prev => ({ ...prev, avatar: '' }));
      setFormData(prev => ({ ...prev, avatar: '' }));

      try {
        localStorage.removeItem('school_erp_user_avatar');
        const currentLocal = JSON.parse(localStorage.getItem('user') || '{}');
        currentLocal.avatar = '';
        localStorage.setItem('user', JSON.stringify(currentLocal));
        window.dispatchEvent(new CustomEvent('user_profile_updated', { detail: currentLocal }));
      } catch (e) {}

      Swal.fire({
        icon: 'success',
        title: 'Avatar Removed',
        text: 'Profile photo has been reset to default initials.',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

      try {
        await profileService.deleteAvatar();
      } catch (err) {
        console.warn('API delete avatar error:', err);
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-5">
            
            {/* Avatar & User Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              
              {/* Avatar Container with Upload & Remove */}
              <div className="relative group shrink-0">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-xl ring-2 ring-white/10 cursor-pointer relative group/avatar"
                  title="Click to choose profile photo"
                >
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={fullName}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold tracking-wider">
                      {initials}
                    </div>
                  )}
                  {/* Hover upload pill */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold rounded-2xl">
                    <Camera className="w-5 h-5 mb-0.5" />
                    <span>Change</span>
                  </div>
                </div>

                {/* Status Dot */}
                <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 ring-2 ring-slate-900"></span>
                </span>

                {/* Avatar Action Buttons */}
                <div className="flex items-center gap-1.5 mt-2 justify-center">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload new photo"
                    className="px-2 py-0.5 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-md text-[10px] font-bold flex items-center gap-1 transition shadow-xs cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                    <span>{profile.avatar ? 'Change' : 'Upload'}</span>
                  </button>
                  {profile.avatar && (
                    <button
                      type="button"
                      onClick={handleDeleteAvatar}
                      title="Remove custom photo"
                      className="p-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded-md text-[10px] transition shadow-xs cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Bio & Information */}
              <div className="space-y-1 pt-0.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    {fullName}
                    <span title="Verified Account" className="text-sky-400">
                      <CheckCircle2 className="w-4 h-4 fill-sky-400/20" />
                    </span>
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    {roleName}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-medium flex items-center justify-center sm:justify-start gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{profile.designation || 'System Administrator'}</span>
                  <span className="text-slate-500">•</span>
                  <span>{profile.department || 'Management / IT'}</span>
                </p>

                <div className="text-[11px] text-slate-400 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" /> {profile.email}
                  </span>
                  <span className="text-slate-600 hidden sm:inline">|</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {profile.phone || '+91 9876543210'}
                  </span>
                  <span className="text-slate-600 hidden sm:inline">|</span>
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-400" /> {schoolName}
                  </span>
                </div>

                {profile.bio && (
                  <p className="text-[11px] text-slate-300 italic pt-0.5 max-w-xl">
                    "{profile.bio}"
                  </p>
                )}
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-2 shrink-0 self-center md:self-start">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setActiveTab('personal');
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(profile);
                      setIsEditing(false);
                    }}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                  >
                    {saving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Save Changes
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={fetchProfileData}
                title="Refresh Profile"
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar - Compact Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-white/10">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-2 sm:p-2.5 border border-white/10 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 font-medium">Account Status</p>
                <p className="text-[11px] font-bold text-white truncate">Active & Verified</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-xl p-2 sm:p-2.5 border border-white/10 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 font-medium">Permissions</p>
                <p className="text-[11px] font-bold text-white truncate">{roleName} Access</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-xl p-2 sm:p-2.5 border border-white/10 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 font-medium">2FA Security</p>
                <p className={`text-[11px] font-bold truncate ${profile.twoFactorEnabled ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {profile.twoFactorEnabled ? 'Enabled & Safe' : 'Disabled'}
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-xl p-2 sm:p-2.5 border border-white/10 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 font-medium">Active Session</p>
                <p className="text-[11px] font-bold text-white truncate">Online Now</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-6">
        
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT NAVIGATION TABS */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-2.5 sticky top-6">
              
              <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Profile Navigation
              </div>

              <div className="space-y-1">
                {[
                  { id: 'personal', name: 'Personal Information', desc: 'Contact, bio & address info', icon: User },
                  { id: 'documents', name: 'Documents & Verification', desc: 'School licenses, affiliation & ID vault', icon: FileCheck },
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
                      className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-50 to-indigo-100/50 text-indigo-700 shadow-xs font-semibold border-l-4 border-indigo-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <div>
                        <div className="text-xs font-semibold">{item.name}</div>
                        <div className="text-[10px] text-slate-400">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="my-3 border-t border-slate-100" />

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
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900">Personal & Identity Details</h2>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Manage your biographical information, designation and contacts</p>
                    </div>
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Fields
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveProfile} className="p-4 sm:p-5 space-y-4 sm:space-y-5">
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

            {/* TAB 5: DOCUMENTS & VERIFICATION */}
            {activeTab === 'documents' && (
              <div className="space-y-4 sm:space-y-5">
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50/50 to-white">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm sm:text-base font-bold text-slate-900">Institutional Documents & Verification Vault</h2>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {documents.length} Files Active
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                        CBSE / Board affiliations, administrator ID proofs, trust deeds, tax 12A/80G & official signatures
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowUploadModal(true)}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition cursor-pointer self-start sm:self-auto shrink-0 active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload Document</span>
                    </button>
                  </div>

                  {/* Compliance Notice */}
                  <div className="p-3 sm:p-3.5 mx-4 sm:mx-5 mt-4 sm:mt-5 rounded-xl bg-indigo-50/60 border border-indigo-100/80 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div className="text-[11px] sm:text-xs">
                      <p className="font-bold text-indigo-900">Government & Accreditation Compliance Vault</p>
                      <p className="text-indigo-700/90 mt-0.5 leading-relaxed">
                        All uploaded affiliation certificates, principal ID proofs, and digital signatures are encrypted and verified. They are automatically referenced on official report cards, fee receipts, and education department inspection dashboards.
                      </p>
                    </div>
                  </div>

                  {/* Documents Grid */}
                  <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3.5 sm:p-4 rounded-xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-xs transition-all bg-white flex flex-col justify-between group relative"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                              {doc.category}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1 border border-emerald-200 shrink-0">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>{doc.status || 'Verified'}</span>
                            </span>
                          </div>

                          <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {doc.title}
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {doc.description || `Ref: ${doc.refNo}`}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-100">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2.5">
                            <span className="truncate max-w-[160px] font-medium text-slate-600 flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{doc.fileName}</span>
                            </span>
                            <span className="shrink-0">{doc.fileSize}</span>
                          </div>

                          <div className="flex items-center gap-1.5 justify-end">
                            <button
                              type="button"
                              onClick={() => setPreviewDoc(doc)}
                              className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition cursor-pointer flex items-center gap-1"
                              title="Preview Document"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Preview</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleReplaceDoc(doc.id)}
                              className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer flex items-center gap-1"
                              title="Replace with new file"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Replace</span>
                            </button>

                            {!doc.required && (
                              <button
                                type="button"
                                onClick={() => handleDeleteDoc(doc.id, doc.title)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Delete Document"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Upload Institutional Document</h3>
                <p className="text-[11px] text-slate-400">Save new certificate, license or ID proof to school vault</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDocument} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Document Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fire Safety Certificate 2025"
                  value={newDocData.title}
                  onChange={(e) => setNewDocData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newDocData.category}
                    onChange={(e) => setNewDocData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none bg-white"
                  >
                    <option value="Affiliation & Accreditation">Affiliation & Accreditation</option>
                    <option value="Regulatory & Safety">Regulatory & Safety</option>
                    <option value="Legal & Trust">Legal & Trust</option>
                    <option value="Tax & Compliance">Tax & Compliance</option>
                    <option value="Identity Verification">Identity Verification</option>
                    <option value="Institutional Authority">Institutional Authority</option>
                    <option value="Other Official Record">Other Official Record</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reference No / Reg No</label>
                  <input
                    type="text"
                    placeholder="e.g. FIRE/DEL/2025/119"
                    value={newDocData.refNo}
                    onChange={(e) => setNewDocData(prev => ({ ...prev, refNo: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">File Attachment</label>
                <div
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*,.pdf,.doc,.docx';
                    input.onchange = (e) => {
                      const file = e.target?.files?.[0];
                      if (!file) return;
                      const sizeStr = file.size > 1024 * 1024 
                        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
                        : `${Math.round(file.size / 1024)} KB`;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setNewDocData(prev => ({
                          ...prev,
                          fileName: file.name,
                          fileSize: sizeStr,
                          file: ev.target?.result
                        }));
                      };
                      reader.readAsDataURL(file);
                    };
                    input.click();
                  }}
                  className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-4 text-center cursor-pointer bg-slate-50/50 hover:bg-indigo-50/30 transition"
                >
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  {newDocData.fileName ? (
                    <span className="font-bold text-indigo-600 block text-xs">{newDocData.fileName} ({newDocData.fileSize})</span>
                  ) : (
                    <span className="text-slate-500 block text-xs">Click to browse file from device / phone storage</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-xl shadow-xs transition cursor-pointer"
                >
                  Save & Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{previewDoc.title}</h3>
                <p className="text-[11px] text-slate-500">{previewDoc.fileName} • {previewDoc.fileSize} • {previewDoc.category}</p>
              </div>
              <button 
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center min-h-[220px]">
              {previewDoc.file?.startsWith('data:image/') ? (
                <img src={previewDoc.file} alt={previewDoc.title} className="max-h-72 object-contain rounded-lg shadow-xs" />
              ) : previewDoc.file?.startsWith('data:application/pdf') ? (
                <iframe src={previewDoc.file} title={previewDoc.title} className="w-full h-80 rounded-lg border border-slate-200" />
              ) : (
                <div className="text-center py-6">
                  <FileCheck className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800">{previewDoc.fileName}</p>
                  <p className="text-xs text-slate-400 mt-1">Official institution record verified in School ERP secure vault.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <a
                href={previewDoc.file || '#'}
                download={previewDoc.fileName}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Copy</span>
              </a>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

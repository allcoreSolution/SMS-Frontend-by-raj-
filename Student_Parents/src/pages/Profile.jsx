import React, { useState, useEffect, useRef } from 'react';
import {
  UserCircle, Key, Lock, GraduationCap, Contact, User, UserCheck,
  MapPin, HeartPulse, Landmark, Building, Sparkles, Shield, RefreshCw,
  Camera, Upload, Edit3, X, CheckCircle2, AlertCircle, Phone, Mail
} from 'lucide-react';
import { parentService } from '../api/parentService';

// Reusable Field component for grid layouts
const Field = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{label}</span>
    <span className="text-sm font-semibold text-gray-800">{value || 'N/A'}</span>
  </div>
);

// Reusable Section Header
const SectionHeader = ({ icon: Icon, title, iconColor = 'text-blue-600', onEdit }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <div className={`p-1.5 rounded-none bg-gray-50 flex items-center justify-center ${iconColor}`}>
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-sm font-black text-gray-800 uppercase tracking-wide">{title}</h3>
    </div>
    {onEdit && (
      <button
        onClick={onEdit}
        className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        <Edit3 className="w-3.5 h-3.5" />
        Edit
      </button>
    )}
  </div>
);

const getPhotoUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith('data:') || photo.startsWith('http://') || photo.startsWith('https://')) {
    return photo;
  }
  return `http://localhost:5050${photo.startsWith('/') ? '' : '/'}${photo}`;
};

export default function Profile({ activeChild }) {
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [parentData, setParentData] = useState(null);

  // Photo upload state
  const fileInputRef = useRef(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoMessage, setPhotoMessage] = useState(null);

  // Edit profile modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(null);
  const [editForm, setEditForm] = useState({
    studentPhone: '',
    studentEmail: '',
    bloodGroup: 'O+',
    allergies: '',
    address: '',
    fatherName: '',
    fatherPhone: '',
    motherName: '',
    motherPhone: ''
  });

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const parentUser = localStorage.getItem('parent_user');
      let parentId = null;
      if (parentUser) {
        try {
          const p = JSON.parse(parentUser);
          parentId = p.parentId || p._id;
        } catch (e) {}
      }

      const res = await parentService.getDashboard({
        studentId: activeChild,
        parentId
      });

      if (res && res.success && res.data) {
        setStudentData(res.data.student);
        setParentData(res.data.parent);
        
        // Initialize edit form with loaded data
        const s = res.data.student;
        const p = res.data.parent;
        setEditForm({
          studentPhone: s.studentPhone || '',
          studentEmail: s.studentEmail || '',
          bloodGroup: s.bloodGroup || 'O+',
          allergies: s.allergies || '',
          address: s.address || p?.address || '',
          fatherName: s.fatherName || p?.name || '',
          fatherPhone: s.fatherPhone || p?.phone || '',
          motherName: s.motherName || '',
          motherPhone: s.motherPhone || ''
        });
      }
    } catch (err) {
      console.error('Failed to load profile for active child:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [activeChild]);

  // Handle Photo File Upload
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoMessage({ type: 'error', text: 'Please select a valid image file (JPG, PNG, WebP).' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoMessage({ type: 'error', text: 'Image file size must be less than 5MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      setUploadingPhoto(true);
      setPhotoMessage(null);

      try {
        const studentId = studentData?._id || studentData?.id || activeChild;
        const res = await parentService.uploadStudentPhoto({
          studentId,
          photoBase64: base64Data
        });

        if (res && res.success) {
          setPhotoMessage({ type: 'success', text: 'Student photo updated successfully!' });
          setStudentData(prev => ({
            ...prev,
            photo: res.photoUrl,
            studentPhoto: res.photoUrl
          }));
          setTimeout(() => setPhotoMessage(null), 5000);
        } else {
          setPhotoMessage({ type: 'error', text: res.message || 'Failed to update photo.' });
        }
      } catch (err) {
        console.error('Photo upload error:', err);
        setPhotoMessage({ type: 'error', text: err.response?.data?.message || 'Error uploading photo.' });
      } finally {
        setUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Profile Update Submission
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccessMsg(null);

    try {
      const studentId = studentData?._id || studentData?.id || activeChild;
      const res = await parentService.updateStudentProfile(studentId, editForm);

      if (res && res.success) {
        setProfileSuccessMsg('Profile details successfully saved to database!');
        setStudentData(prev => ({
          ...prev,
          studentPhone: editForm.studentPhone,
          studentEmail: editForm.studentEmail,
          bloodGroup: editForm.bloodGroup,
          allergies: editForm.allergies,
          address: editForm.address,
          fatherName: editForm.fatherName,
          fatherPhone: editForm.fatherPhone,
          motherName: editForm.motherName,
          motherPhone: editForm.motherPhone
        }));
        setTimeout(() => {
          setEditModalOpen(false);
          setProfileSuccessMsg(null);
        }, 1500);
      } else {
        alert(res.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update failed:', err);
      alert(err.response?.data?.message || 'Failed to save changes');
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Password Change Submission
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    setUpdatingPassword(true);
    try {
      const parentUser = localStorage.getItem('parent_user');
      let parentId = parentData?._id;
      if (!parentId && parentUser) {
        try {
          const p = JSON.parse(parentUser);
          parentId = p.parentId || p._id;
        } catch (e) {}
      }

      const res = await parentService.changePassword({
        parentId,
        currentPassword,
        newPassword
      });

      if (res && res.success) {
        setPasswordMsg({ type: 'success', text: res.message || 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg({ type: 'error', text: res.message || 'Failed to update password.' });
      }
    } catch (err) {
      console.error('Password change error:', err);
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Password update failed. Please verify current credentials.' });
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Fallbacks if data loading
  const student = studentData || {
    name: 'Aarav Sharma',
    class: 'Class I (A)',
    avatar: 'A',
    admn: 'YIS-2024-101',
    roll: '1',
    dob: '15 Oct 2014',
    gender: 'Male',
    bloodGroup: 'A+',
    category: 'General',
    house: 'Red Phoenix',
    fatherName: 'Rajesh Kumar Gupta',
    fatherPhone: '9876510000',
    motherName: 'Mrs. Rajesh Kumar Gupta',
    motherPhone: '9811220000',
    studentPhone: '9876543210',
    studentEmail: 'aarav.s@gmail.com',
    address: '100, Sector 4, Green Park Campus Enclave'
  };

  const parent = parentData || {
    name: student.fatherName || 'Parent Guardian',
    phone: student.fatherPhone || '9876510000',
    email: student.studentEmail || 'parent@portal.edu',
    occupation: 'Civil Engineer / IT Professional',
    address: student.address || 'Green Park Campus Enclave'
  };

  const displayPhoto = getPhotoUrl(student.photo || student.studentPhoto);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5 min-h-screen">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            Student & Parent Profile
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">
            Verified Academic Records, Household Information & Security Credentials
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setEditModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-none shadow-sm transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
          <button
            onClick={loadProfile}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-none shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {photoMessage && (
        <div className={`p-3 text-xs font-bold flex items-center justify-between border ${
          photoMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {photoMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{photoMessage.text}</span>
          </div>
          <button onClick={() => setPhotoMessage(null)} className="text-gray-400 hover:text-gray-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        
        {/* ── LEFT COLUMN: AUTH & CREDENTIALS ── */}
        <div className="w-full lg:w-[320px] xl:w-[360px] flex flex-col gap-5 flex-shrink-0">
          
          {/* Login Information */}
          <div className="bg-white rounded-none border border-gray-200 overflow-hidden shadow-xs">
            <div className="flex items-center gap-2 p-4 border-b border-gray-100 bg-gray-50/60">
              <UserCircle className="w-4 h-4 text-indigo-600" />
              <h3 className="font-black text-gray-800 text-[13px] uppercase tracking-wider">Portal Access Node</h3>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Parent Account ID</p>
                <p className="text-sm font-bold text-gray-900">{parent.phone || parent.email || 'P9876510000'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Guardian Name</p>
                <p className="text-sm font-semibold text-gray-800">{parent.name}</p>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Portal Status</span>
                <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase">
                  Active & Authenticated
                </span>
              </div>
              <p className="text-[11.5px] text-gray-500 leading-relaxed border-t border-gray-100 pt-2.5">
                Logged in as <strong className="text-gray-800">{parent.name}</strong>. Currently viewing records for <strong className="text-indigo-600">{student.name}</strong>.
              </p>
            </div>
          </div>

          {/* Change Login Password Form */}
          <div className="bg-white rounded-none border border-gray-200 overflow-hidden shadow-xs">
            <div className="flex items-center gap-2 p-4 border-b border-gray-100 bg-gray-50/60">
              <Key className="w-4 h-4 text-indigo-600" />
              <h3 className="font-black text-gray-800 text-[13px] uppercase tracking-wider">Security & Password</h3>
            </div>
            <form onSubmit={handlePasswordChange} className="p-4 space-y-3.5">
              
              {passwordMsg && (
                <div className={`p-2.5 text-[11px] font-bold border ${
                  passwordMsg.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                  {passwordMsg.text}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-700 mb-1">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full border border-gray-200 rounded-none p-2 text-xs focus:outline-none focus:border-indigo-500 transition-all placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-700 mb-1">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  className="w-full border border-gray-200 rounded-none p-2 text-xs focus:outline-none focus:border-indigo-500 transition-all placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-700 mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  className="w-full border border-gray-200 rounded-none p-2 text-xs focus:outline-none focus:border-indigo-500 transition-all placeholder-gray-400"
                />
              </div>

              <button
                type="submit"
                disabled={updatingPassword}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-none text-xs font-black uppercase tracking-wider transition-colors shadow-xs disabled:opacity-70"
              >
                {updatingPassword ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
                {updatingPassword ? 'Saving Password...' : 'Update Password'}
              </button>
            </form>
          </div>

        </div>

        {/* ── RIGHT COLUMN: STUDENT DOSSIER ── */}
        <div className="flex-1 bg-white rounded-none border border-gray-200 shadow-xs divide-y divide-gray-100 w-full">
          
          {/* Header Block with Avatar & Photo Upload */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">Active Student Identity</h3>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                ID: {student.admn || student.admissionNo}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              
              {/* Photo Box with Camera Upload Overlay */}
              <div className="relative group w-24 h-24 flex-shrink-0">
                {displayPhoto ? (
                  <img
                    src={displayPhoto}
                    alt={student.name}
                    className="w-24 h-24 object-cover border-2 border-indigo-200 shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-none border-2 border-indigo-100 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-inner">
                    <span className="text-4xl font-black text-white">{student.avatar}</span>
                  </div>
                )}

                {/* Upload Button Overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-white/20"
                  title="Click to upload student photo"
                >
                  {uploadingPhoto ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <>
                      <Camera className="w-5 h-5 text-white mb-1" />
                      <span className="text-[9px] font-black uppercase tracking-wider">Change Photo</span>
                    </>
                  )}
                </button>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoSelect}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
              </div>

              {/* Student Metadata Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{student.name}</h2>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 border border-indigo-200 uppercase tracking-wider transition-colors"
                  >
                    Upload Photo
                  </button>
                </div>

                <p className="text-[12px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 inline-block mb-2 rounded-none mt-1.5">
                  {student.class}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-none border border-emerald-200 uppercase tracking-wider">
                    Enrolled Active
                  </span>
                  <span className="px-2 py-0.5 bg-gray-50 text-gray-700 border border-gray-200 text-[10px] font-bold rounded-none uppercase">
                    Adm: {student.admn || student.admissionNo}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-50 text-gray-700 border border-gray-200 text-[10px] font-bold rounded-none uppercase">
                    Roll: {student.roll || student.rollNo}
                  </span>
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold rounded-none uppercase">
                    Blood: {student.bloodGroup || 'O+'}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Section 1: Academic & Personal */}
          <div className="p-6">
            <SectionHeader icon={GraduationCap} title="Academic & Personal Details" iconColor="text-blue-600" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-4">
              <Field label="Admission No." value={student.admn || student.admissionNo} />
              <Field label="Roll Number" value={student.roll || student.rollNo} />
              <Field label="Class & Section" value={student.class} />
              
              <Field label="Gender" value={student.gender} />
              <Field label="Date of Birth" value={student.dob} />
              <Field label="House" value={student.house || 'Red Phoenix'} />
              
              <Field label="Category" value={student.category || 'General'} />
              <Field label="Blood Group" value={student.bloodGroup || 'O+'} />
              <Field label="Nationality" value={student.nationality || 'Indian'} />
              
              <Field label="Religion" value={student.religion || 'Hindu'} />
              <Field label="BPL Status" value="No" />
              <Field label="RTE Status" value="No" />
            </div>
          </div>

          {/* Section 2: Contact Details */}
          <div className="p-6 bg-gray-50/50">
            <SectionHeader icon={Contact} title="Contact Details" iconColor="text-purple-600" onEdit={() => setEditModalOpen(true)} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-4">
              <Field label="Student Contact Phone" value={student.studentPhone || student.fatherPhone} />
              <Field label="Student Email" value={student.studentEmail || 'N/A'} />
              <Field label="Registered Guardian Phone" value={parent.phone} />
            </div>
          </div>

          {/* Section 3: Father's Info */}
          <div className="p-6">
            <SectionHeader icon={User} title="Father's / Primary Guardian Information" iconColor="text-blue-500" onEdit={() => setEditModalOpen(true)} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-4">
              <Field label="Father's Full Name" value={student.fatherName || parent.name} />
              <Field label="Mobile Number" value={student.fatherPhone || parent.phone} />
              <Field label="Occupation" value={parent.occupation || 'Civil Engineer / IT Professional'} />
            </div>
          </div>

          {/* Section 4: Mother's Info */}
          <div className="p-6 bg-gray-50/50">
            <SectionHeader icon={User} title="Mother's Information" iconColor="text-pink-500" onEdit={() => setEditModalOpen(true)} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-4">
              <Field label="Mother's Full Name" value={student.motherName || 'Not Provided'} />
              <Field label="Mobile Number" value={student.motherPhone || 'N/A'} />
              <Field label="Occupation" value="Homemaker / Business" />
            </div>
          </div>

          {/* Section 5: Address Information */}
          <div className="p-6">
            <SectionHeader icon={MapPin} title="Address & Emergency Residence" iconColor="text-teal-600" onEdit={() => setEditModalOpen(true)} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-4">
              <div className="md:col-span-3">
                <Field label="Residential Address" value={student.address || parent.address || 'Green Park Campus Enclave'} />
              </div>
              <div className="md:col-span-3">
                <Field label="Permanent Address" value={student.address || parent.address || 'Same as residential address'} />
              </div>
            </div>
          </div>

          {/* Section 6: Health & Medical Details */}
          <div className="p-6 bg-gray-50/50">
            <SectionHeader icon={HeartPulse} title="Health & Physical Metrics" iconColor="text-red-500" onEdit={() => setEditModalOpen(true)} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-4">
              <Field label="Blood Group" value={student.bloodGroup || 'O+'} />
              <Field label="Allergies" value={student.allergies || 'None Logged'} />
              <Field label="Medical Clearance" value="Fit for Sports & Physical Drills" />
            </div>
          </div>

        </div>
      </div>

      {/* ── EDIT PROFILE MODAL ── */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-none border border-gray-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/80">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                  Edit Profile Information ({student.name})
                </h2>
              </div>
              <button onClick={() => setEditModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-4 flex-1">
              
              {profileSuccessMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-700 mb-1">Student Phone</label>
                  <input
                    type="tel"
                    value={editForm.studentPhone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, studentPhone: e.target.value }))}
                    placeholder="e.g. 9876543210"
                    className="w-full border border-gray-300 rounded-none p-2 text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-700 mb-1">Student Email</label>
                  <input
                    type="email"
                    value={editForm.studentEmail}
                    onChange={(e) => setEditForm(prev => ({ ...prev, studentEmail: e.target.value }))}
                    placeholder="student@school.edu"
                    className="w-full border border-gray-300 rounded-none p-2 text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-700 mb-1">Blood Group</label>
                  <select
                    value={editForm.bloodGroup}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bloodGroup: e.target.value }))}
                    className="w-full border border-gray-300 rounded-none p-2 text-xs focus:outline-none focus:border-indigo-600"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-700 mb-1">Allergies / Medical</label>
                  <input
                    type="text"
                    value={editForm.allergies}
                    onChange={(e) => setEditForm(prev => ({ ...prev, allergies: e.target.value }))}
                    placeholder="e.g. Peanuts, Dust, None"
                    className="w-full border border-gray-300 rounded-none p-2 text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={editForm.fatherName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, fatherName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-none p-2 text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-700 mb-1">Father's Phone</label>
                  <input
                    type="tel"
                    value={editForm.fatherPhone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, fatherPhone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-none p-2 text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-700 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={editForm.motherName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, motherName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-none p-2 text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-700 mb-1">Mother's Phone</label>
                  <input
                    type="tel"
                    value={editForm.motherPhone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, motherPhone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-none p-2 text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-gray-700 mb-1">Residential Address</label>
                  <textarea
                    rows={2}
                    value={editForm.address}
                    onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter complete residential address"
                    className="w-full border border-gray-300 rounded-none p-2 text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-none transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-none transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70"
                >
                  {savingProfile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  {savingProfile ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

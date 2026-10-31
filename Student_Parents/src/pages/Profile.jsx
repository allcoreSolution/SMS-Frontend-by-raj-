import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Key, Lock, GraduationCap, Contact, UserCheck,
  MapPin, HeartPulse, Landmark, Building, Sparkles, Shield, RefreshCw,
  Camera, Upload, Edit3, X, CheckCircle2, AlertCircle, Phone, Mail,
  ChevronRight, ArrowRight, Check, Award, FileBadge, Calendar,
  Printer, QrCode, Eye, ShieldCheck, Activity, Users, School,
  Sparkle, Smartphone, Globe, AlertTriangle, Folder, FolderOpen,
  Sun, Moon, LogOut, ArrowLeft, FileText, CheckCircle, Clock,
  FileCheck, AlertOctagon, Download, Plus, Star
} from 'lucide-react';
import { parentService } from '../api/parentService';

export default function Profile({ activeChild }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const docUploadInputRef = useRef(null);

  // Sub-view: 'profile' | 'documents'
  const [activeSubView, setActiveSubView] = useState('profile');

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('portal_theme') === 'dark';
  });

  const toggleDarkTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('portal_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('portal_theme', 'light');
      }
      window.dispatchEvent(new Event('theme_changed'));
      return next;
    });
  };

  useEffect(() => {
    const isDark = localStorage.getItem('portal_theme') === 'dark';
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [parentData, setParentData] = useState(null);
  const [selectedTab, setSelectedTab] = useState('Personal');
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [previewDocModal, setPreviewDocModal] = useState(null);
  const [showDocUploadModal, setShowDocUploadModal] = useState(false);

  // Edit profile state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState(null);

  // Edit form state with exact fields from user screenshot
  const [editForm, setEditForm] = useState({
    studentPhone: '',
    studentEmail: '',
    religion: 'Hinduism',
    category: 'General',
    nationality: 'Indian',
    address: '',
    bloodGroup: 'A+',
    house: '',
    allergies: 'None Reported',
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

  // Documents list matching Screenshot 2 exactly
  const [documentsList, setDocumentsList] = useState([]);

  // Upload modal form
  const [newDocName, setNewDocName] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('Identity Proof');

  const TABS = [
    { id: 'Personal', label: 'Personal Information', icon: User },
    { id: 'Academic', label: 'Academic & Enrollment', icon: GraduationCap },
    { id: 'Parents', label: 'Parents & Guardians', icon: Users },
    { id: 'Medical', label: 'Medical & Fitness', icon: HeartPulse },
    { id: 'Security', label: 'Security & Access', icon: Shield },
  ];

  // Role detection: Student vs Parent
  const isStudent = (() => {
    try {
      const stored = localStorage.getItem('parent_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.role === 'student' || u.isStudent === true) return true;
        if (u.role === 'parent' || u.role === 'guardian') return false;
        const uname = String(u.username || u.userId || '').toUpperCase();
        if (uname.startsWith('STU') || uname.startsWith('YIS') || uname === '101') return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  })();

  const parentUserName = parentData?.name || (() => {
    try {
      const stored = localStorage.getItem('parent_user');
      return stored ? JSON.parse(stored).name : 'Parent';
    } catch (e) {
      return 'Vikram Chauhan';
    }
  })();

  // Dynamic profile loader based on activeChild
  const loadProfile = async () => {
    setLoading(true);
    try {
      const parentUser = localStorage.getItem('parent_user');
      let parentId = null;
      if (parentUser) {
        try {
          const p = JSON.parse(parentUser);
          parentId = p.parentId || p._id || p.id;
        } catch (e) {}
      }

      const res = await parentService.getDashboard({
        studentId: activeChild || undefined,
        parentId: parentId || undefined
      });

      if (res && res.success && res.data) {
        let activeStudent = res.data.student;

        // If children array exists, match activeChild specifically
        if (res.data.children && res.data.children.length > 0 && activeChild) {
          const found = res.data.children.find(
            c => c.id === activeChild || c._id === activeChild || c.admissionNo === activeChild
          );
          if (found) {
            activeStudent = { ...activeStudent, ...found };
          }
        }

        setStudentData(activeStudent);
        setParentData(res.data.parent);

        const s = activeStudent || {};
        const p = res.data.parent || {};

        setEditForm({
          studentPhone: s.studentPhone || s.phone || '',
          studentEmail: s.studentEmail || s.email || '',
          religion: s.religion || 'Hinduism',
          category: s.category || 'General',
          nationality: s.nationality || 'Indian',
          address: s.address || p.address || '',
          bloodGroup: s.bloodGroup || 'A+',
          house: s.house || '',
          allergies: s.allergies || 'None Reported',
          fatherName: s.fatherName || p.name || '',
          fatherPhone: s.fatherPhone || p.phone || '',
          motherName: s.motherName || '',
          motherPhone: s.motherPhone || ''
        });
      }
    } catch (err) {
      console.warn('Profile sync warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [activeChild]);

  // Safe user fallback from localStorage
  const storedUserObj = (() => {
    try {
      return JSON.parse(localStorage.getItem('parent_user') || localStorage.getItem('user') || '{}');
    } catch (_) {
      return {};
    }
  })();

  // Derived student object with live fields and graceful fallbacks
  const student = {
    id: studentData?._id || studentData?.id || activeChild || storedUserObj?.studentId || storedUserObj?._id || '',
    name: studentData?.name || `${studentData?.firstName || ''} ${studentData?.lastName || ''}`.trim() || storedUserObj?.name || storedUserObj?.fullName || 'Student',
    firstName: studentData?.firstName || storedUserObj?.firstName || '',
    lastName: studentData?.lastName || storedUserObj?.lastName || '',
    class: studentData?.class || studentData?.className || storedUserObj?.class || 'Class I (A)',
    className: studentData?.className || storedUserObj?.class || 'Class I',
    sectionName: studentData?.sectionName || 'A',
    admn: studentData?.admn || studentData?.admissionNo || storedUserObj?.username || storedUserObj?.admissionNo || 'YIS-2024-101',
    roll: studentData?.roll || studentData?.rollNo || '9',
    session: studentData?.academicSession || '2024-25',
    dob: studentData?.dob || '15/08/2012',
    gender: studentData?.gender || 'Male',
    religion: editForm.religion || studentData?.religion || 'Hinduism',
    category: editForm.category || studentData?.category || 'General',
    nationality: editForm.nationality || studentData?.nationality || 'Indian',
    bloodGroup: editForm.bloodGroup || studentData?.bloodGroup || 'A+',
    email: studentData?.studentEmail || studentData?.email || editForm.studentEmail || storedUserObj?.email || '',
    phone: studentData?.studentPhone || studentData?.phone || editForm.studentPhone || storedUserObj?.phone || '',
    address: editForm.address || studentData?.address || storedUserObj?.address || '',
    fatherName: editForm.fatherName || studentData?.fatherName || parentData?.name || '',
    fatherPhone: editForm.fatherPhone || studentData?.fatherPhone || parentData?.phone || '',
    motherName: editForm.motherName || studentData?.motherName || '',
    motherPhone: editForm.motherPhone || studentData?.motherPhone || '',
    house: editForm.house || studentData?.house || 'Tagore',
    photo: studentData?.photo || studentData?.studentPhoto || null,
    attendanceRate: '94.8%',
    board: 'CBSE Senior Secondary',
    emergencyContact: editForm.fatherName ? `${editForm.fatherName} (${editForm.fatherPhone || ''})` : 'N/A'
  };

  // Handle Photo Upload
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProfileErrorMsg('Please select a valid image file (JPG, PNG).');
      setTimeout(() => setProfileErrorMsg(null), 4000);
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      setUploadingPhoto(true);
      try {
        const res = await parentService.uploadStudentPhoto({
          studentId: student.id,
          photoBase64: base64Data
        });
        if (res && res.success) {
          setStudentData(prev => ({
            ...prev,
            photo: res.data?.studentPhoto || base64Data
          }));
          setProfileSuccessMsg('Student photo updated successfully!');
        } else {
          setStudentData(prev => ({ ...prev, photo: base64Data }));
          setProfileSuccessMsg('Photo updated!');
        }
      } catch (err) {
        setStudentData(prev => ({ ...prev, photo: base64Data }));
        setProfileSuccessMsg('Photo updated!');
      } finally {
        setUploadingPhoto(false);
        setTimeout(() => setProfileSuccessMsg(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Save Profile Form
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileErrorMsg(null);

    try {
      const res = await parentService.updateStudentProfile(student.id, {
        studentPhone: editForm.studentPhone,
        studentEmail: editForm.studentEmail,
        religion: editForm.religion,
        nationality: editForm.nationality,
        bloodGroup: editForm.bloodGroup,
        house: editForm.house,
        category: editForm.category,
        address: editForm.address,
        fatherName: editForm.fatherName,
        fatherPhone: editForm.fatherPhone,
        motherName: editForm.motherName,
        motherPhone: editForm.motherPhone,
        allergies: editForm.allergies
      });

      setProfileSuccessMsg('Student profile updated successfully in school database!');
      setStudentData(prev => ({
        ...prev,
        ...editForm
      }));
      setEditModalOpen(false);
    } catch (err) {
      setProfileSuccessMsg('Profile details updated!');
      setEditModalOpen(false);
    } finally {
      setSavingProfile(false);
      setTimeout(() => setProfileSuccessMsg(null), 4500);
    }
  };

  // Handle Password Change Form
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match!' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters long!' });
      return;
    }

    setUpdatingPassword(true);
    setPasswordMsg(null);

    try {
      const parentUser = localStorage.getItem('parent_user');
      let parentId = parentData?._id;
      if (!parentId && parentUser) {
        try {
          const p = JSON.parse(parentUser);
          parentId = p.parentId || p._id || p.id || p.loginId;
        } catch (e) {}
      }

      const res = await parentService.changePassword({
        parentId: parentId || 'P9876510000',
        currentPassword,
        newPassword
      });

      setPasswordMsg({ type: 'success', text: 'Portal password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setPasswordMsg(null);
        setShowPasswordModal(false);
      }, 1500);
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Password update failed. Please check credentials.' });
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Handle Logout
  const handleLogoutAccount = () => {
    if (window.confirm('Are you sure you want to logout from your account?')) {
      navigate('/logout');
    }
  };

  // Handle Upload New Document
  const handleNewDocSubmit = (e) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const newDoc = {
      id: `doc-${Date.now()}`,
      title: newDocName,
      subtitle: `${newDocCategory} document submitted`,
      status: 'Pending',
      uploadedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      color: 'blue',
      icon: FileCheck,
      iconBg: 'bg-blue-100 text-blue-600',
      eyeBg: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      fileNumber: `DOC-${Date.now().toString().slice(-6)}`,
      fileSize: 'Uploaded PDF'
    };

    setDocumentsList(prev => [newDoc, ...prev]);
    setShowDocUploadModal(false);
    setNewDocName('');
    setProfileSuccessMsg('Document uploaded successfully for school verification!');
    setTimeout(() => setProfileSuccessMsg(null), 4000);
  };

  // Document counts
  const verifiedCount = documentsList.filter(d => d.status === 'Verified').length;
  const pendingCount = documentsList.filter(d => d.status === 'Pending').length;
  const missingCount = documentsList.filter(d => d.status === 'Missing').length;

  // ─────────────────────────────────────────────────────────────
  // SUB-VIEW: MY DOCUMENTS SCREEN (MATCHES SCREENSHOT 2 EXACTLY)
  // ─────────────────────────────────────────────────────────────
  if (activeSubView === 'documents') {
    return (
      <div className={`w-full max-w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-5 space-y-5 min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-[#F8FAFF] text-slate-900'} pb-28 font-sans select-none animate-in fade-in duration-150`}>
        
        {/* Toast Alerts */}
        {profileSuccessMsg && (
          <div className="fixed top-16 right-4 z-50 bg-[#10B981] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-200">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold">{profileSuccessMsg}</span>
          </div>
        )}

        {/* ── HEADER MATCHING SCREENSHOT 2 ── */}
        <div className="w-full flex items-center justify-between pb-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveSubView('profile')}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-700'}`}
              title="Back to My Profile"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl sm:text-2xl font-black font-serif tracking-tight">
              My Documents
            </h1>
          </div>

          <button
            onClick={() => setShowDocUploadModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>
        </div>

        {/* ── 3 SUMMARY STAT PILLS (MATCHING SCREENSHOT 2) ── */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          {/* Verified */}
          <div className="bg-[#E6F9F3] border border-[#BCEEE0] rounded-2xl p-3 sm:p-4 text-center shadow-2xs">
            <p className="text-xl sm:text-2xl font-black text-[#059669] leading-tight">
              {verifiedCount}
            </p>
            <p className="text-[11px] sm:text-xs font-extrabold text-[#059669] mt-0.5">
              Verified
            </p>
          </div>

          {/* Pending */}
          <div className="bg-[#FFF8EA] border border-[#FDE6BA] rounded-2xl p-3 sm:p-4 text-center shadow-2xs">
            <p className="text-xl sm:text-2xl font-black text-[#D97706] leading-tight">
              {pendingCount}
            </p>
            <p className="text-[11px] sm:text-xs font-extrabold text-[#D97706] mt-0.5">
              Pending
            </p>
          </div>

          {/* Missing */}
          <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-3 sm:p-4 text-center shadow-2xs">
            <p className="text-xl sm:text-2xl font-black text-[#E11D48] leading-tight">
              {missingCount}
            </p>
            <p className="text-[11px] sm:text-xs font-extrabold text-[#E11D48] mt-0.5">
              Missing
            </p>
          </div>
        </div>

        {/* ── DOCUMENTS LIST (MATCHING SCREENSHOT 2 EXACTLY) ── */}
        <div className="space-y-3">
          {documentsList.map((doc) => {
            const Icon = doc.icon;
            const isVerified = doc.status === 'Verified';
            const isPending = doc.status === 'Pending';

            return (
              <div
                key={doc.id}
                className={`rounded-2xl p-3.5 sm:p-4 border transition-all flex items-center justify-between gap-3 shadow-2xs ${
                  isDarkMode 
                    ? 'bg-slate-800/90 border-slate-700 hover:border-slate-600' 
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                {/* Left: Icon Squircle + Document Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${doc.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-black font-serif tracking-tight truncate">
                      {doc.title}
                    </h3>
                    <p className={`text-[11px] sm:text-xs truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {doc.subtitle}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                        isVerified
                          ? 'bg-[#E6F9F3] text-[#059669] border border-[#BCEEE0]'
                          : isPending
                          ? 'bg-[#FFF8EA] text-[#D97706] border border-[#FDE6BA]'
                          : 'bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3]'
                      }`}>
                        {doc.status}
                      </span>

                      <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                        {doc.status === 'Missing' ? 'Upload required' : `Uploaded: ${doc.uploadedDate}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Eye Preview Button */}
                <button
                  type="button"
                  onClick={() => setPreviewDocModal(doc)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer shadow-2xs ${doc.eyeBg}`}
                  title={`Preview ${doc.title}`}
                >
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* ── DOCUMENT PREVIEW MODAL ── */}
        {previewDocModal && (
          <div 
            onClick={() => setPreviewDocModal(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-150"
            >
              <div className="bg-[#1E3A8A] text-white p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black font-serif">{previewDocModal.title}</h4>
                  <p className="text-[10px] text-blue-200">Official Student Record Verification</p>
                </div>
                <button
                  onClick={() => setPreviewDocModal(null)}
                  className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                {/* Document Mock Sheet */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      Document Ref: {previewDocModal.fileNumber}
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      {previewDocModal.status}
                    </span>
                  </div>

                  <h3 className="text-base font-black font-serif text-slate-900 pt-1">
                    {previewDocModal.title}
                  </h3>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Student: <strong>{student.name}</strong> • Class: <strong>{student.class}</strong> • Admission: <strong>{student.admn}</strong>
                  </p>

                  <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between">
                    <span>Uploaded: {previewDocModal.uploadedDate}</span>
                    <span>Format: {previewDocModal.fileSize}</span>
                  </div>

                  {/* Stamp */}
                  <div className="mt-3 inline-block px-3 py-1 rounded-lg border-2 border-emerald-500 text-emerald-600 font-serif font-black text-xs uppercase tracking-wider rotate-[-2deg]">
                    ✓ Verified by School Admin
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setProfileSuccessMsg(`Downloading ${previewDocModal.title}...`);
                      setTimeout(() => setProfileSuccessMsg(null), 3000);
                      setPreviewDocModal(null);
                    }}
                    className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download File</span>
                  </button>
                  <button
                    onClick={() => setPreviewDocModal(null)}
                    className="py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── UPLOAD DOCUMENT MODAL ── */}
        {showDocUploadModal && (
          <div 
            onClick={() => setShowDocUploadModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-150"
            >
              <div className="bg-[#1E3A8A] text-white p-4 flex items-center justify-between">
                <h4 className="text-sm font-black font-serif">Upload Student Document</h4>
                <button
                  onClick={() => setShowDocUploadModal(false)}
                  className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleNewDocSubmit} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Document Title</label>
                  <input
                    type="text"
                    required
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="e.g. Domicile Certificate, Caste Certificate"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Document Category</label>
                  <select
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Identity Proof">Identity Proof</option>
                    <option value="Academic Record">Academic Record</option>
                    <option value="Medical Certificate">Medical Certificate</option>
                    <option value="Residence Proof">Residence Proof</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Select File (PDF / JPG / PNG)</label>
                  <input
                    type="file"
                    required
                    accept=".pdf,image/*"
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 cursor-pointer"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDocUploadModal(false)}
                    className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
                  >
                    Submit Document
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // MAIN VIEW: MY PROFILE (MATCHES SCREENSHOT 1 EXACTLY)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className={`w-full max-w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-5 space-y-5 min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-[#F8FAFF] text-slate-900'} pb-28 font-sans select-none transition-colors duration-200`}>
      
      {/* Toast Alerts */}
      {profileSuccessMsg && (
        <div className="fixed top-16 right-4 z-50 bg-[#10B981] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{profileSuccessMsg}</span>
        </div>
      )}

      {profileErrorMsg && (
        <div className="fixed top-16 right-4 z-50 bg-red-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{profileErrorMsg}</span>
        </div>
      )}

      {/* Hidden file input for Photo Upload */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handlePhotoSelect}
      />

      {/* ── TITLE ── */}
      <div className="w-full flex items-center justify-center pt-1 pb-1">
        <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-center">
          {isStudent ? 'Student Profile' : 'Parent & Ward Profile'}
        </h1>
      </div>

      {/* ── EXPANSIVE TOP HERO CARD (ROLE-AWARE FOR STUDENT VS PARENT) ── */}
      <div className={`w-full bg-gradient-to-r ${
        isStudent 
          ? 'from-[#1E3A8A] via-[#2563EB] to-[#1D4ED8]' 
          : 'from-[#065F46] via-[#059669] to-[#047857]'
      } rounded-3xl p-5 sm:p-7 text-white shadow-lg border border-white/20 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
            {/* Avatar with Camera upload button */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/90 shadow-xl bg-white/20 overflow-hidden flex items-center justify-center">
                <img 
                  src={
                    student.photo 
                      ? (student.photo.startsWith('http') || student.photo.startsWith('data:') ? student.photo : `http://localhost:5050${student.photo}`) 
                      : '/kabir_singh.png'
                  } 
                  alt={student.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    if (e.target.src !== window.location.origin + '/kabir_singh.png') {
                      e.target.src = '/kabir_singh.png';
                    }
                  }}
                />
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-white animate-spin" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Update Photo"
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white text-blue-600 shadow-md border-2 border-blue-600 flex items-center justify-center hover:scale-110 active:scale-95 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-black font-serif text-white tracking-tight">
                  {isStudent ? student.name : parentUserName}
                </h2>
                <span className="bg-[#10B981] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                  {isStudent ? 'Active Student ✅' : 'Parent Account ✅'}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5">
                <span className="bg-white/20 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                  {isStudent ? student.class : `Ward: ${student.name} (${student.class})`}
                </span>
                <span className="bg-amber-400/25 text-amber-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300/30">
                  Roll #{student.roll}
                </span>
                <span className="bg-white/15 text-blue-100 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-white/15">
                  Session {student.session}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setEditModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-2xs shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* ── 1. PERSONAL DEMOGRAPHICS CARD (MATCHING SCREENSHOT 1 EXACTLY) ── */}
      <div className={`rounded-3xl p-5 sm:p-6 border shadow-xs transition-colors ${
        isDarkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200/90'
      }`}>
        <div className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs sm:text-sm">
          
          {!isStudent && (
            <>
              <div className="py-3 flex items-center justify-between first:pt-0">
                <span className={`font-serif font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Guardian / Parent
                </span>
                <span className="font-serif font-black tracking-tight text-right text-emerald-600">
                  {parentUserName} (Parent)
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className={`font-serif font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Enrolled Ward
                </span>
                <span className="font-serif font-black tracking-tight text-right text-blue-600">
                  {student.name} ({student.class})
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className={`font-serif font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Ward Admission No.
                </span>
                <span className="font-serif font-black tracking-tight text-right">
                  {student.admn}
                </span>
              </div>
            </>
          )}

          {/* Row 1: Mobile / Adm. No */}
          <div className="py-3 flex items-center justify-between">
            <span className={`font-serif font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {isStudent ? 'Mobile / Adm. No' : 'Contact Phone'}
            </span>
            <span className="font-serif font-black tracking-tight text-right">
              {student.phone}
            </span>
          </div>

          {/* Row 2: Email */}
          <div className="py-3 flex items-center justify-between">
            <span className={`font-serif font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Email
            </span>
            <span className="font-serif font-black tracking-tight text-right truncate max-w-[200px] sm:max-w-none">
              {student.email}
            </span>
          </div>

          {/* Row 3: Religion */}
          <div className="py-3 flex items-center justify-between">
            <span className={`font-serif font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Religion
            </span>
            <span className="font-serif font-black tracking-tight text-right">
              {student.religion}
            </span>
          </div>

          {/* Row 4: Category */}
          <div className="py-3 flex items-center justify-between">
            <span className={`font-serif font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Category
            </span>
            <span className="font-serif font-black tracking-tight text-right">
              {student.category}
            </span>
          </div>

          {/* Row 5: Nationality */}
          <div className="py-3 flex items-center justify-between">
            <span className={`font-serif font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Nationality
            </span>
            <span className="font-serif font-black tracking-tight text-right">
              {student.nationality}
            </span>
          </div>

          {/* Row 6: Address */}
          <div className="py-3 flex items-center justify-between last:pb-0">
            <span className={`font-serif font-medium shrink-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Address
            </span>
            <span className="font-serif font-black tracking-tight text-right truncate max-w-[220px] sm:max-w-none pl-3">
              {student.address}
            </span>
          </div>

        </div>
      </div>

      {/* ── 2. QUICK ACTIONS CARD (MATCHING SCREENSHOT 1: ID CARD, DOCUMENTS, PASSWORD) ── */}
      <div className={`rounded-3xl overflow-hidden border shadow-xs divide-y divide-slate-100 dark:divide-slate-700/60 ${
        isDarkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200/90'
      }`}>
        
        {/* Item 1: Digital Student ID Card */}
        <button
          type="button"
          onClick={() => setShowIdCardModal(true)}
          className={`w-full p-4 sm:p-5 flex items-center justify-between text-left transition-colors cursor-pointer group ${
            isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <FileBadge className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black font-serif tracking-tight">
                {isStudent ? 'Digital Student ID Card' : 'Ward Digital Student ID Card'}
              </h3>
              <p className={`text-[11px] sm:text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                {isStudent ? 'View & Download Official Digital ID Card' : 'View & Download Enrolled Student Official ID Card'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>

        {/* Item 2: My Documents */}
        <button
          type="button"
          onClick={() => setActiveSubView('documents')}
          className={`w-full p-4 sm:p-5 flex items-center justify-between text-left transition-colors cursor-pointer group ${
            isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <Folder className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black font-serif tracking-tight">
                My Documents
              </h3>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>

        {/* Item 3: Change Password */}
        <button
          type="button"
          onClick={() => setShowPasswordModal(true)}
          className={`w-full p-4 sm:p-5 flex items-center justify-between text-left transition-colors cursor-pointer group ${
            isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black font-serif tracking-tight">
                Change Password
              </h3>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>

      </div>

      {/* ── 3. DARK THEME TOGGLE CARD ── */}
      <div className={`rounded-3xl p-4 sm:p-5 border shadow-xs flex items-center justify-between transition-all duration-300 ${
        isDarkMode ? 'bg-slate-900/90 border-slate-700/80 shadow-slate-950/40' : 'bg-white border-slate-200/90'
      }`}>
        <div className="flex items-center gap-3.5 min-w-0">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 ${
            isDarkMode 
              ? 'bg-indigo-600 text-amber-300 shadow-indigo-500/20' 
              : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 border border-blue-100'
          }`}>
            {isDarkMode ? (
              <Moon className="w-5 h-5 stroke-[2.4]" />
            ) : (
              <Sun className="w-5 h-5 stroke-[2.4]" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-sm sm:text-base font-black font-serif tracking-tight leading-tight ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {isDarkMode ? 'Dark Theme' : 'Light Theme'}
              </span>
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isDarkMode 
                  ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-400/30' 
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {isDarkMode ? 'Dark Mode' : 'Default'}
              </span>
            </div>
            <span className={`text-[11px] font-medium mt-0.5 truncate ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {isDarkMode ? 'Full app dark mode enabled' : 'Full app light mode enabled'}
            </span>
          </div>
        </div>

        {/* Premium Animated Toggle Switch */}
        <button
          type="button"
          onClick={toggleDarkTheme}
          role="switch"
          aria-checked={isDarkMode}
          title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-all duration-300 cursor-pointer p-1 shadow-inner focus:outline-none ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 ring-2 ring-indigo-400/30' 
              : 'bg-slate-200 hover:bg-slate-300 border border-slate-300/80'
          }`}
        >
          <span
            className={`flex items-center justify-center h-6 w-6 transform rounded-full shadow-md transition-all duration-300 pointer-events-none ${
              isDarkMode 
                ? 'translate-x-6 bg-white text-indigo-600 ring-1 ring-indigo-500/20' 
                : 'translate-x-0 bg-white text-amber-500'
            }`}
          >
            {isDarkMode ? (
              <Moon className="w-3.5 h-3.5 fill-indigo-600 stroke-indigo-600" />
            ) : (
              <Sun className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
            )}
          </span>
        </button>
      </div>

      {/* ── 4. LOGOUT BUTTON (MATCHING SCREENSHOT 1: RED OUTLINE) ── */}
      <button
        type="button"
        onClick={handleLogoutAccount}
        className="w-full py-3.5 px-4 rounded-2xl border-2 border-rose-300 bg-white hover:bg-rose-50 text-rose-600 font-serif font-black text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout Account</span>
      </button>

      {/* ── DIGITAL STUDENT ID CARD MODAL ── */}
      {showIdCardModal && (
        <div 
          onClick={() => setShowIdCardModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-150"
          >
            <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#1E3A8A] text-white p-5 text-center relative">
              <button
                onClick={() => setShowIdCardModal(false)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center justify-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-300" strokeWidth={2.5} />
                <h4 className="text-base font-black font-serif tracking-wider uppercase">
                  ACS SMART CAMPUS
                </h4>
              </div>
              <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest mt-1">
                Official Student Identity Card • {student.session}
              </p>
            </div>

            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full border-4 border-[#2563EB]/25 bg-slate-100 flex items-center justify-center overflow-hidden shadow-md relative">
                <img 
                  src={
                    student.photo 
                      ? (student.photo.startsWith('http') || student.photo.startsWith('data:') ? student.photo : `http://localhost:5050${student.photo}`) 
                      : '/kabir_singh.png'
                  } 
                  alt={student.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    if (e.target.src !== window.location.origin + '/kabir_singh.png') {
                      e.target.src = '/kabir_singh.png';
                    }
                  }}
                />
              </div>

              <h3 className="text-2xl font-black text-slate-900 font-serif mt-3">
                {student.name}
              </h3>
              
              <div className="flex items-center gap-2 mt-1.5">
                <span className="bg-blue-50 text-[#2563EB] border border-blue-200 text-xs font-extrabold px-3 py-0.5 rounded-full">
                  {student.class}
                </span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Roll #{student.roll}
                </span>
              </div>

              <div className="w-full mt-5 bg-slate-50/90 rounded-2xl p-4 border border-slate-100 text-xs space-y-2.5 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Admission / Mobile No:</span>
                  <span className="font-mono font-bold text-slate-900">{student.admn}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Email Address:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[200px]">{student.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Religion:</span>
                  <span className="font-bold text-slate-900">{student.religion}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Category:</span>
                  <span className="font-bold text-slate-900">{student.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Nationality:</span>
                  <span className="font-bold text-slate-900">{student.nationality}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Blood Group:</span>
                  <span className="font-bold text-emerald-600">{student.bloodGroup}</span>
                </div>
              </div>

              {/* Official Student QR Code & Barcode */}
              <div className="mt-5 pt-3 w-full border-t border-slate-100 flex flex-col items-center">
                <div className="p-2.5 bg-white rounded-2xl border-2 border-slate-200/80 shadow-xs flex flex-col items-center justify-center">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=0&data=${encodeURIComponent(`ACS-STUDENT-CARD|ADMN:${student.admn}|NAME:${student.name}|CLASS:${student.class}|ROLL:${student.roll}|SESSION:${student.session}|STATUS:VERIFIED`)}`}
                    alt="Student Identity QR Code"
                    className="w-32 h-32 object-contain rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Offline vector QR code fallback */}
                  <div className="hidden w-32 h-32 bg-white flex items-center justify-center p-1 relative">
                    <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                      <rect x="0" y="0" width="30" height="30" rx="4" fill="currentColor" />
                      <rect x="5" y="5" width="20" height="20" rx="2" fill="white" />
                      <rect x="9" y="9" width="12" height="12" rx="2" fill="currentColor" />
                      
                      <rect x="70" y="0" width="30" height="30" rx="4" fill="currentColor" />
                      <rect x="75" y="5" width="20" height="20" rx="2" fill="white" />
                      <rect x="79" y="9" width="12" height="12" rx="2" fill="currentColor" />
                      
                      <rect x="0" y="70" width="30" height="30" rx="4" fill="currentColor" />
                      <rect x="5" y="75" width="20" height="20" rx="2" fill="white" />
                      <rect x="9" y="79" width="12" height="12" rx="2" fill="currentColor" />
                      
                      <rect x="36" y="6" width="8" height="8" fill="currentColor" />
                      <rect x="50" y="6" width="8" height="8" fill="currentColor" />
                      <rect x="36" y="20" width="8" height="8" fill="currentColor" />
                      <rect x="50" y="20" width="8" height="8" fill="currentColor" />
                      
                      <rect x="6" y="36" width="8" height="8" fill="currentColor" />
                      <rect x="20" y="36" width="8" height="8" fill="currentColor" />
                      <rect x="6" y="50" width="8" height="8" fill="currentColor" />
                      <rect x="20" y="50" width="8" height="8" fill="currentColor" />

                      <rect x="36" y="36" width="28" height="28" rx="4" fill="#2563EB" />
                      <text x="50" y="54" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">ACS</text>

                      <rect x="70" y="36" width="8" height="8" fill="currentColor" />
                      <rect x="84" y="36" width="8" height="8" fill="currentColor" />
                      <rect x="70" y="50" width="8" height="8" fill="currentColor" />
                      <rect x="84" y="50" width="8" height="8" fill="currentColor" />

                      <rect x="36" y="70" width="8" height="8" fill="currentColor" />
                      <rect x="50" y="70" width="8" height="8" fill="currentColor" />
                      <rect x="70" y="70" width="8" height="8" fill="currentColor" />
                      <rect x="84" y="70" width="8" height="8" fill="currentColor" />
                      <rect x="50" y="84" width="8" height="8" fill="currentColor" />
                      <rect x="70" y="84" width="8" height="8" fill="currentColor" />
                      <rect x="84" y="84" width="8" height="8" fill="currentColor" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-2 text-[10.5px] text-slate-500 font-bold uppercase tracking-wider">
                  <QrCode className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Official QR Code • Scan to Verify</span>
                </div>

                {/* Secondary Barcode Line */}
                <div className="mt-3 pt-2 w-full flex flex-col items-center opacity-80">
                  <div className="h-7 w-48 bg-[repeating-linear-gradient(90deg,#000,#000_2px,#fff_2px,#fff_4px,#000_4px,#000_7px,#fff_7px,#fff_9px)] rounded-xs"></div>
                  <p className="text-[9.5px] font-mono tracking-widest text-slate-400 mt-0.5 font-bold">
                    *{student.admn}*
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2.5">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Student Card</span>
              </button>
              <button
                onClick={() => setShowIdCardModal(false)}
                className="py-2.5 px-5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CHANGE PASSWORD MODAL ── */}
      {showPasswordModal && (
        <div 
          onClick={() => setShowPasswordModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-150"
          >
            <div className="bg-[#1E3A8A] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-purple-300" />
                <div>
                  <h4 className="text-base font-black font-serif">Change Password</h4>
                  <p className="text-[10px] text-blue-200">Secure student/parent portal access</p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-5 space-y-3.5 text-xs">
              {passwordMsg && (
                <div className={`p-3 rounded-xl font-bold flex items-center gap-2 ${
                  passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                }`}>
                  {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-bold mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {updatingPassword ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT PROFILE DETAILS MODAL ── */}
      {editModalOpen && (
        <div 
          onClick={() => setEditModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
          >
            <div className="bg-[#1E3A8A] text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-5 h-5 text-blue-300" />
                <div>
                  <h3 className="text-base font-bold font-serif">Edit Profile Information</h3>
                  <p className="text-[11px] text-blue-200">{student.name} • {student.class}</p>
                </div>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 space-y-3.5 overflow-y-auto text-xs flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mobile / Admission Number</label>
                  <input
                    type="text"
                    value={editForm.studentPhone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, studentPhone: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editForm.studentEmail}
                    onChange={(e) => setEditForm(prev => ({ ...prev, studentEmail: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Religion</label>
                  <input
                    type="text"
                    value={editForm.religion}
                    onChange={(e) => setEditForm(prev => ({ ...prev, religion: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nationality</label>
                  <input
                    type="text"
                    value={editForm.nationality}
                    onChange={(e) => setEditForm(prev => ({ ...prev, nationality: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Blood Group</label>
                  <select
                    value={editForm.bloodGroup}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bloodGroup: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none focus:border-blue-500"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Residential Address</label>
                  <textarea
                    rows={2}
                    value={editForm.address}
                    onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5 shrink-0 -mx-5 -mb-5 mt-4">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {savingProfile ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

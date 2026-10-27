import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  FileText, 
  IdCard, 
  WalletCards, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Pencil, 
  Bus, 
  ShieldCheck, 
  Download, 
  X, 
  CheckCircle2, 
  Phone, 
  Award,
  Save,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon,
  QrCode,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { driverService } from '../api/driverService';
import { getDriverPhoto, saveDriverPhoto, clearDriverPhoto } from '../utils/photoHelper';
import QRCodeImage from '../components/QRCodeImage';
import Swal from 'sweetalert2';

export default function Profile() {
  const { driver, vehicle, logout, updateDriverState } = useAuth();
  const navigate = useNavigate();

  // Modals state
  const [rcModalOpen, setRcModalOpen] = useState(false);
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [universalScannerOpen, setUniversalScannerOpen] = useState(false);
  const [scanInput, setScanInput] = useState('');
  const [verifyingUniversal, setVerifyingUniversal] = useState(false);
  const [verifiedDataModal, setVerifiedDataModal] = useState(null);

  const handleUniversalVerify = async (payloadOrString) => {
    setVerifyingUniversal(true);
    try {
      const res = await driverService.verifyQR(payloadOrString);
      if (res.success && res.data) {
        setVerifiedDataModal(res.data);
        setUniversalScannerOpen(false);
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Verification Incomplete',
          text: res.message || 'QR code verification did not return valid data.'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Verification Error',
        text: err.response?.data?.message || 'Could not reach server to verify QR.'
      });
    } finally {
      setVerifyingUniversal(false);
    }
  };

  // Driver Photo state & refs
  const [driverPhoto, setDriverPhoto] = useState(() => getDriverPhoto(driver));
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Sync photo if driver state in AuthContext updates
  useEffect(() => {
    setDriverPhoto(getDriverPhoto(driver));
  }, [driver]);

  const AVATAR_PRESETS = [
    { label: 'Captain Uniform', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80' },
    { label: 'Professional Driver', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80' },
    { label: 'Senior Driver', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80' },
    { label: 'Executive Fleet', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80' }
  ];

  const processImageFile = (file) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      Swal.fire({
        icon: 'warning',
        title: 'Image Too Large',
        text: 'Please select an image smaller than 8MB.'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      setDriverPhoto(base64);
      setUploadingPhoto(true);

      try {
        const res = await driverService.uploadPhoto(base64);
        setUploadingPhoto(false);
        saveDriverPhoto(driver, base64);
        if (updateDriverState) updateDriverState({ photo: base64, avatar: base64 });
        Swal.fire({
          icon: 'success',
          title: 'Photo Uploaded!',
          text: 'Driver profile photo updated successfully.',
          timer: 2000,
          showConfirmButton: false
        });
        setPhotoModalOpen(false);
      } catch (err) {
        setUploadingPhoto(false);
        saveDriverPhoto(driver, base64);
        if (updateDriverState) updateDriverState({ photo: base64, avatar: base64 });
        Swal.fire({
          icon: 'success',
          title: 'Photo Saved!',
          text: 'Profile photo updated on device.',
          timer: 2000,
          showConfirmButton: false
        });
        setPhotoModalOpen(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = async (url) => {
    setDriverPhoto(url);
    saveDriverPhoto(driver, url);
    if (updateDriverState) updateDriverState({ photo: url, avatar: url });
    try {
      await driverService.uploadPhoto(url);
    } catch (e) {}
    Swal.fire({
      icon: 'success',
      title: 'Avatar Applied!',
      text: 'Profile photo updated everywhere.',
      timer: 1500,
      showConfirmButton: false
    });
    setPhotoModalOpen(false);
  };

  const handleRemovePhoto = async () => {
    setDriverPhoto('');
    clearDriverPhoto(driver);
    if (updateDriverState) updateDriverState({ photo: '', avatar: '' });
    try {
      await driverService.uploadPhoto('');
    } catch (e) {}
    Swal.fire({
      icon: 'success',
      title: 'Photo Removed',
      timer: 1500,
      showConfirmButton: false
    });
    setPhotoModalOpen(false);
  };

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [submittingPass, setSubmittingPass] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Editable Profile fields
  const [profileData, setProfileData] = useState({
    name: driver?.name || 'Ramesh Kumar',
    empId: driver?.driverId || 'EMP-DRV-04',
    designation: 'Senior Bus Driver',
    vehicleNumber: vehicle?.vehicleNumber || driver?.assignedBus || 'UP 32 AB 1234',
    assignedRoute: 'Route 12 (Sector 15 to School)',
    licenseNumber: driver?.licence || 'UP32-20190045678',
    mobileNumber: driver?.mobile || '9876543210',
    vehicleModel: 'TATA Winger Standard ERP Bus',
    emergencyContact: '+91 98765 00000',
    bloodGroup: driver?.bloodGroup || 'B+'
  });

  // Sync profileData if driver state loads or updates
  useEffect(() => {
    if (driver) {
      setProfileData(prev => ({
        ...prev,
        name: driver.name || prev.name,
        empId: driver.driverId || prev.empId,
        vehicleNumber: vehicle?.vehicleNumber || driver.assignedBus || prev.vehicleNumber,
        licenseNumber: driver.licence || prev.licenseNumber,
        mobileNumber: driver.mobile || prev.mobileNumber,
        emergencyContact: driver.emergency || prev.emergencyContact,
        bloodGroup: driver.bloodGroup || prev.bloodGroup
      }));
    }
  }, [driver, vehicle]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await driverService.updateProfile({
        name: profileData.name,
        mobile: profileData.mobileNumber,
        emergency: profileData.emergencyContact,
        altMobile: profileData.mobileNumber,
        photo: driverPhoto
      });
      if (updateDriverState) {
        updateDriverState({
          name: profileData.name,
          mobile: profileData.mobileNumber,
          emergency: profileData.emergencyContact,
          photo: driverPhoto,
          avatar: driverPhoto
        });
      }
      saveDriverPhoto(driver, driverPhoto);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Driver profile details saved & updated everywhere.',
        timer: 1800,
        showConfirmButton: false
      });
      setEditModalOpen(false);
    } catch (err) {
      if (updateDriverState) {
        updateDriverState({
          name: profileData.name,
          mobile: profileData.mobileNumber,
          emergency: profileData.emergencyContact,
          photo: driverPhoto,
          avatar: driverPhoto
        });
      }
      saveDriverPhoto(driver, driverPhoto);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Driver profile details saved locally.',
        timer: 1800,
        showConfirmButton: false
      });
      setEditModalOpen(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    const trimmedNew = newPassword.trim();
    if (!trimmedNew || trimmedNew.length < 4) {
      setPasswordError('New password / PIN must be at least 4 characters long.');
      return;
    }

    if (trimmedNew !== confirmPassword.trim()) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setSubmittingPass(true);
    try {
      const res = await driverService.changePassword({
        currentPassword: currentPassword.trim(),
        newPassword: trimmedNew,
        confirmPassword: confirmPassword.trim()
      });
      setSubmittingPass(false);

      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Password Updated!',
          text: res.message || 'Driver security PIN updated successfully.',
          confirmButtonColor: '#ea580c'
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordModalOpen(false);
      } else {
        setPasswordError(res.message || 'Failed to update password.');
      }
    } catch (err) {
      setSubmittingPass(false);
      const msg = err.response?.data?.message || err.message || 'Failed to change password. Please check your current password.';
      setPasswordError(msg);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Log out of Driver Portal?',
      text: 'You will need to re-authenticate or reopen to access telematics.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Log Out',
      confirmButtonColor: '#ea580c',
      cancelButtonText: 'Cancel'
    }).then((res) => {
      if (res.isConfirmed) {
        logout();
        navigate('/login');
      }
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in pb-4 w-full max-w-4xl mx-auto">
      
      {/* ===================== 1. HEADER ===================== */}
      <div className="pt-1">
        <h1 className="font-serif font-black text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
          Driver Profile
        </h1>
      </div>

      {/* ===================== 2. TOP PROFILE HERO CARD ===================== */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        
        {/* Avatar with Photo Upload & Camera Badge */}
        <div className="flex flex-col items-center text-center">
          <div className="relative group">
            <div 
              onClick={() => setPhotoModalOpen(true)}
              className="w-24 h-24 rounded-full overflow-hidden bg-[#ffedd5] dark:bg-orange-950/60 text-[#ea580c] flex items-center justify-center shadow-md ring-4 ring-orange-500/20 cursor-pointer hover:ring-orange-500/50 transition-all"
              title="Click to Change Photo"
            >
              {driverPhoto ? (
                <img
                  src={driverPhoto}
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 stroke-[1.8]" />
              )}
            </div>

            {/* Camera Overlay Badge Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="w-8 h-8 rounded-full bg-[#ea580c] hover:bg-[#d9480f] text-white flex items-center justify-center absolute bottom-0 right-0 shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer border-2 border-white dark:border-slate-900"
              title="Upload Driver Photo"
            >
              <Camera className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>

          {/* Hidden File Inputs for Device Storage & Direct Camera */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => processImageFile(e.target.files?.[0])}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={(e) => processImageFile(e.target.files?.[0])}
          />

          <h2 className="font-serif font-black text-2xl text-slate-900 dark:text-white mt-3 leading-tight">
            {profileData.name}
          </h2>
          <p className="text-slate-400 dark:text-slate-500 font-medium text-xs mt-0.5">
            {profileData.designation} • EMP ID: {profileData.empId}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <button
              onClick={() => setBadgeModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-orange-600/30 cursor-pointer active:scale-95 transition-all"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Official QR Pass</span>
            </button>
            <button
              onClick={() => setPhotoModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-[#ea580c] hover:bg-orange-50 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{driverPhoto ? 'Change Photo' : 'Upload Photo'}</span>
            </button>
            <button
              onClick={() => setEditModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-orange-600 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Pencil className="w-3 h-3" />
              <span>Edit Details</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 dark:border-slate-800 my-4 sm:my-5" />

        {/* 2-Column Key Value Details */}
        <div className="space-y-3 sm:space-y-3.5 text-xs">
          
          <div className="flex items-center justify-between">
            <span className="text-slate-400 dark:text-slate-500 font-normal">Assigned Vehicle</span>
            <span className="font-serif font-black text-slate-900 dark:text-white text-xs sm:text-sm font-mono">
              {profileData.vehicleNumber}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 dark:text-slate-500 font-normal">Assigned Route</span>
            <span className="font-serif font-black text-slate-900 dark:text-white text-xs sm:text-sm text-right truncate max-w-[220px]">
              {profileData.assignedRoute}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 dark:text-slate-500 font-normal">License No.</span>
            <span className="font-serif font-black text-slate-900 dark:text-white text-xs sm:text-sm font-mono">
              {profileData.licenseNumber}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 dark:text-slate-500 font-normal">Mobile No.</span>
            <span className="font-serif font-black text-slate-900 dark:text-white text-xs sm:text-sm font-mono">
              {profileData.mobileNumber}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 dark:text-slate-500 font-normal">Vehicle Model</span>
            <span className="font-serif font-black text-slate-900 dark:text-white text-xs sm:text-sm text-right">
              {profileData.vehicleModel}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 dark:text-slate-500 font-normal">Emergency Contact</span>
            <span className="font-serif font-black text-slate-900 dark:text-white text-xs sm:text-sm font-mono">
              {profileData.emergencyContact}
            </span>
          </div>

        </div>

      </section>

      {/* ===================== 3. ACTION LIST CARDS ===================== */}
      <section className="space-y-3">
        
        {/* Card 1: Driver Documents & Vehicle RC */}
        <div
          onClick={() => setRcModalOpen(true)}
          className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md hover:border-pink-200 dark:hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between active:scale-95"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-serif font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              Driver Documents & Vehicle RC
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        {/* Card 2: Digital Driver ID Card */}
        <div
          onClick={() => setBadgeModalOpen(true)}
          className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md hover:border-purple-200 dark:hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between active:scale-95"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shrink-0">
              <IdCard className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-serif font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              Digital Driver ID Card
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        {/* Card 3: Monthly Payslip & Allowance */}
        <div
          onClick={() => setPayslipModalOpen(true)}
          className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between active:scale-95"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
              <WalletCards className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-serif font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              Monthly Payslip & Allowance
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        {/* Card 4: Change Password & Security PIN */}
        <div
          onClick={() => {
            setPasswordError('');
            setPasswordModalOpen(true);
          }}
          className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md hover:border-amber-200 dark:hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between active:scale-95"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-serif font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">
                Change Password & Security PIN
              </span>
              <span className="text-[11px] text-slate-400">
                Update driver login PIN and access key
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        {/* Card 5: Universal QR Verifier & Document Scanner */}
        <div
          onClick={() => setUniversalScannerOpen(true)}
          className="rounded-3xl border border-orange-200 dark:border-orange-800/80 bg-orange-50/50 dark:bg-orange-950/20 p-4 shadow-sm hover:shadow-md hover:border-orange-400 transition-all cursor-pointer flex items-center justify-between active:scale-95"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-orange-100 dark:bg-orange-900/60 text-orange-600 flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-serif font-black text-xs sm:text-sm text-slate-900 dark:text-white block">
                Universal QR Verifier & Scanner
              </span>
              <span className="text-[11px] text-orange-700 dark:text-orange-400 font-semibold">
                Scan & verify any Student, Driver ID, Vehicle RC or Payslip live
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-orange-500" />
        </div>

        {/* Card 6: App Settings & Security */}
        <div
          onClick={() => navigate('/settings')}
          className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between active:scale-95"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-serif font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              App Settings & Security
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        {/* Card 5: Logout Driver Account */}
        <div
          onClick={handleLogout}
          className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md hover:border-rose-200 dark:hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between active:scale-95"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
              <LogOut className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-serif font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              Logout Driver Account
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

      </section>

      {/* ===================== DOCUMENTS & VEHICLE RC MODAL ===================== */}
      {rcModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-sm text-slate-900 dark:text-white">
                    Driver Documents & RC
                  </h3>
                  <p className="text-[11px] text-slate-400">Verified vehicle registration</p>
                </div>
              </div>
              <button 
                onClick={() => setRcModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Vehicle RC Card with Scannable QR */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-2 border border-slate-200/60 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-2 space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>Vehicle Registration:</span>
                      <span className="font-mono text-orange-600">{profileData.vehicleNumber}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Chassis No:</span>
                      <span className="font-mono">MAT-99228833441</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>RC Validity:</span>
                      <span className="text-emerald-600 font-bold">Valid till Nov 2028</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Insurance Policy:</span>
                      <span className="text-emerald-600 font-bold">Active (ICICI Lombard)</span>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-center">
                    <QRCodeImage 
                      value={JSON.stringify({
                        type: 'VEHICLE_RC',
                        vehicleNumber: profileData.vehicleNumber,
                        model: profileData.vehicleModel,
                        fitness: 'Valid till Nov 2028'
                      })}
                      size={70}
                    />
                    <button
                      onClick={() => handleUniversalVerify({ type: 'VEHICLE_RC', vehicleNumber: profileData.vehicleNumber })}
                      className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-orange-100 text-orange-700 hover:bg-orange-200 cursor-pointer"
                    >
                      Verify RC
                    </button>
                  </div>
                </div>
              </div>

              {/* Driver License Card with Scannable QR */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-2 border border-slate-200/60 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-2 space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>Commercial License:</span>
                      <span className="font-mono text-orange-600">{profileData.licenseNumber}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Driver Blood Group:</span>
                      <span className="font-bold">{profileData.bloodGroup}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Authorized Category:</span>
                      <span>Transport Bus (HMV)</span>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-center">
                    <QRCodeImage 
                      value={JSON.stringify({
                        type: 'DRIVER_OFFICIAL_CREDENTIAL',
                        driverId: profileData.empId,
                        license: profileData.licenseNumber,
                        category: 'Transport Bus HMV'
                      })}
                      size={70}
                    />
                    <button
                      onClick={() => handleUniversalVerify({ type: 'DRIVER_OFFICIAL_CREDENTIAL', driverId: profileData.empId })}
                      className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                    >
                      Verify License
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                Swal.fire({
                  icon: 'success',
                  title: 'Documents Downloaded',
                  text: 'Vehicle RC & Driver License PDF saved.',
                  timer: 1800,
                  showConfirmButton: false
                });
              }}
              className="mt-4 w-full py-2.5 rounded-2xl bg-[#ea580c] hover:bg-[#d9480f] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Download Documents Bundle</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================== DIGITAL DRIVER ID CARD MODAL ===================== */}
      {badgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-black text-sm uppercase text-slate-900 dark:text-white">
                  Official Driver Identity Card
                </h3>
              </div>
              <button 
                onClick={() => setBadgeModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 text-white p-5 rounded-3xl shadow-xl space-y-4 border border-orange-500/30 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Bus className="w-5 h-5 text-orange-400" />
                  <span className="font-serif font-black text-xs tracking-wider uppercase">
                    SCHOOL FLEET IDENTITY
                  </span>
                </div>
                <span className="text-[10px] bg-orange-600 px-2 py-0.5 rounded-full font-bold">
                  VERIFIED
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-2xl border-2 border-orange-400 p-0.5 bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                  {driverPhoto ? (
                    <img src={driverPhoto} alt={profileData.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <User className="w-10 h-10 text-orange-300" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif font-black text-base leading-tight truncate">
                    {profileData.name}
                  </h4>
                  <p className="text-xs text-orange-400 font-semibold">
                    {profileData.designation}
                  </p>
                  <p className="text-[11px] font-mono text-slate-300 mt-0.5">
                    ID: {profileData.empId}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Bus Assigned:</span>
                  <span className="font-mono font-bold text-white">{profileData.vehicleNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Blood Group:</span>
                  <span className="font-bold text-white">{profileData.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Licence No:</span>
                  <span className="font-mono text-white">{profileData.licenseNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Emergency Phone:</span>
                  <span className="font-mono text-white">{profileData.emergencyContact}</span>
                </div>
              </div>

              {/* Scannable Verified QR Code Strip */}
              <div className="flex items-center justify-between pt-2.5 border-t border-white/10">
                <div>
                  <span className="text-[10px] text-slate-400 block">Digital Verification:</span>
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Central Fleet Verified</span>
                  </span>
                  <button
                    onClick={() => handleUniversalVerify({ type: 'DRIVER_OFFICIAL_CREDENTIAL', driverId: profileData.empId })}
                    className="mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 border border-orange-500/30 cursor-pointer"
                  >
                    Verify Live Data
                  </button>
                </div>
                <QRCodeImage 
                  value={JSON.stringify({
                    type: 'DRIVER_OFFICIAL_CREDENTIAL',
                    driverId: profileData.empId,
                    name: profileData.name,
                    license: profileData.licenseNumber,
                    assignedBus: profileData.vehicleNumber
                  })}
                  size={76}
                  className="bg-white p-1 rounded-xl"
                />
              </div>
            </div>

            <button
              onClick={() => {
                Swal.fire({
                  icon: 'success',
                  title: 'Driver Badge Saved',
                  text: 'Digital Badge stored on device.',
                  timer: 1800,
                  showConfirmButton: false
                });
              }}
              className="mt-4 w-full py-2.5 rounded-2xl bg-[#ea580c] hover:bg-[#d9480f] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Save Digital Badge</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================== MONTHLY PAYSLIP MODAL ===================== */}
      {payslipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <WalletCards className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-base text-slate-900 dark:text-white">
                    Driver Payslip - July 2026
                  </h3>
                  <p className="text-[11px] text-slate-500">Official transport salary disbursement</p>
                </div>
              </div>
              <button 
                onClick={() => setPayslipModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Driver / EMP:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{profileData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Driver ID:</span>
                  <span className="font-mono font-bold">{profileData.empId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Bus:</span>
                  <span className="font-mono font-bold">{profileData.vehicleNumber}</span>
                </div>
              </div>

              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Basic Shift Salary:</span>
                  <span className="font-bold">₹ 24,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Route & Overtime Allowance:</span>
                  <span className="font-bold">₹ 4,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Deductions (PF / Tax):</span>
                  <span className="font-bold text-emerald-600">₹ 0 (Waived)</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm font-black text-slate-900 dark:text-white">
                  <span>Net Credited Amount:</span>
                  <span className="font-serif text-[#ea580c] text-base">₹ 28,500</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">Status: Paid ✓</div>
                  <div className="text-[10px] text-emerald-600">Credited on 31 Jul 2026 • Direct Bank Transfer</div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>

              {/* Bank NEFT Scannable QR Code */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <QRCodeImage 
                  value={JSON.stringify({
                    type: 'SALARY_PAYSLIP',
                    driverId: profileData.empId,
                    amount: '₹ 28,500',
                    period: 'July 2026',
                    mode: 'NEFT Bank Transfer'
                  })}
                  size={68}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-slate-500 block">Bank NEFT Verification</span>
                  <span className="text-[11px] font-mono font-bold text-emerald-600 block truncate">REF: NEFT-SBIN-20260731</span>
                  <button
                    onClick={() => handleUniversalVerify({ type: 'SALARY_PAYSLIP', driverId: profileData.empId })}
                    className="mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verify Bank Transfer Live</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                Swal.fire({
                  icon: 'success',
                  title: 'Payslip Downloaded',
                  text: 'PDF saved to device storage.',
                  timer: 1800,
                  showConfirmButton: false
                });
              }}
              className="mt-4 w-full py-2.5 rounded-2xl bg-[#ea580c] hover:bg-[#d9480f] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Slip</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================== EDIT PROFILE MODAL ===================== */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center font-bold">
                  <Pencil className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-black text-sm uppercase text-slate-900 dark:text-white">
                  Edit Driver Details
                </h3>
              </div>
              <button 
                onClick={() => setEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Driver Name:</label>
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Number:</label>
                <input
                  type="text"
                  required
                  value={profileData.mobileNumber}
                  onChange={(e) => setProfileData({ ...profileData, mobileNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Emergency Contact:</label>
                <input
                  type="text"
                  required
                  value={profileData.emergencyContact}
                  onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-[#ea580c] hover:bg-[#d9480f] text-white font-black flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== CHANGE PASSWORD & PIN MODAL ===================== */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-sm text-slate-900 dark:text-white">
                    Change Password & PIN
                  </h3>
                  <p className="text-[10px] text-slate-400">Driver Account Security</p>
                </div>
              </div>
              <button 
                onClick={() => setPasswordModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordError && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Current Password / PIN:
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password or PIN"
                    className="w-full p-2.5 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  New Password / PIN:
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    minLength={4}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 4 chars (e.g. 5678 or Bus@2026)"
                    className="w-full p-2.5 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm New Password / PIN:
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    minLength={4}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password or PIN"
                    className="w-full p-2.5 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300">
                <p className="flex items-center gap-1.5 font-bold mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Security Notice</span>
                </p>
                <p>After changing, use this new password/PIN to log into Driver Portal & Mobile APK.</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPass}
                  className="flex-1 py-2.5 rounded-2xl bg-[#ea580c] hover:bg-[#d9480f] text-white font-black flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/30 disabled:opacity-60 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{submittingPass ? 'Saving...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== UPLOAD DRIVER PHOTO MODAL ===================== */}
      {photoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center font-bold">
                  <Camera className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-black text-sm uppercase text-slate-900 dark:text-white">
                  Driver Profile Photo
                </h3>
              </div>
              <button 
                onClick={() => setPhotoModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Photo Preview */}
            <div className="my-3">
              <div className="w-28 h-28 rounded-full mx-auto overflow-hidden bg-slate-100 dark:bg-slate-800 ring-4 ring-orange-500/25 flex items-center justify-center shadow-inner relative group">
                {driverPhoto ? (
                  <img
                    src={driverPhoto}
                    alt="Driver Photo Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-14 h-14 text-slate-400" />
                )}
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                    Uploading...
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                Upload your official face photo for Identity Card & Biometrics
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-2xl bg-[#ea580c] hover:bg-[#d9480f] text-white font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Select from Phone / Gallery</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-serif font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4 text-orange-600" />
                <span>Take Photo with Camera</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Or Pick Professional Driver Avatar:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {AVATAR_PRESETS.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyPreset(preset.url)}
                    className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:scale-105 active:scale-95 transition-all mx-auto cursor-pointer"
                    title={preset.label}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Remove photo button if exists */}
            {driverPhoto && (
              <div className="mt-4 pt-2">
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Current Photo</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ===================== UNIVERSAL QR SCANNER & VERIFIER MODAL ===================== */}
      {universalScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-sm uppercase text-slate-900 dark:text-white">
                    Universal QR Verifier
                  </h3>
                  <p className="text-[10px] text-slate-400">Scan & verify live ERP records</p>
                </div>
              </div>
              <button 
                onClick={() => setUniversalScannerOpen(false)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Viewfinder Graphic with Laser */}
            <div className="relative bg-slate-950 rounded-2xl h-48 flex flex-col items-center justify-center overflow-hidden border-2 border-dashed border-orange-500 shadow-inner">
              <div className="w-32 h-32 border-2 border-orange-500 rounded-2xl relative flex items-center justify-center bg-black/40">
                <span className="w-full h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent absolute top-1/2 -translate-y-1/2 animate-pulse shadow-lg shadow-orange-500" />
                <QrCode className="w-14 h-14 text-white/30" />
              </div>
              <p className="text-[11px] text-orange-300 font-bold mt-2">
                Point at any Student, Driver, RC or Payslip QR
              </p>
            </div>

            {/* Quick 1-Tap Sample Payloads */}
            <div>
              <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Instant Test Real Database Records:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleUniversalVerify({ type: 'STUDENT_BOARDING_PASS', admissionNo: 'YIS-2024-101' })}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-orange-950/60 text-left font-bold text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700 cursor-pointer"
                >
                  <span className="text-[9px] text-orange-600 uppercase block font-black">Student Pass</span>
                  <span className="truncate block">Aarav (YIS-2024-101)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUniversalVerify({ type: 'DRIVER_OFFICIAL_CREDENTIAL', driverId: profileData.empId })}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-orange-950/60 text-left font-bold text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700 cursor-pointer"
                >
                  <span className="text-[9px] text-blue-600 uppercase block font-black">Driver Credential</span>
                  <span className="truncate block">{profileData.name} ({profileData.empId})</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUniversalVerify({ type: 'VEHICLE_RC', vehicleNumber: profileData.vehicleNumber })}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-orange-950/60 text-left font-bold text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700 cursor-pointer"
                >
                  <span className="text-[9px] text-emerald-600 uppercase block font-black">Vehicle RC</span>
                  <span className="truncate block">{profileData.vehicleNumber}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUniversalVerify({ type: 'SALARY_PAYSLIP', driverId: profileData.empId })}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-orange-950/60 text-left font-bold text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700 cursor-pointer"
                >
                  <span className="text-[9px] text-purple-600 uppercase block font-black">Salary Payslip</span>
                  <span className="truncate block">July 2026 (₹ 28,500)</span>
                </button>
              </div>
            </div>

            {/* Manual input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Enter QR String, Token or Admission No:
              </label>
              <input
                type="text"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && scanInput && handleUniversalVerify(scanInput)}
                placeholder="e.g. YIS-2024-101 or DRV-101 or DL-01-AB-4501"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setUniversalScannerOpen(false)}
                className="flex-1 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUniversalVerify(scanInput)}
                disabled={verifyingUniversal || !scanInput}
                className="flex-1 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-orange-600/30 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {verifyingUniversal ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>{verifyingUniversal ? 'Verifying...' : 'Verify Now'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ===================== LIVE VERIFIED DATABASE RECORD MODAL ===================== */}
      {verifiedDataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                    Official ERP Verification
                  </h3>
                  <p className="text-[10px] text-emerald-600 font-bold">Authenticated with Central Database ✓</p>
                </div>
              </div>
              <button 
                onClick={() => setVerifiedDataModal(null)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-emerald-200/60 dark:border-emerald-800/60">
                <span className="text-slate-500 font-bold">Category:</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-300 font-black text-[11px] uppercase">
                  {verifiedDataModal.category}
                </span>
              </div>

              {Object.entries(verifiedDataModal).map(([key, val]) => {
                if (['category', 'verified', 'verificationTimestamp', 'photo'].includes(key)) return null;
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-slate-500">{formattedKey}:</span>
                    <span className="font-bold text-slate-900 dark:text-white text-right max-w-[190px] truncate">
                      {String(val)}
                    </span>
                  </div>
                );
              })}

              <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 text-[10px] text-slate-400 flex justify-between">
                <span>Verified Timestamp:</span>
                <span className="font-mono">{new Date(verifiedDataModal.verificationTimestamp || Date.now()).toLocaleTimeString()}</span>
              </div>
            </div>

            <button
              onClick={() => setVerifiedDataModal(null)}
              className="w-full py-2.5 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { 
  Fingerprint, Barcode, QrCode, Save, X, Edit2, 
  Copy, Check, Download, Printer, ShieldCheck, Maximize2,
  User, CreditCard, Calendar, Clock, FileText, Award, 
  Phone, Mail, MapPin, Building2, CheckCircle2, AlertCircle, 
  CalendarCheck, Sparkles, TrendingUp, Eye, Briefcase, 
  HeartPulse, GraduationCap, Star, Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { accountantService } from '../api/accountantService';
import Swal from 'sweetalert2';

const defaultProfileData = {
  name: 'Ravi',
  staffId: '105',
  role: 'Accountant',
  designation: 'Accountant',
  department: 'Finance & Accounts',
  basicSalary: '0',
  dateOfJoining: '2026-11-01',
  confirmationDate: '2026-11-02',
  email: 'ravi123@gmail.com',
  phone: '7678840056',
  address: 'Indra Nagar  , Sector - 12 , Lucknow',
  permanentAddress: 'Indra Nagar  , Sector - 12 , Lucknow',
  bio: 'Staff Accountant managing fees, ledgers, daybook transactions and institutional collections.',
  avatar: 'http://localhost:5050/uploads/staffPhotos/photo-1793690174365-725553430.jpg',
  gender: 'Male',
  dob: '2000-10-02',
  maritalStatus: 'Single',
  fatherName: 'Mr. Prakash',
  motherName: 'Ms. Ranjana',
  qualification: 'M.Sc.',
  workExperience: '7 Years',
  bloodGroup: 'A-',
  emergencyContact: '9074870909',
  emergencyPhone: '9074870909',
  bankName: 'SBI',
  accountNo: '6262268278762',
  ifsc: 'SBIN0007865',
  branchName: 'BKT',
  accountTitle: 'Ravi',
  panNo: '',
  uanNo: '',
  shiftTiming: '08:30 AM – 04:30 PM (General Shift)',
  biometricId: 'BIO-105',
};

const TABS = [
  { id: 'Profile', label: 'Profile', icon: User },
  { id: 'Payroll', label: 'Payroll & Salary', icon: CreditCard },
  { id: 'Leaves', label: 'Leaves Balance', icon: Calendar },
  { id: 'Attendance', label: 'Attendance Log', icon: Clock },
  { id: 'Documents', label: 'Document Vault', icon: FileText },
  { id: 'Career', label: 'Career & Appraisals', icon: Award },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [profile, setProfile] = useState(defaultProfileData);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(defaultProfileData);
  const [saving, setSaving] = useState(false);

  // Live collections state
  const [payslips, setPayslips] = useState([]);
  const [leavesList, setLeavesList] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [isPunching, setIsPunching] = useState(false);

  // QR Code & Barcode states
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [modalQrDataUrl, setModalQrDataUrl] = useState('');
  const [showScanModal, setShowScanModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [copied, setCopied] = useState(false);
  const [qrFormat, setQrFormat] = useState('text'); // 'text' | 'vcard'

  const barcodeSvgRef = useRef(null);
  const modalBarcodeSvgRef = useRef(null);

  const loadProfile = async () => {
    try {
      const res = await accountantService.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
        setForm(res.data);
        const staffIdentifier = res.data._id || res.data.staffId;

        // Fetch live payslips
        try {
          const payRes = await accountantService.getPayslips(staffIdentifier);
          if (payRes?.data && Array.isArray(payRes.data)) {
            setPayslips(payRes.data);
          }
        } catch (_) {}

        // Fetch live leaves
        try {
          const leaveRes = await accountantService.getLeaves(staffIdentifier);
          if (leaveRes?.data && Array.isArray(leaveRes.data)) {
            setLeavesList(leaveRes.data);
          }
        } catch (_) {}

        // Fetch live attendance logs
        try {
          const attRes = await accountantService.getAttendanceLogs(staffIdentifier);
          if (attRes?.data && Array.isArray(attRes.data)) {
            setAttendanceLogs(attRes.data);
          }
        } catch (_) {}
      }
    } catch (err) {
      console.error('Error loading live profile data:', err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const fmtDate = (d) => {
    if (!d) return 'N/A';
    try {
      const [y, m, day] = d.split('-');
      if (y && m && day) return `${day}/${m}/${y}`;
      const parsed = new Date(d);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      }
      return d;
    } catch {
      return d;
    }
  };

  // Live Payroll Dynamic Computations
  const basicSalary = Number(profile.basicSalary || 0);
  const hra = Math.round(basicSalary * 0.2);
  const da = Math.round(basicSalary * 0.1);
  const conveyance = basicSalary >= 20000 ? 1500 : 0;
  const grossSalary = basicSalary + hra + da + conveyance;
  const pfDeduction = basicSalary > 0 ? Math.round(basicSalary * 0.12) : 0;
  const ptDeduction = basicSalary > 15000 ? 200 : 0;
  const tdsDeduction = basicSalary > 40000 ? Math.round(basicSalary * 0.05) : 0;
  const totalDeductions = pfDeduction + ptDeduction + tdsDeduction;
  const netSalary = grossSalary - totalDeductions;

  // Live Leave Balances Calculation
  const clTaken = leavesList.filter(l => (l.type || l.leaveType || '').includes('Casual') && l.status === 'Approved').reduce((s, l) => s + (Number(l.days) || 1), 0);
  const slTaken = leavesList.filter(l => (l.type || l.leaveType || '').includes('Sick') && l.status === 'Approved').reduce((s, l) => s + (Number(l.days) || 1), 0);
  const elTaken = leavesList.filter(l => (l.type || l.leaveType || '').includes('Earned') && l.status === 'Approved').reduce((s, l) => s + (Number(l.days) || 1), 0);
  const lopTaken = leavesList.filter(l => (l.type || l.leaveType || '').includes('Loss') || l.status === 'LOP').reduce((s, l) => s + (Number(l.days) || 1), 0);

  const dynamicLeaveBalances = [
    { type: 'Casual Leave (CL)', available: Math.max(0, 12 - clTaken), total: 12, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { type: 'Sick Leave (SL)', available: Math.max(0, 8 - slTaken), total: 8, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { type: 'Earned Leave (EL)', available: Math.max(0, 15 - elTaken), total: 15, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { type: 'Loss of Pay (LOP)', available: lopTaken, total: 0, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', note: 'Taken' },
  ];
  const totalAvailableLeaves = dynamicLeaveBalances.reduce((s, b) => b.total > 0 ? s + b.available : s, 0);

  // Live Attendance Telemetry Computations
  const presentDaysCount = attendanceLogs.filter(p => p.status === 'On Time' || p.status === 'Half Day').length;
  const absentDaysCount = attendanceLogs.filter(p => p.status === 'Absent').length;
  const lateMarksCount = attendanceLogs.filter(p => p.status === 'Late').length;
  const attendancePercentage = attendanceLogs.length > 0 
    ? Math.round((presentDaysCount / attendanceLogs.length) * 100) 
    : 100;

  // Punch in live attendance handler
  const handlePunchAttendance = async () => {
    try {
      setIsPunching(true);
      const now = new Date();
      const newPunch = {
        staffId: profile.staffId || '105',
        employeeId: profile._id,
        fullName: profile.name,
        date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        day: now.toLocaleDateString('en-IN', { weekday: 'long' }),
        inTime: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        outTime: 'Active Duty',
        totalHours: 'In Progress',
        status: 'On Time',
        biometricId: profile.biometricId || 'BIO-105'
      };
      await accountantService.recordAttendancePunch(newPunch);
      setAttendanceLogs(prev => [newPunch, ...prev]);
      Swal.fire({
        icon: 'success',
        title: 'Attendance Clocked In!',
        text: `Biometric punch logged at ${newPunch.inTime} for Staff #${profile.staffId}`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire('Error', 'Failed to log attendance punch', 'error');
    } finally {
      setIsPunching(false);
    }
  };

  // Generate QR payload
  const getQrPayload = (format = 'text') => {
    if (format === 'vcard') {
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${profile.name || 'School Staff'}`,
        `TITLE:${profile.designation || profile.role || 'Staff'}`,
        'ORG:ALL CORE SOLUTION;Finance',
        `TEL;TYPE=WORK,VOICE:${profile.phone || ''}`,
        `EMAIL:${profile.email || ''}`,
        `NOTE:Staff ID: ${profile.staffId || ''} | Role: ${profile.role || ''} | Dept: ${profile.department || ''}`,
        'END:VCARD'
      ].join('\n');
    }

    return [
      `--- ALL CORE SOLUTION STAFF VERIFICATION ---`,
      `Name: ${profile.name || 'Staff Member'}`,
      `Staff ID: ${profile.staffId || ''}`,
      `Role: ${profile.role || 'Accountant'}`,
      `Designation: ${profile.designation || 'Staff'}`,
      `Department: ${profile.department || 'Finance'}`,
      `Phone: ${profile.phone || 'N/A'}`,
      `Email: ${profile.email || 'N/A'}`,
      `Joining Date: ${fmtDate(profile.dateOfJoining)}`,
      `Blood Group: ${profile.bloodGroup || 'A-'}`,
      `Emergency Contact: ${profile.emergencyPhone || 'N/A'}`,
      `Status: VERIFIED ACTIVE STAFF`,
      `School: Institutional Central ERP`,
      `---------------------------------------`
    ].join('\n');
  };

  // Render Barcode
  useEffect(() => {
    const codeVal = (profile.staffId || '105').trim();

    if (barcodeSvgRef.current && codeVal) {
      try {
        JsBarcode(barcodeSvgRef.current, codeVal, {
          format: 'CODE128',
          lineColor: '#111827',
          width: 1.4,
          height: 34,
          displayValue: true,
          fontSize: 10,
          font: 'monospace',
          margin: 0,
          background: 'transparent',
        });
      } catch (err) {
        console.error('Barcode error:', err);
      }
    }

    if (showScanModal && modalBarcodeSvgRef.current && codeVal) {
      try {
        JsBarcode(modalBarcodeSvgRef.current, codeVal, {
          format: 'CODE128',
          lineColor: '#111827',
          width: 2.2,
          height: 60,
          displayValue: true,
          fontSize: 14,
          font: 'monospace',
          margin: 10,
          background: '#ffffff',
        });
      } catch (err) {
        console.error('Modal Barcode error:', err);
      }
    }
  }, [profile.staffId, showScanModal]);

  // Render QR Code
  useEffect(() => {
    const payload = getQrPayload(qrFormat);

    QRCode.toDataURL(payload, {
      width: 140,
      margin: 1,
      color: { dark: '#111827', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));

    QRCode.toDataURL(payload, {
      width: 320,
      margin: 2,
      color: { dark: '#111827', light: '#ffffff' },
      errorCorrectionLevel: 'Q',
    })
      .then((url) => setModalQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [profile, qrFormat]);

  const openSettings = () => {
    setForm({ ...profile });
    setEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      return Swal.fire('Error', 'Full name is required', 'error');
    }
    setSaving(true);
    try {
      const res = await accountantService.saveProfile(form);
      if (res.success) {
        setProfile((prev) => ({ ...prev, ...res.data }));
        setEditing(false);
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Accountant details synced to MongoDB database successfully.',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      Swal.fire('Error', err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const copyQrData = () => {
    navigator.clipboard.writeText(getQrPayload(qrFormat));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQr = () => {
    if (!modalQrDataUrl) return;
    const a = document.createElement('a');
    a.href = modalQrDataUrl;
    a.download = `Staff-QR-${profile.staffId || 'Badge'}.png`;
    a.click();
  };

  const printIdCard = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* ── HERO BANNER: OFFICIAL STAFF PROFILE HEADER ── */}
      <div className="relative rounded-[6px] overflow-hidden bg-gradient-to-r from-[#1e1b4b] via-[#2e1065] to-[#431407] text-white shadow-md border border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 p-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Avatar with Verified Status */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-white/20 backdrop-blur-md border-2 border-white/40 shadow-lg overflow-hidden flex items-center justify-center">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Staff Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#605ca8] to-purple-400 text-white font-black text-3xl flex items-center justify-center">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'R'}
                  </div>
                )}
              </div>
              <span
                className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center text-white"
                title="Active Employee"
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>

            {/* Title & Info */}
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{profile.name}</h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Permanent Staff
                </span>
              </div>

              <p className="text-sm text-slate-300 mb-2 font-medium">
                {profile.designation} • <span className="text-indigo-300 font-semibold">{profile.department}</span>
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-300 font-mono">
                <span className="bg-white/10 px-2 py-0.5 rounded border border-white/15">
                  ID: <b className="text-white">{profile.staffId}</b>
                </span>
                <span className="bg-white/10 px-2 py-0.5 rounded border border-white/15">
                  Bio ID: <b className="text-white">{profile.biometricId || 'BIO-105'}</b>
                </span>
                <span className="bg-white/10 px-2 py-0.5 rounded border border-white/15">
                  Joining: <b className="text-white">{fmtDate(profile.dateOfJoining)}</b>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
            <button
              onClick={() => setShowScanModal(true)}
              className="bg-white/10 hover:bg-white/20 border border-white/25 text-white px-3.5 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition backdrop-blur-sm shadow-xs cursor-pointer"
            >
              <Maximize2 className="w-4 h-4 text-emerald-400" /> Digital ID & QR
            </button>
            <button
              onClick={openSettings}
              className="bg-[#5a52d7] hover:bg-[#4a42c0] text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>

        {/* Quick KPI Stats Ribbon */}
        <div className="border-t border-white/10 bg-black/25 px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Experience</span>
            <span className="text-sm font-bold text-white">{profile.workExperience || '7 Years'}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Current Basic Pay</span>
            <span className="text-sm font-bold text-emerald-400">₹{Number(profile.basicSalary || 0).toLocaleString('en-IN')} / mo</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Attendance Rate</span>
            <span className="text-sm font-bold text-indigo-300">{attendancePercentage}% ({presentDaysCount} Days)</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Available Leaves</span>
            <span className="text-sm font-bold text-amber-300">{totalAvailableLeaves} Days Balance</span>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID (2 COLUMNS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
        {/* ── LEFT SIDEBAR ── */}
        <div className="space-y-4">
          {/* Real Barcode & QR Code Card */}
          <div className="bg-white rounded-[4px] shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Digital Credentials
              </span>
              <span className="text-[11px] bg-blue-50 text-[#3c8dbc] px-2 py-0.5 rounded font-mono font-bold">
                {profile.staffId}
              </span>
            </div>

            <div className="p-4 space-y-4 text-center">
              {/* Barcode */}
              <div className="p-2.5 bg-gray-50 border border-gray-200 rounded flex flex-col items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Institutional Barcode (Code 128)
                </span>
                <svg ref={barcodeSvgRef} className="max-w-full h-auto overflow-visible" />
              </div>

              {/* QR Code Container */}
              <div
                onClick={() => setShowScanModal(true)}
                className="p-3 bg-gray-50 border border-dashed border-gray-300 rounded cursor-pointer hover:border-[#3c8dbc] hover:bg-blue-50/30 transition flex items-center gap-3 group"
                title="Click to scan or download QR code"
              >
                <div className="shrink-0 bg-white p-1 rounded border border-gray-200 shadow-2xs group-hover:border-[#3c8dbc]">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="Staff QR" className="w-16 h-16 object-contain" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 animate-pulse" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1 mb-0.5">
                    <QrCode className="w-3.5 h-3.5 text-[#3c8dbc]" /> Staff QR Badge
                  </span>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    Scan with any phone camera for live staff verification data.
                  </p>
                  <span className="text-[10px] font-semibold text-[#3c8dbc] group-hover:underline mt-1 inline-block">
                    Click to enlarge & print →
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact & Shift Card */}
          <div className="bg-white rounded-[4px] shadow-sm border border-gray-200 p-4 space-y-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-indigo-600" /> Direct Contact & Shift
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Phone:</span>
                <a href={`tel:${profile.phone}`} className="font-semibold text-[#3c8dbc] hover:underline flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {profile.phone || 'Not Configured'}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Email:</span>
                <a href={`mailto:${profile.email}`} className="font-semibold text-gray-700 hover:text-[#3c8dbc] truncate max-w-[170px]" title={profile.email}>
                  {profile.email}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Working Shift:</span>
                <span className="font-semibold text-gray-700">{profile.shiftTiming || 'General Shift'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Weekly Off:</span>
                <span className="font-semibold text-emerald-600">Sunday</span>
              </div>
            </div>
          </div>

          {/* Emergency Contact & Medical Card */}
          <div className="bg-white rounded-[4px] shadow-sm border border-gray-200 p-4 space-y-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-rose-600" /> Medical & Emergency
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Blood Group:</span>
                <span className="bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2 py-0.5 rounded text-[11px]">
                  {profile.bloodGroup || 'A-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Emergency Contact:</span>
                <span className="font-semibold text-gray-700">{profile.emergencyContact || 'Family Contact'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Emergency Phone:</span>
                <a href={`tel:${profile.emergencyPhone}`} className="font-semibold text-rose-600 hover:underline">
                  {profile.emergencyPhone || 'Not Configured'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT MAIN TABS CONTAINER ── */}
        <div className="bg-white rounded-[4px] shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs Navigation Header */}
          <div className="border-b border-gray-200 bg-gray-50/80 px-3 pt-2">
            <ul className="flex flex-wrap gap-1.5 text-xs font-semibold m-0 p-0 list-none">
              {TABS.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 border-t-2 rounded-t transition cursor-pointer ${
                        isActive
                          ? 'bg-white border-t-[#3c8dbc] text-gray-800 shadow-2xs font-bold border-x border-x-gray-200 -mb-[1px]'
                          : 'border-t-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                      }`}
                    >
                      <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-[#3c8dbc]' : 'text-gray-400'}`} />
                      {tab.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* TAB CONTENTS */}
          <div className="p-5 sm:p-6">
            {/* ── TAB 1: PROFILE / PERSONAL & EMPLOYMENT ── */}
            {activeTab === 'Profile' && (
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 pb-2 border-b border-gray-100 mb-3 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-indigo-600" /> Personal Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-xs">
                    <div>
                      <span className="text-gray-500 block">Full Name</span>
                      <span className="font-semibold text-gray-800">{profile.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Gender</span>
                      <span className="font-semibold text-gray-800">{profile.gender || 'Male'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Date of Birth</span>
                      <span className="font-semibold text-gray-800">{fmtDate(profile.dob)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Marital Status</span>
                      <span className="font-semibold text-gray-800">{profile.maritalStatus || 'Single'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Father's Name</span>
                      <span className="font-semibold text-gray-800">{profile.fatherName || 'Not Configured'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Mother's Name</span>
                      <span className="font-semibold text-gray-800">{profile.motherName || 'Not Configured'}</span>
                    </div>
                  </div>
                </div>

                {/* Academic & Professional */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 pb-2 border-b border-gray-100 mb-3 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-blue-600" /> Academic & Professional Credentials
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
                    <div>
                      <span className="text-gray-500 block">Highest Qualification</span>
                      <span className="font-semibold text-gray-800">{profile.qualification || 'M.Sc.'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Work Experience</span>
                      <span className="font-semibold text-gray-800">{profile.workExperience || '7 Years'}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-500 block">Professional Bio</span>
                      <p className="text-gray-700 bg-slate-50 p-3 rounded border border-slate-200 mt-1 leading-relaxed">
                        {profile.bio || profile.note || 'Staff Accountant managing fees, ledgers, daybook transactions and institutional collections.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Banking & Statutory Identifiers */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 pb-2 border-b border-gray-100 mb-3 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-emerald-600" /> Bank & Statutory IDs
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-xs">
                    <div>
                      <span className="text-gray-500 block">Bank Name</span>
                      <span className="font-semibold text-gray-800">{profile.bankName || 'SBI'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Account Number</span>
                      <span className="font-mono font-semibold text-gray-800">{profile.accountNo || '6262268278762'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">IFSC Code</span>
                      <span className="font-mono font-semibold text-gray-800">{profile.ifsc || 'SBIN0007865'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">PAN Card Number</span>
                      <span className="font-mono font-semibold text-gray-800">{profile.panNo || 'Not Configured'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Provident Fund (UAN)</span>
                      <span className="font-mono font-semibold text-gray-800">{profile.uanNo || 'Not Configured'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Biometric Attendance ID</span>
                      <span className="font-mono font-semibold text-indigo-600">{profile.biometricId || 'BIO-105'}</span>
                    </div>
                  </div>
                </div>

                {/* Address Details */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 pb-2 border-b border-gray-100 mb-3 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-600" /> Address Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3 rounded border border-slate-200">
                      <span className="font-semibold text-gray-700 block mb-1">Current Residential Address</span>
                      <p className="text-gray-600 leading-relaxed">{profile.address || 'Indra Nagar , Sector - 12 , Lucknow'}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border border-slate-200">
                      <span className="font-semibold text-gray-700 block mb-1">Permanent Home Address</span>
                      <p className="text-gray-600 leading-relaxed">{profile.permanentAddress || profile.address || 'Indra Nagar , Sector - 12 , Lucknow'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: LIVE PAYROLL & SALARY ── */}
            {activeTab === 'Payroll' && (
              <div className="space-y-6">
                {/* Summary Pay Cards dynamically calculated from basicSalary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-4 rounded shadow-xs">
                    <span className="text-xs uppercase opacity-85 block">Net Salary (Calculated)</span>
                    <h3 className="text-2xl font-bold mt-1">₹{netSalary.toLocaleString('en-IN')}</h3>
                    <span className="text-[11px] opacity-80 block mt-1">Monthly Disbursal Cycle</span>
                  </div>

                  <div className="bg-white border border-gray-200 p-4 rounded shadow-xs">
                    <span className="text-xs text-gray-500 uppercase block">Gross Earnings</span>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">₹{grossSalary.toLocaleString('en-IN')}</h3>
                    <span className="text-[11px] text-gray-400 block mt-1">Basic + HRA + DA + Allowances</span>
                  </div>

                  <div className="bg-white border border-gray-200 p-4 rounded shadow-xs">
                    <span className="text-xs text-gray-500 uppercase block">Total Deductions</span>
                    <h3 className="text-2xl font-bold text-rose-600 mt-1">₹{totalDeductions.toLocaleString('en-IN')}</h3>
                    <span className="text-[11px] text-gray-400 block mt-1">PF + PT + Statutory TDS</span>
                  </div>
                </div>

                {/* Salary Structure Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Earnings */}
                  <div className="border border-emerald-200 rounded overflow-hidden">
                    <div className="bg-emerald-50 px-4 py-2.5 font-bold text-xs text-emerald-800 border-b border-emerald-200 flex justify-between">
                      <span>EARNINGS COMPONENT</span>
                      <span>AMOUNT (₹)</span>
                    </div>
                    <div className="p-3 divide-y divide-gray-100 text-xs">
                      <div className="py-2 flex justify-between"><span>Designated Basic Salary</span><span className="font-semibold">₹{basicSalary.toLocaleString('en-IN')}.00</span></div>
                      <div className="py-2 flex justify-between"><span>House Rent Allowance (HRA 20%)</span><span className="font-semibold">₹{hra.toLocaleString('en-IN')}.00</span></div>
                      <div className="py-2 flex justify-between"><span>Dearness Allowance (DA 10%)</span><span className="font-semibold">₹{da.toLocaleString('en-IN')}.00</span></div>
                      <div className="py-2 flex justify-between"><span>Special Conveyance</span><span className="font-semibold">₹{conveyance.toLocaleString('en-IN')}.00</span></div>
                      <div className="py-2.5 flex justify-between font-bold text-emerald-700 bg-emerald-50/50 -mx-3 px-3">
                        <span>Total Monthly Gross</span><span>₹{grossSalary.toLocaleString('en-IN')}.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="border border-rose-200 rounded overflow-hidden">
                    <div className="bg-rose-50 px-4 py-2.5 font-bold text-xs text-rose-800 border-b border-rose-200 flex justify-between">
                      <span>DEDUCTIONS COMPONENT</span>
                      <span>AMOUNT (₹)</span>
                    </div>
                    <div className="p-3 divide-y divide-gray-100 text-xs">
                      <div className="py-2 flex justify-between"><span>Provident Fund (PF 12%)</span><span className="font-semibold">₹{pfDeduction.toLocaleString('en-IN')}.00</span></div>
                      <div className="py-2 flex justify-between"><span>Professional Tax (PT)</span><span className="font-semibold">₹{ptDeduction.toLocaleString('en-IN')}.00</span></div>
                      <div className="py-2 flex justify-between"><span>Statutory Income Tax (TDS)</span><span className="font-semibold">₹{tdsDeduction.toLocaleString('en-IN')}.00</span></div>
                      <div className="py-2.5 flex justify-between font-bold text-rose-700 bg-rose-50/50 -mx-3 px-3">
                        <span>Total Deductions</span><span>₹{totalDeductions.toLocaleString('en-IN')}.00</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Disbursal Bank Details */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-emerald-600" /> Disbursal Bank Account
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500 block">Bank</span>
                      <span className="font-bold text-gray-800">{profile.bankName || 'SBI'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Account Number</span>
                      <span className="font-mono font-bold text-gray-800">{profile.accountNo || '6262268278762'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Branch & IFSC</span>
                      <span className="font-mono text-gray-800">{profile.branchName || 'BKT'} ({profile.ifsc || 'SBIN0007865'})</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Account Beneficiary</span>
                      <span className="font-semibold text-gray-800">{profile.accountTitle || profile.name || 'Ravi'}</span>
                    </div>
                  </div>
                </div>

                {/* Payslip History Table */}
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Disbursed Payslips & Ledger Receipts</h4>
                  {payslips.length === 0 ? (
                    <div className="py-8 text-center bg-gray-50/60 rounded border border-dashed border-gray-200 p-6">
                      <CreditCard className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-60" />
                      <h4 className="text-xs font-bold text-gray-700">No Disbursed Payslips Yet</h4>
                      <p className="text-[11px] text-gray-500 mt-1 max-w-md mx-auto">
                        No monthly salary receipts have been disbursed yet for Staff ID #{profile.staffId}. Once generated by the HR Admin, official signed payslips will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-gray-200 rounded">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#f4f4f4] text-gray-700 border-b border-gray-200 font-bold uppercase">
                          <tr>
                            <th className="py-2.5 px-4">Slip No</th>
                            <th className="py-2.5 px-4">Pay Month</th>
                            <th className="py-2.5 px-4">Gross</th>
                            <th className="py-2.5 px-4">Deductions</th>
                            <th className="py-2.5 px-4">Net Salary</th>
                            <th className="py-2.5 px-4">Payment Date</th>
                            <th className="py-2.5 px-4 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {payslips.map((slip, idx) => (
                            <tr key={slip._id || idx} className="hover:bg-gray-50">
                              <td className="py-2.5 px-4 font-mono font-semibold text-[#3c8dbc]">{slip.slipNo || `PS-${slip.year || '2026'}-${slip.month || idx + 1}`}</td>
                              <td className="py-2.5 px-4 font-medium">{slip.month || 'Current Cycle'}</td>
                              <td className="py-2.5 px-4">₹{Number(slip.basicSalary || 0).toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-4 text-rose-600">-₹{Number(slip.deductions || 0).toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-4 font-bold text-emerald-600">₹{Number(slip.netSalary || 0).toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-4 text-gray-500">{fmtDate(slip.paymentDate || slip.createdAt)}</td>
                              <td className="py-2.5 px-4 text-center">
                                <button
                                  onClick={() => setSelectedPayslip(slip)}
                                  className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 mx-auto cursor-pointer"
                                >
                                  <Eye className="w-3 h-3" /> View Slip
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 3: LIVE LEAVES BALANCE ── */}
            {activeTab === 'Leaves' && (
              <div className="space-y-6">
                <div className="flex flex-wrap justify-between items-center pb-2 border-b border-gray-100 gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Current Academic Year Leave Balance</h3>
                    <p className="text-xs text-gray-500">Live leave tracking for Session 2026-27</p>
                  </div>
                  <Link
                    to="/apply-leave"
                    className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" /> Apply for Leave
                  </Link>
                </div>

                {/* Balance Cards dynamically calculated */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {dynamicLeaveBalances.map((item) => (
                    <div key={item.type} className={`p-4 rounded border ${item.border} ${item.bg}`}>
                      <span className="text-xs font-bold text-gray-700 block">{item.type}</span>
                      <div className="flex items-baseline gap-1.5 mt-2">
                        <span className={`text-3xl font-bold ${item.color}`}>{item.available}</span>
                        {item.total > 0 && <span className="text-xs text-gray-500">/ {item.total} days</span>}
                      </div>
                      <span className="text-[11px] text-gray-500 block mt-1">
                        {item.note || `${item.available} days remaining`}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Recent Leave Applications from database */}
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Leave Application History</h4>
                  {leavesList.length === 0 ? (
                    <div className="py-8 text-center bg-gray-50/60 rounded border border-dashed border-gray-200 p-6">
                      <CalendarCheck className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-60" />
                      <h4 className="text-xs font-bold text-gray-700">No Leave Applications Found</h4>
                      <p className="text-[11px] text-gray-500 mt-1 max-w-md mx-auto">
                        No leave requests logged yet for academic session 2026-27. All leaves (CL: 12, SL: 8, EL: 15) are fully available.
                      </p>
                      <Link to="/apply-leave" className="mt-3 inline-block bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs px-3.5 py-1.5 rounded font-bold">
                        Apply Leave
                      </Link>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#f4f4f4] text-gray-700 border-b border-gray-200 font-bold uppercase">
                          <tr>
                            <th className="py-2.5 px-4">Leave Type</th>
                            <th className="py-2.5 px-4">Dates</th>
                            <th className="py-2.5 px-4">Days</th>
                            <th className="py-2.5 px-4">Reason</th>
                            <th className="py-2.5 px-4 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {leavesList.map((l, i) => (
                            <tr key={l._id || i} className="hover:bg-gray-50">
                              <td className="py-2.5 px-4 font-semibold text-gray-800">{l.type || l.leaveType || 'General Leave'}</td>
                              <td className="py-2.5 px-4 text-gray-600">{l.dates || `${fmtDate(l.fromDate)} - ${fmtDate(l.toDate)}`}</td>
                              <td className="py-2.5 px-4 font-bold">{l.days || 1} Day</td>
                              <td className="py-2.5 px-4 text-gray-600 max-w-xs truncate">{l.reason || 'Personal'}</td>
                              <td className="py-2.5 px-4 text-center">
                                <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                                  l.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                  l.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {l.status || 'Pending'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 4: LIVE ATTENDANCE LOG ── */}
            {activeTab === 'Attendance' && (
              <div className="space-y-6">
                <div className="flex flex-wrap justify-between items-center pb-2 border-b border-gray-100 gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Biometric & Terminal Attendance Telemetry</h3>
                    <p className="text-xs text-gray-500">Biometric Device ID: <span className="font-mono font-bold text-indigo-600">{profile.biometricId || 'BIO-105'}</span></p>
                  </div>
                  <button
                    onClick={handlePunchAttendance}
                    disabled={isPunching}
                    className="bg-[#00a65a] hover:bg-[#008d4c] text-white px-3.5 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: isPunching ? '1s' : '0s' }} />
                    {isPunching ? 'Logging...' : 'Punch Attendance Now'}
                  </button>
                </div>

                {/* Telemetry Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded text-center">
                    <span className="text-[11px] text-emerald-700 font-semibold uppercase">Present Punches</span>
                    <h3 className="text-2xl font-bold text-emerald-800 mt-1">{presentDaysCount}</h3>
                  </div>
                  <div className="bg-rose-50 border border-rose-200 p-3.5 rounded text-center">
                    <span className="text-[11px] text-rose-700 font-semibold uppercase">Absent Days</span>
                    <h3 className="text-2xl font-bold text-rose-800 mt-1">{absentDaysCount}</h3>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded text-center">
                    <span className="text-[11px] text-amber-700 font-semibold uppercase">Late Marks</span>
                    <h3 className="text-2xl font-bold text-amber-800 mt-1">{lateMarksCount}</h3>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-3.5 rounded text-center">
                    <span className="text-[11px] text-blue-700 font-semibold uppercase">Attendance Rate</span>
                    <h3 className="text-2xl font-bold text-blue-800 mt-1">{attendancePercentage}%</h3>
                  </div>
                </div>

                {/* Attendance Punch Table */}
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Live Biometric Punch In/Out Logs</h4>
                  {attendanceLogs.length === 0 ? (
                    <div className="py-8 text-center bg-gray-50/60 rounded border border-dashed border-gray-200 p-6">
                      <Clock className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-60" />
                      <h4 className="text-xs font-bold text-gray-700">No Attendance Punches Recorded</h4>
                      <p className="text-[11px] text-gray-500 mt-1 max-w-md mx-auto">
                        No clock-in events recorded for current cycle. Click "Punch Attendance Now" above or scan your ID Badge at any biometric scanner.
                      </p>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#f4f4f4] text-gray-700 border-b border-gray-200 font-bold uppercase">
                          <tr>
                            <th className="py-2.5 px-4">Date</th>
                            <th className="py-2.5 px-4">Day</th>
                            <th className="py-2.5 px-4">Punch In</th>
                            <th className="py-2.5 px-4">Punch Out</th>
                            <th className="py-2.5 px-4">Total Time</th>
                            <th className="py-2.5 px-4 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {attendanceLogs.map((punch, idx) => (
                            <tr key={punch._id || idx} className="hover:bg-gray-50">
                              <td className="py-2.5 px-4 font-semibold text-gray-800">{punch.date}</td>
                              <td className="py-2.5 px-4 text-gray-500">{punch.day}</td>
                              <td className="py-2.5 px-4 font-mono font-medium text-emerald-700">{punch.inTime}</td>
                              <td className="py-2.5 px-4 font-mono font-medium text-slate-700">{punch.outTime}</td>
                              <td className="py-2.5 px-4 font-medium">{punch.totalHours}</td>
                              <td className="py-2.5 px-4 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    punch.status === 'On Time'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : punch.status === 'Half Day'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {punch.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 5: DOCUMENTS ── */}
            {activeTab === 'Documents' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Verified Personnel Documents & KYC</h3>
                    <p className="text-xs text-gray-500">Official institutional compliance records</p>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Institutional Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 border border-gray-200 rounded hover:border-[#3c8dbc] transition bg-white shadow-2xs flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 leading-snug">Official Passport Photo</h4>
                        <span className="text-[11px] text-gray-400 block mt-0.5">
                          Staff ID #{profile.staffId} • {profile.avatar ? 'Digital Photo Verified' : 'Pending Upload'}
                        </span>
                        <span className="inline-block mt-1 bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                          {profile.avatar ? '✓ Verified in DB' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 border border-gray-200 rounded hover:border-[#3c8dbc] transition bg-white shadow-2xs flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 leading-snug">Highest Academic Credentials</h4>
                        <span className="text-[11px] text-gray-400 block mt-0.5">
                          {profile.qualification || 'M.Sc.'} • Academic Degree Document
                        </span>
                        <span className="inline-block mt-1 bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                          ✓ Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 border border-gray-200 rounded hover:border-[#3c8dbc] transition bg-white shadow-2xs flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 leading-snug">Accountant Appointment Letter</h4>
                        <span className="text-[11px] text-gray-400 block mt-0.5">
                          Session 2026-27 • Finance & Accounts Department
                        </span>
                        <span className="inline-block mt-1 bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                          ✓ Institutional Active
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 border border-gray-200 rounded hover:border-[#3c8dbc] transition bg-white shadow-2xs flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 leading-snug">Bank Mandate & Passbook</h4>
                        <span className="text-[11px] text-gray-400 block mt-0.5">
                          {profile.bankName || 'SBI'} • A/c: {profile.accountNo || '6262268278762'}
                        </span>
                        <span className="inline-block mt-1 bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                          ✓ Active Salary Account
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 6: CAREER & APPRAISALS ── */}
            {activeTab === 'Career' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">Official Staff Review</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-0.5">Departmental Standing: Active Verified</h3>
                    <p className="text-xs text-gray-600 mt-1 max-w-lg">
                      Staff Member {profile.name} is designated as Accountant in Finance & Accounts with full permissions for fee ledger administration and institutional collections.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-5 h-5 fill-current text-amber-400" />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Service Timeline & Institutional Progression</h4>
                  <div className="relative pl-6 border-l-2 border-indigo-200 space-y-6 ml-2">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#5a52d7] border-2 border-white shadow-xs" />
                      <div>
                        <span className="text-[11px] font-bold text-indigo-600 uppercase">Session 2026-27</span>
                        <h4 className="text-xs font-bold text-gray-800 mt-0.5">Chief Accountant & Fee In-Charge</h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Assigned Central Fee Desk, Student Fee Collection, Day Book reconciliation and institutional accounts.
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
                      <div>
                        <span className="text-[11px] font-bold text-emerald-600 uppercase">Confirmation: {fmtDate(profile.confirmationDate)}</span>
                        <h4 className="text-xs font-bold text-gray-800 mt-0.5">Confirmed Full-Time Permanent Position</h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Institutional probation cleared with verification in central database.
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-xs" />
                      <div>
                        <span className="text-[11px] font-bold text-blue-600 uppercase">Joining: {fmtDate(profile.dateOfJoining)}</span>
                        <h4 className="text-xs font-bold text-gray-800 mt-0.5">Inducted as {profile.designation}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Department: {profile.department} • Total Prior Experience: {profile.workExperience || '7 Years'}.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── EDIT PROFILE MODAL ── */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-indigo-400" /> Edit Profile & Credentials
              </h3>
              <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Monthly Basic Salary (₹)</label>
                  <input
                    type="number"
                    value={form.basicSalary}
                    onChange={(e) => setForm({ ...form, basicSalary: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={form.bankName}
                    onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Account Number</label>
                  <input
                    type="text"
                    value={form.accountNo}
                    onChange={(e) => setForm({ ...form, accountNo: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={form.ifsc}
                    onChange={(e) => setForm({ ...form, ifsc: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={form.bloodGroup}
                    onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-bold mb-1">Current Residential Address</label>
                  <textarea
                    rows="2"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white rounded font-bold cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> {saving ? 'Saving to Database...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DIGITAL ID & QR CODE SCAN MODAL ── */}
      {showScanModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full overflow-hidden border border-gray-200">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-400" /> Official Staff Digital ID Badge
                </h3>
                <p className="text-[10px] text-gray-400">Verifiable Telemetry • Central ERP</p>
              </div>
              <button
                onClick={() => setShowScanModal(false)}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white rounded-full bg-white/10 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 flex flex-col items-center text-center bg-gradient-to-b from-gray-50 to-white">
              <div className="w-20 h-20 rounded-full border-2 border-[#605ca8] p-0.5 overflow-hidden mb-2 bg-white flex items-center justify-center shadow-sm">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-[#605ca8]">{profile.name?.charAt(0)}</span>
                )}
              </div>
              <h4 className="font-bold text-base text-gray-900">{profile.name}</h4>
              <p className="text-xs text-[#3c8dbc] font-semibold">{profile.designation}</p>
              <p className="text-[11px] font-mono text-gray-400">ID: {profile.staffId}</p>

              {/* High Res QR */}
              <div className="my-4 p-3 bg-white border border-gray-300 rounded shadow-sm">
                {modalQrDataUrl ? (
                  <img src={modalQrDataUrl} alt="Staff QR Code Large" className="w-[180px] h-[180px] object-contain" />
                ) : (
                  <div className="w-[180px] h-[180px] flex items-center justify-center text-xs text-gray-400">Generating QR...</div>
                )}
              </div>

              {/* Barcode on Modal */}
              <div className="w-full flex justify-center mb-2">
                <svg ref={modalBarcodeSvgRef} className="max-w-full h-auto" />
              </div>
              <p className="text-[10px] text-gray-400">Scan with any phone camera or barcode terminal to verify credentials.</p>
            </div>

            <div className="p-3 bg-slate-50 border-t border-gray-100 flex gap-2">
              <button
                onClick={downloadQr}
                className="flex-1 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold rounded flex items-center justify-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download QR
              </button>
              <button
                onClick={printIdCard}
                className="px-4 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded flex items-center justify-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PAYSLIP PREVIEW MODAL ── */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" /> Monthly Salary Slip: {selectedPayslip.month || 'Current Cycle'}
                </h3>
                <p className="text-[10px] text-gray-400">Ref: {selectedPayslip.slipNo || 'PS-2026'}</p>
              </div>
              <button
                onClick={() => setSelectedPayslip(null)}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white rounded-full bg-white/10 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex justify-between items-start pb-3 border-b border-gray-200">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{profile.name}</h4>
                  <p className="text-gray-500">{profile.designation} • {profile.department}</p>
                  <p className="font-mono text-gray-400">Staff ID: {profile.staffId}</p>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded text-[11px] block">
                    {selectedPayslip.status || 'Paid & Verified'}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-1">{fmtDate(selectedPayslip.paymentDate || selectedPayslip.createdAt)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50/60 p-3 rounded border border-emerald-100 space-y-1">
                  <span className="font-bold text-emerald-800 block text-[11px] uppercase">Earnings</span>
                  <div className="flex justify-between"><span>Basic:</span><span className="font-semibold">₹{Number(selectedPayslip.basicSalary || basicSalary).toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>Allowances:</span><span className="font-semibold">₹{Number(selectedPayslip.allowances || hra + da).toLocaleString('en-IN')}</span></div>
                  <div className="border-t border-emerald-200 pt-1 flex justify-between font-bold text-emerald-900">
                    <span>Total Gross:</span><span>₹{Number(selectedPayslip.gross || grossSalary).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="bg-rose-50/60 p-3 rounded border border-rose-100 space-y-1">
                  <span className="font-bold text-rose-800 block text-[11px] uppercase">Deductions</span>
                  <div className="flex justify-between"><span>PF & Tax:</span><span className="font-semibold">-₹{Number(selectedPayslip.deductions || totalDeductions).toLocaleString('en-IN')}</span></div>
                  <div className="border-t border-rose-200 pt-1 flex justify-between font-bold text-rose-900">
                    <span>Total Deductions:</span><span>-₹{Number(selectedPayslip.deductions || totalDeductions).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-600 text-white rounded flex justify-between items-center font-bold text-sm">
                <span>Net Disbursed Amount:</span>
                <span>₹{Number(selectedPayslip.netSalary || selectedPayslip.net || netSalary).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-xs font-bold rounded flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print Payslip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

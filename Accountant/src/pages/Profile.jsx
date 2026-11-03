import React, { useState, useEffect, useRef } from 'react';
import { 
  Fingerprint, Barcode, QrCode, Save, X, Edit2, 
  Copy, Check, Download, Printer, ShieldCheck, Maximize2,
  User, CreditCard, Calendar, Clock, FileText, Award, 
  Phone, Mail, MapPin, Building2, CheckCircle2, AlertCircle, 
  CalendarCheck, Sparkles, TrendingUp, Eye, Briefcase, 
  HeartPulse, GraduationCap, Star
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

const PAYSLIP_RECORDS = [
  { month: 'September 2026', gross: 47000, deductions: 6500, net: 40500, status: 'Paid', date: '30 Sep, 2026', slipNo: 'PS-2026-09' },
  { month: 'August 2026', gross: 47000, deductions: 6500, net: 40500, status: 'Paid', date: '31 Aug, 2026', slipNo: 'PS-2026-08' },
  { month: 'July 2026', gross: 47000, deductions: 6500, net: 40500, status: 'Paid', date: '31 Jul, 2026', slipNo: 'PS-2026-07' },
  { month: 'June 2026', gross: 45000, deductions: 6200, net: 38800, status: 'Paid', date: '30 Jun, 2026', slipNo: 'PS-2026-06' },
];

const LEAVE_BALANCES = [
  { type: 'Casual Leave (CL)', available: 8, total: 12, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { type: 'Sick Leave (SL)', available: 6, total: 8, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { type: 'Earned Leave (EL)', available: 15, total: 15, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  { type: 'Loss of Pay (LOP)', available: 1, total: 0, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', note: 'Taken' },
];

const RECENT_LEAVES = [
  { type: 'Medical Leave', dates: '04 Sep, 2026', days: 1.0, reason: 'Viral fever and medical checkup', status: 'Approved' },
  { type: 'Casual Leave', dates: '14 Aug, 2026', days: 1.0, reason: 'Family function in hometown', status: 'Approved' },
  { type: 'Earned Leave', dates: '02 Jun, 2026 - 05 Jun, 2026', days: 4.0, reason: 'Annual summer vacation', status: 'Approved' },
];

const ATTENDANCE_PUNCHES = [
  { date: '12 Oct, 2026', day: 'Monday', inTime: '08:24 AM', outTime: '04:32 PM', totalHours: '8h 08m', status: 'On Time' },
  { date: '11 Oct, 2026', day: 'Sunday', inTime: '—', outTime: '—', totalHours: '—', status: 'Weekly Off' },
  { date: '10 Oct, 2026', day: 'Saturday', inTime: '08:35 AM', outTime: '01:15 PM', totalHours: '4h 40m', status: 'Half Day' },
  { date: '09 Oct, 2026', day: 'Friday', inTime: '08:28 AM', outTime: '04:35 PM', totalHours: '8h 07m', status: 'On Time' },
  { date: '08 Oct, 2026', day: 'Thursday', inTime: '08:42 AM', outTime: '04:30 PM', totalHours: '7h 48m', status: 'Late' },
  { date: '07 Oct, 2026', day: 'Wednesday', inTime: '08:20 AM', outTime: '04:40 PM', totalHours: '8h 20m', status: 'On Time' },
];

const DOCUMENTS_LIST = [
  { title: 'Aadhaar Card (Identity Proof)', type: 'Government ID', format: 'PDF', size: '1.4 MB', date: '15 Jun, 2020', verified: true },
  { title: 'PAN Card (Tax Identification)', type: 'Tax ID', format: 'PDF', size: '820 KB', date: '15 Jun, 2020', verified: true },
  { title: 'Appointment & Joining Agreement', type: 'Employment Contract', format: 'PDF', size: '2.8 MB', date: '15 Jun, 2020', verified: true },
  { title: 'Master of Commerce (M.Com) Degree', type: 'Educational Degree', format: 'PDF', size: '3.1 MB', date: '18 Jun, 2020', verified: true },
  { title: 'Prior Experience & Relieving Certificate', type: 'Work Experience', format: 'PDF', size: '1.9 MB', date: '20 Jun, 2020', verified: true },
  { title: 'Police Character Verification Report', type: 'Background Check', format: 'PDF', size: '940 KB', date: '02 Jul, 2020', verified: true },
];

const CAREER_MILESTONES = [
  { year: '2026', title: 'ERP Lead & Central Cashier', desc: 'Promoted to manage campus ERP digital collections and multi-head accounts.' },
  { year: '2024', title: 'Award for Best Administrative Staff', desc: 'Commended by management for 100% audit reconciliation without any variance.' },
  { year: '2022', title: 'Senior Accountant Transition', desc: 'Elevated to oversee fee ledger structures and staff salary payroll computations.' },
  { year: '2020', title: 'Joined Y.U.G International School', desc: 'Inducted into Finance & Accounts Department as Junior Accountant.' },
];

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
        setProfile((prev) => ({ ...prev, ...res.data }));
        setForm((prev) => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error(err);
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
      return d;
    } catch {
      return d;
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
      `Blood Group: ${profile.bloodGroup || 'B+'}`,
      `Emergency Contact: ${profile.emergencyPhone || 'N/A'}`,
      `Status: VERIFIED ACTIVE STAFF`,
      `School: Y.U.G International School ERP`,
      `---------------------------------------`
    ].join('\n');
  };

  // Render Barcode
  useEffect(() => {
    const codeVal = (profile.staffId || '').trim();

    if (barcodeSvgRef.current && codeVal) {
      try {
        JsBarcode(barcodeSvgRef.current, codeVal, {
          format: 'CODE128',
          lineColor: '#111827',
          width: 1.3,
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
          title: 'Profile Updated!',
          text: 'Profile details and QR/Barcode have been re-generated.',
          icon: 'success',
          timer: 1600,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      Swal.fire('Error', err.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(getQrPayload(qrFormat));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!modalQrDataUrl) return;
    const a = document.createElement('a');
    a.href = modalQrDataUrl;
    a.download = `staff_qr_${profile.staffId || 'code'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadBarcode = () => {
    const canvas = document.createElement('canvas');
    try {
      JsBarcode(canvas, profile.staffId || '', {
        format: 'CODE128',
        width: 2.5,
        height: 70,
        displayValue: true,
        fontSize: 14,
        margin: 15,
        background: '#ffffff',
      });
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `staff_barcode_${profile.staffId || 'code'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333] p-4 sm:p-6 font-sans pb-20">
      {/* ── TOP HERO BANNER (PREMIUM GLASS-DARK HEADER) ── */}
      <div className="relative rounded-[6px] overflow-hidden shadow-sm mb-6 border border-slate-700 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

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
                  Bio ID: <b className="text-white">{profile.biometricId}</b>
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
              className="bg-white/10 hover:bg-white/20 border border-white/25 text-white px-3.5 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition backdrop-blur-sm shadow-xs"
            >
              <Maximize2 className="w-4 h-4 text-emerald-400" /> Digital ID & QR
            </button>
            <button
              onClick={openSettings}
              className="bg-[#5a52d7] hover:bg-[#4a42c0] text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>

        {/* Quick KPI Stats Ribbon */}
        <div className="border-t border-white/10 bg-black/25 px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Experience</span>
            <span className="text-sm font-bold text-white">{profile.workExperience?.split(' ')[0] || '6+'} Years</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Current Basic Pay</span>
            <span className="text-sm font-bold text-emerald-400">₹{Number(profile.basicSalary || 35000).toLocaleString('en-IN')} / mo</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Monthly Attendance</span>
            <span className="text-sm font-bold text-indigo-300">96.4% (24 / 25 Days)</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Available Leaves</span>
            <span className="text-sm font-bold text-amber-300">29 Days Balance</span>
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

            <div className="p-4 space-y-4">
              {/* Barcode Block */}
              <div
                onClick={() => setShowScanModal(true)}
                className="p-3 bg-gray-50 border border-dashed border-gray-300 rounded cursor-pointer hover:border-[#3c8dbc] hover:bg-blue-50/30 transition text-center group"
                title="Click to expand barcode"
              >
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span className="font-semibold text-gray-700 flex items-center gap-1">
                    <Barcode className="w-3.5 h-3.5 text-[#3c8dbc]" /> 1D Barcode
                  </span>
                  <span className="text-[10px] text-gray-400 group-hover:text-[#3c8dbc]">Code128</span>
                </div>
                <div className="flex justify-center bg-white p-1 rounded border border-gray-200">
                  <svg ref={barcodeSvgRef} className="max-w-full h-auto" />
                </div>
              </div>

              {/* QR Code Block */}
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
                  <Phone className="w-3 h-3" /> {profile.phone}
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
                <span className="font-semibold text-gray-700">08:30 AM – 04:30 PM</span>
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
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-[4px] transition-all border-b-2 font-medium ${
                        isActive
                          ? 'bg-white text-[#5a52d7] border-[#5a52d7] shadow-xs'
                          : 'text-gray-600 hover:text-gray-900 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#5a52d7]' : 'text-gray-400'}`} />
                      <span>{tab.label}</span>
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
                      <span className="font-semibold text-gray-800">{profile.maritalStatus || 'Married'}</span>
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
                      <p className="text-gray-600 leading-relaxed">{profile.address}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border border-slate-200">
                      <span className="font-semibold text-gray-700 block mb-1">Permanent Home Address</span>
                      <p className="text-gray-600 leading-relaxed">{profile.permanentAddress || profile.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: PAYROLL & SALARY ── */}
            {activeTab === 'Payroll' && (
              <div className="space-y-6">
                {/* Summary Pay Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-4 rounded shadow-xs">
                    <span className="text-xs uppercase opacity-85 block">Net Salary (Last Month)</span>
                    <h3 className="text-2xl font-bold mt-1">₹40,500</h3>
                    <span className="text-[11px] opacity-80 block mt-1">Disbursed on 30 Sep, 2026</span>
                  </div>

                  <div className="bg-white border border-gray-200 p-4 rounded shadow-xs">
                    <span className="text-xs text-gray-500 uppercase block">Gross Earnings</span>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">₹47,000</h3>
                    <span className="text-[11px] text-gray-400 block mt-1">Basic + HRA + DA + Allowances</span>
                  </div>

                  <div className="bg-white border border-gray-200 p-4 rounded shadow-xs">
                    <span className="text-xs text-gray-500 uppercase block">Total Deductions</span>
                    <h3 className="text-2xl font-bold text-rose-600 mt-1">₹6,500</h3>
                    <span className="text-[11px] text-gray-400 block mt-1">PF + TDS + Loan EMI</span>
                  </div>
                </div>

                {/* Salary Structure Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Earnings */}
                  <div className="border border-emerald-200 rounded overflow-hidden">
                    <div className="bg-emerald-50 px-4 py-2.5 font-bold text-xs text-emerald-800 border-b border-emerald-200 flex justify-between">
                      <span>EARNINGS (MONTHLY)</span>
                      <span>AMOUNT (₹)</span>
                    </div>
                    <div className="p-3 divide-y divide-gray-100 text-xs">
                      <div className="py-2 flex justify-between"><span>Basic Salary</span><span className="font-semibold">₹35,000.00</span></div>
                      <div className="py-2 flex justify-between"><span>House Rent Allowance (HRA)</span><span className="font-semibold">₹7,000.00</span></div>
                      <div className="py-2 flex justify-between"><span>Dearness Allowance (DA)</span><span className="font-semibold">₹3,500.00</span></div>
                      <div className="py-2 flex justify-between"><span>Special Conveyance</span><span className="font-semibold">₹1,500.00</span></div>
                      <div className="py-2.5 flex justify-between font-bold text-emerald-700 bg-emerald-50/50 -mx-3 px-3">
                        <span>Total Gross</span><span>₹47,000.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="border border-rose-200 rounded overflow-hidden">
                    <div className="bg-rose-50 px-4 py-2.5 font-bold text-xs text-rose-800 border-b border-rose-200 flex justify-between">
                      <span>DEDUCTIONS (MONTHLY)</span>
                      <span>AMOUNT (₹)</span>
                    </div>
                    <div className="p-3 divide-y divide-gray-100 text-xs">
                      <div className="py-2 flex justify-between"><span>Employees Provident Fund (PF)</span><span className="font-semibold">₹2,000.00</span></div>
                      <div className="py-2 flex justify-between"><span>Professional Tax (PT)</span><span className="font-semibold">₹200.00</span></div>
                      <div className="py-2 flex justify-between"><span>Income Tax (TDS)</span><span className="font-semibold">₹1,800.00</span></div>
                      <div className="py-2 flex justify-between"><span>Active Loan Repayment EMI</span><span className="font-semibold">₹2,500.00</span></div>
                      <div className="py-2.5 flex justify-between font-bold text-rose-700 bg-rose-50/50 -mx-3 px-3">
                        <span>Total Deductions</span><span>₹6,500.00</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payslip History Table */}
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Recent Payslips & Receipts</h4>
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
                        {PAYSLIP_RECORDS.map((slip) => (
                          <tr key={slip.slipNo} className="hover:bg-gray-50">
                            <td className="py-2.5 px-4 font-mono font-semibold text-[#3c8dbc]">{slip.slipNo}</td>
                            <td className="py-2.5 px-4 font-medium">{slip.month}</td>
                            <td className="py-2.5 px-4">₹{slip.gross.toLocaleString('en-IN')}</td>
                            <td className="py-2.5 px-4 text-rose-600">-₹{slip.deductions.toLocaleString('en-IN')}</td>
                            <td className="py-2.5 px-4 font-bold text-emerald-600">₹{slip.net.toLocaleString('en-IN')}</td>
                            <td className="py-2.5 px-4 text-gray-500">{slip.date}</td>
                            <td className="py-2.5 px-4 text-center">
                              <button
                                onClick={() => setSelectedPayslip(slip)}
                                className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 mx-auto"
                              >
                                <Eye className="w-3 h-3" /> View Slip
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 3: LEAVES BALANCE ── */}
            {activeTab === 'Leaves' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Current Academic Year Leave Balance</h3>
                    <p className="text-xs text-gray-500">Leave cycle: 01 April 2026 – 31 March 2027</p>
                  </div>
                  <Link
                    to="/leave"
                    className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" /> Apply for Leave
                  </Link>
                </div>

                {/* Balance Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {LEAVE_BALANCES.map((item) => (
                    <div key={item.type} className={`p-4 rounded border ${item.border} ${item.bg}`}>
                      <span className="text-xs font-bold text-gray-700 block">{item.type}</span>
                      <div className="flex items-baseline gap-1.5 mt-2">
                        <span className={`text-3xl font-bold ${item.color}`}>{item.available}</span>
                        {item.total > 0 && <span className="text-xs text-gray-500">/ {item.total} days</span>}
                      </div>
                      <span className="text-[11px] text-gray-500 block mt-1">
                        {item.note || 'Available to apply'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Recent Leave Applications */}
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Leave History</h4>
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
                        {RECENT_LEAVES.map((l, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="py-2.5 px-4 font-semibold text-gray-800">{l.type}</td>
                            <td className="py-2.5 px-4 text-gray-600">{l.dates}</td>
                            <td className="py-2.5 px-4 font-bold">{l.days} Day</td>
                            <td className="py-2.5 px-4 text-gray-600 max-w-xs truncate">{l.reason}</td>
                            <td className="py-2.5 px-4 text-center">
                              <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">
                                {l.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 4: ATTENDANCE LOG ── */}
            {activeTab === 'Attendance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded text-center">
                    <span className="text-[11px] text-emerald-700 font-semibold uppercase">Present Days</span>
                    <h3 className="text-2xl font-bold text-emerald-800 mt-1">24</h3>
                  </div>
                  <div className="bg-rose-50 border border-rose-200 p-3.5 rounded text-center">
                    <span className="text-[11px] text-rose-700 font-semibold uppercase">Absent Days</span>
                    <h3 className="text-2xl font-bold text-rose-800 mt-1">1</h3>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded text-center">
                    <span className="text-[11px] text-amber-700 font-semibold uppercase">Late Marks</span>
                    <h3 className="text-2xl font-bold text-amber-800 mt-1">2</h3>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-3.5 rounded text-center">
                    <span className="text-[11px] text-blue-700 font-semibold uppercase">Monthly Percentage</span>
                    <h3 className="text-2xl font-bold text-blue-800 mt-1">96.0%</h3>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Recent Biometric Punch In/Out Logs</h4>
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
                        {ATTENDANCE_PUNCHES.map((punch, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="py-2.5 px-4 font-semibold text-gray-800">{punch.date}</td>
                            <td className="py-2.5 px-4 text-gray-500">{punch.day}</td>
                            <td className="py-2.5 px-4 font-mono font-medium text-emerald-700">{punch.inTime}</td>
                            <td className="py-2.5 px-4 font-mono font-medium text-rose-700">{punch.outTime}</td>
                            <td className="py-2.5 px-4 font-medium">{punch.totalHours}</td>
                            <td className="py-2.5 px-4 text-center">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  punch.status === 'On Time'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : punch.status === 'Late'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-gray-100 text-gray-700'
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
                </div>
              </div>
            )}

            {/* ── TAB 5: DOCUMENT VAULT ── */}
            {activeTab === 'Documents' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Verified Personnel Documents</h3>
                    <p className="text-xs text-gray-500">Official HR records on file</p>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> All 6 Documents Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DOCUMENTS_LIST.map((doc, idx) => (
                    <div key={idx} className="p-3.5 border border-gray-200 rounded hover:border-[#3c8dbc] transition bg-white shadow-2xs flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-800 leading-snug">{doc.title}</h4>
                          <span className="text-[11px] text-gray-400 block mt-0.5">
                            {doc.type} • {doc.size} • Uploaded {doc.date}
                          </span>
                          <span className="inline-block mt-1 bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                            ✓ Verified
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => Swal.fire({ icon: 'info', title: doc.title, text: `Viewing verified file (${doc.size}). File is safe and digitally signed.` })}
                        className="p-1.5 text-gray-400 hover:text-[#3c8dbc] hover:bg-blue-50 rounded transition shrink-0"
                        title="Download / View"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB 6: CAREER & APPRAISALS ── */}
            {activeTab === 'Career' && (
              <div className="space-y-6">
                {/* Performance Rating Box */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">Annual Appraisal Review</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-0.5">Performance Rating: 4.8 / 5.0</h3>
                    <p className="text-xs text-gray-600 mt-1 max-w-lg">
                      "Exemplary dedication, zero ledger reconciliation discrepancies, and highly professional parent communication throughout the financial year."
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-6 h-6 fill-current text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Service History & Progression</h4>
                  <div className="relative pl-6 border-l-2 border-indigo-200 space-y-6 ml-2">
                    {CAREER_MILESTONES.map((m, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#5a52d7] border-2 border-white shadow-xs" />
                        <div>
                          <span className="text-xs font-bold text-[#5a52d7] font-mono">{m.year}</span>
                          <h5 className="text-sm font-bold text-gray-800">{m.title}</h5>
                          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{m.desc}</p>
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

      {/* ── MODAL: HIGH-RES SCANNER & VERIFICATION ── */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-[6px] shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-[16px] font-bold leading-tight">Staff ID Verification & Digital Badges</h3>
                  <p className="text-[11px] text-gray-300">Scannable Barcode & QR Code for phone cameras & barcode guns</p>
                </div>
              </div>
              <button onClick={() => setShowScanModal(false)} className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={profile.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
                    alt="Staff"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  <div>
                    <h4 className="font-bold text-[15px] text-gray-900">{profile.name}</h4>
                    <p className="text-xs text-gray-500">
                      {profile.designation} • <span className="font-mono text-[#3c8dbc] font-bold">{profile.staffId}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    ✓ Verified Active
                  </span>
                  <span className="text-[11px] text-gray-400 block mt-1">Y.U.G School ERP</span>
                </div>
              </div>

              {/* Grid: QR Code & Barcode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4 flex flex-col items-center text-center shadow-xs">
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-[#3c8dbc]" /> Quick Response (QR)
                    </span>
                    <div className="flex text-[11px] border border-gray-200 rounded overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setQrFormat('text')}
                        className={`px-2 py-0.5 font-semibold ${qrFormat === 'text' ? 'bg-[#3c8dbc] text-white' : 'bg-gray-50 text-gray-600'}`}
                      >
                        Info Text
                      </button>
                      <button
                        type="button"
                        onClick={() => setQrFormat('vcard')}
                        className={`px-2 py-0.5 font-semibold ${qrFormat === 'vcard' ? 'bg-[#3c8dbc] text-white' : 'bg-gray-50 text-gray-600'}`}
                      >
                        vCard Contact
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 border-2 border-slate-900 rounded-lg shadow-sm">
                    {modalQrDataUrl ? (
                      <img src={modalQrDataUrl} alt="Staff QR Code Large" className="w-[180px] h-[180px] object-contain" />
                    ) : (
                      <div className="w-[180px] h-[180px] flex items-center justify-center bg-gray-100">Loading...</div>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-500 mt-2">
                    Point your mobile phone camera to scan verified staff details.
                  </p>

                  <button
                    onClick={handleDownloadQR}
                    className="mt-3 w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Download QR Code (.png)
                  </button>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-4 flex flex-col items-center text-center shadow-xs">
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <Barcode className="w-4 h-4 text-[#3c8dbc]" /> 1D Barcode (Code128)
                    </span>
                    <span className="text-[11px] bg-blue-50 text-[#3c8dbc] px-2 py-0.5 rounded font-mono font-bold">
                      {profile.staffId}
                    </span>
                  </div>

                  <div className="bg-white p-3 border-2 border-slate-900 rounded-lg shadow-sm w-full flex flex-col items-center justify-center min-h-[180px]">
                    <svg ref={modalBarcodeSvgRef} className="max-w-full h-auto" />
                  </div>

                  <p className="text-[11px] text-gray-500 mt-2">
                    Scannable by all standard barcode guns & front gate terminals.
                  </p>

                  <button
                    onClick={handleDownloadBarcode}
                    className="mt-3 w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Barcode (.png)
                  </button>
                </div>
              </div>

              {/* Live Scanner Readout Box */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-700">
                    Live Scanner Readout (What phone camera sees):
                  </span>
                  <button
                    onClick={handleCopyPayload}
                    className="text-xs text-[#3c8dbc] hover:underline flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy Scanned Data'}
                  </button>
                </div>
                <div className="bg-slate-900 text-emerald-400 font-mono text-[11px] p-3 rounded border border-slate-800 whitespace-pre-wrap max-h-36 overflow-y-auto">
                  {getQrPayload(qrFormat)}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <button
                  onClick={() => window.print()}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Printer className="w-4 h-4" /> Print Staff Verification Badge
                </button>
                <button
                  onClick={() => setShowScanModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: PAYSLIP PREVIEW ── */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[6px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#3c8dbc] text-white px-5 py-3.5 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold">Salary Slip — {selectedPayslip.month}</h3>
                <span className="text-xs text-white/80">{selectedPayslip.slipNo}</span>
              </div>
              <button onClick={() => setSelectedPayslip(null)} className="text-white hover:text-white/80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="text-center pb-3 border-b border-gray-200">
                <h4 className="font-bold text-base text-gray-800">Y.U.G INTERNATIONAL SCHOOL</h4>
                <p className="text-gray-500 text-[11px]">Salary Pay Slip for {selectedPayslip.month}</p>
                <span className="inline-block mt-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px]">
                  Payment Status: {selectedPayslip.status} ({selectedPayslip.date})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded border border-gray-200">
                <div><span className="text-gray-500">Employee:</span> <b className="text-gray-800">{profile.name}</b></div>
                <div><span className="text-gray-500">Staff ID:</span> <b className="font-mono text-gray-800">{profile.staffId}</b></div>
                <div><span className="text-gray-500">Designation:</span> <b className="text-gray-800">{profile.designation}</b></div>
                <div><span className="text-gray-500">Bank A/C:</span> <b className="font-mono text-gray-800">••••{profile.accountNo?.slice(-4) || '1048'}</b></div>
              </div>

              <div className="border border-gray-200 rounded divide-y divide-gray-100">
                <div className="p-2.5 flex justify-between"><span>Gross Salary Earnings:</span><span className="font-bold">₹{selectedPayslip.gross.toLocaleString('en-IN')}.00</span></div>
                <div className="p-2.5 flex justify-between text-rose-600"><span>Total Deductions (PF/TDS/EMI):</span><span className="font-bold">-₹{selectedPayslip.deductions.toLocaleString('en-IN')}.00</span></div>
                <div className="p-2.5 flex justify-between font-bold text-sm bg-emerald-50 text-emerald-800">
                  <span>Net Salary Payable:</span>
                  <span>₹{selectedPayslip.net.toLocaleString('en-IN')}.00</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => window.print()}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-1.5 rounded text-xs font-semibold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Payslip
                </button>
                <button
                  onClick={() => setSelectedPayslip(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT / SETTINGS ── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[6px] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#5a52d7] text-white">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                <h3 className="text-[15px] font-bold">Edit Profile Details</h3>
              </div>
              <button onClick={() => setEditing(false)} className="hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { key: 'name', label: 'Full Name *' },
                  { key: 'staffId', label: 'Staff ID' },
                  { key: 'role', label: 'Role' },
                  { key: 'designation', label: 'Designation' },
                  { key: 'department', label: 'Department' },
                  { key: 'basicSalary', label: 'Basic Salary (₹)' },
                  { key: 'dateOfJoining', label: 'Date of Joining', type: 'date' },
                  { key: 'email', label: 'Email' },
                  { key: 'phone', label: 'Phone' },
                  { key: 'gender', label: 'Gender' },
                  { key: 'dob', label: 'Date of Birth', type: 'date' },
                  { key: 'maritalStatus', label: 'Marital Status' },
                  { key: 'bloodGroup', label: 'Blood Group' },
                  { key: 'qualification', label: 'Qualification' },
                  { key: 'workExperience', label: 'Work Experience' },
                  { key: 'bankName', label: 'Bank Name' },
                  { key: 'accountNo', label: 'Bank Account No.' },
                  { key: 'ifsc', label: 'IFSC Code' },
                  { key: 'panNo', label: 'PAN Card No.' },
                  { key: 'emergencyContact', label: 'Emergency Contact Person' },
                  { key: 'emergencyPhone', label: 'Emergency Phone' },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <label className="block text-[11px] font-bold text-[#444] mb-1">{label}</label>
                    <input
                      type={type || 'text'}
                      value={form[key] || ''}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-xs focus:outline-none focus:border-[#5a52d7]"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#444] mb-1">Current Residential Address</label>
                <textarea
                  value={form.address || ''}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={2}
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-xs focus:outline-none focus:border-[#5a52d7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#444] mb-1">Professional Bio / Notes</label>
                <textarea
                  value={form.bio || ''}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={2}
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-xs focus:outline-none focus:border-[#5a52d7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#444] mb-1">Profile Avatar URL</label>
                <input
                  type="text"
                  value={form.avatar || ''}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-xs focus:outline-none focus:border-[#5a52d7]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#5a52d7] hover:bg-[#4a42c0] text-white rounded text-xs font-semibold flex items-center gap-1.5 disabled:opacity-60 shadow-sm"
                >
                  <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

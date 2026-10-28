import React, { useState, useEffect } from 'react';
import {
  Bed,
  Building2,
  User,
  Phone,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Utensils,
  Plus,
  RefreshCw,
  X,
  Send,
  MessageSquare,
  QrCode,
  Download,
  Printer,
  ChevronRight,
  Sparkles,
  Info,
  Check,
  Home,
  Compass,
  Zap,
  Key,
  Shield,
  PhoneCall,
  MapPin,
  Layers,
  Award
} from 'lucide-react';
import parentService from '../../api/parentService';

export default function Hostel({ activeChild }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hostelData, setHostelData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('roomDetails'); // 'roomDetails', 'messMenu', 'gatePasses', 'routine', 'directory'
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Modals
  const [gatePassModalOpen, setGatePassModalOpen] = useState(false);
  const [gatePassForm, setGatePassForm] = useState({
    passType: 'Weekend Home Visit',
    departureDate: '',
    returnDate: '',
    destination: 'Dwarka Sector 12, New Delhi (Home)',
    guardianName: 'Rajesh Kumar Gupta (Father)',
    guardianPhone: '+91 98765 10000',
    reason: 'Family weekend visit'
  });
  const [submittingPass, setSubmittingPass] = useState(false);
  const [passSuccess, setPassSuccess] = useState(null);

  // Maintenance Modal
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [maintenanceForm, setMaintenanceForm] = useState({
    category: 'Electrical / AC Maintenance',
    roomNumber: '101',
    description: '',
    urgency: 'Standard (Within 24 Hours)'
  });
  const [submittingMaintenance, setSubmittingMaintenance] = useState(false);
  const [maintenanceSuccess, setMaintenanceSuccess] = useState(null);

  // Printable Pass Modal
  const [activePrintPass, setActivePrintPass] = useState(null);
  const [notification, setNotification] = useState(null);

  // Fetch hostel details
  const fetchHostelData = async (isBackground = false) => {
    try {
      if (!isBackground) setRefreshing(true);
      const params = {};
      if (activeChild) params.studentId = activeChild;

      const res = await parentService.getHostelData(params);
      if (res?.success && res.data) {
        setHostelData(res.data);
        setError(null);
      } else {
        setError(res?.message || 'Failed to fetch hostel details');
      }
    } catch (err) {
      console.error('Error fetching hostel details:', err);
      setError('Unable to reach hostel server. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHostelData(false);

    // Auto set today's day of week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[new Date().getDay()];
    setSelectedDay(currentDay);
  }, [activeChild]);

  // Submit Gate Pass Form
  const handleSubmitGatePass = async (e) => {
    e.preventDefault();
    if (!gatePassForm.destination || !gatePassForm.departureDate) return;
    setSubmittingPass(true);
    try {
      const res = await parentService.applyHostelGatePass({
        ...gatePassForm
      });
      if (res?.success) {
        setPassSuccess(res.message);
        setTimeout(() => {
          setPassSuccess(null);
          setGatePassModalOpen(false);
        }, 3000);
        await fetchHostelData(true);
      }
    } catch (err) {
      console.error('Gate pass submission error:', err);
    } finally {
      setSubmittingPass(false);
    }
  };

  // Submit Maintenance Form
  const handleSubmitMaintenance = async (e) => {
    e.preventDefault();
    if (!maintenanceForm.description.trim()) return;
    setSubmittingMaintenance(true);
    try {
      const res = await parentService.submitHostelMaintenance({
        ...maintenanceForm
      });
      if (res?.success) {
        setMaintenanceSuccess(res.message);
        setTimeout(() => {
          setMaintenanceSuccess(null);
          setMaintenanceModalOpen(false);
          setMaintenanceForm(prev => ({ ...prev, description: '' }));
        }, 3000);
      }
    } catch (err) {
      console.error('Maintenance error:', err);
    } finally {
      setSubmittingMaintenance(false);
    }
  };

  if (loading && !hostelData) {
    return (
      <div className="p-6 max-w-[1400px] mx-auto min-h-[600px] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#353A40] border-t-amber-500 rounded-none animate-spin mb-4"></div>
        <p className="text-gray-700 font-bold text-[15px]">Connecting to Hostel Management Desk...</p>
        <p className="text-gray-400 text-[12px] mt-1">Retrieving Room Allocation, Mess Schedules & Gate Passes</p>
      </div>
    );
  }

  const { student, allocation, hostel, room, roommates = [], weeklyMessMenu = [], dailyRoutine = [], gatePasses = [], allHostels = [] } = hostelData || {};
  const todayMenu = weeklyMessMenu.find(m => m.day.toLowerCase() === selectedDay.toLowerCase()) || weeklyMessMenu[0];

  return (
    <div className="p-3 sm:p-5 max-w-[1400px] mx-auto min-h-screen bg-slate-50 space-y-5 pb-24">
      
      {/* Toast Notification */}
      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-[13px] font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          TOP COMMAND HEADER & STUDENT BOARDER PROFILE
          ========================================================================= */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white p-5 sm:p-7 rounded-3xl shadow-lg border border-blue-400/20 relative overflow-hidden">
        {/* Glow circle */}
        <div className="absolute -right-16 -top-16 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          
          <div className="flex items-start gap-4">
            <div className="w-13 h-13 rounded-2xl bg-white/15 backdrop-blur-md text-amber-300 flex items-center justify-center flex-shrink-0 font-bold shadow-md border border-white/20">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-serif">
                  {hostel?.name || 'Tagore Boys Hostel (Block A)'}
                </h1>
                <span className="px-3 py-1 rounded-full bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 text-[10px] font-black uppercase tracking-wider backdrop-blur-sm">
                  Active Boarder
                </span>
              </div>
              <p className="text-[12px] text-blue-100 mt-1 flex items-center gap-2 flex-wrap">
                <span>Resident: <strong className="text-white">{student?.name || 'Kabir Singh'}</strong> ({student?.className || 'Class 10th (A)'})</span>
                <span className="text-blue-300/60">•</span>
                <span>Room: <strong className="text-amber-300 font-mono">Room {room?.roomNumber || '101'}</strong> ({allocation?.bedNumber || 'Bed 1'})</span>
                <span className="text-blue-300/60">•</span>
                <span>Warden: <strong className="text-white">{hostel?.warden?.name || 'Rajesh Sharma'}</strong></span>
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
            <button
              onClick={() => setGatePassModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-[12px] font-extrabold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Apply Gate Pass</span>
            </button>

            <button
              onClick={() => setMaintenanceModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-xs backdrop-blur-sm cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Maintenance</span>
            </button>

            <a
              href={`tel:${hostel?.warden?.rawPhone || '9876543210'}`}
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-xs backdrop-blur-sm cursor-pointer"
              title="Call Warden"
            >
              <Phone className="w-4 h-4 text-emerald-300" />
              <span>Call Warden</span>
            </a>

            <button
              onClick={() => fetchHostelData(false)}
              disabled={refreshing}
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-xs backdrop-blur-sm cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Syncing...' : 'Sync'}</span>
            </button>
          </div>

        </div>

        {/* 4 Highlights Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/15 relative z-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl text-center shadow-xs">
            <span className="text-[22px] font-black tracking-tight font-mono text-amber-300 block leading-none">
              Room {room?.roomNumber || '101'}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-200 mt-1.5 block">
              {room?.roomType || 'Deluxe AC (2-Bed)'}
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl text-center shadow-xs">
            <span className="text-[22px] font-black tracking-tight font-mono text-white block leading-none">
              {allocation?.bedNumber?.split(' ')[0] || 'Bed 1'}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-200 mt-1.5 block">
              Window Side (Ground Floor)
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl text-center shadow-xs">
            <span className="text-[22px] font-black tracking-tight font-mono text-emerald-300 block leading-none">
              ₹{allocation?.monthlyFee || 5500}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-200 mt-1.5 block">
              Monthly Boarding Fee (Paid)
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl text-center shadow-xs">
            <span className="text-[22px] font-black tracking-tight font-mono text-white block leading-none">
              {gatePasses.length} Passes
            </span>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-200 mt-1.5 block">
              Total Outpasses Issued
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TOP 3 HIGHLIGHT INFORMATION CARDS
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Room & Bed Allotment Details */}
        <div className="bg-white border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-indigo-600" />
                Allotted Room & Bed
              </span>
              <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                {room?.inspectionGrade || 'A+ Grade Verified'}
              </span>
            </div>

            <div className="mt-3.5 space-y-2.5 text-[12.5px]">
              <div className="flex justify-between">
                <span className="text-gray-500">Hostel Block:</span>
                <strong className="text-gray-900">{hostel?.name || 'Tagore Boys Hostel'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Floor & Wing:</span>
                <strong className="text-gray-900">{room?.floor || 'Ground Floor (East Wing)'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Room Type:</span>
                <strong className="text-indigo-600">{room?.roomType || 'Deluxe AC (2-Bed)'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Bed Allocation:</span>
                <strong className="text-gray-900">{allocation?.bedNumber || 'Bed 1 (Window Side)'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Allotted Since:</span>
                <strong className="text-gray-900">01 August 2026</strong>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Status: <strong className="text-emerald-600">Active Boarding</strong></span>
            <span>Card: <strong className="font-mono text-gray-700">{student?.hostelCardNo || 'HST-CRD-8841'}</strong></span>
          </div>
        </div>

        {/* Card 2: Warden & Security Contact */}
        <div className="bg-white border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Resident Warden & Security
              </span>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 border border-indigo-200">
                24x7 Campus Security
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 border border-amber-300 flex items-center justify-center font-bold text-amber-900 text-[16px] flex-shrink-0">
                {hostel?.warden?.name?.charAt(0) || 'R'}
              </div>
              <div>
                <h4 className="font-bold text-[14px] text-gray-900 leading-tight">
                  {hostel?.warden?.name || 'Rajesh Sharma'}
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Resident Warden (Block A & B)</p>
                <p className="text-[10.5px] text-gray-400 font-mono mt-0.5">{hostel?.warden?.phone || '+91 98765 43210'}</p>
              </div>
            </div>

            <div className="mt-3 p-2.5 bg-gray-50 border border-gray-100 text-[11px] text-gray-600 space-y-1">
              <p><strong>Office Cabin:</strong> {hostel?.warden?.officeCabin || 'Block A Ground Floor (#G-02)'}</p>
              <p><strong>Security Gate:</strong> {hostel?.security?.mainGatePhone || '+91 98765 43220'} (24x7 Desk)</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
            <a
              href={`tel:${hostel?.warden?.rawPhone || '9876543210'}`}
              className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11.5px] font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Warden</span>
            </a>
            <a
              href={`https://wa.me/${hostel?.warden?.whatsapp || '919876543210'}?text=Hello%20Warden%20${encodeURIComponent(hostel?.warden?.name || 'Rajesh Sharma')},%20inquiring%20about%20student%20Aarav%20Sharma%20(Room%20101)`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-[#25D366] hover:bg-[#1fb355] text-white text-[11.5px] font-bold flex items-center gap-1 transition-colors"
              title="WhatsApp Warden"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Card 3: Room Amenities & Campus Facility */}
        <div className="bg-white border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Included Room Amenities
              </span>
              <span className="text-[10px] font-bold text-gray-500">
                Deluxe Spec
              </span>
            </div>

            <div className="mt-3 space-y-1.5 text-[11.5px] text-gray-700">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Split Air Conditioner (Voltas 1.5 Ton)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Attached Washroom + 24x7 Hot Water Geyser</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>High-Speed Campus Wi-Fi (100 Mbps)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Steel Dual-Lock Personal Wardrobe</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Ergonomic Study Desk & Reading Lamp</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>24x7 Power Backup Generator</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => setMaintenanceModalOpen(true)}
              className="text-amber-700 hover:text-amber-800 text-[11.5px] font-bold flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Report AC / Room Issue</span>
            </button>
            <span className="text-[10.5px] font-mono text-gray-400">Inspected Monthly</span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          INTERACTIVE MULTI-TABS MANAGEMENT SECTION
          ========================================================================= */}
      <div className="bg-white border border-gray-200 shadow-sm">
        
        {/* Tabs Bar */}
        <div className="flex border-b border-gray-200 bg-gray-50/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('roomDetails')}
            className={`px-5 py-3 text-[13px] font-bold border-b-2 flex items-center gap-2 transition-colors flex-shrink-0 ${
              activeTab === 'roomDetails'
                ? 'border-amber-500 text-amber-900 bg-white shadow-sm'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bed className="w-4 h-4 text-amber-600" />
            <span>Room & Roommate Details</span>
          </button>

          <button
            onClick={() => setActiveTab('messMenu')}
            className={`px-5 py-3 text-[13px] font-bold border-b-2 flex items-center gap-2 transition-colors flex-shrink-0 ${
              activeTab === 'messMenu'
                ? 'border-amber-500 text-amber-900 bg-white shadow-sm'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Utensils className="w-4 h-4 text-indigo-600" />
            <span>Dining Hall & Mess Menu</span>
          </button>

          <button
            onClick={() => setActiveTab('gatePasses')}
            className={`px-5 py-3 text-[13px] font-bold border-b-2 flex items-center gap-2 transition-colors flex-shrink-0 ${
              activeTab === 'gatePasses'
                ? 'border-amber-500 text-amber-900 bg-white shadow-sm'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>Outpass & Gate Passes ({gatePasses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('routine')}
            className={`px-5 py-3 text-[13px] font-bold border-b-2 flex items-center gap-2 transition-colors flex-shrink-0 ${
              activeTab === 'routine'
                ? 'border-amber-500 text-amber-900 bg-white shadow-sm'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Clock className="w-4 h-4 text-purple-600" />
            <span>Hostel Daily Routine & Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`px-5 py-3 text-[13px] font-bold border-b-2 flex items-center gap-2 transition-colors flex-shrink-0 ${
              activeTab === 'directory'
                ? 'border-amber-500 text-amber-900 bg-white shadow-sm'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-gray-600" />
            <span>Campus Hostels Directory ({allHostels.length})</span>
          </button>
        </div>

        {/* TAB 1: ROOM & ROOMMATE DETAILS */}
        {activeTab === 'roomDetails' && (
          <div className="p-5 space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-[15px] text-gray-900">
                  Room 101 Allotment Roster
                </h3>
                <p className="text-[12px] text-gray-500">Deluxe 2-Bed Air Conditioned Suite • Ground Floor East Wing</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                Bed Capacity: 2 / 2 (Full)
              </span>
            </div>

            {/* Beds Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bed 1: Aarav Sharma */}
              <div className="p-4 bg-amber-50/60 border-2 border-amber-400 shadow-sm relative">
                <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-500 text-gray-950 text-[10px] font-black uppercase">
                  ★ Your Ward
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-500 text-gray-950 flex items-center justify-center font-bold text-[18px]">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-[15px] text-gray-900 leading-tight">{student?.name || 'Aarav Sharma'}</h4>
                    <p className="text-[11.5px] text-gray-600 mt-0.5">Bed 1 (Window & Balcony Side)</p>
                    <p className="text-[11px] font-mono text-gray-500 mt-0.5">{student?.className || 'Class I (A)'} • {student?.admissionNo || 'YIS-2024-101'}</p>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-amber-200/80 text-[11.5px] text-gray-700 space-y-1">
                  <p><strong>Fee Status:</strong> Paid for Academic Term (₹5,500/mo)</p>
                  <p><strong>Emergency Contact:</strong> +91 98765 10000 (Father)</p>
                </div>
              </div>

              {/* Bed 2: Roommate */}
              {roommates.map((mate, i) => (
                <div key={i} className="p-4 bg-white border border-gray-200 hover:border-gray-300 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 border border-gray-300 text-gray-700 flex items-center justify-center font-bold text-[18px]">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-[15px] text-gray-900 leading-tight">{mate.studentName}</h4>
                      <p className="text-[11.5px] text-gray-600 mt-0.5">{mate.bedNumber || 'Bed 2 (Door Side)'}</p>
                      <p className="text-[11px] font-mono text-gray-500 mt-0.5">{mate.className} • Roll #{mate.admissionNo}</p>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-gray-200 text-[11.5px] text-gray-700 space-y-1">
                    <p><strong>Hometown:</strong> {mate.hometown || 'Jaipur, Rajasthan'}</p>
                    <p><strong>Guardian Phone:</strong> {mate.emergencyContact}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Room Specifications & Rules */}
            <div className="bg-gray-50 border border-gray-200 p-4 space-y-2 text-[12px] text-gray-700">
              <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Room Hygiene & Maintenance Guidelines
              </h4>
              <p>• Daily housekeeping and floor sanitization is conducted between 09:30 AM and 11:30 AM.</p>
              <p>• Air conditioning operates on automated energy-saving timer (02:30 PM - 05:00 PM and 09:00 PM - 06:00 AM).</p>
              <p>• Electric kettles, heaters, and high-wattage personal appliances are strictly prohibited per fire safety bylaws.</p>
            </div>
          </div>
        )}

        {/* TAB 2: DINING HALL & MESS MENU */}
        {activeTab === 'messMenu' && (
          <div className="p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
              <div>
                <h3 className="font-bold text-[15px] text-gray-900 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-600" />
                  Weekly Dining Hall Nutrition Chart
                </h3>
                <p className="text-[12px] text-gray-500">Prepared fresh 4 times daily by certified catering staff • FSSAI Certified Kitchen</p>
              </div>

              {/* Day filter buttons */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {weeklyMessMenu.map(m => (
                  <button
                    key={m.day}
                    onClick={() => setSelectedDay(m.day)}
                    className={`px-3 py-1 text-[11.5px] font-bold transition-colors ${
                      selectedDay.toLowerCase() === m.day.toLowerCase()
                        ? 'bg-amber-500 text-gray-950 shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {m.day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Day Meals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Breakfast */}
              <div className="bg-amber-50/50 border border-amber-200 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                    <span className="font-extrabold text-[12px] text-amber-900 uppercase tracking-wider">Breakfast</span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5">07:15 AM - 08:00 AM</span>
                  </div>
                  <p className="text-[13px] text-gray-800 mt-3 font-medium leading-relaxed">
                    {todayMenu.breakfast}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-gray-400 mt-4 pt-2 border-t border-amber-200/60 block">
                  Energy & Protein Rich
                </span>
              </div>

              {/* Lunch */}
              <div className="bg-emerald-50/50 border border-emerald-200 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                    <span className="font-extrabold text-[12px] text-emerald-900 uppercase tracking-wider">Lunch</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5">02:45 PM - 03:30 PM</span>
                  </div>
                  <p className="text-[13px] text-gray-800 mt-3 font-medium leading-relaxed">
                    {todayMenu.lunch}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-gray-400 mt-4 pt-2 border-t border-emerald-200/60 block">
                  Complete Balanced Meal
                </span>
              </div>

              {/* Evening Snacks */}
              <div className="bg-purple-50/50 border border-purple-200 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-purple-200/80 pb-2">
                    <span className="font-extrabold text-[12px] text-purple-900 uppercase tracking-wider">Evening Refreshment</span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5">05:00 PM - 05:45 PM</span>
                  </div>
                  <p className="text-[13px] text-gray-800 mt-3 font-medium leading-relaxed">
                    {todayMenu.snacks}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-gray-400 mt-4 pt-2 border-t border-purple-200/60 block">
                  Post-Sports Refreshment
                </span>
              </div>

              {/* Dinner */}
              <div className="bg-blue-50/50 border border-blue-200 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-blue-200/80 pb-2">
                    <span className="font-extrabold text-[12px] text-blue-900 uppercase tracking-wider">Dinner</span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5">08:30 PM - 09:15 PM</span>
                  </div>
                  <p className="text-[13px] text-gray-800 mt-3 font-medium leading-relaxed">
                    {todayMenu.dinner}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-gray-400 mt-4 pt-2 border-t border-blue-200/60 block">
                  Includes Warm Haldi Milk
                </span>
              </div>

            </div>

            {/* Diet Preference Note */}
            <div className="bg-gray-50 border border-gray-200 p-3.5 flex items-center justify-between text-[12px]">
              <span className="text-gray-700 font-medium">
                Student Registered Meal Type: <strong className="text-gray-900">Vegetarian + Eggs (Opted)</strong>
              </span>
              <span className="text-gray-500 font-mono text-[11px]">
                Special Dietary Requests: Contact Mess Manager (+91 98765 43230)
              </span>
            </div>
          </div>
        )}

        {/* TAB 3: GATE PASS & OUTPASS HISTORY */}
        {activeTab === 'gatePasses' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-[15px] text-gray-900">
                  Hostel Outpass & Gate Pass History
                </h3>
                <p className="text-[12px] text-gray-500">Official digital permissions for leaves, local guardian visits & weekends</p>
              </div>

              <button
                onClick={() => setGatePassModalOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-[12px] flex items-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Apply New Outpass</span>
              </button>
            </div>

            {gatePasses.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-[13px]">
                No gate passes recorded yet.
              </div>
            ) : (
              <div className="space-y-3">
                {gatePasses.map((pass) => (
                  <div
                    key={pass.passId}
                    className="p-4 bg-white border border-gray-200 hover:border-gray-300 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold font-mono text-[11px] flex-shrink-0">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-extrabold text-[14px] text-gray-900">{pass.passId}</span>
                          <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 border border-purple-100">
                            {pass.passType}
                          </span>
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 border ${
                            pass.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-gray-100 text-gray-700 border-gray-300'
                          }`}>
                            {pass.status}
                          </span>
                        </div>
                        <p className="text-[12.5px] text-gray-700 mt-1">
                          Destination: <strong>{pass.destination}</strong>
                        </p>
                        <p className="text-[11.5px] text-gray-500 mt-0.5 flex items-center gap-3 flex-wrap font-mono">
                          <span>Out: <strong>{pass.departure}</strong></span>
                          <span>Return: <strong>{pass.expectedReturn}</strong></span>
                          <span>Guardian: <strong>{pass.guardianName}</strong></span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <button
                        onClick={() => setActivePrintPass(pass)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11.5px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Pass Slip</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DAILY ROUTINE & HOSTEL RULES */}
        {activeTab === 'routine' && (
          <div className="p-5 space-y-5">
            <div className="border-b pb-3">
              <h3 className="font-bold text-[15px] text-gray-900">
                Hostel Daily Schedule & Disciplinary Guidelines
              </h3>
              <p className="text-[12px] text-gray-500">Structured routine for academic excellence, character building and physical wellness</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Daily Schedule Timeline */}
              <div className="space-y-3">
                <h4 className="font-bold text-[13px] text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-600" />
                  Standard Daily Timetable
                </h4>

                <div className="border border-gray-200 divide-y divide-gray-100 text-[12px]">
                  {dailyRoutine.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between hover:bg-gray-50/70 transition-colors">
                      <span className="font-mono font-bold text-indigo-700 w-36 flex-shrink-0">{item.time}</span>
                      <span className="text-gray-800 font-medium flex-1">{item.event}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disciplinary Rules */}
              <div className="space-y-3">
                <h4 className="font-bold text-[13px] text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-red-600" />
                  Key Hostel Rules & Safety Norms
                </h4>

                <div className="space-y-2.5 text-[12px] text-gray-700">
                  <div className="p-3 bg-red-50/60 border border-red-200 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-red-950 block">Night Gate Lock & Curfew: 09:30 PM</strong>
                      <span className="text-red-800 text-[11px]">No student is allowed outside hostel premises past 09:30 PM without pre-authorized emergency warden approval.</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/60 border border-blue-200 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-blue-950 block">Parent Visiting Hours</strong>
                      <span className="text-blue-800 text-[11px]">Saturdays: 03:00 PM - 06:00 PM | Sundays: 10:00 AM - 05:00 PM in the Central Visitor Lounge.</span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/60 border border-amber-200 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-amber-950 block">Mandatory Evening Study Pods (Silence Hours)</strong>
                      <span className="text-amber-800 text-[11px]">06:30 PM to 08:30 PM is dedicated quiet time for school homework, revisions, and supervised study.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CAMPUS HOSTELS DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="p-5 space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-bold text-[15px] text-gray-900">
                School Campus Residential Complexes
              </h3>
              <p className="text-[12px] text-gray-500">Dedicated boarding facilities across All Core Solutions campus</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allHostels.map((h) => (
                <div
                  key={h.id || h.name}
                  className={`border p-4 shadow-sm flex flex-col justify-between ${
                    h.name.includes('Tagore') ? 'bg-amber-50/40 border-amber-300' : 'bg-white border-gray-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[14.5px] text-gray-900">{h.name}</h4>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold border">
                        {h.type} Hostel
                      </span>
                    </div>
                    <p className="text-[12px] text-gray-600 mt-2">
                      Resident Warden: <strong>{h.warden}</strong> ({h.contact})
                    </p>
                    <p className="text-[11.5px] text-gray-500 mt-1">
                      Total Capacity: <strong>{h.capacity} Students</strong>
                    </p>
                  </div>

                  {h.name.includes('Tagore') && (
                    <div className="mt-3 pt-2 border-t border-amber-200 text-[11px] font-bold text-amber-800">
                      ★ Active Allocated Residence for Aarav Sharma
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
          APPLY GATE PASS MODAL
          ========================================================================= */}
      {gatePassModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white max-w-[500px] w-full p-6 shadow-2xl border-t-4 border-amber-500 relative">
            <h3 className="text-[18px] font-bold text-gray-900 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-amber-600" />
              Apply for Hostel Gate Pass / Outpass
            </h3>
            <p className="text-[12px] text-gray-500 mt-1">
              Required for student exit from Tagore Boys Hostel. Digitally authorized by Hostel Warden.
            </p>

            {passSuccess ? (
              <div className="my-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-[13px] font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{passSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitGatePass} className="mt-4 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Pass Category *</label>
                  <select
                    value={gatePassForm.passType}
                    onChange={(e) => setGatePassForm({ ...gatePassForm, passType: e.target.value })}
                    className="w-full border border-gray-300 p-2 text-[13px] outline-none focus:border-amber-500"
                  >
                    <option>Weekend Home Visit</option>
                    <option>Local Guardian Outing</option>
                    <option>Medical Outing / Doctor Visit</option>
                    <option>Academic Event / Competition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Destination Address *</label>
                  <input
                    type="text"
                    value={gatePassForm.destination}
                    onChange={(e) => setGatePassForm({ ...gatePassForm, destination: e.target.value })}
                    className="w-full border border-gray-300 p-2 text-[13px] outline-none focus:border-amber-500"
                    placeholder="e.g. Dwarka Sector 12, New Delhi"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Departure Date & Time *</label>
                    <input
                      type="text"
                      value={gatePassForm.departureDate}
                      onChange={(e) => setGatePassForm({ ...gatePassForm, departureDate: e.target.value })}
                      className="w-full border border-gray-300 p-2 text-[13px] outline-none focus:border-amber-500 font-mono"
                      placeholder="e.g. 24 Oct 2026, 03:00 PM"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Expected Return *</label>
                    <input
                      type="text"
                      value={gatePassForm.returnDate}
                      onChange={(e) => setGatePassForm({ ...gatePassForm, returnDate: e.target.value })}
                      className="w-full border border-gray-300 p-2 text-[13px] outline-none focus:border-amber-500 font-mono"
                      placeholder="e.g. 25 Oct 2026, 06:00 PM"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Accompanying Person</label>
                    <input
                      type="text"
                      value={gatePassForm.guardianName}
                      onChange={(e) => setGatePassForm({ ...gatePassForm, guardianName: e.target.value })}
                      className="w-full border border-gray-300 p-2 text-[13px] outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Guardian Phone *</label>
                    <input
                      type="text"
                      value={gatePassForm.guardianPhone}
                      onChange={(e) => setGatePassForm({ ...gatePassForm, guardianPhone: e.target.value })}
                      className="w-full border border-gray-300 p-2 text-[13px] outline-none focus:border-amber-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Reason / Notes</label>
                  <textarea
                    rows={2}
                    value={gatePassForm.reason}
                    onChange={(e) => setGatePassForm({ ...gatePassForm, reason: e.target.value })}
                    className="w-full border border-gray-300 p-2 text-[13px] outline-none focus:border-amber-500"
                    placeholder="Festival celebration with family..."
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setGatePassModalOpen(false)}
                    className="px-4 py-2 border text-[12px] font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingPass}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-gray-950 text-[12px] font-bold shadow"
                  >
                    {submittingPass ? 'Generating...' : 'Generate Gate Pass'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MAINTENANCE / GRIEVANCE MODAL
          ========================================================================= */}
      {maintenanceModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white max-w-[480px] w-full p-6 shadow-2xl border-t-4 border-amber-500 relative">
            <h3 className="text-[18px] font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              Room Maintenance & Grievance Request
            </h3>
            <p className="text-[12px] text-gray-500 mt-1">
              Directly notifies the Campus Facility Engineer for Room 101 maintenance.
            </p>

            {maintenanceSuccess ? (
              <div className="my-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-[13px] font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{maintenanceSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitMaintenance} className="mt-4 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Issue Category *</label>
                  <select
                    value={maintenanceForm.category}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, category: e.target.value })}
                    className="w-full border border-gray-300 p-2 text-[13px] outline-none focus:border-amber-500"
                  >
                    <option>Electrical / AC Maintenance</option>
                    <option>Plumbing / Geyser / Washroom</option>
                    <option>Carpentry / Bed / Wardrobe Lock</option>
                    <option>Wi-Fi Connectivity / Network</option>
                    <option>Housekeeping / Room Cleaning</option>
                    <option>Mess Food Quality Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Room Number</label>
                  <input
                    type="text"
                    value={maintenanceForm.roomNumber}
                    disabled
                    className="w-full border border-gray-200 bg-gray-50 p-2 text-[13px] font-mono text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Issue Description *</label>
                  <textarea
                    rows={3}
                    value={maintenanceForm.description}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })}
                    className="w-full border border-gray-300 p-2 text-[13px] outline-none focus:border-amber-500"
                    placeholder="Describe the issue in detail..."
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setMaintenanceModalOpen(false)}
                    className="px-4 py-2 border text-[12px] font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingMaintenance}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-[12px] shadow"
                  >
                    {submittingMaintenance ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          PRINTABLE GATE PASS SLIP MODAL
          ========================================================================= */}
      {activePrintPass && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white max-w-[480px] w-full p-6 shadow-2xl border-t-4 border-emerald-600 relative">
            <button
              onClick={() => setActivePrintPass(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official Pass Header */}
            <div className="text-center border-b pb-3">
              <span className="text-[10px] uppercase tracking-widest font-black text-indigo-700">ALL CORE SOLUTIONS</span>
              <h3 className="text-[16px] font-extrabold text-gray-900 mt-0.5">OFFICIAL HOSTEL EXIT OUTPASS</h3>
              <p className="text-[11px] text-gray-500">Security Checkpost Authorization Slip</p>
            </div>

            {/* Pass QR & Reference */}
            <div className="my-4 bg-gray-50 p-4 border border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-mono block">Pass Reference</span>
                <span className="font-mono font-extrabold text-[18px] text-indigo-900">{activePrintPass.passId}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 border border-emerald-300 mt-1 inline-block uppercase">
                  Verified by Warden
                </span>
              </div>
              <div className="w-16 h-16 bg-white border border-gray-300 flex items-center justify-center font-mono font-bold text-indigo-900 text-[18px]">
                <QrCode className="w-10 h-10 text-gray-800" />
              </div>
            </div>

            {/* Pass Fields */}
            <div className="space-y-2 text-[12px] border-b pb-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Student Name:</span>
                <strong className="text-gray-900">{student?.name || 'Aarav Sharma'} ({student?.className || 'Class I-A'})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Hostel & Room:</span>
                <strong className="text-gray-900">{hostel?.name || 'Tagore Hostel'}, Room {room?.roomNumber || '101'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Pass Type:</span>
                <strong className="text-indigo-700">{activePrintPass.passType}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Destination:</span>
                <strong className="text-gray-900">{activePrintPass.destination}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Departure Time:</span>
                <strong className="text-gray-900">{activePrintPass.departure}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Expected Return:</span>
                <strong className="text-gray-900">{activePrintPass.expectedReturn}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Guardian / Contact:</span>
                <strong className="text-gray-900">{activePrintPass.guardianName} ({activePrintPass.guardianPhone})</strong>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[10.5px] text-gray-400">
              <span>Security Stamp: Verified OK</span>
              <span>Valid for One Time Exit</span>
            </div>

            <div className="mt-4 pt-3 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[12px] flex items-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Pass</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

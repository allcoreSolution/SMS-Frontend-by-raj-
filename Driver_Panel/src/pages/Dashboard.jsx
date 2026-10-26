import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import { 
  Bus, 
  Target, 
  Calendar, 
  WalletCards, 
  CalendarCheck, 
  FileText, 
  IdCard, 
  Fingerprint, 
  Contact, 
  Megaphone, 
  Play, 
  Square, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Download, 
  Send, 
  ChevronRight, 
  Phone, 
  ShieldCheck,
  ShieldAlert,
  Wrench,
  User,
  Clock,
  Sparkles,
  ClipboardCheck,
  Activity,
  Gauge
} from 'lucide-react';
import { driverService } from '../api/driverService';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Swal from 'sweetalert2';

export default function Dashboard() {
  const { driver, vehicle: authVehicle, activeTrip: authActiveTrip, setActiveTrip } = useAuth();
  const { isConnected, lastBoardingUpdate, lastTripStatus } = useSocket();
  const outletCtx = useOutletContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals state
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  // Leave Form state
  const [leaveType, setLeaveType] = useState('Casual');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [submittingLeave, setSubmittingLeave] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await driverService.getDashboard();
      if (res.success && res.data) {
        setData(res.data);
        if (res.data.activeTrip) {
          setActiveTrip(res.data.activeTrip);
        } else {
          setActiveTrip(null);
        }
      }
    } catch (err) {
      console.error('Failed to load driver dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [lastTripStatus, lastBoardingUpdate]);

  const handleStartTrip = async () => {
    const defaultBus = data?.vehicle?.vehicleNumber || driver?.assignedBus || 'UP 32 AB 1234';
    const defaultRoute = data?.route?.routeName || 'Route 12';

    const { value: formValues } = await Swal.fire({
      title: 'Start Scheduled Trip?',
      html: `
        <div class="text-left text-xs space-y-2 p-2">
          <p class="font-bold text-gray-700">Vehicle: <span class="text-orange-600">${defaultBus}</span></p>
          <p class="font-bold text-gray-700">Route: <span class="text-slate-900">${defaultRoute}</span></p>
          <label class="block font-bold text-gray-600 mt-2">Enter Starting Odometer (km):</label>
          <input id="swal-odometer" type="number" class="w-full border p-2 text-sm rounded-lg" value="45280" />
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Start Trip & Broadcast GPS',
      confirmButtonColor: '#ea580c',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return document.getElementById('swal-odometer').value;
      }
    });

    if (formValues) {
      setActionLoading(true);
      try {
        const res = await driverService.startTrip({
          vehicleNumber: defaultBus,
          routeName: defaultRoute,
          startOdometer: formValues
        });
        if (res.success) {
          if (res.data) setActiveTrip(res.data);
          Swal.fire({
            icon: 'success',
            title: 'Trip Started!',
            text: 'GPS broadcasting & Student Boarding are now active.',
            timer: 2000,
            showConfirmButton: false
          });
          fetchDashboardData();
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Failed to start trip' });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleEndTrip = async (tripId) => {
    const { value: endOdo } = await Swal.fire({
      title: 'Complete & End Trip?',
      input: 'number',
      inputLabel: 'Closing Odometer Reading (km)',
      inputValue: 45312,
      showCancelButton: true,
      confirmButtonText: 'Confirm Completion',
      confirmButtonColor: '#10b981',
      cancelButtonText: 'Cancel'
    });

    if (endOdo) {
      setActionLoading(true);
      try {
        const res = await driverService.endTrip({ tripId, endOdometer: endOdo });
        if (res.success) {
          setActiveTrip(null);
          Swal.fire({
            icon: 'success',
            title: 'Trip Completed!',
            text: 'Trip log recorded in central database.',
            timer: 2000,
            showConfirmButton: false
          });
          fetchDashboardData();
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Failed to end trip' });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!leaveStartDate || !leaveEndDate) {
      Swal.fire({ icon: 'warning', title: 'Missing Dates', text: 'Please select both start and end dates.' });
      return;
    }
    setSubmittingLeave(true);
    try {
      const res = await driverService.applyLeave({
        leaveType,
        startDate: leaveStartDate,
        endDate: leaveEndDate,
        reason: leaveReason || 'Personal obligation'
      });
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Leave Request Submitted',
          text: 'Sent to transport supervisor for approval.',
          timer: 2000,
          showConfirmButton: false
        });
        setLeaveModalOpen(false);
        setLeaveStartDate('');
        setLeaveEndDate('');
        setLeaveReason('');
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Submission Failed', text: err.response?.data?.message || err.message });
    } finally {
      setSubmittingLeave(false);
    }
  };

  const v = data?.vehicle || authVehicle;
  const active = data?.activeTrip || authActiveTrip;
  const stats = data?.studentStats || { total: 24, boarded: 18, dropped: 0, absent: 2, pending: 4 };

  const driverName = driver?.name || data?.driver?.name || 'Ramesh Kumar';
  const driverPhoto = driver?.photo || driver?.avatar || data?.driver?.photo || data?.driver?.avatar || localStorage.getItem('driver_custom_photo') || '';
  const busNumber = v?.vehicleNumber || driver?.assignedBus || 'UP 32 AB 1234';
  const formattedBusNo = busNumber.startsWith('Bus') ? busNumber : `Bus ${busNumber}`;
  const routeName = active?.routeName || data?.route?.routeName || 'Route 12';

  const [selectedNoticeCategory, setSelectedNoticeCategory] = useState('All');

  const NOTICE_CATEGORIES = [
    'All',
    'Safety & Route',
    'Vehicle Maintenance',
    'Holiday',
    'Transport Advisory'
  ];

  const notices = [
    {
      id: 'notice-1',
      title: 'Transport Notice: Speed Limit & Safety Alert',
      category: 'Safety & Route',
      priority: 'high',
      badge: 'SPEED & SAFETY',
      date: '09 Aug 2026',
      summary: 'Maintain max speed limit of 40 km/h in school zones & strictly adhere to traffic safety protocols.',
      details: 'All school fleet drivers are strictly instructed to maintain speed governor limits of 40 km/h in residential and school campus zones. Any deviation logged by the GPS telemetry will be flagged for review. Ensure students remain seated while the vehicle is in motion.',
      issuer: 'School Safety & Transportation Wing'
    },
    {
      id: 'notice-2',
      title: `Vehicle Servicing: ${formattedBusNo}`,
      category: 'Vehicle Maintenance',
      priority: 'high',
      badge: 'DEPOT SERVICE',
      date: '07 Aug 2026',
      summary: `Scheduled brake and oil servicing due this weekend at central depot for ${formattedBusNo}.`,
      details: `Vehicle ${formattedBusNo} has reached its scheduled periodic maintenance interval (10,000 km check). Please report to Central Workshop Bay 3 on Saturday morning post student drop-off for brake caliper adjustment and oil replacement.`,
      issuer: 'Fleet Mechanical Division'
    },
    {
      id: 'notice-3',
      title: 'Holiday Bulletin: Independence Day Celebration Schedule',
      category: 'Holiday',
      priority: 'normal',
      badge: 'SCHOOL HOLIDAY',
      date: '06 Aug 2026',
      summary: 'School will observe national holiday on 15th August. Special morning bus pickup at 07:00 AM for parade.',
      details: 'On the occasion of Independence Day (15th August), regular academic classes remain suspended. A dedicated morning batch pickup will run for students and staff attending the flag hoisting ceremony. All drivers will receive festive breakfast allowance.',
      issuer: 'Principal & Admin Secretariat'
    },
    {
      id: 'notice-4',
      title: 'Route 12 Diversion Advisory: Underpass Construction',
      category: 'Safety & Route',
      priority: 'high',
      badge: 'ROUTE DIVERSION',
      date: '05 Aug 2026',
      summary: 'Due to civic drain construction at Sector 4 underpass, follow service lane bypass via Ring Road.',
      details: 'Sector 4 underpass is closed for storm water drain construction from 06:00 AM to 02:00 PM. All Route 12 morning buses must use the Ring Road service lane. Estimated delay is 5-7 minutes. Parents on stops 3 and 4 have been notified via app.',
      issuer: 'Traffic Control & Dispatch Dept.'
    },
    {
      id: 'notice-5',
      title: 'Transport Advisory: Monthly Diesel Slip Reimbursement',
      category: 'Transport Advisory',
      priority: 'normal',
      badge: 'FUEL & EXPENSES',
      date: '04 Aug 2026',
      summary: 'Submit monthly diesel fuel receipts, toll receipts, and trip log sheets before the 28th.',
      details: 'Drivers are required to submit original IOCL/HPCL fuel slips along with odometer logs to Mr. Sharma at the Transport Office by 28th of this month for timely reimbursement with the monthly salary credit.',
      issuer: 'Accounts & Transport Office'
    },
    {
      id: 'notice-6',
      title: 'Raksha Bandhan Holiday Notice: Depot Timings',
      category: 'Holiday',
      priority: 'normal',
      badge: 'FESTIVAL CLOSURE',
      date: '03 Aug 2026',
      summary: 'Campus operations and bus transport services will remain closed on Raksha Bandhan.',
      details: 'All school transport operations will remain closed on the occasion of Raksha Bandhan. Buses should remain parked in their designated bays with battery isolator switches turned off.',
      issuer: 'Central Administrative Office'
    },
    {
      id: 'notice-7',
      title: 'Air Conditioning & Defogger Pre-Monsoon Check',
      category: 'Vehicle Maintenance',
      priority: 'normal',
      badge: 'PRE-MONSOON',
      date: '02 Aug 2026',
      summary: 'All fleet air-conditioning filters and windshield wiper blades must be inspected at the depot.',
      details: 'Monsoon fleet readiness audit is underway. All drivers must get wiper blades, headlight leveling, and front defoggers checked at Bay 1 before Friday 5:00 PM.',
      issuer: 'Fleet Maintenance Bay'
    },
    {
      id: 'notice-8',
      title: 'Transport Advisory: Annual Driver Medical & Eye Checkup Camp',
      category: 'Transport Advisory',
      priority: 'normal',
      badge: 'HEALTH CAMP',
      date: '01 Aug 2026',
      summary: 'Compulsory health screening and eye vision assessment for all transport staff on Thursday.',
      details: 'In compliance with State Transport Department guidelines, a mandatory eye and general health checkup camp will be held at the Campus Health Center on Thursday from 10:00 AM to 01:00 PM.',
      issuer: 'Health & Transport Welfare Committee'
    }
  ];

  const getNoticeCategoryMeta = (cat) => {
    switch (cat) {
      case 'Safety & Route':
        return {
          icon: ShieldAlert,
          badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          pillBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
        };
      case 'Vehicle Maintenance':
        return {
          icon: Wrench,
          badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300 dark:border-blue-800',
          pillBg: 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
        };
      case 'Holiday':
        return {
          icon: Calendar,
          badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300 dark:border-purple-800',
          pillBg: 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
        };
      case 'Transport Advisory':
        return {
          icon: Megaphone,
          badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
          pillBg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
        };
      default:
        return {
          icon: Megaphone,
          badgeClass: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
          pillBg: 'bg-orange-100 dark:bg-orange-950/60 text-[#ea580c]'
        };
    }
  };

  const filteredNotices = selectedNoticeCategory === 'All'
    ? notices
    : notices.filter(n => n.category === selectedNoticeCategory);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading Driver Portal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 sm:space-y-4 animate-fade-in pb-3 w-full">
      
      {/* ===================== 1. WELCOME GREETING HEADER ===================== */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0 flex items-center gap-3">
          
          {/* Avatar with Orange Ring */}
          <div 
            onClick={() => setBadgeModalOpen(true)}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#ea580c] p-0.5 bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 cursor-pointer shadow-sm hover:scale-105 active:scale-95 transition-transform overflow-hidden"
            title="View Driver ID Badge"
          >
            {driverPhoto ? (
              <img 
                src={driverPhoto} 
                alt={driverName} 
                className="w-full h-full rounded-full object-cover" 
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[#ffedd5] dark:bg-orange-950/60 flex items-center justify-center text-[#ea580c] font-black text-base sm:text-lg">
                {driverName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-slate-400 dark:text-slate-400 text-xs font-medium tracking-tight">
                Welcome Back, 🚌
              </p>
              <span className="px-2 py-0.2 rounded-full text-[9.5px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                Shift Active
              </span>
            </div>
            <h2 className="font-serif font-black text-lg sm:text-xl text-slate-900 dark:text-white leading-tight mt-0.5 truncate">
              {driverName}
            </h2>
            <p className="text-[#ea580c] font-semibold text-xs mt-0.5 truncate">
              Senior Bus Driver • {formattedBusNo}
            </p>
          </div>
        </div>

        {/* Quick Operations on Desktop */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
          <Link
            to="/boarding"
            className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/50 hover:bg-orange-100 text-[#ea580c] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-orange-200/50"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Boarding ({stats.boarded}/{stats.total})</span>
          </Link>

          {active ? (
            <button
              onClick={() => handleEndTrip(active.tripId)}
              disabled={actionLoading}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <Square className="w-3.5 h-3.5" />
              <span>End Active Trip</span>
            </button>
          ) : (
            <button
              onClick={handleStartTrip}
              disabled={actionLoading}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#ea580c] hover:bg-[#d9480f] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Start Trip</span>
            </button>
          )}
        </div>
      </section>

      {/* ===================== 2. HERO GPS LOCATION BANNER CARD ===================== */}
      <section className="bg-gradient-to-r from-[#d9480f] via-[#e8590c] to-[#f97316] rounded-2xl p-3.5 sm:p-4 text-white shadow-md shadow-orange-500/20 relative overflow-hidden transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          
          <div className="flex items-center gap-3 min-w-0">
            {/* Circular Radar Target GPS Icon */}
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/25 flex items-center justify-center shrink-0 relative">
              <Target className="w-5 h-5 text-white stroke-[2.2]" />
              <span className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-60 pointer-events-none" />
            </div>

            {/* Center Text */}
            <div className="min-w-0 flex-1">
              <p className="text-white/85 text-[11px] font-medium tracking-wide">
                GPS Location Tracking Status
              </p>
              <h3 className="font-bold text-sm sm:text-base leading-snug mt-0.5 text-white truncate">
                {active ? `GPS Active • Broadcasting ${active.routeName}` : `GPS Active • Broadcasting ${routeName}`}
              </h3>
              <p className="text-white/80 text-[10.5px] mt-0.5">
                Speed: {v?.speed || 0} km/h • Fuel: {v?.fuelLevel || 85}% • Vehicle: {formattedBusNo}
              </p>
            </div>
          </div>

          {/* Right: Crisp White Pill Button */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => navigate('/tracking')}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-orange-50 text-[#d9480f] font-bold text-xs shadow-sm active:scale-95 transition-all font-sans shrink-0 whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <span>Open Tracker</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* ===================== 3. STAT CARDS (RESPONSIVE: 2 COLS ON MOBILE, 4 COLS ON LAPTOP) ===================== */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
        
        {/* Card 1: Driver Leaves */}
        <div 
          onClick={() => setLeaveModalOpen(true)}
          className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-3.5 shadow-sm hover:shadow-md hover:border-amber-200 dark:hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-7.5 h-7.5 rounded-lg bg-[#fef3c7] dark:bg-amber-950/60 text-[#d97706] flex items-center justify-center">
              <Calendar className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="bg-[#fef9c3] dark:bg-amber-950/80 text-[#b45309] dark:text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full">
              12 Days
            </span>
          </div>
          <div className="mt-2">
            <p className="text-slate-400 dark:text-slate-500 text-[11px] font-medium">
              Driver Leaves
            </p>
            <p className="font-serif font-black text-slate-900 dark:text-white text-xs sm:text-sm mt-0.5 truncate">
              6 Casual • 6 Medical
            </p>
          </div>
        </div>

        {/* Card 2: Driver Pay */}
        <div 
          onClick={() => setPayslipModalOpen(true)}
          className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-3.5 shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-7.5 h-7.5 rounded-lg bg-[#dcfce7] dark:bg-emerald-950/60 text-[#16a34a] flex items-center justify-center">
              <WalletCards className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="bg-[#dcfce7] dark:bg-emerald-950/80 text-[#15803d] dark:text-emerald-300 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5">
              Paid ✓
            </span>
          </div>
          <div className="mt-2">
            <p className="text-slate-400 dark:text-slate-500 text-[11px] font-medium">
              Driver Pay (July 2026)
            </p>
            <p className="font-serif font-black text-slate-900 dark:text-white text-xs sm:text-sm mt-0.5 truncate">
              ₹ 28,500 • Credited
            </p>
          </div>
        </div>

        {/* Card 3: Assigned Bus Fleet */}
        <Link 
          to="/vehicle"
          className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-3.5 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-7.5 h-7.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Bus className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold text-[10px] px-2 py-0.5 rounded-full">
              42 Seats
            </span>
          </div>
          <div className="mt-2">
            <p className="text-slate-400 dark:text-slate-500 text-[11px] font-medium">
              Fleet Vehicle
            </p>
            <p className="font-serif font-black text-slate-900 dark:text-white text-xs sm:text-sm mt-0.5 truncate font-mono">
              {formattedBusNo}
            </p>
          </div>
        </Link>

        {/* Card 4: Pre-Trip Inspection */}
        <Link 
          to="/inspection"
          className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-3.5 shadow-sm hover:shadow-md hover:border-purple-200 dark:hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-7.5 h-7.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] px-2 py-0.5 rounded-full">
              Ready
            </span>
          </div>
          <div className="mt-2">
            <p className="text-slate-400 dark:text-slate-500 text-[11px] font-medium">
              Inspection Status
            </p>
            <p className="font-serif font-black text-slate-900 dark:text-white text-xs sm:text-sm mt-0.5 truncate text-emerald-600">
              Passed Today ✓
            </p>
          </div>
        </Link>

      </section>

      {/* ===================== 4. DRIVER QUICK ACCESS (3 COLS ON MOBILE, 6 COLS ON LAPTOP) ===================== */}
      <section className="space-y-2">
        
        {/* Section Header */}
        <div className="flex items-center justify-between px-1">
          <h3 className="font-serif font-black text-base sm:text-lg text-slate-900 dark:text-white">
            Driver Quick Access
          </h3>
          <button
            onClick={() => navigate('/profile')}
            className="text-[#ea580c] font-bold text-xs hover:underline cursor-pointer"
          >
            Driver Profile
          </button>
        </div>

        {/* 6 Grid Items */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
          
          {/* 1. Live Track */}
          <div
            onClick={() => navigate('/tracking')}
            className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 sm:p-3 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-orange-200 dark:hover:border-slate-700 transition-all cursor-pointer aspect-square sm:aspect-auto active:scale-95"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#ffedd5] dark:bg-orange-950/60 text-[#ea580c] flex items-center justify-center mb-1.5 shadow-sm">
              <Target className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <span className="font-serif font-bold text-[11px] sm:text-xs text-slate-900 dark:text-white">
              Live Track
            </span>
          </div>

          {/* 2. Contacts */}
          <div
            onClick={() => navigate('/contacts')}
            className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 sm:p-3 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-sky-200 dark:hover:border-slate-700 transition-all cursor-pointer aspect-square sm:aspect-auto active:scale-95"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center mb-1.5 shadow-sm">
              <Contact className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <span className="font-serif font-bold text-[11px] sm:text-xs text-slate-900 dark:text-white">
              Contacts
            </span>
          </div>

          {/* 3. Self Attendance */}
          <div
            onClick={() => navigate('/attendance')}
            className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 sm:p-3 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-slate-700 transition-all cursor-pointer aspect-square sm:aspect-auto active:scale-95"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-1.5 shadow-sm">
              <Fingerprint className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <span className="font-serif font-bold text-[11px] sm:text-xs text-slate-900 dark:text-white">
              Attendance
            </span>
          </div>

          {/* 4. Leave Req. */}
          <div
            onClick={() => setLeaveModalOpen(true)}
            className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 sm:p-3 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-amber-200 dark:hover:border-slate-700 transition-all cursor-pointer aspect-square sm:aspect-auto active:scale-95"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-1.5 shadow-sm">
              <CalendarCheck className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <span className="font-serif font-bold text-[11px] sm:text-xs text-slate-900 dark:text-white">
              Leave Req.
            </span>
          </div>

          {/* 5. Payslips */}
          <div
            onClick={() => setPayslipModalOpen(true)}
            className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 sm:p-3 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-slate-700 transition-all cursor-pointer aspect-square sm:aspect-auto active:scale-95"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-1.5 shadow-sm">
              <FileText className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <span className="font-serif font-bold text-[11px] sm:text-xs text-slate-900 dark:text-white">
              Payslips
            </span>
          </div>

          {/* 6. Driver Badge */}
          <div
            onClick={() => setBadgeModalOpen(true)}
            className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 sm:p-3 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:border-pink-200 dark:hover:border-slate-700 transition-all cursor-pointer aspect-square sm:aspect-auto active:scale-95"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-600 flex items-center justify-center mb-1.5 shadow-sm">
              <IdCard className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <span className="font-serif font-bold text-[11px] sm:text-xs text-slate-900 dark:text-white">
              Driver Badge
            </span>
          </div>

        </div>

      </section>

      {/* ===================== 5. SPLIT SECTION ON LAPTOP: NOTICES (2 COLS) + DIRECTORY (1 COL) ===================== */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-3.5">
        
        {/* Left 2 Cols on Laptop: Transport Notices */}
        <div className="lg:col-span-2 space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-serif font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-1.5">
              <Megaphone className="w-4 h-4 text-orange-600" />
              <span>Transport Notices</span>
            </h3>
            <button
              onClick={() => navigate('/notifications')}
              className="text-[#ea580c] font-bold text-xs hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>&gt; View All</span>
            </button>
          </div>

          {/* 5 Category Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
            {NOTICE_CATEGORIES.map((cat) => {
              const isSelected = selectedNoticeCategory === cat;
              const count = cat === 'All' ? notices.length : notices.filter(n => n.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedNoticeCategory(cat)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-serif font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#ea580c] text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-sans font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Notices Cards List */}
          <div className="space-y-2">
            {filteredNotices.length === 0 ? (
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-center text-xs text-slate-400">
                No notices under category "{selectedNoticeCategory}".
              </div>
            ) : (
              filteredNotices.map((n) => {
                const meta = getNoticeCategoryMeta(n.category);
                const IconComp = meta.icon;

                return (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNotice(n)}
                    className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-3.5 shadow-sm hover:shadow-md hover:border-orange-200 dark:hover:border-slate-700 transition-all cursor-pointer flex items-start gap-2.5 sm:gap-3"
                  >
                    <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${meta.pillBg}`}>
                      <IconComp className="w-4 h-4 stroke-[2.2]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.2 rounded-full border ${meta.badgeClass}`}>
                          {n.category}
                        </span>
                        {n.priority === 'high' && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300">
                            Urgent
                          </span>
                        )}
                        <span className="text-slate-400 text-[10.5px] shrink-0 font-medium whitespace-nowrap ml-auto">
                          {n.date}
                        </span>
                      </div>

                      <h4 className="font-serif font-black text-xs sm:text-[13px] text-slate-900 dark:text-white leading-tight">
                        {n.title}
                      </h4>
                      <p className="text-slate-400 dark:text-slate-500 text-[11px] mt-0.5 line-clamp-1 sm:line-clamp-2">
                        {n.summary}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 Col on Laptop: Direct Dispatch & Helpdesk Card */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-serif font-black text-base sm:text-lg text-slate-900 dark:text-white">
              Campus Transport Desk
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-sm space-y-2">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Central Control Desk</div>
                <div className="text-[10.5px] text-slate-500 font-mono">+91 98112 23399</div>
              </div>
              <a
                href="tel:+919811223399"
                className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 shadow-sm"
              >
                <Phone className="w-3 h-3" />
              </a>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Fleet Maintenance Bay</div>
                <div className="text-[10.5px] text-slate-500 font-mono">+91 98223 44556</div>
              </div>
              <a
                href="tel:+919822344556"
                className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 shadow-sm"
              >
                <Phone className="w-3 h-3" />
              </a>
            </div>

            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/50 flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-rose-700 dark:text-rose-300">Emergency Dispatch</div>
                <div className="text-[10.5px] text-rose-600 font-mono">Dial 112 (Police/Ambulance)</div>
              </div>
              <a
                href="tel:112"
                className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 shadow-sm"
              >
                <Phone className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

      </section>

      {/* ===================== PAYSLIP MODAL ===================== */}
      {payslipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
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
                  <span className="text-slate-500">Employee / Driver:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Driver ID:</span>
                  <span className="font-mono font-bold">{driver?.driverId || 'DRV-101'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Designation:</span>
                  <span className="font-semibold text-orange-600">Senior Bus Driver</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Bus:</span>
                  <span className="font-mono font-bold">{formattedBusNo}</span>
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
                  <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">Disbursement Status: Paid ✓</div>
                  <div className="text-[10px] text-emerald-600">Credited on 31 Jul 2026 • Direct Bank NEFT</div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
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
                className="flex-1 py-2.5 rounded-2xl bg-[#ea580c] hover:bg-[#d9480f] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== DRIVER BADGE MODAL ===================== */}
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
                    <img 
                      src={driverPhoto} 
                      alt={driverName} 
                      className="w-full h-full object-cover rounded-xl" 
                    />
                  ) : (
                    <User className="w-10 h-10 text-orange-300" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif font-black text-base leading-tight truncate">
                    {driverName}
                  </h4>
                  <p className="text-xs text-orange-400 font-semibold">
                    Senior School Bus Driver
                  </p>
                  <p className="text-[11px] font-mono text-slate-300 mt-0.5">
                    ID: {driver?.driverId || 'DRV-101'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Bus Assigned:</span>
                  <span className="font-mono font-bold text-white">{formattedBusNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Blood Group:</span>
                  <span className="font-bold text-white">{driver?.bloodGroup || 'B+'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Licence No:</span>
                  <span className="font-mono text-white">{driver?.licence || 'UP-32-2015009871'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Emergency Phone:</span>
                  <span className="font-mono text-white">{driver?.mobile || '+91 98112 23399'}</span>
                </div>
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

      {/* ===================== LEAVE REQUEST MODAL ===================== */}
      {leaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-base text-slate-900 dark:text-white">
                    Apply For Driver Leave
                  </h3>
                  <p className="text-[11px] text-slate-500">Balance: 6 Casual • 6 Medical Days</p>
                </div>
              </div>
              <button 
                onClick={() => setLeaveModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Leave Type:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLeaveType('Casual')}
                    className={`py-2 rounded-xl font-bold border transition-all ${leaveType === 'Casual' ? 'border-[#ea580c] bg-orange-50 text-[#ea580c]' : 'border-slate-200 text-slate-600'}`}
                  >
                    Casual Leave (6 left)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeaveType('Medical')}
                    className={`py-2 rounded-xl font-bold border transition-all ${leaveType === 'Medical' ? 'border-[#ea580c] bg-orange-50 text-[#ea580c]' : 'border-slate-200 text-slate-600'}`}
                  >
                    Medical Leave (6 left)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Start Date:</label>
                  <input
                    type="date"
                    required
                    value={leaveStartDate}
                    onChange={(e) => setLeaveStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">End Date:</label>
                  <input
                    type="date"
                    required
                    value={leaveEndDate}
                    onChange={(e) => setLeaveEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Reason for Leave:</label>
                <textarea
                  rows={2}
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Specify brief reason..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLeaveModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingLeave}
                  className="flex-1 py-2.5 rounded-2xl bg-[#ea580c] hover:bg-[#d9480f] text-white font-black flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingLeave ? 'Submitting...' : 'Submit Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== NOTICE DETAILS MODAL ===================== */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${getNoticeCategoryMeta(selectedNotice.category).pillBg}`}>
                  {React.createElement(getNoticeCategoryMeta(selectedNotice.category).icon, { className: 'w-5 h-5 stroke-[2.2]' })}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${getNoticeCategoryMeta(selectedNotice.category).badgeClass}`}>
                      {selectedNotice.category || 'General'}
                    </span>
                    {selectedNotice.priority === 'high' && (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-rose-600 text-white">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{selectedNotice.date}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedNotice(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-serif font-black text-sm text-slate-900 dark:text-white leading-snug">
                {selectedNotice.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                {selectedNotice.details}
              </p>
              {selectedNotice.issuer && (
                <div className="text-[10.5px] text-slate-400">
                  <span className="font-medium">Issued by: </span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{selectedNotice.issuer}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedNotice(null)}
              className="mt-4 w-full py-2.5 rounded-2xl bg-[#ea580c] hover:bg-[#d9480f] text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
            >
              Acknowledge Bulletin
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

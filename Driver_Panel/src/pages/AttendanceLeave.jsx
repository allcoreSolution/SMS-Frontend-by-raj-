import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  MapPin, 
  ScanFace, 
  Timer, 
  CalendarDays, 
  AlertTriangle, 
  ShieldCheck, 
  History, 
  ArrowRight,
  Smile,
  Sparkles,
  Calendar,
  ChevronDown,
  CheckCircle2,
  X,
  FileText,
  Fingerprint,
  Radio,
  Send
} from 'lucide-react';
import { driverService } from '../api/driverService';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

export default function AttendanceLeave() {
  const navigate = useNavigate();
  const { driver, vehicle } = useAuth();
  const driverPhoto = driver?.photo || driver?.avatar || localStorage.getItem('driver_custom_photo') || '';

  const [activeTab, setActiveTab] = useState('biometric'); // 'biometric' | 'history'
  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [loading, setLoading] = useState(true);

  // Live Attendance Data
  const [todayRecord, setTodayRecord] = useState(null);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [summaryData, setSummaryData] = useState({
    shiftDuration: '10h 40m',
    workingDays: 24,
    totalWorkingDays: 26,
    lateArrivals: 1,
    onTimeRate: 98.4,
    attendanceRate: '98.4% Attendance Rate'
  });
  const [depotData, setDepotData] = useState({
    name: 'Greenwood Bus Depot Zone A',
    lat: 26.9124,
    lng: 75.7873,
    geofenceStatus: 'Geo-fence OK'
  });

  // Biometric Scanning Simulation Modal State
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(1); // 1: initializing, 2: scanning face/finger, 3: verified

  // Leave Modal State
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState('Casual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [applyingLeave, setApplyingLeave] = useState(false);

  // Fetch Attendance Records
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await driverService.getAttendance();
      if (res.success) {
        if (res.todayAttendance) setTodayRecord(res.todayAttendance);
        if (res.summary) setSummaryData(res.summary);
        if (res.depot) setDepotData(res.depot);
        if (res.data) setAttendanceLogs(res.data);
      }
    } catch (err) {
      console.error('Error loading attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // Format Time Display (e.g. 06:42 AM)
  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    try {
      const d = new Date(timeString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return '--:--';
    }
  };

  // Format Date (e.g. 09 Aug 2026)
  const formatDateDisplay = (dateString) => {
    if (!dateString) return 'Today';
    try {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parts[2];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${day} ${monthNames[monthIndex] || 'Aug'} ${year}`;
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  // Status Badge CSS classes
  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'Present':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
      case 'Leave':
      case 'On-Leave':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300';
      case 'Late':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const isClockedIn = Boolean(todayRecord && todayRecord.clockInTime);
  const isClockedOut = Boolean(todayRecord && todayRecord.clockOutTime);

  const checkInDisplay = todayRecord?.clockInTime ? formatTime(todayRecord.clockInTime) : '--:--';
  const checkOutDisplay = todayRecord?.clockOutTime ? formatTime(todayRecord.clockOutTime) : '--:--';

  // Trigger Biometric Scan Modal Flow
  const handleInitiateScan = () => {
    setScanModalOpen(true);
    setScanStep(1);
    setScanning(true);

    setTimeout(() => {
      setScanStep(2); // Scanning face & geo-fence
    }, 1000);

    setTimeout(() => {
      setScanStep(3); // Verified
    }, 2200);

    setTimeout(async () => {
      await executePunchAttendance();
    }, 2900);
  };

  // Perform backend attendance punch
  const executePunchAttendance = async () => {
    try {
      const type = (!isClockedIn || isClockedOut) ? 'ClockIn' : 'ClockOut';
      const res = await driverService.markAttendance({
        type,
        device: 'GPS-BUS-12',
        method: 'Biometric Face & Fingerprint',
        depotName: depotData.name,
        location: { lat: depotData.lat, lng: depotData.lng, address: depotData.name }
      });

      setScanning(false);
      setScanModalOpen(false);

      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: res.action === 'ClockOut' ? 'Shift Clock-Out Marked!' : 'Biometric Clock-In Successful!',
          text: res.message || 'Attendance logged with geo-fence verification.',
          timer: 2200,
          showConfirmButton: false
        });
        await fetchAttendance();
      }
    } catch (err) {
      setScanning(false);
      setScanModalOpen(false);
      Swal.fire({
        icon: 'error',
        title: 'Biometric Scan Failed',
        text: err.response?.data?.message || err.message || 'Depot punch could not be recorded.'
      });
    }
  };

  // Handle Leave Application
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setApplyingLeave(true);
    try {
      const res = await driverService.applyLeave({
        leaveType,
        startDate,
        endDate,
        reason
      });
      setApplyingLeave(false);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Leave Application Submitted',
          text: 'Request forwarded to Transport Supervisor.',
          timer: 2000,
          showConfirmButton: false
        });
        setLeaveModalOpen(false);
        setReason('');
        setStartDate('');
        setEndDate('');
        fetchAttendance();
      }
    } catch (err) {
      setApplyingLeave(false);
      Swal.fire({
        icon: 'error',
        title: 'Application Error',
        text: err.response?.data?.message || err.message
      });
    }
  };

  // Filter logs by month if needed
  const filteredLogs = attendanceLogs.filter(item => {
    if (selectedMonth === 'August 2026') {
      return item.date && (item.date.includes('2026-08') || item.date.includes('2026-10'));
    }
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in pb-6 w-full max-w-4xl mx-auto">
      
      {/* ===================== 1. TOP HEADER ===================== */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1 -ml-1 text-slate-800 dark:text-white hover:text-[#ea580c] transition-colors cursor-pointer"
            title="Back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
          <h1 className="font-serif font-black text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
            Driver Biometric Attendance
          </h1>
        </div>

        {/* Quick Leave Button */}
        <button
          onClick={() => setLeaveModalOpen(true)}
          className="text-xs font-bold text-[#ea580c] hover:text-[#d9480f] flex items-center gap-1 cursor-pointer bg-orange-50 dark:bg-orange-950/40 px-3 py-1.5 rounded-xl border border-orange-200/60 dark:border-orange-900/40"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Apply Leave</span>
        </button>
      </div>

      {/* ===================== 2. TABS NAV ===================== */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-sm font-serif pt-1">
        <button
          onClick={() => setActiveTab('biometric')}
          className={`pb-2.5 font-bold transition-all relative cursor-pointer mr-8 ${
            activeTab === 'biometric'
              ? 'text-[#ea580c]'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold'
          }`}
        >
          <span>Biometric Attendance</span>
          {activeTab === 'biometric' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ea580c] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2.5 font-bold transition-all relative cursor-pointer ${
            activeTab === 'history'
              ? 'text-[#ea580c]'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold'
          }`}
        >
          <span>Shift History Log</span>
          {activeTab === 'history' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ea580c] rounded-full" />
          )}
        </button>
      </div>

      {/* ===================== 3. TAB 1: BIOMETRIC ATTENDANCE ===================== */}
      {activeTab === 'biometric' && (
        <div className="space-y-4 sm:space-y-5 animate-fade-in">
          
          {/* Card 1: Greenwood Depot Geo-fence */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3.5 transition-colors">
            <div className="w-12 h-12 rounded-full bg-[#ffedd5] dark:bg-orange-950/60 text-[#ea580c] flex items-center justify-center shrink-0 shadow-inner">
              <MapPin className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-serif font-black text-sm sm:text-base text-slate-900 dark:text-white truncate">
                {depotData.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono mt-0.5">
                GPS Lat: {depotData.lat}° N, Long: {depotData.lng}° E
              </p>
              <span className="text-[11px] font-bold text-[#d9480f] dark:text-orange-400 block mt-0.5">
                ({depotData.geofenceStatus})
              </span>
            </div>
          </div>

          {/* Card 2: Hero Vibrant Orange Biometric Card */}
          <div className="bg-gradient-to-b from-[#ff6b00] via-[#ea580c] to-[#d9480f] rounded-[32px] p-5 sm:p-7 text-white shadow-xl shadow-orange-500/25 relative overflow-hidden text-center transition-all">
            
            {/* Ambient Background Circles */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-black/10 blur-2xl pointer-events-none" />

            {/* Top Timestamps Row */}
            <div className="grid grid-cols-2 relative mb-2">
              <div className="pr-3 text-center">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-white/85 uppercase block">
                  CHECK IN TIMESTAMP
                </span>
                <span className="font-serif font-black text-2xl sm:text-3xl text-white tracking-tight block mt-1">
                  {checkInDisplay}
                </span>
              </div>

              {/* Thin Vertical Divider */}
              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/25 self-center h-10 -ml-[0.5px]" />

              <div className="pl-3 text-center">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-white/85 uppercase block">
                  CHECK OUT TIMESTAMP
                </span>
                <span className="font-serif font-black text-2xl sm:text-3xl text-white tracking-tight block mt-1">
                  {checkOutDisplay}
                </span>
              </div>
            </div>

            {/* Center Biometric Circle Target */}
            <div
              onClick={handleInitiateScan}
              className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border-4 border-white/95 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 my-5 mx-auto bg-white/10 backdrop-blur-xs shadow-inner relative group select-none"
              title="Touch to Scan Biometrics"
            >
              {/* Pulsing ring indicator */}
              <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping opacity-30 pointer-events-none" />

              {/* Photo Avatar or Smiling Face with Sparkle */}
              <div className="relative flex items-center justify-center text-white">
                <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center relative bg-white/10 overflow-hidden shadow-inner">
                  {driverPhoto ? (
                    <img 
                      src={driverPhoto} 
                      alt={driver?.name || 'Driver'} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <Smile className="w-11 h-11 stroke-[2]" />
                  )}
                  <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-amber-200 animate-bounce" />
                </div>
              </div>

              <span className="font-serif font-black text-[11px] sm:text-xs tracking-widest uppercase text-white mt-2 drop-shadow-sm">
                TOUCH TO SCAN
              </span>
            </div>

            {/* Bottom Wide White Button */}
            <button
              onClick={handleInitiateScan}
              disabled={scanning}
              className="w-full py-3.5 px-5 rounded-2xl bg-white text-[#d9480f] font-serif font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-black/10 hover:bg-orange-50 active:scale-98 transition-all cursor-pointer"
            >
              <ScanFace className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] shrink-0" />
              <span>
                {isClockedOut 
                  ? 'SCAN FACE / FINGERPRINT (RE-CLOCK)' 
                  : isClockedIn 
                    ? 'SCAN FACE / FINGERPRINT (CHECK OUT)' 
                    : 'SCAN FACE / FINGERPRINT (CHECK IN)'}
              </span>
            </button>

          </div>

          {/* 4 Metric Cards (2x2 Grid) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            
            {/* 1. Shift Duration */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3.5 transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
                <Timer className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <h4 className="font-serif font-black text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                  {summaryData.shiftDuration || '10h 40m'}
                </h4>
                <span className="text-xs text-slate-400 font-medium">Shift Duration</span>
              </div>
            </div>

            {/* 2. Working Days */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3.5 transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                <CalendarDays className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <h4 className="font-serif font-black text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                  {summaryData.workingDays || 24} / {summaryData.totalWorkingDays || 26}d
                </h4>
                <span className="text-xs text-slate-400 font-medium">Working Days</span>
              </div>
            </div>

            {/* 3. Late Arrivals */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3.5 transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <h4 className="font-serif font-black text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                  {summaryData.lateArrivals || 1} Late
                </h4>
                <span className="text-xs text-slate-400 font-medium">Late Arrivals</span>
              </div>
            </div>

            {/* 4. On-Time Rate */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3.5 transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <h4 className="font-serif font-black text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                  {summaryData.onTimeRate || 98.4}%
                </h4>
                <span className="text-xs text-slate-400 font-medium">On-Time Rate</span>
              </div>
            </div>

          </div>

          {/* Bottom Action Link */}
          <div className="text-center pt-2 pb-1">
            <button
              onClick={() => setActiveTab('history')}
              className="text-[#ea580c] hover:text-[#d9480f] dark:text-orange-400 font-serif font-black text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer group"
            >
              <History className="w-4 h-4" />
              <span>View Full Attendance Logs</span>
              <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      )}

      {/* ===================== 4. TAB 2: SHIFT HISTORY LOG ===================== */}
      {activeTab === 'history' && (
        <div className="space-y-3.5 animate-fade-in">
          
          {/* Top Filter and Rate Bar */}
          <div className="flex items-center justify-between gap-2">
            
            {/* Month Dropdown Button */}
            <div className="relative">
              <button
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-3.5 py-2 text-xs font-serif font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 shadow-xs cursor-pointer hover:border-orange-300"
              >
                <Calendar className="w-4 h-4 text-[#ea580c]" />
                <span>{selectedMonth}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Attendance Rate Badge */}
            <div className="bg-[#ffedd5] dark:bg-orange-950/60 border border-orange-200/60 dark:border-orange-800/40 text-[#ea580c] dark:text-orange-400 font-serif font-bold text-xs px-3.5 py-2 rounded-2xl shadow-xs">
              {summaryData.attendanceRate || '98.4% Attendance Rate'}
            </div>

          </div>

          {/* List of Shift Cards */}
          <div className="space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center text-xs text-slate-400">
                No shift history records found for this period.
              </div>
            ) : (
              filteredLogs.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-1.5"
                >
                  {/* Row 1: Date & Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-black text-sm sm:text-base text-slate-900 dark:text-white">
                      {formatDateDisplay(item.date)}
                    </span>
                    <span className={`text-[11px] font-serif font-bold px-3 py-0.5 rounded-full ${getStatusBadgeClasses(item.status)}`}>
                      {item.status || 'Present'}
                    </span>
                  </div>

                  {/* Row 2: In/Out Times and Hours */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span>
                      In: {formatTime(item.clockInTime)} • Out: {item.clockOutTime ? formatTime(item.clockOutTime) : (item.status === 'On-Leave' ? '--:--' : 'Active Duty')}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Hours: {item.clockOutTime 
                        ? (item.workingHours ? `${Math.floor(item.workingHours)}h ${Math.round((item.workingHours % 1) * 60)}m` : '10h 40m') 
                        : (item.status === 'On-Leave' ? '0h 00m' : 'On Duty')}
                    </span>
                  </div>

                  {/* Row 3: Device Info */}
                  <div className="text-[11px] font-bold text-[#ea580c] dark:text-orange-400">
                    Device: {item.device || 'GPS-BUS-12'}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* ===================== BIOMETRIC SCANNER MODAL SIMULATOR ===================== */}
      {scanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center font-bold">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-black text-sm text-slate-900 dark:text-white uppercase">
                  Biometric Verification
                </h3>
              </div>
              <button
                onClick={() => {
                  setScanModalOpen(false);
                  setScanning(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scanning Radar Frame */}
            <div className="relative w-40 h-40 mx-auto my-3 rounded-full border-4 border-orange-500/80 flex items-center justify-center bg-orange-500/10 overflow-hidden shadow-inner">
              
              {/* Radar Laser Line */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse top-1/2 -translate-y-1/2 shadow-lg" />
              
              {scanStep === 3 ? (
                <div className="text-emerald-500 flex flex-col items-center animate-bounce">
                  {driverPhoto ? (
                    <div className="w-20 h-20 rounded-full border-2 border-emerald-500 p-0.5 mb-1 overflow-hidden shadow-md">
                      <img 
                        src={driverPhoto} 
                        alt={driver?.name || 'Driver'} 
                        className="w-full h-full object-cover rounded-full" 
                      />
                    </div>
                  ) : (
                    <CheckCircle2 className="w-16 h-16 stroke-[2]" />
                  )}
                  <span className="text-[11px] font-black uppercase mt-1">Verified ✓</span>
                </div>
              ) : (
                <div className="relative text-orange-600 dark:text-orange-400 flex flex-col items-center">
                  {driverPhoto ? (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-orange-500 p-0.5 shadow-md">
                      <img 
                        src={driverPhoto} 
                        alt={driver?.name || 'Driver'} 
                        className="w-full h-full object-cover rounded-full" 
                      />
                      <span className="absolute inset-0 bg-orange-500/15 animate-pulse pointer-events-none rounded-full" />
                    </div>
                  ) : (
                    <Smile className="w-16 h-16 stroke-[1.8] animate-pulse" />
                  )}
                  <Sparkles className="w-4 h-4 absolute top-0 right-0 text-amber-300 animate-spin" />
                </div>
              )}
            </div>

            {/* Live Status Message */}
            <div className="space-y-1.5 my-3">
              <h4 className="font-serif font-black text-sm text-slate-900 dark:text-white">
                {scanStep === 1 && 'Initializing Sensor & GPS Geo-fence...'}
                {scanStep === 2 && 'Scanning Driver Face & Biometrics...'}
                {scanStep === 3 && 'Biometric Authentication Matched!'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {driver?.name || 'Ramesh Kumar'} • Bus {vehicle?.vehicleNumber || 'UP 32 AB 1234'}
              </p>
              <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Zone A Geo-fence OK (Depot Lat: 26.9124° N)</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setScanModalOpen(false);
                  setScanning(false);
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel Scan
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ===================== APPLY LEAVE MODAL ===================== */}
      {leaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-black text-sm uppercase text-slate-900 dark:text-white">
                  Apply Driver Leave
                </h3>
              </div>
              <button
                onClick={() => setLeaveModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Leave Type:
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
                >
                  <option value="Casual">Casual Leave</option>
                  <option value="Sick">Sick / Medical Leave</option>
                  <option value="Emergency">Family Emergency</option>
                  <option value="Annual">Annual Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date:
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    End Date:
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Leave:
                </label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="State the reason for taking leave..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLeaveModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applyingLeave}
                  className="flex-1 py-2.5 rounded-2xl bg-[#ea580c] hover:bg-[#d9480f] text-white font-black flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/25"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{applyingLeave ? 'Submitting...' : 'Submit Leave'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  QrCode, 
  Search, 
  MapPin, 
  Clock, 
  Camera, 
  ArrowDownCircle, 
  AlertCircle,
  Filter,
  Check
} from 'lucide-react';
import { driverService } from '../api/driverService';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Swal from 'sweetalert2';

export default function Boarding() {
  const { driver, vehicle, activeTrip, setActiveTrip, refreshProfile } = useAuth();
  const { lastBoardingUpdate } = useSocket();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrManualInput, setQrManualInput] = useState('');
  const [scanning, setScanning] = useState(false);

  // Sync activeTrip on mount if not already populated
  useEffect(() => {
    let mounted = true;
    const syncTrip = async () => {
      try {
        const dash = await driverService.getDashboard();
        if (mounted && dash.success && dash.data?.activeTrip) {
          setActiveTrip(dash.data.activeTrip);
        }
      } catch (e) {
        console.warn('Dashboard sync note in Boarding:', e.message);
      }
    };
    if (!activeTrip) {
      syncTrip();
    }
    return () => { mounted = false; };
  }, []);

  const fetchRoster = async () => {
    try {
      setLoading(true);
      // If there is an active trip with tripId, fetch trip boarding status
      if (activeTrip?.tripId) {
        const res = await driverService.getTripBoarding(activeTrip.tripId);
        if (res.success && res.data && res.data.length > 0) {
          setStudents(res.data);
          return;
        }
      }
      // Otherwise fetch driver route students roster (which also merges live trip/register statuses)
      const res = await driverService.getStudentsRoster();
      if (res.success && res.data) {
        setStudents(res.data.map(s => ({
          ...s,
          status: s.status || 'Pending'
        })));
      }
    } catch (err) {
      console.error('Error fetching boarding roster:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoster();
  }, [activeTrip?.tripId]);

  // Handle real-time Socket.IO boarding update without state wiping
  useEffect(() => {
    if (lastBoardingUpdate && lastBoardingUpdate.studentName) {
      setStudents(prev => prev.map(s => {
        if (s.studentName.toLowerCase() === lastBoardingUpdate.studentName.toLowerCase()) {
          return {
            ...s,
            status: lastBoardingUpdate.status,
            timestamp: lastBoardingUpdate.timestamp || new Date()
          };
        }
        return s;
      }));
    }
  }, [lastBoardingUpdate]);

  const handleUpdateStatus = async (studentName, targetStatus, stopName) => {
    // Optimistic UI update
    const previous = [...students];
    setStudents(prev => prev.map(s => {
      if (s.studentName.toLowerCase() === studentName.toLowerCase()) {
        return { ...s, status: targetStatus, timestamp: new Date() };
      }
      return s;
    }));

    try {
      const res = await driverService.recordBoarding({
        tripId: activeTrip?.tripId,
        studentName,
        stopName: stopName || 'Bus Stop',
        status: targetStatus,
        vehicleNumber: vehicle?.vehicleNumber || driver?.assignedBus
      });

      if (res.success) {
        if (res.data?.tripId && (!activeTrip || !activeTrip.tripId)) {
          setActiveTrip({ tripId: res.data.tripId, status: 'Active' });
        }
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500
        });
        Toast.fire({
          icon: 'success',
          title: `${studentName}: marked ${targetStatus}`
        });
      }
    } catch (err) {
      setStudents(previous);
      Swal.fire({
        icon: 'error',
        title: 'Boarding Error',
        text: err.response?.data?.message || 'Could not record boarding'
      });
    }
  };

  const handleSimulateQRScan = async () => {
    if (!qrManualInput.trim()) return;
    setScanning(true);
    try {
      const currentTripId = activeTrip?.tripId || 'active';
      const res = await driverService.scanQR(currentTripId, qrManualInput.trim());
      if (res.success) {
        if (res.tripId && (!activeTrip || !activeTrip.tripId)) {
          setActiveTrip({ tripId: res.tripId, status: 'Active' });
        }
        setStudents(prev => {
          const exists = prev.some(s => s.studentName.toLowerCase() === res.data.studentName.toLowerCase());
          if (exists) {
            return prev.map(s => s.studentName.toLowerCase() === res.data.studentName.toLowerCase() 
              ? { ...s, status: res.data.status, timestamp: new Date() } 
              : s
            );
          }
          return [...prev, { ...res.data, timestamp: new Date() }];
        });

        Swal.fire({
          icon: 'success',
          title: 'QR Scan Verified!',
          text: `${res.data.studentName} marked as ${res.data.status}`,
          timer: 2000,
          showConfirmButton: false
        });
        setQrManualInput('');
        setQrModalOpen(false);
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Scan Failed',
        text: err.response?.data?.message || 'Invalid QR code or student not on this route'
      });
    } finally {
      setScanning(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesFilter = filter === 'All' || s.status?.toLowerCase() === filter.toLowerCase();
    const matchesSearch = !search || 
      s.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      s.stopName?.toLowerCase().includes(search.toLowerCase()) ||
      (s.admissionNo && s.admissionNo.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const counts = {
    total: students.length,
    boarded: students.filter(s => s.status === 'Boarded').length,
    dropped: students.filter(s => s.status === 'Dropped').length,
    absent: students.filter(s => s.status === 'Absent').length,
    pending: students.filter(s => !s.status || s.status === 'Pending').length
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-orange-600" />
              <span>Student Boarding & Attendance</span>
            </h1>
            {activeTrip ? (
              <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Trip Active ({activeTrip.tripId || 'Live'})</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                Ready (Auto-activates on boarding)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tap student card to record pickup/drop-off or use the camera QR scanner
          </p>
        </div>

        <button
          onClick={() => setQrModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>Launch QR Scanner</span>
        </button>
      </div>

      {/* 4 Summary Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => setFilter('Boarded')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            filter === 'Boarded' 
              ? 'bg-emerald-500 text-white border-emerald-600 shadow-md' 
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span>Boarded (Pickup)</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black">{counts.boarded}</div>
        </div>

        <div 
          onClick={() => setFilter('Dropped')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            filter === 'Dropped' 
              ? 'bg-blue-600 text-white border-blue-700 shadow-md' 
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span>Dropped (Delivered)</span>
            <ArrowDownCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black">{counts.dropped}</div>
        </div>

        <div 
          onClick={() => setFilter('Pending')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            filter === 'Pending' 
              ? 'bg-amber-500 text-white border-amber-600 shadow-md' 
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-500'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span>Waiting / Pending</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black">{counts.pending}</div>
        </div>

        <div 
          onClick={() => setFilter('Absent')}
          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
            filter === 'Absent' 
              ? 'bg-rose-600 text-white border-rose-700 shadow-md' 
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-500'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span>Reported Absent</span>
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black">{counts.absent}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student or stop name..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs font-bold">
          <button
            onClick={() => setFilter('All')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'All' ? 'bg-orange-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All ({counts.total})
          </button>
        </div>
      </div>

      {/* Roster Cards List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-500">
          No students found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredStudents.map((stud, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm space-y-3 transition-all ${
                stud.status === 'Boarded'
                  ? 'border-emerald-300 dark:border-emerald-800/80'
                  : stud.status === 'Dropped'
                  ? 'border-blue-300 dark:border-blue-800/80'
                  : stud.status === 'Absent'
                  ? 'border-rose-300 dark:border-rose-800/80 opacity-75'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center ${
                    stud.status === 'Boarded' ? 'bg-emerald-100 text-emerald-800' :
                    stud.status === 'Dropped' ? 'bg-blue-100 text-blue-800' :
                    stud.status === 'Absent' ? 'bg-rose-100 text-rose-800' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {stud.studentName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900 dark:text-white">
                      {stud.studentName}
                    </h3>
                    <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5">
                      <span>{stud.className || 'Class 5-A'}</span>
                      {stud.admissionNo && <span>• {stud.admissionNo}</span>}
                    </div>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  stud.status === 'Boarded' ? 'bg-emerald-100 text-emerald-800' :
                  stud.status === 'Dropped' ? 'bg-blue-100 text-blue-800' :
                  stud.status === 'Absent' ? 'bg-rose-100 text-rose-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {stud.status || 'Pending'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  <span className="font-semibold">{stud.stopName}</span>
                </div>
                {stud.timestamp && (
                  <span className="font-mono text-[10.5px]">
                    {new Date(stud.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>

              {/* 3 Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                <button
                  onClick={() => handleUpdateStatus(stud.studentName, 'Boarded', stud.stopName)}
                  className={`py-1.5 rounded-xl font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                    stud.status === 'Boarded'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Boarded</span>
                </button>

                <button
                  onClick={() => handleUpdateStatus(stud.studentName, 'Dropped', stud.stopName)}
                  className={`py-1.5 rounded-xl font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                    stud.status === 'Dropped'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
                  }`}
                >
                  <ArrowDownCircle className="w-3.5 h-3.5" />
                  <span>Dropped</span>
                </button>

                <button
                  onClick={() => handleUpdateStatus(stud.studentName, 'Absent', stud.stopName)}
                  className={`py-1.5 rounded-xl font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                    stud.status === 'Absent'
                      ? 'bg-rose-600 text-white'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Absent</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Scanner / Manual Verification Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-sm uppercase flex items-center gap-2">
                <Camera className="w-4 h-4 text-orange-600" />
                <span>Student QR Boarding Scanner</span>
              </h3>
              <button onClick={() => setQrModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            {/* Simulated Camera Viewfinder Frame */}
            <div className="relative bg-slate-900 rounded-xl h-52 flex flex-col items-center justify-center overflow-hidden border-2 border-dashed border-orange-500">
              <div className="w-36 h-36 border-2 border-orange-500 rounded-xl relative flex items-center justify-center">
                <span className="w-full h-0.5 bg-orange-500 absolute top-1/2 -translate-y-1/2 animate-bounce" />
                <QrCode className="w-16 h-16 text-white/30" />
              </div>
              <p className="text-[11px] text-white/70 font-semibold mt-2">
                Align Student ID Card QR inside viewfinder
              </p>
            </div>

            {/* Quick Demo Student QR Chips */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">
                Tap Sample Student QR Payload:
              </label>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {['Aarav Sharma', 'Ananya Verma', 'Vivaan Patel', 'Diya Kapoor'].map(name => (
                  <button
                    key={name}
                    onClick={() => setQrManualInput(name)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-orange-100 text-slate-700 dark:text-slate-300 font-semibold text-[11px]"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual QR string / Code input fallback */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Student Name or Admission Barcode:
              </label>
              <input
                type="text"
                value={qrManualInput}
                onChange={(e) => setQrManualInput(e.target.value)}
                placeholder="e.g. Aarav Sharma or ADM-2024-001"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setQrModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulateQRScan}
                disabled={scanning || !qrManualInput}
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider shadow-md disabled:opacity-50"
              >
                {scanning ? 'Verifying...' : 'Verify & Record Scan'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

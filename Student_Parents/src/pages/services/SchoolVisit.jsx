import React, { useState, useEffect } from 'react';
import {
  CalendarClock,
  CalendarX,
  MessageCircle,
  Calendar,
  X,
  Clock,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Plus,
  Building,
  QrCode,
  Printer,
  MapPin,
  ShieldCheck,
  ArrowRight,
  FileText,
  Check,
  AlertTriangle,
  Info,
  ChevronRight
} from 'lucide-react';
import parentService from '../../api/parentService';

export default function SchoolVisit({ activeChild }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [visitData, setVisitData] = useState(null);

  // Tabs: 'appointments' | 'walk-ins' | 'protocols'
  const [activeTab, setActiveTab] = useState('appointments');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  // Modals
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [gatePassModalOpen, setGatePassModalOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);
  const [verifyingPass, setVerifyingPass] = useState(false);
  const [passVerificationResult, setPassVerificationResult] = useState(null);

  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedAptToReschedule, setSelectedAptToReschedule] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({
    visitDate: '',
    visitTime: '11:00 AM',
    reason: ''
  });

  // Schedule Appointment Form State
  const [appointmentForm, setAppointmentForm] = useState({
    visitorName: '',
    phone: '',
    purpose: '',
    meetingWith: 'Class Teacher (Anita Roy - Class I-A)',
    visitDate: '',
    visitTime: '11:30 AM',
    numberOfPersons: 1,
    specialNotes: ''
  });
  const [submittingApt, setSubmittingApt] = useState(false);

  // Fetch School Visit data from Backend
  const fetchVisitData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const params = {};
      if (activeChild) params.studentId = activeChild;

      const res = await parentService.getSchoolVisitData(params);
      if (res && res.success && res.data) {
        setVisitData(res.data);
        // Pre-fill visitor name and phone
        if (res.data.student) {
          setAppointmentForm((prev) => ({
            ...prev,
            visitorName: `${res.data.student.fatherName || 'Rajesh Kumar Gupta'} (Father)`,
            phone: res.data.student.phone || '+91 98765 10000'
          }));
        }
      } else {
        setError('Failed to load school visit records');
      }
    } catch (err) {
      console.error('Error fetching school visit records:', err);
      setError(err?.response?.data?.message || err?.message || 'Error connecting to School Visit API');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVisitData();
  }, [activeChild]);

  // Handle Create Appointment
  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    if (!appointmentForm.purpose.trim()) {
      alert('Please specify the purpose of your visit');
      return;
    }
    if (!appointmentForm.visitDate) {
      alert('Please select a visit date');
      return;
    }

    try {
      setSubmittingApt(true);
      const studentId = visitData?.student?.id || activeChild;
      const payload = {
        ...appointmentForm,
        studentId
      };

      const res = await parentService.createVisitAppointment(payload);
      if (res && res.success) {
        setToastMessage({
          type: 'success',
          text: res.message || 'Appointment scheduled successfully!'
        });
        setScheduleModalOpen(false);
        setAppointmentForm((prev) => ({
          ...prev,
          purpose: '',
          visitDate: '',
          specialNotes: ''
        }));
        fetchVisitData(true);
      } else {
        alert(res?.message || 'Failed to schedule appointment');
      }
    } catch (err) {
      console.error('Error scheduling appointment:', err);
      alert(err?.response?.data?.message || 'Error scheduling appointment');
    } finally {
      setSubmittingApt(false);
    }
  };

  // Handle Cancel Appointment
  const handleCancelAppointment = async (aptId, aptCode) => {
    if (!window.confirm(`Are you sure you want to cancel Appointment #${aptCode}?`)) {
      return;
    }

    try {
      const res = await parentService.cancelVisitAppointment(aptId);
      if (res && res.success) {
        setToastMessage({
          type: 'success',
          text: res.message || 'Appointment cancelled successfully.'
        });
        fetchVisitData(true);
      } else {
        alert(res?.message || 'Failed to cancel appointment');
      }
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      alert(err?.response?.data?.message || 'Error cancelling appointment');
    }
  };

  // Handle Reschedule Submit
  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleForm.visitDate) {
      alert('Please select a new date');
      return;
    }

    try {
      const res = await parentService.rescheduleVisitAppointment(
        selectedAptToReschedule._id,
        rescheduleForm
      );
      if (res && res.success) {
        setToastMessage({
          type: 'success',
          text: res.message || 'Appointment rescheduled successfully!'
        });
        setRescheduleModalOpen(false);
        setSelectedAptToReschedule(null);
        fetchVisitData(true);
      } else {
        alert(res?.message || 'Failed to reschedule appointment');
      }
    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      alert(err?.response?.data?.message || 'Error rescheduling appointment');
    }
  };

  const student = visitData?.student || {
    name: 'Aarav Sharma',
    admissionNo: 'YIS-2024-101',
    className: 'Class I (A)',
    fatherName: 'Rajesh Kumar Gupta',
    phone: '+91 98765 10000'
  };

  const walkIns = visitData?.walkIns || [];
  const appointments = visitData?.appointments || [];
  const protocols = visitData?.protocols || {
    visitingHours: 'Mon - Fri: 08:30 AM - 02:30 PM | Sat: 09:00 AM - 12:30 PM',
    principalHours: 'Mon & Thu: 10:30 AM - 12:30 PM (Prior appointment required)',
    securityDesk: 'Main Security Gate 1 & Visitor Counter #01',
    securityPhone: '+91 11 2808 9015 (Ext. 102)',
    rules: [
      'Government-issued Photo ID is mandatory for security verification at Gate 1.',
      'Visitors must wear the Visitor Badge at all times while on campus.',
      'Pre-approved Digital Gate Pass holders enjoy express lane entry.'
    ]
  };

  const meetingStaffOptions = visitData?.meetingStaffOptions || [
    { id: 'ct', label: 'Class Teacher (Anita Roy - Class I-A)' },
    { id: 'pr', label: 'Principal (Dr. Rajeshwar Sen)' },
    { id: 'acc', label: 'Accounts & Fee Secretariat' },
    { id: 'inf', label: 'Campus Medical Infirmary' },
    { id: 'tr', label: 'Transport & Fleet Incharge' }
  ];

  const stats = visitData?.stats || {
    totalVisits: walkIns.length + appointments.length,
    walkInsCount: walkIns.length,
    appointmentsCount: appointments.length,
    upcomingCount: appointments.filter((a) => a.status === 'Confirmed').length,
    completedCount: walkIns.length
  };

  return (
    <div className="p-4 md:p-6 max-w-[1440px] mx-auto min-h-screen bg-[#f8f9fa] space-y-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`p-4 rounded-none flex items-center justify-between border shadow-sm transition-all animate-in fade-in ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
            : 'bg-red-50 border-red-300 text-red-800'
        }`}>
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-gray-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white border border-gray-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 border border-orange-200 flex items-center justify-center text-[#f97316]">
              <CalendarClock className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] font-bold text-[#1f2937] tracking-tight">
                  School Visit & Campus Appointments
                </h1>
                <span className="bg-orange-50 text-orange-700 border border-orange-200 text-[11px] font-extrabold px-2 py-0.5 uppercase tracking-wider">
                  Visitor Gate Desk
                </span>
              </div>
              <p className="text-[12.5px] text-gray-500 font-medium">
                Manage campus walk-ins, schedule appointments with faculty & principal, and download pre-approved digital security gate passes for <span className="font-bold text-gray-800">{student.name}</span> ({student.className})
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => fetchVisitData(true)}
            disabled={refreshing}
            className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Refresh Visits"
          >
            <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={() => setScheduleModalOpen(true)}
            className="px-4 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Appointment</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 bg-orange-50 border border-orange-100 text-[#f97316] flex items-center justify-center flex-shrink-0">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Upcoming Appointments
            </span>
            <span className="text-xl font-black text-gray-900">{stats.upcomingCount}</span>
            <span className="text-[10px] text-orange-600 font-semibold block">Confirmed with faculty</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Recorded Walk-ins
            </span>
            <span className="text-xl font-black text-indigo-900">{stats.walkInsCount}</span>
            <span className="text-[10px] text-gray-500 block">Logged at Security Gate 1</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Completed Visits
            </span>
            <span className="text-xl font-black text-emerald-700">{stats.completedCount}</span>
            <span className="text-[10px] text-emerald-600 font-semibold block">Official records logged</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Security Checkpoint
            </span>
            <span className="text-sm font-black text-blue-900 leading-tight block">Gate 1 & Desk #01</span>
            <span className="text-[10px] text-blue-600 font-semibold block">Aadhaar / Photo ID Mandatory</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 shadow-sm p-1.5 flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-5 py-2.5 text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'appointments'
              ? 'bg-[#353A40] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <CalendarClock className="w-4 h-4 text-orange-400" />
          <span>Scheduled Appointments ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('walk-ins')}
          className={`px-5 py-2.5 text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'walk-ins'
              ? 'bg-[#353A40] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <User className="w-4 h-4 text-indigo-400" />
          <span>Recorded Walk-ins ({walkIns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('protocols')}
          className={`px-5 py-2.5 text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'protocols'
              ? 'bg-[#353A40] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Visiting Protocols & Hours</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 p-16 flex flex-col items-center justify-center text-center space-y-3 shadow-sm min-h-[400px]">
          <div className="w-12 h-12 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
          <h3 className="text-base font-bold text-gray-800">Loading School Visit & Gate Logbook...</h3>
          <p className="text-xs text-gray-500 max-w-sm">
            Fetching visitor records, scheduled appointments, and security passes from MongoDB.
          </p>
        </div>
      ) : error ? (
        <div className="bg-white border border-red-200 p-10 flex flex-col items-center justify-center text-center space-y-3 shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h3 className="text-base font-bold text-gray-800">{error}</h3>
          <button
            onClick={() => fetchVisitData(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* ========================================================= */}
          {/* TAB 1: SCHEDULED APPOINTMENTS                             */}
          {/* ========================================================= */}
          {activeTab === 'appointments' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {appointments.length === 0 ? (
                <div className="bg-white border border-gray-200 p-16 flex flex-col items-center justify-center text-center space-y-3 shadow-sm">
                  <CalendarX className="w-16 h-16 text-gray-300" strokeWidth={1.5} />
                  <h3 className="text-base font-bold text-gray-800">No Scheduled Appointments</h3>
                  <p className="text-xs text-gray-500 max-w-sm">
                    You have no upcoming or past scheduled appointments with school faculty.
                  </p>
                  <button
                    onClick={() => setScheduleModalOpen(true)}
                    className="px-4 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Schedule Visit Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((apt) => {
                    const isUpcoming = apt.status === 'Confirmed' || apt.status === 'Scheduled' || apt.status === 'Rescheduled';
                    const isCancelled = apt.status?.includes('Cancel');
                    return (
                      <div
                        key={apt._id}
                        className={`bg-white border p-3.5 shadow-xs transition-all hover:shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                          isCancelled 
                            ? 'border-gray-200 opacity-70 bg-gray-50/50' 
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        {/* Left: Essential Summary Info */}
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Mini Date Box */}
                          <div className="bg-orange-50/90 border border-orange-200 text-orange-900 px-2 py-1 text-center min-w-[56px] flex-shrink-0">
                            <span className="text-[9px] font-black uppercase block leading-none text-orange-600">
                              {new Date(apt.visitDate).toLocaleDateString('en-GB', { month: 'short' })}
                            </span>
                            <span className="text-base font-black block leading-tight">
                              {new Date(apt.visitDate).getDate()}
                            </span>
                            <span className="text-[9px] text-gray-500 font-bold block leading-none">
                              {apt.visitTime}
                            </span>
                          </div>

                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-mono text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5">
                                #{apt.appointmentId}
                              </span>
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 border ${
                                apt.status === 'Confirmed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : apt.status === 'Rescheduled'
                                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                                  : isCancelled
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}>
                                {apt.status}
                              </span>
                              <span className="text-xs font-bold text-gray-900 truncate">
                                {apt.meetingWith}
                              </span>
                            </div>

                            <div className="text-[11px] text-gray-600 flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                              <span>Visitor: <strong className="text-gray-800">{apt.visitorName}</strong></span>
                              <span>•</span>
                              <span>Student: <strong className="text-gray-800">{apt.studentName} ({apt.className})</strong></span>
                              <span>•</span>
                              <span className="text-gray-500 flex items-center gap-0.5">
                                <MapPin className="w-3 h-3 text-indigo-500 flex-shrink-0" /> {apt.venue}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Quick Pass Button & Actions */}
                        <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                          {apt.qrCodeDataUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPass(apt);
                                setGatePassModalOpen(true);
                              }}
                              className="border border-gray-300 p-1 bg-white hover:border-orange-500 hover:shadow-xs transition-all flex items-center gap-1.5"
                              title="Click to view full Scannable Gate Pass"
                            >
                              <img src={apt.qrCodeDataUrl} alt="Pass QR" className="w-9 h-9 object-contain" />
                              <div className="text-left hidden sm:block pr-1">
                                <span className="text-[9px] font-black text-indigo-700 block leading-tight">#{apt.passNumber || 'PASS'}</span>
                                <span className="text-[8px] text-emerald-700 font-extrabold block">✓ View Pass</span>
                              </div>
                            </button>
                          )}

                          {isUpcoming && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedPass(apt);
                                  setGatePassModalOpen(true);
                                }}
                                className="px-3 py-1.5 bg-[#353A40] hover:bg-black text-white text-xs font-bold flex items-center gap-1 transition-colors"
                              >
                                <QrCode className="w-3.5 h-3.5 text-orange-400" /> Pass
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedAptToReschedule(apt);
                                  setRescheduleForm({
                                    visitDate: '',
                                    visitTime: apt.visitTime || '11:00 AM',
                                    reason: ''
                                  });
                                  setRescheduleModalOpen(true);
                                }}
                                className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
                              >
                                Reschedule
                              </button>

                              <button
                                onClick={() => handleCancelAppointment(apt._id, apt.appointmentId)}
                                className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-colors"
                                title="Cancel"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: RECORDED WALK-IN VISITS                            */}
          {/* ========================================================= */}
          {activeTab === 'walk-ins' && (
            <div className="bg-white border border-gray-200 shadow-sm p-5 space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Security Gate Walk-in Logbook ({walkIns.length})
                  </h3>
                  <p className="text-xs text-gray-500">
                    Official visitor records registered at campus security reception on arrival
                  </p>
                </div>
              </div>

              {walkIns.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 border border-dashed border-gray-300">
                  <CalendarX className="w-12 h-12 text-gray-300" strokeWidth={1.5} />
                  <h4 className="text-sm font-bold text-gray-700">No walk-in visits on record</h4>
                  <p className="text-xs text-gray-500 max-w-xs">
                    Walk-ins are logged in real-time when entering via campus security gate.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#f2f4ff] border-b border-gray-200 text-[#4f46e5] font-extrabold uppercase text-[10px] tracking-wider">
                        <th className="p-3">Badge & Visitor</th>
                        <th className="p-3">Purpose of Visit</th>
                        <th className="p-3">Meeting With</th>
                        <th className="p-3">In-Time / Out-Time</th>
                        <th className="p-3">ID Proof</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-medium">
                      {walkIns.map((item, idx) => (
                        <tr key={item._id || idx} className="hover:bg-gray-50/80 transition-colors">
                          <td className="p-3">
                            <span className="font-mono text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 block w-fit mb-1">
                              #{item.badgeNumber || `VIS-${idx + 101}`}
                            </span>
                            <span className="font-bold text-gray-900 block">{item.name}</span>
                            <span className="text-[11px] text-gray-500">{item.phone}</span>
                          </td>

                          <td className="p-3 max-w-xs">
                            <span className="font-semibold text-gray-800 block">{item.purpose}</span>
                            {item.notes && (
                              <span className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{item.notes}</span>
                            )}
                          </td>

                          <td className="p-3">
                            <span className="font-bold text-gray-800">{item.meetingWith}</span>
                          </td>

                          <td className="p-3 whitespace-nowrap">
                            <div className="space-y-0.5">
                              <span className="text-emerald-700 font-bold block">
                                In: {new Date(item.inTime).toLocaleDateString('en-GB')} {new Date(item.inTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {item.outTime && (
                                <span className="text-gray-500 block">
                                  Out: {new Date(item.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-gray-700 bg-gray-100 px-2 py-0.5">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              {item.idProof}
                            </span>
                          </td>

                          <td className="p-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-extrabold uppercase border ${
                              item.status === 'On Campus'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: VISITING PROTOCOLS & CAMPUS GUIDELINES            */}
          {/* ========================================================= */}
          {activeTab === 'protocols' && (
            <div className="bg-white border border-gray-200 shadow-sm p-6 space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-black text-gray-900 tracking-tight">
                  Campus Visiting Protocols & Security Standards
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  All Core Solutions visiting hours, identification mandates, and administrative conference protocols
                </p>
              </div>

              {/* Guidelines Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="border border-gray-200 p-4 space-y-2 bg-gray-50/50">
                  <h4 className="font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" /> General Visiting Schedule
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Monday – Friday:</strong> 08:30 AM to 02:30 PM<br/>
                    <strong>Saturday:</strong> 09:00 AM to 12:30 PM<br/>
                    <strong>Sunday & Public Holidays:</strong> Closed for visitors
                  </p>
                </div>

                <div className="border border-gray-200 p-4 space-y-2 bg-gray-50/50">
                  <h4 className="font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Building className="w-4 h-4 text-indigo-600" /> Principal Office Consultations
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    Prior appointment is mandatory for meeting the Principal Dr. Rajeshwar Sen.<br/>
                    <strong>Slots:</strong> Monday & Thursday (10:30 AM – 12:30 PM)<br/>
                    Appointments must be requested at least 24 hours in advance.
                  </p>
                </div>
              </div>

              {/* Security Mandates */}
              <div className="bg-amber-50/60 border border-amber-200 border-l-4 border-l-amber-500 p-5 space-y-2">
                <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Security Checkpoint Directives
                </h4>
                <ul className="text-xs text-amber-950 space-y-1.5 list-disc list-inside">
                  {protocols.rules?.map((rule, idx) => (
                    <li key={idx} className="leading-relaxed">{rule}</li>
                  ))}
                </ul>
              </div>

              {/* Department Directory */}
              <div>
                <h4 className="text-xs font-black uppercase text-gray-800 tracking-wider mb-3">
                  Authorized Department Meeting Venues
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  {meetingStaffOptions.map((opt) => (
                    <div key={opt.id} className="border border-gray-200 p-3 bg-white">
                      <span className="font-bold text-gray-900 block">{opt.label}</span>
                      <span className="text-[11px] text-gray-500 block mt-1">{opt.room || 'Main Campus Secretariat'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: SCHEDULE NEW VISIT APPOINTMENT                   */}
      {/* ========================================================= */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-300 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="bg-[#f97316] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5" />
                <h3 className="text-sm font-bold">Schedule School Visit Appointment</h3>
              </div>
              <button 
                onClick={() => setScheduleModalOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="p-5 space-y-4 text-xs">
              <div className="bg-orange-50 border border-orange-200 p-3 text-orange-950">
                <p className="font-bold">Student: {student.name} ({student.className})</p>
                <p className="text-[11px] text-orange-800">
                  Pre-approved Digital Gate Pass will be generated instantly for express entry at Security Gate 1.
                </p>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Purpose of Visit (Required)</label>
                <input
                  type="text"
                  value={appointmentForm.purpose}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, purpose: e.target.value })}
                  className="w-full p-2 border border-gray-300 font-medium focus:outline-none focus:border-[#f97316]"
                  placeholder="e.g. Discuss academic performance & term 2 projects"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Who to Meet?</label>
                <select
                  value={appointmentForm.meetingWith}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, meetingWith: e.target.value })}
                  className="w-full p-2 border border-gray-300 font-bold bg-white focus:outline-none focus:border-[#f97316]"
                >
                  {meetingStaffOptions.map((opt) => (
                    <option key={opt.id} value={opt.label}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Visit Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={appointmentForm.visitDate}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, visitDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 font-semibold focus:outline-none focus:border-[#f97316] bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Preferred Time Slot</label>
                  <select
                    value={appointmentForm.visitTime}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, visitTime: e.target.value })}
                    className="w-full p-2 border border-gray-300 font-semibold bg-white focus:outline-none focus:border-[#f97316]"
                  >
                    <option value="09:30 AM">09:30 AM - Morning Slot</option>
                    <option value="11:00 AM">11:00 AM - Mid-Day Slot</option>
                    <option value="11:30 AM">11:30 AM - Free Period</option>
                    <option value="01:30 PM">01:30 PM - Post Lunch</option>
                    <option value="02:15 PM">02:15 PM - Dispersal Time</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Visitor Full Name</label>
                  <input
                    type="text"
                    value={appointmentForm.visitorName}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, visitorName: e.target.value })}
                    className="w-full p-2 border border-gray-300 font-medium focus:outline-none focus:border-[#f97316]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={appointmentForm.phone}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, phone: e.target.value })}
                    className="w-full p-2 border border-gray-300 font-medium focus:outline-none focus:border-[#f97316]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Special Notes / Questions (Optional)</label>
                <textarea
                  rows={2}
                  value={appointmentForm.specialNotes}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, specialNotes: e.target.value })}
                  className="w-full p-2 border border-gray-300 font-medium focus:outline-none focus:border-[#f97316]"
                  placeholder="Any specific topic you wish to consult about..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApt}
                  className="px-5 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold flex items-center gap-1.5"
                >
                  <CalendarClock className="w-4 h-4" />
                  {submittingApt ? 'Booking Appointment...' : 'Submit & Generate Pass'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: DIGITAL SECURITY GATE PASS (COMPACT ID BADGE)    */}
      {/* ========================================================= */}
      {gatePassModalOpen && selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-300 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#353A40] text-white px-3.5 py-2.5 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-orange-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Visitor Gate Pass</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1"
                >
                  <Printer className="w-3 h-3" /> Print
                </button>
                <button
                  onClick={() => {
                    setGatePassModalOpen(false);
                    setPassVerificationResult(null);
                  }}
                  className="text-gray-300 hover:text-white p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pass Printable Body */}
            <div className="p-4 space-y-3 text-gray-900 bg-white">
              {/* Institution Header */}
              <div className="text-center border-b border-orange-500 pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-700 block">
                  ALL CORE SOLUTIONS
                </span>
                <span className="text-[10px] font-semibold text-gray-500 block">
                  Gate 1 • Visitor Access Pass
                </span>
              </div>

              {/* Compact ID Badge: Left Details, Right QR */}
              <div className="border border-gray-200 bg-gray-50/70 p-3 flex items-center justify-between gap-3">
                <div className="space-y-1.5 text-xs min-w-0">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase block leading-none">Pass Reference</span>
                    <span className="font-mono text-sm font-black text-indigo-700 block">
                      #{selectedPass.passNumber || selectedPass.appointmentId}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase block leading-none">Visitor</span>
                    <span className="font-bold text-gray-900 text-xs truncate block">
                      {selectedPass.visitorName}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase block leading-none">Student</span>
                    <span className="font-medium text-gray-800 text-[11px] truncate block">
                      {selectedPass.studentName} ({selectedPass.className})
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase block leading-none">Meeting Faculty</span>
                    <span className="font-medium text-indigo-800 text-[11px] truncate block">
                      {selectedPass.meetingWith}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase block leading-none">Slot</span>
                    <span className="font-bold text-gray-900 text-[11px] block">
                      {new Date(selectedPass.visitDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, {selectedPass.visitTime}
                    </span>
                  </div>

                  <div>
                    <span className="inline-block px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 mt-0.5">
                      ✓ PRE-APPROVED
                    </span>
                  </div>
                </div>

                {/* Scannable QR Code */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-24 h-24 border border-gray-900 p-1 bg-white flex items-center justify-center shadow-xs">
                    <img
                      src={selectedPass.qrCodeDataUrl || `http://localhost:5050/api/parents/school-visit/gate-pass/${selectedPass.passNumber || selectedPass.appointmentId}/qr`}
                      alt="Pass QR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[8px] font-extrabold text-gray-500 uppercase tracking-widest mt-1 text-center">
                    Scan for full data
                  </span>
                </div>
              </div>

              {/* Compact Footer Strip */}
              <div className="pt-1 flex items-center justify-between text-[10px] text-gray-500 border-t border-gray-100">
                <span>Photo ID Mandatory at Gate 1</span>
                <a
                  href={selectedPass.verifyUrl || `http://localhost:5050/api/parents/school-visit/gate-pass/${selectedPass.passNumber || selectedPass.appointmentId}/verify?format=html`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5 print:hidden"
                >
                  Verify Online ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: RESCHEDULE APPOINTMENT                           */}
      {/* ========================================================= */}
      {rescheduleModalOpen && selectedAptToReschedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-300 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="bg-[#353A40] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-bold">Reschedule Appointment</h3>
              </div>
              <button 
                onClick={() => setRescheduleModalOpen(false)}
                className="text-gray-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <span className="text-gray-500 block mb-1">Appointment Reference:</span>
                <span className="font-mono font-bold text-sm text-indigo-700 block">
                  #{selectedAptToReschedule.appointmentId} • {selectedAptToReschedule.meetingWith}
                </span>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">New Visit Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={rescheduleForm.visitDate}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, visitDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 font-semibold focus:outline-none focus:border-[#f97316] bg-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">New Preferred Slot</label>
                <select
                  value={rescheduleForm.visitTime}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, visitTime: e.target.value })}
                  className="w-full p-2 border border-gray-300 font-semibold bg-white focus:outline-none focus:border-[#f97316]"
                >
                  <option value="09:30 AM">09:30 AM - Morning Slot</option>
                  <option value="11:00 AM">11:00 AM - Mid-Day Slot</option>
                  <option value="11:30 AM">11:30 AM - Free Period</option>
                  <option value="01:30 PM">01:30 PM - Post Lunch</option>
                  <option value="02:15 PM">02:15 PM - Dispersal Time</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Reason for Rescheduling</label>
                <input
                  type="text"
                  value={rescheduleForm.reason}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, reason: e.target.value })}
                  className="w-full p-2 border border-gray-300 font-medium focus:outline-none focus:border-[#f97316]"
                  placeholder="e.g. Schedule conflict / personal work"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setRescheduleModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold"
                >
                  Save New Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

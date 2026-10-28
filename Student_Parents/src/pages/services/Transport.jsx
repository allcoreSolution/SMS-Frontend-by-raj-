import React, { useState, useEffect, useRef } from 'react';
import {
  Bus,
  User,
  Phone,
  Gauge,
  ArrowUp,
  ArrowDown,
  MapPin,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  Clock,
  Radio,
  CheckCircle2,
  Calendar,
  Send,
  MessageSquare,
  ExternalLink,
  Info,
  ChevronDown,
  ChevronRight,
  Sparkles,
  PhoneCall,
  Check,
  Compass,
  Zap,
  Activity,
  Award,
  Share2
} from 'lucide-react';
import parentService from '../../api/parentService';

export default function Transport({ activeChild }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [transportData, setTransportData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline', 'boarding', 'safety', 'helplines'
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [routeMenuOpen, setRouteMenuOpen] = useState(false);
  
  // Issue report modal
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issueForm, setIssueForm] = useState({
    issueType: 'Bus Delay / ETA Inquiry',
    phone: '+91 98765 10000',
    description: ''
  });
  const [submittingIssue, setSubmittingIssue] = useState(false);
  const [issueSuccess, setIssueSuccess] = useState(null);

  // Emergency SOS Modal
  const [sosModalOpen, setSosModalOpen] = useState(false);

  // Timer ref for auto-refresh
  const refreshTimerRef = useRef(null);

  // Fetch transport details
  const fetchTransportData = async (isBackground = false, simulate = false) => {
    try {
      if (!isBackground) {
        setRefreshing(true);
      }
      const params = {};
      if (activeChild) params.studentId = activeChild;
      if (selectedRouteId) params.routeId = selectedRouteId;
      if (simulate) params.simulate = 'true';

      const res = await parentService.getStudentTransport(params);
      if (res?.success && res.data) {
        setTransportData(res.data);
        setError(null);
      } else {
        setError(res?.message || 'Failed to load transport details');
      }
    } catch (err) {
      console.error('Error fetching transport details:', err);
      setError('Unable to connect to live transport server. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setSimulating(false);
    }
  };

  useEffect(() => {
    fetchTransportData(false, false);
  }, [activeChild, selectedRouteId]);

  // Set up 12s auto-refresh polling
  useEffect(() => {
    if (!autoRefresh) return;
    refreshTimerRef.current = setInterval(() => {
      fetchTransportData(true, false);
    }, 12000);

    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, [autoRefresh, activeChild, selectedRouteId]);

  // Trigger GPS Simulation ping
  const handleSimulateGPS = async () => {
    try {
      setSimulating(true);
      await parentService.simulateBusGPS({
        vehicleNumber: transportData?.vehicle?.vehicleNumber || 'DL-01-AB-4501'
      });
      await fetchTransportData(false, false);
    } catch (e) {
      console.error('Simulation failed:', e);
      setSimulating(false);
    }
  };

  // Submit Issue Report
  const handleSubmitIssue = async (e) => {
    e.preventDefault();
    if (!issueForm.description.trim()) return;
    setSubmittingIssue(true);
    try {
      const res = await parentService.reportTransportIssue({
        studentName: transportData?.student?.name || 'Aarav Sharma',
        vehicleNumber: transportData?.vehicle?.vehicleNumber || 'DL-01-AB-4501',
        issueType: issueForm.issueType,
        phone: issueForm.phone,
        description: issueForm.description
      });
      if (res?.success) {
        setIssueSuccess(res.message);
        setTimeout(() => {
          setIssueSuccess(null);
          setIssueModalOpen(false);
          setIssueForm(prev => ({ ...prev, description: '' }));
        }, 3000);
      }
    } catch (err) {
      console.error('Issue submission error:', err);
    } finally {
      setSubmittingIssue(false);
    }
  };

  if (loading && !transportData) {
    return (
      <div className="p-6 max-w-[1440px] mx-auto min-h-[700px] flex flex-col items-center justify-center">
        <div className="w-14 h-14 border-4 border-[#353A40] border-t-yellow-500 rounded-none animate-spin mb-4"></div>
        <p className="text-gray-700 font-bold text-[15px] tracking-wide">Connecting to GPS Telematics Satellite...</p>
        <p className="text-gray-400 text-[12px] mt-1">Retrieving School Bus Route & RFID Boarding Telemetry</p>
      </div>
    );
  }

  const { student, vehicle, driver, attendant, route, stops = [], boardingHistory = [], helplines = {}, allRoutes = [] } = transportData || {};
  const currentLoc = vehicle?.currentLocation || { lat: 28.5910, lng: 77.0396, address: 'Dwarka Sector 12 Main Crossing' };
  const lat = currentLoc.lat || 28.5910;
  const lng = currentLoc.lng || 77.0396;

  // OpenStreetMap embed coordinates bounding box
  const bbox = `${(lng - 0.045).toFixed(4)}%2C${(lat - 0.025).toFixed(4)}%2C${(lng + 0.045).toFixed(4)}%2C${(lat + 0.025).toFixed(4)}`;
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.toFixed(5)}%2C${lng.toFixed(5)}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className="p-3 sm:p-5 max-w-[1440px] mx-auto min-h-screen bg-slate-50 space-y-4 pb-24">
      
      {/* =========================================================================
          TOP HERO BLUE GRADIENT BAR & STUDENT TRANSPORT CONTEXT
          ========================================================================= */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white p-4 sm:p-6 rounded-3xl shadow-lg border border-blue-400/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute -right-16 -top-16 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md text-amber-300 flex items-center justify-center flex-shrink-0 font-bold shadow-md border border-white/20">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-serif">
                {route?.routeName || 'Route 1 - Dwarka Sector 12 Express'}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 text-[10px] font-black uppercase tracking-wider backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Live GPS Active
              </span>
            </div>
            <p className="text-[12px] text-blue-100 mt-1 flex items-center gap-2 flex-wrap">
              <span>Ward: <strong className="text-white">{student?.name || 'Kabir Singh'}</strong> ({student?.className || 'Class 10th (A)'})</span>
              <span className="text-blue-300/60">•</span>
              <span>Pickup Stop: <strong className="text-amber-300">{student?.assignedStop || 'Dwarka Mor Depot'}</strong></span>
              <span className="text-blue-300/60">•</span>
              <span>Smart RFID: <strong className="text-white font-mono">{student?.rfidCard || 'BUS-RFID-8841'}</strong></span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end relative z-10">
          {/* Route Switcher Dropdown */}
          {allRoutes.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setRouteMenuOpen(!routeMenuOpen)}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-[11.5px] font-bold flex items-center gap-1.5 transition-all shadow-xs backdrop-blur-sm cursor-pointer"
                title="Switch School Route"
              >
                <span>Select Route</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {routeMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl rounded-2xl z-50 py-1.5 overflow-hidden">
                  <div className="px-3.5 py-1.5 text-[9.5px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-800">
                    School Bus Routes
                  </div>
                  {allRoutes.map(r => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setSelectedRouteId(r.id);
                        setRouteMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-[12px] flex items-center justify-between hover:bg-white/10 transition-colors ${
                        (route?.id === r.id || (!selectedRouteId && r.name.includes('Route 1'))) ? 'bg-blue-600/30 text-amber-300 font-bold' : 'text-slate-200'
                      }`}
                    >
                      <span className="truncate">{r.name}</span>
                      <span className="text-[10px] text-slate-400 ml-2">{r.stopsCount} stops</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-xl text-[11.5px] font-bold flex items-center gap-1.5 transition-all border backdrop-blur-sm cursor-pointer ${
              autoRefresh ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400/50 shadow-xs' : 'bg-white/10 text-white/90 border-white/20 hover:bg-white/20'
            }`}
            title="Toggle Live 12s Radar Refresh"
          >
            <Radio className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-pulse text-emerald-400' : 'text-slate-300'}`} />
            <span>Auto {autoRefresh ? 'ON' : 'OFF'}</span>
          </button>

          {/* Simulate Movement Button */}
          <button
            onClick={handleSimulateGPS}
            disabled={simulating}
            className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 text-amber-200 text-[11.5px] font-bold flex items-center gap-1.5 transition-all backdrop-blur-sm shadow-xs cursor-pointer"
            title="Simulate Bus Moving to Next Waypoint"
          >
            <Zap className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
            <span>{simulating ? 'Moving...' : 'Simulate GPS'}</span>
          </button>

          {/* Refresh Location Button */}
          <button
            onClick={() => fetchTransportData(false, false)}
            disabled={refreshing}
            className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11.5px] font-extrabold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync GPS'}</span>
          </button>

          {/* Report Issue Button */}
          <button
            onClick={() => setIssueModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-[11.5px] font-bold flex items-center gap-1.5 transition-all backdrop-blur-sm cursor-pointer"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>Inquiry</span>
          </button>

          {/* SOS Emergency Button */}
          <button
            onClick={() => setSosModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11.5px] font-black flex items-center gap-1.5 shadow-md uppercase tracking-wider transition-all cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
            <span>SOS</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Dashboard Layout */}
      <div className="flex flex-col lg:flex-row gap-5">
        
        {/* =========================================================================
            LEFT COLUMN (420px): TELEMETRY, DRIVER, TIMELINE & BOARDING TABS
            ========================================================================= */}
        <div className="w-full lg:w-[440px] flex flex-col gap-4 flex-shrink-0">
          
          {/* Top Vehicle Telemetry Banner Card (ERP Design) */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-5 rounded-3xl shadow-md border border-slate-700/60 flex flex-col justify-between relative overflow-hidden">
            
            {/* Background bus watermark */}
            <Bus className="absolute -right-6 -bottom-6 w-36 h-36 text-white/5 pointer-events-none" />

            {/* Top Row: Vehicle ID & Trip Status */}
            <div className="flex justify-between items-start z-10">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 bg-yellow-500 text-gray-950 flex items-center justify-center flex-shrink-0 font-extrabold text-[15px] shadow">
                  <Bus className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[20px] tracking-wide font-mono text-white">
                      {vehicle?.vehicleNumber || 'DL-01-AB-4501'}
                    </span>
                  </div>
                  <span className="text-[12px] text-gray-300 font-medium tracking-wide">
                    {vehicle?.vehicleModel || 'Tata Starbus Skool 42-Seater'}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{vehicle?.tripStatus || 'On Route'}</span>
              </div>
            </div>

            {/* Middle Row: Speed, Fuel, AC & Occupancy Gauges */}
            <div className="grid grid-cols-4 gap-2 my-4 pt-3 border-t border-white/10 z-10 text-center">
              <div className="bg-black/25 p-2 rounded-none">
                <div className="flex items-center justify-center gap-1 text-yellow-400 text-[10.5px] font-bold">
                  <Gauge className="w-3.5 h-3.5" /> Speed
                </div>
                <div className="font-extrabold text-[15px] text-white mt-0.5 font-mono">
                  {vehicle?.speed || 38} <span className="text-[10px] font-normal text-gray-300">km/h</span>
                </div>
              </div>

              <div className="bg-black/25 p-2 rounded-none">
                <div className="flex items-center justify-center gap-1 text-emerald-400 text-[10.5px] font-bold">
                  <Zap className="w-3.5 h-3.5" /> Fuel
                </div>
                <div className="font-extrabold text-[15px] text-white mt-0.5 font-mono">
                  {vehicle?.fuelLevel || 88}%
                </div>
              </div>

              <div className="bg-black/25 p-2 rounded-none">
                <div className="flex items-center justify-center gap-1 text-cyan-400 text-[10.5px] font-bold">
                  <Activity className="w-3.5 h-3.5" /> AC Temp
                </div>
                <div className="font-extrabold text-[15px] text-white mt-0.5 font-mono">
                  24°C
                </div>
              </div>

              <div className="bg-black/25 p-2 rounded-none">
                <div className="flex items-center justify-center gap-1 text-purple-400 text-[10.5px] font-bold">
                  <User className="w-3.5 h-3.5" /> Onboard
                </div>
                <div className="font-extrabold text-[15px] text-white mt-0.5 font-mono">
                  {vehicle?.currentOccupancy || 34}/{vehicle?.capacity || 42}
                </div>
              </div>
            </div>

            {/* Bottom Row: Current Road Location */}
            <div className="flex items-center justify-between text-[11.5px] text-gray-300 pt-2 border-t border-white/10 z-10">
              <div className="flex items-center gap-1.5 truncate max-w-[280px]">
                <MapPin className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                <span className="truncate font-medium">{currentLoc.address}</span>
              </div>
              <span className="text-gray-400 text-[10.5px] flex-shrink-0 font-mono">
                {vehicle?.lastPing || 'Live (Just now)'}
              </span>
            </div>
          </div>

          {/* Driver & Attendant Contact Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Bus Staff
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ⭐ {driver?.rating || '4.9 Safe Driving'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center flex-shrink-0 font-black text-[15px] shadow-2xs">
                  {driver?.name?.charAt(0) || 'R'}
                </div>
                <div>
                  <h3 className="font-extrabold text-[14px] text-slate-900 leading-tight">
                    {driver?.name || 'Ramesh Kumar'}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>License: <strong className="text-slate-700">{driver?.licence || 'DL-042018002931'}</strong></span>
                    <span>•</span>
                    <span>Blood: <strong className="text-rose-600">{driver?.bloodGroup || 'B+'}</strong></span>
                  </p>
                </div>
              </div>

              {/* Call & WhatsApp Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${driver?.rawPhone || '9811223344'}`}
                  className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
                  title="Call Driver"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${driver?.whatsapp || '919811223344'}?text=Hello%20Driver%20${encodeURIComponent(driver?.name || 'Ramesh Kumar')},%20inquiring%20about%20student%20Aarav%20Sharma%20pickup`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#25D366] hover:bg-[#1fb355] text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
                  title="WhatsApp Driver"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Female Caretaker / Attendant Strip */}
            {attendant && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 flex items-center justify-between text-[11.5px] mt-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-800">{attendant.name}</span>
                    <span className="text-[10px] text-slate-500 block leading-none">{attendant.role}</span>
                  </div>
                </div>
                <a
                  href={`tel:${attendant.rawPhone || '9876541230'}`}
                  className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-500 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>Call Staff</span>
                </a>
              </div>
            )}
          </div>

          {/* Segmented Tab Navigation Controls */}
          <div className="p-1.5 bg-slate-200/80 rounded-2xl grid grid-cols-3 gap-1 shadow-inner">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-2 text-[11px] font-bold rounded-xl text-center transition-all cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Route ({stops.length})
            </button>
            <button
              onClick={() => setActiveTab('boarding')}
              className={`py-2 text-[11px] font-bold rounded-xl text-center transition-all cursor-pointer ${
                activeTab === 'boarding'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              RFID ({boardingHistory.length})
            </button>
            <button
              onClick={() => setActiveTab('safety')}
              className={`py-2 text-[11px] font-bold rounded-xl text-center transition-all cursor-pointer ${
                activeTab === 'safety'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Safety Spec
            </button>
          </div>

          {/* TAB 1: ROUTE TIMELINE STOPS */}
          {activeTab === 'timeline' && (
            <div className="bg-white border border-slate-200/80 rounded-3xl flex-1 shadow-xs overflow-hidden flex flex-col min-h-[380px]">
              <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-1.5 text-slate-800 font-extrabold">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Route Stops & Expected Timings</span>
                </div>
                <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Morning Pickup Run
                </span>
              </div>

              <div className="flex-1 p-5 overflow-y-auto relative">
                {/* Master Vertical Line */}
                <div className="absolute left-[34px] top-[32px] bottom-[40px] w-[2px] bg-gray-200"></div>

                <div className="space-y-4">
                  {stops.map((stop, i) => {
                    const isPassed = stop.status === 'passed';
                    const isCurrent = stop.status === 'current';
                    const isStudent = stop.isStudentStop;

                    return (
                      <div key={stop.id || i} className="relative flex items-start gap-4">
                        
                        {/* Node icon placed on vertical line */}
                        <div className={`w-7 h-7 rounded-none flex items-center justify-center font-bold text-[11px] z-10 flex-shrink-0 border-2 shadow-sm ${
                          isCurrent
                            ? 'bg-yellow-500 border-yellow-600 text-gray-950 animate-pulse ring-4 ring-yellow-200'
                            : isPassed
                            ? 'bg-emerald-600 border-emerald-700 text-white'
                            : 'bg-white border-gray-300 text-gray-500'
                        }`}>
                          {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : (stop.id || i + 1)}
                        </div>

                        {/* Stop Content Card */}
                        <div className={`flex-1 p-3 border transition-all ${
                          isStudent
                            ? 'bg-amber-50/70 border-amber-300 shadow-sm ring-1 ring-amber-200'
                            : isCurrent
                            ? 'bg-blue-50/50 border-blue-200'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-[13.5px] text-gray-900">
                                  {stop.stopName}
                                </span>
                                {isStudent && (
                                  <span className="px-2 py-0.5 bg-yellow-500 text-gray-950 text-[9.5px] font-black uppercase tracking-wider">
                                    ★ Your Ward's Stop
                                  </span>
                                )}
                              </div>

                              {/* Timings row */}
                              <div className="flex items-center gap-3 mt-1.5 text-[11px] font-semibold text-gray-600 flex-wrap">
                                <div className="flex items-center gap-1 text-emerald-700">
                                  <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>Pickup: <strong>{stop.pickupTime}</strong></span>
                                </div>
                                <div className="flex items-center gap-1 text-blue-700">
                                  <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>Drop: <strong>{stop.dropTime}</strong></span>
                                </div>
                              </div>
                            </div>

                            {/* Status badge */}
                            <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider flex-shrink-0 border ${
                              isPassed
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : isCurrent
                                ? 'bg-yellow-100 text-yellow-900 border-yellow-300 font-bold'
                                : 'bg-gray-100 text-gray-500 border-gray-200'
                            }`}>
                              {stop.etaBadge || stop.statusLabel}
                            </span>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RFID BOARDING SCAN HISTORY */}
          {activeTab === 'boarding' && (
            <div className="bg-white border border-gray-200 flex-1 shadow-sm overflow-hidden flex flex-col min-h-[380px]">
              <div className="p-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-1.5 text-gray-700 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>RFID NFC Card Swipes</span>
                </div>
                <span className="text-[10px] font-bold text-gray-500">
                  Card: {student?.rfidCard || 'BUS-RFID-8841'}
                </span>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
                {boardingHistory.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-[13px]">
                    No RFID scan events found for current period.
                  </div>
                ) : (
                  boardingHistory.map((log, idx) => (
                    <div key={log.id || idx} className="p-3 bg-gray-50 border border-gray-200 flex flex-col gap-1.5 hover:border-gray-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[12.5px] text-gray-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          {log.tripType}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 border border-emerald-200">
                          {log.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 mt-0.5">
                        <div>
                          <span className="text-gray-400 block text-[9.5px] uppercase">Date & Time</span>
                          <strong>{log.date}</strong> at <strong className="text-gray-900">{log.time}</strong>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[9.5px] uppercase">Stoppage</span>
                          <strong className="text-gray-800">{log.stopName}</strong>
                        </div>
                      </div>

                      <div className="text-[10px] text-gray-400 border-t border-gray-200/80 pt-1 mt-0.5 flex items-center justify-between">
                        <span>Bus: {log.vehicleNumber}</span>
                        <span>{log.scanType}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SAFETY SPECIFICATIONS */}
          {activeTab === 'safety' && (
            <div className="bg-white border border-gray-200 flex-1 shadow-sm overflow-hidden flex flex-col min-h-[380px] p-4 space-y-3">
              <h4 className="font-bold text-[13px] text-gray-900 border-b pb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                School Bus Fleet Safety Compliance
              </h4>

              <div className="space-y-2.5 text-[12px]">
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-950 block">Speed Governor Cap (40 km/h)</span>
                    <span className="text-emerald-800 text-[11px]">Bus is legally limited to a maximum speed of 40 km/h per Delhi Transport Dept school safety guidelines.</span>
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50 border border-blue-200 flex items-start gap-2.5">
                  <Radio className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-blue-950 block">Dual GPS & Geofence Alarms</span>
                    <span className="text-blue-800 text-[11px]">Real-time telematics with automated SMS alert triggered when the vehicle arrives within 1.5 km of your stop.</span>
                  </div>
                </div>

                <div className="p-2.5 bg-purple-50 border border-purple-200 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-purple-950 block">CCTV & First-Aid Female Staff</span>
                    <span className="text-purple-800 text-[11px]">4 HD CCTV cameras recording continuously, equipped with verified First-Aid kit and licensed female chaperone.</span>
                  </div>
                </div>

                <div className="p-2.5 bg-gray-50 border border-gray-200 text-[11px] text-gray-600">
                  <p className="font-semibold text-gray-800">Transport Help Desk:</p>
                  <p>Ph: {helplines?.transportDesk || '+91 11 2808 9000'} • Emergency PCR: 112</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* =========================================================================
            RIGHT COLUMN: INTERACTIVE OPENSTREETMAP GPS RADAR VIEW
            ========================================================================= */}
        <div className="flex-1 bg-white border border-slate-200/80 rounded-3xl shadow-sm flex flex-col min-h-[580px] relative overflow-hidden">
          
          {/* Map Header Overlay Bar */}
          <div className="p-3.5 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-extrabold text-[13px] text-slate-800">
                Live GPS Map: {vehicle?.vehicleNumber || 'DL-01-AB-4501'}
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
                ({lat.toFixed(4)}° N, {lng.toFixed(4)}° E)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Open in Google Maps"
              >
                <ExternalLink className="w-3 h-3 text-blue-600" />
                <span>Google Maps</span>
              </a>
            </div>
          </div>

          {/* The Live Interactive Map (OpenStreetMap Native) */}
          <div className="flex-1 w-full h-full relative min-h-[500px] bg-slate-100">
            <iframe
              key={`${lat}-${lng}`}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src={osmUrl}
              className="w-full h-full grayscale-[10%] contrast-[1.05]"
              style={{ pointerEvents: 'auto', minHeight: '520px' }}
              title="Real-time School Bus GPS Tracking Map"
            ></iframe>

            {/* Floating Top Floating Speed Gauge Badge */}
            <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl shadow-xl border border-white/20 flex items-center gap-3 pointer-events-none">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[14px]">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[9px] text-slate-300 uppercase font-bold tracking-wider">Current Speed</div>
                <div className="text-[16px] font-black font-mono text-amber-300 leading-none mt-0.5">
                  {vehicle?.speed || 38} km/h
                </div>
              </div>
            </div>

            {/* Floating Ward's Stop Pill */}
            <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md text-slate-900 px-3.5 py-2 rounded-2xl shadow-xl border border-amber-300/80 flex items-center gap-2.5 pointer-events-none">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] font-black text-amber-600 uppercase block leading-none">Your Ward Stop</span>
                <span className="text-[12px] font-black text-slate-900">{student?.assignedStop || 'Dwarka Mor Depot'}</span>
              </div>
            </div>

            {/* Bottom Floating Telemetry Banner */}
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-[#1e293b]/95 backdrop-blur text-white p-3 shadow-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-none bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                  <Compass className="w-4 h-4 animate-spin" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Live Road Address</span>
                  <span className="text-[12.5px] font-bold text-gray-100">{currentLoc.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-[11px] text-gray-300 font-mono">
                  ETA to School: <strong className="text-yellow-400">07:54 AM (~16 mins)</strong>
                </span>
                <button
                  onClick={handleSimulateGPS}
                  disabled={simulating}
                  className="px-2.5 py-1 bg-yellow-500 hover:bg-yellow-400 text-gray-950 text-[11px] font-bold flex items-center gap-1 shadow transition-colors"
                >
                  <Zap className="w-3 h-3" />
                  <span>Nudge GPS</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* =========================================================================
          ISSUE REPORT & HELPLINE QUERY MODAL
          ========================================================================= */}
      {issueModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white max-w-[500px] w-full p-6 shadow-2xl border-t-4 border-yellow-500 relative">
            <h3 className="text-[18px] font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Submit Transport Query / Issue Report
            </h3>
            <p className="text-[12.5px] text-gray-500 mt-1">
              Directly contacts the All Core Solutions Transport Desk. A dedicated officer will review your request.
            </p>

            {issueSuccess ? (
              <div className="my-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-[13px] font-semibold flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <span>{issueSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitIssue} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Query Category
                  </label>
                  <select
                    value={issueForm.issueType}
                    onChange={(e) => setIssueForm({ ...issueForm, issueType: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 text-[13px] focus:outline-none focus:border-yellow-500"
                  >
                    <option>Bus Delay / ETA Inquiry</option>
                    <option>Pickup / Drop Point Modification</option>
                    <option>Lost Belonging on Bus</option>
                    <option>AC / Cleanliness / Comfort Feedback</option>
                    <option>Driver / Conductor Conduct</option>
                    <option>Emergency Route Assistance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Parent Callback Phone
                  </label>
                  <input
                    type="text"
                    value={issueForm.phone}
                    onChange={(e) => setIssueForm({ ...issueForm, phone: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 text-[13px] focus:outline-none focus:border-yellow-500 font-mono"
                    placeholder="+91 98765 10000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Details / Message
                  </label>
                  <textarea
                    rows={4}
                    value={issueForm.description}
                    onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 text-[13px] focus:outline-none focus:border-yellow-500"
                    placeholder="Describe your issue or request here..."
                    required
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIssueModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-[12px] font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingIssue}
                    className="px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-950 text-[12px] font-bold flex items-center gap-1.5 shadow transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingIssue ? 'Submitting...' : 'Submit to Desk'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          EMERGENCY SOS DESK MODAL
          ========================================================================= */}
      {sosModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white max-w-[460px] w-full p-6 shadow-2xl border-t-4 border-red-600 relative">
            <div className="flex items-center gap-3 text-red-600 mb-2">
              <PhoneCall className="w-6 h-6 animate-pulse" />
              <h3 className="text-[18px] font-bold tracking-tight">Emergency Transport Desk</h3>
            </div>
            <p className="text-[13px] text-gray-600">
              For urgent safety emergencies, bus breakdown, or immediate assistance regarding your child Aarav Sharma on Route 1.
            </p>

            <div className="my-5 space-y-2.5">
              <a
                href={`tel:${helplines?.transportDesk || '+911128089000'}`}
                className="w-full p-3.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-900 flex items-center justify-between transition-colors font-bold text-[13.5px]"
              >
                <span>School Transport Control Desk</span>
                <span className="font-mono text-red-700">{helplines?.transportDesk || '+91 11 2808 9000'}</span>
              </a>

              <a
                href={`tel:${driver?.rawPhone || '9811223344'}`}
                className="w-full p-3.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-900 flex items-center justify-between transition-colors font-bold text-[13.5px]"
              >
                <span>Call Driver ({driver?.name || 'Ramesh Kumar'})</span>
                <span className="font-mono text-gray-700">{driver?.phone || '+91 98112 23344'}</span>
              </a>

              <a
                href="tel:112"
                className="w-full p-3.5 bg-gray-900 text-white flex items-center justify-between hover:bg-black transition-colors font-bold text-[13.5px]"
              >
                <span>National Emergency Police</span>
                <span className="font-mono text-yellow-400">112</span>
              </a>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setSosModalOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-[12px] font-bold"
              >
                Close Emergency Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

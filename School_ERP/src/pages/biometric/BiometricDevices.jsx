import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Fingerprint, Monitor, Cloud, Camera, Cpu, Settings, Trash2, 
  ArrowLeft, Check, AlertTriangle, PlayCircle, ClipboardList, LogIn, 
  LogOut, Server, Filter as FilterIcon, RefreshCcw, FileDown, Eye, 
  UserCheck, UserX, ShieldAlert, List, Plus, Search, Radio, Wifi, 
  CheckCircle2, Sparkles, Printer, X, Shield, Terminal
} from 'lucide-react';
import BiometricNavHeader from './BiometricNavHeader';
import biometricService from '../../api/biometricService';

export default function BiometricDevices() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active view from URL
  const isAddDevice = location.pathname.includes('/add-device');
  const isAttendanceLogs = location.pathname.includes('/attendance-logs');
  const isLiveLog = location.pathname.includes('/live-log');
  const isFaceMonitoring = location.pathname.includes('/face-monitoring');
  const isReviewQueue = location.pathname.includes('/review-queue');
  const isAgentLogs = location.pathname.includes('/agent-logs');

  // Fleet state
  const [devices, setDevices] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [faceDetections, setFaceDetections] = useState([]);
  const [agentLogs, setAgentLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [deviceFilter, setDeviceFilter] = useState('All');

  // Add Device Form State
  const [newDevice, setNewDevice] = useState({
    deviceName: '',
    ipAddress: '192.168.1.200',
    port: 4370,
    deviceType: 'Biometric',
    integrationMode: 'cloud',
    brand: 'ZKTeco',
    serialNumber: '',
    location: 'Main Gate Terminal',
    commKey: '0'
  });

  // Action status message
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Live stream auto-refresh for live-log and face-monitoring
  useEffect(() => {
    loadAllData();
  }, [location.pathname]);

  useEffect(() => {
    if (isLiveLog || isFaceMonitoring) {
      const interval = setInterval(() => {
        setAttendanceLogs(biometricService.getAttendanceLogs());
        setFaceDetections(biometricService.getFaceDetections());
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLiveLog, isFaceMonitoring]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const devList = await biometricService.getDevices();
      setDevices(devList);
      setAttendanceLogs(biometricService.getAttendanceLogs());
      setFaceDetections(biometricService.getFaceDetections());
      setAgentLogs(biometricService.getAgentLogs());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Ping test
  const handlePing = async (id, e) => {
    e.stopPropagation();
    const res = await biometricService.pingDevice(id);
    showNotification(res.message);
  };

  // Sync test
  const handleSync = async (id, e) => {
    e.stopPropagation();
    const res = await biometricService.syncDevice(id);
    loadAllData();
    showNotification(res.message);
  };

  // Delete device
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this biometric terminal from the active fleet?')) {
      await biometricService.deleteDevice(id);
      loadAllData();
      showNotification('Device removed from fleet');
    }
  };

  // Simulate Live Punch
  const handleSimulateLivePunch = () => {
    const candidates = [
      { name: 'Aarav Sharma', role: 'Student' },
      { name: 'Diya Patel', role: 'Student' },
      { name: 'Dr. Ramesh Kumar', role: 'Staff' },
      { name: 'Kabir Mehta', role: 'Student' },
      { name: 'Mrs. Sunita Sen', role: 'Staff' }
    ];
    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    const directions = ['IN', 'OUT'];
    const dir = directions[Math.floor(Math.random() * directions.length)];
    const targetDevice = devices[0]?.deviceName || 'Main Entrance Turnstile #1';

    const newPunch = biometricService.simulatePunch(targetDevice, picked.name, picked.role, dir);
    loadAllData();
    showNotification(`Live Punch Received: ${picked.name} (${picked.role}) marked ${dir} at ${newPunch.timeFormatted}!`);
  };

  // Submit Add Device
  const handleAddDeviceSubmit = async (e) => {
    e.preventDefault();
    if (!newDevice.deviceName.trim()) {
      alert('Please enter a device name');
      return;
    }
    await biometricService.registerDevice(newDevice);
    showNotification(`New terminal ${newDevice.deviceName} connected successfully!`);
    navigate('/biometric/all-devices');
  };

  // Export CSV
  const handleExportLogs = () => {
    const headers = ['Timestamp', 'Candidate Name', 'Role', 'Class/Desig', 'ID', 'Status', 'Method', 'Device'];
    const rows = filteredLogs.map(l => [
      l.timestamp,
      `"${l.name}"`,
      l.type,
      `"${l.classDesig}"`,
      l.admStaffId,
      l.status,
      l.method,
      `"${l.device}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Biometric_Attendance_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered devices
  const filteredDevices = devices.filter(d => {
    const matchesSearch = 
      !search.trim() || 
      d.deviceName?.toLowerCase().includes(search.toLowerCase()) ||
      d.ipAddress?.toLowerCase().includes(search.toLowerCase()) ||
      d.brand?.toLowerCase().includes(search.toLowerCase()) ||
      d.serialNumber?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || d.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Filtered logs
  const filteredLogs = attendanceLogs.filter(l => {
    const matchesSearch = 
      !search.trim() ||
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.admStaffId?.toLowerCase().includes(search.toLowerCase()) ||
      l.classDesig?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || l.type === roleFilter;
    const matchesDevice = deviceFilter === 'All' || l.device === deviceFilter;
    return matchesSearch && matchesRole && matchesDevice;
  });

  // Online devices count
  const onlineCount = devices.filter(d => d.status === 'Online').length;
  const totalPunchesToday = devices.reduce((sum, d) => sum + (d.todayPunches || 0), 0);

  // --------------------------------------------------------------------------
  // VIEW 1: ADD NEW DEVICE
  // --------------------------------------------------------------------------
  if (isAddDevice) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-16">
        <BiometricNavHeader onTriggerSimulate={handleSimulateLivePunch} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/biometric/all-devices')}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Enroll New Biometric Hardware</h2>
              <p className="text-xs text-slate-500">
                Configure network credentials, protocol mode, and bind terminal to campus zones.
              </p>
            </div>
          </div>

          <form onSubmit={handleAddDeviceSubmit} className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Integration Mode Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  1. Choose Integration Protocol
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    onClick={() => setNewDevice({ ...newDevice, integrationMode: 'cloud', brand: 'ZKTeco' })}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      newDevice.integrationMode === 'cloud' 
                        ? 'border-teal-600 bg-teal-50/50 shadow-xs' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <Cloud className="w-6 h-6 text-teal-600 mb-2" />
                    <h4 className="font-bold text-sm text-slate-800">Cloud Push (ADMS / Webhook)</h4>
                    <p className="text-[11px] text-slate-500 mt-1">ZKTeco, eSSL, Realtime direct cloud communication without local server.</p>
                  </div>

                  <div 
                    onClick={() => setNewDevice({ ...newDevice, integrationMode: 'agent', brand: 'eSSL' })}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      newDevice.integrationMode === 'agent' 
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <Monitor className="w-6 h-6 text-indigo-600 mb-2" />
                    <h4 className="font-bold text-sm text-slate-800">Local Windows Agent Sync</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Legacy TCP/IP LAN clock machines polled via background Windows sync agent.</p>
                  </div>

                  <div 
                    onClick={() => setNewDevice({ ...newDevice, integrationMode: 'camera', brand: 'Hikvision' })}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      newDevice.integrationMode === 'camera' 
                        ? 'border-purple-600 bg-purple-50/50 shadow-xs' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <Camera className="w-6 h-6 text-purple-600 mb-2" />
                    <h4 className="font-bold text-sm text-slate-800">AI Facial Recognition Stream</h4>
                    <p className="text-[11px] text-slate-500 mt-1">High-speed RTSP / ONVIF IP camera facial recognition turnstiles.</p>
                  </div>
                </div>
              </div>

              {/* Hardware Specifications Form */}
              <div className="space-y-4 pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Device Identifiers &amp; Network Configuration
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Terminal Name *</label>
                    <input 
                      type="text"
                      placeholder="e.g. North Gate Turnstile Terminal #2"
                      value={newDevice.deviceName}
                      onChange={(e) => setNewDevice({ ...newDevice, deviceName: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Hardware Brand / Model</label>
                    <input 
                      type="text"
                      placeholder="e.g. ZKTeco uFace 800, eSSL K30, Realtime T502"
                      value={newDevice.brand}
                      onChange={(e) => setNewDevice({ ...newDevice, brand: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">IP Address *</label>
                    <input 
                      type="text"
                      placeholder="192.168.1.200"
                      value={newDevice.ipAddress}
                      onChange={(e) => setNewDevice({ ...newDevice, ipAddress: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Port Number</label>
                    <input 
                      type="number"
                      value={newDevice.port}
                      onChange={(e) => setNewDevice({ ...newDevice, port: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Serial Number (SN)</label>
                    <input 
                      type="text"
                      placeholder="ZK8829104"
                      value={newDevice.serialNumber}
                      onChange={(e) => setNewDevice({ ...newDevice, serialNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Physical Campus Location</label>
                    <input 
                      type="text"
                      placeholder="e.g. Main Gate, Library, Senior Block"
                      value={newDevice.location}
                      onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Communication Password / Key</label>
                    <input 
                      type="text"
                      value={newDevice.commKey}
                      onChange={(e) => setNewDevice({ ...newDevice, commKey: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

              </div>

            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/biometric/all-devices')}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-200 flex items-center gap-2 cursor-pointer border-none transition-all"
              >
                <Plus className="w-4 h-4" /> Connect &amp; Register Terminal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // MAIN DASHBOARD & TAB CONTROLLER
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <BiometricNavHeader onTriggerSimulate={handleSimulateLivePunch} />

      {/* Floating Notification Toast */}
      {feedbackMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-slate-700 animate-slide-up">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ================================================================== */}
        {/* TAB 1: ALL DEVICES FLEET */}
        {/* ================================================================== */}
        {(!isAttendanceLogs && !isLiveLog && !isFaceMonitoring && !isReviewQueue && !isAgentLogs) && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Device Fleet</p>
                  <h3 className="text-3xl font-black text-slate-800 mt-1">{devices.length}</h3>
                  <p className="text-[11px] text-slate-500">{onlineCount} online &amp; syncing</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <Monitor className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Status</p>
                  <h3 className="text-3xl font-black text-emerald-600 mt-1">
                    {devices.length > 0 ? Math.round((onlineCount / devices.length) * 100) : 0}%
                  </h3>
                  <p className="text-[11px] text-slate-500">Fleet operational rate</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Wifi className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Punches Today</p>
                  <h3 className="text-3xl font-black text-indigo-600 mt-1">{totalPunchesToday}</h3>
                  <p className="text-[11px] text-slate-500">Recorded across gates</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Fingerprint className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Protocol Sync</p>
                  <h3 className="text-3xl font-black text-purple-600 mt-1">100%</h3>
                  <p className="text-[11px] text-slate-500">Cloud ADMS &amp; Agent live</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Cpu className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Architecture Banner */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Unified Hardware Ecosystem</h3>
                  <p className="text-xs text-slate-500">Three complementary protocols seamlessly unified into one ERP stream</p>
                </div>
                <button
                  onClick={handleSimulateLivePunch}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-teal-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer border-none"
                >
                  <Sparkles className="w-4 h-4" /> Simulate Punch Test
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
                  <Monitor className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-indigo-900">Agent Sync (LAN)</h5>
                    <p className="text-[11px] text-indigo-700 leading-relaxed mt-0.5">
                      Polls legacy LAN devices via Windows Sync background service with zero public IP needed.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 flex items-start gap-3">
                  <Cloud className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-teal-900">Cloud Push (ADMS)</h5>
                    <p className="text-[11px] text-teal-700 leading-relaxed mt-0.5">
                      ZKTeco, eSSL &amp; Realtime push directly to cloud webhooks in sub-second latency.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-start gap-3">
                  <Camera className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-purple-900">Facial AI Recognition</h5>
                    <p className="text-[11px] text-purple-700 leading-relaxed mt-0.5">
                      RTSP streams analyzed at 30 FPS with anti-spoof checks and automated attendance logging.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center flex-1">
                <div className="relative min-w-[240px] max-w-sm flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search terminal name, IP, serial..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600 focus:bg-white"
                  />
                </div>

                <div className="min-w-[140px]">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-600 cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Online">Online Only</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>

              <div className="text-xs font-bold text-slate-400">
                Showing {filteredDevices.length} devices
              </div>
            </div>

            {/* Device Fleet Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDevices.map((dev) => {
                const isOnline = dev.status === 'Online';
                return (
                  <div 
                    key={dev._id || dev.id}
                    className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top Status & Type */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            dev.integrationMode === 'cloud' ? 'bg-teal-50 text-teal-600' :
                            dev.integrationMode === 'camera' ? 'bg-purple-50 text-purple-600' :
                            'bg-indigo-50 text-indigo-600'
                          }`}>
                            {dev.integrationMode === 'camera' ? <Camera className="w-4 h-4" /> : <Fingerprint className="w-4 h-4" />}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-slate-800 leading-snug">{dev.deviceName}</h4>
                            <p className="text-[11px] text-slate-400">{dev.brand || 'Hardware'}</p>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                          isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                          {dev.status}
                        </span>
                      </div>

                      {/* Network & Specs List */}
                      <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100 font-mono">
                        <div className="flex justify-between">
                          <span className="text-slate-400">IP &amp; Port:</span>
                          <span className="font-bold text-slate-800">{dev.ipAddress}:{dev.port}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Serial No:</span>
                          <span className="font-semibold text-slate-700">{dev.serialNumber || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Zone:</span>
                          <span className="font-semibold text-slate-700 font-sans">{dev.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-3">
                        <span className="text-slate-400 font-semibold">Punches Today:</span>
                        <span className="font-black text-indigo-600 text-sm">{dev.todayPunches || 0} Punches</span>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handlePing(dev._id || dev.id, e)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          title="Ping Test"
                        >
                          Ping
                        </button>
                        <button
                          onClick={(e) => handleSync(dev._id || dev.id, e)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          title="Sync Terminal Clock"
                        >
                          Sync
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={handleSimulateLivePunch}
                          className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          title="Simulate Punch"
                        >
                          Punch
                        </button>
                        <button
                          onClick={(e) => handleDelete(dev._id || dev.id, e)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Device"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 2: ATTENDANCE LOGS */}
        {/* ================================================================== */}
        {isAttendanceLogs && (
          <div className="space-y-6">
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Biometric Attendance Punch Logs</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete record of physical punches captured via fingerprint, face AI, and RFID sensors.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportLogs}
                  className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <FileDown className="w-4 h-4" /> Export CSV
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Print Roster
                </button>
              </div>
            </div>

            {/* Filter Row */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center flex-1">
                <div className="relative min-w-[240px] max-w-sm flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search candidate name, ID, class..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-600 focus:bg-white"
                  />
                </div>

                <div className="min-w-[140px]">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-600 cursor-pointer"
                  >
                    <option value="All">All Roles</option>
                    <option value="Student">Student</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
              </div>

              <div className="text-xs font-bold text-slate-400">
                Showing {filteredLogs.length} punches
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3.5 px-6">Timestamp</th>
                      <th className="py-3.5 px-6">Candidate Details</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4 text-center">Punch Direction</th>
                      <th className="py-3.5 px-4">Verification Method</th>
                      <th className="py-3.5 px-6">Terminal Machine</th>
                      <th className="py-3.5 px-4 text-center">Sync Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-slate-800">
                          {log.timeFormatted}
                        </td>

                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-800 text-xs sm:text-sm">{log.name}</div>
                          <div className="text-[11px] text-slate-400">{log.classDesig} • ID: {log.admStaffId}</div>
                        </td>

                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            log.type === 'Staff' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {log.type}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            log.direction === 'IN' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {log.direction || 'IN'}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-semibold text-slate-700">
                          {log.method}
                        </td>

                        <td className="py-4 px-6 text-slate-600 font-medium">
                          {log.device}
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            {log.processed}
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

        {/* ================================================================== */}
        {/* TAB 3: LIVE PUNCH STREAM */}
        {/* ================================================================== */}
        {isLiveLog && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Real-time Gateway Stream
                </div>
                <h3 className="text-2xl font-black">Live Biometric Punch Monitor</h3>
                <p className="text-xs text-teal-100 mt-1">Auto-refreshing every 3 seconds from active turnstiles.</p>
              </div>

              <button
                onClick={handleSimulateLivePunch}
                className="px-5 py-2.5 bg-white text-teal-900 hover:bg-teal-50 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer border-none"
              >
                <Sparkles className="w-4 h-4 text-teal-600" /> Trigger Simulated Punch
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden divide-y divide-slate-100">
              {attendanceLogs.map((log) => (
                <div key={log.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <Fingerprint className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">{log.name}</span>
                        <span className="text-[10px] font-bold text-slate-400">({log.type})</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {log.classDesig} • {log.method} • <span className="font-semibold text-slate-700">{log.device}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono font-bold text-slate-600">{log.timeFormatted}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                      log.direction === 'IN' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      MARKED {log.direction}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 4: AI FACE MONITORING WALL */}
        {/* ================================================================== */}
        {isFaceMonitoring && (
          <div className="space-y-6">
            
            {/* 4 Colored Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-cyan-500 rounded-2xl p-5 text-white shadow-xs">
                <div className="text-3xl font-black">{faceDetections.length}</div>
                <div className="text-xs font-bold uppercase tracking-wider opacity-90 mt-1">Total Detections</div>
              </div>

              <div className="bg-emerald-500 rounded-2xl p-5 text-white shadow-xs">
                <div className="text-3xl font-black">
                  {faceDetections.filter(f => f.status === 'Recognized').length}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider opacity-90 mt-1">Recognized Faces</div>
              </div>

              <div className="bg-rose-500 rounded-2xl p-5 text-white shadow-xs">
                <div className="text-3xl font-black">
                  {faceDetections.filter(f => f.status === 'Unknown Stranger').length}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider opacity-90 mt-1">Unknown Strangers</div>
              </div>

              <div className="bg-amber-500 rounded-2xl p-5 text-white shadow-xs">
                <div className="text-3xl font-black">0</div>
                <div className="text-xs font-bold uppercase tracking-wider opacity-90 mt-1">Spoof Attempts Blocked</div>
              </div>
            </div>

            {/* Detections Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {faceDetections.map((face) => (
                <div key={face.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="relative">
                      <img src={face.avatar} alt={face.name} className="w-full h-44 object-cover rounded-2xl" />
                      <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold text-white uppercase shadow-sm ${
                        face.status === 'Recognized' ? 'bg-emerald-600' :
                        face.status === 'Review Needed' ? 'bg-amber-600' : 'bg-rose-600'
                      }`}>
                        {face.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">{face.name}</h4>
                      <p className="text-xs text-slate-500">{face.classDesig}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                        <span>{face.cameraName}</span>
                        <span className="font-bold text-teal-600">{face.confidence}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>{face.timeFormatted}</span>
                    <span className="text-emerald-600 font-bold">✓ Anti-Spoof Pass</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 5: REVIEW QUEUE */}
        {/* ================================================================== */}
        {isReviewQueue && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <h3 className="text-xl font-bold text-slate-800">Borderline Detection Review Queue</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Facial AI matches with confidence below threshold (75%) requiring security admin confirmation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {faceDetections.filter(f => f.status === 'Review Needed' || f.status === 'Rejected').map((item) => (
                <div key={item.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex items-center gap-5">
                  <img src={item.avatar} alt={item.name} className="w-24 h-24 rounded-2xl object-cover" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {item.confidence} Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{item.reviewReason}</p>
                    <p className="text-[11px] font-mono text-slate-400">{item.cameraName} • {item.timeFormatted}</p>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => {
                          biometricService.reviewFaceDetection(item.id, 'approve');
                          loadAllData();
                          showNotification('Candidate face approved and mapped to dossier!');
                        }}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Confirm Match
                      </button>
                      <button
                        onClick={() => {
                          biometricService.reviewFaceDetection(item.id, 'reject');
                          loadAllData();
                          showNotification('Flagged as stranger');
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 6: AGENT SYNC LOGS */}
        {/* ================================================================== */}
        {isAgentLogs && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-600" /> Windows Local Agent Telemetry
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time TCP socket communication log with LAN biometric clocks.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-700">Agent Service Running (PID: 4920)</span>
              </div>
            </div>

            <div className="bg-slate-950 rounded-3xl p-6 text-emerald-400 font-mono text-xs shadow-xl space-y-2.5 border border-slate-800 max-h-[500px] overflow-y-auto">
              {agentLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-slate-600 select-none">&gt;</span>
                  <span className="leading-relaxed">{log}</span>
                </div>
              ))}
              <div className="text-slate-500 animate-pulse">
                &gt; Listening for next sync cycle...
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

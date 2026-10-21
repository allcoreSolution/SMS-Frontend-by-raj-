import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, ScanLine, Maximize, RotateCcw, Info, CheckCircle2, 
  XCircle, Clock, Users, UserCheck, AlertTriangle, Sparkles, Volume2, 
  VolumeX, RefreshCw, Smartphone, QrCode, ArrowRight, ShieldCheck, Video, VideoOff
} from 'lucide-react';
import QRAttendanceNavHeader from './QRAttendanceNavHeader';
import qrAttendanceService, { CANDIDATES_DATABASE } from '../../api/qrAttendanceService';

export default function QRAttendance() {
  const [deviceType, setDeviceType] = useState('camera'); // 'camera' or 'sensor'
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [punches, setPunches] = useState([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Load initial punches from service
    const currentPunches = qrAttendanceService.getPunches();
    setPunches(currentPunches);
    if (currentPunches.length > 0) {
      setScanResult({
        success: true,
        direction: currentPunches[0].direction,
        candidate: {
          name: currentPunches[0].name,
          rollNo: currentPunches[0].rollNo,
          classDesig: currentPunches[0].classDesig,
          type: currentPunches[0].type,
          avatar: currentPunches[0].avatar
        },
        punch: currentPunches[0]
      });
    }

    // Auto focus input when in sensor mode
    if (deviceType === 'sensor' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [deviceType]);

  // Handle Camera Start / Stop
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      } else {
        setCameraError('Webcam API is not supported in this browser.');
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera access unavailable or blocked. You can still test with simulated scans below.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Process a scan code (from manual input, barcode gun, or quick test button)
  const handleTriggerScan = async (codeToScan, forcedDirection = null) => {
    const res = await qrAttendanceService.processScan(codeToScan, forcedDirection);
    setScanResult(res);
    setPunches(qrAttendanceService.getPunches());
    setManualCode('');
    if (deviceType === 'sensor' && inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Keyboard barcode listener (Enter key submits)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (manualCode.trim()) {
        handleTriggerScan(manualCode);
      }
    }
  };

  // Metrics calculation
  const inPunches = punches.filter(p => p.direction === 'IN');
  const outPunches = punches.filter(p => p.direction === 'OUT');

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <QRAttendanceNavHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Device Switcher & Settings Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Device Mode:</span>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => { setDeviceType('camera'); startCamera(); }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  deviceType === 'camera' 
                    ? 'bg-white text-indigo-700 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Camera className="w-4 h-4" /> Webcam Kiosk
              </button>

              <button 
                onClick={() => { setDeviceType('sensor'); stopCamera(); }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  deviceType === 'sensor' 
                    ? 'bg-white text-indigo-700 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ScanLine className="w-4 h-4" /> Barcode Gun / Sensor
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute Audio Chime' : 'Unmute Audio Chime'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Quick Direction Selector */}
            <div className="text-xs font-semibold text-slate-500">
              Auto IN/OUT Active
            </div>
          </div>
        </div>

        {/* Main Scanner Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: LIVE SCANNER PANE (Col 7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
            
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                <Maximize className="w-4 h-4 text-indigo-600" /> 
                {deviceType === 'camera' ? 'Live Camera Feed & Scanner' : 'Hardware Laser Scanner Gun Receiver'}
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Auto Submit On
              </span>
            </div>

            {/* CAMERA / HARDWARE SCAN SURFACE */}
            <div className="p-6 bg-slate-900 min-h-[380px] flex flex-col items-center justify-center relative overflow-hidden">
              
              {deviceType === 'camera' ? (
                <>
                  {cameraActive ? (
                    <div className="relative w-full h-[340px] flex items-center justify-center">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover rounded-2xl"
                      />

                      {/* Scanning Target Box & Animated Laser Line */}
                      <div className="absolute w-64 h-64 border-2 border-emerald-400 rounded-2xl pointer-events-none flex flex-col justify-between p-2 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                        <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse"></div>
                        <div className="text-center text-[11px] font-mono font-bold text-emerald-300 bg-slate-900/60 py-1 rounded-lg backdrop-blur-xs">
                          Align QR / Barcode inside box
                        </div>
                      </div>

                      <button
                        onClick={stopCamera}
                        className="absolute bottom-3 right-3 px-3 py-1 bg-slate-800/80 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl backdrop-blur-md transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <VideoOff className="w-3.5 h-3.5" /> Stop Feed
                      </button>
                    </div>
                  ) : (
                    <div className="text-center space-y-4 p-8 max-w-sm">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white mx-auto">
                        <Camera className="w-8 h-8 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Live Camera Standby</h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Click below to start your webcam or use the instant test badge scanner below.
                        </p>
                      </div>
                      <button
                        onClick={startCamera}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 mx-auto cursor-pointer border-none"
                      >
                        <Video className="w-4 h-4" /> Start Camera Feed
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* Hardware Sensor Mode */
                <div className="w-full max-w-md text-center space-y-5 p-6">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                    <ScanLine className="w-8 h-8 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">USB / Bluetooth Laser Scanner Gun Ready</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Point the handheld scanner at the physical student ID card, or type code below.
                    </p>
                  </div>
                  <div className="relative">
                    <input 
                      ref={inputRef}
                      type="text"
                      placeholder="Scan Barcode or Enter ID (e.g. STU-1001)..."
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-500 text-sm font-mono focus:outline-none focus:border-indigo-400"
                    />
                    <button
                      onClick={() => handleTriggerScan(manualCode)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Punch
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Quick Test Demo Barcodes Bar */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> One-Click Test Badges (Live Simulation):
                </span>
                <span className="text-[11px] text-slate-400">Click to punch card</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {CANDIDATES_DATABASE.map((cand) => (
                  <button
                    key={cand.id}
                    onClick={() => handleTriggerScan(cand.code)}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-xl text-xs font-semibold text-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <img src={cand.avatar} alt={cand.name} className="w-4 h-4 rounded-full object-cover" />
                    <span>{cand.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({cand.code})</span>
                  </button>
                ))}

                <button
                  onClick={() => handleTriggerScan('INVALID-999')}
                  className="px-3 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 rounded-xl text-xs font-semibold text-rose-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>Invalid ID Test</span>
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: SCANNED ID BADGE RESULT CARD (Col 5) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Scanned ID Badge Details</h3>
              <span className="text-xs text-slate-400 font-semibold">Live Feed</span>
            </div>

            {scanResult ? (
              scanResult.success ? (
                /* Successful Scanned Badge Card */
                <div className="space-y-6">
                  
                  {/* Punch Direction Banner */}
                  <div className={`p-4 rounded-2xl flex items-center justify-between text-white shadow-md ${
                    scanResult.direction === 'IN' 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-100' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-100'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-6 h-6" />
                      <div>
                        <div className="text-base font-black tracking-wide">
                          MARKED {scanResult.direction}
                        </div>
                        <div className="text-[11px] opacity-90">
                          {scanResult.punch?.timeFormatted || 'Just Now'} • {scanResult.punch?.location || 'Main Gate'}
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-white/20 rounded-lg text-xs font-bold uppercase">
                      Confirmed
                    </span>
                  </div>

                  {/* ID Card Display Container */}
                  <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-5">
                    
                    <div className="flex items-center gap-4">
                      <img 
                        src={scanResult.candidate.avatar} 
                        alt={scanResult.candidate.name} 
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-black text-slate-800">
                            {scanResult.candidate.name}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                            scanResult.candidate.type === 'Staff' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {scanResult.candidate.type}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">
                          {scanResult.candidate.classDesig}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                          ID: {scanResult.candidate.rollNo || scanResult.candidate.code}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/80 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Guardian</span>
                        <span className="font-semibold text-slate-700">{scanResult.candidate.guardian || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact</span>
                        <span className="font-semibold text-slate-700">{scanResult.candidate.phone || 'N/A'}</span>
                      </div>
                    </div>

                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTriggerScan(scanResult.candidate.code, 'IN')}
                      className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Force IN Punch
                    </button>
                    <button
                      onClick={() => handleTriggerScan(scanResult.candidate.code, 'OUT')}
                      className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Force OUT Punch
                    </button>
                  </div>

                </div>
              ) : scanResult.status === 'cooldown' ? (
                /* Cooldown Warning Card */
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-3">
                  <Clock className="w-10 h-10 text-amber-500 mx-auto" />
                  <h4 className="text-sm font-bold text-amber-900">Duplicate Punch Cooldown Active</h4>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    {scanResult.reason}
                  </p>
                </div>
              ) : (
                /* Unrecognized Card */
                <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-3">
                  <XCircle className="w-10 h-10 text-rose-500 mx-auto" />
                  <h4 className="text-sm font-bold text-rose-900">Card Not Recognized</h4>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    Code <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded text-rose-800">{scanResult.code}</code> does not match any enrolled student or staff profile.
                  </p>
                </div>
              )
            ) : (
              /* Idle Empty State */
              <div className="p-12 text-center space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <QrCode className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700">Scan ID Card to Begin</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Candidate profile, class, and confirmed punch status will instantly appear here.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Bottom Real-Time Attendance Status Counters */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-emerald-600">{inPunches.length}</div>
              <div className="text-xs text-slate-500 font-semibold">Marked IN Today</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-blue-600">{outPunches.length}</div>
              <div className="text-xs text-slate-500 font-semibold">Marked OUT Today</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-800">{punches.length}</div>
              <div className="text-xs text-slate-500 font-semibold">Total Scans Recorded</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-800">100%</div>
              <div className="text-xs text-slate-500 font-semibold">Scanner Reliability</div>
            </div>
          </div>
        </div>

        {/* Recent Live Activity Stream */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" /> Recent Station Punches (Live Stream)
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{punches.length} recorded</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {punches.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No scans recorded yet today.</div>
            ) : (
              punches.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">{p.name}</div>
                      <div className="text-[11px] text-slate-400">{p.classDesig} • Roll: {p.rollNo}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-semibold text-slate-500">{p.timeFormatted}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      p.direction === 'IN' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {p.direction}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

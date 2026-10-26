import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  MapPin, 
  Gauge, 
  Clock, 
  Battery, 
  BatteryCharging, 
  CheckCircle2, 
  Bell, 
  Bus, 
  Target, 
  Radio, 
  ChevronRight,
  ShieldCheck,
  Check,
  AlertTriangle,
  Zap,
  Flame,
  Activity,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Swal from 'sweetalert2';

export default function LiveTracking() {
  const { driver, vehicle, activeTrip } = useAuth();
  const { isConnected } = useSocket();

  const [broadcastActive, setBroadcastActive] = useState(true);
  const [speed, setSpeed] = useState(38);
  const [batteryLevel] = useState(94);
  const [activeStopIndex, setActiveStopIndex] = useState(2); // Sector 22 Circle is approaching

  const busNo = vehicle?.vehicleNumber || driver?.assignedBus || 'UP 32 AB 1234';
  const formattedBusNo = busNo.startsWith('Bus') ? busNo : `Bus ${busNo}`;
  const routeName = activeTrip?.routeName || 'Route 12';

  // Dynamic ETA calculated based on speed
  const calculatedEta = speed === 0 
    ? 'Stationary' 
    : speed > 60 
    ? '1-2 Mins' 
    : speed > 40 
    ? '3 Mins' 
    : speed > 20 
    ? '4 Mins' 
    : '6 Mins';

  // Dynamic speed state helper
  const getSpeedStatus = (s) => {
    if (s === 0) {
      return {
        label: '🛑 BUS STOPPED (0 km/h)',
        badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
        textColor: 'text-slate-700 dark:text-slate-300',
        barColor: 'from-slate-400 to-slate-500',
        statBg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
        statusDesc: 'Engine Idling • At Transit Stop'
      };
    }
    if (s <= 25) {
      return {
        label: '🟢 SCHOOL ZONE SAFE (15-25 km/h)',
        badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        textColor: 'text-emerald-600 dark:text-emerald-400',
        barColor: 'from-emerald-400 to-teal-500',
        statBg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600',
        statusDesc: 'Pedestrian Safe • Residential Area'
      };
    }
    if (s <= 45) {
      return {
        label: '🟡 CITY COMMUTE LIMIT (30-45 km/h)',
        badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        textColor: 'text-amber-600 dark:text-amber-400',
        barColor: 'from-emerald-400 via-amber-400 to-amber-500',
        statBg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600',
        statusDesc: 'Optimal Fuel Economy • Regular Flow'
      };
    }
    if (s <= 60) {
      return {
        label: '🟠 ARTERIAL HIGHWAY CRUISE (46-60 km/h)',
        badgeClass: 'bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300 border-orange-300 dark:border-orange-800',
        textColor: 'text-[#ea580c]',
        barColor: 'from-amber-400 via-orange-500 to-orange-600',
        statBg: 'bg-orange-50 dark:bg-orange-950/50 text-[#ea580c]',
        statusDesc: 'Express Lane • Clear Road Ahead'
      };
    }
    return {
      label: '🚨 OVERSPEED WARNING (>60 km/h)',
      badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-800 animate-pulse',
      textColor: 'text-rose-600 dark:text-rose-400',
      barColor: 'from-orange-500 via-rose-500 to-red-600',
      statBg: 'bg-rose-100 dark:bg-rose-950/60 text-rose-600',
      statusDesc: 'High Speed Trigger • Telemetry Alert Flagged'
    };
  };

  const speedStatus = getSpeedStatus(speed);
  const fillPercent = Math.min(100, Math.max(0, (speed / 80) * 100));

  const stops = [
    {
      id: 1,
      name: 'Sector 15 Stop',
      status: 'completed',
      detail: 'Completed • 8 Picked Up',
      time: '07:15 AM'
    },
    {
      id: 2,
      name: 'Sector 18 Stop',
      status: 'completed',
      detail: 'Completed • 12 Picked Up',
      time: '07:25 AM'
    },
    {
      id: 3,
      name: 'Sector 22 Circle',
      status: 'approaching',
      detail: 'Approaching • Next Stop',
      time: '07:35 AM'
    },
    {
      id: 4,
      name: 'Sector 29 Metro',
      status: 'pending',
      detail: 'Pending • 8 Students Waiting',
      time: '07:45 AM'
    },
    {
      id: 5,
      name: 'School Main Gate',
      status: 'pending',
      detail: 'Pending • Destination Terminal',
      time: '08:00 AM'
    }
  ];

  const handleCheckInStop = () => {
    if (activeStopIndex < stops.length - 1) {
      setActiveStopIndex(prev => prev + 1);
      Swal.fire({
        icon: 'success',
        title: 'Stop Check-in Recorded',
        text: `Bus checked into ${stops[activeStopIndex]?.name}. Next stop updated.`,
        timer: 1800,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Route Complete',
        text: 'All route stops have been successfully serviced.',
        timer: 1800,
        showConfirmButton: false
      });
    }
  };

  const toggleBroadcast = () => {
    const nextState = !broadcastActive;
    setBroadcastActive(nextState);
    Swal.fire({
      icon: nextState ? 'success' : 'warning',
      title: nextState ? 'GPS Broadcast Active' : 'GPS Broadcast Paused',
      text: nextState ? 'Broadcasting live coordinates to parents & admin.' : 'Live location broadcast paused.',
      timer: 1500,
      showConfirmButton: false
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in pb-4 w-full max-w-4xl mx-auto">
      
      {/* ===================== 1. TOP HEADER ===================== */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="font-serif font-black text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
          Live Location Tracking
        </h1>
        <button
          onClick={() => {
            Swal.fire({
              title: 'GPS Telemetry Status',
              text: `Signal: 5/5 Strong. Connected to Central Telematics Server. Broadcasting on ${routeName}.`,
              icon: 'info'
            });
          }}
          className="p-2 text-[#ea580c] hover:scale-110 active:scale-95 transition-transform"
          title="Telemetry Alert"
        >
          <Bell className="w-5 h-5 fill-[#ea580c]" />
        </button>
      </div>

      {/* ===================== 2. GPS BROADCAST ACTIVE (GREEN BORDERED CARD) ===================== */}
      <section className="border-2 border-emerald-500 rounded-3xl p-4 sm:p-5 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-emerald-700 dark:text-emerald-400 font-bold tracking-wide text-xs sm:text-sm uppercase font-sans">
              {broadcastActive ? 'GPS BROADCAST ACTIVE' : 'GPS BROADCAST STANDBY'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 truncate">
              {broadcastActive ? 'Transmitting live bus coordinates to parents & admin' : 'Broadcast is currently paused by driver'}
            </p>
          </div>
        </div>

        {/* Green iOS-Style Toggle Switch */}
        <button
          onClick={toggleBroadcast}
          className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 shrink-0 cursor-pointer ${
            broadcastActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
          }`}
          title="Toggle GPS Broadcast"
        >
          <div
            className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
              broadcastActive ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </section>

      {/* ===================== 3. MAP ROUTE RADAR GRID VIEW ===================== */}
      <section className="rounded-3xl border border-sky-100 dark:border-slate-800 bg-[#f0f9ff] dark:bg-slate-950 p-4 sm:p-6 relative overflow-hidden h-64 sm:h-72 shadow-inner flex flex-col justify-between">
        
        {/* Coordinate Grid Background Pattern */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #0284c7 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Top Left Signal Badge */}
        <div className="relative z-10 flex justify-between items-start">
          <div className="bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>GPS Signal: 5/5 Strong</span>
          </div>
        </div>

        {/* Curved Orange Trajectory Path with Bus Marker */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
            <path
              d="M 10 160 C 100 40, 200 180, 390 20"
              fill="none"
              stroke={speed > 60 ? "#ef4444" : speed > 0 ? "#ea580c" : "#94a3b8"}
              strokeWidth={speed > 40 ? "5.5" : "4.5"}
              strokeDasharray={speed > 0 ? "10 6" : "none"}
              strokeLinecap="round"
              className="transition-colors duration-300"
            />
          </svg>

          {/* Bus Marker along the path */}
          <div 
            className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto cursor-pointer transition-all duration-300"
            style={{
              transform: `translate(-50%, -50%) scale(${speed > 0 ? 1.05 : 1})`
            }}
          >
            <div className={`text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap mb-1 transition-colors ${
              speed > 60 ? 'bg-rose-600 animate-pulse' : speed > 0 ? 'bg-[#ea580c] animate-bounce' : 'bg-slate-700'
            }`}>
              {busNo.replace('Bus ', '')} • {speed} km/h
            </div>
            <div className={`w-14 h-14 rounded-full border-4 border-white dark:border-slate-800 shadow-xl flex items-center justify-center text-white relative transition-colors ${
              speed > 60 ? 'bg-rose-600 shadow-rose-500/40' : speed > 0 ? 'bg-[#ea580c] shadow-orange-500/30' : 'bg-slate-700'
            }`}>
              <Bus className="w-7 h-7 stroke-[2.2]" />
              {speed > 0 && (
                <span className={`absolute inset-0 rounded-full border-2 animate-ping pointer-events-none ${
                  speed > 60 ? 'border-rose-400 opacity-80' : 'border-orange-400 opacity-60'
                }`} />
              )}
            </div>
          </div>
        </div>

        {/* Bottom Right Accuracy Badge */}
        <div className="relative z-10 flex justify-end">
          <div className="bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow">
            Accurate to ±2m • Sector 22 Road
          </div>
        </div>
      </section>

      {/* ===================== 4. 3 TELEMETRY STAT CARDS ===================== */}
      <section className="grid grid-cols-3 gap-3">
        
        {/* Card 1: Current Speed */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-3.5 sm:p-4 border border-slate-100 dark:border-slate-800 shadow-sm text-center flex flex-col items-center justify-center transition-colors">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1.5 transition-colors ${speedStatus.statBg}`}>
            <Gauge className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className={`font-serif font-black text-lg sm:text-xl leading-none transition-colors ${speedStatus.textColor}`}>
            {speed} km/h
          </div>
          <span className="text-slate-400 text-[10px] font-bold tracking-wider uppercase mt-1">
            CURRENT SPEED
          </span>
        </div>

        {/* Card 2: Next Stop ETA */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-3.5 sm:p-4 border border-slate-100 dark:border-slate-800 shadow-sm text-center flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 flex items-center justify-center mb-1.5">
            <Clock className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="font-serif font-black text-lg sm:text-xl text-slate-900 dark:text-white leading-none">
            {calculatedEta}
          </div>
          <span className="text-slate-400 text-[10px] font-bold tracking-wider uppercase mt-1">
            NEXT STOP ETA
          </span>
        </div>

        {/* Card 3: Bus Battery */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-3.5 sm:p-4 border border-slate-100 dark:border-slate-800 shadow-sm text-center flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mb-1.5">
            <Battery className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="font-serif font-black text-lg sm:text-xl text-slate-900 dark:text-white leading-none">
            {batteryLevel}%
          </div>
          <span className="text-slate-400 text-[10px] font-bold tracking-wider uppercase mt-1">
            BUS BATTERY
          </span>
        </div>

      </section>

      {/* ===================== 5. SPEED TELEMETRY SIMULATOR SLIDER (HIGHLY VISUAL & REACTIVE) ===================== */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        
        {/* Header with Speed Value and Status Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Activity className={`w-4 h-4 ${speed > 0 ? 'text-[#ea580c] animate-pulse' : 'text-slate-400'}`} />
              <span className="font-serif font-black text-sm sm:text-base text-slate-900 dark:text-white">
                Simulate Bus Speed Telemetry
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {speedStatus.statusDesc}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className={`text-[10.5px] font-black uppercase px-2.5 py-1 rounded-full border ${speedStatus.badgeClass}`}>
              {speedStatus.label}
            </span>
            <div className="px-3 py-1 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono font-black text-sm sm:text-base shadow-sm">
              {speed} <span className="text-[10px] font-sans font-normal opacity-70">KM/H</span>
            </div>
          </div>
        </div>

        {/* Dynamic Glowing Filled Progress Track Bar */}
        <div className="space-y-2 pt-1">
          <div className="relative w-full py-2 select-none">
            
            {/* Background Track with Subtle Groove */}
            <div className="w-full h-4 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700 shadow-inner relative">
              
              {/* Dynamic Gradient Filled Bar that visibly GROWS as slider moves */}
              <div
                className={`h-full rounded-full transition-all duration-100 ease-out bg-gradient-to-r ${speedStatus.barColor}`}
                style={{ width: `${fillPercent}%` }}
              />
            </div>

            {/* Draggable Slider Thumb Indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-4 shadow-lg pointer-events-none transition-all duration-100 z-10 flex items-center justify-center"
              style={{
                left: `${fillPercent}%`,
                borderColor: speed > 60 ? '#f43f5e' : speed > 40 ? '#ea580c' : speed > 0 ? '#10b981' : '#94a3b8'
              }}
            >
              <div 
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: speed > 60 ? '#f43f5e' : speed > 40 ? '#ea580c' : speed > 0 ? '#10b981' : '#94a3b8'
                }}
              />
            </div>

            {/* Native Input Placed Exactly Over the Track */}
            <input
              type="range"
              min="0"
              max="80"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              title="Drag forward or backward to simulate bus speed"
            />

          </div>

          {/* Scale Ticks (0, 20, 40, 60, 80 km/h) */}
          <div className="flex justify-between items-center text-[10.5px] font-mono font-bold px-0.5 text-slate-400">
            <span className={speed >= 0 ? 'text-slate-800 dark:text-slate-100 font-black' : ''}>0 (Stop)</span>
            <span className={speed >= 20 ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''}>20 (School)</span>
            <span className={speed >= 40 ? 'text-amber-600 dark:text-amber-400 font-black' : ''}>40 (City Limit)</span>
            <span className={speed >= 60 ? 'text-orange-600 dark:text-orange-400 font-black' : ''}>60 (Highway)</span>
            <span className={speed >= 80 ? 'text-rose-600 dark:text-rose-400 font-black' : ''}>80 (Max)</span>
          </div>

          {/* 10-Segment LED Meter Gauge */}
          <div className="grid grid-cols-10 gap-1.5 pt-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((seg) => {
              const isActive = (speed / 80) * 10 >= seg;
              let segColor = 'bg-slate-200 dark:bg-slate-800';
              if (isActive) {
                if (seg <= 4) segColor = 'bg-emerald-500 shadow-sm shadow-emerald-500/50';
                else if (seg <= 7) segColor = 'bg-amber-500 shadow-sm shadow-amber-500/50';
                else segColor = 'bg-rose-500 shadow-sm shadow-rose-500/50 animate-pulse';
              }
              return (
                <div
                  key={seg}
                  className={`h-2 rounded-full transition-all duration-150 ${segColor}`}
                />
              );
            })}
          </div>

          {/* Quick Speed Preset Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Quick Presets:</span>
            {[
              { label: '🛑 0 Halt', val: 0 },
              { label: '🏫 20 School', val: 20 },
              { label: '🏙️ 40 City Limit', val: 40 },
              { label: '🛣️ 60 Highway', val: 60 },
              { label: '⚡ 80 Max', val: 80 }
            ].map((preset) => (
              <button
                key={preset.val}
                type="button"
                onClick={() => setSpeed(preset.val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  speed === preset.val
                    ? 'bg-[#ea580c] text-white shadow-sm scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

        </div>

      </section>

      {/* ===================== 6. ROUTE STOPS TIMELINE SECTION ===================== */}
      <section className="space-y-3">
        
        {/* Header */}
        <div className="flex items-center justify-between px-1">
          <h3 className="font-serif font-black text-lg sm:text-xl text-slate-900 dark:text-white">
            {routeName} Live Stops Timeline
          </h3>
          <button
            onClick={handleCheckInStop}
            className="text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm flex items-center gap-1 hover:underline cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Check-in Stop</span>
          </button>
        </div>

        {/* Timeline Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="space-y-6 relative">
            
            {/* Connecting Vertical Line */}
            <div className="absolute left-[13px] top-3 bottom-3 w-[2px] bg-slate-200 dark:bg-slate-800 pointer-events-none" />

            {stops.map((stop, idx) => {
              const isPast = idx < activeStopIndex;
              const isCurrent = idx === activeStopIndex;
              const isFuture = idx > activeStopIndex;

              return (
                <div key={stop.id} className="flex items-start justify-between gap-3 relative z-10">
                  <div className="flex items-start gap-3.5 min-w-0">
                    
                    {/* Status Circle Icon */}
                    {isPast ? (
                      <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-7 h-7 rounded-full bg-[#ea580c] text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/30 mt-0.5">
                        <Bus className="w-4 h-4 stroke-[2.2]" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                      </div>
                    )}

                    {/* Stop Info */}
                    <div className="min-w-0">
                      <h4 className="font-serif font-black text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                        {stop.name}
                      </h4>
                      <p className={`text-xs mt-0.5 ${
                        isPast 
                          ? 'text-emerald-600 dark:text-emerald-400 font-medium' 
                          : isCurrent 
                            ? 'text-[#ea580c] font-bold' 
                            : 'text-slate-400'
                      }`}>
                        {isCurrent ? 'Approaching • Next Stop' : isPast ? stop.detail : stop.detail}
                      </p>
                    </div>
                  </div>

                  {/* Stop Time */}
                  <div className="shrink-0 text-right">
                    <span className={`font-serif font-black text-xs sm:text-sm ${
                      isCurrent ? 'text-[#ea580c]' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {stop.time}
                    </span>
                  </div>
                </div>
              );
            })}

          </div>
        </div>

      </section>

    </div>
  );
}

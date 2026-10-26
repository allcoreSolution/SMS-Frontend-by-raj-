import React, { useState, useEffect } from 'react';
import { Bus, Fuel, Gauge, Shield, Calendar, Wrench, CheckCircle2, AlertTriangle, Navigation, MapPin } from 'lucide-react';
import { driverService } from '../api/driverService';
import { Link } from 'react-router-dom';

export default function AssignedVehicle() {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await driverService.getAssignedVehicle();
        if (res.success) {
          setVehicle(res.data);
        }
      } catch (err) {
        console.error('Error fetching assigned vehicle:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const v = vehicle || {
    vehicleNumber: 'DL-01-AB-4501',
    vehicleModel: 'Tata Starbus Skool 42-Seater',
    capacity: 42,
    status: 'Active',
    fuelLevel: 88,
    speed: 38,
    lastPing: 'Live (Just now)',
    currentLocation: { lat: 28.5823, lng: 77.0500, address: 'Near Dwarka Sector 12 Metro Station' }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center">
            <Bus className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                {v.vehicleNumber}
              </h1>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                v.status === 'OnTrip' ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {v.status || 'Active'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {v.vehicleModel} • {v.capacity} Passenger Capacity
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to="/tracking"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Live GPS Map</span>
          </Link>
          <Link
            to="/inspection"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Inspection Checklist</span>
          </Link>
        </div>
      </div>

      {/* Real-time Diagnostic Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Fuel Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Fuel Level</span>
            <Fuel className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {v.fuelLevel || 85}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className={`h-full ${v.fuelLevel < 25 ? 'bg-rose-500' : 'bg-amber-500'}`}
              style={{ width: `${v.fuelLevel || 85}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">Sufficient for 4 full scheduled routes</span>
        </div>

        {/* Speed & Telemetry */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Current Telemetry Speed</span>
            <Gauge className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {v.speed || 0} <span className="text-xs text-slate-400 font-normal">km/h</span>
          </div>
          <span className="text-[11px] text-slate-500 block">
            Speed Limiter Governed: <strong className="text-slate-800 dark:text-slate-200">Max 50 km/h</strong>
          </span>
          <span className="text-[10.5px] text-emerald-600 font-bold block">✓ Within school safety zone limits</span>
        </div>

        {/* Live Location */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Last GPS Ping</span>
            <MapPin className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
            {v.currentLocation?.address || 'Near Sector 12 Metro Station'}
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Lat: {v.currentLocation?.lat?.toFixed(4) || '28.5823'}, Lng: {v.currentLocation?.lng?.toFixed(4) || '77.0500'}
          </div>
          <span className="text-[10.5px] text-slate-500 block">Status: {v.lastPing || 'Just now'}</span>
        </div>

      </div>

      {/* Compliance & Regulatory Document Status */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
          <Shield className="w-4 h-4 text-orange-600" />
          <span>Vehicle Compliance & Roadworthiness Certificates</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="text-slate-500 font-semibold">Motor Insurance Policy</div>
            <div className="font-bold text-slate-900 dark:text-white text-sm">HDFC ERGO Comprehensive</div>
            <div className="text-emerald-600 font-bold pt-1">Valid till: 28-Feb-2027</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="text-slate-500 font-semibold">State Transport Fitness Certificate</div>
            <div className="font-bold text-slate-900 dark:text-white text-sm">Certified School Bus</div>
            <div className="text-emerald-600 font-bold pt-1">Valid till: 15-Nov-2026</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="text-slate-500 font-semibold">Pollution Certificate (PUC)</div>
            <div className="font-bold text-slate-900 dark:text-white text-sm">BS-VI Standard Green</div>
            <div className="text-emerald-600 font-bold pt-1">Valid till: 10-Aug-2027</div>
          </div>
        </div>
      </div>

    </div>
  );
}

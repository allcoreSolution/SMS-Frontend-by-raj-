import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  PhoneCall, 
  Clock, 
  MapPin, 
  Send, 
  CheckCircle2, 
  History, 
  FileText,
  AlertOctagon
} from 'lucide-react';
import { driverService } from '../api/driverService';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

export default function Incidents() {
  const { driver, vehicle, activeTrip } = useAuth();
  const driverPhoto = driver?.photo || driver?.avatar || localStorage.getItem('driver_custom_photo') || '';
  const driverName = driver?.name || 'Ramesh Kumar';
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [type, setType] = useState('Breakdown');
  const [severity, setSeverity] = useState('High');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Sector 12, Main Ring Road, near Metro station');

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const res = await driverService.getIncidents();
      if (res.success && res.data) {
        setIncidents(res.data);
      }
    } catch (err) {
      console.error('Error fetching incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      Swal.fire({ icon: 'warning', title: 'Description Required', text: 'Please enter incident details' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await driverService.reportIncident({
        type,
        severity,
        description,
        vehicleNumber: vehicle?.vehicleNumber || driver?.assignedBus || 'DL-01-AB-4501',
        routeName: activeTrip?.routeName || 'Assigned Route',
        location: {
          lat: vehicle?.currentLocation?.lat || 28.6139,
          lng: vehicle?.currentLocation?.lng || 77.2090,
          address
        }
      });

      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Incident Reported',
          text: 'Dispatch control center has been alerted immediately.',
          timer: 2500,
          showConfirmButton: false
        });
        setDescription('');
        fetchIncidents();
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Report Failed',
        text: err.response?.data?.message || 'Error logging incident report'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSOS = async () => {
    const { isConfirmed } = await Swal.fire({
      title: '🚨 CONFIRM EMERGENCY SOS?',
      text: 'This will broadcast an immediate critical siren alert to all school administrators with your live coordinates!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'YES, DISPATCH SOS ALERT',
      confirmButtonColor: '#e11d48',
      cancelButtonText: 'Cancel'
    });

    if (isConfirmed) {
      try {
        const res = await driverService.triggerSOS({
          vehicleNumber: vehicle?.vehicleNumber || driver?.assignedBus || 'DL-01-AB-4501',
          description: 'Emergency SOS button clicked by driver on route.'
        });
        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'SOS DISPATCHED!',
            text: 'Critical emergency alert received by dispatchers.',
            timer: 3000,
            showConfirmButton: false
          });
          fetchIncidents();
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'SOS Error', text: err.message });
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
            <span>Incident & Emergency Reporting</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Report bus breakdowns, delays, route obstructions or medical emergencies
          </p>
        </div>

        {/* Big SOS Button */}
        <button
          onClick={handleSOS}
          className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <ShieldAlert className="w-5 h-5 animate-pulse" />
          <span>Trigger 1-Click SOS</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-600" />
              <span>New Incident Report</span>
            </h2>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-xs">
              <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-orange-500">
                {driverPhoto ? (
                  <img src={driverPhoto} alt={driverName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center font-bold text-[9px] text-orange-600">
                    {driverName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-200">{driverName}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Incident Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                >
                  <option value="Breakdown">Mechanical Breakdown (Engine/Flat Tire)</option>
                  <option value="Delay">Severe Traffic / Road Delay</option>
                  <option value="Accident">Minor Traffic Collision</option>
                  <option value="RouteObstruction">Road Blockade / Waterlogging</option>
                  <option value="Medical">Student Medical Issue</option>
                  <option value="SOS">Emergency SOS</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Severity Level
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                >
                  <option value="Low">Low (Informational)</option>
                  <option value="Medium">Medium (10-15 Min Delay)</option>
                  <option value="High">High (Replacement Bus Needed)</option>
                  <option value="Critical">Critical (Immediate Assistance)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Approximate Current Location / Landmark
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Detailed Incident Description
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what happened, student status and what assistance you require..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting Report...' : 'Submit Incident to Transport Desk'}</span>
            </button>
          </form>
        </div>

        {/* Right Col: Emergency Contacts & Past Incident History */}
        <div className="space-y-5">
          
          {/* Quick Helpline Box */}
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-4 text-xs space-y-2.5">
            <h4 className="font-black text-rose-700 dark:text-rose-400 uppercase tracking-tight flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" />
              <span>Emergency Direct Helplines</span>
            </h4>
            <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between items-center py-1 border-b border-rose-200/50 dark:border-rose-900/30">
                <span>School Transport Manager:</span>
                <a href="tel:9811223399" className="font-bold font-mono text-rose-700 hover:underline">
                  +91 98112 23399
                </a>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-rose-200/50 dark:border-rose-900/30">
                <span>National Emergency:</span>
                <a href="tel:112" className="font-black font-mono text-rose-700 hover:underline">
                  112
                </a>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Traffic Police Helpline:</span>
                <a href="tel:1095" className="font-bold font-mono text-rose-700 hover:underline">
                  1095
                </a>
              </div>
            </div>
          </div>

          {/* Past Incidents List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-400 flex items-center gap-1.5">
              <History className="w-4 h-4 text-orange-600" />
              <span>Incident History</span>
            </h4>

            {loading ? (
              <div className="text-center py-4 text-xs text-slate-400">Loading...</div>
            ) : incidents.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-400">No reported incidents.</div>
            ) : (
              <div className="space-y-2.5">
                {incidents.slice(0, 5).map(inc => (
                  <div key={inc._id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-slate-900 dark:text-white">{inc.type}</span>
                      <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold uppercase ${
                        inc.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800 animate-pulse'
                      }`}>
                        {inc.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {inc.description}
                    </p>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {new Date(inc.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

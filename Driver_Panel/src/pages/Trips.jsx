import React, { useState, useEffect } from 'react';
import { Route as RouteIcon, Clock, Bus, CheckCircle2, Play, Square, Eye, Calendar, Users, AlertCircle } from 'lucide-react';
import { driverService } from '../api/driverService';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await driverService.getTrips();
      if (res.success && res.data) {
        setTrips(res.data);
      }
    } catch (err) {
      console.error('Error fetching driver trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const filteredTrips = trips.filter(t => {
    if (filter === 'All') return true;
    return t.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <RouteIcon className="w-6 h-6 text-orange-600" />
            <span>Driver Trips & Schedules</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track active runs, scheduled morning/afternoon circuits and completed logs
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          {['All', 'Active', 'Scheduled', 'Completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === f
                  ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <RouteIcon className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No {filter !== 'All' ? filter : ''} trips found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You can launch your scheduled morning circuit directly from the main dashboard.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-orange-600 text-white text-xs font-black uppercase rounded-xl"
          >
            Go to Dashboard & Start Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTrips.map(trip => (
            <div
              key={trip._id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 shadow-sm space-y-3 transition-all ${
                trip.status === 'Active'
                  ? 'border-orange-500 ring-2 ring-orange-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  trip.status === 'Active'
                    ? 'bg-orange-100 text-orange-800 animate-pulse'
                    : trip.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {trip.status}
                </span>
                <span className="font-mono text-xs font-bold text-slate-500">{trip.tripId}</span>
              </div>

              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  {trip.routeName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Trip Type: <strong className="text-slate-800 dark:text-slate-200">{trip.tripType}</strong> • Bus <strong className="font-mono">{trip.vehicleNumber}</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <div>
                  <span className="text-[11px] text-slate-500 block">Date & Start Time:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {trip.date} • {trip.startedAt ? new Date(trip.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Scheduled'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Student Roster:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {trip.students?.filter(s => s.status === 'Boarded').length || 0} / {trip.students?.length || 0} Boarded
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <Link
                  to={`/trips/${trip.tripId}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Trip Details</span>
                </Link>

                {trip.status === 'Active' ? (
                  <div className="flex gap-2">
                    <Link
                      to="/boarding"
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Boarding</span>
                    </Link>
                    <Link
                      to="/tracking"
                      className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Live GPS</span>
                    </Link>
                  </div>
                ) : (
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">
                    Distance: {trip.totalDistanceKm || 18} km
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

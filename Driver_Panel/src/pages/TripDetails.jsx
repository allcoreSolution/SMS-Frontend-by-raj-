import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Route as RouteIcon, MapPin, Users, Clock, Bus, CheckCircle2, ArrowLeft, Navigation, QrCode } from 'lucide-react';
import { driverService } from '../api/driverService';

export default function TripDetails() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await driverService.getTripDetails(tripId);
        if (res.success && res.data) {
          setTrip(res.data);
        }
      } catch (err) {
        console.error('Error fetching trip details:', err);
      } finally {
        setLoading(false);
      }
    };
    if (tripId) fetchDetails();
  }, [tripId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-12 space-y-3">
        <h3 className="font-bold text-sm">Trip not found</h3>
        <Link to="/trips" className="text-xs text-orange-600 hover:underline">
          Back to trips
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      {/* Back button */}
      <div>
        <Link to="/trips" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Trips</span>
        </Link>
      </div>

      {/* Main Trip Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                trip.status === 'Active' ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {trip.status}
              </span>
              <span className="font-mono text-xs text-slate-400 font-bold">{trip.tripId}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {trip.routeName}
            </h1>
          </div>

          <div className="flex gap-2">
            <Link
              to="/boarding"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Boarding Roster</span>
            </Link>
            <Link
              to="/tracking"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Live GPS Map</span>
            </Link>
          </div>
        </div>

        {/* 4 Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="text-slate-500 block text-[11px]">Assigned Bus:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{trip.vehicleNumber}</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="text-slate-500 block text-[11px]">Trip Type:</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{trip.tripType}</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="text-slate-500 block text-[11px]">Start Odometer:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{trip.startOdometer || 45280} km</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="text-slate-500 block text-[11px]">Started At:</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {trip.startedAt ? new Date(trip.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Scheduled'}
            </span>
          </div>
        </div>
      </div>

      {/* 2 Columns: Stops on this Trip and Students Onboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Stops sequence */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <h3 className="font-black text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-600" />
            <span>Scheduled Route Stops</span>
          </h3>

          <div className="space-y-2.5">
            {(trip.stops || []).map((stop, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-orange-600 text-white font-black text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{stop.stopName}</span>
                </div>
                <span className="font-mono text-slate-500">{stop.scheduledTime || stop.pickupTime || '07:30 AM'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Passenger roster on this trip */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <h3 className="font-black text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Assigned Students & Boarding Status</span>
          </h3>

          <div className="space-y-2.5">
            {(trip.students || []).map((stud, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{stud.studentName}</div>
                  <div className="text-[11px] text-slate-500">{stud.stopName}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  stud.status === 'Boarded'
                    ? 'bg-emerald-100 text-emerald-800'
                    : stud.status === 'Dropped'
                    ? 'bg-blue-100 text-blue-800'
                    : stud.status === 'Absent'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {stud.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

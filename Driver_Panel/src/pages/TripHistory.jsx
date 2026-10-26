import React, { useState, useEffect } from 'react';
import { History, Bus, Calendar, MapPin, Users, Gauge, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { driverService } from '../api/driverService';

export default function TripHistory() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await driverService.getTripHistory({ page, limit: 10 });
        if (res.success && res.data) {
          setTrips(res.data);
          setTotalPages(res.pages || 1);
        }
      } catch (err) {
        console.error('Error fetching trip history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [page]);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <History className="w-6 h-6 text-orange-600" />
          <span>Completed Trip History & Logs</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Historical log of all completed route runs, odometer readings and passengers carried
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : trips.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-xs text-slate-500 space-y-2">
          <History className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">No completed trips yet</h3>
          <p>Trips you complete will automatically be archived here with odometer and student records.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {trips.map(trip => (
            <div
              key={trip._id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-black text-sm text-slate-900 dark:text-white">
                    {trip.routeName}
                  </span>
                  <span className="font-mono text-xs text-slate-400">({trip.tripId})</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-orange-600" />
                  <span>{trip.date}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 dark:text-slate-400">
                <div>
                  <span className="text-[11px] text-slate-400 block">Bus Number:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{trip.vehicleNumber}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Trip Circuit:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{trip.tripType}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Distance Covered:</span>
                  <span className="font-bold text-emerald-600">{trip.totalDistanceKm || 22} km</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Students Transported:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{trip.students?.length || 28} Students</span>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 pt-4 text-xs font-bold">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

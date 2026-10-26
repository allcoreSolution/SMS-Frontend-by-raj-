import React, { useState, useEffect } from 'react';
import { MapPin, Route as RouteIcon, Clock, Users, ArrowRight, Bus, Play } from 'lucide-react';
import { driverService } from '../api/driverService';
import { useNavigate } from 'react-router-dom';

export default function AssignedRoutes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await driverService.getAssignedRoutes();
        if (res.success && res.data) {
          setRoutes(res.data);
          if (res.data.length > 0) {
            setSelectedRoute(res.data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching routes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <RouteIcon className="w-6 h-6 text-orange-600" />
          <span>Assigned Transport Routes & Stops</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Authorized daily student pickup and drop circuits with stop schedules
        </p>
      </div>

      {/* Route Select Tabs if multiple */}
      <div className="flex flex-wrap gap-2">
        {routes.map(r => (
          <button
            key={r._id}
            onClick={() => setSelectedRoute(r)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRoute?._id === r._id
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-50'
            }`}
          >
            {r.routeName}
          </button>
        ))}
      </div>

      {selectedRoute && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Col: Route Summary Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-widest bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400 px-2 py-0.5 rounded">
                Active Circuit
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                {selectedRoute.routeName}
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <span className="text-slate-500 font-semibold block">Origin Terminal:</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedRoute.startPoint}</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <span className="text-slate-500 font-semibold block">Destination Terminal:</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedRoute.endPoint}</span>
              </div>

              <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-slate-500 font-semibold">Total Stops:</span>
                <span className="font-bold">{selectedRoute.stops?.length || 4} Stops</span>
              </div>

              <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-slate-500 font-semibold">Monthly Transport Fare:</span>
                <span className="font-bold text-emerald-600 font-mono">₹{selectedRoute.fare || 2400}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-orange-600/30 cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Launch Trip with this Route</span>
            </button>
          </div>

          {/* Right 2 Cols: Stops Sequence Timeline */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span>Stop Sequence & Passenger Pickup Schedule</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-orange-300 dark:before:bg-orange-800">
              {(selectedRoute.stops || []).map((stop, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -left-6 top-1.5 w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-black flex items-center justify-center shadow-md">
                    {index + 1}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-orange-500 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="font-black text-sm text-slate-900 dark:text-white">
                        {stop.stopName}
                      </span>
                      <div className="flex items-center gap-3 text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
                        <span>Pickup: {stop.pickupTime || stop.stopTime}</span>
                        <span>•</span>
                        <span>Drop: {stop.dropTime || '02:30 PM'}</span>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                      <span>Coordinates: <strong className="font-mono text-slate-700 dark:text-slate-300">{stop.lat?.toFixed(4)}, {stop.lng?.toFixed(4)}</strong></span>
                      <span className="font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                        {stop.studentsCount || (index === 0 ? 8 : index === 1 ? 12 : 14)} Students
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

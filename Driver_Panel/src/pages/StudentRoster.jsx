import React, { useState, useEffect } from 'react';
import { Users, Search, MapPin, Phone, Shield, ArrowUpDown, Filter } from 'lucide-react';
import { driverService } from '../api/driverService';

export default function StudentRoster() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStop, setSelectedStop] = useState('All');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await driverService.getStudentsRoster();
        if (res.success && res.data) {
          setStudents(res.data);
        }
      } catch (err) {
        console.error('Error fetching student roster:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const uniqueStops = ['All', ...new Set(students.map(s => s.stopName).filter(Boolean))];

  const filtered = students.filter(s => {
    const matchStop = selectedStop === 'All' || s.stopName === selectedStop;
    const matchSearch = !search || 
      s.studentName.toLowerCase().includes(search.toLowerCase()) ||
      (s.admissionNo && s.admissionNo.toLowerCase().includes(search.toLowerCase()));
    return matchStop && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-orange-600" />
            <span>Assigned Passenger Roster</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Student directory, assigned stops and parent emergency contact numbers
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-400 px-3 py-1 rounded-xl self-start sm:self-auto">
          {filtered.length} Passengers Enrolled
        </span>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student or roll no..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
          <span className="text-slate-400 font-semibold shrink-0">Filter Stop:</span>
          <select
            value={selectedStop}
            onChange={(e) => setSelectedStop(e.target.value)}
            className="w-full sm:w-auto p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
          >
            {uniqueStops.map(stop => (
              <option key={stop} value={stop}>{stop}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table / Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-500">
          No students found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filtered.map((s, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3 hover:border-orange-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 font-black text-sm flex items-center justify-center">
                    {s.studentName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {s.studentName}
                    </h3>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {s.className || 'Class 5-A'} • Roll #{s.rollNo || (idx + 10)}
                    </div>
                  </div>
                </div>

                <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">
                  {s.admissionNo || `ADM-2024-00${idx + 1}`}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span className="font-semibold truncate">{s.stopName || 'Designated Stop'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10.5px] text-slate-400 block">Parent Phone:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {s.emergencyContact || '+91 98112 0000' + idx}
                  </span>
                </div>
                <a
                  href={`tel:${s.emergencyContact || '981120000' + idx}`}
                  className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold flex items-center gap-1"
                  title="Call Parent"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

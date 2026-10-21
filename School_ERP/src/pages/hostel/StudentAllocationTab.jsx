import React, { useState, useMemo } from 'react';
import { 
  UserCheck, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  LogOut, 
  Building, 
  DoorOpen, 
  Bed, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

export default function StudentAllocationTab({
  allocations = [],
  hostels = [],
  onOpenAllocate,
  onDeallocate,
  onDeleteAllocation,
  loading = false
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [hostelFilter, setHostelFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filtered allocations
  const filteredAllocations = useMemo(() => {
    return allocations.filter((item) => {
      // Search
      const s = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        item.studentName?.toLowerCase().includes(s) ||
        item.admissionNo?.toLowerCase().includes(s) ||
        item.roomNumber?.toLowerCase().includes(s) ||
        item.hostelName?.toLowerCase().includes(s);

      // Hostel
      const matchHostel = hostelFilter === 'All' || item.hostelName === hostelFilter;

      // Status
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;

      return matchSearch && matchHostel && matchStatus;
    });
  }, [allocations, searchTerm, hostelFilter, statusFilter]);

  const activeCount = allocations.filter(a => a.status === 'Allocated').length;
  const vacatedCount = allocations.filter(a => a.status === 'Vacated').length;

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <span>Student Bed Allocations</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {allocations.length} Records
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage student room check-ins, bed assignments, and deallocations
          </p>
        </div>

        <button
          onClick={onOpenAllocate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Allocate Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative min-w-[240px] flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, admission no, room..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
            />
          </div>

          {/* Hostel Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={hostelFilter}
              onChange={(e) => setHostelFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-blue-600 transition-all"
            >
              <option value="All">All Hostels</option>
              {hostels.map((h) => (
                <option key={h._id} value={h.hostelName}>
                  {h.hostelName}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-blue-600 transition-all"
          >
            <option value="All">All Statuses ({allocations.length})</option>
            <option value="Allocated">Currently Allocated ({activeCount})</option>
            <option value="Vacated">Vacated History ({vacatedCount})</option>
          </select>
        </div>

        {/* Quick status counters */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
            {activeCount} Active
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold border border-slate-200">
            {vacatedCount} Vacated
          </span>
        </div>
      </div>

      {/* Allocations Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading live hostel allocations...
          </div>
        ) : filteredAllocations.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No Student Allocations Found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm || hostelFilter !== 'All' || statusFilter !== 'All'
                ? 'Try adjusting your search query or filters to find allocation records.'
                : 'Click "+ Allocate Student" to assign a resident student to a hostel room and bed.'}
            </p>
            <button
              onClick={onOpenAllocate}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              + Allocate First Student
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Hostel Wing</th>
                  <th className="py-3.5 px-4">Room & Bed</th>
                  <th className="py-3.5 px-4">Monthly Fee</th>
                  <th className="py-3.5 px-4">Dates</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAllocations.map((alloc) => {
                  const isAllocated = alloc.status === 'Allocated';

                  return (
                    <tr key={alloc._id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Student info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm shrink-0">
                            {alloc.studentName?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{alloc.studentName}</p>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                              <span>{alloc.admissionNo || 'ID: —'}</span>
                              <span>•</span>
                              <span>{alloc.className || 'Resident'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Hostel */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-semibold text-slate-700">{alloc.hostelName}</span>
                        </div>
                      </td>

                      {/* Room & Bed */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <DoorOpen className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Room {alloc.roomNumber}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-indigo-600 font-semibold">
                            <Bed className="w-3 h-3" />
                            <span>{alloc.bedNumber || 'Bed 1'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Monthly Fee */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 text-sm">
                          ₹{Number(alloc.monthlyFee || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 block">/ month</span>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4 text-[11px] text-slate-600">
                        <div className="flex items-center gap-1 text-slate-700">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>From: {alloc.allocationDate ? new Date(alloc.allocationDate).toLocaleDateString() : '—'}</span>
                        </div>
                        {alloc.vacateDate && (
                          <div className="flex items-center gap-1 text-slate-400 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>Vacated: {new Date(alloc.vacateDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isAllocated
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isAllocated ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                            }`}
                          />
                          {alloc.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isAllocated && (
                            <button
                              onClick={() => onDeallocate(alloc)}
                              title="Vacate Bed / Checkout"
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              <span>Vacate</span>
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteAllocation(alloc)}
                            title="Delete Record"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

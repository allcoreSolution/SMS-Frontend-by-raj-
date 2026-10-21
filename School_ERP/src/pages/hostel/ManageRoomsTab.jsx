import React, { useState, useMemo } from 'react';
import { 
  DoorOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Bed, 
  Users, 
  Building2, 
  CheckCircle, 
  Layers, 
  DollarSign, 
  UserPlus, 
  Grid, 
  List, 
  LogOut 
} from 'lucide-react';

export default function ManageRoomsTab({
  rooms = [],
  hostels = [],
  roomTypes = [],
  onOpenAddRoom,
  onOpenEditRoom,
  onDeleteRoom,
  onOpenAllocateForRoom,
  onDeallocateStudent,
  loading = false
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [hostelFilter, setHostelFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const s = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        room.roomNumber?.toLowerCase().includes(s) ||
        room.hostelName?.toLowerCase().includes(s) ||
        room.roomTypeName?.toLowerCase().includes(s);

      const matchHostel = hostelFilter === 'All' || room.hostelName === hostelFilter;
      const matchType = typeFilter === 'All' || room.roomTypeName === typeFilter;

      const occ = room.occupiedCount != null ? room.occupiedCount : (room.allocatedStudents?.length || 0);
      const cap = room.bedCapacity || 4;
      let calculatedStatus = 'Available';
      if (occ >= cap) calculatedStatus = 'Full';
      else if (occ > 0) calculatedStatus = 'Partially Occupied';

      const matchStatus =
        statusFilter === 'All' ||
        room.status === statusFilter ||
        calculatedStatus === statusFilter;

      return matchSearch && matchHostel && matchType && matchStatus;
    });
  }, [rooms, searchTerm, hostelFilter, typeFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <DoorOpen className="w-5 h-5 text-indigo-600" />
            <span>Manage Hostel Rooms</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {rooms.length} Rooms
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure room capacities, assign room types, bed fares, and monitor live resident status
          </p>
        </div>

        <button
          onClick={onOpenAddRoom}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Room</span>
        </button>
      </div>

      {/* Filter and View Mode Controls */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search room no, hostel..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
            />
          </div>

          {/* Filter Hostel */}
          <select
            value={hostelFilter}
            onChange={(e) => setHostelFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-600 transition-all"
          >
            <option value="All">All Hostels</option>
            {hostels.map((h) => (
              <option key={h._id} value={h.hostelName}>
                {h.hostelName}
              </option>
            ))}
          </select>

          {/* Filter Room Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-600 transition-all"
          >
            <option value="All">All Room Types</option>
            {roomTypes.map((rt) => (
              <option key={rt._id} value={rt.roomType}>
                {rt.roomType}
              </option>
            ))}
          </select>

          {/* Filter Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-600 transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available (Vacant)</option>
            <option value="Partially Occupied">Partially Occupied</option>
            <option value="Full">Full</option>
          </select>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading rooms catalog...
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          <DoorOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-700">No Rooms Found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm || hostelFilter !== 'All' || typeFilter !== 'All'
              ? 'No rooms match your filter parameters.'
              : 'Add your first room by clicking "+ Add New Room" above.'}
          </p>
          <button
            onClick={onOpenAddRoom}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            + Add First Room
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRooms.map((room) => {
            const occ = room.occupiedCount != null ? room.occupiedCount : (room.allocatedStudents?.length || 0);
            const cap = room.bedCapacity || 4;
            const isFull = occ >= cap;
            const isVacant = occ === 0;
            const availableSlots = Math.max(0, cap - occ);

            return (
              <div
                key={room._id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card top */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-slate-900">Room {room.roomNumber}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isFull
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : isVacant
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {isFull ? 'Full' : isVacant ? 'Vacant' : 'Partially Occupied'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{room.hostelName}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenEditRoom(room)}
                        title="Edit Room"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteRoom(room)}
                        title="Delete Room"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Room Type & Pricing */}
                  <div className="mt-3.5 p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Type</span>
                      <span className="text-xs font-bold text-slate-700">{room.roomTypeName || 'Standard'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Rent / Bed</span>
                      <span className="text-xs font-extrabold text-indigo-600">₹{Number(room.costPerBed || 0).toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/mo</span></span>
                    </div>
                  </div>

                  {/* Bed Capacity Indicator */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-600 flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-slate-400" />
                        Bed Slots:
                      </span>
                      <span className="text-slate-900 font-bold">
                        {occ} / {cap} Occupied
                      </span>
                    </div>
                    {/* Visual Bed Slot Dots */}
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: cap }).map((_, idx) => {
                        const isSlotOccupied = idx < occ;
                        return (
                          <div
                            key={idx}
                            title={isSlotOccupied ? `Bed ${idx + 1} Occupied` : `Bed ${idx + 1} Free`}
                            className={`flex-1 h-2 rounded-full transition-all ${
                              isSlotOccupied
                                ? 'bg-indigo-600 shadow-sm'
                                : 'bg-slate-200'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Resident Students in this room */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Resident Boarders ({occ}):
                    </span>
                    {room.allocatedStudents && room.allocatedStudents.length > 0 ? (
                      <div className="space-y-1.5">
                        {room.allocatedStudents.map((st) => (
                          <div
                            key={st._id || st}
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
                                {st.firstName?.charAt(0) || 'S'}
                              </div>
                              <span className="font-semibold text-slate-800 truncate">
                                {st.firstName ? `${st.firstName} ${st.lastName || ''}` : 'Resident Student'}
                              </span>
                            </div>
                            <button
                              onClick={() => onDeallocateStudent(room, st)}
                              title="Checkout/Vacate"
                              className="text-slate-400 hover:text-amber-600 p-0.5 rounded transition-colors"
                            >
                              <LogOut className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">No students allocated yet.</p>
                    )}
                  </div>
                </div>

                {/* Card footer action */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {availableSlots} bed(s) available
                  </span>
                  {!isFull ? (
                    <button
                      onClick={() => onOpenAllocateForRoom(room)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Allocate Bed</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-400">Capacity Full</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Room No</th>
                  <th className="py-3.5 px-4">Hostel Wing</th>
                  <th className="py-3.5 px-4">Room Type</th>
                  <th className="py-3.5 px-4">Capacity & Occupancy</th>
                  <th className="py-3.5 px-4">Cost Per Bed</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRooms.map((room) => {
                  const occ = room.occupiedCount != null ? room.occupiedCount : (room.allocatedStudents?.length || 0);
                  const cap = room.bedCapacity || 4;
                  const isFull = occ >= cap;
                  const isVacant = occ === 0;

                  return (
                    <tr key={room._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        Room {room.roomNumber}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {room.hostelName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {room.roomTypeName || 'Standard'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {occ} / {cap} Beds
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ₹{Number(room.costPerBed || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isFull
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : isVacant
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {isFull ? 'Full' : isVacant ? 'Vacant' : 'Partially Occupied'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isFull && (
                            <button
                              onClick={() => onOpenAllocateForRoom(room)}
                              title="Allocate Bed"
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <UserPlus className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onOpenEditRoom(room)}
                            title="Edit Room"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteRoom(room)}
                            title="Delete Room"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
        </div>
      )}
    </div>
  );
}

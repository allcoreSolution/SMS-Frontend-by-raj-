import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  DoorOpen, 
  Bed, 
  CheckCircle2, 
  UserCheck, 
  Plus, 
  ArrowRight, 
  Users, 
  DollarSign, 
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const PIE_COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export default function HostelOverviewTab({ 
  stats = {}, 
  rooms = [], 
  hostels = [], 
  onOpenAllocate, 
  onOpenAddRoom, 
  onOpenAddHostel, 
  onOpenAddRoomType,
  onDeallocate
}) {
  const navigate = useNavigate();

  const totalHostels = stats.totalHostels || hostels.length || 0;
  const totalRooms = stats.totalRooms || rooms.length || 0;
  const totalCapacity = stats.totalCapacity || 0;
  const occupiedBeds = stats.occupiedBeds || 0;
  const availableBeds = stats.availableBeds || 0;
  const occupancyRate = stats.occupancyRate || 0;
  const hostelOccupancy = stats.hostelOccupancy || [];
  const roomTypeDistribution = stats.roomTypeDistribution || [];
  const recentAllocations = stats.recentAllocations || [];

  return (
    <div className="space-y-6">
      {/* 1. TOP KPI STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Hostels */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-5 text-white shadow-lg shadow-blue-500/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-blue-100/90">Hostel Buildings</p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight">{totalHostels}</h3>
              <p className="mt-1 text-xs text-blue-100">
                Residential Blocks Active
              </p>
            </div>
            <div className="rounded-xl bg-white/15 p-3 backdrop-blur-sm">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-blue-100">
            <span>Boys & Girls Wings</span>
            <button 
              onClick={() => navigate('/hostel/manage-hostels')}
              className="flex items-center gap-1 font-semibold hover:text-white transition-colors cursor-pointer"
            >
              Manage <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 2: Rooms */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-800 p-5 text-white shadow-lg shadow-purple-500/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-purple-100/90">Total Rooms</p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight">{totalRooms}</h3>
              <p className="mt-1 text-xs text-purple-100">
                Configured Across Blocks
              </p>
            </div>
            <div className="rounded-xl bg-white/15 p-3 backdrop-blur-sm">
              <DoorOpen className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-purple-100">
            <span>AC & Non-AC Types</span>
            <button 
              onClick={() => navigate('/hostel/manage-rooms')}
              className="flex items-center gap-1 font-semibold hover:text-white transition-colors cursor-pointer"
            >
              View Rooms <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Bed Occupancy */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-teal-800 p-5 text-white shadow-lg shadow-emerald-500/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-100/90">Occupied Beds</p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight">
                {occupiedBeds} <span className="text-lg font-normal text-emerald-200">/ {totalCapacity}</span>
              </h3>
              <p className="mt-1 text-xs text-emerald-100">
                {occupancyRate}% Overall Occupancy
              </p>
            </div>
            <div className="rounded-xl bg-white/15 p-3 backdrop-blur-sm">
              <Bed className="w-6 h-6 text-white" />
            </div>
          </div>
          {/* Mini progress bar */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, occupancyRate)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 4: Available Beds */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-orange-700 p-5 text-white shadow-lg shadow-amber-500/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-amber-100/90">Available Beds</p>
              <h3 className="mt-2 text-3xl font-extrabold tracking-tight">{availableBeds}</h3>
              <p className="mt-1 text-xs text-amber-100">
                Ready For Allocation
              </p>
            </div>
            <div className="rounded-xl bg-white/15 p-3 backdrop-blur-sm">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-amber-100">
            <span>Instant Boarding</span>
            <button 
              onClick={onOpenAllocate}
              className="flex items-center gap-1 font-semibold hover:text-white transition-colors cursor-pointer"
            >
              Allocate <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. QUICK ACTIONS BAR */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quick Actions:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAllocate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Allocate Student</span>
          </button>
          <button
            onClick={onOpenAddRoom}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer"
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>+ Add Room</span>
          </button>
          <button
            onClick={onOpenAddHostel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>+ Add Hostel</span>
          </button>
          <button
            onClick={onOpenAddRoomType}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>+ New Room Type</span>
          </button>
        </div>
      </div>

      {/* 3. CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hostel-wise occupancy bar chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Hostel Bed Capacity vs Occupancy</h4>
              <p className="text-xs text-slate-500">Live breakdown of bed utilization across all residential wings</p>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Live MongoDB Data
            </span>
          </div>

          <div className="h-72 w-full">
            {hostelOccupancy.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hostelOccupancy} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    interval={0}
                    angle={-10}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderRadius: '12px', 
                      border: 'none', 
                      color: '#fff',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="capacity" name="Total Capacity" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="occupied" name="Occupied Beds" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No hostel occupancy data available
              </div>
            )}
          </div>
        </div>

        {/* Room Type Distribution Donut Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col">
          <div className="mb-2">
            <h4 className="text-sm font-bold text-slate-800">Room Types Distribution</h4>
            <p className="text-xs text-slate-500">Proportion of AC, Non-AC & Dormitories</p>
          </div>

          <div className="h-56 w-full flex-1">
            {roomTypeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roomTypeDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {roomTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderRadius: '12px', 
                      border: 'none', 
                      color: '#fff',
                      fontSize: '12px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No room types data
              </div>
            )}
          </div>

          {/* Custom legend */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
            {roomTypeDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 truncate">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} 
                />
                <span className="text-slate-600 truncate">{item.name}</span>
                <span className="font-bold text-slate-900 ml-auto">({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. RECENT BED ALLOCATIONS & ROOM OCCUPANCY PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Allocations */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Recent Student Allocations</h4>
              <p className="text-xs text-slate-500">Live resident boarders enrolled in school hostels</p>
            </div>
            <button
              onClick={() => navigate('/hostel/student-allocation')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentAllocations.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <UserCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-600">No active allocations yet</p>
              <button
                onClick={onOpenAllocate}
                className="mt-3 text-xs font-semibold px-3 py-1.5 bg-blue-600 text-white rounded-lg shadow-sm"
              >
                Allocate First Student
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Student</th>
                    <th className="pb-3">Hostel & Room</th>
                    <th className="pb-3">Bed</th>
                    <th className="pb-3">Monthly Rent</th>
                    <th className="pb-3">Allocated On</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentAllocations.slice(0, 5).map((alloc) => (
                    <tr key={alloc._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                            {alloc.studentName?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{alloc.studentName}</p>
                            <p className="text-[11px] text-slate-400">{alloc.admissionNo || alloc.className || 'Resident'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="font-semibold text-slate-700 block truncate max-w-[160px]">{alloc.hostelName}</span>
                        <span className="text-[11px] text-indigo-600 font-medium">Room {alloc.roomNumber}</span>
                      </td>
                      <td className="py-3 font-semibold text-slate-700">
                        {alloc.bedNumber || 'Bed 1'}
                      </td>
                      <td className="py-3 font-bold text-slate-900">
                        ₹{Number(alloc.monthlyFee || 0).toLocaleString()}
                      </td>
                      <td className="py-3 text-slate-500">
                        {alloc.allocationDate ? new Date(alloc.allocationDate).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onDeallocate(alloc)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                        >
                          Vacate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Live Rooms Quick Grid */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Rooms Status Snapshot</h4>
              <p className="text-xs text-slate-500">Quick room occupancy indicators</p>
            </div>
            <button
              onClick={() => navigate('/hostel/manage-rooms')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              All Rooms <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[320px] pr-1">
            {rooms.slice(0, 6).map((room) => {
              const occ = room.occupiedCount != null ? room.occupiedCount : (room.allocatedStudents?.length || 0);
              const cap = room.bedCapacity || 4;
              const isFull = occ >= cap;
              const isVacant = occ === 0;

              return (
                <div 
                  key={room._id}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-xs">Room {room.roomNumber}</span>
                      <span className="text-[10px] text-slate-500 truncate max-w-[120px]">({room.hostelName})</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{room.roomTypeName || 'Standard'}</span>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isFull 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                        : isVacant 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {occ} / {cap} Beds
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      ₹{room.costPerBed}/mo
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  Edit3, 
  Trash2, 
  User, 
  Phone, 
  MapPin, 
  DoorOpen, 
  Bed, 
  Search, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function ManageHostelsTab({
  hostels = [],
  onOpenAddHostel,
  onOpenEditHostel,
  onDeleteHostel,
  loading = false
}) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHostels = hostels.filter((h) => {
    const s = searchTerm.toLowerCase();
    return (
      !searchTerm ||
      h.hostelName?.toLowerCase().includes(s) ||
      h.wardenName?.toLowerCase().includes(s) ||
      h.address?.toLowerCase().includes(s)
    );
  });

  const getTypeBadge = (type) => {
    switch (type) {
      case 'Boys':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Girls':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'Combined':
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>Hostel Buildings & Residential Wings</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {hostels.length} Buildings
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Supervise residential blocks, appointed wardens, building capacities and infrastructure
          </p>
        </div>

        <button
          onClick={onOpenAddHostel}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Hostel</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center justify-between gap-3">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search hostel name, warden, address..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredHostels.length} of {hostels.length}
        </span>
      </div>

      {/* Hostels Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading hostel buildings...
        </div>
      ) : filteredHostels.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-700">No Hostels Found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? 'No hostel building matches your search query.'
              : 'Add your first hostel building like "Tagore Boys Hostel".'}
          </p>
          <button
            onClick={onOpenAddHostel}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            + Add First Hostel
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredHostels.map((h) => {
            const cap = h.totalCapacity || h.intakeCapacity || 0;
            const occ = h.occupiedBeds || 0;
            const rate = cap > 0 ? Math.round((occ / cap) * 100) : 0;

            return (
              <div
                key={h._id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/15 shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900 leading-tight">
                          {h.hostelName}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTypeBadge(h.type)}`}>
                            {h.type} Hostel
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {h.status || 'Active'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenEditHostel(h)}
                        title="Edit Hostel"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteHostel(h)}
                        title="Delete Hostel"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Warden & Location */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Warden In-Charge
                      </span>
                      <p className="font-bold text-slate-800 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{h.wardenName || 'Unassigned'}</span>
                      </p>
                      {h.wardenContact && (
                        <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{h.wardenContact}</span>
                        </p>
                      )}
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Campus Location
                      </span>
                      <p className="text-slate-700 flex items-start gap-1.5 line-clamp-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span>{h.address || 'Campus Residential Zone'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Description if present */}
                  {h.description && (
                    <p className="mt-3 text-xs text-slate-500 line-clamp-2 italic">
                      "{h.description}"
                    </p>
                  )}

                  {/* Occupancy Meter */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-600">Bed Occupancy Meter:</span>
                      <span className="text-slate-900 font-bold">
                        {occ} / {cap} Beds ({rate}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, rate)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Metrics & Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-bold text-slate-700">
                      <DoorOpen className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{h.roomsCount || 0} Rooms</span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-600">
                      <Bed className="w-3.5 h-3.5" />
                      <span>{Math.max(0, cap - occ)} Available</span>
                    </span>
                  </div>

                  <button
                    onClick={() => navigate('/hostel/manage-rooms')}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    <span>View Rooms</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

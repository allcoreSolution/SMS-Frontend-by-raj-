import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  DollarSign, 
  DoorOpen, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Search 
} from 'lucide-react';

export default function RoomTypesTab({
  roomTypes = [],
  onOpenAddType,
  onOpenEditType,
  onDeleteType,
  loading = false
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTypes = roomTypes.filter((rt) => {
    const s = searchTerm.toLowerCase();
    return (
      !searchTerm ||
      rt.roomType?.toLowerCase().includes(s) ||
      rt.description?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>Room Types & Accommodation Catalog</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {roomTypes.length} Categories
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure room classifications, bed tariffs, and amenity descriptions
          </p>
        </div>

        <button
          onClick={onOpenAddType}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Room Type</span>
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
            placeholder="Search room type, amenities..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredTypes.length} of {roomTypes.length}
        </span>
      </div>

      {/* Grid of Cards */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading room types...
        </div>
      ) : filteredTypes.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-700">No Room Types Found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? 'No room type matches your search query.'
              : 'Add your first room type like "Deluxe AC" or "Standard Non-AC".'}
          </p>
          <button
            onClick={onOpenAddType}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            + Create First Room Type
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTypes.map((rt) => (
            <div
              key={rt._id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{rt.roomType}</h4>
                      <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {rt.status || 'Active'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenEditType(rt)}
                      title="Edit Room Type"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteType(rt)}
                      title="Delete Room Type"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Tariff */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-slate-500">Monthly Fare</span>
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900">
                      ₹{Number(rt.costPerBed || 0).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-1">/ bed</span>
                  </div>
                </div>

                {/* Description & Features */}
                <div className="mt-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Amenities & Notes
                  </span>
                  <p className="text-xs text-slate-600 line-clamp-3">
                    {rt.description || 'Standard boarding amenities with study furniture and storage.'}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 font-semibold text-slate-500">
                  <DoorOpen className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{rt.roomsCount || 0} Rooms Configured</span>
                </span>
                <span className="text-[11px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
                  Standard Rate
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

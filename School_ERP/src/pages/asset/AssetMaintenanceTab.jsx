import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Plus,
  CheckCircle2,
  Clock,
  IndianRupee,
  Search,
  AlertTriangle,
  FileText
} from 'lucide-react';

export default function AssetMaintenanceTab({
  maintenances = [],
  onOpenAddMaintenance,
  onOpenCompleteMaintenance
}) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const inProgressCount = maintenances.filter((m) => m.status === 'In Progress').length;
  const completedCount = maintenances.filter((m) => m.status === 'Completed').length;
  const totalCost = maintenances.reduce((sum, m) => sum + (m.cost || 0), 0);

  const filteredMaintenances = useMemo(() => {
    return maintenances.filter((m) => {
      const matchStatus =
        filterStatus === 'All' ||
        (filterStatus === 'In Progress' && m.status === 'In Progress') ||
        (filterStatus === 'Completed' && m.status === 'Completed');

      const matchSearch =
        !searchTerm ||
        m.assetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.assetCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.technician?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.issueDescription?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [maintenances, filterStatus, searchTerm]);

  return (
    <div className="space-y-6">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80 border-t-4 border-t-amber-500 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Under Service</p>
            <h3 className="text-2xl font-extrabold text-amber-600">{inProgressCount} Assets</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Currently in maintenance / repair</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80 border-t-4 border-t-emerald-600 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Completed Services</p>
            <h3 className="text-2xl font-extrabold text-emerald-600">{completedCount} Work Orders</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Fully resolved and certified</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80 border-t-4 border-t-indigo-600 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Total Maintenance Spend</p>
            <h3 className="text-2xl font-extrabold text-indigo-600">{formatCurrency(totalCost)}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Cumulative upkeep expenditures</p>
          </div>
        </div>
      </div>

      {/* 2. Main Maintenance Logs Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-500" />
              Maintenance & Repair Logbook
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Preventative maintenance, routine services, and equipment repair history
            </p>
          </div>

          <button
            onClick={onOpenAddMaintenance}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" /> Log / Schedule Service
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-xl">
            <button
              onClick={() => setFilterStatus('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === 'All' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Logs ({maintenances.length})
            </button>
            <button
              onClick={() => setFilterStatus('In Progress')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === 'In Progress' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              onClick={() => setFilterStatus('Completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === 'Completed' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search equipment, vendor, issue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Asset Code & Name</th>
                <th className="py-3 px-4">Service Type</th>
                <th className="py-3 px-4">Issue Description</th>
                <th className="py-3 px-4">Vendor / Technician</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Cost (₹)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredMaintenances.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Wrench className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No maintenance records found</p>
                  </td>
                </tr>
              ) : (
                filteredMaintenances.map((mnt) => {
                  const isInProgress = mnt.status === 'In Progress';

                  return (
                    <tr key={mnt._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                            {mnt.assetCode}
                          </span>
                          <span className="font-bold text-slate-900">{mnt.assetName}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-slate-700 font-medium bg-slate-100 px-2.5 py-1 rounded-md">
                          {mnt.maintenanceType}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <p className="text-slate-800 line-clamp-1">{mnt.issueDescription}</p>
                        {mnt.resolutionNotes && (
                          <p className="text-[11px] text-emerald-600 font-medium mt-0.5 line-clamp-1">
                            Resolution: {mnt.resolutionNotes}
                          </p>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-slate-700 font-medium">
                        {mnt.technician || mnt.vendor || 'Authorized Service'}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                        {mnt.serviceDate ? new Date(mnt.serviceDate).toLocaleDateString('en-IN') : '—'}
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(mnt.cost)}
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isInProgress
                              ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {mnt.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {isInProgress ? (
                          <button
                            onClick={() => onOpenCompleteMaintenance(mnt)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Resolved</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

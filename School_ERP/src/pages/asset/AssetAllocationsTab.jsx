import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  RotateCcw,
  Search,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function AssetAllocationsTab({
  allocations = [],
  onOpenIssue,
  onOpenReturn
}) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAllocations = useMemo(() => {
    return allocations.filter((alloc) => {
      const matchStatus =
        filterStatus === 'All' ||
        (filterStatus === 'Issued' && alloc.status === 'Issued') ||
        (filterStatus === 'Returned' && alloc.status === 'Returned');

      const matchSearch =
        !searchTerm ||
        alloc.assetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alloc.assetCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alloc.staffName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alloc.department?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [allocations, filterStatus, searchTerm]);

  const activeCount = allocations.filter((a) => a.status === 'Issued').length;
  const returnedCount = allocations.filter((a) => a.status === 'Returned').length;

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      {/* Top Header */}
      <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Asset Custody & Assignments
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track equipment issued to faculty, departments, and school personnel
          </p>
        </div>

        <button
          onClick={onOpenIssue}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Issue Asset to Staff
        </button>
      </div>

      {/* Filter Row */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
        {/* Sub-status buttons */}
        <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-xl">
          <button
            onClick={() => setFilterStatus('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'All' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Logs ({allocations.length})
          </button>
          <button
            onClick={() => setFilterStatus('Issued')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'Issued' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active In Use ({activeCount})
          </button>
          <button
            onClick={() => setFilterStatus('Returned')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'Returned' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Returned ({returnedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search staff, asset, tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Asset Details</th>
              <th className="py-3 px-4">Holder / Assignee</th>
              <th className="py-3 px-4">Department / Role</th>
              <th className="py-3 px-4">Issued On</th>
              <th className="py-3 px-4">Return Schedule</th>
              <th className="py-3 px-4 text-center">Condition</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {filteredAllocations.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-600">No allocation records found</p>
                </td>
              </tr>
            ) : (
              filteredAllocations.map((alloc) => {
                const isIssued = alloc.status === 'Issued';
                const isOverdue =
                  isIssued &&
                  alloc.expectedReturnDate &&
                  new Date(alloc.expectedReturnDate) < new Date();

                return (
                  <tr key={alloc._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Asset details */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {alloc.assetCode}
                        </span>
                        <span className="font-bold text-slate-900">{alloc.assetName}</span>
                      </div>
                      {alloc.remarks && (
                        <p className="text-[11px] text-slate-400 mt-1 italic">"{alloc.remarks}"</p>
                      )}
                    </td>

                    {/* Holder */}
                    <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                      {alloc.staffName || 'Staff Member'}
                    </td>

                    {/* Department & Role */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-slate-700 font-medium">{alloc.department || 'General'}</span>
                      <span className="text-slate-400 text-[11px] block">{alloc.role || 'Staff'}</span>
                    </td>

                    {/* Issued On */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      {alloc.issueDate ? new Date(alloc.issueDate).toLocaleDateString('en-IN') : '—'}
                    </td>

                    {/* Return Schedule */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {isIssued ? (
                        <div className="flex items-center gap-1.5">
                          <span className={isOverdue ? 'text-red-600 font-bold' : 'text-slate-700 font-medium'}>
                            {alloc.expectedReturnDate
                              ? new Date(alloc.expectedReturnDate).toLocaleDateString('en-IN')
                              : 'Open-ended'}
                          </span>
                          {isOverdue && (
                            <span className="text-[10px] font-extrabold uppercase bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                              Overdue
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="text-emerald-700 font-medium">
                          Returned {alloc.returnDate ? new Date(alloc.returnDate).toLocaleDateString('en-IN') : ''}
                        </div>
                      )}
                    </td>

                    {/* Condition */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                        {isIssued ? alloc.conditionOnIssue || 'Good' : alloc.conditionOnReturn || 'Good'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isIssued
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {alloc.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {isIssued ? (
                        <button
                          onClick={() => onOpenReturn(alloc)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-all"
                        >
                          <RotateCcw className="w-3 h-3" /> Return Asset
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Completed</span>
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
  );
}

import React from 'react';
import {
  CheckCircle2,
  Plus,
  AlertOctagon,
  Calendar,
  Users,
  ShieldCheck,
  MapPin,
  ClipboardCheck
} from 'lucide-react';

export default function AssetAuditsTab({
  audits = [],
  onOpenRecordAudit
}) {
  const totalVerified = audits.reduce((sum, a) => sum + (a.verifiedCount || 0), 0);
  const totalMissing = audits.reduce((sum, a) => sum + (a.missingCount || 0), 0);
  const totalDamaged = audits.reduce((sum, a) => sum + (a.damagedCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80 border-t-4 border-t-indigo-600 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Verification Sessions</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{audits.length} Audits</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Physical campus audits conducted</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80 border-t-4 border-t-emerald-600 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Physically Verified</p>
            <h3 className="text-2xl font-extrabold text-emerald-600">{totalVerified} Items</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Found and verified in place</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80 border-t-4 border-t-amber-500 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Exceptions Noted</p>
            <h3 className="text-2xl font-extrabold text-amber-600">{totalMissing + totalDamaged} Items</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{totalDamaged} damaged · {totalMissing} missing</p>
          </div>
        </div>
      </div>

      {/* 2. Audit Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              Physical Asset Verification Sessions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tag scanning, serial number verification and room-by-room physical audits
            </p>
          </div>

          <button
            onClick={onOpenRecordAudit}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" /> Record New Physical Audit
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Audit Title</th>
                <th className="py-3 px-4">Scope / Location</th>
                <th className="py-3 px-4">Conducted By</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Items Audited</th>
                <th className="py-3 px-4 text-center">Verified</th>
                <th className="py-3 px-4 text-center">Exceptions</th>
                <th className="py-3 px-4">Remarks</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {audits.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <ClipboardCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No physical audit records found</p>
                  </td>
                </tr>
              ) : (
                audits.map((audit) => (
                  <tr key={audit._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {audit.auditTitle}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{audit.location || 'All Campus Wings'}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-800 font-medium">
                      {audit.auditorName || 'Internal Audit Committee'}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      {audit.auditDate ? new Date(audit.auditDate).toLocaleDateString('en-IN') : '—'}
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-slate-900 whitespace-nowrap">
                      {audit.totalAudited || 0}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {audit.verifiedCount || 0}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                        {(audit.missingCount || 0) + (audit.damagedCount || 0)}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-xs text-slate-600 line-clamp-1">
                      {audit.remarks || 'Routine physical verification completed.'}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {audit.status || 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

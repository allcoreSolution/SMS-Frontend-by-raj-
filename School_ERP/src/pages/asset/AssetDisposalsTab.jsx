import React from 'react';
import {
  Trash2,
  Plus,
  IndianRupee,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';

export default function AssetDisposalsTab({
  disposals = [],
  onOpenDispose
}) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const totalOriginalCost = disposals.reduce((sum, d) => sum + (d.originalCost || 0), 0);
  const totalSaleValue = disposals.reduce((sum, d) => sum + (d.saleValue || 0), 0);
  const netLoss = Math.max(0, totalOriginalCost - totalSaleValue);

  return (
    <div className="space-y-6">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80 border-t-4 border-t-slate-500 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Disposed / Written Off</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{disposals.length} Items</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Removed from institutional register</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80 border-t-4 border-t-emerald-600 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Realised Scrap Value</p>
            <h3 className="text-2xl font-extrabold text-emerald-600">{formatCurrency(totalSaleValue)}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Recovered from salvage auctions</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80 border-t-4 border-t-red-500 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Net Write-Off Loss</p>
            <h3 className="text-2xl font-extrabold text-red-600">{formatCurrency(netLoss)}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Adjusted in institutional books</p>
          </div>
        </div>
      </div>

      {/* 2. Disposals Ledger Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-slate-600" />
              Asset Retirement & Disposal Ledger
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Statutory audited record of sold, scrapped, lost, or donated assets
            </p>
          </div>

          <button
            onClick={onOpenDispose}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-slate-500/20"
          >
            <Plus className="w-4 h-4" /> Record Asset Disposal
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Asset Details</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Disposal Date</th>
                <th className="py-3 px-4 text-right">Original Cost</th>
                <th className="py-3 px-4 text-right">Realised Value</th>
                <th className="py-3 px-4 text-right">Net Gain / Loss</th>
                <th className="py-3 px-4">Reason / Notes</th>
                <th className="py-3 px-4">Approved By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {disposals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Trash2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No assets have been disposed of yet</p>
                  </td>
                </tr>
              ) : (
                disposals.map((disp) => {
                  const gainOrLoss = disp.lossOrGain != null ? disp.lossOrGain : (disp.saleValue || 0) - (disp.originalCost || 0);

                  return (
                    <tr key={disp._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            {disp.assetCode}
                          </span>
                          <span className="font-bold text-slate-900">{disp.assetName}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-slate-700 font-bold bg-slate-100 px-2.5 py-1 rounded-md">
                          {disp.disposalMethod || 'Scrapped'}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                        {disp.disposalDate ? new Date(disp.disposalDate).toLocaleDateString('en-IN') : '—'}
                      </td>

                      <td className="py-3 px-4 text-right font-medium text-slate-700 whitespace-nowrap">
                        {formatCurrency(disp.originalCost)}
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-emerald-600 whitespace-nowrap">
                        {formatCurrency(disp.saleValue)}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span className={`font-bold ${gainOrLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {gainOrLoss >= 0 ? `+${formatCurrency(gainOrLoss)}` : formatCurrency(gainOrLoss)}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-xs text-slate-600 line-clamp-1">
                        {disp.reason || 'End of economic life'}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-slate-800 font-semibold">
                        {disp.approvedBy || 'School Administrator'}
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

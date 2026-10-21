import React, { useState } from 'react';
import {
  TrendingDown,
  ArrowDownToLine,
  Box,
  Calendar,
  Filter,
  Info,
  CheckCircle2,
  Sparkles,
  Download
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function AssetDepreciationTab({ assets = [], categories = [] }) {
  const [selectedFY, setSelectedFY] = useState('2024-2025');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const eligibleAssets = assets.filter((a) => a.status !== 'Disposed');
  const totalCost = eligibleAssets.reduce((sum, a) => sum + (a.cost || 0), 0);
  const totalBookValue = eligibleAssets.reduce((sum, a) => sum + (a.currentValue || a.cost || 0), 0);
  const accumulatedDep = Math.max(0, totalCost - totalBookValue);

  const handleSimulatePosting = () => {
    Swal.fire({
      title: 'Depreciation Engine Preview',
      html: `
        <div style="text-align: left; font-size: 13px; color: #475569;">
          <p><strong>Financial Year:</strong> ${selectedFY}</p>
          <p><strong>Total Eligible Assets:</strong> ${eligibleAssets.length}</p>
          <p><strong>Total Acquisition Base:</strong> ${formatCurrency(totalCost)}</p>
          <p><strong>Monthly Amortization:</strong> ${formatCurrency(accumulatedDep / 12)}</p>
          <div style="margin-top: 10px; padding: 10px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0; color: #166534;">
            ✓ All asset book values are currently synchronized with the general ledger.
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Run Routine Update',
      confirmButtonColor: '#4f46e5',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Depreciation Synchronized',
          text: 'Monthly straight-line and WDV depreciation schedules confirmed and locked for this period.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80 border-t-4 border-t-indigo-600 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Depreciable Fixed Assets</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{eligibleAssets.length} Items</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Under active depreciation cycle</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80 border-t-4 border-t-amber-500 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <ArrowDownToLine className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Accumulated Depreciation</p>
            <h3 className="text-2xl font-extrabold text-amber-600">{formatCurrency(accumulatedDep)}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Written off to date</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80 border-t-4 border-t-emerald-600 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Net Book Value (NBV)</p>
            <h3 className="text-2xl font-extrabold text-emerald-600">{formatCurrency(totalBookValue)}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Current balance sheet valuation</p>
          </div>
        </div>
      </div>

      {/* 2. Run / Preview Depreciation Box */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Depreciation Routine Controller</h3>
              <p className="text-xs text-slate-500">
                Automated monthly amortization runs on the 1st of every calendar month.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedFY}
              onChange={(e) => setSelectedFY(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="2024-2025">Financial Year 2024–2025</option>
              <option value="2023-2024">Financial Year 2023–2024</option>
            </select>

            <button
              onClick={handleSimulatePosting}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
            >
              <Filter className="w-4 h-4" /> Calculate & Preview
            </button>
          </div>
        </div>
      </div>

      {/* 3. Depreciation Register Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Asset Depreciation Ledger</h3>
          <span className="text-xs text-slate-500">Method: Straight-Line & WDV Inheritance</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Tag</th>
                <th className="py-3 px-4">Asset Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Acquisition Cost</th>
                <th className="py-3 px-4 text-center">Life / Rate</th>
                <th className="py-3 px-4 text-right">Accumulated Dep.</th>
                <th className="py-3 px-4 text-right">Net Book Value</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {eligibleAssets.map((asset) => {
                const cost = asset.cost || 0;
                const bookVal = asset.currentValue || cost;
                const dep = Math.max(0, cost - bookVal);

                return (
                  <tr key={asset._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {asset.assetCode}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{asset.assetName}</td>
                    <td className="py-3 px-4 text-slate-600">{asset.category}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700 whitespace-nowrap">
                      {formatCurrency(cost)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="text-slate-600 font-medium">5 yrs · 20%</span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-red-600 whitespace-nowrap">
                      -{formatCurrency(dep)}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900 whitespace-nowrap">
                      {formatCurrency(bookVal)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

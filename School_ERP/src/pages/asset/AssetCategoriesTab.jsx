import React from 'react';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  TrendingDown,
  Clock,
  Package,
  IndianRupee,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function AssetCategoriesTab({
  categories = [],
  onOpenAddCategory,
  onOpenEditCategory,
  onDeleteCategory
}) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const totalValuation = categories.reduce((sum, c) => sum + (c.totalValue || 0), 0);
  const totalAssetsCount = categories.reduce((sum, c) => sum + (c.assetCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Asset Categories ({categories.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure classification, useful life standards and depreciation rate policies
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-slate-400 font-semibold block uppercase">Total Category Value</span>
            <span className="text-sm font-extrabold text-slate-800">{formatCurrency(totalValuation)}</span>
          </div>
          <button
            onClick={onOpenAddCategory}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
      </div>

      {/* Category Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat._id || cat.code}
            className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    {cat.code}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-2">{cat.name}</h3>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {cat.status || 'Active'}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-2 line-clamp-2 min-h-[32px]">
                {cat.description || 'General school equipment classification and asset grouping.'}
              </p>

              {/* Specs & Depreciation Defaults */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Method</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">{cat.depreciationMethod || 'Straight Line'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Useful Life & Rate</span>
                  <span className="font-bold text-indigo-600 mt-0.5 block">
                    {cat.usefulLifeYears || 5} yrs ({cat.depreciationRate || 20}%)
                  </span>
                </div>
              </div>

              {/* Valuation details */}
              <div className="mt-3 p-3 bg-indigo-50/50 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 block">Assets Registered</span>
                  <span className="text-sm font-extrabold text-indigo-700">{cat.assetCount || 0} items</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Total Net Value</span>
                  <span className="text-sm font-extrabold text-slate-900">{formatCurrency(cat.totalValue || cat.totalCost)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => onOpenEditCategory(cat)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-200"
              >
                <Edit className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => onDeleteCategory(cat)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  QrCode,
  Download,
  Package,
  Layers,
  MapPin,
  CheckCircle,
  Clock,
  Wrench,
  AlertOctagon,
  Copy,
  Printer
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function AssetRegisterTab({
  assets = [],
  categories = [],
  onOpenRegister,
  onOpenEdit,
  onViewAsset,
  onDeleteAsset,
  loading = false
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchSearch =
        !searchTerm ||
        asset.assetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.assetCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.modelNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.location?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = selectedCategory === 'All' || asset.category === selectedCategory;
      const matchStatus = selectedStatus === 'All' || asset.status === selectedStatus;
      const matchCondition = selectedCondition === 'All' || asset.condition === selectedCondition;

      return matchSearch && matchCategory && matchStatus && matchCondition;
    });
  }, [assets, searchTerm, selectedCategory, selectedStatus, selectedCondition]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Copied ${text}`,
      showConfirmButton: false,
      timer: 1500
    });
  };

  const exportCSV = () => {
    if (filteredAssets.length === 0) {
      Swal.fire('No Data', 'No assets match the current filter to export.', 'info');
      return;
    }

    const headers = ['Asset Code', 'Asset Name', 'Category', 'Brand', 'Model', 'Serial', 'Location', 'Cost', 'Current Value', 'Status', 'Condition'];
    const rows = filteredAssets.map(a => [
      a.assetCode,
      `"${(a.assetName || '').replace(/"/g, '""')}"`,
      `"${a.category || ''}"`,
      `"${a.brand || ''}"`,
      `"${a.modelNo || ''}"`,
      `"${a.serialNumber || ''}"`,
      `"${a.location || ''}"`,
      a.cost || 0,
      a.currentValue || a.cost || 0,
      a.status || '',
      a.condition || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Asset_Register_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      {/* Header bar */}
      <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            Asset Register ({filteredAssets.length} of {assets.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive institutional fixed asset inventory</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
          </button>
          <button
            onClick={onOpenRegister}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" /> Register New Asset
          </button>
        </div>
      </div>

      {/* Filter and search controls */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by tag, name, brand, serial, room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-indigo-500"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c._id || c.name} value={c.name}>{c.name}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-indigo-500"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active / Available</option>
          <option value="Assigned">Assigned / In Use</option>
          <option value="In Maintenance">In Maintenance</option>
          <option value="Disposed">Disposed / Scrapped</option>
        </select>

        <select
          value={selectedCondition}
          onChange={(e) => setSelectedCondition(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-indigo-500"
        >
          <option value="All">All Conditions</option>
          <option value="New">New</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Damaged">Damaged</option>
        </select>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Tag / Code</th>
              <th className="py-3 px-4">Asset Details</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Condition</th>
              <th className="py-3 px-4 text-right">Cost (₹)</th>
              <th className="py-3 px-4 text-right">Book Value (₹)</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-600">No assets match your search or filter</p>
                  <p className="text-[11px] text-slate-400 mt-1">Try clearing filters or register a new asset.</p>
                </td>
              </tr>
            ) : (
              filteredAssets.map((asset) => {
                const isAssigned = asset.status === 'Assigned';
                const isMaintenance = asset.status === 'In Maintenance';
                const isDisposed = asset.status === 'Disposed';

                return (
                  <tr key={asset._id} className="hover:bg-indigo-50/30 transition-colors">
                    {/* Tag Code */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          {asset.assetCode}
                        </span>
                        <button
                          onClick={() => copyToClipboard(asset.assetCode)}
                          title="Copy tag"
                          className="text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Asset Name, Brand, Serial */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{asset.assetName}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {asset.brand && <span className="font-medium text-slate-700">{asset.brand} </span>}
                        {asset.modelNo && <span>· {asset.modelNo} </span>}
                        {asset.serialNumber && <span className="text-slate-400">· SN: {asset.serialNumber}</span>}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {asset.category}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{asset.location || 'Main Campus'}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isDisposed
                            ? 'bg-slate-100 text-slate-600 border border-slate-200'
                            : isMaintenance
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                            : isAssigned
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {asset.status || 'Active'}
                      </span>
                    </td>

                    {/* Condition */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                          asset.condition === 'New'
                            ? 'bg-emerald-50 text-emerald-600 font-bold'
                            : asset.condition === 'Good'
                            ? 'bg-blue-50 text-blue-600'
                            : asset.condition === 'Fair'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {asset.condition || 'Good'}
                      </span>
                    </td>

                    {/* Acquisition Cost */}
                    <td className="py-3 px-4 text-right font-medium text-slate-700 whitespace-nowrap">
                      {formatCurrency(asset.cost)}
                    </td>

                    {/* Current Value */}
                    <td className="py-3 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                      {formatCurrency(asset.currentValue || asset.cost)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onViewAsset(asset)}
                          title="View Details & Tag QR"
                          className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors border border-cyan-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenEdit(asset)}
                          title="Edit Asset"
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-200"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteAsset(asset)}
                          title="Delete Asset"
                          disabled={isAssigned}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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

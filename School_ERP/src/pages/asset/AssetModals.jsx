import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Package,
  Layers,
  Users,
  Wrench,
  Trash2,
  CheckCircle2,
  Printer,
  QrCode,
  Calendar,
  IndianRupee,
  MapPin,
  Shield,
  FileText
} from 'lucide-react';
import Swal from 'sweetalert2';

// ==========================================
// 1. REGISTER / EDIT ASSET MODAL
// ==========================================
export function AssetFormModal({
  isOpen,
  onClose,
  onSave,
  asset = null,
  categories = []
}) {
  const [formData, setFormData] = useState({
    assetCode: '',
    assetName: '',
    category: '',
    brand: '',
    modelNo: '',
    serialNumber: '',
    purchaseDate: new Date().toISOString().slice(0, 10),
    cost: '',
    currentValue: '',
    quantity: 1,
    location: '',
    vendor: '',
    invoiceNo: '',
    warrantyExpiry: '',
    condition: 'Good',
    notes: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (asset) {
      setFormData({
        assetCode: asset.assetCode || '',
        assetName: asset.assetName || '',
        category: asset.category || (categories[0]?.name || 'IT & Computer Equipment'),
        brand: asset.brand || '',
        modelNo: asset.modelNo || '',
        serialNumber: asset.serialNumber || '',
        purchaseDate: asset.purchaseDate ? new Date(asset.purchaseDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        cost: asset.cost || '',
        currentValue: asset.currentValue || asset.cost || '',
        quantity: asset.quantity || 1,
        location: asset.location || 'Main Campus',
        vendor: asset.vendor || '',
        invoiceNo: asset.invoiceNo || '',
        warrantyExpiry: asset.warrantyExpiry ? new Date(asset.warrantyExpiry).toISOString().slice(0, 10) : '',
        condition: asset.condition || 'Good',
        notes: asset.notes || ''
      });
    } else {
      setFormData({
        assetCode: '',
        assetName: '',
        category: categories[0]?.name || 'IT & Computer Equipment',
        brand: '',
        modelNo: '',
        serialNumber: '',
        purchaseDate: new Date().toISOString().slice(0, 10),
        cost: '',
        currentValue: '',
        quantity: 1,
        location: 'Computer Lab 1',
        vendor: '',
        invoiceNo: '',
        warrantyExpiry: '',
        condition: 'Good',
        notes: ''
      });
    }
  }, [asset, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.assetName.trim()) {
      Swal.fire('Required Field', 'Please enter an asset name.', 'warning');
      return;
    }
    if (!formData.cost || Number(formData.cost) <= 0) {
      Swal.fire('Invalid Cost', 'Please enter a valid purchase cost in INR.', 'warning');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...formData,
        cost: Number(formData.cost),
        currentValue: formData.currentValue ? Number(formData.currentValue) : Number(formData.cost)
      });
      onClose();
    } catch (err) {
      // handled by caller
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 my-8">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-xl">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {asset ? 'Edit Fixed Asset' : 'Register New Fixed Asset'}
              </h2>
              <p className="text-xs text-slate-500">Record capital equipment identity, warranty, and location</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Asset Code / Tag</label>
              <input
                type="text"
                placeholder="Leave blank to auto-generate (AST-xxxx)"
                value={formData.assetCode}
                onChange={(e) => setFormData({ ...formData, assetCode: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-white"
              >
                {categories.map((c) => (
                  <option key={c._id || c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Asset Name & Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Dell OptiPlex 7090 Desktop Core i7"
              value={formData.assetName}
              onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Brand / Manufacturer</label>
              <input
                type="text"
                placeholder="e.g. Dell / Godrej / Canon"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Model Number</label>
              <input
                type="text"
                placeholder="e.g. MT-7090"
                value={formData.modelNo}
                onChange={(e) => setFormData({ ...formData, modelNo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Serial Number</label>
              <input
                type="text"
                placeholder="Hardware S/N"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Purchase Date</label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Purchase Cost (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Cost in INR"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value, currentValue: formData.currentValue || e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Book Value (₹)</label>
              <input
                type="number"
                placeholder="After depreciation"
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold text-indigo-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Location / Room</label>
              <input
                type="text"
                placeholder="e.g. Computer Lab 1 / Library"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Vendor / Supplier</label>
              <input
                type="text"
                placeholder="Vendor Name"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Invoice Number</label>
              <input
                type="text"
                placeholder="Bill / Invoice #"
                value={formData.invoiceNo}
                onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Warranty Expiry Date</label>
              <input
                type="date"
                value={formData.warrantyExpiry}
                onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Physical Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-white"
              >
                <option value="New">New / Freshly Commissioned</option>
                <option value="Good">Good / Fully Functional</option>
                <option value="Fair">Fair / Operational with Wear</option>
                <option value="Damaged">Damaged / Needs Attention</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Specifications & Notes</label>
            <textarea
              rows={2}
              placeholder="Processor, RAM, configuration, or room placement instructions..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
            >
              {saving ? 'Saving...' : asset ? 'Update Asset' : 'Register Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 2. VIEW ASSET DETAIL & PRINT QR MODAL
// ==========================================
export function AssetDetailModal({ isOpen, onClose, asset = null }) {
  if (!isOpen || !asset) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 my-8">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-800">Asset Card & Barcode Tag</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Printable Physical Tag Card */}
          <div className="p-4 border-2 border-dashed border-indigo-300 rounded-2xl bg-indigo-50/30 text-center space-y-2">
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-900">
              GREENWOOD INTERNATIONAL SCHOOL
            </div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Institutional Fixed Asset Tag</div>
            <div className="py-2 flex justify-center">
              {/* Simulated high-res barcode & QR visual */}
              <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm inline-block">
                <div className="font-mono text-lg font-black tracking-widest text-slate-900">{asset.assetCode}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">SCAN FOR INSTANT AUDIT RECORD</div>
              </div>
            </div>
            <div className="text-xs font-bold text-slate-800">{asset.assetName}</div>
            <div className="text-[11px] text-slate-500">{asset.category} · {asset.location}</div>
          </div>

          {/* Asset Specs Grid */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Brand & Model</span>
              <span className="font-bold text-slate-800">{asset.brand || '—'} {asset.modelNo}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Serial Number</span>
              <span className="font-mono font-bold text-slate-800">{asset.serialNumber || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Original Cost</span>
              <span className="font-bold text-slate-800">{formatCurrency(asset.cost)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Net Book Value</span>
              <span className="font-bold text-indigo-600">{formatCurrency(asset.currentValue || asset.cost)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Purchase Date</span>
              <span className="font-semibold text-slate-700">
                {asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString('en-IN') : '—'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Warranty Expiry</span>
              <span className="font-semibold text-slate-700">
                {asset.warrantyExpiry ? new Date(asset.warrantyExpiry).toLocaleDateString('en-IN') : 'No AMC'}
              </span>
            </div>
          </div>

          {/* Custody status */}
          <div className="p-3 bg-blue-50/60 rounded-xl text-blue-900 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-600 block">Current Status</span>
              <span className="font-bold text-xs">{asset.status || 'Active'}</span>
            </div>
            {asset.allocatedTo?.staffName && (
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-blue-600 block">Holder</span>
                <span className="font-bold text-xs">{asset.allocatedTo.staffName}</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-500/20"
            >
              <Printer className="w-4 h-4" /> Print Label
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. ADD / EDIT CATEGORY MODAL
// ==========================================
export function CategoryModal({
  isOpen,
  onClose,
  onSave,
  category = null
}) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    depreciationMethod: 'Straight Line',
    usefulLifeYears: 5,
    depreciationRate: 20,
    description: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        code: category.code || '',
        depreciationMethod: category.depreciationMethod || 'Straight Line',
        usefulLifeYears: category.usefulLifeYears || 5,
        depreciationRate: category.depreciationRate || 20,
        description: category.description || ''
      });
    } else {
      setFormData({
        name: '',
        code: '',
        depreciationMethod: 'Straight Line',
        usefulLifeYears: 5,
        depreciationRate: 20,
        description: ''
      });
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire('Required Field', 'Please enter a category name.', 'warning');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...formData,
        usefulLifeYears: Number(formData.usefulLifeYears),
        depreciationRate: Number(formData.depreciationRate)
      });
      onClose();
    } catch (err) {
      // handled by caller
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-800">
              {category ? 'Edit Category' : 'Add Asset Category'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. IT & Computer Equipment"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category Code</label>
              <input
                type="text"
                placeholder="e.g. CAT-IT"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Depreciation Method</label>
              <select
                value={formData.depreciationMethod}
                onChange={(e) => setFormData({ ...formData, depreciationMethod: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-white"
              >
                <option value="Straight Line">Straight Line (SLM)</option>
                <option value="Written Down Value">Written Down Value (WDV)</option>
                <option value="None">None (Non-depreciable)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Useful Life (Years)</label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.usefulLifeYears}
                onChange={(e) => setFormData({ ...formData, usefulLifeYears: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Annual Dep. Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.depreciationRate}
                onChange={(e) => setFormData({ ...formData, depreciationRate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Items included under this category classification..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
            >
              {saving ? 'Saving...' : category ? 'Update Category' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 4. ISSUE ASSET TO STAFF MODAL
// ==========================================
export function IssueAssetModal({
  isOpen,
  onClose,
  onIssue,
  availableAssets = [],
  staffList = []
}) {
  const [assetId, setAssetId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [conditionOnIssue, setConditionOnIssue] = useState('Good');
  const [remarks, setRemarks] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (availableAssets.length > 0) {
      setAssetId(availableAssets[0]._id);
    }
    if (staffList.length > 0) {
      setStaffId(staffList[0]._id);
    }
  }, [availableAssets, staffList, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assetId) {
      Swal.fire('No Asset Selected', 'Please select an available asset to issue.', 'warning');
      return;
    }
    if (!staffId) {
      Swal.fire('No Staff Selected', 'Please select a staff member.', 'warning');
      return;
    }

    const selectedStaff = staffList.find((s) => s._id === staffId);

    setSaving(true);
    try {
      await onIssue({
        assetId,
        staffId,
        staffName: selectedStaff?.fullName || 'Staff Member',
        department: selectedStaff?.department || 'General',
        role: selectedStaff?.designation || selectedStaff?.role?.name || 'Faculty',
        expectedReturnDate: expectedReturnDate || undefined,
        conditionOnIssue,
        remarks
      });
      onClose();
    } catch (err) {
      // handled
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-800">Issue Asset to Faculty / Staff</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Select In-Store Asset <span className="text-red-500">*</span>
            </label>
            {availableAssets.length === 0 ? (
              <div className="p-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
                No unallocated assets currently in store.
              </div>
            ) : (
              <select
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 bg-white"
                required
              >
                {availableAssets.map((a) => (
                  <option key={a._id} value={a._id}>
                    [{a.assetCode}] {a.assetName} ({a.category})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Assign To Staff Member <span className="text-red-500">*</span>
            </label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 bg-white"
              required
            >
              {staffList.map((st) => (
                <option key={st._id} value={st._id}>
                  {st.fullName} ({st.designation || st.department || 'Staff'}) - {st.staffId}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Expected Return Date</label>
              <input
                type="date"
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Condition on Handover</label>
              <select
                value={conditionOnIssue}
                onChange={(e) => setConditionOnIssue(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 bg-white"
              >
                <option value="New">New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Handover Remarks</label>
            <textarea
              rows={2}
              placeholder="Purpose of issue, event coverage, project duration..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || availableAssets.length === 0}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {saving ? 'Issuing...' : 'Issue Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 5. RETURN ASSET MODAL
// ==========================================
export function ReturnAssetModal({
  isOpen,
  onClose,
  onReturn,
  allocation = null
}) {
  const [conditionOnReturn, setConditionOnReturn] = useState('Good');
  const [remarks, setRemarks] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen || !allocation) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onReturn({
        allocationId: allocation._id,
        conditionOnReturn,
        remarks
      });
      onClose();
    } catch (err) {
      // handled
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-800">Return Equipment to Store</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <div className="font-bold text-slate-900">{allocation.assetName}</div>
            <div className="text-[11px] text-slate-500">
              Tag: <span className="font-mono text-indigo-700 font-bold">{allocation.assetCode}</span> · Custodian: <strong className="text-slate-700">{allocation.staffName}</strong>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Condition on Return</label>
            <select
              value={conditionOnReturn}
              onChange={(e) => setConditionOnReturn(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 bg-white"
            >
              <option value="Good">Good / Undamaged</option>
              <option value="Fair">Fair / Minor Signs of Wear</option>
              <option value="Damaged">Damaged / Requires Repair</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Return Remarks / Inspection Notes</label>
            <textarea
              rows={3}
              placeholder="Checked all cables, lenses, battery health..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
            >
              {saving ? 'Processing...' : 'Confirm Return'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 6. LOG MAINTENANCE MODAL
// ==========================================
export function LogMaintenanceModal({
  isOpen,
  onClose,
  onSave,
  assets = []
}) {
  const [assetId, setAssetId] = useState('');
  const [maintenanceType, setMaintenanceType] = useState('Routine Service');
  const [vendor, setVendor] = useState('');
  const [technician, setTechnician] = useState('');
  const [cost, setCost] = useState('');
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [issueDescription, setIssueDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (assets.length > 0) {
      setAssetId(assets[0]._id);
    }
  }, [assets, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assetId) {
      Swal.fire('Required Field', 'Please select an asset to service.', 'warning');
      return;
    }
    if (!issueDescription.trim()) {
      Swal.fire('Required Field', 'Please describe the maintenance issue or work required.', 'warning');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        assetId,
        maintenanceType,
        vendor,
        technician,
        cost: Number(cost) || 0,
        serviceDate,
        issueDescription
      });
      onClose();
    } catch (err) {
      // handled
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-800">Schedule / Log Maintenance</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Select Equipment <span className="text-red-500">*</span>
            </label>
            <select
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-amber-500 bg-white"
              required
            >
              {assets.map((a) => (
                <option key={a._id} value={a._id}>
                  [{a.assetCode}] {a.assetName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Service Type</label>
              <select
                value={maintenanceType}
                onChange={(e) => setMaintenanceType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-amber-500 bg-white"
              >
                <option value="Routine Service">Routine Service</option>
                <option value="Hardware Repair">Hardware Repair</option>
                <option value="Calibration">Calibration</option>
                <option value="Firmware / Flash">Firmware / Software Flash</option>
                <option value="Warranty Claim">Warranty Claim</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Service Date</label>
              <input
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Vendor / Service Center</label>
              <input
                type="text"
                placeholder="e.g. Authorized Dell Service"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Estimated Cost (₹)</label>
              <input
                type="number"
                placeholder="0"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-amber-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Technician Name & Phone</label>
            <input
              type="text"
              placeholder="e.g. Vikas Dubey (+91 98111 22334)"
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Issue Description / Work Scope <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="Describe malfunction, error code, or filter change requirements..."
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              {saving ? 'Scheduling...' : 'Log Maintenance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 7. COMPLETE MAINTENANCE MODAL
// ==========================================
export function CompleteMaintenanceModal({
  isOpen,
  onClose,
  onComplete,
  maintenance = null
}) {
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen || !maintenance) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onComplete(maintenance._id, { resolutionNotes });
      onClose();
    } catch (err) {
      // handled
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-800">Complete Maintenance Work</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <div className="font-bold text-slate-900">{maintenance.assetName}</div>
            <div className="text-[11px] text-slate-500">
              Tag: <span className="font-mono font-bold text-indigo-700">{maintenance.assetCode}</span> · Issue: {maintenance.issueDescription}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Resolution Notes & Technician Sign-off <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Part replaced, test calibration passed, verified working properly..."
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
            >
              {saving ? 'Closing Ticket...' : 'Mark as Completed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 8. DISPOSE ASSET MODAL
// ==========================================
export function DisposeAssetModal({
  isOpen,
  onClose,
  onDispose,
  assets = []
}) {
  const [assetId, setAssetId] = useState('');
  const [disposalMethod, setDisposalMethod] = useState('Scrapped');
  const [saleValue, setSaleValue] = useState(0);
  const [reason, setReason] = useState('End of economic life and unrepairable hardware damage');
  const [approvedBy, setApprovedBy] = useState('Principal / School Management');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (assets.length > 0) {
      setAssetId(assets[0]._id);
    }
  }, [assets, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assetId) {
      Swal.fire('Required Field', 'Please select an asset to dispose of.', 'warning');
      return;
    }

    setSaving(true);
    try {
      await onDispose({
        assetId,
        disposalMethod,
        saleValue: Number(saleValue) || 0,
        reason,
        approvedBy
      });
      onClose();
    } catch (err) {
      // handled
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-red-50/50">
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-bold text-slate-800">Record Asset Retirement / Disposal</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Select Asset <span className="text-red-500">*</span>
            </label>
            <select
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-red-500 bg-white"
              required
            >
              {assets.map((a) => (
                <option key={a._id} value={a._id}>
                  [{a.assetCode}] {a.assetName} (Cost: ₹{a.cost})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Disposal Method</label>
              <select
                value={disposalMethod}
                onChange={(e) => setDisposalMethod(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-red-500 bg-white"
              >
                <option value="Scrapped">Scrapped</option>
                <option value="Sold to Vendor">Sold to Vendor</option>
                <option value="Donated">Donated</option>
                <option value="Written Off">Written Off</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Realised Value (₹)</label>
              <input
                type="number"
                placeholder="0"
                value={saleValue}
                onChange={(e) => setSaleValue(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-red-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Reason for Retirement</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Approved By</label>
            <input
              type="text"
              value={approvedBy}
              onChange={(e) => setApprovedBy(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-red-500"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-md shadow-red-500/20 disabled:opacity-50"
            >
              {saving ? 'Disposing...' : 'Confirm Disposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 9. RECORD AUDIT MODAL
// ==========================================
export function RecordAuditModal({
  isOpen,
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState({
    auditTitle: 'Mid-Term Campus Physical Asset Audit',
    auditorName: 'Internal Audit Committee',
    location: 'All Campus Wings & Science Labs',
    totalAudited: 15,
    verifiedCount: 15,
    missingCount: 0,
    damagedCount: 0,
    remarks: 'Room-by-room barcode tag scanning completed. All listed assets physically verified.'
  });
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...formData,
        totalAudited: Number(formData.totalAudited),
        verifiedCount: Number(formData.verifiedCount),
        missingCount: Number(formData.missingCount),
        damagedCount: Number(formData.damagedCount)
      });
      onClose();
    } catch (err) {
      // handled
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-800">Record Physical Verification Audit</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Audit Title</label>
            <input
              type="text"
              value={formData.auditTitle}
              onChange={(e) => setFormData({ ...formData, auditTitle: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Audited Scope / Wing</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Auditor Name</label>
              <input
                type="text"
                value={formData.auditorName}
                onChange={(e) => setFormData({ ...formData, auditorName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Total</label>
              <input
                type="number"
                value={formData.totalAudited}
                onChange={(e) => setFormData({ ...formData, totalAudited: e.target.value })}
                className="w-full px-2 py-1.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-center font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Verified</label>
              <input
                type="number"
                value={formData.verifiedCount}
                onChange={(e) => setFormData({ ...formData, verifiedCount: e.target.value })}
                className="w-full px-2 py-1.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-center font-bold text-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Missing</label>
              <input
                type="number"
                value={formData.missingCount}
                onChange={(e) => setFormData({ ...formData, missingCount: e.target.value })}
                className="w-full px-2 py-1.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-center font-bold text-red-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Damaged</label>
              <input
                type="number"
                value={formData.damagedCount}
                onChange={(e) => setFormData({ ...formData, damagedCount: e.target.value })}
                className="w-full px-2 py-1.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-center font-bold text-amber-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Verification Remarks</label>
            <textarea
              rows={2}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
            >
              {saving ? 'Recording...' : 'Record Audit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

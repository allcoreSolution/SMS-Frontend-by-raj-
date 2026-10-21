import React, { useState, useEffect } from 'react';
import { Plus, Search, ChevronDown, Info, X } from 'lucide-react';
import Swal from 'sweetalert2';

const emptyForm = {
  name: '',
  desc: '',
  type: 'Module',
  plans: '2 plans',
  grants: '—',
  monthly: '',
  yearly: '',
  status: 'Active',
};

export default function PlanAddons() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [addons, setAddons] = useState(() => {
    try {
      const saved = localStorage.getItem('plan_addons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    localStorage.setItem('plan_addons', JSON.stringify(addons));
  }, [addons]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return Swal.fire('Error', 'Add-on Name is required', 'error');
    if (form.monthly === '' || form.monthly === null) {
      return Swal.fire('Error', 'Monthly Price is required', 'error');
    }
    const payload = {
      name: form.name.trim(),
      desc: form.desc || '',
      type: form.type || 'Module',
      plans: form.plans || '—',
      grants: form.grants || '—',
      monthly: form.monthly,
      yearly: form.yearly || form.monthly,
      status: form.status || 'Active',
    };
    if (editItem) {
      setAddons((prev) => prev.map((a) => (a.id === editItem.id ? { ...a, ...payload } : a)));
      Swal.fire({ icon: 'success', title: 'Updated!', timer: 1200, showConfirmButton: false });
    } else {
      setAddons((prev) => [...prev, { ...payload, id: Date.now() }]);
      Swal.fire({ icon: 'success', title: 'Add-on Created!', timer: 1200, showConfirmButton: false });
    }
    setShowAdd(false);
    setEditItem(null);
    setForm(emptyForm);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Add-on?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete',
    }).then((r) => {
      if (r.isConfirmed) {
        setAddons((prev) => prev.filter((a) => a.id !== id));
      }
    });
  };

  const openEdit = (addon) => {
    setForm({
      name: addon.name || '',
      desc: addon.desc || '',
      type: addon.type || 'Module',
      plans: addon.plans || '2 plans',
      grants: addon.grants || '—',
      monthly: String(addon.monthly ?? '').replace(/,/g, ''),
      yearly: String(addon.yearly ?? '').replace(/,/g, ''),
      status: addon.status || 'Active',
    });
    setEditItem(addon);
    setShowAdd(true);
  };

  const filtered = addons.filter((p) => {
    const q = search.toLowerCase();
    const match =
      (p.name || '').toLowerCase().includes(q) || (p.type || '').toLowerCase().includes(q);
    if (filter === 'Modules') return match && p.type === 'Module';
    if (filter === 'Storage') return match && p.type === 'Storage';
    if (filter === 'Seats') return match && p.type === 'Seat';
    if (filter === 'Channels') return match && p.type === 'Channel';
    if (filter === 'Flat') return match && p.type === 'Flat';
    return match;
  });

  return (
    <div className="max-w-[1150px] w-full mx-auto min-h-[85vh] p-4 md:p-6 lg:p-8">
      <div className="bg-white border border-gray-100 p-4 flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-[#0891b2]" />
          <span className="font-bold text-gray-800 text-[14px]">How add-ons work</span>
        </div>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </div>

      <div className="bg-white border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-end gap-3">
            <h1 className="text-2xl font-bold text-gray-800">Plan Add-ons</h1>
            <span className="text-[13px] text-gray-500">{addons.length} total</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditItem(null);
              setForm(emptyForm);
              setShowAdd(true);
            }}
            className="flex items-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white px-4 py-2 font-bold text-[13px]"
          >
            <Plus className="w-4 h-4" strokeWidth={3} /> New Add-on
          </button>
        </div>

        <div className="flex gap-8 border-b border-gray-100 mb-6 overflow-x-auto">
          {[
            { label: 'All', count: addons.length },
            { label: 'Modules', count: addons.filter((a) => a.type === 'Module').length },
            { label: 'Storage', count: addons.filter((a) => a.type === 'Storage').length },
            { label: 'Seats', count: addons.filter((a) => a.type === 'Seat').length },
            { label: 'Channels', count: addons.filter((a) => a.type === 'Channel').length },
            { label: 'Flat', count: addons.filter((a) => a.type === 'Flat').length },
          ].map((f) => (
            <button
              type="button"
              key={f.label}
              onClick={() => setFilter(f.label)}
              className={`pb-3 text-[13px] font-bold relative shrink-0 ${
                filter === f.label ? 'text-[#0891b2]' : 'text-gray-500'
              }`}
            >
              {f.label} <span className="ml-1 text-gray-300">{f.count}</span>
              {filter === f.label && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0891b2]" />}
            </button>
          ))}
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search add-ons..."
            className="pl-9 pr-4 py-2 border border-gray-200 text-[13px] w-full text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0891b2]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-slate-300">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-300">
                {['Add-on', 'Type', 'Grants', 'Monthly', 'Yearly', 'Offered by', 'Status', 'Action'].map(
                  (h) => (
                    <th key={h} className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 border-x border-slate-200">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-slate-400">
                    No add-ons yet. Click New Add-on.
                  </td>
                </tr>
              )}
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-3 py-2.5 border-x border-slate-200">
                    <p className="font-bold text-[13px]">{item.name}</p>
                    <p className="text-[12px] text-slate-500">{item.desc}</p>
                  </td>
                  <td className="px-3 py-2.5 border-x border-slate-200 text-[10px] font-bold uppercase">{item.type}</td>
                  <td className="px-3 py-2.5 border-x border-slate-200 text-[13px]">{item.grants}</td>
                  <td className="px-3 py-2.5 border-x border-slate-200 font-mono text-emerald-600 font-bold">₹{item.monthly}</td>
                  <td className="px-3 py-2.5 border-x border-slate-200 font-mono text-emerald-600 font-bold">₹{item.yearly}</td>
                  <td className="px-3 py-2.5 border-x border-slate-200 text-[13px]">{item.plans}</td>
                  <td className="px-3 py-2.5 border-x border-slate-200 text-[10px] font-bold text-emerald-600 uppercase">
                    {item.status || 'Active'}
                  </td>
                  <td className="px-3 py-2.5 border-x border-slate-200 text-center">
                    <button type="button" onClick={() => openEdit(item)} className="text-[#0891b2] font-bold text-[13px] mr-3">
                      Manage
                    </button>
                    <button type="button" onClick={() => handleDelete(item.id)} className="text-red-500 font-bold text-[13px]">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-bold text-lg">{editItem ? 'Edit Add-on' : 'New Add-on'}</h2>
              <button type="button" onClick={() => { setShowAdd(false); setEditItem(null); setForm(emptyForm); }}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">
              <div className="bg-white p-5 border border-slate-200 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold mb-1.5 uppercase">Add-on Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-[13px] text-slate-900" placeholder="e.g. Priority Support" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold mb-1.5 uppercase">Description</label>
                  <input value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-[13px] text-slate-900" placeholder="Short description" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-[13px] bg-white">
                    <option value="Module">Module</option>
                    <option value="Channel">Channel</option>
                    <option value="Storage">Storage</option>
                    <option value="Seat">Seat</option>
                    <option value="Flat">Flat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase">Included in Plans</label>
                  <input value={form.plans} onChange={(e) => setForm({ ...form, plans: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-[13px] text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase">System Grants</label>
                  <input value={form.grants} onChange={(e) => setForm({ ...form, grants: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-[13px] font-mono text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-[13px] bg-white">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase">Monthly Price (₹)</label>
                  <input required type="number" min="0" value={form.monthly}
                    onChange={(e) => setForm({ ...form, monthly: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-[13px] font-mono text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase">Yearly Price (₹)</label>
                  <input type="number" min="0" value={form.yearly}
                    onChange={(e) => setForm({ ...form, yearly: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-[13px] font-mono text-slate-900" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-[#0891b2] hover:bg-cyan-700 text-white py-2.5 text-[13px] font-bold">
                  Save Add-on Details
                </button>
                <button type="button" onClick={() => { setShowAdd(false); setEditItem(null); setForm(emptyForm); }}
                  className="px-5 py-2.5 border border-gray-200 text-[13px] font-bold text-gray-600">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

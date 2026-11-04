import React, { useState, useMemo } from 'react';
import { 
  Plus, Edit, Trash2, GripVertical, Eye, EyeOff, X, 
  Save, AlertTriangle, Search, Menu, Shield, Check, 
  Sparkles, Layers, ArrowRight, CornerDownRight 
} from 'lucide-react';
import Swal from 'sweetalert2';

const initMenus = [
  { id: 1, name: 'Dashboard', path: '/', icon: 'LayoutDashboard', visible: true, roles: ['superadmin'] },
  { id: 2, name: 'Schools', path: '/schools', icon: 'Building2', visible: true, roles: ['superadmin'] },
  { id: 3, name: 'Plans', path: '/plans', icon: 'Layers', visible: true, roles: ['superadmin'] },
  { id: 4, name: 'License Orders', path: '/license-orders', icon: 'ShoppingBag', visible: true, roles: ['superadmin'] },
  { id: 5, name: 'Team', path: '/team', icon: 'Users', visible: true, roles: ['superadmin', 'manager'] },
  { id: 6, name: 'Payments', path: '/payments', icon: 'CreditCard', visible: true, roles: ['superadmin', 'finance'] },
  { id: 7, name: 'Reports', path: '/reports', icon: 'BarChart3', visible: true, roles: ['superadmin', 'manager'] },
  { id: 8, name: 'Settings', path: '/settings-center', icon: 'Settings', visible: true, roles: ['superadmin'] },
  { id: 9, name: 'Support Tickets', path: '/support', icon: 'LifeBuoy', visible: true, roles: ['superadmin', 'support'] },
  { id: 10, name: 'Server Health', path: '/server', icon: 'Server', visible: true, roles: ['superadmin'] },
];

const emptyForm = { name: '', path: '', icon: 'Layers', roles: 'superadmin' };

function MenuModal({ title, data, setData, onSave, onClose, saveLabel, isEdit = false }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Menu className="w-4 h-4 text-orange-500" />
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">{title}</h2>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Menu Label / Title *</label>
            <input
              type="text"
              required
              value={data.name || ''}
              onChange={e => setData({ ...data, name: e.target.value })}
              placeholder="e.g. Analytics Center"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Route Path *</label>
            <input
              type="text"
              required
              value={data.path || ''}
              onChange={e => setData({ ...data, path: e.target.value })}
              placeholder="/analytics"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Icon Key</label>
            <input
              type="text"
              value={data.icon || ''}
              onChange={e => setData({ ...data, icon: e.target.value })}
              placeholder="e.g. BarChart3, Layers, Settings"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Allowed Roles (comma separated)</label>
            <input
              type="text"
              value={Array.isArray(data.roles) ? data.roles.join(', ') : data.roles || ''}
              onChange={e => setData({ ...data, roles: e.target.value })}
              placeholder="superadmin, manager, finance"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>
        </div>

        <div className="p-4 sm:p-5 pt-0 flex gap-2.5">
          <button 
            type="button" 
            onClick={onSave} 
            className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> 
            <span>{saveLabel}</span>
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MasterMenus() {
  const [menus, setMenus] = useState(initMenus);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editMenu, setEditMenu] = useState(null);
  const [deleteMenu, setDeleteMenu] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const toggleVisible = (id) => {
    setMenus(prev => prev.map(x => x.id === id ? { ...x, visible: !x.visible } : x));
  };

  const handleAdd = () => {
    if (!form.name || !form.path) {
      return Swal.fire('Required', 'Please enter Menu Name and Path.', 'warning');
    }
    const rolesArr = typeof form.roles === 'string' 
      ? form.roles.split(',').map(r => r.trim()).filter(Boolean) 
      : ['superadmin'];

    setMenus(prev => [
      ...prev, 
      { 
        id: Date.now(), 
        name: form.name, 
        path: form.path.startsWith('/') ? form.path : `/${form.path}`, 
        icon: form.icon || 'Layers', 
        visible: true, 
        roles: rolesArr 
      }
    ]);
    setShowAdd(false);
    setForm(emptyForm);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Menu item added!',
      showConfirmButton: false,
      timer: 1800
    });
  };

  const handleSaveEdit = () => {
    if (!editMenu.name || !editMenu.path) return;
    const rolesArr = typeof editMenu.roles === 'string' 
      ? editMenu.roles.split(',').map(r => r.trim()).filter(Boolean) 
      : editMenu.roles;

    setMenus(prev => prev.map(x => x.id === editMenu.id ? { ...editMenu, roles: rolesArr } : x));
    setEditMenu(null);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Menu updated!',
      showConfirmButton: false,
      timer: 1800
    });
  };

  const handleDelete = () => {
    setMenus(prev => prev.filter(x => x.id !== deleteMenu.id));
    setDeleteMenu(null);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Menu item deleted.',
      showConfirmButton: false,
      timer: 1800
    });
  };

  const filteredMenus = useMemo(() => {
    if (!search.trim()) return menus;
    const q = search.toLowerCase().trim();
    return menus.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.path.toLowerCase().includes(q) ||
      m.roles.some(r => r.toLowerCase().includes(q))
    );
  }, [menus, search]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 max-w-[1250px] w-full mx-auto min-h-[85vh]">
      {/* Sleek Responsive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Master Menus</h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {menus.length} items
            </span>
          </div>
          <p className="text-xs text-slate-500">Configure global navigation links, RBAC permissions, and visibility</p>
        </div>

        {/* Compact, Sleek Add Button */}
        <button 
          onClick={() => { setForm(emptyForm); setShowAdd(true); }} 
          className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm shadow-orange-500/20 active:scale-95 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" /> 
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Compact Search Row */}
      <div className="mb-5 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter menus by name, path or role..."
          className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 shadow-2xs"
        />
        {search && (
          <button 
            onClick={() => setSearch('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* MOBILE CARD VIEW (< 640px) */}
      <div className="sm:hidden space-y-2.5 mb-4">
        {filteredMenus.map((m, i) => (
          <div key={m.id} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 font-mono text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="font-bold text-slate-900 text-xs">{m.name}</span>
              </div>
              <button 
                onClick={() => toggleVisible(m.id)}
                className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition cursor-pointer ${
                  m.visible 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}
              >
                {m.visible ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
                <span>{m.visible ? 'Visible' : 'Hidden'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 font-mono text-blue-600">
              <span className="truncate">{m.path}</span>
              <div className="flex gap-1 flex-wrap shrink-0">
                {m.roles.map(r => (
                  <span key={r} className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-sans font-bold">
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-slate-200/60">
              <button 
                onClick={() => setEditMenu({ ...m, roles: m.roles.join(', ') })} 
                className="p-1.5 text-slate-600 hover:text-orange-600 bg-white border border-slate-200 rounded-lg transition"
                title="Edit"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setDeleteMenu(m)} 
                className="p-1.5 text-rose-500 hover:text-rose-600 bg-white border border-slate-200 rounded-lg transition"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE VIEW (>= 640px) */}
      <div className="hidden sm:block overflow-x-auto pb-4">
        <table className="w-full text-xs border-collapse border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
              <th className="text-left px-3.5 py-3 border-x border-slate-200 w-16">Order</th>
              <th className="text-left px-3.5 py-3 border-x border-slate-200">Menu Label</th>
              <th className="text-left px-3.5 py-3 border-x border-slate-200">Route Path</th>
              <th className="text-left px-3.5 py-3 border-x border-slate-200">Roles Allowed</th>
              <th className="text-center px-3.5 py-3 border-x border-slate-200 w-28">Visibility</th>
              <th className="text-center px-3.5 py-3 border-x border-slate-200 w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMenus.map((m, i) => (
              <tr key={m.id} className="hover:bg-slate-50/70 transition-colors bg-white">
                <td className="px-3.5 py-2.5 border-x border-slate-200 bg-slate-50/30">
                  <div className="flex items-center gap-1.5">
                    <GripVertical className="w-3.5 h-3.5 text-slate-300 cursor-grab" />
                    <span className="font-mono text-slate-500 font-bold">{i + 1}</span>
                  </div>
                </td>
                <td className="px-3.5 py-2.5 border-x border-slate-200 font-bold text-slate-900">
                  {m.name}
                </td>
                <td className="px-3.5 py-2.5 border-x border-slate-200 font-mono text-blue-600 text-[11px]">
                  {m.path}
                </td>
                <td className="px-3.5 py-2.5 border-x border-slate-200">
                  <div className="flex gap-1 flex-wrap">
                    {m.roles.map(r => (
                      <span key={r} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 font-bold">
                        {r}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3.5 py-2.5 border-x border-slate-200 text-center">
                  <button 
                    onClick={() => toggleVisible(m.id)}
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition cursor-pointer ${
                      m.visible 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {m.visible ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
                    <span>{m.visible ? 'Visible' : 'Hidden'}</span>
                  </button>
                </td>
                <td className="px-3.5 py-2.5 border-x border-slate-200 text-center bg-slate-50/30">
                  <div className="flex items-center justify-center gap-1.5">
                    <button 
                      onClick={() => setEditMenu({ ...m, roles: m.roles.join(', ') })} 
                      className="p-1 text-slate-500 hover:text-orange-600 transition cursor-pointer"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setDeleteMenu(m)} 
                      className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD MODAL */}
      {showAdd && (
        <MenuModal 
          title="Add New Master Menu" 
          data={form} 
          setData={setForm} 
          onSave={handleAdd} 
          onClose={() => setShowAdd(false)} 
          saveLabel="Add Menu" 
        />
      )}

      {/* EDIT MODAL */}
      {editMenu && (
        <MenuModal 
          title="Edit Menu Configuration" 
          data={editMenu} 
          setData={setEditMenu} 
          onSave={handleSaveEdit} 
          onClose={() => setEditMenu(null)} 
          saveLabel="Save Changes" 
          isEdit 
        />
      )}

      {/* DELETE MODAL */}
      {deleteMenu && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 text-center border border-slate-200">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3 border border-rose-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Remove Menu Item?</h3>
            <p className="text-xs text-slate-500 mb-5">
              Are you sure you want to remove <strong className="text-slate-800">{deleteMenu.name}</strong> ({deleteMenu.path}) from the platform master menus?
            </p>
            <div className="flex gap-2.5">
              <button 
                onClick={() => setDeleteMenu(null)} 
                className="flex-1 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

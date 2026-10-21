import React, { useState } from 'react';
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff, X, Save, AlertTriangle } from 'lucide-react';

const initMenus = [
  { id: 1, name: 'Dashboard', path: '/', icon: 'LayoutDashboard', visible: true, roles: ['superadmin'] },
  { id: 2, name: 'Schools', path: '/schools', icon: 'Building2', visible: true, roles: ['superadmin'] },
  { id: 3, name: 'Plans', path: '/plans', icon: 'Layers', visible: true, roles: ['superadmin'] },
  { id: 4, name: 'Team', path: '/team', icon: 'Users', visible: true, roles: ['superadmin', 'manager'] },
  { id: 5, name: 'Payments', path: '/payments', icon: 'CreditCard', visible: true, roles: ['superadmin', 'finance'] },
  { id: 6, name: 'Reports', path: '/reports', icon: 'BarChart3', visible: true, roles: ['superadmin', 'manager'] },
  { id: 7, name: 'Settings', path: '/settings', icon: 'Settings', visible: true, roles: ['superadmin'] },
  { id: 8, name: 'Support Tickets', path: '/support', icon: 'LifeBuoy', visible: true, roles: ['superadmin', 'support'] },
  { id: 9, name: 'Server Health', path: '/server', icon: 'Server', visible: false, roles: ['superadmin'] },
];

const allRoles = ['superadmin', 'manager', 'finance', 'support', 'developer'];
const emptyForm = { name: '', path: '', icon: '', roles: 'superadmin' };

const ModalForm = ({ title, data, setData, onSave, onClose, saveLabel }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-none shadow-2xl w-full max-w-sm">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <h2 className="font-bold text-gray-800">{title}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-none"><X className="w-5 h-5 text-gray-500" /></button>
      </div>
      <div className="p-5 space-y-4">
        {[
          { label: 'Menu Name', key: 'name', placeholder: 'e.g. Analytics' },
          { label: 'Path', key: 'path', placeholder: '/analytics' },
          { label: 'Icon Name', key: 'icon', placeholder: 'e.g. BarChart3' },
          { label: 'Roles (comma separated)', key: 'roles', placeholder: 'superadmin, manager' },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
            <input
              value={Array.isArray(data[f.key]) ? data[f.key].join(', ') : data[f.key] || ''}
              onChange={e => setData({ ...data, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        ))}
      </div>
      <div className="p-5 pt-0 flex gap-3">
        <button onClick={onSave} className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-none text-sm font-semibold">
          <Save className="w-4 h-4" /> {saveLabel}
        </button>
        <button onClick={onClose} className="px-5 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
      </div>
    </div>
  </div>
);

export default function MasterMenus() {
  const [menus, setMenus] = useState(initMenus);
  const [showAdd, setShowAdd] = useState(false);
  const [editMenu, setEditMenu] = useState(null);
  const [deleteMenu, setDeleteMenu] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const toggleVisible = (id) => setMenus(m => m.map(x => x.id === id ? { ...x, visible: !x.visible } : x));

  const handleAdd = () => {
    setMenus(m => [...m, { id: Date.now(), name: form.name, path: form.path, icon: form.icon, visible: true, roles: form.roles.split(',').map(r => r.trim()) }]);
    setShowAdd(false); setForm(emptyForm);
  };

  const handleSaveEdit = () => {
    setMenus(m => m.map(x => x.id === editMenu.id ? { ...editMenu, roles: typeof editMenu.roles === 'string' ? editMenu.roles.split(',').map(r => r.trim()) : editMenu.roles } : x));
    setEditMenu(null);
  };

  const handleDelete = () => {
    setMenus(m => m.filter(x => x.id !== deleteMenu.id));
    setDeleteMenu(null);
  };


  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Master Menus</h1>
          <p className="text-sm text-gray-500 mt-1">Control which menu items are visible and to whom</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setShowAdd(true); }} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-none text-sm font-semibold">
          <Plus className="w-4 h-4" /> Add Menu Item
        </button>
      </div>

      <div className="bg-white rounded-none border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Order', 'Menu Name', 'Path', 'Roles', 'Visible', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {menus.map((m, i) => (
              <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                    <span className="text-xs text-gray-400">{i + 1}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800">{m.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-blue-600">{m.path}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {m.roles.map(r => (
                      <span key={r} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-none font-semibold">{r}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleVisible(m.id)}
                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-none transition-colors ${m.visible ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {m.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {m.visible ? 'Visible' : 'Hidden'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setEditMenu({ ...m, roles: m.roles.join(', ') })} className="p-1.5 hover:bg-green-50 rounded-none text-green-500"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteMenu(m)} className="p-1.5 hover:bg-red-50 rounded-none text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && <ModalForm title="Add Menu Item" data={form} setData={setForm} onSave={handleAdd} onClose={() => setShowAdd(false)} saveLabel="Add Item" />}
      {editMenu && <ModalForm title="Edit Menu Item" data={editMenu} setData={setEditMenu} onSave={handleSaveEdit} onClose={() => setEditMenu(null)} saveLabel="Save Changes" />}

      {deleteMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-none flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="font-bold text-gray-800 text-lg mb-2">Delete Menu Item?</h2>
            <p className="text-sm text-gray-500 mb-6">Delete <span className="font-semibold text-gray-700">{deleteMenu.name}</span>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteMenu(null)} className="flex-1 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-none text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

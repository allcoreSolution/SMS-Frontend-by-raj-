import React, { useState } from 'react';
import {
  LayoutList, Save, Search, GripVertical, ChevronDown,
  ChevronRight, Trash2, Plus, X, Move
} from 'lucide-react';
import Swal from 'sweetalert2';
import { ALL_ITEMS } from './menuItems';


const ROLES = [
  '-- Select a Role to Edit --',
  'Super Admin',
  'School Admin',
  'Teacher',
  'Student',
  'Parent',
  'Accountant',
  'Librarian',
  'Driver',
  'Receptionist',
];

// Default structure for School Admin
const DEFAULT_STRUCTURE = {
  'Super Admin': [
    { id: 'dashboard', label: 'Dashboard', type: 'item', children: [] },
    { id: 'accounts-management', label: 'Accounts Management', type: 'header', badge: 'Header', children: [] },
    { id: 'academics', label: 'Academics', type: 'group', badge: 'Group', children: [
      { id: 'academic-dashboard', label: 'Academic Dashboard', type: 'item', children: [] },
      { id: 'academic-sessions', label: 'Academic Sessions', type: 'item', children: [] },
    ]},
    { id: 'attendance', label: 'Attendance', type: 'group', badge: 'Group', children: [
      { id: 'attendance-report', label: 'Attendance Report', type: 'item', children: [] },
    ]},
    { id: 'fee-collection', label: 'Fee Collection', type: 'item', children: [] },
    { id: 'reports', label: 'Reports', type: 'group', badge: 'Group', children: [] },
  ],
  'School Admin': [
    { id: 'dashboard', label: 'Dashboard', type: 'item', children: [] },
    { id: 'students', label: 'Students', type: 'group', badge: 'Group', children: [
      { id: 'admission-enquiries', label: 'Admission Enquiries', type: 'item', children: [] },
      { id: 'online-admission', label: 'Online Admission', type: 'item', children: [] },
    ]},
    { id: 'attendance', label: 'Attendance', type: 'group', badge: 'Group', children: [] },
    { id: 'fee-collection', label: 'Fee Collection', type: 'item', children: [] },
  ],
  'Teacher': [
    { id: 'teacher-dashboard', label: 'Teacher Dashboard', type: 'item', children: [] },
    { id: 'class-routine', label: 'Class Routine', type: 'item', children: [] },
    { id: 'assignments', label: 'Assignments', type: 'item', children: [] },
    { id: 'homework', label: 'Homework', type: 'item', children: [] },
    { id: 'attendance', label: 'Attendance', type: 'group', badge: 'Group', children: [] },
  ],
};

// Badge component
function Badge({ type }) {
  if (type === 'Group') return (
    <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-black bg-gray-700 text-white rounded-none-none uppercase tracking-wide">Group</span>
  );
  if (type === 'Header') return (
    <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-black bg-teal-500 text-white rounded-none-none uppercase tracking-wide">Header</span>
  );
  return null;
}

// Icon for item type
function ItemIcon({ type }) {
  if (type === 'group') return <LayoutList className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />;
  if (type === 'header') return <span className="w-3.5 h-3.5 flex-shrink-0 text-teal-500 font-black text-[10px] flex items-center">≡</span>;
  return <span className="w-3.5 h-3.5 flex-shrink-0 text-gray-400 text-[10px] flex items-center justify-center">⊡</span>;
}

// Recursive structure item
function StructureItem({ item, onRemove, depth = 0 }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className={`${depth > 0 ? 'ml-5 border-l border-dashed border-gray-200 pl-3' : ''}`}>
      <div className={`flex items-center gap-2 py-1.5 px-3 rounded-none-none group hover:bg-gray-50 cursor-default
        ${item.type === 'header' ? 'text-teal-600 font-black text-[11px] uppercase tracking-wide' : 'text-[13px] text-gray-700 font-medium'}`}>
        <GripVertical className="w-3.5 h-3.5 text-gray-300 cursor-grab flex-shrink-0" />
        {item.children?.length > 0
          ? <button onClick={() => setExpanded(e => !e)} className="focus:outline-none">
              {expanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
            </button>
          : <span className="w-3.5 flex-shrink-0" />}
        <ItemIcon type={item.type} />
        <span className="flex-1">{item.label}</span>
        {item.badge && <Badge type={item.badge} />}
        <button onClick={() => onRemove(item.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-none-none hover:bg-red-50 hover:text-red-500 text-gray-300">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      {expanded && item.children?.map(child => (
        <StructureItem key={child.id} item={child} onRemove={onRemove} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function MenuBuilderSettings() {
  const [role, setRole] = useState('-- Select a Role to Edit --');
  const [search, setSearch] = useState('');
  const [structure, setStructure] = useState([]);
  const [saved, setSaved] = useState(false);

  const filteredItems = ALL_ITEMS.filter(i =>
    i.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = (r) => {
    setRole(r);
    setStructure(r === '-- Select a Role to Edit --' ? [] : (DEFAULT_STRUCTURE[r] || []));
  };

  const addToStructure = (item) => {
    if (structure.find(s => s.id === item.id)) return;
    setStructure(prev => [...prev, { ...item, children: [] }]);
  };

  const removeFromStructure = (id) => {
    const remove = (items) => items.filter(i => i.id !== id).map(i => ({
      ...i, children: remove(i.children || [])
    }));
    setStructure(remove);
  };

  const handleSave = () => { 
    setSaved(true); 
    Swal.fire({
      icon: 'success',
      title: 'Menu Saved',
      text: 'Menu structure has been updated successfully.',
      timer: 1500,
      showConfirmButton: false
    });
    setTimeout(() => setSaved(false), 2500); 
  };

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 4rem)' }}>

        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <h1 className="text-2xl font-black text-gray-800">Ultimate Menu Builder</h1>
        </div>

        {/* Two-column body */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT — Available Items */}
          <div className="w-[420px] border-r border-gray-200 flex flex-col flex-shrink-0 bg-white">
            {/* Panel header */}
            <div className="px-5 py-3 border-b border-gray-100 bg-white flex-shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <LayoutList className="w-4 h-4 text-gray-600" />
                <span className="font-black text-gray-800 text-[14px]">Available Items</span>
              </div>
              <p className="text-[12px] text-gray-400 mb-2">Click items to add to the structure on the right.</p>
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search menu items..."
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-none-none text-[12px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-gray-50" />
                {search && <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  <X className="w-3 h-3" />
                </button>}
              </div>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto py-1">
              {filteredItems.map(item => {
                const alreadyAdded = structure.some(s => s.id === item.id);
                return (
                  <button key={item.id} onClick={() => addToStructure(item)} disabled={alreadyAdded}
                    className={`w-full text-left flex items-center gap-3 px-5 py-2 border-b border-gray-50 transition-colors text-[13px]
                      ${alreadyAdded
                        ? 'opacity-40 cursor-not-allowed bg-gray-50'
                        : 'hover:bg-blue-50 cursor-pointer group'}`}>
                    <GripVertical className="w-3.5 h-3.5 text-gray-200 group-hover:text-blue-300 flex-shrink-0" />
                    <ItemIcon type={item.type} />
                    <span className={`flex-1 font-medium ${item.type === 'header' ? 'text-teal-700 uppercase text-[11px] font-black tracking-wide' : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                    {item.badge && <Badge type={item.badge} />}
                    {!alreadyAdded && <Plus className="w-3.5 h-3.5 text-gray-200 group-hover:text-blue-400 flex-shrink-0" />}
                  </button>
                );
              })}
              {filteredItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Search className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-[12px]">No items match "{search}"</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Active Menu Structure */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Panel header with role dropdown + save */}
            <div className="px-6 py-3 border-b border-gray-100 bg-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Move className="w-4 h-4 text-gray-600" />
                <span className="font-black text-gray-800 text-[14px]">Active Menu Structure</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Role dropdown */}
                <div className="relative">
                  <select value={role} onChange={e => handleRoleChange(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-1.5 border border-gray-300 rounded-none-none text-[13px] text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer min-w-[200px]">
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {/* Save button */}
                <button onClick={handleSave}
                  className={`flex items-center gap-2 px-4 py-1.5 font-bold text-[13px] rounded-none-none transition-all text-white ${saved ? 'bg-green-500' : 'bg-green-500 hover:bg-green-600'}`}>
                  <Save className="w-3.5 h-3.5" /> {saved ? '✓ Saved!' : 'Save Menu'}
                </button>
              </div>
            </div>

            {/* Structure area */}
            <div className="flex-1 overflow-y-auto">
              {role === '-- Select a Role to Edit --' || structure.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  {role === '-- Select a Role to Edit --' ? (
                    <>
                      <LayoutList className="w-10 h-10 mb-3 opacity-20" />
                      <p className="text-[13px] text-teal-500">Please select a role to begin building its menu.</p>
                    </>
                  ) : (
                    <>
                      <Plus className="w-10 h-10 mb-3 opacity-20" />
                      <p className="text-[13px]">No items yet — click items on the left to add them.</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="p-4">
                  {/* Drop hint bar */}
                  <div className="border-2 border-dashed border-gray-200 rounded-none-none p-3 mb-3 text-center text-[12px] text-gray-300">
                    Click items from the left panel to add them here
                  </div>
                  {/* Items */}
                  <div className="space-y-0.5">
                    {structure.map(item => (
                      <StructureItem key={item.id} item={item} onRemove={removeFromStructure} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer stats */}
            {structure.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-2 flex items-center gap-4 flex-shrink-0 bg-gray-50">
                <span className="text-[11px] text-gray-500">{structure.length} top-level items</span>
                <span className="text-[11px] text-gray-300">|</span>
                <span className="text-[11px] text-gray-500">Role: <strong className="text-gray-700">{role}</strong></span>
                <button onClick={() => setStructure([])}
                  className="ml-auto text-[11px] text-red-400 hover:text-red-600 flex items-center gap-1 font-medium">
                  <Trash2 className="w-3 h-3" /> Clear All
                </button>
              </div>
            )}
          </div>

        </div>
    </div>
  );
}

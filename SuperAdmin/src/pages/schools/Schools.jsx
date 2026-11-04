import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, Search, Eye, Edit, Trash2, CheckCircle, 
  XCircle, Clock, X, Save, AlertTriangle, Mail, Info, 
  ChevronDown, Key, Copy, Lock, Phone, MapPin, Globe, Sparkles 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tenantService } from '../../api/tenantService';
import Swal from 'sweetalert2';
import { toArray } from '../../utils/helpers';

const planColors = { 
  Premium: 'bg-purple-50 text-purple-700 border-purple-200', 
  Standard: 'bg-blue-50 text-blue-700 border-blue-200', 
  Basic: 'bg-slate-100 text-slate-700 border-slate-200' 
};

const StatusBadge = ({ status }) => {
  if (status === 'Active') return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Active</span>;
  if (status === 'Inactive') return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Inactive</span>;
  if (status === 'Suspended') return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Suspended</span>;
  return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Pending</span>;
};

const emptyForm = { 
  name: '', email: '', phone: '', city: '', state: '', 
  address: '', website: '', plan: 'Basic', status: 'Active', 
  adminName: '', adminEmail: '', adminPassword: '', established: '', students: 0 
};

export default function Schools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [editSchool, setEditSchool] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const navigate = useNavigate();

  const filtered = schools.filter(s => {
    const q = search.toLowerCase();
    return (s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)) &&
      (filter === 'All' || s.status === filter);
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const res = await tenantService.getTenants();
      const mappedSchools = toArray(res).map(t => ({
        id: t._id,
        name: t.schoolName,
        email: t.email,
        phone: t.phone || 'N/A',
        city: t.city || 'N/A',
        state: t.state || 'N/A',
        address: t.address || 'N/A',
        website: t.website || 'N/A',
        plan: t.plan + ' Plan',
        status: t.status,
        adminName: t.adminName || 'Admin',
        established: t.established || '',
        students: t.studentsCount || 0,
        subscriptionEnd: t.subscriptionEnd ? new Date(t.subscriptionEnd).toLocaleDateString('en-IN') : null,
        joined: new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }));
      setSchools(mappedSchools);
    } catch (err) {
      console.error(err);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await tenantService.updateTenant(editSchool.id, {
        schoolName: editSchool.name,
        email: editSchool.email,
        phone: editSchool.phone,
        plan: editSchool.plan,
        status: editSchool.status,
        address: editSchool.address,
      });
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'School details have been updated.',
        confirmButtonColor: '#f97316'
      });
      setEditSchool(null);
      fetchTenants();
    } catch (err) {
      Swal.fire('Error!', err.response?.data?.message || err.message, 'error');
    }
  };

  const handleAdd = async () => {
    try {
      if (!form.name || !form.email) {
        return Swal.fire('Error', 'Please provide school name and email', 'warning');
      }
      await tenantService.createTenant({
        schoolName: form.name,
        email: form.email,
        phone: form.phone,
        plan: form.plan,
        status: form.status,
        address: form.address,
        adminName: form.adminName,
        adminPassword: form.adminPassword || 'School@123'
      });
      Swal.fire('Created!', 'New school registered successfully.', 'success');
      setShowAdd(false);
      setForm(emptyForm);
      fetchTenants();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  const handleDeleteClick = (school) => {
    Swal.fire({
      title: `Delete ${school.name}?`,
      text: 'This will permanently remove the school tenant and revoke student/staff logins.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, permanently delete!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await tenantService.deleteTenant(school.id);
          Swal.fire('Deleted!', 'The school has been removed from database.', 'success');
          fetchTenants();
        } catch (err) {
          Swal.fire('Error!', err.response?.data?.message || err.message, 'error');
        }
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 max-w-[1250px] w-full mx-auto min-h-[85vh]">
      {/* Modern Responsive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Manage Schools</h1>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {schools.length} total
          </span>
        </div>
        <button 
          onClick={() => { setForm(emptyForm); setShowAdd(true); }} 
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm shadow-orange-500/20 active:scale-95 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" /> 
          <span>Add New School</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 sm:gap-6 border-b border-slate-100 mb-5 overflow-x-auto scrollbar-none pb-1">
        {[
          { label: 'All', count: schools.length },
          { label: 'Active', count: schools.filter(s => s.status === 'Active').length },
          { label: 'Inactive', count: schools.filter(s => s.status === 'Inactive').length },
          { label: 'Pending', count: schools.filter(s => s.status === 'Pending').length },
        ].map(f => (
          <button key={f.label} onClick={() => setFilter(f.label)}
            className={`pb-2.5 text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 relative whitespace-nowrap cursor-pointer ${
              filter === f.label || (filter === 'All' && f.label === 'All') 
                ? 'text-orange-600 font-black' 
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}>
            <span>{f.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              filter === f.label || (filter === 'All' && f.label === 'All') 
                ? 'bg-orange-50 text-orange-600 font-bold' 
                : 'bg-slate-100 text-slate-500 font-medium'
            }`}>{f.count}</span>
            {(filter === f.label || (filter === 'All' && f.label === 'All')) && (
              <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-orange-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Search & Filter Section (Clean, Compact, Responsive) */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 mb-5">
        <div className="sm:col-span-7 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search school name or email..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 shadow-2xs" 
          />
        </div>

        <div className="sm:col-span-5 flex items-center gap-2">
          <select 
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-orange-500 shadow-2xs"
          >
            <option value="All">All Plans & Status</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
            <option value="Pending">Pending Only</option>
          </select>

          {search && (
            <button 
              onClick={() => setSearch('')} 
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer shrink-0"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* MOBILE SCHOOL CARDS VIEW (Clean on phones < 640px) */}
      <div className="sm:hidden space-y-3 mb-4">
        {loading ? (
          <div className="py-12 text-center text-xs font-bold text-slate-400">Loading schools...</div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400">No schools match search.</div>
        ) : (
          filtered.map(school => (
            <div key={school.id} className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs truncate">{school.name}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{school.email}</p>
                </div>
                <StatusBadge status={school.status} />
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200/60">
                <span className="font-semibold text-slate-700">{school.plan || 'Standard'}</span>
                <span className="text-slate-400 font-mono text-[10px]">ID: {typeof school.id === 'string' ? school.id.slice(-6) : school.id}</span>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-1.5 border-t border-slate-200/60">
                <button
                  onClick={() => navigate(`/schools/${school.id}`)}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Manage
                </button>
                <button
                  onClick={() => {
                    setEditSchool({
                      id: school.id,
                      name: school.name,
                      email: school.email,
                      phone: school.phone !== 'N/A' ? school.phone : '',
                      plan: school.plan.replace(' Plan', ''),
                      status: school.status
                    });
                  }}
                  className="p-1.5 text-slate-600 hover:text-orange-600 bg-white border border-slate-200 rounded-lg transition cursor-pointer"
                  title="Edit"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(school)}
                  className="p-1.5 text-rose-500 hover:text-rose-600 bg-white border border-slate-200 rounded-lg transition cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP TABLE VIEW (Visible >= 640px) */}
      <div className="hidden sm:block overflow-x-auto pb-4">
        <table className="w-full text-sm border-collapse border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
              <th className="text-left px-3.5 py-3 border-x border-slate-200">ID</th>
              <th className="text-left px-3.5 py-3 border-x border-slate-200">School Details</th>
              <th className="text-left px-3.5 py-3 border-x border-slate-200">Plan</th>
              <th className="text-center px-3.5 py-3 border-x border-slate-200">Status</th>
              <th className="text-left px-3.5 py-3 border-x border-slate-200">Registered</th>
              <th className="text-center px-3.5 py-3 border-x border-slate-200">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs font-bold text-slate-400">Loading schools...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-xs text-slate-400">No schools registered yet.</td>
              </tr>
            ) : (
              filtered.map(school => (
                <tr key={school.id} className="hover:bg-slate-50/70 transition-colors bg-white group">
                  <td className="px-3.5 py-3 text-slate-500 text-xs font-mono align-middle border-x border-slate-200 bg-slate-50/40 text-center">
                    <span className="truncate max-w-[50px] inline-block" title={school.id}>
                      {typeof school.id === 'string' ? school.id.substring(0, 6) : school.id}...
                    </span>
                  </td>
                  <td className="px-3.5 py-3 align-middle border-x border-slate-200">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-xs">{school.name}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5">{school.email}</span>
                    </div>
                  </td>
                  <td className="px-3.5 py-3 align-middle border-x border-slate-200">
                    <span className="inline-block px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {school.plan || "Standard"}
                    </span>
                  </td>
                  <td className="px-3.5 py-3 align-middle border-x border-slate-200 text-center">
                    <StatusBadge status={school.status} />
                  </td>
                  <td className="px-3.5 py-3 align-middle border-x border-slate-200 text-slate-600 text-xs whitespace-nowrap">
                    {school.joined.replace(',', '')}
                  </td>
                  <td className="px-3.5 py-3 align-middle border-x border-slate-200 text-center bg-slate-50/30">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => navigate(`/schools/${school.id}`)} 
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-200 transition cursor-pointer"
                      >
                        Manage
                      </button>
                      <button 
                        onClick={() => {
                          setEditSchool({
                            id: school.id,
                            name: school.name,
                            email: school.email,
                            phone: school.phone !== 'N/A' ? school.phone : '',
                            plan: school.plan.replace(' Plan', ''),
                            status: school.status
                          });
                        }} 
                        className="p-1 text-slate-400 hover:text-slate-800 transition cursor-pointer" 
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(school)} 
                        className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer" 
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editSchool && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 sticky top-0 bg-white">
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">Edit School Details</h2>
              <button onClick={() => setEditSchool(null)} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">School Name</label>
                <input 
                  type="text" 
                  value={editSchool.name || ''} 
                  onChange={e => setEditSchool({ ...editSchool, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email</label>
                <input 
                  type="email" 
                  value={editSchool.email || ''} 
                  onChange={e => setEditSchool({ ...editSchool, email: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Phone</label>
                <input 
                  type="text" 
                  value={editSchool.phone || ''} 
                  onChange={e => setEditSchool({ ...editSchool, phone: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Plan</label>
                <select 
                  value={editSchool.plan} 
                  onChange={e => setEditSchool({ ...editSchool, plan: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium"
                >
                  <option value="Basic">Basic Plan</option>
                  <option value="Standard">Standard Plan</option>
                  <option value="Premium">Premium Plan</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Status</label>
                <select 
                  value={editSchool.status} 
                  onChange={e => setEditSchool({ ...editSchool, status: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="p-4 sm:p-5 pt-0 flex gap-2.5">
              <button 
                onClick={handleSaveEdit} 
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
              <button 
                onClick={() => setEditSchool(null)} 
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SCHOOL MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 sticky top-0 bg-white">
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">Add New School Tenant</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">School Name *</label>
                <input 
                  type="text" 
                  value={form.name} 
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Modern Public School"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Official Email *</label>
                <input 
                  type="email" 
                  value={form.email} 
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@school.com"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Contact Phone</label>
                <input 
                  type="text" 
                  value={form.phone} 
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Subscription Plan</label>
                <select 
                  value={form.plan} 
                  onChange={e => setForm({ ...form, plan: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium"
                >
                  <option value="Basic">Basic Plan</option>
                  <option value="Standard">Standard Plan</option>
                  <option value="Premium">Premium Plan</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Initial Admin Name</label>
                <input 
                  type="text" 
                  value={form.adminName} 
                  onChange={e => setForm({ ...form, adminName: e.target.value })}
                  placeholder="Principal / Admin"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Default Password</label>
                <input 
                  type="password" 
                  value={form.adminPassword} 
                  onChange={e => setForm({ ...form, adminPassword: e.target.value })}
                  placeholder="School@123"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-orange-500 font-medium" 
                />
              </div>
            </div>
            <div className="p-4 sm:p-5 pt-0 flex gap-2.5">
              <button 
                onClick={handleAdd} 
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Register School
              </button>
              <button 
                onClick={() => setShowAdd(false)} 
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

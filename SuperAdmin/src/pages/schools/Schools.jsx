import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Eye, Edit, Trash2, CheckCircle, XCircle, Clock, X, Save, AlertTriangle, Mail, Info, ChevronDown, Key, Copy, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// schoolsData import removed â€” no dummy data
import { tenantService } from '../../api/tenantService';
import Swal from 'sweetalert2';
import { toArray } from '../../utils/helpers';

const planColors = { Premium: 'bg-purple-100 text-purple-700', Standard: 'bg-blue-100 text-blue-700', Basic: 'bg-gray-100 text-gray-600' };

const StatusBadge = ({ status }) => {
  if (status === 'Active') return <span className="bg-[#22c55e] text-white px-2 py-0.5 rounded-none text-[11px] font-bold">Active</span>;
  if (status === 'Inactive') return <span className="bg-red-500 text-white px-2 py-0.5 rounded-none text-[11px] font-bold">Inactive</span>;
  if (status === 'Suspended') return <span className="bg-orange-600 text-white px-2 py-0.5 rounded-none text-[11px] font-bold">Suspended</span>;
  return <span className="bg-orange-500 text-white px-2 py-0.5 rounded-none text-[11px] font-bold">Pending</span>;
};

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400 font-semibold mb-0.5">{label}</p>
    <p className="text-sm text-gray-800 font-medium">{value || 'â€”'}</p>
  </div>
);

const emptyForm = { name: '', email: '', phone: '', city: '', state: '', address: '', website: '', plan: 'Basic', status: 'Active', adminName: '', adminEmail: '', adminPassword: '', established: '', students: 0 };

const InputField = ({ label, name, value, onChange, type = 'text', options }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    {options ? (
      <select name={name} value={value} onChange={onChange} className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    ) : (
      <input type={type} name={name} value={value} onChange={onChange} className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300" />
    )}
  </div>
);

export default function Schools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [editSchool, setEditSchool] = useState(null);
  const [deleteSchool, setDeleteSchool] = useState(null);
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
      setSchools(mappedSchools); // Removing initSchools fallback so it correctly displays empty DB!
    } catch (err) {
      console.error(err);
      setSchools([]); // Fallback to empty instead of dummy if error
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
      if(!form.name || !form.email) return Swal.fire('Error', 'Fill school name and email', 'error');
      
      const payload = {
        schoolName: form.name,
        email: form.email,
        phone: form.phone,
        plan: form.plan.replace(' Plan', ''), // Basic, Enterprise
      };
      await tenantService.registerTenant(payload);
      Swal.fire({
        icon: 'success',
        title: 'School Added!',
        text: 'School successfully registered in Database!',
        confirmButtonColor: '#f97316'
      });
      fetchTenants(); // Reload Data
      setShowAdd(false);
      setForm(emptyForm);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: "Failed to register school: " + (err.response?.data?.message || err.message),
        confirmButtonColor: '#f97316'
      });
    }
  };

  const handleDeleteClick = (school) => {
    Swal.fire({
      title: 'Delete School?',
      text: `Are you sure you want to completely delete ${school.name}? This removes all data!`,
      icon: 'error',
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
    <div className="bg-white rounded-none border border-gray-100 shadow-sm p-6 max-w-[1150px] w-full mx-auto min-h-[85vh]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-end gap-3">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight leading-none">Manage Schools</h1>
          <span className="text-[13px] text-gray-500 font-medium pb-0.5">{schools.length} total</span>
        </div>
        <button onClick={() => { setForm(emptyForm); setShowAdd(true); }} className="flex items-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white px-4 py-2 rounded-none font-bold text-[13px] transition-colors shadow-sm">
          <Plus className="w-4 h-4" strokeWidth={3} /> Add New School
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-100 mb-6">
        {[
          { label: 'All', count: schools.length },
          { label: 'Active', count: schools.filter(s => s.status === 'Active').length },
          { label: 'Inactive', count: schools.filter(s => s.status === 'Inactive').length },
          { label: 'Pending', count: schools.filter(s => s.status === 'Pending').length },
        ].map(f => (
          <button key={f.label} onClick={() => setFilter(f.label)}
            className={`pb-3 text-[13px] font-bold transition-colors flex items-center gap-2 relative ${filter === f.label || (filter === 'All' && f.label === 'All') ? 'text-[#0891b2]' : 'text-gray-500 hover:text-gray-700'}`}>
            <span>{f.label}</span>
            <span className={filter === f.label || (filter === 'All' && f.label === 'All') ? 'text-[#0891b2]' : 'text-gray-300 font-medium'}>{f.count}</span>
            {(filter === f.label || (filter === 'All' && f.label === 'All')) && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0891b2]"></div>}
          </button>
        ))}
      </div>

      {/* Table Section */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search name or email..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-none text-[13px] focus:outline-none focus:ring-1 focus:ring-[#0891b2] w-full" />
          </div>
          <div className="flex gap-2">
             <select className="border border-gray-200 rounded-none px-4 py-2 text-[13px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0891b2] min-w-[120px] bg-white">
               <option>Plan</option>
             </select>
             <select className="border border-gray-200 rounded-none px-4 py-2 text-[13px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0891b2] min-w-[120px] bg-white">
               <option>Registered</option>
             </select>
             <select className="border border-gray-200 rounded-none px-4 py-2 text-[13px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0891b2] min-w-[120px] bg-white">
               <option>Sort</option>
             </select>
             <button className="bg-[#0891b2] hover:bg-cyan-700 text-white px-6 py-2 rounded-none text-[13px] font-bold transition-colors shadow-sm ml-1">
               Search
             </button>
          </div>
        </div>

        <div className="overflow-x-auto pb-4">
          <table className="w-full text-sm border-collapse border border-slate-300 shadow-sm bg-white">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-300">
                {['ID', 'School Details', 'Plan', 'Status', 'DB Rows', 'Registered', 'Subscription', 'Action'].map((h, i) => (
                  <th key={h} className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      {h}
                      {h === 'DB Rows' && <Info className="w-4 h-4 text-slate-400" />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((school, i) => {
                                return (
                  <tr key={school.id} className="hover:bg-slate-50 transition-colors bg-white group border-b border-slate-200">
                    <td className="px-3 py-2.5 text-slate-500 text-[13px] font-medium align-middle w-12 border-x border-slate-200 bg-slate-50/50 text-center">
                      <span className="truncate max-w-[50px] inline-block" title={school.id}>{typeof school.id === 'number' ? school.id : school.id.substring(0, 5)}...</span>
                    </td>
                    <td className="px-3 py-2.5 align-middle border-x border-slate-200">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-[13px]">{school.name}</span>
                        <span className="text-[12px] text-slate-500 mt-0.5">{school.email}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 align-middle border-x border-slate-200">
                      <span className="text-slate-700 text-[13px] font-medium whitespace-nowrap">{school.plan || "—"}</span>
                    </td>
                    <td className="px-3 py-2.5 align-middle border-x border-slate-200 text-center">
                      <StatusBadge status={school.status} />
                    </td>
                    <td className="px-3 py-2.5 align-middle border-x border-slate-200 font-mono text-slate-700 text-[13px] text-right bg-slate-50/30">
                      {"—"}
                    </td>
                    <td className="px-3 py-2.5 align-middle border-x border-slate-200 text-slate-600 text-[13px] whitespace-nowrap">
                      {school.joined.replace(',', '')}
                    </td>
                    <td className="px-3 py-2.5 align-middle border-x border-slate-200 text-slate-600 text-[13px] whitespace-nowrap">
                      {school.subscriptionEnd || "—"}
                    </td>
                    <td className="px-3 py-2.5 align-middle border-x border-slate-200 text-center bg-slate-50/50">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => navigate(`/schools/${school.id}`)} className="text-[#0891b2] hover:text-cyan-700 text-[13px] font-bold hover:underline underline-offset-2">
                          Manage
                        </button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => {
                          setEditSchool({
                            id: school.id,
                            name: school.name,
                            email: school.email,
                            phone: school.phone !== 'N/A' ? school.phone : '',
                            plan: school.plan.replace(' Plan', ''),
                            status: school.status
                          });
                        }} className="text-orange-500 hover:text-orange-600 transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteClick(school)} className="text-red-500 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editSchool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-bold text-gray-800">Edit School</h2>
              <button onClick={() => setEditSchool(null)} className="p-2 hover:bg-gray-100 rounded-none"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              {[
                { label: 'School Name', name: 'name' }, { label: 'Email', name: 'email', type: 'email' },
                { label: 'Phone', name: 'phone' }, { label: 'City', name: 'city' },
                { label: 'State', name: 'state' }, { label: 'Website', name: 'website' },
                { label: 'Admin Name', name: 'adminName' }, { label: 'Established', name: 'established' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  <input type={f.type || 'text'} value={editSchool[f.name] || ''} onChange={e => setEditSchool({ ...editSchool, [f.name]: e.target.value })}
                    className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
              ))}
              {[
                { label: 'Plan', name: 'plan', options: ['Basic', 'Standard', 'Premium'] },
                { label: 'Status', name: 'status', options: ['Active', 'Inactive', 'Pending'] },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  <select value={editSchool[f.name]} onChange={e => setEditSchool({ ...editSchool, [f.name]: e.target.value })}
                    className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300">
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Address</label>
                <textarea value={editSchool.address || ''} onChange={e => setEditSchool({ ...editSchool, address: e.target.value })} rows={2}
                  className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={handleSaveEdit} className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-none text-sm font-semibold">
                <Save className="w-4 h-4" /> Save Changes
              </button>
              <button onClick={() => setEditSchool(null)} className="px-5 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-bold text-gray-800">Add New School</h2>
              <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 rounded-none"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              {[
                { label: 'School Name *', name: 'name' }, { label: 'Email *', name: 'email', type: 'email' },
                { label: 'Phone', name: 'phone' }, { label: 'City', name: 'city' },
                { label: 'State', name: 'state' }, { label: 'Website', name: 'website' },
                { label: 'Admin Name', name: 'adminName' }, { label: 'Established Year', name: 'established' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  <input type={f.type || 'text'} value={form[f.name] || ''} onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                    className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
              ))}
              {[
                { label: 'Plan', name: 'plan', options: ['Basic', 'Standard', 'Premium'] },
                { label: 'Status', name: 'status', options: ['Active', 'Inactive', 'Pending'] },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  <select value={form[f.name]} onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                    className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300">
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Address</label>
                <textarea value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} rows={2}
                  className="w-full border border-gray-200 rounded-none px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={handleAdd} className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-none text-sm font-semibold">
                <Plus className="w-4 h-4" /> Add School
              </button>
              <button onClick={() => setShowAdd(false)} className="px-5 py-2 border border-gray-200 rounded-none text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



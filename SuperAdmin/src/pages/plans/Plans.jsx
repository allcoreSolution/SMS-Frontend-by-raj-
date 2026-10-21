import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, CheckCircle, X, Save, AlertTriangle, ChevronDown, Wand2, EyeOff, Globe } from 'lucide-react';
import { planService } from '../../api/planService';
import Swal from 'sweetalert2';

export default function Plans() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [plans, setPlans] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', type: 'Paid', visibility: 'Public', capacity: 'Billed per student', storage: '5 GB', monthly: '', yearly: ''
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await planService.getPlans();
      if(res.data && res.data.length > 0) {
        setPlans(res.data.map(p => ({
          id: p._id,
          name: p.name,
          type: p.description || 'Paid',
          visibility: p.isActive ? 'Public' : 'Hidden',
          capacity: `Up to ${p.maxStudents} students`,
          storage: '5 GB',
          monthly: p.monthlyPrice.toString(),
          yearly: p.yearlyPrice.toString(),
          isTrial: p.description?.includes('Trial')
        })));
      } else {
        setPlans([]); // Fallback removed
      }
    } catch (err) {
      setPlans([]); // Fallback removed
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name || editPlan?.name,
        description: formData.type || editPlan?.type || 'Paid',
        monthlyPrice: Number(formData.monthly || editPlan?.monthly || 0),
        yearlyPrice: Number(formData.yearly || editPlan?.yearly || 0),
        maxStudents: 500
      };
      
      if(editPlan && editPlan.id?.length > 10) { // update real ID
        await planService.updatePlan(editPlan.id, payload);
      } else {
        await planService.createPlan(payload);
      }
      
      fetchPlans();
      setShowAdd(false);
      setEditPlan(null);
      setFormData({ name: '', type: 'Paid', visibility: 'Public', capacity: 'Billed per student', storage: '5 GB', monthly: '', yearly: '' });
      Swal.fire({ icon: 'success', title: 'Success', text: 'Plan Saved successfully!', confirmButtonColor: '#0891b2' });
    } catch(err) {
      Swal.fire({ icon: 'error', title: 'Error', text: "Error saving plan: " + err.message, confirmButtonColor: '#0891b2' });
    }
  };

  const filtered = plans.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q);
    if (filter === 'Paid') return matchSearch && p.type.toLowerCase().includes('paid');
    if (filter === 'Trial') return matchSearch && p.type.toLowerCase().includes('trial');
    if (filter === 'Popular') return matchSearch && p.visibility === 'Public';
    return matchSearch;
  });
  
  return (
    <div className="bg-white rounded-none border border-gray-100 shadow-sm p-6 max-w-[1150px] w-full mx-auto min-h-[85vh]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-end gap-3">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight leading-none">Subscription Plans</h1>
          <span className="text-[13px] text-gray-500 font-medium pb-0.5">{plans.length} total</span>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white px-4 py-2 rounded-none font-bold text-[13px] transition-colors shadow-sm">
          <Plus className="w-4 h-4" strokeWidth={3} /> Add New Plan
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-100 mb-6">
        {[
          { label: 'All', count: plans.length },
          { label: 'Paid', count: plans.filter(p => p.type.toLowerCase().includes('paid')).length },
          { label: 'Trial', count: plans.filter(p => p.type.toLowerCase().includes('trial')).length },
          { label: 'Popular', count: plans.filter(p => p.visibility === 'Public').length },
        ].map(f => (
          <button key={f.label} onClick={() => setFilter(f.label)}
            className={`pb-3 text-[13px] font-bold transition-colors flex items-center gap-2 relative ${filter === f.label ? 'text-[#0891b2]' : 'text-gray-500 hover:text-gray-700'}`}>
            <span>{f.label}</span>
            <span className={filter === f.label ? 'text-[#0891b2]' : 'text-gray-300 font-medium'}>{f.count}</span>
            {filter === f.label && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0891b2]"></div>}
          </button>
        ))}
      </div>

      {/* Table Section */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search plans..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-none text-[13px] text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-1 focus:ring-[#0891b2] w-full" />
          </div>
          <div className="flex gap-2">
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
                {['ID', 'Plan Name', 'Type', 'Visibility', 'Capacity', 'Storage', 'Monthly Price', 'Yearly Price', 'Action'].map((h, i) => (
                  <th key={h} className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((plan, i) => (
                <tr key={plan.id} className="hover:bg-slate-50 transition-colors bg-white group border-b border-slate-200">
                  <td className="px-3 py-2.5 text-slate-500 text-[13px] font-medium align-middle w-12 border-x border-slate-200 bg-slate-50/50 text-center truncate max-w-[60px]" title={plan.id}>
                    #{typeof plan.id === 'number' ? plan.id : plan.id.substring(0, 4)}
                  </td>
                  
                  <td className="px-3 py-2.5 align-middle border-x border-slate-200">
                    <span className="font-bold text-slate-800 text-[13px] leading-snug">{plan.name}</span>
                  </td>
                  
                  <td className="px-3 py-2.5 align-middle border-x border-slate-200">
                    {plan.isTrial ? (
                       <span className="inline-flex items-center gap-1.5 border border-[#0891b2]/30 bg-[#0891b2]/5 text-[#0891b2] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                         <Wand2 className="w-3 h-3" /> {plan.type}
                       </span>
                    ) : (
                       <span className="inline-flex items-center gap-1.5 border border-slate-200 bg-slate-50 text-slate-700 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                         {plan.type}
                       </span>
                    )}
                  </td>
                  
                  <td className="px-3 py-2.5 align-middle border-x border-slate-200">
                    {plan.visibility === 'Public' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-[12px] font-bold uppercase tracking-wider">
                         <Globe className="w-3.5 h-3.5" /> Public
                       </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 text-[12px] font-bold uppercase tracking-wider">
                         <EyeOff className="w-3.5 h-3.5" /> Hidden
                       </span>
                    )}
                  </td>
                  
                  <td className="px-3 py-2.5 align-middle border-x border-slate-200 text-slate-700 font-medium text-[13px]">
                     {plan.capacity}
                  </td>
                  
                  <td className="px-3 py-2.5 align-middle border-x border-slate-200 font-mono text-slate-700 text-[13px] text-right bg-slate-50/30">
                    {plan.storage}
                  </td>
                  
                  <td className="px-3 py-2.5 align-middle border-x border-slate-200">
                    <span className="font-mono text-emerald-600 text-[13px] font-bold">₹{plan.monthly}</span>
                    <span className="text-[11px] text-slate-400 font-medium ml-1">/stu</span>
                  </td>
                  
                  <td className="px-3 py-2.5 align-middle border-x border-slate-200">
                    <span className="font-mono text-emerald-600 text-[13px] font-bold">₹{plan.yearly}</span>
                    <span className="text-[11px] text-slate-400 font-medium ml-1">/stu</span>
                  </td>
                  
                  <td className="px-3 py-2.5 align-middle border-x border-slate-200 text-center bg-slate-50/50">
                    <button onClick={() => setEditPlan(plan)} className="text-[#0891b2] hover:text-cyan-700 text-[13px] font-bold hover:underline underline-offset-2">
                       Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PLAN MODAL */}
      {(showAdd || editPlan) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
              <h2 className="font-bold text-gray-800 text-lg">{editPlan ? 'Edit Plan' : 'Add New Plan'}</h2>
              <button onClick={() => { setShowAdd(false); setEditPlan(null); }} className="p-2 hover:bg-gray-100 rounded-none"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 bg-slate-50">
              <div className="grid grid-cols-2 gap-5 mb-5 bg-white p-5 border border-slate-200">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Plan Name</label>
                  <input required value={formData.name || editPlan?.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 px-3 py-2 text-[13px] text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-[#0891b2] focus:ring-1 focus:ring-[#0891b2]" placeholder="e.g. Starter Plan" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Type</label>
                  <select value={formData.type || editPlan?.type || 'Paid'} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border border-gray-200 px-3 py-2 text-[13px] text-slate-900 bg-white focus:outline-none focus:border-[#0891b2] focus:ring-1 focus:ring-[#0891b2]">
                    <option>Paid</option>
                    <option>Trial - 14 days</option>
                    <option>Trial - 7 days</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Visibility</label>
                  <select value={formData.visibility || editPlan?.visibility || 'Public'} onChange={e => setFormData({...formData, visibility: e.target.value})} className="w-full border border-gray-200 px-3 py-2 text-[13px] text-slate-900 bg-white focus:outline-none focus:border-[#0891b2] focus:ring-1 focus:ring-[#0891b2]">
                    <option>Public</option>
                    <option>Hidden</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 mb-5 bg-white p-5 border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Capacity</label>
                  <select value={formData.capacity || editPlan?.capacity || 'Billed per student'} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full border border-gray-200 px-3 py-2 text-[13px] text-slate-900 bg-white focus:outline-none focus:border-[#0891b2] focus:ring-1 focus:ring-[#0891b2]">
                    <option>Billed per student</option>
                    <option>Up to 100 students</option>
                    <option>Up to 400 students</option>
                    <option>Custom Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Storage Quota</label>
                  <input required value={formData.storage || editPlan?.storage || '5 GB'} onChange={e => setFormData({...formData, storage: e.target.value})} className="w-full border border-gray-200 px-3 py-2 text-[13px] text-slate-900 bg-white focus:outline-none focus:border-[#0891b2] focus:ring-1 focus:ring-[#0891b2]" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Monthly Price (₹)</label>
                  <input required type="number" value={formData.monthly || editPlan?.monthly?.replace(',','') || ''} onChange={e => setFormData({...formData, monthly: e.target.value})} className="w-full border border-gray-200 px-3 py-2 text-[13px] font-mono text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-[#0891b2] focus:ring-1 focus:ring-[#0891b2]" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Yearly Price (₹)</label>
                  <input required type="number" value={formData.yearly || editPlan?.yearly?.replace(',','') || ''} onChange={e => setFormData({...formData, yearly: e.target.value})} className="w-full border border-gray-200 px-3 py-2 text-[13px] font-mono text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-[#0891b2] focus:ring-1 focus:ring-[#0891b2]" placeholder="0.00" />
                </div>
              </div>
            </form>
            
            <div className="p-5 flex gap-3 border-t border-gray-100 bg-white">
              <button type="button" onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 bg-[#0891b2] hover:bg-cyan-700 text-white py-2.5 rounded-none text-[13px] font-bold transition-colors">
                Save Plan Details
              </button>
              <button onClick={() => { setShowAdd(false); setEditPlan(null); }} className="px-5 py-2.5 border border-gray-200 rounded-none text-[13px] font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tags, Save, ArrowLeft, CheckCircle2, Lightbulb } from 'lucide-react';
import Swal from 'sweetalert2';
import AccountsTabs from '../../components/accounts/AccountsTabs';
import { accountsService } from '../../api/accountsService';

const AddNewIncomeHead = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire('Name Required', 'Please enter income head name.', 'warning');
      return;
    }

    try {
      setLoading(true);
      const res = await accountsService.createIncomeHead(formData);
      if (res && res.success) {
        await Swal.fire({
          title: 'Income Head Created!',
          text: `"${formData.name}" added to income categories.`,
          icon: 'success',
          confirmButtonColor: '#4f46e5'
        });
        navigate('/accounts/income-heads');
      }
    } catch (err) {
      console.error('Error creating income head:', err);
      Swal.fire('Failed', err?.response?.data?.message || 'Could not save income head', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto bg-slate-50/60 min-h-screen text-slate-800 pb-24 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/accounts/income-heads')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-xs"
            title="Back to Income Heads"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Create New Income Head</h1>
            <p className="text-xs text-slate-500">Group institutional income records under a recognized category</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <AccountsTabs />

      {/* Form Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-8 bg-white rounded-3xl shadow-xs border border-slate-200/80 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Income Head Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Government SSA Aid, Alumni Donations, Event Sponsorship..."
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Description / Purpose
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what kind of receipts should be classified under this head..."
                rows="3"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/accounts/income-heads')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-all disabled:opacity-60"
              >
                <Save className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Creating...' : 'Save Income Head'}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Tips & Instructions */}
        <div className="lg:col-span-4 bg-indigo-50/60 rounded-3xl p-6 border border-indigo-100 flex flex-col justify-between">
          <div className="space-y-3 text-xs text-indigo-950">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-2 shadow-sm shadow-indigo-500/20">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm">Best Accounting Practice</h3>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Income heads correspond to your general ledger revenue categories. When creating a new head, keep it descriptive so audit reports and the annual balance sheet categorize school revenue accurately.
            </p>
          </div>
          <div className="pt-4 text-[11px] text-indigo-700 font-semibold">
            ACS Educational ERP • Chart of Accounts
          </div>
        </div>

      </div>

    </div>
  );
};

export default AddNewIncomeHead;

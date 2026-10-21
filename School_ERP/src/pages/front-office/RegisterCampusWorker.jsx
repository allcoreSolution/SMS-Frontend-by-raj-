import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  HardHat, Save, ArrowLeft, ShieldCheck, 
  Calendar, Phone, Building, UserCheck
} from 'lucide-react';
import Swal from 'sweetalert2';
import { frontOfficeService } from '../../api/frontOfficeService';

const RegisterCampusWorker = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: 'Housekeeping',
    contractor: 'Campus Facilities Service',
    validDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    policeCheck: 'Verified',
    state: 'Active',
    notes: ''
  });

  useEffect(() => {
    if (id) {
      loadWorker();
    }
  }, [id]);

  const loadWorker = async () => {
    try {
      const res = await frontOfficeService.getCampusWorkerById(id);
      if (res.success && res.data) {
        const w = res.data;
        setFormData({
          name: w.name || '',
          phone: w.phone || '',
          type: w.type || 'Housekeeping',
          contractor: w.contractor || 'Campus Facilities Service',
          validDate: w.validDate ? new Date(w.validDate).toISOString().slice(0, 10) : '',
          policeCheck: w.policeCheck || 'Verified',
          state: w.state || 'Active',
          notes: w.notes || ''
        });
      }
    } catch (err) {
      console.error('Failed to load worker:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return Swal.fire('Error', 'Please provide worker name', 'warning');
    }

    try {
      setLoading(true);
      let res;
      if (id) {
        res = await frontOfficeService.updateCampusWorker(id, formData);
      } else {
        res = await frontOfficeService.createCampusWorker(formData);
      }

      if (res.success) {
        await Swal.fire({
          title: id ? 'Worker Updated!' : 'Worker Registered!',
          text: `Badge assigned: ${res.data?.badgeNo || 'CW-PASS'}`,
          icon: 'success',
          confirmButtonColor: '#6366F1',
          customClass: { popup: 'rounded-2xl' }
        });
        navigate('/front-office/campus-workers');
      } else {
        Swal.fire('Error', res.message || 'Operation failed', 'error');
      }
    } catch (err) {
      console.error('Save error:', err);
      Swal.fire('Error', 'An error occurred while saving worker', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-y-auto">
      {/* Top Header */}
      <div className="px-8 pt-6 pb-6 bg-white border-b border-slate-200/80 shrink-0">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/front-office/campus-workers')}
            className="p-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 transition shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {id ? 'Edit Campus Worker' : 'Register Campus Worker'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Contract and vendor staff management & police verification</p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="p-8 w-full max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <HardHat className="w-5 h-5 text-indigo-600" /> Worker Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Work Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                >
                  <option value="Housekeeping">Housekeeping / Cleaning</option>
                  <option value="Security">Security Guard</option>
                  <option value="Maintenance">Maintenance & Repairs</option>
                  <option value="Gardener">Gardener</option>
                  <option value="Driver">Transport Driver / Conductor</option>
                  <option value="Electrician">Electrician / Plumber</option>
                  <option value="Catering">Canteen / Catering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Contractor / Agency
                </label>
                <input
                  type="text"
                  name="contractor"
                  placeholder="e.g. Apex Facility Services"
                  value={formData.contractor}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pass Validity Until
                </label>
                <input
                  type="date"
                  name="validDate"
                  value={formData.validDate}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Police Verification Status <span className="text-rose-500">*</span>
                </label>
                <select
                  name="policeCheck"
                  value={formData.policeCheck}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                >
                  <option value="Verified">Verified (Official clearance on file)</option>
                  <option value="Pending">Pending Verification</option>
                  <option value="Not verified">Not Verified</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Account Status
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                >
                  <option value="Active">Active (Permitted on campus)</option>
                  <option value="Expired">Expired</option>
                  <option value="Blocked">Blocked (Restricted Entry)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Special Notes / ID Proof Details
              </label>
              <textarea
                name="notes"
                rows="3"
                placeholder="Aadhaar/Voter ID details, emergency contact, supervisor name..."
                value={formData.notes}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition resize-none"
              ></textarea>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/front-office/campus-workers')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : id ? 'Update Worker' : 'Register Worker'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterCampusWorker;

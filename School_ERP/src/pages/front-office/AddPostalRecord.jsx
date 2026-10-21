import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Mail, Save, ArrowLeft, Send, Inbox, 
  Lock, Calendar, MapPin, Building, Truck
} from 'lucide-react';
import Swal from 'sweetalert2';
import { frontOfficeService } from '../../api/frontOfficeService';

const AddPostalRecord = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: 'Receive',
    referenceNo: '',
    fromTitle: '',
    toTitle: '',
    address: '',
    date: new Date().toISOString().slice(0, 10),
    confidential: false,
    postalProvider: 'Speed Post / Courier',
    notes: ''
  });

  useEffect(() => {
    if (isEditMode) {
      loadPostalRecord();
    }
  }, [id]);

  const loadPostalRecord = async () => {
    try {
      const res = await frontOfficeService.getPostalRecordById(id);
      if (res.success && res.data) {
        const r = res.data;
        setFormData({
          type: r.type || 'Receive',
          referenceNo: r.referenceNo || '',
          fromTitle: r.fromTitle || '',
          toTitle: r.toTitle || '',
          address: r.address || '',
          date: r.date ? new Date(r.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          confidential: !!r.confidential,
          postalProvider: r.postalProvider || 'Speed Post / Courier',
          notes: r.notes || ''
        });
      }
    } catch (err) {
      console.error('Failed to load postal record:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.referenceNo.trim()) {
      return Swal.fire('Error', 'Please provide tracking or reference number', 'warning');
    }
    if (!formData.fromTitle.trim() || !formData.toTitle.trim()) {
      return Swal.fire('Error', 'Please provide sender and recipient details', 'warning');
    }

    try {
      setLoading(true);
      let res;
      if (isEditMode) {
        res = await frontOfficeService.updatePostalRecord(id, formData);
      } else {
        res = await frontOfficeService.addPostalRecord(formData);
      }

      if (res.success) {
        await Swal.fire({
          title: isEditMode ? 'Postal Record Updated!' : 'Postal Entry Logged!',
          text: `Logged as ${formData.type === 'Receive' ? 'Incoming parcel' : 'Outgoing dispatch'}.`,
          icon: 'success',
          confirmButtonColor: '#6366F1',
          customClass: { popup: 'rounded-2xl' }
        });
        navigate('/front-office/postal-records');
      } else {
        Swal.fire('Error', res.message || 'Operation failed', 'error');
      }
    } catch (err) {
      console.error('Save error:', err);
      Swal.fire('Error', 'An error occurred while saving postal record', 'error');
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
            onClick={() => navigate('/front-office/postal-records')}
            className="p-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 transition shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {isEditMode ? 'Edit Postal Record' : 'Add Postal Record'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Log inward parcel receipt or outward courier dispatch</p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="p-8 w-full max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" /> Dispatch & Consignment Details
            </h2>

            {/* Type selector pills */}
            <div className="flex gap-4">
              <label className={`flex-1 p-3.5 rounded-xl border cursor-pointer flex items-center justify-center gap-2.5 transition font-bold text-xs ${
                formData.type === 'Receive' 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="Receive"
                  checked={formData.type === 'Receive'}
                  onChange={handleChange}
                  className="hidden"
                />
                <Inbox className="w-4 h-4 text-emerald-600" /> Incoming / Received
              </label>

              <label className={`flex-1 p-3.5 rounded-xl border cursor-pointer flex items-center justify-center gap-2.5 transition font-bold text-xs ${
                formData.type === 'Dispatch' 
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-800 shadow-sm' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="Dispatch"
                  checked={formData.type === 'Dispatch'}
                  onChange={handleChange}
                  className="hidden"
                />
                <Send className="w-4 h-4 text-indigo-600" /> Outgoing / Dispatched
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Reference / Tracking No <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="referenceNo"
                  placeholder="e.g. SP-99812-IN or DTDC-1092"
                  value={formData.referenceNo}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Courier / Postal Provider
                </label>
                <input
                  type="text"
                  name="postalProvider"
                  placeholder="e.g. Speed Post, Blue Dart, Hand Delivered"
                  value={formData.postalProvider}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  From (Sender) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fromTitle"
                  placeholder="e.g. CBSE Regional Office, Delhi"
                  value={formData.fromTitle}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  To (Recipient) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="toTitle"
                  placeholder="e.g. Principal / Examination Department"
                  value={formData.toTitle}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Date of Consignment
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2.5 cursor-pointer bg-slate-50 p-3 rounded-xl border border-slate-200 w-full">
                  <input
                    type="checkbox"
                    name="confidential"
                    checked={formData.confidential}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Mark as Confidential Document</span>
                    <span className="text-[11px] text-slate-400 block">Restricts viewing to administrative staff</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Delivery Address / Destination
              </label>
              <input
                type="text"
                name="address"
                placeholder="Full street address or branch department..."
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Remarks / Contents
              </label>
              <textarea
                name="notes"
                rows="3"
                placeholder="Description of contents (e.g. certificates, books, exam question papers)..."
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
              onClick={() => navigate('/front-office/postal-records')}
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
              {loading ? 'Saving...' : isEditMode ? 'Update Record' : 'Save Postal Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPostalRecord;

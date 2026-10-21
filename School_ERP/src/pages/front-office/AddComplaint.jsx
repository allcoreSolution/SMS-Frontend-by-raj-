import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  AlertCircle, Save, ArrowLeft, ShieldAlert, 
  Calendar, Phone, User, MessageSquare
} from 'lucide-react';
import Swal from 'sweetalert2';
import { frontOfficeService } from '../../api/frontOfficeService';

const AddComplaint = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    complainantName: '',
    phone: '',
    complaintType: 'Facilities',
    priority: 'Medium',
    assignedTo: 'Administrative Officer',
    date: new Date().toISOString().slice(0, 10),
    status: 'Open',
    description: '',
    actionTaken: ''
  });

  useEffect(() => {
    if (isEditMode) {
      loadComplaint();
    }
  }, [id]);

  const loadComplaint = async () => {
    try {
      const res = await frontOfficeService.getComplaintById(id);
      if (res.success && res.data) {
        const c = res.data;
        setFormData({
          complainantName: c.complainantName || '',
          phone: c.phone || '',
          complaintType: c.complaintType || 'Facilities',
          priority: c.priority || 'Medium',
          assignedTo: c.assignedTo || 'Administrative Officer',
          date: c.date ? new Date(c.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          status: c.status || 'Open',
          description: c.description || '',
          actionTaken: c.actionTaken || ''
        });
      }
    } catch (err) {
      console.error('Failed to load complaint:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.complainantName.trim()) {
      return Swal.fire('Error', 'Please provide complainant name', 'warning');
    }
    if (!formData.description.trim()) {
      return Swal.fire('Error', 'Please provide complaint description', 'warning');
    }

    try {
      setLoading(true);
      let res;
      if (isEditMode) {
        res = await frontOfficeService.updateComplaint(id, formData);
      } else {
        res = await frontOfficeService.addComplaint(formData);
      }

      if (res.success) {
        await Swal.fire({
          title: isEditMode ? 'Complaint Updated!' : 'Complaint Logged!',
          text: `Ticket has been recorded under ${formData.complaintType}.`,
          icon: 'success',
          confirmButtonColor: '#6366F1',
          customClass: { popup: 'rounded-2xl' }
        });
        navigate('/front-office/complaints');
      } else {
        Swal.fire('Error', res.message || 'Operation failed', 'error');
      }
    } catch (err) {
      console.error('Save error:', err);
      Swal.fire('Error', 'An error occurred while saving complaint', 'error');
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
            onClick={() => navigate('/front-office/complaints')}
            className="p-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 transition shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {isEditMode ? 'Edit Complaint' : 'Log New Complaint'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Record parent, student, or staff grievance ticket</p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="p-8 w-full max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-indigo-600" /> Complaint Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Complainant Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="complainantName"
                  placeholder="e.g. Ramesh Verma (Parent)"
                  value={formData.complainantName}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Phone Number
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
                  Complaint Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="complaintType"
                  value={formData.complaintType}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                >
                  <option value="Facilities">Facilities & Cleanliness</option>
                  <option value="Academic">Academic / Syllabus</option>
                  <option value="Transport">School Bus / Transport</option>
                  <option value="Fee & Finance">Fee & Accounts</option>
                  <option value="Discipline">Discipline / Safety</option>
                  <option value="Canteen">Canteen / Food Quality</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Priority Level <span className="text-rose-500">*</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent / Immediate Attention</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Assign To
                </label>
                <input
                  type="text"
                  name="assignedTo"
                  placeholder="e.g. Transport Manager, Admin Office"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Incident / Filing Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              {isEditMode && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Ticket Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                  >
                    <option value="Open">Open</option>
                    <option value="In-Progress">In-Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                rows="4"
                placeholder="Describe the complaint in detail..."
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition resize-none"
              ></textarea>
            </div>

            {isEditMode && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Action Taken / Resolution Notes
                </label>
                <textarea
                  name="actionTaken"
                  rows="3"
                  placeholder="Notes on investigation or corrective action executed..."
                  value={formData.actionTaken}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition resize-none"
                ></textarea>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/front-office/complaints')}
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
              {loading ? 'Saving...' : isEditMode ? 'Update Complaint' : 'Log Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddComplaint;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserCheck, Save, ArrowLeft, Info, Clock } from 'lucide-react';
import Swal from 'sweetalert2';
import { frontOfficeService } from '../../api/frontOfficeService';

const AddVisitorEntry = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    purpose: '',
    meetingWith: 'Principal Office',
    visitorType: 'Parent',
    idProof: 'Aadhaar Card',
    idNumber: '',
    numberOfPersons: 1,
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadVisitor();
    }
  }, [id]);

  const loadVisitor = async () => {
    try {
      const res = await frontOfficeService.getVisitorById(id);
      if (res.success && res.data) {
        const v = res.data;
        setFormData({
          name: v.name || '',
          phone: v.phone || '',
          purpose: v.purpose || '',
          meetingWith: v.meetingWith || 'Principal Office',
          visitorType: v.visitorType || 'Parent',
          idProof: v.idProof || 'Aadhaar Card',
          idNumber: v.idNumber || '',
          numberOfPersons: v.numberOfPersons || 1,
          notes: v.notes || ''
        });
      }
    } catch (err) {
      console.error('Failed to load visitor for editing:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.purpose.trim()) {
      Swal.fire({
        title: 'Missing Required Fields',
        text: 'Please provide Visitor Name, Contact Phone, and Purpose of Visit.',
        icon: 'warning',
        customClass: { popup: 'rounded-2xl' }
      });
      return;
    }

    try {
      setSubmitting(true);
      let res;
      if (isEditMode) {
        res = await frontOfficeService.updateVisitor(id, formData);
      } else {
        res = await frontOfficeService.addVisitor(formData);
      }

      if (res.success) {
        await Swal.fire({
          title: isEditMode ? 'Visitor Updated!' : 'Visitor Logged!',
          text: `Visitor Pass "${res.data?.badgeNumber || 'Pass'}" for ${formData.name}.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
        navigate('/front-office/visitor-book');
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Failed to check-in visitor',
        icon: 'error',
        customClass: { popup: 'rounded-2xl' }
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/20 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={() => navigate('/front-office/visitor-book')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Visitor Book
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Check-In Visitor
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Issue a visitor security badge, log government ID verification, and record meeting destination.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Visitor Pass Information</h2>
              <p className="text-[11px] text-slate-500">Guest identity and purpose verification</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Visitor Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Rajiv Nair"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Contact Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9811223344"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Visitor Classification
                </label>
                <select
                  name="visitorType"
                  value={formData.visitorType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-semibold text-slate-800 bg-white"
                >
                  <option value="Parent">Parent / Guardian</option>
                  <option value="Vendor">Vendor / Contractor</option>
                  <option value="Official">Government / Board Official</option>
                  <option value="Guest">Guest / Alumni</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Meeting With / Destination <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="meetingWith"
                  value={formData.meetingWith}
                  onChange={handleChange}
                  placeholder="e.g. Principal Office, Accounts Officer, PGT Chemistry"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-semibold text-slate-800 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Purpose of Visit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="e.g. Fee Consultation, Uniform Samples, CBSE Inspection"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ID Proof Type
                </label>
                <select
                  name="idProof"
                  value={formData.idProof}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 bg-white font-medium text-slate-700"
                >
                  <option value="Aadhaar Card">Aadhaar Card</option>
                  <option value="Driving License">Driving License</option>
                  <option value="Voter ID">Voter ID</option>
                  <option value="PAN Card">PAN Card</option>
                  <option value="Government ID">Government ID</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ID Card Number (Optional)
                </label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  placeholder="e.g. XXXX-1234"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  No. of Persons
                </label>
                <input
                  type="number"
                  name="numberOfPersons"
                  min="1"
                  max="10"
                  value={formData.numberOfPersons}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Reception Remarks / Escort Details
              </label>
              <textarea
                name="notes"
                rows="2"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Optional notes regarding escort passes or campus safety protocol..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 bg-white"
              ></textarea>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/front-office/visitor-book')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-200 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {submitting ? 'Checking In...' : 'Issue Badge & Check-in'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-5 text-xs text-indigo-950 space-y-3">
            <div className="flex items-center gap-2 font-bold text-indigo-700 text-sm">
              <Info className="w-4 h-4" /> Visitor Security Guidelines
            </div>
            <p className="leading-relaxed text-indigo-900/80">
              Badge numbers are auto-generated sequentially for security audit reconciliation.
            </p>
            <p className="leading-relaxed text-indigo-900/80">
              Ensure physical ID verification is performed before issuing entrance passes to classrooms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVisitorEntry;

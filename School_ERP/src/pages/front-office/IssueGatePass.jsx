import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Save, ArrowLeft, User, ShieldCheck, 
  Clock, AlertCircle, Sparkles, Building, UserCheck
} from 'lucide-react';
import Swal from 'sweetalert2';
import { frontOfficeService } from '../../api/frontOfficeService';

const IssueGatePass = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    personName: '',
    personType: 'Student',
    classSection: 'Class II A',
    reason: 'Parent pickup',
    authorizedBy: 'Principal Office',
    leavingAt: new Date().toISOString().slice(0, 16),
    expectedReturnTime: '',
    comingBackToday: false,
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.personName.trim()) {
      return Swal.fire('Error', 'Please enter person/student name.', 'warning');
    }

    try {
      setLoading(true);
      const payload = {
        personName: formData.personName.trim(),
        personType: formData.personType,
        classSection: formData.classSection,
        reason: formData.reason,
        authorizedBy: formData.authorizedBy || 'Principal Office',
        outTime: formData.leavingAt ? new Date(formData.leavingAt) : new Date(),
        expectedReturnTime: formData.comingBackToday && formData.expectedReturnTime ? new Date(formData.expectedReturnTime) : null,
        status: 'Approved',
        notes: formData.notes
      };

      const res = await frontOfficeService.createGatePass(payload);
      if (res.success) {
        await Swal.fire({
          title: 'Gate Pass Issued!',
          text: `Pass No: ${res.data?.passNo || 'Generated'}`,
          icon: 'success',
          confirmButtonColor: '#6366F1',
          customClass: { popup: 'rounded-2xl' }
        });
        navigate('/front-office/gate-passes');
      } else {
        Swal.fire('Error', res.message || 'Failed to issue gate pass', 'error');
      }
    } catch (err) {
      console.error('Failed to issue gate pass:', err);
      Swal.fire('Error', 'An error occurred while creating gate pass', 'error');
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
            onClick={() => navigate('/front-office/gate-passes')}
            className="p-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 transition shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Issue Gate Pass</h1>
            <p className="text-xs text-slate-500 mt-0.5">Authorise student or staff departure before official dispersal</p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="p-8 w-full max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" /> Pass Credentials
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Person Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="personType"
                  value={formData.personType}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                >
                  <option value="Student">Student Exit Pass</option>
                  <option value="Staff">Staff / Faculty Early Leave</option>
                  <option value="Visitor">Visitor Gate Out</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="personName"
                  placeholder="e.g. Ishaan Gupta / Rohit Verma"
                  value={formData.personName}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Class & Section / Designation
                </label>
                <input
                  type="text"
                  name="classSection"
                  placeholder="e.g. Class II A / PRT Teacher"
                  value={formData.classSection}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Departure Reason <span className="text-rose-500">*</span>
                </label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                >
                  <option value="Parent pickup">Parent pickup</option>
                  <option value="Sick / unwell">Sick / unwell</option>
                  <option value="Doctor appointment">Doctor appointment</option>
                  <option value="Official duty">Official duty</option>
                  <option value="Personal emergency">Personal emergency</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Leaving Time
                </label>
                <input
                  type="datetime-local"
                  name="leavingAt"
                  value={formData.leavingAt}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Authorized By
                </label>
                <input
                  type="text"
                  name="authorizedBy"
                  placeholder="Principal / Academic Coordinator"
                  value={formData.authorizedBy}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Coming back check */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="comingBackToday"
                  checked={formData.comingBackToday}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-bold text-slate-700">Expected to return to campus today?</span>
              </label>

              {formData.comingBackToday && (
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Expected Return Time
                  </label>
                  <input
                    type="datetime-local"
                    name="expectedReturnTime"
                    value={formData.expectedReturnTime}
                    onChange={handleChange}
                    className="max-w-xs w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Remarks / Collector Information
              </label>
              <textarea
                name="notes"
                rows="3"
                placeholder="Collector relation, phone number, vehicle details, or health remarks..."
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
              onClick={() => navigate('/front-office/gate-passes')}
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
              {loading ? 'Issuing Pass...' : 'Issue Gate Pass'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueGatePass;

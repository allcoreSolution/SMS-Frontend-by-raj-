import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  User, CheckCircle2, PhoneCall, ArrowLeft, 
  FileText, Calendar, Mail, Tag, Clock, Save, Edit3
} from 'lucide-react';
import Swal from 'sweetalert2';
import { frontOfficeService } from '../../api/frontOfficeService';

const EnquiryDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState('');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchEnquiry();
  }, [id]);

  const fetchEnquiry = async () => {
    try {
      setLoading(true);
      const res = await frontOfficeService.getEnquiryById(id);
      if (res.success && res.data) {
        setEnquiry(res.data);
        setStatus(res.data.status || 'Pending');
        setNextFollowUp(res.data.nextFollowUp ? res.data.nextFollowUp.split('T')[0] : '');
        setNotes(res.data.notes || '');
      }
    } catch (err) {
      console.error('Failed to load enquiry:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const res = await frontOfficeService.updateEnquiry(id, {
        status,
        nextFollowUp: nextFollowUp || null,
        notes
      });
      if (res.success) {
        Swal.fire({
          title: 'Updated!',
          text: 'Enquiry details and status updated.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
        fetchEnquiry();
      }
    } catch (err) {
      Swal.fire({ title: 'Error', text: 'Update failed', icon: 'error', customClass: { popup: 'rounded-2xl' } });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading enquiry profile...</div>;
  }

  if (!enquiry) {
    return <div className="p-8 text-center text-slate-400">Enquiry record not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/20 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={() => navigate('/front-office/admission-enquiries')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Enquiries
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Enquiry: {enquiry.studentName}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              enquiry.status === 'Admitted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
              enquiry.status === 'Followed-up' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
              enquiry.status === 'Lost' ? 'bg-red-50 text-red-700 border border-red-200' :
              'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {enquiry.status}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Registered on {new Date(enquiry.enquiryDate).toLocaleDateString()} via {enquiry.source}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50/75 border-b border-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Candidate & Family Information</h2>
            </div>

            <div className="p-6 divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="font-semibold text-slate-500">Student Name</span>
                <span className="font-extrabold text-slate-900">{enquiry.studentName}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-semibold text-slate-500">Class / Grade Applied</span>
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{enquiry.classApplied}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-semibold text-slate-500">Parent / Guardian Name</span>
                <span className="font-bold text-slate-800">{enquiry.parentName}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-semibold text-slate-500">Contact Phone</span>
                <span className="font-mono font-bold text-slate-800">{enquiry.phone}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-semibold text-slate-500">Email Address</span>
                <span className="text-slate-800">{enquiry.email || 'Not provided'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-semibold text-slate-500">Lead Channel / Source</span>
                <span className="text-slate-800">{enquiry.source}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-semibold text-slate-500">Assigned Counselor</span>
                <span className="font-semibold text-slate-800">{enquiry.assignedTo || 'Counselor Ananya'}</span>
              </div>
              <div className="py-2.5 flex flex-col gap-1">
                <span className="font-semibold text-slate-500">Parent Notes / Query</span>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-1">
                  {enquiry.notes || 'No notes logged.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Update Status & Next Follow-Up */}
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-indigo-600" /> Update Lead Status
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Current Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Pending">Pending (New)</option>
                  <option value="Followed-up">Followed-up</option>
                  <option value="Admitted">Admitted</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Next Follow-Up Date</label>
                <input
                  type="date"
                  value={nextFollowUp}
                  onChange={(e) => setNextFollowUp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Add Counselor Remarks</label>
                <textarea
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes from today's phone call or campus meeting..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <button
                onClick={handleUpdate}
                disabled={updating}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-200 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {updating ? 'Saving...' : 'Update Enquiry'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryDetails;

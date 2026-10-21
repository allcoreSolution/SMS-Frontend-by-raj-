import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, AlertCircle, Phone, User, Calendar, 
  Clock, CheckCircle2, Edit, Trash2, Printer, ShieldAlert, FileText, Send
} from 'lucide-react';
import Swal from 'sweetalert2';
import { frontOfficeService } from '../../api/frontOfficeService';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const res = await frontOfficeService.getComplaintById(id);
      if (res.success && res.data) {
        setComplaint(res.data);
        setNewStatus(res.data.status || 'Open');
        setActionNotes(res.data.actionTaken || '');
      } else {
        setError('Complaint ticket not found.');
      }
    } catch (err) {
      console.error('Failed to load complaint:', err);
      setError('Failed to fetch complaint details.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!complaint) return;

    try {
      setUpdating(true);
      const res = await frontOfficeService.updateComplaint(complaint._id || complaint.id, {
        status: newStatus,
        actionTaken: actionNotes
      });
      if (res.success) {
        Swal.fire({
          title: 'Ticket Updated!',
          text: `Status changed to ${newStatus}.`,
          icon: 'success',
          timer: 1600,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
        fetchComplaint();
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to update ticket.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!complaint) return;
    const result = await Swal.fire({
      title: 'Delete Ticket?',
      text: `Permanently delete complaint by ${complaint.complainantName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await frontOfficeService.deleteComplaint(complaint._id || complaint.id);
        if (res.success) {
          await Swal.fire({
            title: 'Deleted!',
            text: 'Complaint record removed.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          navigate('/front-office/complaints');
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to delete complaint.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-sm">Loading complaint ticket...</p>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="bg-rose-50 border border-rose-200 p-8 rounded-2xl text-rose-700">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-rose-500" />
          <h2 className="text-lg font-bold">Ticket Not Found</h2>
          <p className="text-sm mt-1">{error || 'This complaint record does not exist.'}</p>
          <button
            onClick={() => navigate('/front-office/complaints')}
            className="mt-5 px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition"
          >
            Back to Complaints
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5"/> Open</span>;
      case 'In-Progress':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> In-Progress</span>;
      case 'Resolved':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> Resolved</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold px-3 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/front-office/complaints')}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Complaint Ticket #{complaint._id?.slice(-6).toUpperCase()}
              </h1>
              {getStatusBadge(complaint.status)}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{complaint.complaintType} • Priority: {complaint.priority}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate(`/front-office/complaints/edit/${complaint._id || complaint.id}`)}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
          >
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
          >
            <Printer className="w-4 h-4" /> Print Ticket
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl border border-rose-200 transition"
            title="Delete Ticket"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-indigo-600" /> Ticket Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Complainant Name</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">{complaint.complainantName}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">{complaint.phone || 'N/A'}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Department / Category</span>
                <span className="text-sm font-bold text-indigo-700 mt-0.5 block">{complaint.complaintType}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Assigned Officer</span>
                <span className="text-sm font-semibold text-slate-700 mt-0.5 block">{complaint.assignedTo || 'Unassigned'}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Logged Date</span>
                <span className="text-sm font-semibold text-slate-700 mt-0.5 block">
                  {complaint.date ? new Date(complaint.date).toLocaleDateString() : 'Today'}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Priority</span>
                <span className={`text-sm font-bold mt-0.5 block ${
                  complaint.priority === 'Urgent' ? 'text-rose-600' :
                  complaint.priority === 'High' ? 'text-amber-600' : 'text-slate-700'
                }`}>
                  {complaint.priority}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Description</span>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                {complaint.description}
              </div>
            </div>

            {complaint.actionTaken && (
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Action Taken So Far</span>
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-xs text-emerald-900 leading-relaxed">
                  {complaint.actionTaken}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Quick Status Updater */}
        <div>
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" /> Resolution Workflow
            </h3>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Update Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                >
                  <option value="Open">Open</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Resolution Notes / Action Taken
                </label>
                <textarea
                  rows="4"
                  placeholder="Enter remarks or actions taken to resolve..."
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 transition flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                {updating ? 'Updating...' : 'Save Resolution'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ComplaintDetails;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Printer, LogOut, CheckCircle2, XCircle, 
  User, Clock, ShieldCheck, AlertCircle, FileText, Calendar
} from 'lucide-react';
import Swal from 'sweetalert2';
import { frontOfficeService } from '../../api/frontOfficeService';

const GatePassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pass, setPass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPass();
  }, [id]);

  const fetchPass = async () => {
    try {
      setLoading(true);
      const res = await frontOfficeService.getGatePassById(id);
      if (res.success && res.data) {
        setPass(res.data);
      } else {
        setError('Gate pass record not found.');
      }
    } catch (err) {
      console.error('Failed to load pass details:', err);
      setError('Failed to fetch pass details.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!pass) return;
    const actionText = newStatus === 'Out' ? 'Mark as Out of Campus' : newStatus === 'Returned' ? 'Mark as Returned' : 'Cancel Gate Pass';
    const result = await Swal.fire({
      title: `${actionText}?`,
      text: `Update pass status to "${newStatus}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366F1',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Confirm',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await frontOfficeService.updateGatePassStatus(pass._id || pass.id, { status: newStatus });
        if (res.success) {
          Swal.fire({
            title: 'Updated!',
            text: `Pass status set to ${newStatus}.`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          fetchPass();
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to update pass status.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-sm">Loading gate pass details...</p>
        </div>
      </div>
    );
  }

  if (error || !pass) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="bg-rose-50 border border-rose-200 p-8 rounded-2xl text-rose-700">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-rose-500" />
          <h2 className="text-lg font-bold">Record Not Found</h2>
          <p className="text-sm mt-1">{error || 'This pass entry does not exist.'}</p>
          <button
            onClick={() => navigate('/front-office/gate-passes')}
            className="mt-5 px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition"
          >
            Back to Gate Passes
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> Approved</span>;
      case 'Out':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"><LogOut className="w-3.5 h-3.5"/> Out on Campus</span>;
      case 'Returned':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> Returned</span>;
      case 'Cancelled':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5"/> Cancelled</span>;
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
            onClick={() => navigate('/front-office/gate-passes')}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight font-mono">{pass.passNo}</h1>
              {getStatusBadge(pass.status)}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{pass.personType || 'Student'} Early Departure Authorization</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {pass.status === 'Approved' && (
            <button
              onClick={() => handleStatusChange('Out')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <LogOut className="w-4 h-4" /> Mark Out
            </button>
          )}
          {pass.status === 'Out' && (
            <button
              onClick={() => handleStatusChange('Returned')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <CheckCircle2 className="w-4 h-4" /> Mark Returned
            </button>
          )}
          {pass.status !== 'Cancelled' && pass.status !== 'Returned' && (
            <button
              onClick={() => handleStatusChange('Cancelled')}
              className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
            >
              <XCircle className="w-4 h-4" /> Cancel Pass
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
          >
            <Printer className="w-4 h-4" /> Print Voucher
          </button>
        </div>
      </div>

      {/* Pass Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details & Audit Trail */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" /> Individual & Exit Info
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Authorized Individual</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">{pass.personName}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Class / Department</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">{pass.classSection || 'N/A'}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Category</span>
                <span className="text-sm font-medium text-slate-700 mt-0.5 block">{pass.personType || 'Student'}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Reason For Departure</span>
                <span className="text-sm font-bold text-indigo-700 mt-0.5 block">{pass.reason}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Authorized By</span>
                <span className="text-sm font-semibold text-slate-700 mt-0.5 block">{pass.authorizedBy || 'Principal Office'}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Issue Date</span>
                <span className="text-sm font-medium text-slate-700 mt-0.5 block">
                  {pass.createdAt ? new Date(pass.createdAt).toLocaleDateString() : 'Today'}
                </span>
              </div>
            </div>

            {pass.notes && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Remarks / Collector</span>
                <p className="text-xs text-slate-600 leading-relaxed">{pass.notes}</p>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" /> Gate Time Log
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 block">Out Time</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                  {pass.outTime ? new Date(pass.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : 'Pending departure'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 block">Expected Return</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                  {pass.expectedReturnTime ? new Date(pass.expectedReturnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : 'Not returning today'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 block">Actual Return</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                  {pass.actualReturnTime ? new Date(pass.actualReturnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : (pass.status === 'Out' ? 'Currently Out' : '--')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Printable Pass Voucher */}
        <div>
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-6 shadow-sm space-y-4 print:border-solid print:border-black">
            <div className="text-center border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full inline-block mb-1">
                CAMPUS EXIT VOUCHER
              </span>
              <h3 className="text-base font-bold text-slate-800">ALL CORE SOLUTION</h3>
              <p className="text-[10px] text-slate-400">Security & Gate Management</p>
            </div>

            <div className="text-center py-2 bg-slate-50 rounded-xl">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">Pass Number</span>
              <span className="text-sm font-mono font-black text-indigo-700 tracking-wider">{pass.passNo}</span>
            </div>

            <div className="space-y-2 text-xs border-b border-slate-100 pb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Name:</span>
                <span className="font-bold text-slate-800">{pass.personName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Class/Role:</span>
                <span className="font-semibold text-slate-700">{pass.classSection || pass.personType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reason:</span>
                <span className="font-semibold text-slate-700">{pass.reason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-slate-800">{pass.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Out Time:</span>
                <span className="font-medium text-slate-700">
                  {pass.outTime ? new Date(pass.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <div className="font-mono text-xs tracking-widest text-slate-400">||| |||| || | |||| |||</div>
              <p className="text-[10px] text-slate-400 mt-2 italic">Approved by {pass.authorizedBy || 'Principal'}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GatePassDetails;

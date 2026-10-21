import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Printer, LogOut, Phone, User, Calendar, 
  Clock, ShieldCheck, FileText, CheckCircle2, AlertCircle, Building
} from 'lucide-react';
import Swal from 'sweetalert2';
import { frontOfficeService } from '../../api/frontOfficeService';

const VisitorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVisitor();
  }, [id]);

  const fetchVisitor = async () => {
    try {
      setLoading(true);
      const res = await frontOfficeService.getVisitorById(id);
      if (res.success && res.data) {
        setVisitor(res.data);
      } else {
        setError('Visitor record not found.');
      }
    } catch (err) {
      console.error('Failed to fetch visitor:', err);
      setError('Failed to load visitor details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!visitor) return;
    const result = await Swal.fire({
      title: 'Confirm Visitor Check-Out?',
      text: `Mark ${visitor.name} as departed from campus?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366F1',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Check Out',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await frontOfficeService.checkoutVisitor(visitor._id || visitor.id);
        if (res.success) {
          Swal.fire({
            title: 'Checked Out!',
            text: 'Visitor checkout recorded successfully.',
            icon: 'success',
            timer: 1800,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          fetchVisitor();
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to check out visitor.', 'error');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-sm">Loading visitor pass...</p>
        </div>
      </div>
    );
  }

  if (error || !visitor) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="bg-rose-50 border border-rose-200 p-8 rounded-2xl text-rose-700">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-rose-500" />
          <h2 className="text-lg font-bold">Record Not Found</h2>
          <p className="text-sm mt-1">{error || 'This visitor entry could not be located.'}</p>
          <button
            onClick={() => navigate('/front-office/visitor-book')}
            className="mt-5 px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition"
          >
            Back to Visitor Book
          </button>
        </div>
      </div>
    );
  }

  const isCheckedIn = visitor.status === 'In' || !visitor.checkOutTime;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/front-office/visitor-book')}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">Visitor Pass Details</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                isCheckedIn 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {isCheckedIn ? 'Currently on Campus (In)' : 'Departed (Checked Out)'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Pass ID: {visitor.badgeNumber || visitor._id?.slice(-8).toUpperCase()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isCheckedIn && (
            <button
              onClick={handleCheckout}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition"
            >
              <LogOut className="w-4 h-4" /> Check Out Visitor
            </button>
          )}
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition"
          >
            <Printer className="w-4 h-4" /> Print Visitor Pass
          </button>
        </div>
      </div>

      {/* Main Grid: Card + Badge View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Comprehensive Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" /> Personal & Meeting Info
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Full Name</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">{visitor.name}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">{visitor.phone || 'N/A'}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Meeting With</span>
                <span className="text-sm font-bold text-indigo-700 mt-0.5 block">{visitor.personToMeet || 'School Staff'}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Purpose</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block capitalize">{visitor.purpose || 'Official Visit'}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Govt / ID Card Number</span>
                <span className="text-sm font-medium text-slate-700 mt-0.5 block">{visitor.idCardNumber || 'N/A'}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">No. of Persons</span>
                <span className="text-sm font-medium text-slate-700 mt-0.5 block">{visitor.numberOfPersons || 1} Person(s)</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Vehicle Number</span>
                <span className="text-sm font-medium text-slate-700 mt-0.5 block">{visitor.vehicleNumber || 'No Vehicle'}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Badge Number</span>
                <span className="text-sm font-bold text-indigo-600 mt-0.5 block font-mono">
                  {visitor.badgeNumber || 'VP-001'}
                </span>
              </div>
            </div>

            {visitor.notes && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Remarks / Notes</span>
                <p className="text-sm text-slate-600 leading-relaxed">{visitor.notes}</p>
              </div>
            )}
          </div>

          {/* Timings Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" /> Gate Log Timeline
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm">
              <div className="flex items-start gap-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-emerald-800 block">Check-In Time</span>
                  <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                    {visitor.checkInTime ? new Date(visitor.checkInTime).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="p-2 bg-slate-200 text-slate-700 rounded-lg">
                  <LogOut className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">Check-Out Time</span>
                  <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                    {visitor.checkOutTime ? new Date(visitor.checkOutTime).toLocaleString() : 'Still On Campus'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Printable Badge View */}
        <div>
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden print:shadow-none print:border print:border-slate-300">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            
            <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-4">
              <div>
                <h3 className="text-base font-black tracking-wider uppercase">VISITOR PASS</h3>
                <p className="text-[11px] text-indigo-200">Campus Entry Authorization</p>
              </div>
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>

            <div className="flex flex-col items-center text-center py-2">
              <div className="w-20 h-20 rounded-2xl bg-white/10 border-2 border-white/30 flex items-center justify-center font-bold text-2xl shadow-inner mb-3">
                {visitor.name?.charAt(0).toUpperCase()}
              </div>
              <h4 className="text-lg font-bold text-white">{visitor.name}</h4>
              <p className="text-xs text-indigo-200 mt-0.5">{visitor.phone}</p>
              
              <div className="mt-3 px-3 py-1 bg-white/20 rounded-full text-xs font-mono tracking-widest font-bold">
                {visitor.badgeNumber || 'VP-PASS'}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/20 space-y-2 text-xs">
              <div className="flex justify-between text-indigo-100">
                <span>Meeting:</span>
                <span className="font-semibold text-white">{visitor.personToMeet || 'Staff'}</span>
              </div>
              <div className="flex justify-between text-indigo-100">
                <span>Purpose:</span>
                <span className="font-semibold text-white capitalize">{visitor.purpose || 'Official'}</span>
              </div>
              <div className="flex justify-between text-indigo-100">
                <span>Date:</span>
                <span className="font-semibold text-white">
                  {visitor.checkInTime ? new Date(visitor.checkInTime).toLocaleDateString() : new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-indigo-100">
                <span>Time In:</span>
                <span className="font-semibold text-white">
                  {visitor.checkInTime ? new Date(visitor.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-dashed border-white/20 text-center">
              <div className="text-[10px] uppercase tracking-widest text-indigo-200 font-mono">
                * PLEASE RETURN TO SECURITY DESK ON EXIT *
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorDetails;

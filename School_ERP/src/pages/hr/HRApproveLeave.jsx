import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, X, Search, RefreshCw, Calendar, 
  User, Check, AlertCircle, FileText, Clock, Filter
} from 'lucide-react';
import Swal from 'sweetalert2';
import HRTabs from '../../components/hr/HRTabs';
import { hrService } from '../../api/hrService';

export default function HRApproveLeave() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLeaves();
  }, [selectedStatus]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await hrService.getLeaves({
        status: selectedStatus !== 'All' ? selectedStatus : undefined
      });
      const list = Array.isArray(res) ? res : (res?.data || []);
      setLeaves(list);
    } catch (err) {
      console.error('Error fetching leaves:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error Loading Leaves',
        text: err?.response?.data?.message || err.message,
        confirmButtonColor: '#7c3aed'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, staffName) => {
    const { value: remarks } = await Swal.fire({
      title: 'Approve Leave Request?',
      text: `Grant leave approval for ${staffName || 'Staff Member'}`,
      input: 'text',
      inputLabel: 'Approval Remarks (Optional)',
      inputPlaceholder: 'e.g. Approved by HR Administrator',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Approve'
    });

    if (remarks !== undefined) {
      try {
        await hrService.approveLeave(id, remarks);
        Swal.fire({ icon: 'success', title: 'Leave Approved', timer: 1400, showConfirmButton: false });
        fetchLeaves();
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Failed', text: err?.response?.data?.message || err.message });
      }
    }
  };

  const handleReject = async (id, staffName) => {
    const { value: remarks } = await Swal.fire({
      title: 'Reject Leave Request?',
      text: `Reject leave application for ${staffName || 'Staff Member'}`,
      input: 'text',
      inputLabel: 'Reason for Rejection',
      inputPlaceholder: 'e.g. Academic examination schedule ongoing',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Reject',
      inputValidator: (val) => {
        if (!val) return 'Please provide reason for rejection';
      }
    });

    if (remarks) {
      try {
        await hrService.rejectLeave(id, remarks);
        Swal.fire({ icon: 'success', title: 'Leave Rejected', timer: 1400, showConfirmButton: false });
        fetchLeaves();
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Failed', text: err?.response?.data?.message || err.message });
      }
    }
  };

  const filteredLeaves = leaves.filter(l => {
    const staffName = l.staffId?.fullName || l.staffId?.firstName || 'Staff';
    return !searchQuery || 
      staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.reason && l.reason.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.leaveType && l.leaveType.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans pb-16">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                Leave Approvals & Requests
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Review employee leave applications, verify attendance balances, and issue approvals
              </p>
            </div>
          </div>

          <button 
            onClick={fetchLeaves}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <HRTabs />

        {/* Filter and Search Box */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by staff name, reason, or policy type..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 self-center">
              {['Pending', 'Approved', 'Rejected', 'All'].map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedStatus === status
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leaves Cards Grid */}
        <div>
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-14 text-center">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-600 mx-auto mb-2" />
              <span className="font-medium text-xs text-slate-400">Loading leave applications...</span>
            </div>
          ) : filteredLeaves.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-14 text-center">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <span className="font-bold text-slate-700 text-sm block">No Leave Requests Found</span>
              <span className="text-xs text-slate-400">No applications match the current filter.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLeaves.map((leave) => {
                const staff = leave.staffId;
                const staffName = staff?.fullName || staff?.firstName || 'Staff Member';
                const days = Math.round((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1;

                return (
                  <div 
                    key={leave._id} 
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4 hover:border-purple-200 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-black flex items-center justify-center text-sm shadow-xs">
                            {staffName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 text-sm">{staffName}</h3>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {staff?.designation || 'Faculty'} • {staff?.department || 'Academic'}
                            </span>
                          </div>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          leave.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : leave.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {leave.status}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-slate-100">
                        <div className="flex justify-between text-slate-600">
                          <span className="text-slate-400">Policy:</span>
                          <span className="font-bold text-purple-700">{leave.leaveType}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span className="text-slate-400">Duration:</span>
                          <span className="font-semibold text-slate-800">{days > 0 ? days : 1} Day{days > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 text-[11px]">
                          <span className="text-slate-400">Dates:</span>
                          <span>{new Date(leave.startDate).toLocaleDateString()} &rarr; {new Date(leave.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Applicant Reason
                        </span>
                        <p className="text-xs text-slate-600 italic bg-purple-50/40 p-2.5 rounded-xl border border-purple-100/50">
                          "{leave.reason}"
                        </p>
                      </div>

                      {leave.remarks && (
                        <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
                          <strong>HR Remarks:</strong> {leave.remarks}
                        </div>
                      )}
                    </div>

                    {leave.status === 'Pending' && (
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => handleApprove(leave._id, staffName)}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(leave._id, staffName)}
                          className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all border border-rose-200/60 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, HardHat, Phone, ShieldCheck, AlertTriangle, 
  Clock, Printer, Edit, Trash2, CheckCircle2, LogOut, AlertCircle, Building
} from 'lucide-react';
import Swal from 'sweetalert2';
import { frontOfficeService } from '../../api/frontOfficeService';

const CampusWorkerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorker();
  }, [id]);

  const fetchWorker = async () => {
    try {
      setLoading(true);
      const res = await frontOfficeService.getCampusWorkerById(id);
      if (res.success && res.data) {
        setWorker(res.data);
      } else {
        setError('Worker record not found.');
      }
    } catch (err) {
      console.error('Error fetching worker details:', err);
      setError('Failed to load worker.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLog = async (actionType) => {
    if (!worker) return;
    const isOut = actionType === 'out';
    const result = await Swal.fire({
      title: isOut ? 'Record Gate Departure?' : 'Record Gate Entry?',
      text: `Log ${actionType.toUpperCase()} event for ${worker.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366F1',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Record',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const payload = isOut 
          ? { outTime: new Date(), gate: 'Main Gate 1' }
          : { inTime: new Date(), gate: 'Main Gate 1' };
        const res = await frontOfficeService.addCampusWorkerLog(worker._id || worker.id, payload);
        if (res.success) {
          Swal.fire({
            title: 'Logged!',
            text: `Gate ${actionType} recorded successfully.`,
            icon: 'success',
            timer: 1600,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          fetchWorker();
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to update gate log.', 'error');
      }
    }
  };

  const handleDelete = async () => {
    if (!worker) return;
    const result = await Swal.fire({
      title: 'Delete Worker Profile?',
      text: `Remove record for ${worker.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await frontOfficeService.deleteCampusWorker(worker._id || worker.id);
        if (res.success) {
          await Swal.fire({
            title: 'Deleted!',
            text: 'Worker profile deleted.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          navigate('/front-office/campus-workers');
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to delete worker.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-sm">Loading worker profile...</p>
        </div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="bg-rose-50 border border-rose-200 p-8 rounded-2xl text-rose-700">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-rose-500" />
          <h2 className="text-lg font-bold">Worker Not Found</h2>
          <p className="text-sm mt-1">{error || 'This campus worker entry does not exist.'}</p>
          <button
            onClick={() => navigate('/front-office/campus-workers')}
            className="mt-5 px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition"
          >
            Back to Campus Workers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/front-office/campus-workers')}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight font-mono">{worker.badgeNo}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                worker.state === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                worker.state === 'Expired' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                'bg-slate-800 text-white'
              }`}>
                {worker.state}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{worker.name} • {worker.type}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleToggleLog('in')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
          >
            <CheckCircle2 className="w-4 h-4" /> Log Entry
          </button>
          <button
            onClick={() => handleToggleLog('out')}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
          >
            <LogOut className="w-4 h-4" /> Log Exit
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
          >
            <Printer className="w-4 h-4" /> Print Badge
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl border border-rose-200 transition"
            title="Delete Worker"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile & Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <HardHat className="w-4 h-4 text-indigo-600" /> Worker Profile & Contract Info
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Full Name</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">{worker.name}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Mobile Number</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">{worker.phone || 'N/A'}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Work Role / Trade</span>
                <span className="text-sm font-bold text-indigo-700 mt-0.5 block">{worker.type}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Contractor / Agency</span>
                <span className="text-sm font-semibold text-slate-700 mt-0.5 block">{worker.contractor || 'Direct Staff'}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Valid Until</span>
                <span className="text-sm font-semibold text-slate-700 mt-0.5 block">
                  {worker.validDate ? new Date(worker.validDate).toLocaleDateString() : 'Continuous'}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Police Verification</span>
                <span className={`text-sm font-bold mt-0.5 block ${
                  worker.policeCheck === 'Verified' ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  {worker.policeCheck}
                </span>
              </div>
            </div>

            {worker.notes && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Notes / ID Details</span>
                <p className="text-xs text-slate-600 leading-relaxed">{worker.notes}</p>
              </div>
            )}
          </div>

          {/* Gate Logs Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" /> Recent Gate Logs
            </h2>
            {worker.logs && worker.logs.length > 0 ? (
              <div className="divide-y divide-slate-100 mt-3 text-xs">
                {worker.logs.map((log, index) => (
                  <div key={index} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-700 block">
                        Gate: {log.gate || 'Main Gate'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        In: {log.inTime ? new Date(log.inTime).toLocaleString() : '--'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 block">
                        Out: {log.outTime ? new Date(log.outTime).toLocaleString() : 'Currently Inside'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-4 text-center py-4">No gate logs recorded yet for this worker.</p>
            )}
          </div>
        </div>

        {/* Right Column: Printable ID Badge */}
        <div>
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-4 print:border print:border-black print:text-black print:bg-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[9px] font-black tracking-widest text-indigo-400 uppercase">ALL CORE SOLUTION</span>
                <h4 className="text-xs font-bold text-white">CAMPUS WORKER PASS</h4>
              </div>
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>

            <div className="flex flex-col items-center text-center py-2">
              <div className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-bold text-3xl mb-3 shadow-inner">
                {worker.name?.charAt(0).toUpperCase()}
              </div>
              <h5 className="text-base font-bold text-white">{worker.name}</h5>
              <span className="text-xs text-indigo-300 font-medium">{worker.type}</span>
              
              <div className="mt-3 px-3 py-1 bg-slate-800 rounded-full font-mono text-xs font-bold tracking-wider text-emerald-400 border border-slate-700">
                {worker.badgeNo}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Contractor:</span>
                <span className="text-slate-200 font-semibold">{worker.contractor}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Verification:</span>
                <span className="text-emerald-400 font-semibold">{worker.policeCheck}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Expires:</span>
                <span className="text-slate-200 font-semibold">
                  {worker.validDate ? new Date(worker.validDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-dashed border-slate-800 text-center">
              <div className="font-mono text-[10px] tracking-widest text-slate-500">||| |||| || | |||| |||</div>
              <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-wider">Property of ALL CORE SOLUTION</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CampusWorkerDetails;

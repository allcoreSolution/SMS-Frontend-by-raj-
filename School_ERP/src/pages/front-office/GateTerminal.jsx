import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  QrCode, X, Search, CheckCircle2, LogOut, ArrowRightLeft, 
  ShieldCheck, AlertCircle, Clock, Users, RefreshCw
} from 'lucide-react';
import Swal from 'sweetalert2';
import { frontOfficeService } from '../../api/frontOfficeService';

const GateTerminal = () => {
  const navigate = useNavigate();
  const [passNumber, setPassNumber] = useState('');
  const [activePass, setActivePass] = useState(null);
  const [recentPasses, setRecentPasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [stats, setStats] = useState({ outCount: 0, todayCleared: 0 });

  useEffect(() => {
    fetchRecentPasses();
  }, []);

  const fetchRecentPasses = async () => {
    try {
      setLoading(true);
      const res = await frontOfficeService.getGatePasses();
      if (res.success && res.data) {
        setRecentPasses(res.data.slice(0, 10));
        const out = res.data.filter(p => p.status === 'Out').length;
        const cleared = res.data.filter(p => p.status === 'Returned' || p.status === 'Out').length;
        setStats({ outCount: out, todayCleared: cleared });
      }
    } catch (err) {
      console.error('Error fetching passes for terminal:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPass = async (e) => {
    e?.preventDefault();
    if (!passNumber.trim()) return;

    try {
      setSearchLoading(true);
      const res = await frontOfficeService.getGatePasses({ search: passNumber.trim() });
      if (res.success && res.data && res.data.length > 0) {
        // match closest or first
        setActivePass(res.data[0]);
      } else {
        setActivePass(null);
        Swal.fire({
          title: 'Not Found',
          text: `No gate pass found matching "${passNumber}"`,
          icon: 'warning',
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!activePass) return;
    try {
      const res = await frontOfficeService.updateGatePassStatus(activePass._id || activePass.id, { status });
      if (res.success) {
        Swal.fire({
          title: status === 'Out' ? 'Marked Departure!' : 'Marked Returned!',
          text: `${activePass.personName} status updated to ${status}.`,
          icon: 'success',
          timer: 1600,
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
        setActivePass(res.data);
        fetchRecentPasses();
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to update pass.', 'error');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-slate-100 overflow-hidden select-none">
      
      {/* Top Security Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-[#1e293b]/80 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-wide text-white">MAIN GATE TERMINAL 01</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold border border-emerald-500/30">ONLINE</span>
            </div>
            <p className="text-[11px] text-slate-400">Security Checkpoint & Scanner Interface</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Currently Out</span>
              <span className="text-base font-black text-amber-400 leading-none">{stats.outCount}</span>
            </div>
            <div className="w-px h-6 bg-slate-800"></div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Cleared</span>
              <span className="text-base font-black text-emerald-400 leading-none">{stats.todayCleared}</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/front-office/gate-passes')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition border border-slate-700"
          >
            <X className="w-4 h-4" /> Exit Terminal
          </button>
        </div>
      </div>

      {/* Main Terminal Grid */}
      <div className="flex flex-1 p-6 gap-6 overflow-hidden">
        
        {/* Left Side: Scan & Search Input + Pass Display */}
        <div className="w-full lg:w-3/5 flex flex-col gap-6 overflow-y-auto">
          
          {/* Quick Scanner / Pass Input Card */}
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Scan QR Barcode or Enter Pass Number / Student Name
            </label>
            <form onSubmit={handleSearchPass} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. GP/YIS/2026/00001 or Ishaan Gupta"
                  value={passNumber}
                  onChange={(e) => setPassNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={searchLoading}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
              >
                {searchLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
                Scan / Check
              </button>
            </form>
          </div>

          {/* Active Pass Card Display */}
          {activePass ? (
            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 shadow-xl p-6 space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase">PASS NO</span>
                    <h2 className="text-xl font-black font-mono text-white tracking-wider">{activePass.passNo}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{activePass.personType || 'Student'} Exit Authorization</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    activePass.status === 'Approved' ? 'bg-sky-500/20 text-sky-400 border-sky-500/30' :
                    activePass.status === 'Out' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                    activePass.status === 'Returned' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    'bg-slate-700 text-slate-300 border-slate-600'
                  }`}>
                    {activePass.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Person Name</span>
                    <span className="text-base font-bold text-white mt-0.5 block">{activePass.personName}</span>
                  </div>

                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Class / Department</span>
                    <span className="text-base font-bold text-indigo-300 mt-0.5 block">{activePass.classSection || 'N/A'}</span>
                  </div>

                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Reason</span>
                    <span className="text-xs font-semibold text-slate-300 mt-0.5 block">{activePass.reason}</span>
                  </div>

                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Authorized By</span>
                    <span className="text-xs font-semibold text-slate-300 mt-0.5 block">{activePass.authorizedBy || 'Principal'}</span>
                  </div>
                </div>

                {activePass.notes && (
                  <div className="mt-4 p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Notes</span>
                    {activePass.notes}
                  </div>
                )}
              </div>

              {/* Guard Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-4">
                {activePass.status !== 'Out' && (
                  <button
                    onClick={() => handleUpdateStatus('Out')}
                    className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Clear for Departure (Mark Out)
                  </button>
                )}
                {activePass.status !== 'Returned' && (
                  <button
                    onClick={() => handleUpdateStatus('Returned')}
                    className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Verify Re-Entry (Mark Returned)
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#1e293b]/60 rounded-2xl border border-slate-800/80 p-12 text-center flex-1 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-800/80 rounded-2xl flex items-center justify-center mb-4 text-slate-500">
                <QrCode className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-300">Awaiting Pass Scan</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Scan pass barcode or search by number above to review student details and grant campus gate clearance.
              </p>
            </div>
          )}
        </div>

        {/* Right Side: Live Logs Roster */}
        <div className="hidden lg:flex w-2/5 flex-col bg-[#1e293b] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" /> Recent Gate Logs
            </h3>
            <button
              onClick={fetchRecentPasses}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
              title="Refresh Logs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
            {recentPasses.map((p) => (
              <div 
                key={p._id || p.id}
                onClick={() => setActivePass(p)}
                className="p-3 hover:bg-slate-800/60 rounded-xl cursor-pointer transition flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition">{p.personName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{p.passNo}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{p.reason} • {p.classSection || 'Student'}</div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    p.status === 'Out' ? 'bg-amber-500/20 text-amber-400' :
                    p.status === 'Returned' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {p.status}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {p.outTime ? new Date(p.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GateTerminal;

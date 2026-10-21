import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ClipboardList, Download, Printer, Search, 
  Clock, CheckCircle2, LogOut, HardHat, Filter
} from 'lucide-react';
import Swal from 'sweetalert2';
import { frontOfficeService } from '../../api/frontOfficeService';

const CampusWorkerInOutLog = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await frontOfficeService.getCampusWorkers();
      if (res.success && res.data) {
        // Flatten logs from all workers
        const allLogs = [];
        res.data.forEach(worker => {
          if (worker.logs && worker.logs.length > 0) {
            worker.logs.forEach((log, idx) => {
              allLogs.push({
                id: `${worker._id}-${idx}`,
                workerId: worker._id,
                workerName: worker.name,
                badgeNo: worker.badgeNo,
                type: worker.type,
                contractor: worker.contractor,
                gate: log.gate || 'Main Gate 1',
                inTime: log.inTime,
                outTime: log.outTime
              });
            });
          }
        });
        // Sort descending by inTime
        allLogs.sort((a, b) => new Date(b.inTime || 0) - new Date(a.inTime || 0));
        setLogs(allLogs);
      }
    } catch (err) {
      console.error('Failed to load logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(l => 
    l.workerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.badgeNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    if (!filteredLogs.length) return Swal.fire('No data', 'No logs to export', 'info');
    const headers = ['Worker Name', 'Badge No', 'Role', 'Contractor', 'Gate', 'In Time', 'Out Time'];
    const rows = filteredLogs.map(l => [
      `"${l.workerName}"`,
      `"${l.badgeNo}"`,
      `"${l.type}"`,
      `"${l.contractor}"`,
      `"${l.gate}"`,
      `"${l.inTime ? new Date(l.inTime).toLocaleString() : ''}"`,
      `"${l.outTime ? new Date(l.outTime).toLocaleString() : 'Inside'}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campus_worker_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-y-auto">
      {/* Header */}
      <div className="px-8 pt-6 pb-6 bg-white border-b border-slate-200/80 shrink-0">
        <div className="flex flex-wrap justify-between items-center gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/front-office/campus-workers')}
              className="p-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 transition shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Campus Workers In/Out Log</h1>
              <p className="text-xs text-slate-500 mt-0.5">Real-time gate movements & entry/exit time records</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-slate-500" /> Export CSV
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print Log
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
        
        {/* Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by worker name, badge, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Total {filteredLogs.length} Log Entries
          </span>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 gap-3">
              <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 text-xs font-medium">Loading gate logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Logs Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No entry/exit events match current criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Worker Name</th>
                    <th className="py-3.5 px-4">Badge No</th>
                    <th className="py-3.5 px-4">Role / Department</th>
                    <th className="py-3.5 px-4">Contractor</th>
                    <th className="py-3.5 px-4">Gate</th>
                    <th className="py-3.5 px-4">In Time</th>
                    <th className="py-3.5 px-4">Out Time</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map((log) => {
                    const isInside = !log.outTime;
                    return (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800">
                          {log.workerName}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                          {log.badgeNo}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[11px] font-semibold text-slate-700">
                            {log.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-600">
                          {log.contractor}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-600">
                          {log.gate}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-600 whitespace-nowrap">
                          {log.inTime ? new Date(log.inTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '--'}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-600 whitespace-nowrap">
                          {log.outTime ? new Date(log.outTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '--'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                            isInside 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {isInside ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <LogOut className="w-3 h-3 text-slate-500" />}
                            {isInside ? 'On Campus' : 'Departed'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampusWorkerInOutLog;

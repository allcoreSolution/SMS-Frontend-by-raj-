import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FrontOfficeTabs from '../../components/front-office/FrontOfficeTabs';
import { 
  Plus, Search, Download, Eye, Trash2, ClipboardList, 
  ShieldCheck, AlertTriangle, CheckCircle2, Clock, Filter, HardHat
} from 'lucide-react';
import Swal from 'sweetalert2';
import { frontOfficeService } from '../../api/frontOfficeService';

const CampusWorkers = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchWorkers();
  }, [activeTab]);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const res = await frontOfficeService.getCampusWorkers({
        state: activeTab !== 'All' ? activeTab : undefined,
        search: searchQuery || undefined
      });
      if (res.success) {
        setWorkers(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load campus workers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWorkers();
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Worker Profile?',
      text: `Remove record for ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await frontOfficeService.deleteCampusWorker(id);
        if (res.success) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Campus worker record removed.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          setWorkers(prev => prev.filter(w => (w._id || w.id) !== id));
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to delete worker record.', 'error');
      }
    }
  };

  const exportCSV = () => {
    if (!workers.length) return Swal.fire('No data', 'No worker records to export', 'info');
    const headers = ['Badge No', 'Name', 'Role / Type', 'Contractor', 'Police Verification', 'Valid Until', 'State'];
    const rows = workers.map(w => [
      `"${w.badgeNo || ''}"`,
      `"${w.name || ''}"`,
      `"${w.type || ''}"`,
      `"${w.contractor || ''}"`,
      `"${w.policeCheck || ''}"`,
      `"${w.validDate ? new Date(w.validDate).toLocaleDateString() : ''}"`,
      `"${w.state || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campus_workers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPoliceBadge = (status) => {
    if (status === 'Verified') {
      return (
        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
        </span>
      );
    }
    return (
      <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
        <AlertTriangle className="w-3 h-3 text-amber-600" /> Not Verified
      </span>
    );
  };

  const getStateBadge = (state) => {
    switch (state) {
      case 'Active':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">Active</span>;
      case 'Expired':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-2.5 py-0.5 rounded-full">Expired</span>;
      case 'Blocked':
        return <span className="bg-slate-800 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">Blocked</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold px-2.5 py-0.5 rounded-full">{state}</span>;
    }
  };

  const tabs = ['All', 'Active', 'Expired', 'Blocked'];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-y-auto">
      {/* Header */}
      <div className="px-8 pt-6 pb-4 bg-white border-b border-slate-200/80 shrink-0">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Front Office Management</h1>
            <p className="text-xs text-slate-500 mt-1">Contract and third-party personnel, police verification, & access logs</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/front-office/campus-workers/logs')}
              className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 shadow-sm transition flex items-center gap-2"
            >
              <ClipboardList className="w-4 h-4 text-indigo-400" /> Gate In/Out Log
            </button>
            <button 
              onClick={() => navigate('/front-office/campus-workers/add')}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:from-indigo-700 hover:to-indigo-800 shadow-md shadow-indigo-100 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Register Worker
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6">
          <FrontOfficeTabs />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
        
        {/* Controls Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <form onSubmit={handleSearch} className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search worker or badge..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </form>
            <button
              onClick={exportCSV}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              title="Export CSV"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Workers Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 gap-3">
              <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 text-xs font-medium">Loading campus workers...</p>
            </div>
          ) : workers.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <HardHat className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Campus Workers Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No records match current filter. Register a new contractor or staff worker.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Badge No</th>
                    <th className="py-3.5 px-4">Full Name</th>
                    <th className="py-3.5 px-4">Role / Department</th>
                    <th className="py-3.5 px-4">Contractor / Agency</th>
                    <th className="py-3.5 px-4">Valid Until</th>
                    <th className="py-3.5 px-4">Police Check</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {workers.map((w) => {
                    const workerId = w._id || w.id;
                    return (
                      <tr key={workerId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                          {w.badgeNo}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">
                          {w.name}
                          {w.phone && <span className="block text-[11px] text-slate-400 font-normal">{w.phone}</span>}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[11px] font-semibold text-slate-700">
                            {w.type || 'Housekeeping'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-600">
                          {w.contractor || 'Campus Services'}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-600 whitespace-nowrap">
                          {w.validDate ? new Date(w.validDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Continuous'}
                        </td>
                        <td className="py-3 px-4">
                          {getPoliceBadge(w.policeCheck)}
                        </td>
                        <td className="py-3 px-4">
                          {getStateBadge(w.state)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => navigate(`/front-office/campus-workers/view/${workerId}`)}
                              className="p-1.5 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition"
                              title="View Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(workerId, w.name)}
                              className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
                              title="Delete Worker"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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

export default CampusWorkers;

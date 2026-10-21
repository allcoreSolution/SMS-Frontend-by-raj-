import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FrontOfficeTabs from '../../components/front-office/FrontOfficeTabs';
import { 
  Plus, Search, Download, Eye, Printer, Terminal as TerminalIcon,
  LogOut, ArrowRightLeft, XCircle, CheckCircle2, Clock, Filter, Trash2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { frontOfficeService } from '../../api/frontOfficeService';

const GatePasses = () => {
  const navigate = useNavigate();
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPasses();
  }, [activeTab]);

  const fetchPasses = async () => {
    try {
      setLoading(true);
      const res = await frontOfficeService.getGatePasses({
        status: activeTab !== 'All' ? activeTab : undefined,
        search: searchQuery || undefined
      });
      if (res.success) {
        setPasses(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch gate passes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPasses();
  };

  const handleStatusChange = async (id, newStatus, passNo) => {
    const actionText = newStatus === 'Out' ? 'Mark Out of Campus' : newStatus === 'Returned' ? 'Mark Returned to Campus' : 'Cancel Gate Pass';
    const result = await Swal.fire({
      title: `${actionText}?`,
      text: `Update status of pass ${passNo} to "${newStatus}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366F1',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: `Yes, ${actionText}`,
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await frontOfficeService.updateGatePassStatus(id, { status: newStatus });
        if (res.success) {
          Swal.fire({
            title: 'Updated!',
            text: `Gate pass status changed to ${newStatus}.`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          fetchPasses();
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to update pass status.', 'error');
      }
    }
  };

  const handleDelete = async (id, passNo) => {
    const result = await Swal.fire({
      title: 'Delete Gate Pass?',
      text: `Permanently delete pass record ${passNo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await frontOfficeService.deleteGatePass(id);
        if (res.success) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Pass deleted successfully.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          setPasses(prev => prev.filter(p => p._id !== id && p.id !== id));
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to delete pass record.', 'error');
      }
    }
  };

  const exportCSV = () => {
    if (!passes.length) return Swal.fire('No data', 'No records to export', 'info');
    const headers = ['Pass No', 'Person Name', 'Class/Role', 'Reason', 'Status', 'Out Time', 'Return Time'];
    const rows = passes.map(p => [
      `"${p.passNo || ''}"`,
      `"${p.personName || ''}"`,
      `"${p.classSection || p.personType || ''}"`,
      `"${p.reason || ''}"`,
      `"${p.status || ''}"`,
      `"${p.outTime ? new Date(p.outTime).toLocaleString() : ''}"`,
      `"${p.actualReturnTime ? new Date(p.actualReturnTime).toLocaleString() : ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gate_passes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Approved</span>;
      case 'Out':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"><LogOut className="w-3 h-3"/> Out</span>;
      case 'Returned':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Returned</span>;
      case 'Cancelled':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"><XCircle className="w-3 h-3"/> Cancelled</span>;
      case 'Pending':
        return <span className="bg-violet-50 text-violet-700 border border-violet-200 text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"><Clock className="w-3 h-3"/> Pending</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold px-2.5 py-0.5 rounded-full">{status}</span>;
    }
  };

  const tabs = ['All', 'Approved', 'Out', 'Returned', 'Cancelled', 'Pending'];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-y-auto">
      {/* Header */}
      <div className="px-8 pt-6 pb-4 bg-white border-b border-slate-200/80 shrink-0">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Front Office Management</h1>
            <p className="text-xs text-slate-500 mt-1">Digital gate passes, visitor authorization & reception management</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/front-office/gate-passes/terminal')}
              className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 shadow-sm transition flex items-center gap-2"
            >
              <TerminalIcon className="w-4 h-4 text-emerald-400" /> Gate Scanner Terminal
            </button>
            <button 
              onClick={() => navigate('/front-office/gate-passes/issue')}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:from-indigo-700 hover:to-indigo-800 shadow-md shadow-indigo-100 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Issue Gate Pass
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
        
        {/* Status Filter Tabs & Controls */}
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
                placeholder="Search pass, student..."
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

        {/* Passes Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 gap-3">
              <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 text-xs font-medium">Loading gate passes...</p>
            </div>
          ) : passes.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Gate Passes Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No records match current filter. Issue a new pass or clear filters to view history.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Pass No</th>
                    <th className="py-3.5 px-4">Person Name</th>
                    <th className="py-3.5 px-4">Class / Role</th>
                    <th className="py-3.5 px-4">Reason</th>
                    <th className="py-3.5 px-4">Out Time</th>
                    <th className="py-3.5 px-4">Return Time</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {passes.map((p) => {
                    const passId = p._id || p.id;
                    return (
                      <tr key={passId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                          {p.passNo}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">
                          {p.personName}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[11px] font-semibold text-slate-700">
                            {p.classSection || p.personType || 'Student'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-600">
                          {p.reason}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-600 whitespace-nowrap">
                          {p.outTime ? new Date(p.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : '--'}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-600 whitespace-nowrap">
                          {p.actualReturnTime ? new Date(p.actualReturnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (p.status === 'Out' ? 'Expected today' : '--')}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(p.status)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {p.status === 'Approved' && (
                              <button
                                onClick={() => handleStatusChange(passId, 'Out', p.passNo)}
                                className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                                title="Mark Out"
                              >
                                <LogOut className="w-3 h-3" /> Mark Out
                              </button>
                            )}
                            {p.status === 'Out' && (
                              <button
                                onClick={() => handleStatusChange(passId, 'Returned', p.passNo)}
                                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                                title="Mark Returned"
                              >
                                <CheckCircle2 className="w-3 h-3" /> Returned
                              </button>
                            )}
                            <button
                              onClick={() => navigate(`/front-office/gate-passes/view/${passId}`)}
                              className="p-1.5 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition"
                              title="View Pass"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(passId, p.passNo)}
                              className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
                              title="Delete Record"
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

export default GatePasses;

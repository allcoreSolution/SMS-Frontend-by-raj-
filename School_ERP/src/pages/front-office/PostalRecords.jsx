import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FrontOfficeTabs from '../../components/front-office/FrontOfficeTabs';
import { 
  Plus, Search, Download, Edit, Trash2, Mail, 
  Send, Inbox, Shield, Lock, FileText, Filter
} from 'lucide-react';
import Swal from 'sweetalert2';
import { frontOfficeService } from '../../api/frontOfficeService';

const PostalRecords = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRecords();
  }, [activeTab]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await frontOfficeService.getPostalRecords({
        type: activeTab !== 'All' ? activeTab : undefined,
        search: searchQuery || undefined
      });
      if (res.success) {
        setRecords(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load postal records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecords();
  };

  const handleDelete = async (id, refNo) => {
    const result = await Swal.fire({
      title: 'Delete Postal Record?',
      text: `Remove dispatch record #${refNo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await frontOfficeService.deletePostalRecord(id);
        if (res.success) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Postal record deleted.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          setRecords(prev => prev.filter(r => (r._id || r.id) !== id));
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to delete record.', 'error');
      }
    }
  };

  const exportCSV = () => {
    if (!records.length) return Swal.fire('No data', 'No postal records to export', 'info');
    const headers = ['Type', 'Reference No', 'From', 'To', 'Courier / Provider', 'Date', 'Confidential', 'Address'];
    const rows = records.map(r => [
      `"${r.type || ''}"`,
      `"${r.referenceNo || ''}"`,
      `"${r.fromTitle || ''}"`,
      `"${r.toTitle || ''}"`,
      `"${r.postalProvider || ''}"`,
      `"${r.date ? new Date(r.date).toLocaleDateString() : ''}"`,
      `"${r.confidential ? 'Yes' : 'No'}"`,
      `"${(r.address || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `postal_records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = ['All', 'Receive', 'Dispatch'];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-y-auto">
      {/* Header */}
      <div className="px-8 pt-6 pb-4 bg-white border-b border-slate-200/80 shrink-0">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Front Office Management</h1>
            <p className="text-xs text-slate-500 mt-1">Inward and outward postal dispatch, courier parcels & official letters</p>
          </div>
          <button 
            onClick={() => navigate('/front-office/postal-records/add')}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:from-indigo-700 hover:to-indigo-800 shadow-md shadow-indigo-100 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Postal Entry
          </button>
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
                {tab === 'Receive' ? 'Incoming (Receive)' : tab === 'Dispatch' ? 'Outgoing (Dispatch)' : 'All Records'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <form onSubmit={handleSearch} className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search reference, from/to..."
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

        {/* Records Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 gap-3">
              <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 text-xs font-medium">Loading postal records...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Postal Records Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No mail or courier packages match current criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Ref / Tracking No</th>
                    <th className="py-3.5 px-4">From</th>
                    <th className="py-3.5 px-4">To</th>
                    <th className="py-3.5 px-4">Carrier / Courier</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Confidential</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((r) => {
                    const recordId = r._id || r.id;
                    const isReceive = r.type === 'Receive';
                    return (
                      <tr key={recordId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                            isReceive 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}>
                            {isReceive ? <Inbox className="w-3 h-3 text-emerald-600" /> : <Send className="w-3 h-3 text-indigo-600" />}
                            {isReceive ? 'Incoming' : 'Outgoing'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          {r.referenceNo}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">
                          {r.fromTitle}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700">
                          {r.toTitle}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {r.postalProvider || 'Speed Post'}
                        </td>
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          {r.date ? new Date(r.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '--'}
                        </td>
                        <td className="py-3 px-4">
                          {r.confidential ? (
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-[10px] font-black uppercase inline-flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5 text-rose-600" /> Yes
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">No</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => navigate(`/front-office/postal-records/edit/${recordId}`)}
                              className="p-1.5 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition"
                              title="Edit Record"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(recordId, r.referenceNo)}
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

export default PostalRecords;

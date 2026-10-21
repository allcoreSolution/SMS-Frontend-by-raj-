import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FrontOfficeTabs from '../../components/front-office/FrontOfficeTabs';
import { 
  UserCheck, Plus, Search, FileText, Download, Printer, 
  Trash2, Eye, LogOut, CheckCircle2, Clock, Phone, Users
} from 'lucide-react';
import Swal from 'sweetalert2';
import { frontOfficeService } from '../../api/frontOfficeService';

const VisitorBook = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchVisitors();
  }, [statusFilter]);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const res = await frontOfficeService.getVisitors({
        status: statusFilter,
        search: searchQuery || undefined
      });
      if (res.success) {
        setVisitors(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load visitors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVisitors();
  };

  const handleCheckout = async (id, name) => {
    const result = await Swal.fire({
      title: 'Check out Visitor?',
      text: `Mark ${name} as departed from campus?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366F1',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Check Out',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await frontOfficeService.checkoutVisitor(id);
        if (res.success) {
          Swal.fire({
            title: 'Checked Out!',
            text: `${name} has departed.`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          fetchVisitors();
        }
      } catch (err) {
        Swal.fire({ title: 'Error', text: 'Checkout failed', icon: 'error', customClass: { popup: 'rounded-2xl' } });
      }
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Visitor Log?',
      text: `Delete entry for ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await frontOfficeService.deleteVisitor(id);
        if (res.success) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Visitor log deleted.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          fetchVisitors();
        }
      } catch (err) {
        Swal.fire({ title: 'Error', text: 'Delete failed', icon: 'error', customClass: { popup: 'rounded-2xl' } });
      }
    }
  };

  const handleCopy = () => {
    const text = visitors.map(v => 
      `${v.badgeNumber}\t${v.name}\t${v.phone}\t${v.visitorType}\t${v.meetingWith}\t${v.status}`
    ).join('\n');
    navigator.clipboard.writeText(`BADGE\tNAME\tPHONE\tTYPE\tMEETING WITH\tSTATUS\n${text}`);
    Swal.fire({ title: 'Copied!', text: 'Visitor logs copied to clipboard.', icon: 'success', timer: 1500, showConfirmButton: false, customClass: { popup: 'rounded-2xl' } });
  };

  const handleExportCSV = () => {
    const header = "BADGE,NAME,PHONE,TYPE,PURPOSE,MEETING WITH,IN TIME,OUT TIME,STATUS\n";
    const csvContent = visitors.map(v => 
      `"${v.badgeNumber}","${v.name}","${v.phone}","${v.visitorType}","${v.purpose}","${v.meetingWith}","${new Date(v.inTime).toLocaleString()}","${v.outTime ? new Date(v.outTime).toLocaleString() : '-'}","${v.status}"`
    ).join('\n');
    const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'visitor_book.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/20 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Visitor Book
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Reception guest registry, visitor pass badge issuance, and departure checkout timestamps.
          </p>
        </div>

        <button 
          onClick={() => navigate('/front-office/visitor-book/add')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-200 transition-all transform active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Check-in Visitor
        </button>
      </div>

      {/* Tabs */}
      <FrontOfficeTabs />

      {/* Action Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search visitor name, badge, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 bg-white font-medium text-slate-700"
          >
            <option value="All">All Visitors</option>
            <option value="On Campus">Currently On Campus</option>
            <option value="Checked Out">Checked Out</option>
          </select>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button 
            onClick={handleCopy}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" /> Copy
          </button>
          <button 
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" /> Export CSV
          </button>
          <button 
            onClick={() => window.print()}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" /> Print
          </button>
        </div>
      </div>

      {/* Visitors Table */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">Loading visitor records...</div>
      ) : visitors.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
          No visitor records found matching your filters.
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Badge / ID</th>
                  <th className="py-3.5 px-4">Visitor Name</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Visitor Type</th>
                  <th className="py-3.5 px-4">Purpose</th>
                  <th className="py-3.5 px-4">Meeting With</th>
                  <th className="py-3.5 px-4">In Time</th>
                  <th className="py-3.5 px-4">Out Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {visitors.map((vis) => {
                  const isOnCampus = vis.status === 'On Campus' || !vis.outTime;
                  return (
                    <tr key={vis._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5 font-mono font-bold text-indigo-700">
                        {vis.badgeNumber || 'VB-PASS'}
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-900">
                        {vis.name}
                      </td>

                      <td className="py-4 px-4 font-mono font-semibold text-slate-600">
                        {vis.phone}
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {vis.visitorType}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-600 max-w-xs truncate">
                        {vis.purpose}
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-800">
                        {vis.meetingWith}
                      </td>

                      <td className="py-4 px-4 font-medium text-slate-500 whitespace-nowrap">
                        {new Date(vis.inTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      <td className="py-4 px-4 font-medium text-slate-500 whitespace-nowrap">
                        {vis.outTime ? new Date(vis.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isOnCampus 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {isOnCampus ? 'On Campus' : 'Checked Out'}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {isOnCampus && (
                            <button
                              onClick={() => handleCheckout(vis._id, vis.name)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-[11px] font-bold transition-colors"
                              title="Mark Departure"
                            >
                              Check Out
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/front-office/visitor-book/view/${vis._id}`)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="View Visitor Pass"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(vis._id, vis.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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
        </div>
      )}
    </div>
  );
};

export default VisitorBook;

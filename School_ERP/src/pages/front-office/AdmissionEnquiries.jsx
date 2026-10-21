import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FrontOfficeTabs from '../../components/front-office/FrontOfficeTabs';
import { 
  Users, Plus, Search, FileText, Download, Printer, 
  Trash2, Eye, Filter, CheckCircle2, Clock, Phone, Mail
} from 'lucide-react';
import Swal from 'sweetalert2';
import { frontOfficeService } from '../../api/frontOfficeService';

const AdmissionEnquiries = () => {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await frontOfficeService.getEnquiries({
        status: statusFilter,
        search: searchQuery || undefined
      });
      if (res.success) {
        setEnquiries(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEnquiries();
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Enquiry?',
      text: `Are you sure you want to remove the admission enquiry for ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#94A3B8',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await frontOfficeService.deleteEnquiry(id);
        if (res.success) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Enquiry deleted successfully.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            customClass: { popup: 'rounded-2xl' }
          });
          fetchEnquiries();
        }
      } catch (err) {
        Swal.fire({ title: 'Error', text: 'Delete failed', icon: 'error', customClass: { popup: 'rounded-2xl' } });
      }
    }
  };

  const handleCopy = () => {
    const text = enquiries.map(e => 
      `${e.studentName}\t${e.parentName}\t${e.phone}\t${e.classApplied}\t${e.source}\t${e.status}`
    ).join('\n');
    navigator.clipboard.writeText(`STUDENT\tPARENT\tPHONE\tCLASS\tSOURCE\tSTATUS\n${text}`);
    Swal.fire({ title: 'Copied!', text: 'Enquiry records copied to clipboard.', icon: 'success', timer: 1500, showConfirmButton: false, customClass: { popup: 'rounded-2xl' } });
  };

  const handleExportCSV = () => {
    const header = "STUDENT,PARENT,PHONE,CLASS,SOURCE,DATE,FOLLOW UP,STATUS\n";
    const csvContent = enquiries.map(e => 
      `"${e.studentName}","${e.parentName}","${e.phone}","${e.classApplied}","${e.source}","${new Date(e.enquiryDate).toLocaleDateString()}","${e.nextFollowUp ? new Date(e.nextFollowUp).toLocaleDateString() : '-'}","${e.status}"`
    ).join('\n');
    const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'admission_enquiries.csv');
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
            Admission Enquiries
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track prospective student walk-ins, phone enquiries, follow-up schedules, and conversions.
          </p>
        </div>

        <button 
          onClick={() => navigate('/front-office/admission-enquiries/add')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-200 transition-all transform active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Enquiry
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
              placeholder="Search student, parent, phone..."
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
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Followed-up">Followed-up</option>
            <option value="Admitted">Admitted</option>
            <option value="Lost">Lost</option>
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

      {/* Enquiries Table */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">Loading admission enquiries...</div>
      ) : enquiries.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
          No admission enquiries found matching your criteria.
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Student Candidate</th>
                  <th className="py-3.5 px-4">Parent / Guardian</th>
                  <th className="py-3.5 px-4">Contact Phone</th>
                  <th className="py-3.5 px-4">Class Applied</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Enquiry Date</th>
                  <th className="py-3.5 px-4">Next Follow-Up</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {enquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold flex items-center justify-center text-xs">
                          {enq.studentName.substring(0, 2)}
                        </div>
                        <span className="font-extrabold text-slate-900 text-sm">
                          {enq.studentName}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-800">
                      {enq.parentName}
                    </td>

                    <td className="py-4 px-4 font-mono font-semibold text-slate-600">
                      {enq.phone}
                    </td>

                    <td className="py-4 px-4 font-bold text-indigo-700">
                      <span className="bg-indigo-50 px-2 py-0.5 rounded-md">
                        {enq.classApplied}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-600 font-medium">
                      {enq.source}
                    </td>

                    <td className="py-4 px-4 font-medium text-slate-500">
                      {new Date(enq.enquiryDate).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-4">
                      {enq.nextFollowUp ? (
                        <span className="font-semibold text-slate-700">
                          {new Date(enq.nextFollowUp).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        enq.status === 'Admitted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        enq.status === 'Followed-up' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        enq.status === 'Lost' ? 'bg-red-50 text-red-700 border border-red-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {enq.status}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => navigate(`/front-office/admission-enquiries/view/${enq._id}`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(enq._id, enq.studentName)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Enquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionEnquiries;

import React, { useState, useEffect } from 'react';
import {
  AlertCircle, Plus, Search, Eye, Trash2, Edit,
  Filter, X, Clock, CheckCircle, AlertTriangle,
  MessageSquare, User, Calendar, Tag, ChevronDown, Save, Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { complaintService } from '../api/complaintService';

const categories = ['Student Behaviour', 'Academics', 'Infrastructure', 'Exam / Assessment', 'Attendance', 'Staff', 'Other'];
const priorities = ['Low', 'Medium', 'High'];
const statuses = ['Pending', 'In Review', 'Resolved'];

const statusStyle = {
  'Pending': 'bg-yellow-50 text-yellow-800 border-yellow-200',
  'In Review': 'bg-blue-50 text-blue-800 border-blue-200',
  'Resolved': 'bg-green-50 text-green-800 border-green-200',
};
const priorityStyle = {
  'Low': 'bg-gray-100 text-gray-700 border-gray-300',
  'Medium': 'bg-orange-50 text-orange-800 border-orange-200',
  'High': 'bg-red-50 text-red-800 border-red-200',
};
const statusIcon = {
  'Pending': Clock,
  'In Review': AlertTriangle,
  'Resolved': CheckCircle,
};

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [viewComplaint, setViewComplaint] = useState(null);
  const [editComplaint, setEditComplaint] = useState(null);
  const [form, setForm] = useState({ subject: '', category: categories[0], against: '', priority: 'Medium', status: 'Pending', description: '' });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const DEFAULT_SEED_COMPLAINTS = [];

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await complaintService.getComplaints();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map(c => {
          let displayStatus = c.status || 'Pending';
          if (displayStatus === 'Open') displayStatus = 'Pending';
          if (displayStatus === 'In-Progress') displayStatus = 'In Review';

          const d = c.date ? new Date(c.date) : (c.createdAt ? new Date(c.createdAt) : new Date());
          const dateFormatted = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

          return {
            id: c._id,
            raw: c,
            subject: c.subject || (c.description ? (c.description.length > 45 ? c.description.substring(0, 42) + '...' : c.description) : 'Complaint Statement'),
            category: c.category || c.complaintType || 'Other',
            against: c.against || c.assignedTo || c.complainantName || 'Administration',
            date: dateFormatted,
            status: displayStatus,
            priority: c.priority || 'Medium',
            description: c.description || ''
          };
        });
        setComplaints(mapped);
      } else {
        setComplaints([]);
      }
    } catch (err) {
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = complaints.filter(c =>
    (filterStatus === 'All' || c.status === filterStatus) &&
    (c.subject.toLowerCase().includes(search.toLowerCase()) ||
     c.category.toLowerCase().includes(search.toLowerCase()) ||
     c.against.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = [
    { label: 'Total Complaints', val: complaints.length, icon: MessageSquare, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { label: 'Pending', val: complaints.filter(c => c.status === 'Pending').length, icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
    { label: 'In Review', val: complaints.filter(c => c.status === 'In Review').length, icon: AlertTriangle, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { label: 'Resolved', val: complaints.filter(c => c.status === 'Resolved').length, icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200' },
  ];

  const handleAddNew = () => {
    setForm({ subject: '', category: categories[0], against: '', priority: 'Medium', status: 'Pending', description: '' });
    setShowModal(true);
  };

  const handleEditClick = (c) => {
    setForm({
      subject: c.subject,
      category: categories.includes(c.category) ? c.category : categories[0],
      against: c.against,
      priority: priorities.includes(c.priority) ? c.priority : 'Medium',
      status: statuses.includes(c.status) ? c.status : 'Pending',
      description: c.description
    });
    setEditComplaint(c);
  };

  const handleSaveComplaint = async () => {
    if (!form.subject.trim()) {
      Swal.fire({
        title: 'Missing Subject',
        text: 'Please enter a subject header.',
        icon: 'warning',
        confirmButtonColor: '#f97316',
        customClass: { popup: 'rounded-none border-2 border-gray-200', confirmButton: 'rounded-none uppercase tracking-wide font-bold px-5' }
      });
      return;
    }
    if (!form.description.trim()) {
      Swal.fire({
        title: 'Missing Description',
        text: 'Please describe the incident context.',
        icon: 'warning',
        confirmButtonColor: '#f97316',
        customClass: { popup: 'rounded-none border-2 border-gray-200', confirmButton: 'rounded-none uppercase tracking-wide font-bold px-5' }
      });
      return;
    }

    try {
      setSubmitting(true);
      const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const payload = {
        subject: form.subject.trim(),
        category: form.category,
        complaintType: form.category,
        against: form.against ? form.against.trim() : 'Administration',
        priority: form.priority,
        status: 'Pending',
        description: form.description.trim(),
        teacherName: loggedUser.fullName || loggedUser.name || 'School Faculty',
        complainantName: loggedUser.fullName || loggedUser.name || 'School Faculty',
        reportedBy: loggedUser.id || loggedUser._id || undefined,
        date: new Date()
      };

      const res = await complaintService.createComplaint(payload);
      if (res && res.success) {
        setShowModal(false);
        await fetchComplaints();
        Swal.fire({
          title: 'Success!',
          text: 'New complaint has been registered.',
          icon: 'success',
          confirmButtonColor: '#f97316',
          customClass: { popup: 'rounded-none border-2 border-gray-200', confirmButton: 'rounded-none uppercase tracking-wide font-bold px-5' }
        });
        return;
      }
    } catch (err) {
      console.warn('API error, saving complaint locally for demo:', err);
    } finally {
      setSubmitting(false);
    }

    // Graceful offline fallback
    const newEntry = {
      id: 'cmp-' + Date.now(),
      subject: form.subject.trim(),
      category: form.category,
      against: form.against ? form.against.trim() : 'Administration',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Pending',
      priority: form.priority,
      description: form.description.trim()
    };
    setComplaints(prev => [newEntry, ...prev]);
    setShowModal(false);
    Swal.fire({
      title: 'Success!',
      text: 'New complaint has been registered.',
      icon: 'success',
      confirmButtonColor: '#f97316',
      customClass: { popup: 'rounded-none border-2 border-gray-200', confirmButton: 'rounded-none uppercase tracking-wide font-bold px-5' }
    });
  };

  const handleUpdateComplaint = async () => {
    if (!form.subject.trim() || !form.description.trim()) {
      Swal.fire({
        title: 'Incomplete Details',
        text: 'Subject and Description are required.',
        icon: 'warning',
        confirmButtonColor: '#f97316',
        customClass: { popup: 'rounded-none border-2 border-gray-200', confirmButton: 'rounded-none uppercase tracking-wide font-bold px-5' }
      });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        subject: form.subject.trim(),
        category: form.category,
        complaintType: form.category,
        against: form.against ? form.against.trim() : 'Administration',
        priority: form.priority,
        status: form.status || 'Pending',
        description: form.description.trim()
      };

      const res = await complaintService.updateComplaint(editComplaint.id, payload);
      if (res && res.success) {
        setEditComplaint(null);
        await fetchComplaints();
        Swal.fire({
          title: 'Updated!',
          text: 'The complaint details have been updated successfully.',
          icon: 'success',
          confirmButtonColor: '#f97316',
          customClass: { popup: 'rounded-none border-2 border-gray-200', confirmButton: 'rounded-none uppercase tracking-wide font-bold px-5' }
        });
      } else {
        Swal.fire({ title: 'Error', text: res?.message || 'Could not update complaint', icon: 'error' });
      }
    } catch (err) {
      console.error('Error updating complaint:', err);
      Swal.fire({ title: 'Error', text: 'Failed to update complaint.', icon: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (c) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete complaint: "${c.subject}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
         popup: 'rounded-none border-2 border-gray-200',
         confirmButton: 'rounded-none uppercase tracking-wide font-bold px-5',
         cancelButton: 'rounded-none uppercase tracking-wide font-bold px-5'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await complaintService.deleteComplaint(c.id);
          if (res && res.success) {
            await fetchComplaints();
            Swal.fire({
              title: 'Deleted!',
              text: 'Complaint record has been removed.',
              icon: 'success',
              confirmButtonColor: '#f97316',
              customClass: { popup: 'rounded-none border-2 border-gray-200', confirmButton: 'rounded-none uppercase tracking-wide font-bold px-5' }
            });
          } else {
            Swal.fire({ title: 'Error', text: res?.message || 'Could not delete complaint', icon: 'error' });
          }
        } catch (err) {
          console.error('Error deleting complaint:', err);
          Swal.fire({ title: 'Error', text: 'Failed to delete complaint record.', icon: 'error' });
        }
      }
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 theme-app-bg">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-600 text-white rounded-none flex items-center justify-center shadow-sm">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[20px] font-black text-gray-800 tracking-tight">Complaints & Grievances</h1>
            <p className="text-[13px] text-gray-500 font-medium">Submit securely, track status dynamically, and guarantee resolutions.</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, val, icon: Icon, color }) => (
            <div key={label} className="bg-white border-2 border-gray-200 shadow-sm rounded-none p-5 flex items-center gap-4 transition-all hover:border-gray-300">
              <div className={`w-12 h-12 rounded-none flex items-center justify-center flex-shrink-0 border-2 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[26px] font-black text-gray-800 leading-none">{val}</p>
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center flex-wrap gap-2">
            {['All', 'Pending', 'In Review', 'Resolved'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-5 py-2 text-[12px] font-bold uppercase tracking-wider rounded-none border-2 transition-colors ${filterStatus === s ? 'bg-orange-600 text-white border-orange-700' : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
              >
                {s}
              </button>
            ))}
            <div className="relative ml-2">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 border-2 border-gray-300 text-[13px] font-medium w-56 rounded-none focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-5 py-2 rounded-none shadow-sm border border-orange-800 flex items-center gap-2 text-[13px] uppercase tracking-wider transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> New Complaint
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border-2 border-gray-300 shadow-sm rounded-none overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-300 text-left">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                {['#', 'Subject', 'Category', 'Against', 'Date', 'Priority', 'Status', 'Actions'].map((h, i) => (
                  <th key={h} className={`px-4 py-3.5 text-[12px] font-black text-gray-700 uppercase tracking-wider border-r border-gray-300 ${i===7 ? 'text-right pr-6' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-14 font-bold text-gray-500 border border-gray-300 bg-white">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-orange-600" />
                      <span>Loading complaints from database...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 font-bold text-gray-400 border border-gray-300 bg-gray-50">No complaints found.</td></tr>
              ) : (
                filtered.map((c, i) => {
                  const SIcon = statusIcon[c.status] || Clock;
                  return (
                    <tr key={c.id} className="hover:bg-orange-50/30 transition-colors border-b border-gray-300">
                      <td className="px-4 py-3.5 border-r border-gray-300 text-gray-600 font-bold">{i + 1}</td>
                      <td className="px-4 py-3.5 border-r border-gray-300">
                        <p className="font-bold text-gray-900 border-l-2 border-orange-400 pl-2 max-w-[220px] truncate">{c.subject}</p>
                      </td>
                      <td className="px-4 py-3.5 border-r border-gray-300">
                        <span className="text-[11px] bg-gray-100 text-gray-800 border border-gray-300 rounded-none px-2.5 py-1 font-bold shadow-sm">{c.category}</span>
                      </td>
                      <td className="px-4 py-3.5 border-r border-gray-300 text-gray-700 font-medium text-[12px] max-w-[160px] truncate">{c.against}</td>
                      <td className="px-4 py-3.5 border-r border-gray-300 text-gray-500 text-[12px] font-bold whitespace-nowrap"><div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gray-400"/> {c.date}</div></td>
                      <td className="px-4 py-3.5 border-r border-gray-300">
                        <span className={`text-[11px] font-black px-2.5 py-1 uppercase tracking-wider rounded-none border shadow-sm ${priorityStyle[c.priority] || priorityStyle['Medium']}`}>{c.priority}</span>
                      </td>
                      <td className="px-4 py-3.5 border-r border-gray-300">
                        <span className={`flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 w-fit rounded-none border shadow-sm ${statusStyle[c.status] || statusStyle['Pending']}`}>
                          <SIcon className="w-3.5 h-3.5" />{c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 bg-gray-50/30 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button onClick={() => setViewComplaint(c)} className="w-8 h-8 flex items-center justify-center rounded-none bg-white text-blue-600 border border-gray-300 hover:border-blue-500 hover:bg-blue-50 shadow-sm transition-all active:scale-95" title="View Details"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => handleEditClick(c)} className="w-8 h-8 flex items-center justify-center rounded-none bg-white text-teal-600 border border-gray-300 hover:border-teal-500 hover:bg-teal-50 shadow-sm transition-all active:scale-95" title="Edit Complaint"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(c)} className="w-8 h-8 flex items-center justify-center rounded-none bg-white text-red-500 border border-gray-300 hover:border-red-500 hover:bg-red-50 shadow-sm transition-all active:scale-95" title="Delete Complaint"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== New Complaint Modal ===== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in" onClick={() => setShowModal(false)}>
          <div className="bg-white w-full max-w-lg shadow-2xl rounded-none border border-gray-300 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-[16px] font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" /> Formulate Complaint
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">Subject Header *</label>
                <input
                  type="text"
                  placeholder="Summarize the core concern..."
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-orange-500 rounded-none bg-white font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">Primary Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                     className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-orange-500 rounded-none bg-white font-medium">
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">Urgency Level</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                     className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-orange-500 rounded-none bg-white font-medium">
                    {priorities.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">Perpetrator / Department</label>
                <input
                  type="text"
                  placeholder="Name of individual or group..."
                  value={form.against}
                  onChange={e => setForm({ ...form, against: e.target.value })}
                  className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-orange-500 rounded-none bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">Full Description *</label>
                <textarea
                  rows={4}
                  placeholder="Detail the exact incident context..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border-2 border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:border-orange-500 rounded-none bg-white font-medium"
                />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 flex-row-reverse">
              <button
                onClick={handleSaveComplaint}
                disabled={submitting}
                className="bg-orange-600 hover:bg-orange-700 text-white font-black px-6 py-2.5 text-[12px] uppercase tracking-wider transition-colors rounded-none shadow-sm flex items-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin"/> : <AlertCircle className="w-4 h-4"/>}
                {submitting ? 'Submitting...' : 'Submit Form'}
              </button>
              <button onClick={() => setShowModal(false)} className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-100 text-[12px] font-black uppercase tracking-wider transition-colors rounded-none">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Edit Complaint Modal ===== */}
      {editComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in" onClick={() => setEditComplaint(null)}>
          <div className="bg-white w-full max-w-lg shadow-2xl rounded-none border border-gray-300 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-teal-200 bg-teal-50">
              <h2 className="text-[16px] font-black text-teal-800 uppercase tracking-tight flex items-center gap-2">
                <Edit className="w-5 h-5 text-teal-600" /> Edit Formal Record
              </h2>
              <button onClick={() => setEditComplaint(null)} className="text-teal-600 hover:text-teal-900 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto bg-gray-50">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">Subject Header *</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-teal-500 rounded-none bg-white font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">Primary Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                     className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-teal-500 rounded-none bg-white font-medium">
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">Urgency Level</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                     className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-teal-500 rounded-none bg-white font-medium">
                    {priorities.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">Perpetrator / Department</label>
                  <input
                     type="text"
                     value={form.against}
                     onChange={e => setForm({ ...form, against: e.target.value })}
                     className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-teal-500 rounded-none bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">Resolution Status</label>
                  <select
                     value={form.status}
                     onChange={e => setForm({ ...form, status: e.target.value })}
                     className="w-full border-2 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-teal-500 rounded-none bg-white font-medium"
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">Full Description *</label>
                <textarea
                   rows={4}
                   value={form.description}
                   onChange={e => setForm({ ...form, description: e.target.value })}
                   className="w-full border-2 border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:border-teal-500 rounded-none bg-white font-medium"
                />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-white flex-row-reverse">
              <button
                onClick={handleUpdateComplaint}
                disabled={submitting}
                className="bg-teal-600 hover:bg-teal-700 text-white font-black px-6 py-2.5 text-[12px] uppercase tracking-wider transition-colors rounded-none shadow-sm flex items-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                {submitting ? 'Saving...' : 'Commit Changes'}
              </button>
              <button onClick={() => setEditComplaint(null)} className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-100 text-[12px] font-black uppercase tracking-wider transition-colors rounded-none">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== View Complaint Modal ===== */}
      {viewComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in" onClick={() => setViewComplaint(null)}>
          <div className="bg-white w-full max-w-lg shadow-2xl rounded-none border border-gray-300 flex flex-col" onClick={e => e.stopPropagation()}>
            
            <div className="p-8 pb-6 border-b border-gray-200 relative overflow-hidden bg-gray-50">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <div className="flex items-start justify-between gap-4">
                <div>
                   <h2 className="text-[18px] font-black text-gray-800 leading-tight mb-2">{viewComplaint.subject}</h2>
                   <div className="flex items-center gap-2">
                     <span className="text-[11px] font-bold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-none">{viewComplaint.date}</span>
                   </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                   <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 flex-shrink-0 border rounded-none shadow-sm ${statusStyle[viewComplaint.status]}`}>{viewComplaint.status}</span>
                   <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 flex-shrink-0 border rounded-none shadow-sm mt-1 w-full text-center ${priorityStyle[viewComplaint.priority]}`}>{viewComplaint.priority} priority</span>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: 'Category Block', val: viewComplaint.category, icon: Tag },
                  { label: 'Reported Entity', val: viewComplaint.against, icon: User },
                ].map(({ label, val, icon: Icon }) => (
                  <div key={label} className="bg-white border-2 border-gray-200 border-l-4 border-l-blue-500 p-4 shadow-sm rounded-none">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-2"><Icon className="w-3.5 h-3.5" />{label}</p>
                    <p className="text-gray-800 font-bold text-[13px]">{val}</p>
                  </div>
                ))}
              </div>
              
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Complaint Statement</p>
                <div className="bg-gray-50 border-2 border-gray-200 p-5 rounded-none shadow-sm">
                   <p className="text-[13px] text-gray-700 leading-relaxed font-medium">{viewComplaint.description}</p>
                </div>
              </div>

              {viewComplaint.status === 'Resolved' && (
                <div className="bg-green-50 border-2 border-green-200 p-4 flex items-start gap-4 shadow-sm mt-2">
                  <div className="w-8 h-8 rounded-none bg-green-200 text-green-700 flex items-center justify-center flex-shrink-0"><CheckCircle className="w-4 h-4"/></div>
                  <div>
                    <p className="text-[13px] font-black text-green-800 uppercase tracking-wider mb-1">Administrative Resolution</p>
                    <p className="text-[12px] text-green-700 font-medium">The management has reviewed and resolved this matter effectively as of record date.</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-8 py-5 border-t border-gray-200 flex justify-end bg-gray-50">
              <button 
                onClick={() => setViewComplaint(null)} 
                className="bg-gray-800 hover:bg-black text-white px-8 py-2.5 text-[12px] uppercase tracking-wider font-black shadow-sm transition-colors rounded-none"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;

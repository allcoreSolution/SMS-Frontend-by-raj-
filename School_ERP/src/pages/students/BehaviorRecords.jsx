import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, Plus, Search, List, Grid, Trash2, 
  Download, Printer, RefreshCw, X, ThumbsUp, ThumbsDown, Award, AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import StudentsTabs from '../../components/students/StudentsTabs';
import { studentService } from '../../api/studentService';

const BehaviorRecords = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All'); // 'All' | 'Positive' | 'Negative'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Quick Add Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [newRecord, setNewRecord] = useState({
    studentId: '',
    title: '',
    type: 'Positive',
    points: 3,
    reportedBy: 'Class Teacher',
    description: '',
    incidentDate: new Date().toISOString().split('T')[0]
  });

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterType !== 'All') params.type = filterType;
      const res = await studentService.getBehaviorRecords(params);
      setRecords(res?.data || []);
    } catch (err) {
      console.error('Failed to fetch behavior records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    studentService.getStudents({ limit: 1000 }).then(res => {
      setStudentsList(res?.data || []);
    }).catch(console.error);
  }, [filterType]);

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: 'Delete Behavior Incident?',
      text: `Are you sure you want to delete "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        await studentService.deleteBehaviorRecord(id);
        Swal.fire({
          title: 'Deleted!',
          text: 'Behavior record removed.',
          icon: 'success',
          customClass: { popup: 'rounded-2xl' }
        });
        fetchRecords();
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || err.message, 'error');
      }
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newRecord.studentId || !newRecord.title.trim()) {
      Swal.fire('Validation Error', 'Student and Incident Title are required.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      await studentService.createBehaviorRecord(newRecord);
      Swal.fire({
        title: 'Incident Logged!',
        text: 'Behavior record has been added to student ledger.',
        icon: 'success',
        customClass: { popup: 'rounded-2xl' }
      });
      setIsAddModalOpen(false);
      setNewRecord({
        studentId: '',
        title: '',
        type: 'Positive',
        points: 3,
        reportedBy: 'Class Teacher',
        description: '',
        incidentDate: new Date().toISOString().split('T')[0]
      });
      fetchRecords();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Student', 'Adm No', 'Class', 'Title', 'Type', 'Points', 'Date', 'Reported By', 'Remarks'];
    const rows = records.map(r => [
      `"${r.student}"`,
      r.studentAdmNo || '',
      `"${r.classSection}"`,
      `"${r.title}"`,
      r.type,
      r.points,
      r.date,
      `"${r.reportedBy}"`,
      `"${r.description || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Behavior_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = records.filter(r => 
    r.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.studentAdmNo || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const positiveCount = records.filter(r => r.type === 'Positive').length;
  const negativeCount = records.filter(r => r.type === 'Negative').length;

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Student Conduct & Behavior Ledger</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
              <Star className="w-3.5 h-3.5" /> Merits & Demerits
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track student merits, awards, leadership commendations, and behavioral incidents.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/25"
          >
            <Plus className="w-4 h-4" /> Log Incident / Merit
          </button>
        </div>
      </div>

      <StudentsTabs />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Recorded</p>
            <p className="text-2xl font-extrabold text-slate-900">{records.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <Star className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Positive Merits</p>
            <p className="text-2xl font-extrabold text-emerald-600">{positiveCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ThumbsUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Negative Demerits</p>
            <p className="text-2xl font-extrabold text-rose-600">{negativeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <ThumbsDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['All', 'Positive', 'Negative'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                filterType === type
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type} {type === 'Positive' ? `(${positiveCount})` : type === 'Negative' ? `(${negativeCount})` : ''}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student, incident title, or admission..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Ledger Table */}
      {loading ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200/80 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading behavior records...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200/80 text-center space-y-3">
          <Award className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No behavior incidents found</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">Student</th>
                  <th className="py-3.5 px-4">Class</th>
                  <th className="py-3.5 px-4">Incident / Commendation</th>
                  <th className="py-3.5 px-4">Type & Points</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Reported By</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRecords.map((r) => (
                  <tr key={r.id || r._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-5">
                      <p className="font-bold text-slate-900">{r.student}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{r.studentAdmNo}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {r.classSection}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800">{r.title}</p>
                      {r.description && <p className="text-[11px] text-slate-400 max-w-xs truncate">{r.description}</p>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.type === 'Positive' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {r.type}
                        </span>
                        <span className="font-bold text-slate-700 text-xs">
                          {r.points > 0 ? `+${r.points}` : r.points} pts
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600">{r.date}</td>
                    <td className="py-3 px-4 text-slate-600">{r.reportedBy}</td>
                    <td className="py-3 px-5 text-right">
                      <button
                        onClick={() => handleDelete(r.id || r._id, r.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Incident Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-indigo-900 to-blue-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold">Log Behavior Incident / Merit</h3>
                <p className="text-xs text-indigo-200">Record a positive reward or disciplinary notice</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-xl text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Student *</label>
                <select
                  value={newRecord.studentId}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, studentId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  required
                >
                  <option value="">-- Choose Student --</option>
                  {studentsList.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.firstName} {s.lastName || ''} ({s.admissionNo || s.aparId}) - {s.classId?.className || 'Class I'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Incident Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Science Olympiad Gold Medal or Repeated Lab Disruption"
                  value={newRecord.title}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Type</label>
                  <select
                    value={newRecord.type}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Positive">Positive (Merit)</option>
                    <option value="Negative">Negative (Demerit)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Merit Points</label>
                  <input
                    type="number"
                    value={newRecord.points}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, points: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Incident Date</label>
                  <input
                    type="date"
                    value={newRecord.incidentDate}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, incidentDate: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Reported By</label>
                  <input
                    type="text"
                    value={newRecord.reportedBy}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, reportedBy: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Detailed Description</label>
                <textarea
                  rows={2}
                  placeholder="Context and details of the incident..."
                  value={newRecord.description}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default BehaviorRecords;

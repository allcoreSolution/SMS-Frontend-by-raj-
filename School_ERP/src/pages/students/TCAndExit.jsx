import React, { useState, useEffect } from 'react';
import { 
  LogOut, Plus, Search, RefreshCw, Download, Printer, 
  Trash2, X, Check, FileText, CheckCircle2, AlertTriangle, ShieldCheck
} from 'lucide-react';
import Swal from 'sweetalert2';
import StudentsTabs from '../../components/students/StudentsTabs';
import { studentService } from '../../api/studentService';

const TCAndExit = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'TC Register' | 'Exited' | 'On Hold' | 'Pending Exit'
  const [searchQuery, setSearchQuery] = useState('');

  // Issue TC Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    standing: 'TC Register',
    reason: 'Parent Relocation / Higher Studies',
    characterConduct: 'Exemplary',
    duesCleared: true,
    lastClass: 'Class V'
  });

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeTab !== 'All') params.standing = activeTab;
      const res = await studentService.getExitRecords(params);
      setRecords(res?.data || []);
    } catch (err) {
      console.error('Failed to fetch exit records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    studentService.getStudents({ limit: 1000 }).then(res => {
      setStudentsList(res?.data || []);
    }).catch(console.error);
  }, [activeTab]);

  const handleCancelExit = async (id, studentName) => {
    const result = await Swal.fire({
      title: 'Re-activate Student Account?',
      text: `Cancel exit record and restore ${studentName} back to Active enrollment?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Restore to Active',
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        await studentService.cancelExitRecord(id);
        Swal.fire({
          title: 'Restored!',
          text: 'Student has been marked Active in the enrollment database.',
          icon: 'success',
          customClass: { popup: 'rounded-2xl' }
        });
        fetchRecords();
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || err.message, 'error');
      }
    }
  };

  const handleIssueTC = async (e) => {
    e.preventDefault();
    if (!formData.studentId) {
      Swal.fire('Student Required', 'Please select a student to issue Transfer Certificate.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      await studentService.createExitRecord(formData);
      Swal.fire({
        title: 'Transfer Certificate Issued!',
        text: 'TC has been officially generated and student standing updated.',
        icon: 'success',
        customClass: { popup: 'rounded-2xl' }
      });
      setIsModalOpen(false);
      setFormData({
        studentId: '',
        standing: 'TC Register',
        reason: 'Parent Relocation / Higher Studies',
        characterConduct: 'Exemplary',
        duesCleared: true,
        lastClass: 'Class V'
      });
      fetchRecords();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRecords = records.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.tcNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Transfer Certificate (TC) & Exit Register</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
              <LogOut className="w-3.5 h-3.5" /> School Clearance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage student withdrawals, TC certifications, dues clearances, and re-admissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/25 transition-all"
          >
            <Plus className="w-4 h-4" /> Issue Transfer Certificate (TC)
          </button>
        </div>
      </div>

      <StudentsTabs />

      {/* Tabs Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'TC Register', 'Exited', 'On Hold', 'Pending Exit'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student, TC number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* TC Records Table */}
      {loading ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200/80 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading exit registry...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200/80 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No exit records found in this category</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">Student Name</th>
                  <th className="py-3.5 px-4">TC Number</th>
                  <th className="py-3.5 px-4">Standing / Status</th>
                  <th className="py-3.5 px-4">Exit Date</th>
                  <th className="py-3.5 px-4">Last Grade</th>
                  <th className="py-3.5 px-4">Clearance</th>
                  <th className="py-3.5 px-4">Reason</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRecords.map(r => (
                  <tr key={r._id || r.recordId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-5">
                      <p className="font-bold text-slate-900">{r.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{r.id}</p>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-700">
                      {r.tcNo}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        r.standing === 'On Hold' 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {r.standing}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600">{r.leftOn}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{r.lastClass}</td>
                    <td className="py-3 px-4">
                      {r.duesCleared ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Dues Cleared
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 font-bold">
                          <AlertTriangle className="w-3.5 h-3.5" /> Pending Dues
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{r.reason}</td>
                    <td className="py-3 px-5 text-right">
                      <button
                        onClick={() => handleCancelExit(r.recordId || r._id, r.name)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-colors"
                        title="Reactivate to Active Enrollment"
                      >
                        Re-Activate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Issue TC Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-amber-700 to-orange-700 text-white flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold">Issue Transfer Certificate (TC)</h3>
                <p className="text-xs text-amber-200">Process student withdrawal & dues clearance</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-xl text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueTC} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Student *</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => {
                    const st = studentsList.find(s => s._id === e.target.value);
                    setFormData(prev => ({ 
                      ...prev, 
                      studentId: e.target.value,
                      lastClass: st?.classId?.className || prev.lastClass
                    }));
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Standing Classification</label>
                  <select
                    value={formData.standing}
                    onChange={(e) => setFormData(prev => ({ ...prev, standing: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="TC Register">TC Register (Issued)</option>
                    <option value="Exited">Exited</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Pending Exit">Pending Exit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Class Attended</label>
                  <input
                    type="text"
                    value={formData.lastClass}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastClass: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Reason for Leaving</label>
                <input
                  type="text"
                  placeholder="e.g. Parent Relocation to Mumbai / Higher Studies"
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Character & Conduct</label>
                  <select
                    value={formData.characterConduct}
                    onChange={(e) => setFormData(prev => ({ ...prev, characterConduct: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Exemplary">Exemplary</option>
                    <option value="Good">Good</option>
                    <option value="Satisfactory">Satisfactory</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.duesCleared}
                      onChange={(e) => setFormData(prev => ({ ...prev, duesCleared: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>All Accounts Dues Cleared</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Processing...' : 'Issue TC & Update Registry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TCAndExit;

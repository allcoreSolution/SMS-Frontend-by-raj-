import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartPulse, Search, Download, Printer, RefreshCw, 
  Activity, Plus, X, Check, Eye, AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import StudentsTabs from '../../components/students/StudentsTabs';
import { studentService } from '../../api/studentService';

const StudentHealthRecords = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick Health Checkup Modal
  const [isCheckupModalOpen, setIsCheckupModalOpen] = useState(false);
  const [selectedStudentForCheckup, setSelectedStudentForCheckup] = useState(null);
  const [checkupForm, setCheckupForm] = useState({
    bloodGroup: 'B+',
    height: '',
    weight: '',
    allergies: 'None',
    visionLeft: '6/6',
    visionRight: '6/6',
    dentalNotes: 'Normal',
    doctorName: 'Dr. School Medical Officer',
    remarks: 'Fit & Healthy'
  });
  const [saving, setSaving] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedBloodGroup !== 'All') params.bloodGroup = selectedBloodGroup;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      const res = await studentService.getHealthRecords(params);
      setRecords(res?.data || []);
    } catch (err) {
      console.error('Failed to fetch health records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [selectedBloodGroup]);

  const handleOpenCheckup = (record) => {
    setSelectedStudentForCheckup(record);
    setCheckupForm({
      bloodGroup: record.bloodGroup || 'B+',
      height: record.height || '',
      weight: record.weight || '',
      allergies: record.allergies || 'None',
      visionLeft: record.visionLeft || '6/6',
      visionRight: record.visionRight || '6/6',
      dentalNotes: record.dentalNotes || 'Normal',
      doctorName: record.doctorName || 'Dr. School Medical Officer',
      remarks: record.remarks || 'Healthy & Fit'
    });
    setIsCheckupModalOpen(true);
  };

  const handleSaveCheckup = async (e) => {
    e.preventDefault();
    if (!selectedStudentForCheckup) return;

    try {
      setSaving(true);
      await studentService.saveHealthRecord({
        studentId: selectedStudentForCheckup.studentId || selectedStudentForCheckup.id,
        ...checkupForm
      });

      Swal.fire({
        title: 'Medical Record Saved!',
        text: `Health checkup logged for ${selectedStudentForCheckup.name}.`,
        icon: 'success',
        customClass: { popup: 'rounded-2xl' }
      });

      setIsCheckupModalOpen(false);
      fetchRecords();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Roll No', 'Student Name', 'Admission No', 'Class', 'Blood Group', 'Height (cm)', 'Weight (kg)', 'Allergies', 'Vision', 'Latest Checkup', 'Doctor Remarks'];
    const rows = records.map(r => [
      r.roll || '',
      `"${r.name}"`,
      r.admNo || '',
      `"${r.class}"`,
      r.bloodGroup || 'Unknown',
      r.height || '',
      r.weight || '',
      `"${r.allergies || 'None'}"`,
      `"${r.visionLeft}/${r.visionRight}"`,
      r.checkup || '',
      `"${r.remarks || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Medical_Records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = records.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.admNo || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Student Health & Medical Records</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
              <HeartPulse className="w-3.5 h-3.5" /> Clinical Wellness
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Student blood profiles, annual pediatric checkups, allergies, and emergency medical records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <StudentsTabs />

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-'].map(bg => (
            <button
              key={bg}
              onClick={() => setSelectedBloodGroup(bg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedBloodGroup === bg
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name or admission..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Health Ledger Table */}
      {loading ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200/80 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-rose-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading medical ledger...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200/80 text-center space-y-3">
          <HeartPulse className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No medical records match current query</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">Student</th>
                  <th className="py-3.5 px-4">Class</th>
                  <th className="py-3.5 px-4">Blood Group</th>
                  <th className="py-3.5 px-4">Height / Weight</th>
                  <th className="py-3.5 px-4">Allergies</th>
                  <th className="py-3.5 px-4">Vision & Dental</th>
                  <th className="py-3.5 px-4">Latest Checkup</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRecords.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-5 flex items-center gap-3">
                      <img src={r.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                      <div>
                        <p className="font-bold text-slate-900">{r.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">Roll: {r.roll} • {r.admNo}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{r.class}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-lg bg-rose-50 text-rose-700 font-extrabold text-xs">
                        {r.bloodGroup}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {r.height ? `${r.height} cm` : '-'} / {r.weight ? `${r.weight} kg` : '-'}
                    </td>
                    <td className="py-3 px-4">
                      {r.allergies && r.allergies !== 'None' ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-semibold text-[10px]">
                          {r.allergies}
                        </span>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800">Vision: {r.visionLeft || '6/6'}</p>
                      <p className="text-[10px] text-slate-400">Dental: {r.dentalNotes || 'Normal'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800">{r.checkup}</p>
                      <p className="text-[10px] text-slate-400">{r.remarks || 'Fit'}</p>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <button
                        onClick={() => handleOpenCheckup(r)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors"
                      >
                        Log Checkup
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Checkup Modal */}
      {isCheckupModalOpen && selectedStudentForCheckup && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-rose-900 to-red-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold">Log Pediatric Health Checkup</h3>
                <p className="text-xs text-rose-200">{selectedStudentForCheckup.name} ({selectedStudentForCheckup.class})</p>
              </div>
              <button 
                onClick={() => setIsCheckupModalOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-xl text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCheckup} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Blood Group</label>
                  <select
                    value={checkupForm.bloodGroup}
                    onChange={(e) => setCheckupForm(prev => ({ ...prev, bloodGroup: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-rose-700 focus:outline-none focus:border-rose-500"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Height (cm)</label>
                  <input
                    type="number"
                    value={checkupForm.height}
                    onChange={(e) => setCheckupForm(prev => ({ ...prev, height: e.target.value }))}
                    placeholder="e.g. 135"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Weight (kg)</label>
                  <input
                    type="number"
                    value={checkupForm.weight}
                    onChange={(e) => setCheckupForm(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="e.g. 38"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Vision (Left / Right)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Left: 6/6"
                      value={checkupForm.visionLeft}
                      onChange={(e) => setCheckupForm(prev => ({ ...prev, visionLeft: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-rose-500"
                    />
                    <input
                      type="text"
                      placeholder="Right: 6/6"
                      value={checkupForm.visionRight}
                      onChange={(e) => setCheckupForm(prev => ({ ...prev, visionRight: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Dental Condition</label>
                  <input
                    type="text"
                    value={checkupForm.dentalNotes}
                    onChange={(e) => setCheckupForm(prev => ({ ...prev, dentalNotes: e.target.value }))}
                    placeholder="e.g. Healthy & Clean"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Allergies / Special Concerns</label>
                <input
                  type="text"
                  placeholder="e.g. Dust & Pollen, Asthmatic"
                  value={checkupForm.allergies}
                  onChange={(e) => setCheckupForm(prev => ({ ...prev, allergies: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Medical Officer</label>
                  <input
                    type="text"
                    value={checkupForm.doctorName}
                    onChange={(e) => setCheckupForm(prev => ({ ...prev, doctorName: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Clinical Remarks</label>
                  <input
                    type="text"
                    value={checkupForm.remarks}
                    onChange={(e) => setCheckupForm(prev => ({ ...prev, remarks: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCheckupModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-500/20 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Health Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentHealthRecords;

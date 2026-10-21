import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, XCircle, CreditCard, PieChart, AlertTriangle, 
  Search, HelpCircle, Save, Calendar, UserPlus, Filter, RefreshCw, CheckSquare, Square
} from 'lucide-react';
import Swal from 'sweetalert2';
import QuickSetupModal from '../../components/finance/QuickSetupModal';
import UnderstandingAssignmentsModal from '../../components/finance/UnderstandingAssignmentsModal';
import FinanceTabs from '../../components/finance/FinanceTabs';
import { studentService } from '../../api/studentService';
import { financeService } from '../../api/financeService';
import { feeCollectionService } from '../../api/feeCollectionService';
import { academicService } from '../../api/academicService';

const AssignFees = () => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isQuickSetupOpen, setIsQuickSetupOpen] = useState(false);
  const [isUnderstandingOpen, setIsUnderstandingOpen] = useState(false);
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [classes, setClasses] = useState([]);
  const [feeGroups, setFeeGroups] = useState([]);
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [classRes, groupRes, dueRes] = await Promise.all([
        academicService.getClasses(),
        financeService.getFeeGroups(),
        feeCollectionService.searchDueFees()
      ]);

      const clsList = classRes?.data || [];
      const grpList = groupRes?.data || [];
      setClasses(clsList);
      setFeeGroups(grpList);
      if (grpList.length > 0) setSelectedGroup(grpList[0]._id);

      // Load initial students from due list or student endpoint
      const rawDue = dueRes?.data || [];
      const mapped = rawDue.map((s, idx) => ({
        id: s.id || s._id,
        admissionNo: s.admissionNo || s.aparId || `YIS-${idx+101}`,
        rollNo: idx + 1,
        name: s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim(),
        class: s.class || s.academicClass?.className || 'Class I',
        section: s.section || 'A',
        groups: s.groups?.length || 1,
        billed: s.totalAssigned || 0,
        paid: s.totalPaid || 0,
        due: s.totalDue || 0,
        status: (s.totalAssigned || 0) > 0 ? 'Assigned' : 'Unassigned'
      }));
      setStudents(mapped);
    } catch (err) {
      console.error('Failed to load assign fees initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      let res;
      if (selectedClass) {
        res = await studentService.getStudents({ classId: selectedClass });
      } else {
        res = await feeCollectionService.searchDueFees();
      }

      const list = res?.data || res || [];
      const mapped = list.map((s, idx) => ({
        id: s._id || s.id,
        admissionNo: s.aparId || s.admissionNo || `YIS-${idx+101}`,
        rollNo: s.rollNo || idx + 1,
        name: s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Student',
        class: s.class || s.classId?.className || 'Class I',
        section: s.section || s.sectionId?.sectionName || 'A',
        groups: s.groups?.length || 1,
        billed: s.totalAssigned || 0,
        paid: s.totalPaid || 0,
        due: s.totalDue || 0,
        status: (s.totalAssigned || 0) > 0 ? 'Assigned' : 'Unassigned'
      }));
      setStudents(mapped);
      setSelectedStudents([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (selectedStudents.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Selection Missing', text: 'Please select at least one student from the table.' });
      return;
    }
    if (!selectedGroup) {
      Swal.fire({ icon: 'warning', title: 'Group Missing', text: 'Please select a fee group to assign.' });
      return;
    }
    
    try {
      const res = await feeCollectionService.assignFee({
        studentIds: selectedStudents,
        feeGroupId: selectedGroup,
        dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      Swal.fire({
        icon: 'success',
        title: 'Fees Assigned!',
        text: `Fee structure successfully linked to ${selectedStudents.length} students.`,
        confirmButtonColor: '#6366f1'
      });

      handleSearch(); 
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Assignment Failed',
        text: err.response?.data?.message || 'Could not assign fee group.'
      });
    }
  };
  
  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedStudents(students.map(s => s.id));
    else setSelectedStudents([]);
  };

  const handleSelectOne = (id) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const totalAssignedCount = students.filter(s => s.status === 'Assigned').length;
  const totalBilled = students.reduce((sum, s) => sum + s.billed, 0);
  const totalCollected = students.reduce((sum, s) => sum + s.paid, 0);
  const totalOutstanding = students.reduce((sum, s) => sum + s.due, 0);

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto bg-slate-50/70 min-h-screen text-slate-800 pb-24 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 text-white rounded-3xl p-6 shadow-xl shadow-indigo-950/10 mb-6 border border-indigo-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold mb-2 border border-white/10">
              <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Enrollment & Fee Structure Allocation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Manage Fee Assignments
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Bind academic fee groups and quarterly payment schedules to students in bulk or individually.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsUnderstandingOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/15 flex items-center gap-2 transition-all cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>How Assignments Work</span>
            </button>
          </div>
        </div>
      </div>

      <FinanceTabs />

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Students in View</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{students.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Fees</p>
            <h3 className="text-xl font-black text-emerald-600 mt-0.5">{totalAssignedCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Demanded</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">₹{totalBilled.toLocaleString('en-IN')}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outstanding Dues</p>
            <h3 className="text-xl font-black text-rose-600 mt-0.5">₹{totalOutstanding.toLocaleString('en-IN')}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Action / Assignment Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 mb-6">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-indigo-600" />
          <span>Select Target Group & Action</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
          <div className="sm:col-span-3">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Filter by Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Classes</option>
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.className || c.name}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-4">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Assign Fee Group Structure</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {feeGroups.map(fg => (
                <option key={fg._id} value={fg._id}>{fg.name}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Due Date (Optional)</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2 flex gap-2">
            <button
              onClick={handleSearch}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Filter
            </button>
            <button
              onClick={handleAssign}
              disabled={selectedStudents.length === 0}
              className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Assign ({selectedStudents.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Students Selection Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Students Roster for Fee Assignment
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              {students.length} students
            </span>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Selected: <strong className="text-indigo-600">{selectedStudents.length}</strong> of {students.length}
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 font-medium">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading students roster...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedStudents.length > 0 && selectedStudents.length === students.length}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                  </th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Admission No</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3 text-right">Demanded</th>
                  <th className="py-3 px-3 text-right">Paid</th>
                  <th className="py-3 px-3 text-right">Due Balance</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {students.map((s) => {
                  const isChecked = selectedStudents.includes(s.id);
                  return (
                    <tr 
                      key={s.id} 
                      onClick={() => handleSelectOne(s.id)}
                      className={`cursor-pointer transition-colors ${isChecked ? 'bg-indigo-50/50' : 'hover:bg-slate-50/70'}`}
                    >
                      <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectOne(s.id)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900">{s.name}</span>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-slate-600">{s.admissionNo}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                          {s.class} ({s.section})
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-600 font-semibold">
                        ₹{s.billed.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right text-emerald-600 font-semibold">
                        ₹{s.paid.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-rose-600">
                        ₹{s.due.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === 'Assigned' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {s.status}
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

      <QuickSetupModal isOpen={isQuickSetupOpen} onClose={() => setIsQuickSetupOpen(false)} />
      <UnderstandingAssignmentsModal isOpen={isUnderstandingOpen} onClose={() => setIsUnderstandingOpen(false)} />
    </div>
  );
};

export default AssignFees;

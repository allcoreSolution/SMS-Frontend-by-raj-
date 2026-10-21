import React, { useState, useEffect, useMemo } from 'react';
import { 
  WalletCards, Search, Save, CheckSquare, Square, 
  ArrowRight, Users, AlertCircle, RefreshCw, Zap, 
  Filter, Calendar, ChevronRight, CheckCircle2, DollarSign
} from 'lucide-react';
import Swal from 'sweetalert2';
import FinanceTabs from '../../components/finance/FinanceTabs';
import QuickSetupModal from '../../components/finance/QuickSetupModal';
import { academicService } from '../../api/academicService';
import { financeService } from '../../api/financeService';
import { feeCollectionService } from '../../api/feeCollectionService';

const FeesCarryForward = () => {
  const [isQuickSetupOpen, setIsQuickSetupOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [feeGroups, setFeeGroups] = useState([]);
  const [studentsWithDues, setStudentsWithDues] = useState([]);
  
  // Selection states
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [targetFeeGroup, setTargetFeeGroup] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    d.setDate(10);
    return d.toISOString().slice(0, 10);
  });
  
  const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [tableSearch, setTableSearch] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [classRes, sectionRes, groupRes] = await Promise.all([
        academicService.getClasses(),
        academicService.getSections(),
        financeService.getFeeGroups()
      ]);

      const classList = classRes.data || classRes || [];
      const sectionList = sectionRes.data || sectionRes || [];
      const groupList = groupRes.data || groupRes || [];

      setClasses(classList);
      setSections(sectionList);
      setFeeGroups(groupList);
      if (groupList.length > 0) {
        setTargetFeeGroup(groupList[0]._id);
      }
    } catch (err) {
      console.error('Error loading metadata:', err);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setHasSearched(true);
      const res = await feeCollectionService.searchDueFees();
      const allDues = res.data || res || [];

      // Filter by selectedClass and selectedSection
      const filtered = allDues.filter(item => {
        if (selectedClass) {
          const className = item.class || item.student?.classId?.className || '';
          const classId = item.academicClass?._id || item.student?.classId?._id || '';
          if (className !== selectedClass && classId !== selectedClass) return false;
        }
        if (selectedSection) {
          const secName = item.section || item.student?.sectionId?.sectionName || '';
          const secId = item.student?.sectionId?._id || '';
          if (secName !== selectedSection && secId !== selectedSection) return false;
        }
        return item.totalDue > 0;
      });

      setStudentsWithDues(filtered);
      // By default select all students with dues
      const initialSelected = new Set(filtered.map(s => s._id || s.id));
      setSelectedStudentIds(initialSelected);
    } catch (err) {
      console.error('Error searching due fees:', err);
      Swal.fire('Error', 'Failed to load students with outstanding dues', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectStudent = (id) => {
    const updated = new Set(selectedStudentIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedStudentIds(updated);
  };

  const handleSelectAll = () => {
    if (selectedStudentIds.size === filteredStudents.length) {
      setSelectedStudentIds(new Set());
    } else {
      setSelectedStudentIds(new Set(filteredStudents.map(s => s._id || s.id)));
    }
  };

  const filteredStudents = useMemo(() => {
    if (!tableSearch) return studentsWithDues;
    const q = tableSearch.toLowerCase();
    return studentsWithDues.filter(s => 
      (s.name || '').toLowerCase().includes(q) ||
      (s.admissionNo || '').toLowerCase().includes(q) ||
      (s.class || '').toLowerCase().includes(q)
    );
  }, [studentsWithDues, tableSearch]);

  const totalSelectedDue = useMemo(() => {
    return studentsWithDues
      .filter(s => selectedStudentIds.has(s._id || s.id))
      .reduce((sum, s) => sum + (s.totalDue || 0), 0);
  }, [studentsWithDues, selectedStudentIds]);

  const handleExecuteCarryForward = async () => {
    if (selectedStudentIds.size === 0) {
      Swal.fire('No Students Selected', 'Please select at least one student to carry forward dues.', 'warning');
      return;
    }

    if (!targetFeeGroup) {
      Swal.fire('Target Fee Group Required', 'Please select a fee group to carry forward these balances into.', 'warning');
      return;
    }

    const targetGroupObj = feeGroups.find(g => g._id === targetFeeGroup);

    const result = await Swal.fire({
      title: 'Confirm Bulk Carry Forward',
      html: `<div class="text-left text-sm space-y-2">
        <p>You are about to roll forward outstanding dues into the new session/group.</p>
        <div class="bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-indigo-900 mt-2">
          <p><strong>Students Count:</strong> ${selectedStudentIds.size}</p>
          <p><strong>Total Demand to Forward:</strong> ₹${totalSelectedDue.toLocaleString('en-IN')}</p>
          <p><strong>Target Fee Group:</strong> ${targetGroupObj ? targetGroupObj.name : 'Selected Group'}</p>
          <p><strong>New Due Date:</strong> ${dueDate}</p>
        </div>
        <p class="text-xs text-slate-500 mt-2">This will create verified assigned fee records for all selected students.</p>
      </div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Carry Forward',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#4f46e5'
    });

    if (!result.isConfirmed) return;

    try {
      setSubmitting(true);
      const payload = {
        studentIds: Array.from(selectedStudentIds),
        targetFeeGroupId: targetFeeGroup,
        dueDate
      };

      const res = await feeCollectionService.carryForwardDues(payload);
      if (res && res.success) {
        await Swal.fire({
          title: 'Carry Forward Complete!',
          text: res.message || `Successfully carried forward dues for ${selectedStudentIds.size} students.`,
          icon: 'success',
          confirmButtonColor: '#4f46e5'
        });
        // Reload dues
        await handleSearch();
      }
    } catch (err) {
      console.error('Carry forward error:', err);
      Swal.fire('Execution Failed', err?.response?.data?.message || 'Could not complete carry forward', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto bg-slate-50/60 min-h-screen text-slate-800 pb-24 font-sans">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 text-white p-3.5 rounded-2xl text-xs flex items-center justify-between gap-3 mb-5 shadow-sm shadow-indigo-500/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-xs">
            <WalletCards className="w-4 h-4 text-white" />
          </div>
          <p className="leading-relaxed">
            <strong className="font-semibold">Fee Carry Forward & Bulk Arrears Migration:</strong> Automatically rollover outstanding student balances from the current or previous academic terms into the upcoming session's fee group.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <WalletCards className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Bulk Fee Entry & Carry Forward</h1>
              <p className="text-xs text-slate-500">Migrate and assign outstanding arrears to new billing cycles</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsQuickSetupOpen(true)}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-xs hover:bg-slate-50 transition-all hover:border-slate-300"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" /> Quick Setup
        </button>
      </div>

      {/* Tabs */}
      <FinanceTabs />

      {/* Filter & Target Configuration Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 md:p-6 mb-6">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
          <Filter className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-800">Step 1: Filter Student Arrears & Set Target Fee Group</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {/* Class Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              FILTER CLASS
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              <option value="">All Classes (School-wide)</option>
              {classes.map((c) => (
                <option key={c._id} value={c.className || c._id}>
                  {c.className}
                </option>
              ))}
            </select>
          </div>

          {/* Section Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              FILTER SECTION
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              <option value="">All Sections</option>
              {sections.map((s) => (
                <option key={s._id} value={s.sectionName || s._id}>
                  Section {s.sectionName}
                </option>
              ))}
            </select>
          </div>

          {/* Target Fee Group */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              TARGET FEE GROUP <span className="text-rose-500">*</span>
            </label>
            <select
              value={targetFeeGroup}
              onChange={(e) => setTargetFeeGroup(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium"
            >
              {feeGroups.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              NEW DUE DATE <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all disabled:opacity-60"
          >
            <Search className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Scanning Outstanding Dues...' : 'Load Students With Dues'}
          </button>
        </div>
      </div>

      {/* KPI Overview (Shown after search) */}
      {hasSearched && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">STUDENTS FOUND</span>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{studentsWithDues.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">SELECTED FOR MIGRATION</span>
              <p className="text-2xl font-bold text-violet-600 mt-0.5">{selectedStudentIds.size}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">TOTAL FORWARD AMOUNT</span>
              <p className="text-2xl font-bold text-emerald-600 mt-0.5">₹{totalSelectedDue.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Student List Table */}
      {hasSearched && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          
          {/* Table Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 transition-all"
              >
                {selectedStudentIds.size === filteredStudents.length && filteredStudents.length > 0 ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                <span>{selectedStudentIds.size === filteredStudents.length && filteredStudents.length > 0 ? 'Deselect All' : 'Select All'}</span>
              </button>
              <span className="text-xs text-slate-500">
                ({selectedStudentIds.size} of {filteredStudents.length} selected)
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Search student or ID..."
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <button
                onClick={handleExecuteCarryForward}
                disabled={submitting || selectedStudentIds.size === 0}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all whitespace-nowrap disabled:opacity-50"
              >
                <Save className={`w-3.5 h-3.5 ${submitting ? 'animate-spin' : ''}`} />
                <span>{submitting ? 'Processing...' : 'Execute Carry Forward'}</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                  <th className="py-3 px-4 w-12 text-center">Select</th>
                  <th className="py-3 px-4">Admission ID</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Class & Sec</th>
                  <th className="py-3 px-4 text-right">Assigned Demand</th>
                  <th className="py-3 px-4 text-right">Paid Amount</th>
                  <th className="py-3 px-4 text-right">Outstanding Dues (₹)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                      <span>Loading students with outstanding balances...</span>
                    </td>
                  </tr>
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const sid = student._id || student.id;
                    const isSelected = selectedStudentIds.has(sid);
                    return (
                      <tr 
                        key={sid} 
                        onClick={() => toggleSelectStudent(sid)}
                        className={`cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50/30 hover:bg-indigo-50/50' : 'hover:bg-slate-50/80'}`}
                      >
                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectStudent(sid)}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                          />
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium text-indigo-600">
                          {student.admissionNo || student.aparId || 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {student.name || `${student.firstName || ''} ${student.lastName || ''}`}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {student.class} - {student.section}
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-500">
                          ₹{(student.totalAssigned || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-right text-emerald-600 font-medium">
                          ₹{(student.totalPaid || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-rose-600">
                          ₹{(student.totalDue || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            DUE
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-400">
                      <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                      <p className="font-semibold text-slate-700">No outstanding dues found!</p>
                      <p className="text-xs text-slate-400 mt-1">All students in this class/section have cleared their balances.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
            <span>Showing {filteredStudents.length} students with active arrears</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">Selected Total:</span>
              <span className="font-bold text-indigo-700 text-sm">₹{totalSelectedDue.toLocaleString('en-IN')}</span>
            </div>
          </div>

        </div>
      )}

      {/* Quick Setup Modal */}
      <QuickSetupModal isOpen={isQuickSetupOpen} onClose={() => setIsQuickSetupOpen(false)} />

    </div>
  );
};

export default FeesCarryForward;

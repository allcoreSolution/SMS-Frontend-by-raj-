import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HandHeart, FileSearch, UserPlus, Layers, Tags, 
  Plus, Search, Filter, Trash2, X, RefreshCw, 
  CheckCircle, Users, DollarSign, Calendar, AlertCircle, 
  Zap, ArrowRight, User
} from 'lucide-react';
import { accountantService } from '../api/accountantService';
import localDb from '../api/localDb';
import Swal from 'sweetalert2';

const FEE_NAV_TABS = [
  { label: 'Collect Fees', path: '/fees/collect', icon: HandHeart },
  { label: 'Search Due Fees', path: '/fees/due', icon: FileSearch },
  { label: 'Assign Fees', path: '/fees/assign', icon: UserPlus, active: true },
  { label: 'Fee Groups', path: '/fees/groups', icon: Layers },
  { label: 'Fee Types', path: '/fees/types', icon: Tags },
];

const AssignFees = () => {
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');

  // Modals
  const [showSingleModal, setShowSingleModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Forms
  const [singleForm, setSingleForm] = useState({ studentId: '', groupId: '', amount: '', note: '' });
  const [bulkForm, setBulkForm] = useState({ className: '', groupId: '', amount: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const [stRes, grRes] = await Promise.all([
        accountantService.getStudents(),
        accountantService.getFeeGroups(),
      ]);
      if (stRes.success) setStudents(stRes.data || []);
      if (grRes.success) setGroups(grRes.data || []);

      const cols = localDb.getAll('collections').filter((c) => c.type === 'assignment');
      setAssignments(cols);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (a.studentName && a.studentName.toLowerCase().includes(q)) ||
        (a.groupName && a.groupName.toLowerCase().includes(q)) ||
        (a.id && a.id.toLowerCase().includes(q));

      const matchesClass = !classFilter || a.className === classFilter;
      return matchesSearch && matchesClass;
    });
  }, [assignments, search, classFilter]);

  // Unique Classes
  const availableClasses = useMemo(() => {
    return Array.from(new Set(students.map((s) => s.class).filter(Boolean)));
  }, [students]);

  // Metrics
  const metrics = useMemo(() => {
    const totalVolume = assignments.reduce((acc, a) => acc + (Number(a.amount) || 0), 0);
    const totalCount = assignments.length;
    const activeGroupsCount = groups.length;
    return { totalVolume, totalCount, activeGroupsCount };
  }, [assignments, groups]);

  // When group changes in Single Form, auto-fill amount
  const handleSingleGroupChange = (grpId) => {
    const grp = groups.find((g) => (g.id || g._id) === grpId);
    setSingleForm((prev) => ({
      ...prev,
      groupId: grpId,
      amount: grp?.amount || grp?.total || '',
    }));
  };

  // Submit Single Assignment
  const handleSingleAssign = async (e) => {
    e.preventDefault();
    if (!singleForm.studentId || !singleForm.groupId) {
      return Swal.fire('Error', 'Please select both student and fee group.', 'warning');
    }
    const student = students.find((s) => (s.id || s._id) === singleForm.studentId);
    const group = groups.find((g) => (g.id || g._id) === singleForm.groupId);
    const amt = Number(singleForm.amount) || group?.amount || group?.total || 0;

    try {
      const res = await accountantService.assignFees({
        studentId: singleForm.studentId,
        studentName: student?.name || '',
        className: student?.class || '',
        groupId: singleForm.groupId,
        groupName: group?.name || '',
        amount: amt,
        note: singleForm.note,
        date: new Date().toISOString().slice(0, 10),
      });

      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Fee Assigned!',
          text: `₹${amt.toLocaleString('en-IN')} assigned to ${student?.name}. Due balance updated.`,
          timer: 1600,
          showConfirmButton: false,
        });
        setShowSingleModal(false);
        setSingleForm({ studentId: '', groupId: '', amount: '', note: '' });
        loadData();
      }
    } catch (err) {
      Swal.fire('Error', err.message || 'Failed to assign fee', 'error');
    }
  };

  // Submit Bulk Assignment
  const handleBulkAssign = async (e) => {
    e.preventDefault();
    if (!bulkForm.className || !bulkForm.groupId) {
      return Swal.fire('Error', 'Please select class and fee group.', 'warning');
    }
    const group = groups.find((g) => (g.id || g._id) === bulkForm.groupId);
    const amt = Number(bulkForm.amount) || group?.amount || group?.total || 0;
    const targetStudents = students.filter((s) => s.class === bulkForm.className);

    const conf = await Swal.fire({
      title: `Bulk Assign Fee to ${bulkForm.className}?`,
      text: `This will allocate ₹${amt.toLocaleString('en-IN')} each to all ${targetStudents.length} students in ${bulkForm.className} (Total: ₹${(amt * targetStudents.length).toLocaleString('en-IN')}).`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Assign All',
      confirmButtonColor: '#3c8dbc',
    });

    if (!conf.isConfirmed) return;

    try {
      const res = await accountantService.assignFeesToClass({
        className: bulkForm.className,
        groupId: bulkForm.groupId,
        groupName: group?.name || '',
        amount: amt,
      });

      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Bulk Assignment Complete!',
          text: `Successfully allocated fee structure to ${res.data.count} students in ${bulkForm.className}.`,
          timer: 1800,
          showConfirmButton: false,
        });
        setShowBulkModal(false);
        setBulkForm({ className: '', groupId: '', amount: '' });
        loadData();
      }
    } catch (err) {
      Swal.fire('Error', err.message || 'Bulk assignment failed', 'error');
    }
  };

  // Remove Assignment
  const handleDeleteAssignment = async (item) => {
    const conf = await Swal.fire({
      title: 'Revoke Fee Assignment?',
      text: `Remove allocation of "${item.groupName}" for ${item.studentName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dd4b39',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, Revoke',
    });

    if (conf.isConfirmed) {
      localDb.remove('collections', item.id);
      // deduct from student due if exists
      const student = localDb.getById('students', item.studentId);
      if (student) {
        localDb.update('students', item.studentId, {
          due: Math.max(0, (student.due || 0) - (Number(item.amount) || 0)),
        });
      }
      Swal.fire({ icon: 'success', title: 'Revoked', timer: 1200, showConfirmButton: false });
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333] p-4 sm:p-6 font-sans">
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#333] leading-tight flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-[#3c8dbc]" /> Assign Fees & Batch Allocation
          </h1>
          <p className="text-[13px] text-gray-500">
            Allocate tuition and recurring fee groups to individual students or entire class batches.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setBulkForm({ className: availableClasses[0] || '', groupId: groups[0]?.id || '', amount: groups[0]?.amount || '' });
              setShowBulkModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-[3px] text-[12px] font-semibold transition shadow-xs"
          >
            <Zap className="w-4 h-4 text-amber-300" /> ⚡ Bulk Assign by Class
          </button>
          <button
            onClick={() => {
              setSingleForm({ studentId: students[0]?.id || '', groupId: groups[0]?.id || '', amount: groups[0]?.amount || '', note: '' });
              setShowSingleModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white rounded-[3px] text-[12px] font-semibold transition shadow-xs"
          >
            <Plus className="w-4 h-4" /> Assign to Student
          </button>
          <button
            onClick={loadData}
            title="Refresh"
            className="p-1.5 bg-white border border-gray-300 rounded-[3px] text-gray-600 hover:bg-gray-50 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── UNIFIED FEES NAVIGATION TABS ── */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-300 pb-2">
        {FEE_NAV_TABS.map((tab, idx) => {
          const Icon = tab.icon;
          return (
            <Link
              key={idx}
              to={tab.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-[3px] text-[13px] font-semibold transition-all ${
                tab.active
                  ? 'bg-white text-[#3c8dbc] border-t-2 border-t-[#3c8dbc] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* ── KPI METRICS CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#3c8dbc] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Total Allocated Fees</span>
            <h3 className="text-[26px] font-bold mt-1">₹{metrics.totalVolume.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] opacity-80">Cumulated Structure Assigned</span>
          </div>
          <DollarSign className="w-12 h-12 text-black/10" />
        </div>

        <div className="bg-[#00a65a] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Total Student Allocations</span>
            <h3 className="text-[26px] font-bold mt-1">{metrics.totalCount}</h3>
            <span className="text-[11px] opacity-80">Active Fee Structure Records</span>
          </div>
          <Users className="w-12 h-12 text-black/10" />
        </div>

        <div className="bg-[#605ca8] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Configured Fee Groups</span>
            <h3 className="text-[26px] font-bold mt-1">{metrics.activeGroupsCount}</h3>
            <span className="text-[11px] opacity-80">Ready for Immediate Assignment</span>
          </div>
          <Layers className="w-12 h-12 text-black/10" />
        </div>
      </div>

      {/* ── FILTER TOOLBAR ── */}
      <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-grow">
          <div className="w-full sm:w-48">
            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Filter Class</label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] bg-white focus:outline-none focus:border-[#3c8dbc]"
            >
              <option value="">-- All Classes --</option>
              {availableClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-64">
            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Search Allocations</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search student or fee group..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-[3px] pl-3 pr-8 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {(classFilter || search) && (
            <div className="self-end pb-0.5">
              <button
                onClick={() => { setClassFilter(''); setSearch(''); }}
                className="text-xs text-[#dd4b39] hover:underline flex items-center gap-1 py-1"
              >
                <X className="w-3.5 h-3.5" /> Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-[#f4f4f4] text-gray-700 text-[12px] font-bold uppercase border-b border-gray-200">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Allocated Fee Group</th>
                <th className="py-3 px-4 text-right">Fee Amount</th>
                <th className="py-3 px-4">Assigned Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-[#333] divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-[#3c8dbc]" />
                      <span>Loading fee allocations...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Layers className="w-10 h-10 text-gray-300" />
                      <span className="font-semibold text-gray-700 text-sm">No fee assignments recorded yet</span>
                      <span className="text-xs text-gray-400">Click "Assign to Student" or "Bulk Assign by Class" to allocate fee groups.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center text-gray-400 text-xs">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-900 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400" /> {item.studentName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-xs">
                        {item.className || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#3c8dbc]">{item.groupName || 'Fee Structure'}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-gray-900 font-mono">
                      ₹{Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">{item.date}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleDeleteAssignment(item)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded transition"
                        title="Revoke Assignment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL: ASSIGN TO INDIVIDUAL STUDENT ── */}
      {showSingleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#3c8dbc] text-white px-5 py-3.5 flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <UserPlus className="w-4 h-4" /> Assign Fee to Student
              </h3>
              <button onClick={() => setShowSingleModal(false)} className="text-white hover:text-white/80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSingleAssign} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Select Student *</label>
                <select
                  required
                  value={singleForm.studentId}
                  onChange={(e) => setSingleForm({ ...singleForm, studentId: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-[#3c8dbc]"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((s) => (
                    <option key={s.id || s._id} value={s.id || s._id}>
                      {s.name} ({s.class}) — Roll: {s.roll}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Select Fee Group *</label>
                <select
                  required
                  value={singleForm.groupId}
                  onChange={(e) => handleSingleGroupChange(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-[#3c8dbc]"
                >
                  <option value="">-- Choose Fee Group --</option>
                  {groups.map((g) => (
                    <option key={g.id || g._id} value={g.id || g._id}>
                      {g.name} (₹{g.amount || g.total || 0})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Fee Amount to Assign (₹) *</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={singleForm.amount}
                  onChange={(e) => setSingleForm({ ...singleForm, amount: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#3c8dbc]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowSingleModal(false)}
                  className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white rounded text-xs font-semibold"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: BULK ASSIGN BY CLASS ── */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-3.5 flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-300" /> Bulk Allocate Fee by Class Batch
              </h3>
              <button onClick={() => setShowBulkModal(false)} className="text-white hover:text-white/80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBulkAssign} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Target Class *</label>
                <select
                  required
                  value={bulkForm.className}
                  onChange={(e) => setBulkForm({ ...bulkForm, className: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-indigo-600"
                >
                  <option value="">-- Choose Class Batch --</option>
                  {availableClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls} ({students.filter((s) => s.class === cls).length} Students)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Select Fee Group Structure *</label>
                <select
                  required
                  value={bulkForm.groupId}
                  onChange={(e) => {
                    const g = groups.find((grp) => (grp.id || grp._id) === e.target.value);
                    setBulkForm({ ...bulkForm, groupId: e.target.value, amount: g?.amount || g?.total || '' });
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-indigo-600"
                >
                  <option value="">-- Choose Fee Group --</option>
                  {groups.map((g) => (
                    <option key={g.id || g._id} value={g.id || g._id}>
                      {g.name} (₹{g.amount || g.total || 0})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Per-Student Fee Amount (₹) *</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={bulkForm.amount}
                  onChange={(e) => setBulkForm({ ...bulkForm, amount: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-indigo-600"
                />
              </div>

              {bulkForm.className && bulkForm.amount && (
                <div className="bg-indigo-50 border border-indigo-200 rounded p-2.5 text-xs text-indigo-900">
                  <span className="font-bold">Batch Summary:</span> ₹{Number(bulkForm.amount).toLocaleString('en-IN')} ×{' '}
                  {students.filter((s) => s.class === bulkForm.className).length} students ={' '}
                  <b>
                    ₹
                    {(
                      Number(bulkForm.amount) *
                      students.filter((s) => s.class === bulkForm.className).length
                    ).toLocaleString('en-IN')}{' '}
                    Total
                  </b>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold"
                >
                  Allocate to Entire Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignFees;

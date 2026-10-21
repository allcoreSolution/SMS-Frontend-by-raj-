import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HandHeart, FileSearch, UserPlus, Layers, Tags, 
  Search, Filter, Printer, Download, Eye, CheckCircle, 
  DollarSign, Receipt, AlertCircle, RefreshCw, X, 
  Phone, Send, BellRing, User, ArrowRight
} from 'lucide-react';
import { accountantService } from '../api/accountantService';
import Swal from 'sweetalert2';

const FEE_NAV_TABS = [
  { label: 'Collect Fees', path: '/fees/collect', icon: HandHeart },
  { label: 'Search Due Fees', path: '/fees/due', icon: FileSearch, active: true },
  { label: 'Assign Fees', path: '/fees/assign', icon: UserPlus },
  { label: 'Fee Groups', path: '/fees/groups', icon: Layers },
  { label: 'Fee Types', path: '/fees/types', icon: Tags },
];

const SearchDueFees = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [dueRangeFilter, setDueRangeFilter] = useState('all');

  // Modals
  const [collectStudent, setCollectStudent] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [refNo, setRefNo] = useState('');
  const [recentReceipt, setRecentReceipt] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await accountantService.getDueFees();
      if (res.success && res.data) {
        setStudents(
          res.data.map((d) => ({
            id: d._id || d.student?._id,
            adm: d.student?.admissionNo || 'NA',
            name: `${d.student?.firstName || ''} ${d.student?.lastName || ''}`.trim() || 'Student',
            class: d.student?.class || 'N/A',
            father: d.student?.father || 'Parent',
            phone: d.student?.phone || '',
            due: (d.amount || 0) - (d.amountPaid || 0),
          }))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered List
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.class.toLowerCase().includes(q) ||
        s.adm.toLowerCase().includes(q) ||
        s.father.toLowerCase().includes(q) ||
        s.phone.includes(q);

      const matchesClass = !classFilter || s.class === classFilter;

      let matchesRange = true;
      if (dueRangeFilter === 'high') matchesRange = s.due >= 10000;
      else if (dueRangeFilter === 'medium') matchesRange = s.due >= 5000 && s.due < 10000;
      else if (dueRangeFilter === 'low') matchesRange = s.due < 5000;

      return matchesSearch && matchesClass && matchesRange;
    });
  }, [students, search, classFilter, dueRangeFilter]);

  // Unique Classes
  const availableClasses = useMemo(() => {
    return Array.from(new Set(students.map((s) => s.class).filter(Boolean)));
  }, [students]);

  // Overall KPIs
  const stats = useMemo(() => {
    const totalDues = students.reduce((acc, s) => acc + (s.due || 0), 0);
    const count = students.length;
    const highDefaulters = students.filter((s) => s.due >= 10000).length;
    const avgDue = count > 0 ? Math.round(totalDues / count) : 0;
    return { totalDues, count, highDefaulters, avgDue };
  }, [students]);

  // Send Single Reminder
  const handleSendReminder = (student) => {
    Swal.fire({
      title: 'Send Fee Reminder?',
      html: `
        <div class="text-left text-xs text-gray-600 space-y-2 mt-2">
          <p><b>Student:</b> ${student.name} (${student.class})</p>
          <p><b>Parent Phone:</b> ${student.phone || 'N/A'}</p>
          <p><b>Due Amount:</b> <span class="text-red-600 font-bold">₹${student.due.toLocaleString('en-IN')}</span></p>
          <p class="text-gray-400">An automated SMS / WhatsApp fee reminder payment link will be sent to the parent.</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Send Notification',
      confirmButtonColor: '#d81b60',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Reminder Dispatched!',
          text: `Fee recovery reminder sent to ${student.name}'s parent at ${student.phone || 'registered mobile'}.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  // Bulk Reminders
  const handleBulkReminders = () => {
    if (filteredStudents.length === 0) return;
    Swal.fire({
      title: `Send Bulk Reminders to ${filteredStudents.length} Students?`,
      text: 'Dispatch WhatsApp and SMS fee payment alerts to all currently filtered defaulter parents.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Send to All',
      confirmButtonColor: '#d81b60',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Reminders Sent!',
          text: `Successfully queued payment reminders for ${filteredStudents.length} students.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  // Open Collect Modal
  const handleOpenCollect = (student) => {
    setCollectStudent(student);
    setPaymentAmount(student.due);
    setPaymentMode('Cash');
    setRefNo('');
  };

  // Collect Fee
  const handleSubmitCollection = async (e) => {
    e.preventDefault();
    const amt = Number(paymentAmount);
    if (!amt || amt <= 0) return Swal.fire('Error', 'Enter a valid amount', 'warning');

    try {
      const res = await accountantService.collectFee({
        studentId: collectStudent.id,
        studentName: collectStudent.name,
        className: collectStudent.class,
        amount: amt,
        mode: paymentMode,
        refNo,
        date: new Date().toISOString().slice(0, 10),
      });

      if (res.success) {
        setRecentReceipt(res.data);
        setCollectStudent(null);
        loadData();
      }
    } catch (err) {
      Swal.fire('Error', err.message || 'Payment collection failed', 'error');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredStudents.length === 0) return Swal.fire('Info', 'No students to export', 'info');
    const headers = ['Admission No', 'Student Name', 'Class', 'Father Name', 'Phone', 'Due Amount'];
    const rows = filteredStudents.map((s) => [
      `"${s.adm}"`,
      `"${s.name}"`,
      `"${s.class}"`,
      `"${s.father}"`,
      `"${s.phone}"`,
      s.due,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const a = document.createElement('a');
    a.href = encoded;
    a.download = `defaulters_list_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333] p-4 sm:p-6 font-sans">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#333] leading-tight flex items-center gap-2">
            <FileSearch className="w-6 h-6 text-[#d81b60]" /> Search Due Fees & Defaulters
          </h1>
          <p className="text-[13px] text-gray-500">
            Track outstanding student dues, filter by critical amounts, and dispatch instant payment reminders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBulkReminders}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-pink-300 rounded-[3px] bg-pink-50 text-pink-700 text-[12px] font-semibold hover:bg-pink-100 transition"
          >
            <BellRing className="w-3.5 h-3.5" /> Send Bulk Reminders
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-[3px] bg-white text-gray-700 text-[12px] font-semibold hover:bg-gray-50 transition"
          >
            <Download className="w-3.5 h-3.5 text-[#3c8dbc]" /> Export Defaulters
          </button>
          <button
            onClick={loadData}
            title="Refresh Ledger"
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
                  ? 'bg-white text-[#d81b60] border-t-2 border-t-[#d81b60] shadow-xs'
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#dd4b39] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Total Dues Pending</span>
            <h3 className="text-[26px] font-bold mt-1">₹{stats.totalDues.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] opacity-80">{stats.count} Total Students</span>
          </div>
          <AlertCircle className="w-12 h-12 text-black/10" />
        </div>

        <div className="bg-[#d81b60] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">High Defaulters (≥ ₹10k)</span>
            <h3 className="text-[26px] font-bold mt-1">{stats.highDefaulters}</h3>
            <span className="text-[11px] opacity-80">Immediate Followup</span>
          </div>
          <BellRing className="w-12 h-12 text-black/10" />
        </div>

        <div className="bg-[#f39c12] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Average Due per Student</span>
            <h3 className="text-[26px] font-bold mt-1">₹{stats.avgDue.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] opacity-80">Across All Defaulters</span>
          </div>
          <DollarSign className="w-12 h-12 text-black/10" />
        </div>

        <div className="bg-[#00a65a] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Filtered Records</span>
            <h3 className="text-[26px] font-bold mt-1">{filteredStudents.length}</h3>
            <span className="text-[11px] opacity-80">Matching Current Filters</span>
          </div>
          <CheckCircle className="w-12 h-12 text-black/10" />
        </div>
      </div>

      {/* ── FILTERS TOOLBAR ── */}
      <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-grow">
          <div className="w-full sm:w-48">
            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Class Filter</label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] bg-white focus:outline-none focus:border-[#d81b60]"
            >
              <option value="">-- All Classes --</option>
              {availableClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-48">
            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Due Amount Range</label>
            <select
              value={dueRangeFilter}
              onChange={(e) => setDueRangeFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] bg-white focus:outline-none focus:border-[#d81b60]"
            >
              <option value="all">All Pending Dues</option>
              <option value="high">Critical (≥ ₹10,000)</option>
              <option value="medium">Moderate (₹5,000 - ₹9,999)</option>
              <option value="low">Minor (&lt; ₹5,000)</option>
            </select>
          </div>

          <div className="w-full sm:w-64">
            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Search Defaulter</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search name, adm no, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-[3px] pl-3 pr-8 py-1.5 text-[13px] focus:outline-none focus:border-[#d81b60]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {(classFilter || dueRangeFilter !== 'all' || search) && (
            <div className="self-end pb-0.5">
              <button
                onClick={() => { setClassFilter(''); setDueRangeFilter('all'); setSearch(''); }}
                className="text-xs text-[#dd4b39] hover:underline flex items-center gap-1 py-1"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#f4f4f4] text-gray-700 text-[12px] font-bold uppercase border-b border-gray-200">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Adm No</th>
                <th className="py-3 px-4">Student & Father Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4 text-right">Due Amount</th>
                <th className="py-3 px-4 text-center">Severity</th>
                <th className="py-3 px-4 text-center w-[200px]">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-[#333] divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-[#d81b60]" />
                      <span>Loading fee due records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CheckCircle className="w-10 h-10 text-emerald-500" />
                      <span className="font-semibold text-gray-700 text-sm">No matching defaulters found!</span>
                      <span className="text-xs text-gray-400">All fees are cleared for this selection.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => {
                  const isHigh = s.due >= 10000;
                  const isMed = s.due >= 5000 && s.due < 10000;

                  return (
                    <tr key={s.id || idx} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-center text-gray-400 text-xs">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#3c8dbc]">{s.adm}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-gray-400" /> {s.name}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">Father: {s.father}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-xs">
                          {s.class}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        {s.phone ? (
                          <a href={`tel:${s.phone}`} className="text-gray-700 hover:text-[#3c8dbc] flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" /> {s.phone}
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">No phone</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-rose-600 font-mono text-[14px]">
                        ₹{s.due.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isHigh
                              ? 'bg-rose-100 text-rose-700 border border-rose-200'
                              : isMed
                              ? 'bg-amber-100 text-amber-700 border border-amber-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {isHigh ? 'Critical' : isMed ? 'Moderate' : 'Minor'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenCollect(s)}
                            className="bg-[#00a65a] hover:bg-[#008d4c] text-white px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition"
                            title="Collect Fee Now"
                          >
                            <Receipt className="w-3 h-3" /> Collect
                          </button>
                          <button
                            onClick={() => handleSendReminder(s)}
                            className="bg-pink-50 hover:bg-pink-100 text-[#d81b60] border border-pink-200 px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition"
                            title="Send SMS / WhatsApp Alert"
                          >
                            <Send className="w-3 h-3" /> Alert
                          </button>
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

      {/* ── MODAL: QUICK COLLECT ── */}
      {collectStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#00a65a] text-white px-5 py-3.5 flex justify-between items-center">
              <h3 className="font-bold text-sm">Collect Due Fee — {collectStudent.name}</h3>
              <button onClick={() => setCollectStudent(null)} className="text-white hover:text-white/80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCollection} className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between"><span>Student:</span><b>{collectStudent.name} ({collectStudent.class})</b></div>
                <div className="flex justify-between"><span>Admission No:</span><b className="font-mono">{collectStudent.adm}</b></div>
                <div className="flex justify-between text-rose-600 font-bold text-sm">
                  <span>Current Due:</span><span>₹{collectStudent.due.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Payment Amount (₹)</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-base font-bold text-gray-800 focus:outline-none focus:border-[#00a65a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Payment Mode</label>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {['Cash', 'UPI', 'Cheque', 'Bank Transfer'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMode(m)}
                      className={`py-1.5 font-semibold rounded border text-center ${
                        paymentMode === m ? 'bg-[#00a65a] text-white border-[#00a65a]' : 'bg-white border-gray-200 text-gray-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMode !== 'Cash' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Ref / UTR / Cheque No.</label>
                  <input
                    type="text"
                    value={refNo}
                    onChange={(e) => setRefNo(e.target.value)}
                    placeholder="Reference Number..."
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[#00a65a]"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCollectStudent(null)}
                  className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded text-xs font-semibold flex items-center gap-1"
                >
                  Confirm & Clear Due
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: RECEIPT ── */}
      {recentReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-[6px] shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white px-5 py-3 flex justify-between items-center">
              <span className="font-bold text-xs flex items-center gap-1.5 text-emerald-400">
                <CheckCircle className="w-4 h-4" /> Payment Collected
              </span>
              <button onClick={() => setRecentReceipt(null)} className="text-white hover:text-white/80">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs text-center">
              <div className="border-b border-dashed border-gray-300 pb-2">
                <h4 className="font-bold text-sm text-gray-900">Y.U.G INTERNATIONAL SCHOOL</h4>
                <span className="font-mono font-bold text-gray-700 text-xs">Receipt: {recentReceipt.receipt}</span>
              </div>
              <div className="text-left space-y-1">
                <div className="flex justify-between"><span className="text-gray-500">Student:</span><b className="text-gray-800">{recentReceipt.studentName}</b></div>
                <div className="flex justify-between"><span className="text-gray-500">Date:</span><span>{recentReceipt.date}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Mode:</span><span className="font-bold text-[#00a65a]">{recentReceipt.mode}</span></div>
                <div className="flex justify-between text-base font-bold text-emerald-700 pt-1 border-t border-gray-100">
                  <span>Amount Paid:</span>
                  <span>₹{Number(recentReceipt.amount).toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button
                onClick={() => { window.print(); setRecentReceipt(null); }}
                className="w-full mt-2 bg-slate-800 hover:bg-slate-900 text-white py-2 rounded text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDueFees;

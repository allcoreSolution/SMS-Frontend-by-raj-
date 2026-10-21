import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  HandHeart, FileSearch, UserPlus, Layers, Tags, 
  Search, Filter, Printer, Download, Eye, CheckCircle, 
  DollarSign, Zap, Receipt, AlertCircle, RefreshCw, X, 
  Check, CreditCard, QrCode, ArrowRight, User
} from 'lucide-react';
import { accountantService } from '../api/accountantService';
import Swal from 'sweetalert2';

const FEE_NAV_TABS = [
  { label: 'Collect Fees', path: '/fees/collect', icon: HandHeart, active: true },
  { label: 'Search Due Fees', path: '/fees/due', icon: FileSearch },
  { label: 'Assign Fees', path: '/fees/assign', icon: UserPlus },
  { label: 'Fee Groups', path: '/fees/groups', icon: Layers },
  { label: 'Fee Types', path: '/fees/types', icon: Tags },
];

const CollectFees = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [collectionsHistory, setCollectionsHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedClass, setSelectedClass] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('due'); // 'due' | 'recent'
  const [rapidMode, setRapidMode] = useState(false);

  // Modals
  const [collectModalStudent, setCollectModalStudent] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [refNo, setRefNo] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [recentReceipt, setRecentReceipt] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dueRes, colsRes] = await Promise.all([
        accountantService.getDueFees(),
        accountantService.getCollections(),
      ]);
      if (dueRes.success && dueRes.data) {
        setStudentsData(dueRes.data.map((d) => ({
          id: d._id || d.student?._id,
          adm: d.student?.admissionNo || 'NA',
          name: `${d.student?.firstName || ''} ${d.student?.lastName || ''}`.trim() || 'Student',
          class: d.student?.class || 'N/A',
          father: d.student?.father || 'Parent',
          phone: d.student?.phone || '',
          due: (d.amount || 0) - (d.amountPaid || 0),
        })));
      }
      if (colsRes.success && colsRes.data) {
        setCollectionsHistory(colsRes.data.filter((c) => c.type !== 'assignment'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return studentsData.filter((s) => {
      const matchesClass = !selectedClass || s.class === selectedClass;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.adm.toLowerCase().includes(q) ||
        s.class.toLowerCase().includes(q) ||
        s.phone.includes(q);
      return matchesClass && matchesSearch;
    });
  }, [studentsData, selectedClass, searchQuery]);

  // Unique Classes
  const availableClasses = useMemo(() => {
    return Array.from(new Set(studentsData.map((s) => s.class).filter(Boolean)));
  }, [studentsData]);

  // Financial Stats
  const stats = useMemo(() => {
    const totalDue = studentsData.reduce((acc, s) => acc + (s.due || 0), 0);
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayCollected = collectionsHistory
      .filter((c) => c.date === todayStr)
      .reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
    const totalCollected = collectionsHistory.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
    const studentsWithDue = studentsData.filter((s) => s.due > 0).length;

    return { totalDue, todayCollected, totalCollected, studentsWithDue };
  }, [studentsData, collectionsHistory]);

  // Open Collect Modal
  const handleOpenCollect = (student) => {
    setCollectModalStudent(student);
    setPaymentAmount(student.due || '');
    setPaymentMode('Cash');
    setRefNo('');
    setPaymentNote('');
  };

  // Submit Collect Fee
  const handleSubmitCollection = async (e) => {
    e.preventDefault();
    const amt = Number(paymentAmount);
    if (!amt || amt <= 0) {
      return Swal.fire({ icon: 'warning', title: 'Invalid Amount', text: 'Please enter a valid payment amount.' });
    }
    if (amt > collectModalStudent.due) {
      const confirmOverpay = await Swal.fire({
        title: 'Amount Exceeds Total Due',
        text: `Entered amount ₹${amt.toLocaleString('en-IN')} is higher than due ₹${collectModalStudent.due.toLocaleString('en-IN')}. Continue as advance payment?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Proceed',
      });
      if (!confirmOverpay.isConfirmed) return;
    }

    try {
      const res = await accountantService.collectFee({
        studentId: collectModalStudent.id,
        studentName: collectModalStudent.name,
        className: collectModalStudent.class,
        amount: amt,
        mode: paymentMode,
        refNo: refNo.trim(),
        note: paymentNote.trim(),
        date: new Date().toISOString().slice(0, 10),
      });

      if (res.success) {
        const receiptItem = res.data;
        setRecentReceipt({
          ...receiptItem,
          studentAdm: collectModalStudent.adm,
          studentFather: collectModalStudent.father,
          remainingDue: Math.max(0, collectModalStudent.due - amt),
        });
        setCollectModalStudent(null);
        loadData();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Payment collection failed.' });
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredStudents.length === 0) {
      return Swal.fire({ icon: 'info', title: 'No Data', text: 'No due records to export.' });
    }
    const headers = ['Admission No', 'Student Name', 'Class', 'Father Name', 'Phone', 'Total Due (INR)'];
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
    a.download = `student_dues_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333] p-4 sm:p-6 font-sans">
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#333] leading-tight flex items-center gap-2">
            <HandHeart className="w-6 h-6 text-[#00a65a]" /> Student Fee Collection Counter
          </h1>
          <p className="text-[13px] text-gray-500">
            Rapid student fee collection, receipt generation, and real-time ledger accounting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setRapidMode(!rapidMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-[3px] text-[12px] font-bold transition-all shadow-xs ${
              rapidMode
                ? 'bg-amber-500 border-amber-600 text-white shadow'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Zap className={`w-4 h-4 ${rapidMode ? 'text-white' : 'text-amber-500'}`} />
            {rapidMode ? '⚡ Rapid Mode Active' : 'Rapid Mode (Tally Style)'}
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-[3px] bg-white text-gray-700 text-[12px] font-semibold hover:bg-gray-50 transition"
          >
            <Download className="w-3.5 h-3.5 text-[#3c8dbc]" /> Export CSV
          </button>
          <button
            onClick={loadData}
            title="Refresh Records"
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
                  ? 'bg-white text-[#00a65a] border-t-2 border-t-[#00a65a] shadow-xs'
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
        <div className="bg-[#00a65a] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Collected Today</span>
            <h3 className="text-[26px] font-bold mt-1">₹{stats.todayCollected.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] opacity-80">Instant Cash/Bank Sync</span>
          </div>
          <DollarSign className="w-12 h-12 text-black/10" />
        </div>

        <div className="bg-[#dd4b39] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Total Outstanding Dues</span>
            <h3 className="text-[26px] font-bold mt-1">₹{stats.totalDue.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] opacity-80">{stats.studentsWithDue} Students Pending</span>
          </div>
          <AlertCircle className="w-12 h-12 text-black/10" />
        </div>

        <div className="bg-[#3c8dbc] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Total Fees Collected</span>
            <h3 className="text-[26px] font-bold mt-1">₹{stats.totalCollected.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] opacity-80">{collectionsHistory.length} Total Receipts Issued</span>
          </div>
          <Receipt className="w-12 h-12 text-black/10" />
        </div>

        <div className="bg-[#605ca8] text-white p-4 rounded-[3px] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-90">Active Fee Classes</span>
            <h3 className="text-[26px] font-bold mt-1">{availableClasses.length}</h3>
            <span className="text-[11px] opacity-80">Classes Registered</span>
          </div>
          <Layers className="w-12 h-12 text-black/10" />
        </div>
      </div>

      {/* ── FILTER & RAPID SEARCH TOOLBAR ── */}
      <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 mb-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-between">
          <div className="flex flex-wrap items-center gap-3 flex-grow">
            <div className="w-full sm:w-48">
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Filter Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] bg-white focus:outline-none focus:border-[#00a65a]"
              >
                <option value="">-- All Classes --</option>
                {availableClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-72">
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                {rapidMode ? '⚡ Rapid Search (Adm No or Name)' : 'Search Student'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter name, admission no, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus={rapidMode}
                  className="w-full border border-gray-300 rounded-[3px] pl-3 pr-8 py-1.5 text-[13px] focus:outline-none focus:border-[#00a65a]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {(selectedClass || searchQuery) && (
              <div className="self-end pb-0.5">
                <button
                  onClick={() => { setSelectedClass(''); setSearchQuery(''); }}
                  className="text-xs text-[#dd4b39] hover:underline flex items-center gap-1 py-1"
                >
                  <X className="w-3.5 h-3.5" /> Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Tab Switcher: Due List vs Recent Collections */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-[3px] self-end md:self-center">
            <button
              onClick={() => setActiveTab('due')}
              className={`px-3 py-1.5 rounded-[2px] text-xs font-semibold transition ${
                activeTab === 'due' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Students with Due ({filteredStudents.length})
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-3 py-1.5 rounded-[2px] text-xs font-semibold transition ${
                activeTab === 'recent' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Recent Receipts ({collectionsHistory.length})
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN TABLE VIEW ── */}
      <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm overflow-hidden">
        {activeTab === 'due' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-[#f4f4f4] text-gray-700 text-[12px] font-bold uppercase border-b border-gray-200">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Admission No</th>
                  <th className="py-3 px-4">Student & Parent</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4 text-right">Outstanding Due</th>
                  <th className="py-3 px-4 text-center w-[160px]">Action</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-[#333] divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin text-[#00a65a]" />
                        <span>Loading due fees ledger...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                        <span className="font-semibold text-gray-700 text-sm">No pending fee dues found!</span>
                        <span className="text-xs text-gray-400">All matching students are up to date.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s, idx) => (
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
                      <td className="py-3.5 px-4 text-xs text-gray-600">{s.phone || '—'}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-rose-600 font-mono text-[14px]">
                        ₹{s.due.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleOpenCollect(s)}
                          className="bg-[#00a65a] hover:bg-[#008d4c] text-white px-3 py-1.5 rounded-[3px] text-xs font-semibold flex items-center justify-center gap-1.5 mx-auto shadow-xs transition"
                        >
                          <Receipt className="w-3.5 h-3.5" /> Collect Fee
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Recent Collections Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-[#f4f4f4] text-gray-700 text-[12px] font-bold uppercase border-b border-gray-200">
                  <th className="py-3 px-4">Receipt No</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Payment Mode</th>
                  <th className="py-3 px-4 text-right">Amount Collected</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-[#333] divide-y divide-gray-100">
                {collectionsHistory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-400">
                      No collections recorded yet.
                    </td>
                  </tr>
                ) : (
                  collectionsHistory.map((col, idx) => (
                    <tr key={col.id || idx} className="hover:bg-gray-50">
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#00a65a]">{col.receipt || `RCP-${idx + 1}`}</td>
                      <td className="py-3.5 px-4 text-xs text-gray-600">{col.date}</td>
                      <td className="py-3.5 px-4 font-semibold text-gray-800">{col.studentName}</td>
                      <td className="py-3.5 px-4 text-xs text-gray-600">{col.className || 'General'}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-blue-50 text-[#3c8dbc] border border-blue-200 text-xs px-2 py-0.5 rounded font-medium">
                          {col.mode || 'Cash'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-700 font-mono">
                        ₹{Number(col.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setRecentReceipt(col)}
                          className="text-[#3c8dbc] hover:underline text-xs font-semibold flex items-center justify-center gap-1 mx-auto"
                        >
                          <Printer className="w-3.5 h-3.5" /> View Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODAL: COLLECT FEE COUNTER ── */}
      {collectModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#00a65a] text-white px-5 py-3.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                <h3 className="font-bold text-[16px]">Collect Fee — {collectModalStudent.name}</h3>
              </div>
              <button onClick={() => setCollectModalStudent(null)} className="text-white hover:text-white/80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCollection} className="p-5 space-y-4">
              {/* Student Summary Box */}
              <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-xs text-gray-700 grid grid-cols-2 gap-2">
                <div><span className="text-gray-500">Admission No:</span> <b className="font-mono text-gray-900">{collectModalStudent.adm}</b></div>
                <div><span className="text-gray-500">Class:</span> <b className="text-gray-900">{collectModalStudent.class}</b></div>
                <div><span className="text-gray-500">Father's Name:</span> <b className="text-gray-900">{collectModalStudent.father}</b></div>
                <div>
                  <span className="text-gray-500">Total Due:</span>{' '}
                  <b className="text-rose-600 font-mono text-sm">₹{collectModalStudent.due.toLocaleString('en-IN')}</b>
                </div>
              </div>

              {/* Amount to Collect */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                  Amount to Collect (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                  <input
                    type="number"
                    step="any"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] pl-8 pr-3 py-2 text-base font-bold text-gray-800 focus:outline-none focus:border-[#00a65a]"
                  />
                </div>
                <div className="flex gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(collectModalStudent.due)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-medium"
                  >
                    Pay Full Due (₹{collectModalStudent.due})
                  </button>
                  {collectModalStudent.due > 2000 && (
                    <button
                      type="button"
                      onClick={() => setPaymentAmount(Math.round(collectModalStudent.due / 2))}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-medium"
                    >
                      Pay 50% (₹{Math.round(collectModalStudent.due / 2)})
                    </button>
                  )}
                </div>
              </div>

              {/* Payment Mode Selector */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Payment Method</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Cash', 'UPI', 'Cheque', 'Bank Transfer'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMode(m)}
                      className={`py-2 text-xs font-semibold rounded border transition text-center ${
                        paymentMode === m
                          ? 'bg-[#00a65a] border-[#00a65a] text-white shadow-xs'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transaction Ref No */}
              {paymentMode !== 'Cash' && (
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                    Transaction / Cheque / UTR Reference No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UPI-981249120 / CHQ-104921"
                    value={refNo}
                    onChange={(e) => setRefNo(e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#00a65a]"
                  />
                </div>
              )}

              {/* Payment Note */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Receipt Remarks (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Term-1 fee payment by father"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#00a65a]"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCollectModalStudent(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00a65a] hover:bg-[#008d4c] text-white px-5 py-2 rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Receipt className="w-4 h-4" /> Collect & Print Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: OFFICIAL FEE RECEIPT ── */}
      {recentReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-[6px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Fee Receipt Issued</h3>
              </div>
              <button onClick={() => setRecentReceipt(null)} className="text-white hover:text-white/80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs" id="printable-receipt">
              {/* Receipt Header */}
              <div className="text-center pb-3 border-b-2 border-dashed border-gray-300">
                <h2 className="font-bold text-base text-gray-900">Y.U.G INTERNATIONAL SCHOOL</h2>
                <p className="text-[11px] text-gray-500">Affiliated to CBSE • Institutional Fee Counter</p>
                <div className="mt-2 inline-block bg-slate-100 font-mono font-bold text-gray-800 px-3 py-1 rounded text-xs border border-slate-200">
                  RECEIPT NO: {recentReceipt.receipt}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1.5">
                <div className="flex justify-between"><span className="text-gray-500">Date:</span><span className="font-semibold text-gray-800">{recentReceipt.date}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Student Name:</span><span className="font-bold text-gray-900">{recentReceipt.studentName}</span></div>
                {recentReceipt.className && <div className="flex justify-between"><span className="text-gray-500">Class:</span><span className="font-semibold text-gray-800">{recentReceipt.className}</span></div>}
                <div className="flex justify-between"><span className="text-gray-500">Payment Mode:</span><span className="font-semibold text-[#00a65a]">{recentReceipt.mode || 'Cash'}</span></div>
                {recentReceipt.refNo && <div className="flex justify-between"><span className="text-gray-500">Ref / UTR No:</span><span className="font-mono text-gray-800">{recentReceipt.refNo}</span></div>}
              </div>

              {/* Amount Highlight */}
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded text-center">
                <span className="text-gray-600 block text-xs">AMOUNT RECEIVED</span>
                <span className="text-2xl font-bold text-emerald-700 font-mono">
                  ₹{Number(recentReceipt.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-4 border-t border-dashed border-gray-300 flex justify-between items-center text-[10px] text-gray-400">
                <span>Computer Generated Voucher</span>
                <span>Authorized Cashier Sign</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-slate-800 hover:bg-slate-900 text-white py-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Receipt
                </button>
                <button
                  onClick={() => setRecentReceipt(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectFees;

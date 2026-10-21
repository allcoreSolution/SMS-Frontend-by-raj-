import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Filter, Search, Grid, List as ListIcon, 
  FileText, Printer, Download, UserPlus, HandCoins,
  CheckCircle2, AlertTriangle, ArrowRight, RefreshCw,
  X, Check, Sparkles, Building, CreditCard
} from 'lucide-react';
import Swal from 'sweetalert2';
import FinanceTabs from '../../components/finance/FinanceTabs';
import { feeCollectionService } from '../../api/feeCollectionService';

const CollectFees = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list');
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');

  // Quick Collect Modal State
  const [quickCollectStudent, setQuickCollectStudent] = useState(null);
  const [collectAmount, setCollectAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Online');
  const [referenceNo, setReferenceNo] = useState('');
  const [fineAmount, setFineAmount] = useState(0);
  const [selectedFeeGroup, setSelectedFeeGroup] = useState('');
  const [collectNote, setCollectNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDueStudents = async () => {
    try {
      setLoading(true);
      const res = await feeCollectionService.searchDueFees();
      const raw = res?.data || [];
      
      const mapped = raw.map(s => ({
        id: s.id || s._id,
        _id: s._id || s.id,
        adm: s.admissionNo || s.aparId || 'N/A',
        aparId: s.aparId || s.admissionNo || 'N/A',
        name: s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Student',
        firstName: s.firstName || s.name,
        lastName: s.lastName || '',
        class: s.class || s.academicClass?.className || 'Class I',
        section: s.section || 'A',
        totalAssigned: s.totalAssigned || 0,
        totalPaid: s.totalPaid || 0,
        totalDue: s.totalDue || 0,
        dueFormatted: `₹${Number(s.totalDue || 0).toLocaleString('en-IN')}`,
        groups: s.groups || []
      }));

      setAllStudents(mapped);
      setFilteredStudents(mapped);

      // Extract unique classes
      const uniqueClasses = Array.from(new Set(mapped.map(m => m.class))).filter(Boolean);
      setClassesList(uniqueClasses);
    } catch (err) {
      console.error('Failed to fetch due fees:', err);
      setAllStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDueStudents();
  }, []);

  // Filter effect
  useEffect(() => {
    let result = [...allStudents];
    if (selectedClass !== 'All') {
      result = result.filter(s => s.class === selectedClass);
    }
    if (selectedSection !== 'All') {
      result = result.filter(s => s.section === selectedSection);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.adm.toLowerCase().includes(q)
      );
    }
    setFilteredStudents(result);
  }, [selectedClass, selectedSection, searchQuery, allStudents]);

  const handleClearFilters = () => {
    setSelectedClass('All');
    setSelectedSection('All');
    setSearchQuery('');
  };

  // Quick Collect Handler
  const openQuickCollect = (student) => {
    setQuickCollectStudent(student);
    setCollectAmount(student.totalDue || '');
    setPaymentMode('Online');
    setReferenceNo(`UPI-${Date.now().toString().slice(-6)}`);
    setFineAmount(0);
    setCollectNote(`Fee installment collected for ${student.name}`);
    if (student.groups && student.groups.length > 0) {
      setSelectedFeeGroup(student.groups[0].feeGroupId || student.groups[0]._id);
    } else {
      setSelectedFeeGroup('');
    }
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!quickCollectStudent) return;
    const amountNum = parseFloat(collectAmount);
    if (!amountNum || amountNum <= 0) {
      Swal.fire({ icon: 'warning', title: 'Invalid Amount', text: 'Please enter a valid amount to collect' });
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        student: quickCollectStudent.id || quickCollectStudent._id,
        feeGroup: selectedFeeGroup || quickCollectStudent.groups?.[0]?.feeGroupId,
        amountPaid: amountNum,
        fineAmount: parseFloat(fineAmount) || 0,
        paymentMode,
        referenceNo: referenceNo.trim() || `TXN-${Date.now().toString().slice(-6)}`,
        note: collectNote
      };

      const res = await feeCollectionService.collectFee(payload);

      if (res?.success) {
        Swal.fire({
          icon: 'success',
          title: 'Fee Payment Collected!',
          html: `<div class="text-left text-xs space-y-1">
            <p><strong>Receipt No:</strong> ${res.data?.receiptNo || 'Generated'}</p>
            <p><strong>Student:</strong> ${quickCollectStudent.name}</p>
            <p><strong>Amount Collected:</strong> ₹${amountNum.toLocaleString('en-IN')}</p>
            <p><strong>Mode:</strong> ${paymentMode}</p>
          </div>`,
          confirmButtonText: 'Great, Done!',
          confirmButtonColor: '#6366f1'
        });

        setQuickCollectStudent(null);
        fetchDueStudents();
      }
    } catch (err) {
      console.error('Collect fee error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Collection Failed',
        text: err.response?.data?.message || 'Could not record fee payment.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stats
  const totalDueAmount = filteredStudents.reduce((sum, s) => sum + (s.totalDue || 0), 0);
  const totalDemanded = filteredStudents.reduce((sum, s) => sum + (s.totalAssigned || 0), 0);

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto bg-slate-50/70 min-h-screen text-slate-800 pb-24 font-sans">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 text-white rounded-3xl p-6 shadow-xl shadow-indigo-950/10 mb-6 border border-indigo-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold mb-2 border border-white/10">
              <HandCoins className="w-3.5 h-3.5 text-indigo-400" />
              <span>Counter & Digital Fee Collection Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Collect Student Fees
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Search students by admission number, review due breakdowns, and process instant fee counter collections.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDueStudents}
              disabled={loading}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button 
              onClick={() => navigate('/finance/transactions')}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Transaction History</span>
            </button>
          </div>
        </div>
      </div>

      <FinanceTabs />

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Students with Dues</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{filteredStudents.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outstanding Dues Total</p>
            <h3 className="text-xl font-black text-rose-600 mt-0.5">₹{totalDueAmount.toLocaleString('en-IN')}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demanded Across Filter</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">₹{totalDemanded.toLocaleString('en-IN')}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>Search & Filter Due Students</span>
          </h3>
          {(selectedClass !== 'All' || selectedSection !== 'All' || searchQuery) && (
            <button 
              onClick={handleClearFilters}
              className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          <div className="sm:col-span-3">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Classes ({allStudents.length})</option>
              {classesList.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          <div className="sm:col-span-7">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Search by Name or Admission / APAR ID</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Aarav, YIS-2024-101..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
        
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Students List with Outstanding Dues
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              {filteredStudents.length} records
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                title="List View"
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                title="Grid Cards View"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* View Content */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 font-medium">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading students with dues from database...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-medium">
            <CheckCircle2 className="w-10 h-10 text-emerald-500/40 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Pending Dues Found</h4>
            <p className="text-xs text-slate-500 mt-1">All students matching the selected criteria have cleared their fee obligations.</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Student & APAR ID</th>
                  <th className="py-3 px-3">Grade & Section</th>
                  <th className="py-3 px-3 text-right">Demanded</th>
                  <th className="py-3 px-3 text-right">Paid So Far</th>
                  <th className="py-3 px-3 text-right">Outstanding Due</th>
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredStudents.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {s.firstName?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{s.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{s.adm}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                        {s.class} ({s.section})
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 font-semibold">
                      ₹{s.totalAssigned.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-600 font-semibold">
                      ₹{s.totalPaid.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-black text-rose-600 text-sm">
                        {s.dueFormatted}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openQuickCollect(s)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <HandCoins className="w-3.5 h-3.5" />
                          <span>Quick Collect</span>
                        </button>
                        <button
                          onClick={() => navigate(`/finance/collect/${s.id || s.adm}`)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <span>Full Ledger</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStudents.map((s, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {s.firstName?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{s.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">{s.adm}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {s.class} ({s.section})
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-2.5 space-y-1.5 mb-4 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Total Demanded:</span>
                      <strong className="text-slate-800">₹{s.totalAssigned.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Paid so far:</span>
                      <strong className="text-emerald-600">₹{s.totalPaid.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200/60 font-bold">
                      <span className="text-rose-600">Outstanding Due:</span>
                      <span className="text-rose-600 text-sm">{s.dueFormatted}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openQuickCollect(s)}
                    className="w-full py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1 cursor-pointer hover:opacity-95"
                  >
                    <HandCoins className="w-3.5 h-3.5" />
                    <span>Collect</span>
                  </button>
                  <button
                    onClick={() => navigate(`/finance/collect/${s.id || s.adm}`)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Ledger</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Collect Interactive Modal */}
      {quickCollectStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setQuickCollectStudent(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <HandCoins className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Counter Fee Collection</h3>
                <p className="text-xs text-slate-500">Record immediate cash / digital payment entry</p>
              </div>
            </div>

            {/* Student Preview Card */}
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3.5 mb-5 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{quickCollectStudent.name}</h4>
                <p className="text-xs text-indigo-700 font-medium">
                  {quickCollectStudent.adm} • {quickCollectStudent.class} ({quickCollectStudent.section})
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Pending Due</span>
                <span className="text-base font-black text-rose-600">
                  {quickCollectStudent.dueFormatted}
                </span>
              </div>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Collection Amount (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-slate-400 text-sm">₹</span>
                  <input
                    type="number"
                    value={collectAmount}
                    onChange={(e) => setCollectAmount(e.target.value)}
                    max={quickCollectStudent.totalDue}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Payment Mode <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Online">Online UPI / Gateway</option>
                    <option value="Cash">Cash Counter</option>
                    <option value="Cheque">Bank Cheque</option>
                    <option value="DD">Demand Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Reference / Transaction ID
                  </label>
                  <input
                    type="text"
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    placeholder="e.g. UPI-998124"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Collection Note / Receipt Remarks
                </label>
                <input
                  type="text"
                  value={collectNote}
                  onChange={(e) => setCollectNote(e.target.value)}
                  placeholder="e.g. Cleared Term 1 tuition"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setQuickCollectStudent(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{isSubmitting ? 'Recording...' : 'Confirm & Collect'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CollectFees;

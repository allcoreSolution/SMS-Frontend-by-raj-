import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Search, ArrowLeft, User, Calendar, 
  Layers, CheckCircle2, DollarSign, Clock, Zap, ArrowRight,
  ShieldCheck, AlertCircle, Phone, Mail
} from 'lucide-react';
import Swal from 'sweetalert2';
import FinanceTabs from '../../components/finance/FinanceTabs';
import { feeCollectionService } from '../../api/feeCollectionService';
import { financeService } from '../../api/financeService';

const GenerateFeeChallan = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [matchingStudents, setMatchingStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [feeGroups, setFeeGroups] = useState([]);
  const [selectedFeeGroup, setSelectedFeeGroup] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().slice(0, 10);
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadStudentsAndGroups();
  }, []);

  const loadStudentsAndGroups = async () => {
    try {
      const [dueRes, groupRes] = await Promise.all([
        feeCollectionService.searchDueFees(),
        financeService.getFeeGroups()
      ]);

      const dues = dueRes.data || dueRes || [];
      const groups = groupRes.data || groupRes || [];

      setAllStudents(dues);
      setFeeGroups(groups);
      if (groups.length > 0) {
        setSelectedFeeGroup(groups[0]._id);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  const handleSearchStudents = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setMatchingStudents([]);
      return;
    }
    const q = query.toLowerCase();
    const matches = allStudents.filter(s => 
      (s.name || `${s.firstName || ''} ${s.lastName || ''}`).toLowerCase().includes(q) ||
      (s.admissionNo || s.aparId || '').toLowerCase().includes(q) ||
      (s.class || '').toLowerCase().includes(q)
    );
    setMatchingStudents(matches.slice(0, 6));
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setMatchingStudents([]);
    setSearchQuery(`${student.name || student.firstName} (${student.admissionNo || student.aparId})`);
  };

  const selectedGroupDetails = feeGroups.find(g => g._id === selectedFeeGroup);
  const computedAmount = selectedGroupDetails?.feeTypes?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

  const handleGenerateChallan = async () => {
    if (!selectedStudent) {
      Swal.fire('Student Required', 'Please search and select a student.', 'warning');
      return;
    }

    if (!selectedFeeGroup) {
      Swal.fire('Fee Group Required', 'Please select a fee group.', 'warning');
      return;
    }

    if (!dueDate) {
      Swal.fire('Due Date Required', 'Please specify a due date for the challan.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const studentId = selectedStudent._id || selectedStudent.id;
      const payload = {
        student: studentId,
        feeGroup: selectedFeeGroup,
        dueDate
      };

      const res = await feeCollectionService.generateChallan(payload);
      if (res && res.success) {
        const createdChallan = res.data;
        const result = await Swal.fire({
          title: 'Fee Challan Issued!',
          html: `<div class="text-left text-sm space-y-2">
            <p class="text-emerald-600 font-semibold">✓ Official demand challan generated successfully</p>
            <div class="bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-indigo-900 mt-2">
              <p><strong>Challan No:</strong> ${createdChallan.challanNo}</p>
              <p><strong>Student:</strong> ${selectedStudent.name || selectedStudent.firstName}</p>
              <p><strong>Amount:</strong> ₹${(createdChallan.amount || computedAmount).toLocaleString('en-IN')}</p>
              <p><strong>Due Date:</strong> ${new Date(createdChallan.dueDate).toLocaleDateString('en-IN')}</p>
            </div>
          </div>`,
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Print Challan Now',
          cancelButtonText: 'View All Challans',
          confirmButtonColor: '#4f46e5'
        });

        if (result.isConfirmed) {
          navigate(`/finance/print-challan/${createdChallan._id || createdChallan.challanNo}`);
        } else {
          navigate('/finance/challans');
        }
      }
    } catch (err) {
      console.error('Error generating challan:', err);
      Swal.fire('Generation Failed', err?.response?.data?.message || 'Could not issue challan', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto bg-slate-50/60 min-h-screen text-slate-800 pb-24 font-sans">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white p-3.5 rounded-2xl text-xs flex items-center justify-between gap-3 mb-5 shadow-sm shadow-blue-500/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-xs">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <p className="leading-relaxed">
            <strong className="font-semibold">Fee Challan Generator:</strong> Issue official demand slips & multi-copy bank deposit vouchers for school fee collection.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/finance/challans')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-xs"
            title="Back to Challans"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Generate Fee Challan</h1>
            <p className="text-xs text-slate-500">Issue an official bank/counter fee payment challan to a student</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <FinanceTabs />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Configuration */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Student Lookup */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 md:p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">1</span>
                <h2 className="text-sm font-bold text-slate-800">Select Student</h2>
              </div>
              {selectedStudent && (
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                </span>
              )}
            </div>

            <div className="relative mb-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                SEARCH BY NAME, ADMISSION NO OR CLASS
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchStudents(e.target.value)}
                  placeholder="Type student name or ID (e.g. Aarav, YISADM-001)..."
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                />
              </div>

              {/* Autocomplete Dropdown */}
              {matchingStudents.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 z-30 overflow-hidden divide-y divide-slate-100">
                  {matchingStudents.map((s) => (
                    <div
                      key={s._id || s.id}
                      onClick={() => handleSelectStudent(s)}
                      className="p-3 hover:bg-indigo-50/50 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">{s.name || `${s.firstName} ${s.lastName}`}</p>
                        <p className="text-[11px] text-slate-500">
                          Adm: <span className="font-mono text-indigo-600">{s.admissionNo || s.aparId}</span> • Class {s.class} ({s.section})
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-rose-600">Dues: ₹{(s.totalDue || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* If Student Selected, show detailed card */}
            {selectedStudent && (
              <div className="mt-4 p-4 rounded-xl bg-indigo-50/40 border border-indigo-100 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm shadow-indigo-500/20">
                  {(selectedStudent.name || selectedStudent.firstName || 'S')[0]}
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {selectedStudent.name || `${selectedStudent.firstName} ${selectedStudent.lastName}`}
                      </h4>
                      <p className="text-slate-500">
                        Admission ID: <span className="font-mono font-bold text-indigo-700">{selectedStudent.admissionNo || selectedStudent.aparId}</span>
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-indigo-700 border border-indigo-200">
                      Class {selectedStudent.class} - {selectedStudent.section}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-indigo-100/80 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Current Dues</span>
                      <span className="font-bold text-rose-600">₹{(selectedStudent.totalDue || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Total Assigned</span>
                      <span className="font-semibold text-slate-700">₹{(selectedStudent.totalAssigned || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Fee Group & Due Date */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 md:p-6">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">2</span>
              <h2 className="text-sm font-bold text-slate-800">Fee Group & Payment Schedule</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  SELECT FEE GROUP <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedFeeGroup}
                  onChange={(e) => setSelectedFeeGroup(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium"
                >
                  {feeGroups.map((g) => (
                    <option key={g._id} value={g._id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  PAY BEFORE / DUE DATE <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium"
                />
              </div>

              {/* Fee Group Heads Breakdown */}
              {selectedGroupDetails && selectedGroupDetails.feeTypes?.length > 0 && (
                <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Included Fee Heads
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {selectedGroupDetails.feeTypes.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-slate-600">
                        <span>{item.feeType?.name || item.name || `Fee Item ${idx + 1}`}</span>
                        <span className="font-semibold text-slate-900">₹{(item.amount || 0).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                      <span>Total Challan Demand:</span>
                      <span className="text-indigo-600">₹{computedAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6">
              <button
                onClick={handleGenerateChallan}
                disabled={submitting || !selectedStudent}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FileText className={`w-4 h-4 ${submitting ? 'animate-spin' : ''}`} />
                <span>{submitting ? 'Issuing Challan...' : 'Generate & Issue Fee Challan'}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Right Column: Live Voucher Preview */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 md:p-6 sticky top-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" /> Challan Preview Card
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Awaiting Issue
              </span>
            </div>

            {selectedStudent ? (
              <div className="space-y-4 text-xs font-sans">
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-sm tracking-wide">ALL CORE SOLUTION</h4>
                      <p className="text-[10px] text-white/70">Official Fee Demand Voucher</p>
                    </div>
                    <span className="font-mono text-[10px] bg-white/20 px-2 py-0.5 rounded">NEW</span>
                  </div>
                  <div className="text-xl font-black text-indigo-200 tracking-tight">
                    ₹{computedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-[10px] text-white/60 mt-1">Due by {new Date(dueDate).toLocaleDateString('en-IN')}</p>
                </div>

                <div className="space-y-2 py-2 border-b border-slate-100 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Student Name:</span>
                    <span className="font-bold text-slate-800">{selectedStudent.name || selectedStudent.firstName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Admission No:</span>
                    <span className="font-mono text-slate-800">{selectedStudent.admissionNo || selectedStudent.aparId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Class & Section:</span>
                    <span className="font-medium text-slate-800">{selectedStudent.class} ({selectedStudent.section})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fee Group:</span>
                    <span className="font-medium text-indigo-600">{selectedGroupDetails?.name || 'Selected Group'}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    Once generated, an immutable Challan ID will be assigned and indexed in the school ledger. The guardian can deposit the voucher at the fee counter or via bank transfer.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400">
                <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-medium text-slate-600">No Student Selected</p>
                <p className="text-xs text-slate-400 mt-1">Search and pick a student on the left to see live preview.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default GenerateFeeChallan;

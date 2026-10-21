import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Download, CreditCard, ChevronDown, ChevronRight, CheckSquare, Square,
  Printer, User, Calendar, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles,
  Receipt, HandCoins, Building, Check, Clock, X
} from 'lucide-react';
import Swal from 'sweetalert2';
import FinanceTabs from '../../components/finance/FinanceTabs';
import { feeCollectionService } from '../../api/feeCollectionService';

const StudentFeeCollection = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [feeGroups, setFeeGroups] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Payment Form State
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const [paymentMode, setPaymentMode] = useState('Online');
  const [referenceNo, setReferenceNo] = useState(`UPI-${Date.now().toString().slice(-6)}`);
  const [note, setNote] = useState('');
  const [fineAmount, setFineAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Receipt Modal for Viewing/Printing
  const [activeReceipt, setActiveReceipt] = useState(null);

  const fetchStudentFeeData = async () => {
    try {
      setLoading(true);
      // Fetch dues which returns student objects with assigned groups and dues
      const [dueRes, txnRes] = await Promise.all([
        feeCollectionService.searchDueFees(),
        feeCollectionService.getAllTransactions()
      ]);

      const dueList = dueRes?.data || [];
      const foundStudent = dueList.find(s => 
        (s.id && s.id.toString() === id) || 
        (s._id && s._id.toString() === id) ||
        (s.adm && s.adm.toString() === id) || 
        (s.aparId && s.aparId.toString() === id)
      ) || dueList[0]; // fallback to first student if directly navigating

      if (foundStudent) {
        setStudent(foundStudent);
        
        // Build fee groups
        const groups = (foundStudent.groups || []).map((g, idx) => ({
          id: g.feeGroupId || `grp-${idx}`,
          name: g.name || 'Academic Fee Group',
          expected: g.expected || 0,
          paid: g.paid || 0,
          due: g.due || 0,
          dueDate: g.dueDate ? new Date(g.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '31 Mar 2025',
          status: (g.due || 0) <= 0 ? 'paid' : 'unpaid'
        }));
        setFeeGroups(groups);

        // Pre-select unpaid groups
        const unpaidIds = groups.filter(g => g.status === 'unpaid').map(g => g.id);
        setSelectedGroupIds(unpaidIds.slice(0, 1));
      }

      // Filter receipts for this student
      if (foundStudent) {
        const studentIdStr = (foundStudent.id || foundStudent._id)?.toString();
        const studentReceipts = (txnRes?.data || []).filter(t => {
          const tStudentId = (t.student?._id || t.student?.id || t.student)?.toString();
          return tStudentId === studentIdStr;
        });
        setReceipts(studentReceipts);
      }
    } catch (err) {
      console.error('Error loading student fee details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentFeeData();
  }, [id]);

  const toggleGroupSelection = (groupId) => {
    setSelectedGroupIds(prev => 
      prev.includes(groupId) ? prev.filter(gId => gId !== groupId) : [...prev, groupId]
    );
  };

  // Calculate selected total
  const selectedTotal = feeGroups
    .filter(g => selectedGroupIds.includes(g.id))
    .reduce((sum, g) => sum + g.due, 0);

  const netPayable = Math.max(0, selectedTotal + parseFloat(fineAmount || 0) - parseFloat(discountAmount || 0));

  const handleCollectPayment = async (e) => {
    e.preventDefault();
    if (!student) return;
    if (selectedGroupIds.length === 0) {
      Swal.fire({ icon: 'warning', title: 'No Fee Selected', text: 'Please select at least one fee group to pay.' });
      return;
    }

    try {
      setIsSubmitting(true);
      const chosenGroupId = selectedGroupIds[0];
      const payload = {
        student: student.id || student._id,
        feeGroup: chosenGroupId,
        amountPaid: netPayable,
        fineAmount: parseFloat(fineAmount) || 0,
        paymentMode,
        referenceNo: referenceNo.trim() || `TXN-${Date.now().toString().slice(-6)}`,
        note: note || `Fee collected for ${student.name}`
      };

      const res = await feeCollectionService.collectFee(payload);

      if (res?.success) {
        const receiptData = res.data;
        setActiveReceipt(receiptData);

        Swal.fire({
          icon: 'success',
          title: 'Payment Successful!',
          text: `Receipt ${receiptData.receiptNo} generated successfully.`,
          showCancelButton: true,
          confirmButtonText: 'Print Receipt',
          cancelButtonText: 'Done',
          confirmButtonColor: '#6366f1'
        }).then((result) => {
          if (result.isConfirmed) {
            window.print();
          }
        });

        fetchStudentFeeData();
      }
    } catch (err) {
      console.error('Payment collection error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Collection Failed',
        text: err.response?.data?.message || 'Could not process fee collection.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 min-h-screen">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold">Loading student financial ledger...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-12 text-center text-slate-500 min-h-screen">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Student Record Not Found</h2>
        <p className="text-sm mt-1">Could not find fee assignment for the requested student ID.</p>
        <button
          onClick={() => navigate('/finance/collect')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Collect Fees
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto bg-slate-50/70 min-h-screen text-slate-800 pb-24 font-sans">
      
      {/* Top Navigation & Back Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/finance/collect')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Back to Students List</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Ledger</span>
          </button>
        </div>
      </div>

      <FinanceTabs />

      {/* Student Profile Identity Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
              {student.firstName?.charAt(0) || student.name?.charAt(0) || 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{student.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold font-mono">
                  {student.adm || student.aparId}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Grade: <strong className="text-slate-800">{student.class}</strong> • Section: <strong className="text-slate-800">{student.section}</strong> • Academic Session: <strong className="text-slate-800">2024–2025</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Demanded</span>
              <span className="text-base sm:text-lg font-bold text-slate-800">
                ₹{Number(student.totalAssigned || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Realized</span>
              <span className="text-base sm:text-lg font-bold text-emerald-600">
                ₹{Number(student.totalPaid || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Outstanding Due</span>
              <span className="text-base sm:text-xl font-black text-rose-600">
                ₹{Number(student.totalDue || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Fee Groups (Left 7 cols) & Collect Payment Panel (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Left Column: Assigned Fee Groups Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <span>Assigned Fee Schedules & Installments</span>
            </h3>
            <span className="text-xs text-slate-500">Select items to pay</span>
          </div>

          {feeGroups.map((grp) => {
            const isSelected = selectedGroupIds.includes(grp.id);
            const isPaid = grp.status === 'paid';
            return (
              <div
                key={grp.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isPaid 
                    ? 'bg-emerald-50/30 border-emerald-200/80' 
                    : isSelected 
                    ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm' 
                    : 'bg-white border-slate-200/80 shadow-xs'
                }`}
              >
                <div 
                  onClick={() => !isPaid && toggleGroupSelection(grp.id)}
                  className={`p-4 flex items-center justify-between cursor-pointer ${!isPaid ? 'hover:bg-slate-50/60' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    {!isPaid ? (
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); toggleGroupSelection(grp.id); }}
                        className="text-indigo-600 shrink-0"
                      >
                        {isSelected ? <CheckSquare className="w-5 h-5 fill-indigo-600 text-white" /> : <Square className="w-5 h-5 text-slate-300" />}
                      </button>
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{grp.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        Due Date: <span className="font-semibold text-slate-700">{grp.dueDate}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Demand / Due</span>
                      <span className="text-xs font-bold text-slate-700">
                        ₹{grp.expected.toLocaleString('en-IN')}
                      </span>
                      <span className={`text-xs font-black block ${isPaid ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isPaid ? 'Cleared' : `Due: ₹${grp.due.toLocaleString('en-IN')}`}
                      </span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {grp.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Past Receipts Section */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Receipt className="w-4 h-4 text-emerald-600" />
              <span>Payment Receipts History ({receipts.length})</span>
            </h3>

            {receipts.length === 0 ? (
              <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                No past payment receipts found for this student.
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Receipt No</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Mode</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {receipts.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">
                          {r.receiptNo || `REC-${idx+1001}`}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">
                          {r.paymentDate ? new Date(r.paymentDate).toLocaleDateString('en-IN') : 'N/A'}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {r.paymentMode || 'Cash'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                          ₹{Number(r.amountPaid || r.amount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => setActiveReceipt(r)}
                            className="p-1 rounded text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="View Receipt"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Collection Payment Panel */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs sticky top-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold">
                <HandCoins className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Process Fee Collection</h3>
                <p className="text-xs text-slate-500">Instant counter settlement & receipt</p>
              </div>
            </div>

            <form onSubmit={handleCollectPayment} className="space-y-4">
              
              {/* Selected Amount Summary Box */}
              <div className="bg-gradient-to-br from-indigo-50/80 to-violet-50/80 rounded-2xl p-4 border border-indigo-100 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Selected Installments Due:</span>
                  <strong>₹{selectedTotal.toLocaleString('en-IN')}</strong>
                </div>
                {parseFloat(fineAmount) > 0 && (
                  <div className="flex justify-between text-xs text-rose-600">
                    <span>Late Fine Added:</span>
                    <strong>+₹{parseFloat(fineAmount).toLocaleString('en-IN')}</strong>
                  </div>
                )}
                {parseFloat(discountAmount) > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600">
                    <span>Concession Subtracted:</span>
                    <strong>-₹{parseFloat(discountAmount).toLocaleString('en-IN')}</strong>
                  </div>
                )}
                <div className="pt-2 border-t border-indigo-200/60 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">Net Realizable:</span>
                  <span className="text-2xl font-black text-indigo-600">
                    ₹{netPayable.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Payment Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Online', 'Cash', 'Cheque', 'DD'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMode(mode)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        paymentMode === mode
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mode === 'Online' ? 'UPI / Gateway' : mode === 'Cash' ? 'Cash Counter' : mode === 'Cheque' ? 'Bank Cheque' : 'Demand Draft'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reference Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Reference / UTR / Cheque No.
                </label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  placeholder="e.g. UPI-998124"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Fine & Discount Adjustments */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Late Fine (₹)
                  </label>
                  <input
                    type="number"
                    value={fineAmount}
                    onChange={(e) => setFineAmount(e.target.value)}
                    min="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Concession (₹)
                  </label>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    min="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Remarks / Audit Notes
                </label>
                <textarea
                  rows="2"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Term fee cleared at main branch counter"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || selectedGroupIds.length === 0}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Recording Collection...' : `Collect ₹${netPayable.toLocaleString('en-IN')}`}</span>
              </button>

            </form>
          </div>
        </div>

      </div>

      {/* Printable Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setActiveReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pb-4 border-b border-slate-200">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">ALL CORE SOLUTION</h3>
              <p className="text-[10px] text-slate-500">Official Fee Payment Receipt</p>
              <span className="text-xs font-mono font-bold text-indigo-600 block mt-1">
                {activeReceipt.receiptNo}
              </span>
            </div>

            <div className="py-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Student Name:</span>
                <strong className="text-slate-800">{student.name}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Admission No:</span>
                <strong className="text-slate-800">{student.adm}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment Mode:</span>
                <strong className="text-slate-800">{activeReceipt.paymentMode || paymentMode}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Reference No:</span>
                <strong className="text-slate-800">{activeReceipt.referenceNo || referenceNo}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment Date:</span>
                <strong className="text-slate-800">{new Date().toLocaleString()}</strong>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold">
                <span className="text-slate-900">Amount Paid:</span>
                <span className="text-lg font-black text-emerald-600">
                  ₹{Number(activeReceipt.amountPaid || activeReceipt.amount || netPayable).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" /> Print Receipt
              </button>
              <button
                onClick={() => setActiveReceipt(null)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentFeeCollection;

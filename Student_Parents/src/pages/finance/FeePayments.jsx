import React, { useEffect, useState } from 'react';
import { 
  FileText, ArrowDownToLine, ArrowUpFromLine, Wallet, 
  CheckCircle2, RefreshCw, CreditCard, QrCode, Building, 
  Check, X, ShieldCheck, AlertCircle, ArrowRight
} from 'lucide-react';
import { parentService } from '../../api/parentService';
import { Link } from 'react-router-dom';

export default function FeePayments({ activeChild }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [totals, setTotals] = useState({ assigned: 0, paid: 0, due: 0, balanceStr: 'All Clear' });
  const [invoices, setInvoices] = useState([]);

  // Payment Modal State
  const [paymentModalItem, setPaymentModalItem] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'Card' | 'NetBanking'
  const [upiId, setUpiId] = useState('parent@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  const loadFees = async () => {
    try {
      setLoading(true);
      const res = await parentService.getFeeLedger(activeChild ? { studentId: activeChild } : {});
      if (res?.success && res.data) {
        setStudentInfo(res.data.student);
        setTotals(res.data.totals || { assigned: 0, paid: 0, due: 0, balanceStr: 'All Clear' });
        setInvoices(res.data.invoices || []);
      }
    } catch (err) {
      console.error('Failed to load fee ledger:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFees();
  }, [activeChild]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFees();
    setTimeout(() => setRefreshing(false), 500);
  };

  // Process Online Payment
  const handleProcessPayment = async () => {
    if (!paymentModalItem) return;
    try {
      setPaying(true);
      const refNo = paymentMethod === 'UPI' 
        ? `UPI/${Date.now().toString().slice(-8)}`
        : paymentMethod === 'Card'
        ? `CARD/${Date.now().toString().slice(-6)}`
        : `NET/${Date.now().toString().slice(-6)}`;

      const payData = {
        studentId: studentInfo?.id || activeChild,
        feeGroupId: paymentModalItem.feeGroupId,
        amount: paymentModalItem.dueAmount,
        paymentMode: paymentMethod,
        referenceNo: refNo,
        note: `Online payment for ${paymentModalItem.type} via Parent ERP Gateway`
      };

      const res = await parentService.payFeeOnline(payData);
      if (res?.success && res.data) {
        setPaymentSuccess(res.data);
        await loadFees(); // refresh data
      }
    } catch (error) {
      console.error('Error processing online payment:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  const studentName = studentInfo?.name || 'Aarav Sharma';
  const studentClass = studentInfo?.class || 'Class I (A)';

  return (
    <div className="p-4 md:p-6 max-w-[1240px] mx-auto space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4 bg-white p-5 rounded-xl border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Wallet className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-[#1f2937] tracking-tight">Fee Accounts & Payment Invoices</h1>
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-1 pl-10">
            Active session billing ledger for: <strong className="text-indigo-600 font-bold">{studentName}</strong> ({studentClass})
          </p>
        </div>

        <div className="flex items-center gap-3 pl-10 sm:pl-0">
          <Link
            to="/transactions"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors border border-indigo-200"
          >
            <span>View Receipt History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync Ledger</span>
          </button>
        </div>
      </div>
      
      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Assigned */}
        <div className="bg-[#6366f1] text-white p-4 rounded-xl shadow-xs flex gap-3 relative overflow-hidden transition-transform hover:-translate-y-0.5">
          <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
             <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="relative z-10 w-full overflow-hidden">
             <h3 className="text-[10px] font-black uppercase tracking-wider mb-1 opacity-90 truncate">Total Assigned</h3>
             <p className="text-2xl font-black leading-tight tracking-tight">₹ {totals.assigned.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
             <p className="text-[10px] opacity-80 mt-1 truncate">Academic curriculum fee</p>
          </div>
        </div>
        
        {/* Total Paid */}
        <div className="bg-[#059669] text-white p-4 rounded-xl shadow-xs flex gap-3 relative overflow-hidden transition-transform hover:-translate-y-0.5">
          <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
             <ArrowDownToLine className="w-5 h-5 text-white" />
          </div>
          <div className="relative z-10 w-full overflow-hidden">
             <h3 className="text-[10px] font-black uppercase tracking-wider mb-1 opacity-90 truncate">Total Paid</h3>
             <p className="text-2xl font-black leading-tight tracking-tight">+ ₹ {totals.paid.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
             <p className="text-[10px] opacity-80 mt-1 truncate">Verified digital receipts</p>
          </div>
        </div>
        
        {/* Due Balance */}
        <div className={`${totals.due > 0 ? 'bg-[#ef4444]' : 'bg-emerald-700'} text-white p-4 rounded-xl shadow-xs flex gap-3 relative overflow-hidden transition-transform hover:-translate-y-0.5`}>
          <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
             <ArrowUpFromLine className="w-5 h-5 text-white" />
          </div>
          <div className="relative z-10 w-full overflow-hidden">
             <h3 className="text-[10px] font-black uppercase tracking-wider mb-1 opacity-90 truncate">Due Balance</h3>
             <p className="text-2xl font-black leading-tight tracking-tight">
               {totals.due > 0 ? `- ₹ ${totals.due.toLocaleString(undefined, {minimumFractionDigits: 2})}` : 'All Clear'}
             </p>
             <p className="text-[10px] opacity-80 mt-1 truncate">
               {totals.due > 0 ? 'Pending online clearance' : 'No dues outstanding'}
             </p>
          </div>
        </div>
        
        {/* Digital Clearance Status */}
        <div className="bg-[#353A40] text-white p-4 rounded-xl shadow-xs flex gap-3 relative overflow-hidden transition-transform hover:-translate-y-0.5">
          <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
             <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="relative z-10 w-full overflow-hidden">
             <h3 className="text-[10px] font-black uppercase tracking-wider mb-1 opacity-90 truncate">Account Status</h3>
             <p className="text-2xl font-black leading-tight tracking-tight">{totals.due <= 0 ? 'Active Clear' : 'Dues Pending'}</p>
             <p className="text-[10px] opacity-80 mt-1 truncate">{totals.due <= 0 ? 'Eligible for all exams & events' : 'Clear before due date'}</p>
          </div>
        </div>
      </div>

      {/* Invoice Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-gray-800 tracking-tight uppercase">
              Consolidated Fee Invoice Breakdown ({invoices.length} Heads)
            </h3>
          </div>
          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider ${
            totals.due <= 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
          }`}>
            {totals.due <= 0 ? 'Ledger All Clear' : 'Pending Clearance'}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <RefreshCw className="w-7 h-7 text-indigo-600 animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold">Loading student fee ledger...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px] text-xs">
              <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-wider text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">Fee Head</th>
                  <th className="px-5 py-3.5">Billing Due Date</th>
                  <th className="px-5 py-3.5 text-right">Assigned Amount</th>
                  <th className="px-5 py-3.5 text-right">Paid Receipts</th>
                  <th className="px-5 py-3.5 text-right">Due Balance</th>
                  <th className="px-5 py-3.5 text-center">Payment Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {invoices.map((row, i) => (
                  <tr key={row.id || i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-gray-900">{row.type}</div>
                      {row.description && <div className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{row.description}</div>}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{row.due}</td>
                    <td className="px-5 py-3.5 text-right font-semibold">₹ {(row.amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    <td className="px-5 py-3.5 text-right text-emerald-600 font-bold">₹ {(row.paid || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    <td className="px-5 py-3.5 text-right font-bold whitespace-nowrap">
                      {row.dueAmount <= 0 ? (
                        <span className="text-emerald-600 font-bold">₹ 0.00 (Cleared)</span>
                      ) : (
                        <span className="text-rose-600 font-black">₹ {(row.dueAmount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      {row.dueAmount > 0 ? (
                        <button
                          onClick={() => { setPaymentSuccess(null); setPaymentModalItem(row); }}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black uppercase tracking-wider rounded-lg transition-colors shadow-xs"
                        >
                          Pay Online ₹{row.dueAmount.toLocaleString()}
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                          <Check className="w-3.5 h-3.5" /> Paid in Full
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr className="bg-gray-50 font-black text-gray-900 text-xs">
                  <td className="px-5 py-4 uppercase font-extrabold">Consolidated Ledger Total</td>
                  <td className="px-5 py-4"></td>
                  <td className="px-5 py-4 text-right">₹ {totals.assigned.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  <td className="px-5 py-4 text-right text-emerald-600">₹ {totals.paid.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  <td className="px-5 py-4 text-right text-rose-600">₹ {totals.due.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  <td className="px-5 py-4 text-center">
                    {totals.due > 0 && (
                      <button
                        onClick={() => {
                          const firstDue = invoices.find(inv => inv.dueAmount > 0);
                          if (firstDue) { setPaymentSuccess(null); setPaymentModalItem(firstDue); }
                        }}
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-black uppercase tracking-wider rounded-lg shadow-xs"
                      >
                        Clear Dues
                      </button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Online Payment Modal */}
      {paymentModalItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Secure School ERP Gateway
                </span>
                <h3 className="text-lg font-black text-gray-900 mt-1 leading-snug">
                  Pay Fee: {paymentModalItem.type}
                </h3>
              </div>
              <button
                onClick={() => setPaymentModalItem(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {paymentSuccess ? (
              /* Success State */
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" strokeWidth={3} />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-gray-900">Payment Successfully Completed!</h4>
                  <p className="text-xs text-gray-500 mt-1">Official verified digital receipt has been generated.</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl text-left border border-gray-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Receipt No:</span>
                    <span className="font-mono font-bold text-gray-900">{paymentSuccess.receiptNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount Paid:</span>
                    <span className="font-bold text-emerald-600">₹ {paymentSuccess.amountPaid?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Mode:</span>
                    <span className="font-semibold text-gray-900">{paymentSuccess.paymentMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Transaction Ref:</span>
                    <span className="font-mono text-gray-700">{paymentSuccess.referenceNo}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Link
                    to="/transactions"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs text-center transition-colors shadow-xs"
                  >
                    View in Transactions
                  </Link>
                  <button
                    onClick={() => setPaymentModalItem(null)}
                    className="px-4 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Payment Form */
              <div className="space-y-4 text-xs">
                {/* Amount breakdown */}
                <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-indigo-700 tracking-wider block">Net Payable Amount</span>
                    <span className="text-2xl font-black text-indigo-950">₹ {paymentModalItem.dueAmount.toLocaleString()}</span>
                  </div>
                  <div className="text-right text-[11px] text-indigo-800">
                    <div>No processing fees (₹0.00)</div>
                    <div className="font-semibold text-emerald-600">✓ Instant receipt</div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="font-bold text-gray-700 block mb-2 uppercase text-[10px] tracking-wider">Select Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-2.5 rounded-xl border font-bold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === 'UPI' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span>UPI / QR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Card')}
                      className={`p-2.5 rounded-xl border font-bold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === 'Card' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Debit/Credit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('NetBanking')}
                      className={`p-2.5 rounded-xl border font-bold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === 'NetBanking' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Building className="w-4 h-4" />
                      <span>NetBanking</span>
                    </button>
                  </div>
                </div>

                {/* Sub-form based on method */}
                {paymentMethod === 'UPI' ? (
                  <div className="space-y-2 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">UPI ID / Virtual Payment Address</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@okhdfcbank"
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 outline-none focus:border-indigo-500"
                    />
                    <p className="text-[10px] text-gray-400">Supported apps: Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>
                ) : paymentMethod === 'Card' ? (
                  <div className="space-y-2.5 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          defaultValue="10/29"
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">CVV</label>
                        <input
                          type="password"
                          defaultValue="731"
                          maxLength={3}
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Select Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 outline-none cursor-pointer"
                    >
                      <option>HDFC Bank</option>
                      <option>State Bank of India (SBI)</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Punjab National Bank</option>
                    </select>
                  </div>
                )}

                {/* Security Badge */}
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>256-Bit SSL Encrypted & Direct Settlement to School Trust Account</span>
                </div>

                {/* Action button */}
                <div className="pt-2">
                  <button
                    onClick={handleProcessPayment}
                    disabled={paying}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                  >
                    {paying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing Bank Clearance...</span>
                      </>
                    ) : (
                      <span>Confirm & Authorize Payment of ₹ {paymentModalItem.dueAmount.toLocaleString()}</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

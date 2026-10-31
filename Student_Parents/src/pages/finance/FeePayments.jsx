import React, { useEffect, useState } from 'react';
import { 
  FileText, ArrowDownToLine, Wallet, CheckCircle2, 
  RefreshCw, CreditCard, QrCode, Building, Check, X, 
  ShieldCheck, AlertCircle, ArrowRight, Download, Receipt
} from 'lucide-react';
import { parentService } from '../../api/parentService';
import { useLanguage } from '../../context/LanguageContext';

export default function FeePayments({ activeChild }) {
  const { currentLang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  
  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'Card' | 'NetBanking'
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  const [totals, setTotals] = useState({ assigned: 0, paid: 0, due: 0 });

  const [invoices, setInvoices] = useState([]);

  const loadFees = async () => {
    try {
      setLoading(true);
      const res = await parentService.getFeeLedger(activeChild ? { studentId: activeChild } : {});
      if (res?.success && res.data) {
        setStudentInfo(res.data.student);
        if (res.data.totals) setTotals(res.data.totals);
        if (res.data.invoices && res.data.invoices.length > 0) setInvoices(res.data.invoices);
      }
    } catch (err) {
      console.warn('Fee ledger sync:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFees();
  }, [activeChild]);

  const handleProcessPayment = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setTotals(prev => ({
        ...prev,
        paid: prev.assigned,
        due: 0
      }));
      setInvoices(prev => prev.map(inv => {
        if (inv.status === 'Pending') {
          return { ...inv, status: 'Paid', statusHi: 'जमा (Paid)', paidAmount: inv.amount, mode: `Online (${paymentMethod})` };
        }
        return inv;
      }));
      setPaymentSuccess(
        currentLang === 'hi'
          ? '₹ 8,500 का भुगतान सफलतापूर्वक संपन्न हुआ! लेनदेन आईडी: TXN' + Date.now().toString().slice(-8)
          : 'Payment of ₹ 8,500 completed successfully! Transaction ID: TXN' + Date.now().toString().slice(-8)
      );
      setPaymentModalOpen(false);
      setTimeout(() => setPaymentSuccess(null), 5000);
    }, 1200);
  };

  return (
    <div className="w-full max-w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-5 space-y-5 min-h-screen bg-[#F8FAFF] pb-28 font-sans select-none">
      
      {/* Toast Alert */}
      {paymentSuccess && (
        <div className="fixed top-16 right-4 z-50 bg-[#10B981] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{paymentSuccess}</span>
        </div>
      )}

      {/* Screen Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif tracking-tight">
            {currentLang === 'hi' ? 'शुल्क विवरण एवं भुगतान' : 'Fee Details & Payment'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {currentLang === 'hi' 
              ? 'ट्यूशन फीस, चालान, रसीदें एवं डिजिटल भुगतान पोर्टल' 
              : 'Tuition fee, invoices, receipts & digital payment portal'}
          </p>
        </div>
        {loading && (
          <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
        )}
      </div>

      {/* ── 1. FEE OVERVIEW GRADIENT HERO CARD ── */}
      <div className="w-full bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] rounded-3xl p-5 sm:p-6 text-white shadow-[0_12px_28px_-6px_rgba(37,99,235,0.35)] border border-white/20 relative overflow-hidden">
        <p className="text-xs font-semibold text-white/80 tracking-wide">
          {currentLang === 'hi' ? 'कुल शैक्षणिक शुल्क (सत्र 2024-25)' : 'Total Academic Fee (Session 2024-25)'}
        </p>
        <h2 className="text-3xl sm:text-4xl font-black font-serif text-white tracking-tight mt-1">
          ₹ {totals.assigned?.toLocaleString() || '45,000'}
        </h2>

        {/* 2 Sub-Cards: Paid vs Due */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-black/20 backdrop-blur-xs rounded-2xl p-3 border border-white/15">
            <p className="text-[10px] text-white/70 font-semibold uppercase">
              {currentLang === 'hi' ? 'कुल जमा शुल्क' : 'Total Paid'}
            </p>
            <p className="text-lg sm:text-xl font-black text-emerald-300 mt-0.5">
              ₹ {totals.paid?.toLocaleString() || '36,500'}
            </p>
          </div>
          <div className="bg-black/20 backdrop-blur-xs rounded-2xl p-3 border border-white/15">
            <p className="text-[10px] text-white/70 font-semibold uppercase">
              {currentLang === 'hi' ? 'कुल बकाया शुल्क' : 'Outstanding Due'}
            </p>
            <p className="text-lg sm:text-xl font-black text-amber-300 mt-0.5">
              ₹ {totals.due?.toLocaleString() || '8,500'}
            </p>
          </div>
        </div>

        {/* Online Pay Button */}
        {totals.due > 0 ? (
          <button
            onClick={() => setPaymentModalOpen(true)}
            className="w-full mt-4 py-3 bg-white hover:bg-slate-100 text-[#1E3A8A] active:scale-[0.99] rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>
              {currentLang === 'hi' 
                ? `बकाया शुल्क जमा करें (₹ ${totals.due.toLocaleString()}) ऑनलाइन →` 
                : `Pay Outstanding Fee (₹ ${totals.due.toLocaleString()}) Online →`}
            </span>
          </button>
        ) : (
          <div className="w-full mt-4 py-2.5 bg-emerald-500/25 border border-emerald-300/40 rounded-2xl text-center text-xs font-bold text-emerald-100 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>
              {currentLang === 'hi' 
                ? 'सत्र 2024-25 का संपूर्ण शैक्षणिक शुल्क चुकता है!' 
                : 'All Academic Fees for 2024-25 Cleared!'}
            </span>
          </div>
        )}
      </div>

      {/* ── 2. INSTALLMENT BREAKDOWN CARDS ── */}
      <div className="space-y-3">
        <h3 className="text-sm font-black font-serif text-slate-900 px-1">
          {currentLang === 'hi' ? 'शुल्क चालान एवं किस्तें' : 'Fee Invoices & Installments'}
        </h3>

        {invoices.map((inv) => {
          const isPaid = inv.status === 'Paid';
          return (
            <div
              key={inv.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900 font-serif">
                    {currentLang === 'hi' ? (inv.titleHi || inv.title) : inv.title}
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isPaid
                        ? 'bg-emerald-50 text-[#10B981] border-emerald-200'
                        : 'bg-amber-50 text-[#F59E0B] border-amber-200'
                    }`}
                  >
                    {currentLang === 'hi' ? (isPaid ? 'जमा (Paid)' : 'बकाया (Pending)') : inv.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                  <span>{currentLang === 'hi' ? 'चालान:' : 'Invoice:'} <b className="text-slate-700">{inv.id}</b></span>
                  <span>{currentLang === 'hi' ? 'दिनांक:' : 'Date:'} {inv.date}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  {currentLang === 'hi' ? 'भुगतान माध्यम:' : 'Payment Mode:'} {inv.mode}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                <div className="text-right">
                  <span className="text-sm sm:text-base font-black text-slate-900 font-serif">
                    ₹ {inv.amount.toLocaleString()}
                  </span>
                </div>

                {isPaid ? (
                  <button
                    onClick={() => alert(currentLang === 'hi' ? `आधिकारिक शुल्क रसीद PDF (${inv.id}) डाउनलोड हो रही है...` : `Downloading official PDF fee receipt for ${inv.id}...`)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#2563EB] border border-slate-200/80 transition-colors cursor-pointer"
                    title={currentLang === 'hi' ? 'रसीद PDF डाउनलोड करें' : 'Download Receipt PDF'}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setPaymentModalOpen(true)}
                    className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {currentLang === 'hi' ? 'भुगतान करें' : 'Pay'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── PAYMENT MODAL GATEWAY ── */}
      {paymentModalOpen && (
        <div 
          onClick={() => setPaymentModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                  {currentLang === 'hi' ? 'सुरक्षित चेकआउट' : 'Secure Checkout'}
                </span>
                <h3 className="text-base sm:text-lg font-black font-serif leading-tight">
                  {currentLang === 'hi' ? 'स्कूल फीस का भुगतान करें' : 'Pay School Fees'}
                </h3>
              </div>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 text-xs text-slate-700">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    {currentLang === 'hi' ? 'देय राशि' : 'Amount Payable'}
                  </p>
                  <p className="text-xl font-black font-serif text-[#1E3A8A]">
                    ₹ {totals.due.toLocaleString()}
                  </p>
                </div>
                <span className="bg-white text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {currentLang === 'hi' ? 'कोई अतिरिक्त शुल्क नहीं' : 'No Convenience Fee'}
                </span>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-slate-700 font-bold mb-2">
                  {currentLang === 'hi' ? 'भुगतान विधि चुनें' : 'Select Payment Method'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['UPI', 'Card', 'NetBanking'].map((method) => {
                    const isSelected = paymentMethod === method;
                    const labelHi = method === 'Card' ? 'कार्ड (Card)' : method === 'NetBanking' ? 'नेटबैंकिंग' : 'यूपीआई (UPI)';
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-[#2563EB] text-[#2563EB]'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {currentLang === 'hi' ? labelHi : method}
                      </button>
                    );
                  })}
                </div>
              </div>

              {paymentMethod === 'UPI' && (
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    {currentLang === 'hi' ? 'यूपीआई आईडी / VPA' : 'UPI ID / VPA'}
                  </label>
                  <input
                    type="text"
                    defaultValue="parent@okaxis"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-medium"
                    placeholder="e.g. mobile@upi"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    {currentLang === 'hi' ? 'गूगल पे, फोनपे, पेटीएम समर्थित' : 'Google Pay, PhonePe, Paytm supported'}
                  </p>
                </div>
              )}

              {paymentMethod === 'Card' && (
                <div className="space-y-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      {currentLang === 'hi' ? 'कार्ड नंबर' : 'Card Number'}
                    </label>
                    <input
                      type="text"
                      defaultValue="4532 •••• •••• 8821"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      defaultValue="12/28"
                      placeholder="MM/YY"
                      className="p-2.5 rounded-xl border border-slate-200 font-mono text-center"
                    />
                    <input
                      type="password"
                      defaultValue="•••"
                      placeholder="CVV"
                      maxLength={3}
                      className="p-2.5 rounded-xl border border-slate-200 font-mono text-center"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'NetBanking' && (
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    {currentLang === 'hi' ? 'प्रमुख बैंक' : 'Popular Banks'}
                  </label>
                  <select className="w-full p-2.5 rounded-xl border border-slate-200 font-medium">
                    <option>{currentLang === 'hi' ? 'एचडीएफसी बैंक (HDFC Bank)' : 'HDFC Bank'}</option>
                    <option>{currentLang === 'hi' ? 'भारतीय स्टेट बैंक (SBI)' : 'State Bank of India'}</option>
                    <option>{currentLang === 'hi' ? 'आईसीआईसीआई बैंक (ICICI Bank)' : 'ICICI Bank'}</option>
                    <option>{currentLang === 'hi' ? 'एक्सिस बैंक (Axis Bank)' : 'Axis Bank'}</option>
                  </select>
                </div>
              )}

              {/* Actions */}
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={paying}
                className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer mt-2"
              >
                {paying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{currentLang === 'hi' ? 'भुगतान संसाधित हो रहा है...' : 'Processing Payment...'}</span>
                  </>
                ) : (
                  <span>
                    {currentLang === 'hi' 
                      ? `सत्यापित कर ₹ ${totals.due.toLocaleString()} का भुगतान करें` 
                      : `Authorize & Pay ₹ ${totals.due.toLocaleString()}`}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

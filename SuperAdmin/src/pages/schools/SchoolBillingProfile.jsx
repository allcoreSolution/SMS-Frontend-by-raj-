import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CreditCard, Plus, FileText, CheckCircle, Clock, 
  Receipt, Building2, Download, Printer, ShieldCheck, DollarSign
} from 'lucide-react';
import { tenantService } from '../../api/tenantService';
import GstInvoiceModal from '../../components/GstInvoiceModal';
import Swal from 'sweetalert2';

export default function SchoolBillingProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(25000);
  const [paymentMethod, setPaymentMethod] = useState('UPI / QR');
  const [paymentRef, setPaymentRef] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchBilling();
  }, [id]);

  const fetchBilling = async () => {
    try {
      setLoading(true);
      const res = await tenantService.getBillingProfile(id);
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load school billing profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async () => {
    try {
      const res = await tenantService.recordBillingPayment(id, {
        amount: paymentAmount,
        paidAmount: paymentAmount,
        paymentMethod,
        reference: paymentRef || `UTR-${Date.now().toString(36).toUpperCase()}`
      });

      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Payment Recorded!',
          text: `Invoice ${res.invoice?.invoiceNumber} generated successfully.`,
          timer: 2500
        });
        setShowPaymentModal(false);
        fetchBilling();
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Payment recording failed', 'error');
    }
  };

  const handleOpenGstInvoice = (inv) => {
    const taxableAmount = inv ? inv.amount : 25000;
    const cgst = Number((taxableAmount * 0.09).toFixed(2));
    const sgst = Number((taxableAmount * 0.09).toFixed(2));
    const totalAmount = Number((taxableAmount + cgst + sgst).toFixed(2));

    setSelectedInvoice({
      invoiceNumber: inv?.invoiceNumber || `INV-ACS-${new Date().getFullYear()}-001`,
      invoiceDate: inv?.date || new Date(),
      seller: {
        companyName: 'ALL CORE SOLUTION',
        tagline: 'Enterprise Cloud ERP & SaaS Platforms',
        gstin: '07AAAAA0000A1Z5',
        hsnSac: '998313',
        address: 'Tower B, Tech City, New Delhi - 110001, India',
        supportEmail: 'billing@allcoresolution.com',
        phone: '+91 98765 43210'
      },
      buyer: {
        schoolName: data?.school?.name || 'School Campus',
        schoolCode: data?.school?.code || 'SCH-101',
        email: data?.school?.email || 'admin@school.com',
        address: data?.school?.address || 'Campus Main Office',
        gstin: data?.billingProfile?.taxId || 'Unregistered / Exempt'
      },
      items: [
        {
          description: `SaaS Cloud ERP License — ${data?.school?.plan || 'Enterprise'}`,
          hsnSac: '998313',
          taxableAmount,
          cgstRate: '9%',
          cgstAmount: cgst,
          sgstRate: '9%',
          sgstAmount: sgst,
          totalAmount
        }
      ],
      financials: {
        taxableAmount,
        cgst,
        sgst,
        totalGst: Number((cgst + sgst).toFixed(2)),
        totalPayable: totalAmount,
        currency: 'INR'
      },
      digitalSignature: {
        authorizedSignatory: 'RAJ YADAV',
        title: 'Founder & Chief Architect',
        brand: 'ALL CORE SOLUTION'
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-white rounded-2xl border border-slate-200">
        <div className="flex flex-col items-center gap-2">
          <CreditCard className="w-8 h-8 text-amber-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-500">Loading billing profile & tax ledger...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { school, billingProfile, invoices } = data;

  return (
    <div className="space-y-6 max-w-[1300px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/schools')}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Billing & Tax Ledger</h1>
              <span className="bg-amber-50 text-amber-800 font-bold text-xs px-2.5 py-0.5 rounded-full border border-amber-200">
                {school.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Subscription Invoicing, GST Profile & Manual Payment Recording</p>
          </div>
        </div>

        <button
          onClick={() => setShowPaymentModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Record Offline Payment</span>
        </button>
      </div>

      {/* Profile & KPI Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GST Tax Profile Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">GST Tax Profile</span>
            <Building2 className="w-5 h-5 text-[#008f8c]" />
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block text-[10px]">Legal Entity Name</span>
              <span className="font-bold text-slate-900">{billingProfile.legalName || school.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 font-semibold block text-[10px]">State Code</span>
                <span className="font-bold text-slate-800">{billingProfile.stateCode || '07 (Delhi)'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px]">GSTIN / VAT</span>
                <span className="font-mono font-bold text-slate-800">{billingProfile.taxId || 'Unregistered'}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[10px]">Billing Mode</span>
              <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[11px] capitalize">
                {(billingProfile.billingMode || 'paid_in_full').replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plan & Validity</span>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-2xl font-black text-slate-900">{school.plan}</span>
              <span className="text-xs text-slate-400 font-semibold block">Unlimited Modules Included</span>
            </div>
            <div className="pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">Subscription Valid Until:</span>
              <span className="font-bold text-slate-900 block mt-0.5">
                {new Date(school.subscriptionEnd).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Total Collected vs Due */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Financial Status</span>
            <DollarSign className="w-5 h-5 text-amber-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500">Total Paid:</span>
              <span className="text-xl font-black text-emerald-600">₹{(billingProfile.paidAmount || 50000).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500">Balance Due:</span>
              <span className="text-xl font-black text-rose-600">₹{(billingProfile.balanceDue || 0).toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: billingProfile.balanceDue > 0 ? '60%' : '100%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-sm sm:text-base">Invoices & Payment History</h3>
            <p className="text-xs text-slate-500">Electronically verifiable GST invoices generated for this school</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Invoice #</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Payment Method</th>
                <th className="px-4 py-3.5">Total Amount</th>
                <th className="px-4 py-3.5">Paid Amount</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {invoices?.map((inv, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3.5 text-slate-500">
                    {new Date(inv.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3.5 text-slate-700 font-semibold">{inv.paymentMethod}</td>
                  <td className="px-4 py-3.5 font-mono font-bold text-slate-900">₹{inv.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3.5 font-mono font-bold text-emerald-600">₹{inv.paidAmount?.toLocaleString()}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => handleOpenGstInvoice(inv)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5 ml-auto cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View Tax Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="p-5 bg-slate-950 text-white flex items-center justify-between">
              <h3 className="font-black text-sm text-white">Record Offline Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Amount Received (₹) *</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  <option value="UPI / QR">UPI / QR Code</option>
                  <option value="Bank Transfer (NEFT/RTGS)">Bank Transfer (NEFT/RTGS)</option>
                  <option value="Cheque">Bank Cheque</option>
                  <option value="Cash">Cash in Hand</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Transaction Reference / UTR #</label>
                <input
                  type="text"
                  placeholder="e.g. UTR-AXIS-992144"
                  value={paymentRef}
                  onChange={e => setPaymentRef(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRecordPayment}
                className="px-4 py-2 bg-[#008f8c] hover:bg-[#007a78] text-white font-black rounded-xl text-xs transition cursor-pointer shadow-xs"
              >
                Confirm & Issue Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GST INVOICE MODAL */}
      <GstInvoiceModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        invoiceData={selectedInvoice}
      />
    </div>
  );
}

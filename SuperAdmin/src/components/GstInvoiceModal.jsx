import React, { useRef } from 'react';
import { Printer, Download, X, CheckCircle, ShieldCheck, Building2, FileText } from 'lucide-react';

export default function GstInvoiceModal({ isOpen, onClose, invoiceData }) {
  const printRef = useRef(null);

  if (!isOpen || !invoiceData) return null;

  const handlePrint = () => {
    window.print();
  };

  const {
    invoiceNumber = 'INV-ACS-2026-001',
    invoiceDate = new Date().toISOString(),
    seller = {
      companyName: 'ALL CORE SOLUTION',
      tagline: 'Enterprise Cloud ERP & SaaS Platforms',
      gstin: '07AAAAA0000A1Z5',
      hsnSac: '998313',
      address: 'Tower B, Tech City, New Delhi - 110001, India',
      supportEmail: 'billing@allcoresolution.com',
      phone: '+91 98765 43210'
    },
    buyer = {
      schoolName: 'Delhi Public International School',
      schoolCode: 'DPIS-2026',
      email: 'admin@dpis.edu.in',
      address: 'Main Campus, Sector 12, New Delhi',
      gstin: 'Unregistered / Exempt'
    },
    items = [
      {
        description: 'SaaS Multi-Campus ERP Cloud Subscription (Annual License)',
        hsnSac: '998313',
        taxableAmount: 25000,
        cgstRate: '9%',
        cgstAmount: 2250,
        sgstRate: '9%',
        sgstAmount: 2250,
        totalAmount: 29500
      }
    ],
    financials = {
      taxableAmount: 25000,
      cgst: 2250,
      sgst: 2250,
      totalGst: 4500,
      totalPayable: 29500,
      currency: 'INR'
    },
    digitalSignature = {
      authorizedSignatory: 'RAJ YADAV',
      title: 'Founder & Chief Architect',
      brand: 'ALL CORE SOLUTION'
    }
  } = invoiceData;

  const formattedDate = new Date(invoiceDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      {/* Modal Card */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8 animate-fadeIn flex flex-col">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="print:hidden bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-xs">
              ACS
            </div>
            <div>
              <p className="text-sm font-black">Official GST Tax Invoice</p>
              <p className="text-[11px] text-slate-400">Government Compliant (Rule 46 GST Law)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div ref={printRef} className="p-8 sm:p-10 bg-white text-slate-800 text-xs font-sans print:p-0 print:m-0">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-200 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 font-black flex items-center justify-center text-sm">
                  ACS
                </span>
                <h1 className="text-xl font-black tracking-tight text-slate-950">{seller.companyName}</h1>
              </div>
              <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">{seller.tagline}</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-sm">{seller.address}</p>
              <p className="text-[11px] text-slate-600 font-medium">GSTIN: <span className="font-bold font-mono text-slate-900">{seller.gstin}</span></p>
              <p className="text-[11px] text-slate-500">Email: {seller.supportEmail} · Phone: {seller.phone}</p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-300 text-amber-800 text-[11px] font-black rounded-lg mb-2 uppercase tracking-wider">
                ORIGINAL FOR RECIPIENT
              </span>
              <p className="text-base font-black text-slate-900 font-mono">{invoiceNumber}</p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Date: <span className="font-bold text-slate-800">{formattedDate}</span></p>
              <p className="text-[11px] text-slate-500 font-medium">Place of Supply: <span className="font-bold text-slate-800">07 - New Delhi</span></p>
            </div>
          </div>

          {/* Billed To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Billed To (Client School)</p>
              <p className="text-sm font-black text-slate-900">{buyer.schoolName}</p>
              <p className="text-[11px] text-slate-600 font-mono">School Code: {buyer.schoolCode}</p>
              <p className="text-[11px] text-slate-500 mt-1">{buyer.address}</p>
              <p className="text-[11px] text-slate-600">Email: {buyer.email}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Tax Registration Details</p>
              <p className="text-[11px] font-bold text-slate-800">Buyer GSTIN: <span className="font-mono">{buyer.gstin || 'Unregistered'}</span></p>
              <p className="text-[11px] text-slate-600 mt-1">Payment Mode: <span className="font-bold text-emerald-600">Online Cloud Verified</span></p>
              <p className="text-[11px] text-slate-600">Payment Status: <span className="font-bold text-emerald-600">Paid in Full</span></p>
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-[10px] font-black text-slate-600 uppercase border-b border-slate-200">
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-center">HSN/SAC</th>
                  <th className="py-2.5 px-3 text-right">Taxable (₹)</th>
                  <th className="py-2.5 px-3 text-right">CGST (9%)</th>
                  <th className="py-2.5 px-3 text-right">SGST (9%)</th>
                  <th className="py-2.5 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-semibold text-slate-900">{it.description}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-600">{it.hsnSac}</td>
                    <td className="py-3 px-3 text-right font-medium">₹{Number(it.taxableAmount).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right text-slate-600">₹{Number(it.cgstAmount).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right text-slate-600">₹{Number(it.sgstAmount).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-black text-slate-900">₹{Number(it.totalAmount).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-6">
            <div className="w-full sm:w-1/2 text-[11px] text-slate-500 space-y-1">
              <p className="font-bold text-slate-800">Terms & Conditions:</p>
              <p>1. Electronic invoice generated under Rule 46 of CGST Rules, 2017.</p>
              <p>2. Software licenses granted on cloud SaaS terms; continuous updates included.</p>
              <p>3. This is a computer-verified invoice and requires no physical ink signature.</p>
            </div>

            <div className="w-full sm:w-1/2 bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Taxable Amount</span>
                <span className="font-bold">₹{Number(financials.taxableAmount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Central GST (9%)</span>
                <span>₹{Number(financials.cgst).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>State GST (9%)</span>
                <span>₹{Number(financials.sgst).toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-slate-900">
                <span>Grand Total (INR)</span>
                <span className="text-amber-600">₹{Number(financials.totalPayable).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Digital Signature & Footer */}
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-end gap-4">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Digitally Authenticated by ALL CORE SOLUTION Cloud</span>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Signatory</p>
              <p className="text-xs font-black text-slate-900 mt-1">{digitalSignature.authorizedSignatory}</p>
              <p className="text-[10px] text-slate-500 font-medium">{digitalSignature.title} · {digitalSignature.brand}</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close */}
        <div className="print:hidden p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Printer, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { feeCollectionService } from '../../api/feeCollectionService';

const numberToWords = (num) => {
  if (!num || isNaN(num)) return 'Zero Rupees Only';
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  return str.trim() + ' Rupees Only';
};

const PrintChallan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [challan, setChallan] = useState(null);

  useEffect(() => {
    fetchChallan();
  }, [id]);

  const fetchChallan = async () => {
    try {
      setLoading(true);
      const res = await feeCollectionService.getChallanById(id);
      if (res && (res.data || res._id)) {
        setChallan(res.data || res);
      }
    } catch (err) {
      console.error('Error fetching challan for print:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-600" />
          <p className="text-xs text-slate-500 font-medium">Preparing printable challan...</p>
        </div>
      </div>
    );
  }

  if (!challan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
          <h2 className="text-base font-bold text-slate-800">Challan Not Found</h2>
          <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const s = challan.student || {};
  const studentName = `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Enrolled Student';
  const admissionNo = s.aparId || s.admissionNo || 'N/A';
  const className = s.classId?.className || 'Class I';
  const sectionName = s.sectionId?.sectionName || 'A';
  const guardianName = s.parentId?.fatherName || s.parentId?.motherName || 'Father / Guardian';
  const feeGroup = challan.feeGroup || {};
  const items = feeGroup.feeTypes || [];
  const totalAmount = challan.amount || 0;
  const amountWords = numberToWords(totalAmount);

  const issueDateFormatted = new Date(challan.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const dueDateFormatted = new Date(challan.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // Component for rendering one single copy of the voucher
  const renderVoucherCopy = (copyTitle) => (
    <div className="bg-white border border-slate-300 relative overflow-hidden p-5 flex flex-col justify-between text-slate-800 text-[11px] font-sans">
      
      {/* Paid Watermark */}
      {challan.status === 'Paid' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10">
          <span className="text-7xl font-black text-emerald-600 transform -rotate-45 tracking-widest">PAID</span>
        </div>
      )}

      <div className="relative z-10 space-y-3">
        {/* Header */}
        <div className="text-center pb-2 border-b border-slate-300">
          <div className="flex justify-between items-start text-[9px] text-slate-500 font-semibold mb-1">
            <span>CBSE AFFILIATION NO: 103045</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700 uppercase tracking-wider">{copyTitle}</span>
          </div>
          <h1 className="text-base font-black tracking-wider text-slate-900">ACS PUBLIC SCHOOL</h1>
          <p className="text-[10px] text-slate-600">Marine Drive Campus, Raipur, Chhattisgarh - 492001</p>
          <p className="text-[9px] text-slate-500">Ph: +91 98765 43210 • Email: accounts@acsschool.edu.in</p>
          <div className="mt-1 font-bold text-indigo-900 tracking-wider text-[11px]">
            —— BANK FEE CHALLAN ——
          </div>
        </div>

        {/* Challan & Date Row */}
        <div className="flex justify-between items-center text-[10px] border-b border-slate-200 pb-2">
          <div>
            <span className="text-slate-500">Challan No: </span>
            <span className="font-mono font-bold text-indigo-700">{challan.challanNo}</span>
          </div>
          <div className="text-right">
            <div><span className="text-slate-500">Issued: </span><span className="font-semibold">{issueDateFormatted}</span></div>
            <div className="text-rose-600 font-bold"><span>Pay Before: </span><span>{dueDateFormatted}</span></div>
          </div>
        </div>

        {/* Student Data */}
        <div className="bg-slate-50/70 p-2 rounded border border-slate-200 grid grid-cols-2 gap-y-1 text-[10px]">
          <div><span className="text-slate-500">Student: </span><span className="font-bold text-slate-900">{studentName}</span></div>
          <div><span className="text-slate-500">Adm No: </span><span className="font-mono font-bold">{admissionNo}</span></div>
          <div><span className="text-slate-500">Class: </span><span>{className} - {sectionName}</span></div>
          <div><span className="text-slate-500">Guardian: </span><span>{guardianName}</span></div>
        </div>

        {/* Fees Particulars */}
        <div className="border border-slate-300 rounded overflow-hidden">
          <table className="w-full text-left text-[10px]">
            <thead>
              <tr className="bg-slate-100 font-bold border-b border-slate-300 text-slate-700">
                <th className="p-1.5">Particulars</th>
                <th className="p-1.5 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.length > 0 ? (
                items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="p-1.5">{it.feeType?.name || it.name || `Fee Item ${idx + 1}`}</td>
                    <td className="p-1.5 text-right font-medium">₹{(it.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-1.5">{feeGroup.name || 'Academic Fee'}</td>
                  <td className="p-1.5 text-right font-medium">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-indigo-900 text-white font-bold text-[11px]">
                <td className="p-1.5">TOTAL PAYABLE</td>
                <td className="p-1.5 text-right">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Amount In Words */}
        <div className="text-[10px] text-slate-600 italic border-b border-slate-200 pb-2">
          <strong>In Words:</strong> {amountWords}
        </div>

        {/* Bank Instructions */}
        <div className="text-[9px] text-slate-600 space-y-0.5">
          <p><strong>Bank Deposit A/C:</strong> State Bank of India • A/C No: 40992381293</p>
          <p><strong>IFSC Code:</strong> SBIN0001234 • Branch: Civil Lines Raipur</p>
        </div>

        {/* Signature Blocks */}
        <div className="pt-6 grid grid-cols-3 gap-2 text-center text-[9px] font-semibold text-slate-500 uppercase">
          <div className="border-t border-slate-400 pt-1">Cashier / Bank Stamp</div>
          <div className="border-t border-slate-400 pt-1">Authorized Signatory</div>
          <div className="border-t border-slate-400 pt-1">Depositor Signature</div>
        </div>

      </div>

    </div>
  );

  return (
    <div className="bg-slate-100 min-h-screen py-6 font-sans print:bg-white print:py-0">
      
      {/* Top Action Bar */}
      <div className="max-w-[1400px] mx-auto px-4 mb-6 flex justify-between items-center print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Challan Details
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">Triplicate Official Voucher Layout</span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
          >
            <Printer className="w-4 h-4" /> Print 3-Copy Voucher
          </button>
        </div>
      </div>

      {/* Triplicate Printable Document (School Copy, Bank Copy, Student Copy) */}
      <div className="max-w-[1400px] mx-auto px-4 print:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3 print:gap-2">
          {renderVoucherCopy('Bank Copy')}
          {renderVoucherCopy('School Copy')}
          {renderVoucherCopy('Student Copy')}
        </div>
      </div>

    </div>
  );
};

export default PrintChallan;

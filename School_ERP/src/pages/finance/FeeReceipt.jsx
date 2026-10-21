import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Info, Printer, Download, Hexagon } from 'lucide-react';

const FeeReceipt = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 max-w-[1600px] mx-auto bg-gray-50 min-h-screen text-gray-800 pb-20">
      {/* Banner */}
      <div className="bg-[#009b9f] text-white p-2.5 rounded-none text-xs flex items-center gap-2 mb-4 print:hidden">
        <Info className="w-4 h-4 flex-shrink-0" />
        <p>
          <strong>New: academic-session scoping.</strong> Lists and dashboard numbers show the selected academic session only, so totals may look smaller than before — nothing was deleted. Use the session switcher in the top bar to view another year.
        </p>
      </div>

      {/* Header */}
      <div className="mb-4 print:hidden">
        <h1 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">Fee Receipt #{id}</h1>
      </div>

      <div className="mb-6 print:hidden">
        <p className="text-xs text-gray-500 mb-3">This page is optimized for printing.</p>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="bg-[#e67e22] hover:bg-[#d35400] text-white px-3 py-1.5 rounded-none flex items-center gap-1.5 text-xs font-bold transition-colors shadow-sm">
            <Printer className="w-4 h-4" /> Print (Portrait)
          </button>
          <button onClick={() => { alert('For landscape, please change layout to Landscape in the print dialog.'); window.print(); }} className="bg-[#16a085] hover:bg-[#1abc9c] text-white px-3 py-1.5 rounded-none flex items-center gap-1.5 text-xs font-bold transition-colors shadow-sm">
            <Printer className="w-4 h-4" /> Print Landscape (Double Receipt)
          </button>
          <button onClick={() => { alert('Please select "Save as PDF" in the print dialog to download.'); window.print(); }} className="bg-[#27ae60] hover:bg-[#2ecc71] text-white px-3 py-1.5 rounded-none flex items-center gap-1.5 text-xs font-bold transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Download PDF (Portrait)
          </button>
          <button onClick={() => { alert('Please select "Save as PDF" and layout "Landscape" in the print dialog to download.'); window.print(); }} className="bg-[#f39c12] hover:bg-[#f1c40f] text-white px-3 py-1.5 rounded-none flex items-center gap-1.5 text-xs font-bold transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Download PDF (Landscape)
          </button>
        </div>
      </div>

      {/* Receipt Card */}
      <div className="bg-white border border-gray-200 shadow-sm max-w-4xl mx-auto p-8 print:p-0 print:border-none print:shadow-none">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6 border-b-2 border-[#5c6e81] pb-6">
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-none flex items-center justify-center">
              <Hexagon className="w-8 h-8 text-[#e67e22]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 tracking-wider">PROJECTWORLDS</h2>
              <p className="text-[9px] text-gray-500 font-medium">Free Learning & Free Projects</p>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-[#5c6e81] tracking-widest mb-1">ACS School</h1>
            <p className="text-[10px] text-gray-500">Marine Drive Road, Raipur<br />(Chhattisgarh)</p>
            <p className="text-[10px] text-gray-500">Phone: +916263056779 | Email:<br />contact@projectworlds.com</p>
          </div>

          <div className="text-right">
            <h2 className="text-xl font-bold text-[#5c6e81] tracking-wider mb-2">FEE RECEIPT</h2>
            <div className="bg-gray-50 p-2 rounded-none border border-gray-100 text-left">
              <p className="text-[10px] text-gray-600 mb-0.5"><span className="font-bold">Receipt No:</span> <span className="text-[#e74c3c]">{id}</span></p>
              <p className="text-[10px] text-gray-600"><span className="font-bold">Date:</span> 21 August, 2026</p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex justify-between mb-6">
          {/* Student Details */}
          <div className="w-1/2 pr-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Student Details</h3>
            <table className="w-full text-[11px]">
              <tbody>
                <tr>
                  <td className="py-1 text-gray-500 w-28">Student Name:</td>
                  <td className="py-1 font-bold text-gray-800">Disha Rao</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-500">Admission No:</td>
                  <td className="py-1 font-bold text-gray-800">YISADM-056</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-500">Class & Section:</td>
                  <td className="py-1 font-bold text-gray-800">Class 1 - A</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-500">Father's Name:</td>
                  <td className="py-1 font-bold text-gray-800">Kiran Rao</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Payment Info */}
          <div className="w-1/2 pl-4 border-l border-gray-100">
             <h3 className="text-sm font-bold text-gray-700 mb-3">Payment Info</h3>
            <table className="w-full text-[11px]">
              <tbody>
                <tr>
                  <td className="py-1 text-gray-500 w-28">Payment Mode:</td>
                  <td className="py-1 font-bold text-gray-800">Cash</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-500">Transaction ID:</td>
                  <td className="py-1 font-bold text-gray-800">-</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-500">Status:</td>
                  <td className="py-1 font-bold text-green-600">SUCCESS</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Table Section */}
        <div>
          <table className="w-full text-left border-collapse border border-gray-300 text-xs">
            <thead>
              <tr className="bg-[#34495e] text-white text-[10px]">
                <th className="p-2 border border-gray-400 uppercase">Particulars</th>
                <th className="p-2 border border-gray-400 text-right uppercase w-24">Amount</th>
                <th className="p-2 border border-gray-400 text-right uppercase w-24">Discount</th>
                <th className="p-2 border border-gray-400 text-right uppercase w-24">Fine</th>
                <th className="p-2 border border-gray-400 text-right uppercase w-24">Paid</th>
              </tr>
            </thead>
            <tbody>
              {/* Installment 4 */}
              <tr className="bg-gray-100 text-[10px] font-bold">
                <td colSpan="5" className="p-2 border border-gray-300">
                   <span className="text-gray-500 mr-1">▼</span> 4TH INSTALLMENT FEES 2026-2027
                </td>
              </tr>
              <tr className="text-[10px]">
                <td className="p-2 border border-gray-300 text-gray-600">4th Installment Fees (Dec 2026)</td>
                <td className="p-2 border border-gray-300 text-right">₹5,000.00</td>
                <td className="p-2 border border-gray-300 text-right">-</td>
                <td className="p-2 border border-gray-300 text-right">-</td>
                <td className="p-2 border border-gray-300 text-right">₹5,000.00</td>
              </tr>
              <tr className="text-[10px] font-bold bg-gray-50">
                <td className="p-2 border border-gray-300 text-right">Subtotal</td>
                <td className="p-2 border border-gray-300 text-right">₹5,000.00</td>
                <td className="p-2 border border-gray-300 text-right">-</td>
                <td className="p-2 border border-gray-300 text-right">-</td>
                <td className="p-2 border border-gray-300 text-right">₹5,000.00</td>
              </tr>

              {/* Monthly Fees */}
              <tr className="bg-gray-100 text-[10px] font-bold">
                <td colSpan="5" className="p-2 border border-gray-300">
                   <span className="text-gray-500 mr-1">▼</span> MONTHLY FEES 2026-2027
                </td>
              </tr>
              {[
                { name: 'May 2026' }, { name: 'Jun 2026' }, { name: 'July 2026' }, 
                { name: 'Aug 2026' }, { name: 'Sep 2026' }, { name: 'Oct 2026' },
                { name: 'Nov 2026' }, { name: 'Dec 2026' }
              ].map((month, idx) => (
                <tr key={idx} className="text-[10px]">
                  <td className="p-2 border border-gray-300 text-gray-600">{month.name} ({month.name})</td>
                  <td className="p-2 border border-gray-300 text-right">₹2,000.00</td>
                  <td className="p-2 border border-gray-300 text-right">-</td>
                  <td className="p-2 border border-gray-300 text-right">-</td>
                  <td className="p-2 border border-gray-300 text-right">₹2,000.00</td>
                </tr>
              ))}
              <tr className="text-[10px] font-bold bg-gray-50">
                <td className="p-2 border border-gray-300 text-right">Subtotal</td>
                <td className="p-2 border border-gray-300 text-right">₹16,000.00</td>
                <td className="p-2 border border-gray-300 text-right">-</td>
                <td className="p-2 border border-gray-300 text-right">-</td>
                <td className="p-2 border border-gray-300 text-right">₹16,000.00</td>
              </tr>

              {/* Grand Total */}
              <tr className="bg-[#34495e] text-white text-[11px] font-bold">
                <td className="p-2 border border-gray-400 text-right uppercase tracking-wider">Grand Total</td>
                <td className="p-2 border border-gray-400 text-right">₹21,000.00</td>
                <td className="p-2 border border-gray-400 text-right">-</td>
                <td className="p-2 border border-gray-400 text-right">-</td>
                <td className="p-2 border border-gray-400 text-right">₹21,000.00</td>
              </tr>
            </tbody>
          </table>
          
          <div className="mt-8 pt-8 flex justify-between">
            <div className="text-center">
              <p className="text-[10px] text-gray-500 border-t border-gray-300 pt-1 w-32 mx-auto">Cashier Signature</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-500 border-t border-gray-300 pt-1 w-32 mx-auto">Parent Signature</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FeeReceipt;

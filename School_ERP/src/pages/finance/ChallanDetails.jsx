import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FileText, Printer, ArrowLeft, CheckCircle2, 
  Receipt, Clock, User, Calendar, DollarSign, 
  Layers, Phone, Mail, Check, AlertCircle, RefreshCw
} from 'lucide-react';
import Swal from 'sweetalert2';
import FinanceTabs from '../../components/finance/FinanceTabs';
import { feeCollectionService } from '../../api/feeCollectionService';
import axiosInstance from '../../api/axios';

const ChallanDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [challan, setChallan] = useState(null);

  useEffect(() => {
    fetchChallanDetails();
  }, [id]);

  const fetchChallanDetails = async () => {
    try {
      setLoading(true);
      const res = await feeCollectionService.getChallanById(id);
      if (res && (res.data || res._id)) {
        setChallan(res.data || res);
      }
    } catch (err) {
      console.error('Error fetching challan details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async () => {
    if (!challan) return;
    const challanNo = challan.challanNo;

    const result = await Swal.fire({
      title: 'Record Payment?',
      text: `Mark challan ${challanNo} as Paid and generate collection entry?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Mark Paid',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#10b981'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosInstance.patch(`/fee-challans/${challanNo}/pay`);
      if (res.data?.success) {
        Swal.fire('Success', 'Challan marked as Paid successfully', 'success');
        await fetchChallanDetails();
      }
    } catch (err) {
      console.error('Error marking challan as paid:', err);
      Swal.fire('Error', err?.response?.data?.message || 'Failed to update challan', 'error');
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-[1200px] mx-auto min-h-screen flex items-center justify-center font-sans">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-600" />
          <p className="text-xs text-slate-500 font-medium">Loading challan details...</p>
        </div>
      </div>
    );
  }

  if (!challan) {
    return (
      <div className="p-4 md:p-6 max-w-[1200px] mx-auto min-h-screen font-sans">
        <FinanceTabs />
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 mt-6">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800">Challan Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">The requested challan could not be located in the database.</p>
          <button
            onClick={() => navigate('/finance/challans')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
          >
            Back to Fee Challans
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

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto bg-slate-50/60 min-h-screen text-slate-800 pb-24 font-sans">
      
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
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Challan Details</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                challan.status === 'Paid' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {challan.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">Reference: {challan.challanNo}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {challan.status !== 'Paid' && (
            <button
              onClick={handleMarkPaid}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all"
            >
              <Check className="w-3.5 h-3.5" /> Mark Paid
            </button>
          )}
          <button
            onClick={() => navigate(`/finance/print-challan/${challan._id || challan.challanNo}`)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all"
          >
            <Printer className="w-3.5 h-3.5" /> Print Voucher
          </button>
        </div>
      </div>

      {/* Tabs */}
      <FinanceTabs />

      {/* Main Voucher Card */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden mb-6">
        
        {/* Banner Section */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-indigo-300 uppercase">OFFICIAL FEE VOUCHER</span>
            <h2 className="text-2xl font-black tracking-tight">{challan.challanNo}</h2>
            <p className="text-xs text-slate-300 mt-0.5">{feeGroup.name || 'Academic Fee Group'}</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] text-slate-400 block uppercase">Total Demand</span>
            <div className="text-2xl font-black text-emerald-400">
              ₹{(challan.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-slate-300">
              Due Date: {new Date(challan.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Student & Schedule Information Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-100 text-xs">
          
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-600" /> Student Profile
            </h3>
            
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-400">Student Name:</span>
              <span className="col-span-2 font-bold text-slate-800">{studentName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-400">Admission No:</span>
              <span className="col-span-2 font-mono font-bold text-indigo-600">{admissionNo}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-400">Class & Section:</span>
              <span className="col-span-2 font-medium text-slate-800">{className} - {sectionName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-400">Father/Guardian:</span>
              <span className="col-span-2 text-slate-800">{guardianName}</span>
            </div>
          </div>

          <div className="space-y-3 md:border-l md:border-slate-100 md:pl-6">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600" /> Billing Details
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-400">Issue Date:</span>
              <span className="col-span-2 text-slate-800">{new Date(challan.createdAt).toLocaleDateString('en-IN')}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-400">Due Date:</span>
              <span className="col-span-2 font-semibold text-rose-600">{new Date(challan.dueDate).toLocaleDateString('en-IN')}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-400">Status:</span>
              <span className="col-span-2 font-bold text-slate-800">{challan.status}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-slate-400">Deposit Methods:</span>
              <span className="col-span-2 text-slate-600">School Counter / Bank Voucher / Online</span>
            </div>
          </div>

        </div>

        {/* Fees Particulars Table */}
        <div className="p-6">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Fee Breakdown Particulars</h3>
          
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Particulars / Fee Head</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {items.length > 0 ? (
                  items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{idx + 1}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {item.feeType?.name || item.name || `Fee Item ${idx + 1}`}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-800">
                        ₹{(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">1</td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {feeGroup.name || 'Academic Fee'} (Total Term Installment)
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800">
                      ₹{(challan.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                )}
                <tr className="bg-indigo-50/50 font-bold text-sm">
                  <td colSpan="2" className="py-3.5 px-4 text-slate-900">Total Challan Amount:</td>
                  <td className="py-3.5 px-4 text-right text-indigo-700">
                    ₹{(challan.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Recorded Banner (if paid) */}
        {challan.status === 'Paid' && (
          <div className="m-6 mt-0 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-bold">Payment Settled</p>
                <p className="text-emerald-700 text-[11px]">
                  Deposit recorded on {challan.paymentDate ? new Date(challan.paymentDate).toLocaleDateString('en-IN') : 'Recent'}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/finance/receipt/${challan._id || challan.challanNo}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 text-emerald-700 rounded-xl font-bold shadow-xs hover:bg-emerald-100 transition-all"
            >
              <Receipt className="w-3.5 h-3.5" /> View Fee Receipt
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

export default ChallanDetails;

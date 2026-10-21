import React, { useState, useEffect } from 'react';
import HRTabs from '../../components/hr/HRTabs';
import { 
  FileText, Eye, Zap, Calendar, Download, Printer, Edit2, X, Plus, HelpCircle
} from 'lucide-react';
import { payrollService } from '../../api/payrollService';

export default function HRPayroll() {
  const [currentView, setCurrentView] = useState('list');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [generateMonth, setGenerateMonth] = useState('July');
  const [generateYear, setGenerateYear] = useState(new Date().getFullYear().toString());
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [payslips, setPayslips] = useState([]);
  const [loadingPayslips, setLoadingPayslips] = useState(false);

  useEffect(() => { fetchPayrolls(); }, []);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const res = await payrollService.getPayroll();
      const data = (res.data || []).map((p, i) => ({
        id: p._id || i + 1,
        month: p.month || `${p.monthName || ''} ${p.year || ''}`.trim(),
        status: p.status || 'Generated',
        date: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'
      }));
      setPayrolls(data);
    } catch (err) {
      console.error('Payroll load error:', err);
      setPayrolls([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePayroll = async () => {
    try {
      setGenerating(true);
      await payrollService.generatePayroll({ month: generateMonth, year: generateYear });
      alert(`Payroll for ${generateMonth} ${generateYear} generated successfully!`);
      fetchPayrolls();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setGenerating(false);
    }
  };

  const loadSummary = async (monthStr) => {
    setSelectedMonth(monthStr);
    setCurrentView('summary');
    setLoadingPayslips(true);
    try {
      const [m, y] = monthStr.split(' ');
      const res = await payrollService.getPayroll({ month: m, year: y });
      setPayslips(res.data || []);
    } catch (err) {
      console.error(err);
      setPayslips([]);
    } finally {
      setLoadingPayslips(false);
    }
  };

  const handleProcessPayment = async (id) => {
    try {
       await payrollService.processPayroll(id, { status: 'Paid' });
       alert('Salary marked as paid!');
       loadSummary(selectedMonth);
       setShowPaymentModal(false);
    } catch (err) {
       alert('Error: ' + (err.response?.data?.message || err.message));
       setShowPaymentModal(false);
    }
  };

  const renderListView = () => (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="flex-1 bg-white border border-slate-200 rounded-none shadow-sm w-full">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#5F52FF]" />
          <h2 className="text-[14px] font-bold text-slate-800">Generated Payroll List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold text-[#5F52FF] uppercase tracking-wider">
                <th className="px-5 py-3 w-12">#</th>
                <th className="px-5 py-3">Month &amp; Year</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Generated On</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-slate-700">
              {loading ? (
                <tr><td colSpan="5" className="px-5 py-8 text-center text-slate-500 font-semibold">Loading payroll records from database...</td></tr>
              ) : payrolls.length === 0 ? (
                <tr><td colSpan="5" className="px-5 py-8 text-center text-slate-400">No payroll generated yet. Use the form on the right to generate.</td></tr>
              ) : payrolls.map((pr, idx) => (
                <tr key={pr.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">{idx + 1}</td>
                  <td className="px-5 py-4 font-semibold">{pr.month}</td>
                  <td className="px-5 py-4">
                    <span className="inline-block px-2 py-1 bg-orange-50 text-orange-600 border border-orange-200 rounded-none text-[11px] font-bold">{pr.status}</span>
                  </td>
                  <td className="px-5 py-4">{pr.date}</td>
                  <td className="px-5 py-4">
                    <button 
                      onClick={() => loadSummary(pr.month)}
                      className="px-4 py-1.5 bg-white border border-slate-300 rounded-none hover:bg-slate-50 text-[12px] font-bold text-slate-700 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-full lg:w-[350px] shrink-0 bg-white border border-slate-200 rounded-none shadow-sm">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#5F52FF]" />
          <h2 className="text-[14px] font-bold text-slate-800">Generate New Payroll</h2>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Month</label>
            <select value={generateMonth} onChange={(e) => setGenerateMonth(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-none text-[13px] text-slate-700 focus:outline-none focus:border-[#5F52FF]">
              {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Year</label>
            <input type="text" value={generateYear} onChange={(e) => setGenerateYear(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-none text-[13px] text-slate-700 focus:outline-none focus:border-[#5F52FF]" />
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-none p-4">
            <h4 className="text-[12px] font-bold text-slate-800 flex items-center gap-1.5 mb-2">
              <Calendar className="w-3.5 h-3.5" /> Working Days
            </h4>
            <div className="flex gap-1.5 items-start text-slate-500 text-[11px] bg-white border border-slate-200 rounded-none p-2">
              <HelpCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Attendance data will be pulled from the HR module automatically.</span>
            </div>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-slate-200">
          <button 
            onClick={handleGeneratePayroll}
            disabled={generating}
            className="w-full py-2 bg-[#5F52FF] hover:bg-[#4f42e6] disabled:bg-gray-400 text-white font-bold text-[13px] rounded-none flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer border-none"
          >
            <Zap className="w-4 h-4 fill-white" /> {generating ? 'Generating...' : 'Generate Payroll'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderSummaryView = () => (
    <div className="bg-white border border-slate-200 rounded-none shadow-sm">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-slate-800">Payroll for {selectedMonth}</h2>
        <button onClick={() => setCurrentView('list')} className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-[12px] rounded-none transition-colors cursor-pointer">
          Back to Payroll List
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold text-[#5F52FF] uppercase tracking-wider">
              <th className="px-5 py-3">Staff Name</th>
              <th className="px-5 py-3">Gross Salary</th>
              <th className="px-5 py-3">Days Worked</th>
              <th className="px-5 py-3">Attendance Deduction</th>
              <th className="px-5 py-3">Statutory Deductions</th>
              <th className="px-5 py-3">Other Deductions</th>
              <th className="px-5 py-3">Net Salary</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-[13px] text-slate-700">
            {loadingPayslips ? (
               <tr><td colSpan="9" className="text-center p-5 text-gray-500 font-bold">Loading payslips...</td></tr>
            ) : payslips.length === 0 ? (
               <tr><td colSpan="9" className="text-center p-5 text-gray-500">No payslips found for this month...</td></tr>
            ) : payslips.map((staff) => (
              <tr key={staff._id || staff.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4 font-semibold">{staff.staff?.firstName || staff.name || 'Unknown'}</td>
                <td className="px-5 py-4">₹{staff.grossSalary || staff.gross || '0.00'}</td>
                <td className="px-5 py-4">{staff.presentDays || staff.days || '0'} / 31</td>
                <td className="px-5 py-4 font-bold text-red-500">₹{staff.attendanceDeduction || staff.attDeduction || '0.00'}</td>
                <td className="px-5 py-4 text-slate-500">{staff.statutoryDeductions || staff.statDeductions || '0.00'}</td>
                <td className="px-5 py-4">₹{staff.otherDeductions || '0.00'}</td>
                <td className="px-5 py-4 font-bold text-slate-900">₹{staff.netSalary || staff.net || '0.00'}</td>
                <td className="px-5 py-4">
                  {staff.status === 'Paid' ? (
                    <span className="inline-block px-2 py-1 bg-green-50 text-green-600 border border-green-200 rounded-none text-[11px] font-bold">Paid</span>
                  ) : (
                    <span className="inline-block px-2 py-1 bg-orange-50 text-orange-600 border border-orange-200 rounded-none text-[11px] font-bold">Unpaid</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {staff.status === 'Unpaid' && (
                      <>
                        <button onClick={() => setCurrentView('edit')} className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setShowPaymentModal(true)} className="px-4 py-1.5 bg-[#5F52FF] hover:bg-[#4f42e6] text-white text-[12px] font-bold rounded-none transition-colors cursor-pointer border-none">
                          Pay
                        </button>
                      </>
                    )}
                    <button onClick={() => setCurrentView('payslip')} className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-[12px] font-bold rounded-none transition-colors cursor-pointer">
                      View Payslip
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-10">
      <div className="bg-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Human Resource</h1>
          <p className="text-[11px] text-slate-500 mt-1">Manage staff, attendance, leaves, payroll, and loans across the school.</p>
        </div>
      </div>

      <HRTabs />

      <div className="p-6 max-w-[1400px] mx-auto space-y-4">
        {currentView === 'list' && renderListView()}
        {currentView === 'summary' && renderSummaryView()}
        {currentView === 'edit' && (
          <div className="bg-white p-6 border border-slate-200 shadow-sm rounded-none text-center text-slate-500">
            <p>Edit Payroll for: <strong>{selectedMonth}</strong></p>
            <button onClick={() => setCurrentView('summary')} className="mt-4 px-4 py-2 bg-white border border-slate-300 rounded-none text-slate-700 font-bold text-sm hover:bg-slate-50">← Back</button>
          </div>
        )}
        {currentView === 'payslip' && (
          <div className="bg-white p-6 border border-slate-200 shadow-sm rounded-none">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Payslip — {selectedMonth}</h2>
              <div className="flex gap-2">
                <button onClick={() => setCurrentView('summary')} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-none hover:bg-slate-50">← Back</button>
                <button className="px-4 py-2 bg-[#17a2b8] text-white font-bold text-sm rounded-none flex items-center gap-1"><Download className="w-3.5 h-3.5" /> Download PDF</button>
                <button className="px-4 py-2 bg-[#fd7e14] text-white font-bold text-sm rounded-none flex items-center gap-1"><Printer className="w-3.5 h-3.5" /> Print</button>
              </div>
            </div>
            <div className="text-center text-slate-400 py-10">Payslip detail view — connect to live payslip API.</div>
          </div>
        )}
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none shadow-xl w-full max-w-sm overflow-hidden">
            <div className="px-5 py-4 flex justify-between items-center border-b border-slate-200">
              <h2 className="text-[16px] font-bold text-slate-800">Proceed with Payment</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5">
              <p className="text-[14px] text-slate-700 mb-4">Are you sure you want to mark this salary as paid?</p>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Payment Date</label>
                <input type="date" defaultValue={new Date().toISOString().slice(0,10)} className="w-full px-3 py-2 border border-slate-300 rounded-none text-[13px] text-slate-700 focus:outline-none focus:border-[#5F52FF]" />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setShowPaymentModal(false)} className="px-4 py-2 bg-white border border-slate-300 rounded-none text-slate-700 font-bold text-[13px] hover:bg-slate-50 transition-colors cursor-pointer">Cancel</button>
              <button 
                 onClick={() => handleProcessPayment(showPaymentModal)} 
                 className="px-4 py-2 bg-[#5F52FF] hover:bg-[#4f42e6] text-white rounded-none font-bold text-[13px] transition-colors cursor-pointer border-none shadow-sm"
              >Confirm Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

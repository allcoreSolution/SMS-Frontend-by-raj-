import React, { useState, useEffect, useMemo } from 'react';
import { 
  Receipt, Calendar, Search, Download, Printer, 
  Send, HelpCircle, FileText, CheckCircle2, Zap, 
  Filter, Clock, Users, ArrowUpRight, DollarSign, RefreshCw, X
} from 'lucide-react';
import Swal from 'sweetalert2';
import FinanceTabs from '../../components/finance/FinanceTabs';
import QuickSetupModal from '../../components/finance/QuickSetupModal';
import { academicService } from '../../api/academicService';
import { feeCollectionService } from '../../api/feeCollectionService';

const GenerateDueSlip = () => {
  const [isQuickSetupOpen, setIsQuickSetupOpen] = useState(false);
  const [month, setMonth] = useState('March');
  const [year, setYear] = useState('2026');
  const [dueBasis, setDueBasis] = useState('Till this Month (arrears + current)');
  
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');

  const [loading, setLoading] = useState(false);
  const [generatedBatch, setGeneratedBatch] = useState(null);
  const [slips, setSlips] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');

  // Printable Modal State
  const [activeSlipForPrint, setActiveSlipForPrint] = useState(null);

  useEffect(() => {
    loadMetadata();
  }, []);

  const loadMetadata = async () => {
    try {
      const [classRes, sectionRes] = await Promise.all([
        academicService.getClasses(),
        academicService.getSections()
      ]);
      setClasses(classRes.data || classRes || []);
      setSections(sectionRes.data || sectionRes || []);
    } catch (err) {
      console.error('Failed to load academic classes/sections:', err);
    }
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const payload = {
        month,
        year,
        dueBasis,
        targetClass: selectedClass,
        targetSection: selectedSection
      };

      const res = await feeCollectionService.generateDueSlip(payload);
      if (res && res.success) {
        if (!res.slips || res.slips.length === 0) {
          Swal.fire({
            title: 'No Outstanding Dues Found',
            text: res.message || 'No students with pending fees were found for the selected criteria.',
            icon: 'info',
            confirmButtonColor: '#4f46e5'
          });
          setGeneratedBatch(null);
          setSlips([]);
        } else {
          setGeneratedBatch(res.batch);
          setSlips(res.slips);
          Swal.fire({
            title: 'Due Slips Generated!',
            html: `<div class="text-left text-sm space-y-1">
              <p class="text-emerald-600 font-semibold">✓ Demand batch recorded into Due Slip History</p>
              <p><strong>Batch ID:</strong> ${res.batch?.batchId || 'N/A'}</p>
              <p><strong>Students Notified:</strong> ${res.slips.length}</p>
              <p><strong>Total Demand:</strong> ₹${(res.batch?.totalDueAmount || 0).toLocaleString('en-IN')}</p>
            </div>`,
            icon: 'success',
            confirmButtonColor: '#4f46e5'
          });
        }
      }
    } catch (err) {
      console.error('Error generating due slips:', err);
      Swal.fire('Generation Failed', err?.response?.data?.message || 'Failed to generate due slips', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredSlips = useMemo(() => {
    if (!searchFilter) return slips;
    const q = searchFilter.toLowerCase();
    return slips.filter(s => 
      (s.student || '').toLowerCase().includes(q) ||
      (s.admission || '').toLowerCase().includes(q) ||
      (s.classSec || '').toLowerCase().includes(q) ||
      (s.code || '').toLowerCase().includes(q)
    );
  }, [slips, searchFilter]);

  const handleSendWhatsApp = (slip) => {
    const text = encodeURIComponent(
      `*ACS Public School - Fee Due Notice*\n\n` +
      `Dear Parent of *${slip.student}* (${slip.classSec}, Adm No: ${slip.admission}),\n\n` +
      `This is a gentle reminder that fee dues for *${month} ${year}* are outstanding:\n` +
      `• Previous Arrears: ₹${slip.prevDue?.toLocaleString('en-IN')}\n` +
      `• Current Demand: ₹${slip.currDue?.toLocaleString('en-IN')}\n` +
      `• *Total Outstanding: ₹${slip.totalDue?.toLocaleString('en-IN')}*\n\n` +
      `Kindly deposit the fees before the due date to avoid late charges.\n\n` +
      `Fee Slip Code: ${slip.code}\n` +
      `Thank you,\nAccount Section, ACS School`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleExportCSV = () => {
    if (!filteredSlips.length) {
      Swal.fire('No Data', 'No slips available to export', 'info');
      return;
    }
    const headers = ['SLIP CODE', 'STUDENT NAME', 'ADMISSION NO', 'CLASS & SECTION', 'BILLING PERIOD', 'PREVIOUS ARREARS', 'CURRENT DUES', 'TOTAL DEMAND (INR)'];
    const rows = filteredSlips.map(s => [
      s.code,
      `"${s.student}"`,
      s.admission,
      `"${s.classSec}"`,
      `"${s.month} ${s.year}"`,
      s.prevDue,
      s.currDue,
      s.totalDue
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `due_slips_${month}_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintAll = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto bg-slate-50/60 min-h-screen text-slate-800 pb-24 font-sans print:p-0 print:bg-white">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white p-3.5 rounded-2xl text-xs flex items-center justify-between gap-3 mb-5 shadow-sm shadow-indigo-500/10 print:hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-xs">
            <Receipt className="w-4 h-4 text-white" />
          </div>
          <p className="leading-relaxed">
            <strong className="font-semibold">Fee Due Slip Generator:</strong> Run instant billing demand checks across any class or section, calculate arrears + current dues, generate printable slips, and dispatch direct WhatsApp reminders.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 print:hidden">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Generate Due Fee Slips</h1>
              <p className="text-xs text-slate-500">Calculate student fee demands and issue official collection notices</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsQuickSetupOpen(true)}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-xs hover:bg-slate-50 transition-all hover:border-slate-300"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" /> Quick Setup
        </button>
      </div>

      {/* Tabs */}
      <FinanceTabs />

      {/* Generator Configuration Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 md:p-6 mb-6 print:hidden">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-800">Select Month, Billing Basis & Scope</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          
          {/* Month */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              BILLING MONTH
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium"
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              YEAR
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium"
            >
              {['2024', '2025', '2026', '2027'].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Due Basis */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              DUE BASIS
            </label>
            <select
              value={dueBasis}
              onChange={(e) => setDueBasis(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              <option value="Till this Month (arrears + current)">Till this Month (arrears + current)</option>
              <option value="Only this Month">Only this Month</option>
            </select>
          </div>

          {/* Target Class */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              CLASS
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              <option value="All">All Classes</option>
              {classes.map(c => (
                <option key={c._id} value={c.className}>{c.className}</option>
              ))}
            </select>
          </div>

          {/* Target Section */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              SECTION
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              <option value="All">All Sections</option>
              {sections.map(s => (
                <option key={s._id} value={s.sectionName}>Section {s.sectionName}</option>
              ))}
            </select>
          </div>

        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all disabled:opacity-60"
          >
            <Search className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Calculating Student Balances...' : 'Generate Due Slips'}
          </button>
        </div>
      </div>

      {/* Generated Batch Summary & Slips List */}
      {slips.length > 0 && (
        <div className="space-y-6">
          
          {/* Batch Status Alert Banner */}
          <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 print:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-indigo-900">
                  Showing demand up to <span className="font-bold">{month} {year}</span> ({dueBasis})
                </p>
                <p className="text-[11px] text-indigo-600">
                  Batch Reference: <span className="font-mono font-bold">{generatedBatch?.batchId}</span> • Generated {slips.length} student slips
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium shadow-xs transition-all"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
              </button>
              <button
                onClick={handlePrintAll}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium shadow-xs transition-all"
              >
                <Printer className="w-3.5 h-3.5" /> Print All Slips
              </button>
            </div>
          </div>

          {/* Slips Table Card */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
            
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 print:hidden">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Generated Slips for {month} {year}
                </h3>
                <p className="text-xs text-slate-500">Individual demand breakdowns with WhatsApp notification triggers</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter by student or code..."
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Slip Code</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Admission No</th>
                    <th className="py-3 px-4">Class & Sec</th>
                    <th className="py-3 px-4 text-right">Prev Arrears</th>
                    <th className="py-3 px-4 text-right">Current Demand</th>
                    <th className="py-3 px-4 text-right">Total Due (₹)</th>
                    <th className="py-3 px-4 text-center print:hidden">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredSlips.map((slip, idx) => (
                    <tr key={slip.code || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400 text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                        {slip.code}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {slip.student}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono">
                        {slip.admission}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {slip.classSec}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-500">
                        ₹{slip.prevDue?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-700 font-medium">
                        ₹{slip.currDue?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-rose-600">
                        ₹{slip.totalDue?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 print:hidden">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setActiveSlipForPrint(slip)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all"
                            title="Print Slip Preview"
                          >
                            <Printer className="w-3 h-3 text-slate-500" /> Print
                          </button>
                          <button
                            onClick={() => handleSendWhatsApp(slip)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all"
                            title="Send WhatsApp Notice"
                          >
                            <Send className="w-3 h-3 text-emerald-600" /> WhatsApp
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
              <span>Showing {filteredSlips.length} student due slips</span>
              <span className="font-bold text-slate-800">
                Total Batch Due: ₹{slips.reduce((sum, s) => sum + (s.totalDue || 0), 0).toLocaleString('en-IN')}
              </span>
            </div>

          </div>

        </div>
      )}

      {/* Single Printable Slip Modal */}
      {activeSlipForPrint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-indigo-700">Official Fee Due Voucher Preview</span>
              <button 
                onClick={() => setActiveSlipForPrint(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 font-sans">
              <div className="text-center pb-4 border-b border-slate-200">
                <h3 className="text-lg font-black text-slate-900 tracking-wider">ACS PUBLIC SCHOOL</h3>
                <p className="text-xs text-slate-500">Official Fee Demand Notice</p>
                <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700">
                  Slip: {activeSlipForPrint.code}
                </div>
              </div>

              <div className="py-4 space-y-2 text-xs border-b border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-bold text-slate-900">{activeSlipForPrint.student}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Admission No:</span>
                  <span className="font-mono text-slate-800">{activeSlipForPrint.admission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Class & Section:</span>
                  <span className="font-medium text-slate-800">{activeSlipForPrint.classSec}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Billing Period:</span>
                  <span className="font-medium text-slate-800">{month} {year}</span>
                </div>
              </div>

              <div className="py-4 space-y-2 text-xs border-b border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Previous Arrears:</span>
                  <span className="font-medium text-slate-800">₹{activeSlipForPrint.prevDue?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Month Demand:</span>
                  <span className="font-medium text-slate-800">₹{activeSlipForPrint.currDue?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-bold text-slate-900">
                  <span>Net Amount Payable:</span>
                  <span className="text-rose-600">₹{activeSlipForPrint.totalDue?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Voucher
                </button>
                <button
                  onClick={() => handleSendWhatsApp(activeSlipForPrint)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <Send className="w-3.5 h-3.5" /> WhatsApp Notice
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Quick Setup Modal */}
      <QuickSetupModal isOpen={isQuickSetupOpen} onClose={() => setIsQuickSetupOpen(false)} />

    </div>
  );
};

export default GenerateDueSlip;

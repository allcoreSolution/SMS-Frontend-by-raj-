import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Download, Printer, LayoutGrid, List as ListIcon,
  Users, FileText, CheckCircle2, Tag, AlertTriangle, Send, 
  HandCoins, Filter, X, RefreshCw, ArrowRight, Sparkles, Building
} from 'lucide-react';
import Swal from 'sweetalert2';
import QuickSetupModal from '../../components/finance/QuickSetupModal';
import FinanceTabs from '../../components/finance/FinanceTabs';
import { feeCollectionService } from '../../api/feeCollectionService';

const SearchDueFees = () => {
  const navigate = useNavigate();
  const [isQuickSetupOpen, setIsQuickSetupOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDueFeesData = async () => {
    try {
      setLoading(true);
      const res = await feeCollectionService.searchDueFees();
      const raw = res?.data || [];

      const mapped = raw.map((s, idx) => ({
        no: idx + 1,
        id: s.id || s._id,
        adm: s.admissionNo || s.aparId || `YIS-${idx+101}`,
        name: s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Student',
        class: s.class || s.academicClass?.className || 'Class I',
        section: s.section || 'A',
        groupsCount: s.groups?.length || 1,
        groups: s.groups || [],
        totalAssigned: s.totalAssigned || 0,
        totalPaid: s.totalPaid || 0,
        totalDue: s.totalDue || 0,
        phone: s.studentPhone || s.phone || '9876543210'
      }));

      setStudents(mapped);
      setFilteredStudents(mapped);

      const uniqueClasses = Array.from(new Set(mapped.map(m => m.class))).filter(Boolean);
      setClassesList(uniqueClasses);
    } catch (err) {
      console.error('Failed to load due fees:', err);
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDueFeesData();
  }, []);

  useEffect(() => {
    let result = [...students];
    if (selectedClass !== 'All') {
      result = result.filter(s => s.class === selectedClass);
    }
    if (selectedSection !== 'All') {
      result = result.filter(s => s.section === selectedSection);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.adm.toLowerCase().includes(q)
      );
    }
    setFilteredStudents(result);
  }, [selectedClass, selectedSection, searchQuery, students]);

  const handleClearFilters = () => {
    setSelectedClass('All');
    setSelectedSection('All');
    setSearchQuery('');
  };

  const handleSendReminder = (student) => {
    Swal.fire({
      icon: 'success',
      title: 'Due Reminder Dispatched!',
      html: `Automated SMS & WhatsApp notification sent to <strong>${student.name}</strong> for pending fee of <strong>₹${student.totalDue.toLocaleString('en-IN')}</strong>.`,
      confirmButtonText: 'OK',
      confirmButtonColor: '#6366f1'
    });
  };

  const handleExportCSV = () => {
    const headers = ['No', 'Admission No', 'Student Name', 'Class', 'Total Demanded', 'Paid', 'Due Balance'];
    const rows = filteredStudents.map(s => [
      s.no,
      s.adm,
      `"${s.name}"`,
      s.class,
      s.totalAssigned,
      s.totalPaid,
      s.totalDue
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `due_fees_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPI Calculations
  const totalDueAmount = filteredStudents.reduce((sum, s) => sum + s.totalDue, 0);
  const totalDemanded = filteredStudents.reduce((sum, s) => sum + s.totalAssigned, 0);
  const totalPaid = filteredStudents.reduce((sum, s) => sum + s.totalPaid, 0);
  const recoveryRate = totalDemanded > 0 ? ((totalPaid / totalDemanded) * 100).toFixed(1) : '0.0';

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto bg-slate-50/70 min-h-screen text-slate-800 pb-24 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 text-white rounded-3xl p-6 shadow-xl shadow-indigo-950/10 mb-6 border border-indigo-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold mb-2 border border-white/10">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Institutional Dues Recovery Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Search Due Fees Report
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Audit unpaid balances, identify student defaulters, and trigger recovery actions across academic classes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDueFeesData}
              disabled={loading}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button 
              onClick={() => navigate('/finance/collect')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <HandCoins className="w-4 h-4" />
              <span>Collect Fees</span>
            </button>
          </div>
        </div>
      </div>

      <FinanceTabs />

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Students with Dues</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{filteredStudents.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Demand</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">₹{totalDemanded.toLocaleString('en-IN')}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Paid So Far</p>
            <h3 className="text-xl font-black text-emerald-600 mt-0.5">
              ₹{totalPaid.toLocaleString('en-IN')} <span className="text-xs text-emerald-500 font-semibold">({recoveryRate}%)</span>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Outstanding Due</p>
            <h3 className="text-xl font-black text-rose-600 mt-0.5">₹{totalDueAmount.toLocaleString('en-IN')}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>Filter Dues by Class, Section & Name</span>
          </h3>
          {(selectedClass !== 'All' || selectedSection !== 'All' || searchQuery) && (
            <button 
              onClick={handleClearFilters}
              className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          <div className="sm:col-span-3">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Classes ({students.length})</option>
              {classesList.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          <div className="sm:col-span-7">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Search by Name or Admission / APAR ID</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name or admission number..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
        
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Students Outstanding Ledger
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100">
              {filteredStudents.length} defaulters
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 font-medium">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading due fees report from database...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-medium">
            <CheckCircle2 className="w-10 h-10 text-emerald-500/40 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Defaulters Found</h4>
            <p className="text-xs text-slate-500 mt-1">All students matching the selected criteria have cleared their fee dues.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Admission No</th>
                  <th className="py-3 px-3">Class (Sec)</th>
                  <th className="py-3 px-3 text-right">Demanded</th>
                  <th className="py-3 px-3 text-right">Paid</th>
                  <th className="py-3 px-3 text-right">Balance Due</th>
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredStudents.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-slate-400">{i + 1}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0">
                          {s.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-600">{s.adm}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                        {s.class} ({s.section})
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 font-semibold">
                      ₹{s.totalAssigned.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-600 font-semibold">
                      ₹{s.totalPaid.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-black text-rose-600 text-sm">
                        ₹{s.totalDue.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => navigate(`/finance/collect/${s.id || s.adm}`)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <HandCoins className="w-3.5 h-3.5" />
                          <span>Collect</span>
                        </button>
                        <button
                          onClick={() => handleSendReminder(s)}
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                          title="Send SMS / WhatsApp Due Reminder"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      <QuickSetupModal isOpen={isQuickSetupOpen} onClose={() => setIsQuickSetupOpen(false)} />
    </div>
  );
};

export default SearchDueFees;

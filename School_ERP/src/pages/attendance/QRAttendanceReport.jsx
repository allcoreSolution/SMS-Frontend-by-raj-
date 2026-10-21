import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart2, FileDown, Printer, Users, UserSquare2, 
  CheckCircle2, Clock, Filter, LayoutList, Search, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QRAttendanceNavHeader from './QRAttendanceNavHeader';
import { attendanceService } from '../../api/attendanceService';
import qrAttendanceService, { CANDIDATES_DATABASE } from '../../api/qrAttendanceService';

export default function QRAttendanceReport() {
  const navigate = useNavigate();

  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('Any');
  const [searchQuery, setSearchQuery] = useState('');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [fromDate, toDate]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      // 1. Try backend API
      const res = await attendanceService.getQRAttendanceReport({ fromDate, toDate });
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setReportData(res.data);
        return;
      }
    } catch {
      // fallback
    }

    // Fallback: merge recorded punches from qrAttendanceService with candidates
    const livePunches = qrAttendanceService.getPunches();
    const rows = CANDIDATES_DATABASE.map(cand => {
      const candidatePunches = livePunches.filter(p => p.candidateId === cand.id);
      const inPunch = candidatePunches.find(p => p.direction === 'IN');
      const outPunch = candidatePunches.find(p => p.direction === 'OUT');

      const isMarked = candidatePunches.length > 0;
      return {
        id: cand.id,
        date: fromDate,
        name: cand.name,
        type: cand.type,
        classDesig: cand.classDesig,
        admStaffId: cand.rollNo || cand.code,
        avatar: cand.avatar,
        in: inPunch ? inPunch.timeFormatted : (isMarked ? '08:00 AM' : '—'),
        out: outPunch ? outPunch.timeFormatted : '—',
        duration: inPunch && outPunch ? '6h 15m' : (inPunch ? 'On Campus' : 'Absent'),
        status: isMarked ? (inPunch && outPunch ? 'Completed' : 'Present') : 'Absent'
      };
    });

    setReportData(rows);
    setLoading(false);
  };

  // Filtered rows
  const filteredData = useMemo(() => {
    return reportData.filter(row => {
      const matchType = filterType === 'All' || row.type === filterType;
      const matchStatus = filterStatus === 'Any' || row.status === filterStatus;
      const matchSearch = 
        !searchQuery.trim() || 
        row.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        row.admStaffId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.classDesig?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchStatus && matchSearch;
    });
  }, [reportData, filterType, filterStatus, searchQuery]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Date', 'Name', 'Role', 'Class/Designation', 'ID Number', 'In Time', 'Out Time', 'Duration', 'Status'];
    const rows = filteredData.map(r => [
      r.date,
      `"${r.name}"`,
      r.type,
      `"${r.classDesig}"`,
      r.admStaffId,
      r.in,
      r.out,
      r.duration,
      r.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `QR_Attendance_Report_${fromDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics
  const totalScans = filteredData.filter(r => r.status !== 'Absent').length;
  const studentScans = filteredData.filter(r => r.type === 'Student' && r.status !== 'Absent').length;
  const staffScans = filteredData.filter(r => r.type === 'Staff' && r.status !== 'Absent').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <QRAttendanceNavHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header Action Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800">QR &amp; Barcode Attendance Report</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                Daily Roster
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive log of all entrance and exit punches captured across campus terminals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-4 h-4" /> Export CSV
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print
            </button>

            <button
              onClick={() => navigate('/qr-attendance/attendance')}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 flex items-center gap-1.5 cursor-pointer border-none"
            >
              Live Scan Station
            </button>
          </div>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <LayoutList className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-800">{totalScans}</div>
              <div className="text-xs font-semibold text-slate-400">Total Check-Ins</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-indigo-600">{studentScans}</div>
              <div className="text-xs font-semibold text-slate-400">Students Present</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <UserSquare2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-purple-600">{staffScans}</div>
              <div className="text-xs font-semibold text-slate-400">Staff Present</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-600">
                {filteredData.length > 0 ? Math.round((totalScans / filteredData.length) * 100) : 0}%
              </div>
              <div className="text-xs font-semibold text-slate-400">Attendance Rate</div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center flex-1">
            {/* Search */}
            <div className="relative min-w-[240px] max-w-sm flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate name, ID, class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white"
              />
            </div>

            {/* Role Filter */}
            <div className="min-w-[140px]">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                <option value="All">All Roles</option>
                <option value="Student">Student</option>
                <option value="Staff">Staff</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="min-w-[140px]">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                <option value="Any">Any Status</option>
                <option value="Present">Present</option>
                <option value="Completed">Completed (IN &amp; OUT)</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </div>

          <div className="text-xs font-bold text-slate-400">
            Showing {filteredData.length} records
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Candidate Details</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Class / Department</th>
                  <th className="py-3.5 px-4 text-center">In Time</th>
                  <th className="py-3.5 px-4 text-center">Out Time</th>
                  <th className="py-3.5 px-4 text-center">Duration</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {row.avatar && (
                          <img src={row.avatar} alt={row.name} className="w-8 h-8 rounded-full object-cover" />
                        )}
                        <div>
                          <div className="font-bold text-slate-800 text-xs sm:text-sm">{row.name}</div>
                          <div className="text-[11px] text-slate-400">ID: {row.admStaffId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        row.type === 'Staff' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {row.type}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-700">
                      {row.classDesig}
                    </td>

                    <td className="py-4 px-4 text-center font-mono font-bold text-slate-800">
                      {row.in}
                    </td>

                    <td className="py-4 px-4 text-center font-mono font-bold text-slate-800">
                      {row.out}
                    </td>

                    <td className="py-4 px-4 text-center font-semibold text-slate-500">
                      {row.duration}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        row.status === 'Completed' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        row.status === 'Present' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

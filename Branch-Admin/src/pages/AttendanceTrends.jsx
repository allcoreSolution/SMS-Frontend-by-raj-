import React, { useEffect, useState } from 'react';
import { 
  Download, Activity, RefreshCcw, ListChecks, Calendar, 
  CheckCircle2, AlertTriangle, Building2, TrendingUp, Users 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Swal from 'sweetalert2';
import branchLocalDb from '../api/branchLocalDb';

const AttendanceTrends = () => {
  const [branches, setBranches] = useState([]);
  const [auditDate, setAuditDate] = useState('2026-10-12');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const data = branchLocalDb.getBranches();
      setBranches(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const chartData = [
    { name: '15 Sep', presence: 92.4 },
    { name: '18 Sep', presence: 94.1 },
    { name: '21 Sep', presence: 89.6 },
    { name: '24 Sep', presence: 93.8 },
    { name: '27 Sep', presence: 91.2 },
    { name: '30 Sep', presence: 95.0 },
    { name: '03 Oct', presence: 93.4 },
    { name: '06 Oct', presence: 92.8 },
    { name: '09 Oct', presence: 94.6 },
    { name: '12 Oct', presence: 93.5 }
  ];

  // Table items mapped from branches
  const tableData = branches.map((b, i) => {
    const rateNum = parseFloat(b.attendance) || 92.0;
    const totalStudents = Number(b.students) || 500;
    const presentStudents = Math.round((rateNum / 100) * totalStudents);
    const totalStaff = Number(b.staff) || 40;
    const presentStaff = Math.round(totalStaff * 0.95);

    let health = 'Optimal';
    let statusClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (rateNum < 90) {
      health = 'Needs Review';
      statusClass = 'bg-amber-50 text-amber-700 border-amber-200';
    }

    return {
      id: `${i + 1}.`,
      school: b.name,
      code: b.code,
      rateNum,
      presence: `${rateNum.toFixed(1)}%`,
      students: `${presentStudents} / ${totalStudents}`,
      staff: `${presentStaff} / ${totalStaff}`,
      health,
      statusClass
    };
  });

  const handleExportCsv = () => {
    const headers = [
      { key: 'school', label: 'School Campus' },
      { key: 'code', label: 'Branch Code' },
      { key: 'presence', label: 'Attendance Rate' },
      { key: 'students', label: 'Students Present / Total' },
      { key: 'staff', label: 'Staff Present / Total' },
      { key: 'health', label: 'Health Status' }
    ];
    const ok = branchLocalDb.exportToCsv(`attendance_trends_audit_${auditDate}`, headers, tableData);
    if (ok) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Attendance report exported to CSV!',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleRefresh = () => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Latest presence audit compiled for ${auditDate}!`,
      timer: 1800,
      showConfirmButton: false
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-[#f4f7fa] min-h-[calc(100vh-70px)]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-600 mb-1">
            <Activity className="w-4 h-4" /> Platform-Wide Student & Faculty Presence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Global Attendance Trends
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Aggregated multi-branch daily roll calls, staff biometric logs and campus health indicators.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button 
            onClick={handleExportCsv}
            className="bg-[#28a745] hover:bg-[#218838] text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0b1329] uppercase tracking-tight">
            <Activity className="w-4 h-4 text-cyan-600" /> 30-Day Platform Active Presence Trajectory
          </div>
          <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
            Average: 93.1% Presence
          </span>
        </div>
        
        <div className="p-6">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorPresence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0891b2" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 11}} dy={10} />
                <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 11}} />
                <Tooltip formatter={(value) => [`${value}% Attendance`, 'Presence Rate']} />
                <Area 
                  type="monotone" 
                  dataKey="presence" 
                  stroke="#0891b2" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorPresence)" 
                  activeDot={{r: 6}} 
                  dot={{r: 4, fill: '#0891b2', strokeWidth: 2, stroke: '#fff'}} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Audit Control Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
         <div className="flex items-center gap-3 w-full sm:w-auto">
           <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
             Audit Date:
           </span>
           <input 
             type="date" 
             value={auditDate} 
             onChange={(e) => setAuditDate(e.target.value)}
             className="px-3.5 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 cursor-pointer"
           />
         </div>

         <button 
           onClick={handleRefresh}
           className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md shadow-cyan-600/20 transition-all hover:scale-[1.01]"
         >
           <RefreshCcw className="w-4 h-4" /> Refresh Statistics
         </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="text-sm font-bold text-[#0b1329] uppercase tracking-tight flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-cyan-600" /> Campus Attendance Breakdown ({auditDate})
          </div>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0b1329] text-white">
              <tr className="text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-3.5 text-center">#</th>
                <th className="py-3 px-3.5">Campus Name</th>
                <th className="py-3 px-3.5 text-center">Students (Present / Total)</th>
                <th className="py-3 px-3.5 text-center">Staff (Present / Total)</th>
                <th className="py-3 px-3.5 text-center">Presence Gauge</th>
                <th className="py-3 px-3.5 text-center">Health Indicator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[13px]">
              {tableData.map((row, i) => (
                <tr key={i} className="hover:bg-cyan-50/20 transition-colors">
                  <td className="py-3.5 px-3.5 text-center text-gray-400 font-mono text-xs">{row.id}</td>
                  
                  <td className="py-3.5 px-3.5">
                    <div className="font-bold text-gray-900 text-xs">{row.school}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{row.code}</div>
                  </td>

                  <td className="py-3.5 px-3.5 text-center font-bold text-gray-800">
                    {row.students}
                  </td>

                  <td className="py-3.5 px-3.5 text-center font-medium text-gray-600">
                    {row.staff}
                  </td>

                  <td className="py-3.5 px-3.5">
                    <div className="flex flex-col items-center max-w-[120px] mx-auto">
                       <span className="font-black text-gray-900 text-xs mb-1">{row.presence}</span>
                       <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                         <div 
                           className={`h-full rounded-full ${
                             row.rateNum >= 92 ? 'bg-emerald-500' : 'bg-amber-500'
                           }`}
                           style={{ width: `${Math.min(100, row.rateNum)}%` }}
                         />
                       </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${row.statusClass}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> {row.health}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AttendanceTrends;

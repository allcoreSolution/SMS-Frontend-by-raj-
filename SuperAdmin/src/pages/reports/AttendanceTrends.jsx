import React from 'react';
import { FileDown, Calendar, RefreshCw, List, TrendingUp, AlertTriangle } from 'lucide-react';
import Swal from 'sweetalert2';

const mockAttendance = [
  { id: 1, school: 'Green Valley Public School', studPresent: 420, studTotal: 450, staffPresent: 28, staffTotal: 30, presenceRaw: '93%', status: 'Good' },
  { id: 2, school: 'City Central Academy', studPresent: 310, studTotal: 380, staffPresent: 22, staffTotal: 25, presenceRaw: '82%', status: 'Average' },
  { id: 3, school: 'Sunrise International', studPresent: 510, studTotal: 520, staffPresent: 35, staffTotal: 36, presenceRaw: '98%', status: 'Excellent' },
  { id: 4, school: 'Riverdale High', studPresent: 280, studTotal: 400, staffPresent: 18, staffTotal: 24, presenceRaw: '70%', status: 'Low' },
  { id: 5, school: 'Oakwood School', studPresent: 190, studTotal: 200, staffPresent: 14, staffTotal: 15, presenceRaw: '95%', status: 'Good' },
];

export default function AttendanceTrends() {
  const handleExport = () => {
    if (mockAttendance.length === 0) {
      return Swal.fire({
        icon: 'info',
        title: 'Empty Data',
        text: 'No data available to export.',
        confirmButtonColor: '#0891b2'
      });
    }
    const headers = ['ID', 'School', 'StudPresent', 'StudTotal', 'StaffPresent', 'StaffTotal', 'PresenceRaw', 'Status'];
    const rows = mockAttendance.map(a => [
      a.id, 
      a.school, 
      a.studPresent, 
      a.studTotal, 
      a.staffPresent, 
      a.staffTotal, 
      a.presenceRaw, 
      a.status
    ].map(val => `"${val}"`).join(',')).join('\n');
    
    const csv = `${headers.join(',')}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_trends.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1150px] w-full mx-auto min-h-[85vh] p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[26px] font-bold text-slate-800 tracking-tight">Global Attendance Trends</h1>
        <button onClick={handleExport} className="flex items-center gap-2 bg-[#22c55e] hover:bg-green-600 text-white px-4 py-2.5 rounded-none text-[13px] font-semibold transition-colors shadow-sm">
          <FileDown className="w-4 h-4" /> Export to CSV
        </button>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-none border border-gray-200 shadow-sm mb-6">
        <div className="flex items-center p-4 border-b border-gray-100 text-slate-800 font-bold gap-2 text-[14px]">
          <TrendingUp className="w-4 h-4" strokeWidth={2.5} /> 30-DAY PLATFORM ACTIVE USAGE (STUDENT PRESENCE)
        </div>
        
        <div className="p-5 h-[300px] relative overflow-hidden flex items-end justify-center w-full">
          {/* Simple Mock Area Chart CSS + SVG */}
          <div className="absolute inset-0 pl-12 pb-10 pt-6 pr-6">
             {/* Y-axis labels */}
             <div className="absolute left-4 top-6 bottom-10 flex flex-col justify-between text-[10px] text-gray-500 font-medium">
               <span>40</span>
               <span>35</span>
               <span>30</span>
               <span>25</span>
               <span>20</span>
               <span>15</span>
               <span>10</span>
               <span>5</span>
               <span>0</span>
             </div>
             {/* Chart grid lines */}
             <div className="w-full h-full border-b border-gray-300 relative flex items-end">
               <div className="absolute inset-0 flex flex-col justify-between">
                 <div className="border-b border-gray-100 w-full flex-1"></div>
                 <div className="border-b border-gray-100 w-full flex-1"></div>
                 <div className="border-b border-gray-100 w-full flex-1"></div>
                 <div className="border-b border-gray-100 w-full flex-1"></div>
                 <div className="border-b border-gray-100 w-full flex-1"></div>
                 <div className="border-b border-gray-100 w-full flex-1"></div>
                 <div className="border-b border-gray-100 w-full flex-1"></div>
                 <div className="border-b border-gray-100 w-full flex-1"></div>
               </div>
               
               {/* SVG Line & Area Fill */}
               <svg className="w-full h-full relative z-10 preserve-3d" viewBox="0 0 1000 200" preserveAspectRatio="none">
                 <defs>
                   <linearGradient id="fillGradient" x1="0" x2="0" y1="0" y2="1">
                     <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                     <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.01" />
                   </linearGradient>
                 </defs>
                 {/* Fill Path */}
                 <path d="M 0 190 L 50 195 L 100 198 L 150 197 L 200 199 L 250 192 L 300 195 L 350 190 L 400 198 L 450 199 L 500 195 L 550 198 L 600 40 L 650 199 L 700 199 L 750 195 L 800 198 L 850 193 L 900 198 L 950 20 L 1000 70 L 1000 200 L 0 200 Z" fill="url(#fillGradient)" />
                 {/* Stroke Path */}
                 <path d="M 0 190 L 50 195 L 100 198 L 150 197 L 200 199 L 250 192 L 300 195 L 350 190 L 400 198 L 450 199 L 500 195 L 550 198 L 600 40 L 650 199 L 700 199 L 750 195 L 800 198 L 850 193 L 900 198 L 950 20 L 1000 70" fill="none" stroke="#0ea5e9" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                 
                 {/* Points */}
                 <circle cx="600" cy="40" r="4" fill="#0ea5e9" stroke="white" strokeWidth="2" />
                 <circle cx="950" cy="20" r="4" fill="#0ea5e9" stroke="white" strokeWidth="2" />
                 <circle cx="1000" cy="70" r="4" fill="#0ea5e9" stroke="white" strokeWidth="2" />
               </svg>
             </div>
             
             {/* X-axis labels (Mocked) */}
             <div className="absolute bottom-1 left-12 right-6 flex justify-between text-[7px] text-gray-400 font-medium whitespace-nowrap overflow-hidden">
                <span className="-rotate-45 block mt-2">2026-08-03</span>
                <span className="-rotate-45 block mt-2">2026-08-08</span>
                <span className="-rotate-45 block mt-2">2026-08-13</span>
                <span className="-rotate-45 block mt-2">2026-08-18</span>
                <span className="-rotate-45 block mt-2 italic font-bold text-gray-500">2026-08-19 (Spike)</span>
                <span className="-rotate-45 block mt-2">2026-08-25</span>
                <span className="-rotate-45 block mt-2">2026-08-30</span>
                <span className="-rotate-45 block mt-2 font-bold text-gray-700">2026-09-02</span>
             </div>
          </div>
        </div>
      </div>

      {/* Date Select & Table */}
      <div className="bg-white rounded-none border border-gray-200 shadow-sm overflow-hidden mb-8">
        
        <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
           <label className="text-[12px] font-bold text-gray-600 uppercase tracking-wide">Select Audit Date:</label>
           <div className="relative">
              <input type="text" defaultValue="09/02/2026" className="w-[140px] border border-gray-300 rounded-none px-3 py-1.5 text-[13px] text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 pr-9 font-medium" />
              <Calendar className="absolute right-2.5 top-1.5 w-4 h-4 text-gray-500" />
           </div>
           <button className="flex items-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white px-5 py-1.5 rounded-none text-[13px] font-bold transition-colors shadow-sm ml-2">
              <RefreshCw className="w-4 h-4" /> Load Stats
           </button>
        </div>
        
        <div className="flex items-center p-4 border-b border-gray-100 text-slate-800 font-bold gap-2 text-[14px]">
          <List className="w-4 h-4" strokeWidth={3} /> INSTITUTION PERFORMANCE BREAKDOWN: SEP 02, 2026
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* Dark header */}
              <tr className="bg-[#353a40] text-white">
                <th className="px-5 py-3 text-[11px] font-bold uppercase w-12">#</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase">School Name</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase text-center">Students (Present/Total)</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase text-center">Staff (Present/Total)</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase text-center">Total Presence</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase text-right">Health Status</th>
              </tr>
            </thead>
            <tbody>
              {mockAttendance.map((row, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors bg-white">
                  
                  <td className="px-5 py-4 text-[13px] text-gray-500 font-medium align-middle">
                    {row.id}.
                  </td>
                  
                  <td className="px-5 py-4 align-middle">
                    <span className="text-[14px] font-bold text-slate-800">{row.school}</span>
                  </td>
                  
                  <td className="px-5 py-4 align-middle text-center">
                    <span className="text-[14px] font-bold text-slate-700">{row.studPresent}</span>
                    <span className="text-[12px] font-medium text-gray-400"> / {row.studTotal || '0'}</span>
                  </td>
                  
                  <td className="px-5 py-4 align-middle text-center">
                    <span className="text-[14px] font-bold text-slate-700">{row.staffPresent}</span>
                    <span className="text-[12px] font-medium text-gray-400"> / {row.staffTotal || '0'}</span>
                  </td>
                  
                  <td className="px-5 py-4 align-middle text-center">
                    <div className="flex flex-col items-center gap-1.5 w-[120px] mx-auto">
                       {/* Progress bar */}
                       <div className="w-full h-1.5 bg-gray-200 rounded-none overflow-hidden">
                         <div 
                           className={`h-full ${row.statusType === 'critical' ? 'bg-red-500' : 'bg-gray-400'}`} 
                           style={{ width: `${Math.max(row.presenceRaw, 2)}%` }}>
                         </div>
                       </div>
                       <span className="text-[13px] font-bold text-slate-800">{row.presenceStr}</span>
                    </div>
                  </td>
                  
                  <td className="px-5 py-4 align-middle text-right">
                    {row.statusType === 'critical' ? (
                      <span className="inline-flex items-center gap-1.5 bg-[#dc2626] text-white px-2.5 py-1 rounded-none text-[9px] font-black uppercase tracking-wider shadow-sm">
                        <AlertTriangle className="w-3 h-3" /> {row.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-none border border-gray-300 text-gray-500 bg-gray-50 text-[9px] font-black uppercase tracking-wider">
                        {row.status}
                      </span>
                    )}
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

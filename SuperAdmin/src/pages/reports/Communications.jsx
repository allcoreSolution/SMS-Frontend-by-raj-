import React, { useState, useEffect } from 'react';
import { FileDown, CheckCircle, XCircle, Share2, Filter, Eye, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { tenantService } from '../../api/tenantService';
import { toArray } from '../../utils/helpers';

export default function Communications() {
  const [comms, setComms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [school, setSchool] = useState('All');
  const [channel, setChannel] = useState('All');
  const [status, setStatus] = useState('All');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [viewLog, setViewLog] = useState(null);

  useEffect(() => {
    tenantService.getTenants().then(res => {
      const channels = ['SMS', 'WhatsApp', 'Email'];
      const statuses = ['Delivered', 'Pending', 'Failed'];
      const mapped = toArray(res).map((t, i) => ({
        id: i + 1,
        school: t.schoolName,
        recipient: t.email || 'N/A',
        subject: 'Platform Notification #' + (i + 1),
        channel: channels[i % channels.length],
        status: t.status === 'Active' ? 'Delivered' : statuses[i % statuses.length],
        date: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A',
        count: Math.floor(10 + Math.random() * 90),
      }));
      setComms(mapped);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filteredComms = comms.filter((comm) => {
    if (school !== 'All' && comm.school !== school) return false;
    if (channel !== 'All' && comm.channel !== channel) return false;
    if (status !== 'All' && comm.status !== status) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        comm.recipient.toLowerCase().includes(term) ||
        comm.subject.toLowerCase().includes(term) ||
        comm.school.toLowerCase().includes(term) ||
        comm.channel.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const applyFilters = (e) => { if (e) e.preventDefault(); };

  const uniqueSchools = ['All', ...new Set(comms.map(c => c.school))];
  const uniqueChannels = ['All', ...new Set(comms.map(c => c.channel))];
  const uniqueStatuses = ['All', ...new Set(comms.map(c => c.status))];

  const handleExport = () => {
    if (filteredComms.length === 0) {
      return Swal.fire({
        icon: 'info',
        title: 'Empty Data',
        text: 'No data available to export.',
        confirmButtonColor: '#0891b2'
      });
    }

    const headers = ['ID', 'Date', 'School', 'Channel', 'Recipient', 'Status', 'Subject'];
    const rows = filteredComms.map(c => [
      c.id, 
      c.date, 
      c.school, 
      c.channel, 
      c.recipient, 
      c.status, 
      c.subject
    ].map(val => `"${val}"`).join(',')).join('\n');
    
    const csv = `${headers.join(',')}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'communications.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1150px] w-full mx-auto min-h-[85vh] p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[26px] font-bold text-slate-800 tracking-tight">Global Communications Report</h1>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-5 mb-5 mt-2">
        
        {/* Total Sent */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-none p-4 flex items-center justify-between shadow-sm min-h-[70px]">
           <div>
             <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Total Sent</div>
             <div className="text-[20px] text-slate-800 font-black leading-none">1,032</div>
           </div>
           <div className="bg-green-50 p-2.5 rounded-none text-green-500 shadow-sm border border-green-100">
             <CheckCircle className="w-5 h-5" strokeWidth={2.5} />
           </div>
        </div>

        {/* Total Failed */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-none p-4 flex items-center justify-between shadow-sm min-h-[70px]">
           <div>
             <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Total Failed</div>
             <div className="text-[20px] text-slate-800 font-black leading-none">17</div>
           </div>
           <div className="bg-red-50 p-2.5 rounded-none text-red-500 shadow-sm border border-red-100">
             <XCircle className="w-5 h-5" strokeWidth={2.5} />
           </div>
        </div>

        {/* Breakdown by Channel - Clean Design */}
        <div className="lg:col-span-6 bg-white border border-gray-200 rounded-none p-3 px-4 shadow-sm min-h-[70px] flex items-center">
           <div className="w-full">
             <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
               <Share2 className="w-3.5 h-3.5 text-blue-500" /> Channel Breakdown
             </div>
             <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold text-slate-700">
                {[': 17', ' DATABASE: 114', ' FCM: 352', ' MAIL: 32', ' SMS: 508', ' TELEGRAM: 24', ' WHATSAPP: 2'].map((tag, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-none bg-blue-400"></span>{tag.trim()}
                  </div>
                ))}
             </div>
           </div>
        </div>

      </div>

      {/* Search & Filters */}
      <div className="bg-white mt-8 rounded-none shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b border-gray-100 bg-white">
          <div className="text-[15px] text-gray-700 font-medium">
            Filter Communications
          </div>
          <button onClick={handleExport} className="flex items-center justify-center gap-2 bg-[#22c55e] hover:bg-green-600 outline-none text-white px-3 py-1.5 rounded-none shadow-sm transition-colors text-[12px] font-bold">
            <FileDown className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
        
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1.5">School</label>
              <select value={school} onChange={(e) => setSchool(e.target.value)} className="w-full border border-gray-300 rounded-none px-3 py-2 text-[13px] text-gray-500 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 hover:border-gray-400 font-medium">
                <option value="All">All Schools</option>
                {uniqueSchools.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1.5">Channel</label>
              <select value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full border border-gray-300 rounded-none px-3 py-2 text-[13px] text-gray-500 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 hover:border-gray-400 font-medium">
                <option value="All">All Channels</option>
                {uniqueChannels.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1.5">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-gray-300 rounded-none px-3 py-2 text-[13px] text-gray-500 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 hover:border-gray-400 font-medium">
                <option value="All">All Statuses</option>
                {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
               <label className="block text-[13px] font-bold text-slate-800 mb-1.5">Date Range (Start)</label>
               <input 
                 type="text" 
                 value={dateStart} 
                 onChange={(e) => setDateStart(e.target.value)}
                 className="w-full border border-gray-300 rounded-none px-3 py-2 text-[13px] text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium" 
               />
            </div>
            <div>
               <label className="block text-[13px] font-bold text-slate-800 mb-1.5">Date Range (End)</label>
               <input 
                 type="text" 
                 value={dateEnd}
                 onChange={(e) => setDateEnd(e.target.value)}
                 placeholder="mm/dd/yyyy" 
                 className="w-full border border-gray-300 rounded-none px-3 py-2 text-[13px] text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium" 
               />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
             <input 
               type="text" 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && applyFilters(e)}
               placeholder="Search by recipient, subject or message..." 
               className="flex-1 w-full border border-gray-300 rounded-none px-3 py-2 text-[14px] text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 placeholder-gray-400" 
             />
             <button type="button" onClick={applyFilters} className="flex items-center justify-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2 rounded-none text-[14px] font-bold transition-colors shadow-sm shrink-0 whitespace-nowrap min-w-[200px]">
               <Filter className="w-4 h-4" /> Apply Filters
             </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto pb-4 mt-2">
        <table className="w-full text-sm border-collapse border border-slate-300 shadow-sm bg-white">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-300">
              <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">Date & Time</th>
              <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">School</th>
              <th className="text-center px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">Channel</th>
              <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">Recipient</th>
              <th className="text-center px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">Status</th>
              <th className="text-left px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200">Subject / Reason</th>
              <th className="text-center px-3 py-2.5 text-[12px] font-bold text-slate-700 tracking-wide border-x border-slate-200 w-16">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredComms.map((comm) => (
              <tr key={comm.id} className="hover:bg-slate-50 transition-colors bg-white group border-b border-slate-200">
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 whitespace-nowrap">
                  <span className="text-[12px] text-slate-600 font-medium">{comm.date}</span>
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200">
                  <span className="text-[12px] text-blue-600 font-bold hover:underline cursor-pointer leading-tight block">{comm.school}</span>
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 text-center whitespace-nowrap">
                  <span className="bg-[#06b6d4] text-white px-2 py-0.5 rounded-none text-[10px] font-bold whitespace-nowrap uppercase tracking-widest inline-block">
                    {comm.channel}
                  </span>
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 min-w-[150px]">
                  <span className="text-[12px] text-[#f97316] font-bold font-mono block break-all">
                    {comm.recipient}
                  </span>
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 text-center whitespace-nowrap">
                  <span className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-2 py-0.5 rounded-none text-[10px] font-bold whitespace-nowrap tracking-wider inline-block uppercase">
                    {comm.status}
                  </span>
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 min-w-[150px] bg-slate-50/30">
                  <span className="text-[12px] text-slate-600 font-medium leading-snug block">
                    {comm.subject}
                  </span>
                </td>
                
                <td className="px-3 py-2.5 align-middle border-x border-slate-200 text-center">
                  <button 
                    onClick={() => setViewLog(comm)} 
                    className="p-1 border border-slate-300 rounded-none text-slate-500 mx-auto hover:bg-slate-200 shadow-sm bg-slate-100 transition-colors cursor-pointer block"
                  >
                    <Eye className="w-3.5 h-3.5 pointer-events-none" />
                  </button>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* View Log Modal */}
      {viewLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-none shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-[#f8fafc]">
              <h3 className="font-bold text-slate-800">Communication Details</h3>
              <button onClick={() => setViewLog(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-[13px]">
              <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-gray-500">Date:</div>
                <div className="col-span-2 text-slate-800">{viewLog.date}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-gray-500">School:</div>
                <div className="col-span-2 text-slate-800 font-medium">{viewLog.school}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-gray-500">Channel:</div>
                <div className="col-span-2"><span className="bg-[#06b6d4] text-white px-2 py-0.5 rounded-none text-[10px] font-bold shadow-sm whitespace-nowrap uppercase tracking-wider">{viewLog.channel}</span></div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-gray-500">Recipient:</div>
                <div className="col-span-2 text-[#f97316] font-medium">{viewLog.recipient}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-gray-500">Status:</div>
                <div className="col-span-2"><span className="bg-[#22c55e] text-white px-2 py-0.5 rounded-none text-[11px] font-bold shadow-sm whitespace-nowrap">{viewLog.status}</span></div>
              </div>
              <div className="pt-2 border-t border-gray-100">
                 <div className="font-semibold text-gray-500 mb-1">Message Subject / Content:</div>
                 <div className="p-3 bg-gray-50 rounded-none border border-gray-100 text-gray-700 italic">
                   {viewLog.subject}
                 </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
               <button onClick={() => setViewLog(null)} className="px-4 py-2 bg-white border border-gray-300 rounded-none text-[13px] font-bold text-gray-600 hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

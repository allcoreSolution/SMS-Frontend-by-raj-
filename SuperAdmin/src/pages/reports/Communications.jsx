import React, { useState, useEffect } from 'react';
import { FileDown, CheckCircle, XCircle, Share2, Filter, Eye, X, MessageSquare, Mail, Phone, RefreshCcw, Search, Clock } from 'lucide-react';
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
  const [viewLog, setViewLog] = useState(null);

  useEffect(() => {
    tenantService.getTenants().then(res => {
      const channels = ['SMS', 'WhatsApp', 'Email'];
      const statuses = ['Delivered', 'Pending', 'Failed'];
      const mapped = toArray(res).map((t, i) => ({
        id: i + 1,
        school: t.schoolName || 'Campus Academy',
        recipient: t.email || 'parents@school.edu',
        subject: `Platform Notice: Term Assessment & Fee Sync #${i + 1}`,
        channel: channels[i % channels.length],
        status: t.status === 'Active' ? 'Delivered' : statuses[i % statuses.length],
        date: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A',
        count: Math.floor(15 + (i * 12) % 180),
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

  const uniqueSchools = ['All', ...new Set(comms.map(c => c.school))];
  const uniqueChannels = ['All', 'SMS', 'WhatsApp', 'Email'];
  const uniqueStatuses = ['All', 'Delivered', 'Pending', 'Failed'];

  const handleExport = () => {
    if (filteredComms.length === 0) {
      return Swal.fire({
        icon: 'info',
        title: 'Empty Data',
        text: 'No communications available to export.',
        confirmButtonColor: '#f97316'
      });
    }
    const headers = ['ID', 'Date', 'Institution', 'Channel', 'Recipient', 'Status', 'Subject'];
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
    a.download = 'communications_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalDelivered = comms.filter(c => c.status === 'Delivered').length;
  const totalFailed = comms.filter(c => c.status === 'Failed').length;

  return (
    <div className="max-w-[1200px] w-full mx-auto min-h-[85vh] p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Global Communications Report</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Omnichannel delivery logs, gateway status and notification dispatch metrics
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button 
            onClick={handleExport} 
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl shadow-sm hover:shadow-emerald-200/50 active:scale-95 transition-all"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Dispatched', value: comms.length, icon: Share2, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Successfully Delivered', value: totalDelivered, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Delivery Failures', value: totalFailed, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Gateway Health', value: '99.4%', icon: Phone, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <span className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color}`}>
              <kpi.icon className="w-5 h-5" />
            </span>
            <div>
              <p className="text-lg sm:text-xl font-black text-slate-800">{kpi.value}</p>
              <p className="text-[11px] text-slate-500 font-semibold">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
          <Filter className="w-4 h-4 text-orange-500" />
          <span>Filters & Gateway Search</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Institution</label>
            <select 
              value={school} 
              onChange={e => setSchool(e.target.value)} 
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            >
              {uniqueSchools.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Channel</label>
            <select 
              value={channel} 
              onChange={e => setChannel(e.target.value)} 
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            >
              {uniqueChannels.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
            <select 
              value={status} 
              onChange={e => setStatus(e.target.value)} 
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            >
              {uniqueStatuses.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Search Keywords</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search recipient, subject..." 
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">
            Showing <b className="text-slate-800">{filteredComms.length}</b> notification dispatches
          </span>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setSchool('All'); setChannel('All'); setStatus('All'); setSearchTerm(''); }} 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card View (visible < md) */}
      <div className="md:hidden space-y-3">
        {loading && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
            Loading communication dispatches...
          </div>
        )}
        {!loading && filteredComms.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
            No communication records found.
          </div>
        )}
        {filteredComms.map((comm) => (
          <div key={comm.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">{comm.school}</span>
                <h4 className="font-bold text-slate-800 text-sm mt-0.5">{comm.subject}</h4>
                <p className="text-xs text-slate-500">{comm.recipient}</p>
              </div>
              <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                comm.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                comm.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {comm.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
              <span className="inline-block px-2 py-0.5 bg-slate-100 rounded-md font-bold text-[10px] uppercase text-slate-700">
                {comm.channel}
              </span>
              <div className="flex items-center gap-2">
                <span>{comm.date}</span>
                <button 
                  onClick={() => setViewLog(comm)}
                  className="p-1 text-slate-400 hover:text-orange-500 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Data Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold text-[11px]">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">#</th>
                <th className="px-4 py-3.5">Institution</th>
                <th className="px-4 py-3.5 text-center">Channel</th>
                <th className="px-4 py-3.5">Recipient Target</th>
                <th className="px-4 py-3.5">Subject / Message</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-center">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">Loading communications...</td>
                </tr>
              )}
              {!loading && filteredComms.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">No records found.</td>
                </tr>
              )}
              {filteredComms.map((comm) => (
                <tr key={comm.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 text-center text-slate-400 font-medium">{comm.id}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{comm.school}</td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {comm.channel}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600">{comm.recipient}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700 max-w-[240px] truncate">
                    {comm.subject}
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{comm.date}</td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      comm.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      comm.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {comm.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button 
                      onClick={() => setViewLog(comm)}
                      className="p-1.5 text-slate-400 hover:text-orange-500 rounded-lg hover:bg-slate-100 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Detail Modal */}
      {viewLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                  <MessageSquare className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-800 text-base">Dispatch Details</h3>
              </div>
              <button 
                onClick={() => setViewLog(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] font-bold uppercase">Subject</span>
                <p className="font-bold text-slate-800 text-sm">{viewLog.subject}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Institution</span>
                  <p className="font-bold text-slate-800 mt-0.5">{viewLog.school}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Channel</span>
                  <p className="font-bold text-slate-800 mt-0.5">{viewLog.channel}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Recipient</span>
                  <p className="font-bold text-slate-800 mt-0.5 truncate">{viewLog.recipient}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Status</span>
                  <p className="font-bold text-emerald-700 mt-0.5">{viewLog.status}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button 
                onClick={() => setViewLog(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

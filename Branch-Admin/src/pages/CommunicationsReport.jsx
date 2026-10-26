import React, { useEffect, useState } from 'react';
import { 
  Send, MessageSquare, AlertCircle, CheckCircle2, ChevronDown, 
  Download, Eye, Filter, RotateCcw, Search, X, Mail, PhoneCall 
} from 'lucide-react';
import Swal from 'sweetalert2';
import branchLocalDb from '../api/branchLocalDb';
import KpiCard from '../components/common/KpiCard';

const CommunicationsReport = () => {
  const [branches, setBranches] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('All');
  const [selectedChannel, setSelectedChannel] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingMessage, setViewingMessage] = useState(null);

  // Communications dataset
  const [messages, setMessages] = useState([
    {
      id: 'MSG-9801',
      date: '12 Oct, 2026 10:45 AM',
      school: 'Yug International School',
      channel: 'WHATSAPP',
      recipient: '+91 98765 12345 (Mr. Rakesh Sharma)',
      status: 'DELIVERED',
      reason: 'Term 1 Report Card Published Notification',
      payload: 'Dear Parent, Term 1 report card for Aarav Sharma (Class X-A) is now published. Please download from the parent portal.'
    },
    {
      id: 'MSG-9802',
      date: '12 Oct, 2026 09:30 AM',
      school: 'SSVP 3.0 Central Academy',
      channel: 'SMS',
      recipient: '+91 98111 54321 (Mrs. Kavita Singh)',
      status: 'DELIVERED',
      reason: 'Fee Due Reminder: ₹5,000 for October',
      payload: 'SSVP Alert: Monthly tuition fee for Rahul Singh is due on 15 Oct. Pay online at ssvp.schoolerp.com.'
    },
    {
      id: 'MSG-9803',
      date: '11 Oct, 2026 04:15 PM',
      school: 'Risma High School',
      channel: 'EMAIL',
      recipient: 'parents@rismahigh.org (Broadcast: 540 recipients)',
      status: 'DELIVERED',
      reason: 'Annual Sports Day Circular & Consent Form',
      payload: 'Dear Parents, Risma High School cordially invites you to the Annual Athletic Meet 2026. Please return signed consent forms.'
    },
    {
      id: 'MSG-9804',
      date: '11 Oct, 2026 02:00 PM',
      school: 'Cloudwave International School',
      channel: 'FCM PUSH',
      recipient: 'App Token: user_device_cw_8921',
      status: 'DELIVERED',
      reason: 'Emergency Bus Route Delay (Route 4)',
      payload: 'Bus #4 is running 15 minutes behind schedule due to highway maintenance. Live GPS tracking is active.'
    },
    {
      id: 'MSG-9805',
      date: '10 Oct, 2026 11:20 AM',
      school: 'Aksya World School',
      channel: 'SMS',
      recipient: '+91 98234 56789',
      status: 'FAILED',
      reason: 'Attendance Alert: Absent without leave',
      payload: 'Student was marked absent in Period 1 today without prior notification.'
    }
  ]);

  useEffect(() => {
    try {
      const brs = branchLocalDb.getBranches();
      setBranches(brs);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const filtered = messages.filter(m => {
    if (selectedSchool !== 'All' && !m.school.toLowerCase().includes(selectedSchool.toLowerCase())) return false;
    if (selectedChannel !== 'All' && m.channel !== selectedChannel) return false;
    if (selectedStatus !== 'All' && m.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const match = m.recipient.toLowerCase().includes(q) ||
        m.reason.toLowerCase().includes(q) ||
        m.payload.toLowerCase().includes(q) ||
        m.school.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleExportCsv = () => {
    const headers = [
      { key: 'id', label: 'Message ID' },
      { key: 'date', label: 'Timestamp' },
      { key: 'school', label: 'School' },
      { key: 'channel', label: 'Channel' },
      { key: 'recipient', label: 'Recipient' },
      { key: 'status', label: 'Delivery Status' },
      { key: 'reason', label: 'Subject / Trigger' }
    ];
    const ok = branchLocalDb.exportToCsv('communications_dispatch_audit', headers, filtered);
    if (ok) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Communication logs exported to CSV!',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleReset = () => {
    setSelectedSchool('All');
    setSelectedChannel('All');
    setSelectedStatus('All');
    setSearchQuery('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-[#f4f7fa] min-h-[calc(100vh-70px)]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            <Send className="w-4 h-4" /> Multi-Channel Gateway Telemetry
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Communications &amp; Messaging Audit
            <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-bold">
              {filtered.length} Dispatches
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Audit SMS, WhatsApp API, Push Notifications and Email delivery across all branch portals.
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

      {/* KPI Stats Bar - Standardized h-[110px] */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard 
          title="Total Dispatched"
          value="1,746"
          subText="98.4% Delivered successfully"
          isLive={true}
          icon={Send}
          glowColor="#3b82f6"
          stroke="#3b82f6"
          iconBg="linear-gradient(135deg, #60a5fa, #3b82f6)"
          iconColor="#ffffff"
          spark={[120, 150, 180, 220, 260, 280, 310]}
          badge="98.4% Sent"
        />
        <KpiCard 
          title="WhatsApp & SMS"
          value="1,024"
          subText="Direct parent instant alerts"
          icon={MessageSquare}
          glowColor="#10b981"
          stroke="#10b981"
          iconBg="linear-gradient(135deg, #34d399, #10b981)"
          iconColor="#ffffff"
          spark={[80, 100, 130, 160, 190, 210, 240]}
          badge="High Priority"
        />
        <KpiCard 
          title="Email Broadcasts"
          value="540"
          subText="Circulars, fees & notices"
          icon={Mail}
          glowColor="#8b5cf6"
          stroke="#8b5cf6"
          iconBg="linear-gradient(135deg, #a78bfa, #8b5cf6)"
          iconColor="#ffffff"
          spark={[30, 45, 60, 75, 90, 100, 110]}
          badge="SMTP Verified"
        />
        <KpiCard 
          title="Failed / Undelivered"
          value="18"
          subText="Invalid numbers or DND flags"
          icon={AlertCircle}
          glowColor="#ef4444"
          stroke="#ef4444"
          iconBg="linear-gradient(135deg, #f87171, #ef4444)"
          iconColor="#ffffff"
          spark={[4, 5, 2, 3, 1, 2, 1]}
          badge="1.0% Rate"
        />
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="text-sm font-bold text-gray-800 uppercase tracking-tight flex items-center gap-2">
            <Filter className="w-4 h-4 text-orange-600" /> Dispatch Audit Filters
          </div>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">School</label>
              <div className="relative">
                <select 
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="All">All Campuses</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-[11px] text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Channel</label>
              <div className="relative">
                <select 
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="All">All Channels</option>
                  <option value="WHATSAPP">WhatsApp API</option>
                  <option value="SMS">SMS Gateway</option>
                  <option value="EMAIL">SMTP Email</option>
                  <option value="FCM PUSH">FCM Push Notification</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-[11px] text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
              <div className="relative">
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="All">All Delivery Statuses</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="FAILED">Failed</option>
                  <option value="QUEUED">Queued</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-[11px] text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
             <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipient phone, name, circular reason, or message body..." 
                className="flex-grow px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
             />
             <button 
               onClick={handleReset}
               className="flex items-center justify-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shrink-0"
             >
               <RotateCcw className="w-3.5 h-3.5" /> Reset
             </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0b1329] text-white">
              <tr className="text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-3.5">Timestamp</th>
                <th className="py-3 px-3.5">Target Campus</th>
                <th className="py-3 px-3.5 text-center">Channel</th>
                <th className="py-3 px-3.5">Recipient Details</th>
                <th className="py-3 px-3.5 text-center">Delivery Status</th>
                <th className="py-3 px-3.5">Notification Trigger</th>
                <th className="py-3 px-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[13px]">
              {filtered.map((row, i) => (
                <tr key={i} className="hover:bg-blue-50/20 transition-colors">
                  <td className="py-3.5 px-3.5 text-gray-600 text-xs whitespace-nowrap">{row.date}</td>
                  
                  <td className="py-3.5 px-3.5 font-bold text-gray-900 text-xs">
                    {row.school}
                  </td>

                  <td className="py-3.5 px-3.5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                      row.channel === 'WHATSAPP' ? 'bg-emerald-100 text-emerald-800' :
                      row.channel === 'SMS' ? 'bg-blue-100 text-blue-800' :
                      row.channel === 'EMAIL' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {row.channel}
                    </span>
                  </td>

                  <td className="py-3.5 px-3.5 text-gray-800 text-xs font-medium">
                    {row.recipient}
                  </td>

                  <td className="py-3.5 px-3.5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      row.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {row.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-3.5 text-gray-700 text-xs">
                    {row.reason}
                  </td>

                  <td className="py-3.5 px-3.5 text-center">
                    <button 
                      onClick={() => setViewingMessage(row)}
                      title="Inspect Dispatch Payload"
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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

      {/* ================= MESSAGE DETAIL MODAL ================= */}
      {viewingMessage && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in fade-in duration-200">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                <h3 className="text-sm font-bold tracking-wide">MESSAGE DISPATCH TELEMETRY</h3>
              </div>
              <button 
                onClick={() => setViewingMessage(null)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-400 font-bold uppercase">Campus</span>
                <span className="font-bold text-gray-900">{viewingMessage.school}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-400 font-bold uppercase">Channel &amp; Status</span>
                <div className="flex gap-2">
                  <span className="font-bold text-blue-600">{viewingMessage.channel}</span>
                  <span className="font-bold text-emerald-600">{viewingMessage.status}</span>
                </div>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-400 font-bold uppercase">Recipient</span>
                <span className="font-mono text-gray-800">{viewingMessage.recipient}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-400 font-bold uppercase">Timestamp</span>
                <span className="text-gray-700">{viewingMessage.date}</span>
              </div>

              <div>
                <span className="block text-gray-400 font-bold uppercase mb-1">Message Payload Content</span>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 text-gray-800 leading-relaxed font-sans">
                  {viewingMessage.payload}
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingMessage(null)}
                className="px-4 py-1.5 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationsReport;

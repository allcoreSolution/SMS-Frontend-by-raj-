import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, Layers, Plus, Mail, MessageSquare, Phone, 
  Bell, Search, RefreshCw, Trash2, Eye, 
  CheckCircle2, Clock, Users, ArrowUpRight, Filter
} from 'lucide-react';
import Swal from 'sweetalert2';
import { communicateService } from '../api/communicateService';

export default function BroadcastHistory() {
  const navigate = useNavigate();
  const [broadcasts, setBroadcasts] = useState([]);
  const [stats, setStats] = useState({ totalBroadcasts: 0, totalMessagesSent: 0, totalDelivered: 0, deliveryRate: '98%' });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('All');
  const [selectedBroadcastModal, setSelectedBroadcastModal] = useState(null);

  useEffect(() => {
    fetchHistoryAndStats();
  }, []);

  const fetchHistoryAndStats = async () => {
    try {
      setLoading(true);
      const [listRes, statsRes] = await Promise.all([
        communicateService.getBroadcasts(),
        communicateService.getBroadcastStats()
      ]);

      if (listRes.success) setBroadcasts(listRes.data || []);
      if (statsRes.success) setStats(statsRes.data || {});
    } catch (err) {
      console.error('Error fetching broadcast history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, subject) => {
    const result = await Swal.fire({
      title: 'Delete Broadcast Record?',
      text: `Remove record "${subject}" from historical logs?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete'
    });

    if (result.isConfirmed) {
      try {
        await communicateService.deleteBroadcast(id);
        setBroadcasts(prev => prev.filter(b => b._id !== id));
        Swal.fire('Deleted!', 'Record removed from history.', 'success');
        communicateService.getBroadcastStats().then(r => r.success && setStats(r.data));
      } catch (err) {
        Swal.fire('Error', 'Failed to delete record.', 'error');
      }
    }
  };

  const handleResend = async (broadcast) => {
    const result = await Swal.fire({
      title: 'Resend Broadcast?',
      text: `Re-dispatch "${broadcast.subject}" to ${broadcast.totalRecipients} recipients?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#5542f6',
      confirmButtonText: 'Yes, Send Now'
    });

    if (result.isConfirmed) {
      try {
        const res = await communicateService.sendBroadcast({
          subject: broadcast.subject,
          message: broadcast.message,
          channels: broadcast.channels,
          targetAudience: broadcast.targetAudience,
          targetClass: broadcast.targetClass,
          targetClassName: broadcast.targetClassName
        });
        Swal.fire('Dispatched!', res.message, 'success');
        fetchHistoryAndStats();
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  };

  const filteredBroadcasts = useMemo(() => {
    return broadcasts.filter(b => {
      const matchesSearch = (b.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (b.message || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (b.broadcastId || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesChannel = selectedChannel === 'All' || (b.channels && b.channels.includes(selectedChannel));
      return matchesSearch && matchesChannel;
    });
  }, [broadcasts, searchQuery, selectedChannel]);

  const renderChannelIcons = (channels = []) => {
    return (
      <div className="flex items-center space-x-1.5">
        {channels.includes('WhatsApp') && (
          <span className="p-1 rounded bg-emerald-50 text-emerald-600" title="WhatsApp">
            <Phone className="w-3.5 h-3.5" />
          </span>
        )}
        {channels.includes('SMS') && (
          <span className="p-1 rounded bg-blue-50 text-blue-600" title="SMS">
            <MessageSquare className="w-3.5 h-3.5" />
          </span>
        )}
        {channels.includes('Email') && (
          <span className="p-1 rounded bg-indigo-50 text-indigo-600" title="Email">
            <Mail className="w-3.5 h-3.5" />
          </span>
        )}
        {channels.includes('Push Notification') && (
          <span className="p-1 rounded bg-amber-50 text-amber-600" title="Push App">
            <Bell className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-[#f4f7fc] min-h-[calc(100vh-64px)] font-sans flex flex-col">
      
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Broadcast Delivery Audit</h1>
            <span className="bg-indigo-50 text-[#5542f6] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-indigo-100">
              Live Audit Log
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Complete transmission log of all alerts, SMS, WhatsApp dispatches, and open rates.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchHistoryAndStats}
            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 shadow-sm"
            title="Refresh History"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => navigate('/communicate/compose-broadcast')}
            className="flex items-center px-4 py-2 bg-[#5542f6] text-white rounded-lg text-xs font-bold hover:bg-[#4533e4] transition-all shadow-md shadow-indigo-100"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Compose New Broadcast
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Broadcasts</p>
            <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">{stats.totalBroadcasts || broadcasts.length}</h3>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-[#5542f6] flex items-center justify-center">
            <Send className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Messages Sent</p>
            <h3 className="text-xl font-extrabold text-blue-600 mt-0.5">{stats.totalMessagesSent || 0}</h3>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Delivered</p>
            <h3 className="text-xl font-extrabold text-emerald-600 mt-0.5">{stats.totalDelivered || 0}</h3>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Delivery Rate</p>
            <h3 className="text-xl font-extrabold text-purple-600 mt-0.5">{stats.deliveryRate || '98%'}</h3>
          </div>
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID, subject, text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#5542f6]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select 
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-white"
            >
              <option value="All">All Channels</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="SMS">SMS</option>
              <option value="Email">Email</option>
              <option value="Push Notification">Push App</option>
            </select>
          </div>
        </div>

        <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
          Logs: {filteredBroadcasts.length}
        </span>
      </div>

      {/* Broadcasts Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center text-gray-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#5542f6]" />
          <p className="text-xs font-medium">Loading transmission records...</p>
        </div>
      ) : filteredBroadcasts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center text-gray-400">
          <Send className="w-10 h-10 mx-auto mb-2 text-gray-300 -rotate-45" />
          <h3 className="font-bold text-sm text-gray-700">No Broadcast Records</h3>
          <p className="text-xs text-gray-400 mt-1">Compose and dispatch your first broadcast message to see delivery analytics here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase">
              <tr>
                <th className="p-3">Broadcast ID</th>
                <th className="p-3">Dispatched At</th>
                <th className="p-3">Subject & Content</th>
                <th className="p-3">Channels</th>
                <th className="p-3">Target</th>
                <th className="p-3 text-center">Analytics (S / D / O)</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBroadcasts.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#5542f6]">{b.broadcastId}</td>
                  <td className="p-3 text-gray-600 font-medium whitespace-nowrap">
                    {b.sentAt ? new Date(b.sentAt).toLocaleDateString('en-GB') : '-'}
                    <div className="text-[10px] text-gray-400">
                      {b.sentAt ? new Date(b.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </div>
                  </td>
                  <td className="p-3 max-w-xs">
                    <div 
                      onClick={() => setSelectedBroadcastModal(b)}
                      className="font-extrabold text-gray-900 cursor-pointer hover:text-[#5542f6] transition-colors line-clamp-1"
                    >
                      {b.subject}
                    </div>
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{b.message}</p>
                  </td>
                  <td className="p-3">
                    {renderChannelIcons(b.channels)}
                  </td>
                  <td className="p-3">
                    <span className="bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 rounded text-[10px] whitespace-nowrap">
                      {b.targetAudience}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-mono text-[11px] font-bold text-gray-800">
                      {b.deliveryStats?.sent || b.totalRecipients || 0} / <span className="text-emerald-600">{b.deliveryStats?.delivered || 0}</span> / <span className="text-blue-600">{b.deliveryStats?.opened || 0}</span>
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center w-max">
                      <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> {b.status || 'Delivered'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => setSelectedBroadcastModal(b)}
                        className="p-1 text-gray-400 hover:text-[#5542f6]"
                        title="View Broadcast Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleResend(b)}
                        className="p-1 text-gray-400 hover:text-emerald-600"
                        title="Re-broadcast / Resend"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(b._id, b.subject)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ----------------- BROADCAST DETAILS MODAL ----------------- */}
      {selectedBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-[#5542f6]">{selectedBroadcastModal.broadcastId}</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {selectedBroadcastModal.status}
                </span>
              </div>
              <button 
                onClick={() => setSelectedBroadcastModal(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <h2 className="text-base font-extrabold text-gray-900 leading-snug">{selectedBroadcastModal.subject}</h2>
              <div className="flex items-center space-x-4 text-[11px] text-gray-400 mt-1">
                <span>Target: <b>{selectedBroadcastModal.targetAudience}</b></span>
                <span>Sent: <b>{new Date(selectedBroadcastModal.sentAt).toLocaleString()}</b></span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-700 whitespace-pre-wrap leading-relaxed max-h-[220px] overflow-y-auto">
              {selectedBroadcastModal.message}
            </div>

            {/* Analytics Breakdown */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                <p className="text-[10px] text-gray-400">Total Sent</p>
                <p className="font-bold text-gray-900 mt-0.5">{selectedBroadcastModal.deliveryStats?.sent || 0}</p>
              </div>
              <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                <p className="text-[10px] text-emerald-600">Delivered</p>
                <p className="font-bold text-emerald-700 mt-0.5">{selectedBroadcastModal.deliveryStats?.delivered || 0}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
                <p className="text-[10px] text-blue-600">Opened / Read</p>
                <p className="font-bold text-blue-700 mt-0.5">{selectedBroadcastModal.deliveryStats?.opened || 0}</p>
              </div>
              <div className="bg-rose-50 p-2 rounded-lg border border-rose-100">
                <p className="text-[10px] text-rose-600">Failed</p>
                <p className="font-bold text-rose-700 mt-0.5">{selectedBroadcastModal.deliveryStats?.failed || 0}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-xs">
              <span className="text-gray-400">Channels: {selectedBroadcastModal.channels?.join(', ')}</span>
              <button 
                onClick={() => setSelectedBroadcastModal(null)}
                className="px-4 py-2 bg-[#5542f6] text-white rounded-lg font-bold"
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

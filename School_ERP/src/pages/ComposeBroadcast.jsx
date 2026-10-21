import React, { useState, useEffect } from 'react';
import { 
  Send, Mail, MessageSquare, Phone, Bell,
  Users, CheckCircle2, AlertTriangle, Sparkles, 
  RefreshCw, Smartphone, Layers, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosInstance from '../api/axios';
import { communicateService } from '../api/communicateService';

export default function ComposeBroadcast() {
  const navigate = useNavigate();

  // Channels state
  const [selectedChannels, setSelectedChannels] = useState(['SMS', 'WhatsApp']);

  // Target & Class states
  const [targetAudience, setTargetAudience] = useState('All');
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedClassName, setSelectedClassName] = useState('All Classes');

  // Content states
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Recipient Estimates
  const [recipientStats, setRecipientStats] = useState({
    total: 19,
    studentsCount: 13,
    staffCount: 6,
    parentsCount: 13
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchEstimate();
  }, [targetAudience, selectedClassId]);

  const fetchClasses = async () => {
    try {
      const res = await axiosInstance.get('/academics/classes');
      if (res.data?.data) {
        setClasses(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  const fetchEstimate = async () => {
    try {
      const params = { targetAudience };
      if (selectedClassId) params.classId = selectedClassId;
      const res = await communicateService.getRecipientsEstimate(params);
      if (res.success) {
        setRecipientStats(res.data);
      }
    } catch (err) {
      console.error('Error fetching estimates:', err);
    }
  };

  const toggleChannel = (channel) => {
    setSelectedChannels(prev => {
      if (prev.includes(channel)) {
        if (prev.length === 1) {
          Swal.fire('At least one channel', 'Please keep at least one delivery channel selected.', 'info');
          return prev;
        }
        return prev.filter(c => c !== channel);
      } else {
        return [...prev, channel];
      }
    });
  };

  const insertVariable = (varName) => {
    setMessage(prev => prev + ` ${varName} `);
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!subject.trim()) {
      Swal.fire('Subject Required', 'Please enter a broadcast subject line.', 'warning');
      return;
    }
    if (!message.trim()) {
      Swal.fire('Message Required', 'Please type the broadcast message content.', 'warning');
      return;
    }

    try {
      setSending(true);
      const payload = {
        subject,
        message,
        channels: selectedChannels,
        targetAudience: targetAudience === 'All' ? 'All (Entire School)' : targetAudience,
        targetClass: selectedClassId || undefined,
        targetClassName: selectedClassName
      };

      const res = await communicateService.sendBroadcast(payload);

      if (res.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Broadcast Dispatched!',
          html: `<p class="text-sm">${res.message}</p><p class="text-xs text-gray-500 mt-2 font-mono">Reference: ${res.data.broadcastId}</p>`,
          confirmButtonColor: '#5542f6',
          confirmButtonText: 'View Broadcast History'
        });
        navigate('/communicate/broadcast-history');
      }
    } catch (err) {
      Swal.fire('Dispatch Error', err.response?.data?.message || err.message, 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 bg-[#f4f7fc] min-h-[calc(100vh-64px)] font-sans">
      
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Multi-Channel Broadcast Composer</h1>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center">
              <Sparkles className="w-3 h-3 mr-1 text-emerald-600" /> Gateway Connected
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Dispatch announcements simultaneously across SMS, WhatsApp Cloud, Email, and Push Notifications.
          </p>
        </div>

        <button 
          onClick={() => navigate('/communicate/broadcast-history')}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 shadow-sm"
        >
          <Layers className="w-3.5 h-3.5 mr-1.5 text-[#5542f6]" />
          View Broadcast History
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Compose Form (Left 8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSendBroadcast} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
            
            {/* Target Delivery Channels */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Select Delivery Channels <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                {/* Email */}
                <div 
                  onClick={() => toggleChannel('Email')}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedChannels.includes('Email')
                      ? 'border-[#5542f6] bg-indigo-50/40 text-[#5542f6]'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-bold">Email</span>
                  </div>
                  {selectedChannels.includes('Email') && <span className="text-xs font-extrabold">✓</span>}
                </div>

                {/* SMS */}
                <div 
                  onClick={() => toggleChannel('SMS')}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedChannels.includes('SMS')
                      ? 'border-[#5542f6] bg-indigo-50/40 text-[#5542f6]'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs font-bold">SMS</span>
                  </div>
                  {selectedChannels.includes('SMS') && <span className="text-xs font-extrabold">✓</span>}
                </div>

                {/* WhatsApp */}
                <div 
                  onClick={() => toggleChannel('WhatsApp')}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedChannels.includes('WhatsApp')
                      ? 'border-emerald-500 bg-emerald-50/40 text-emerald-700'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold">WhatsApp</span>
                  </div>
                  {selectedChannels.includes('WhatsApp') && <span className="text-xs font-extrabold text-emerald-600">✓</span>}
                </div>

                {/* Push Notification */}
                <div 
                  onClick={() => toggleChannel('Push Notification')}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedChannels.includes('Push Notification')
                      ? 'border-[#5542f6] bg-indigo-50/40 text-[#5542f6]'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4" />
                    <span className="text-xs font-bold">Push App</span>
                  </div>
                  {selectedChannels.includes('Push Notification') && <span className="text-xs font-extrabold">✓</span>}
                </div>

              </div>
            </div>

            {/* Target Audience Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Target Group</label>
                <select 
                  value={targetAudience}
                  onChange={(e) => {
                    setTargetAudience(e.target.value);
                    if (e.target.value !== 'Class') {
                      setSelectedClassId('');
                      setSelectedClassName('All Classes');
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-semibold outline-none bg-white focus:border-[#5542f6]"
                >
                  <option value="All">All (Parents, Students & Staff)</option>
                  <option value="All Parents">All Parents Only</option>
                  <option value="All Staff">Faculty & Staff Only</option>
                  <option value="Class">Specific Class</option>
                </select>
              </div>

              {targetAudience === 'Class' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Select Academic Class</label>
                  <select 
                    value={selectedClassId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedClassId(id);
                      const cls = classes.find(c => c._id === id);
                      setSelectedClassName(cls ? cls.className : 'All Classes');
                    }}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs font-semibold outline-none bg-white focus:border-[#5542f6]"
                  >
                    <option value="">-- Choose Class --</option>
                    {classes.map(c => (
                      <option key={c._id} value={c._id}>{c.className}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Broadcast Subject / Heading <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="e.g., Heavy Rain Advisory: Early Dispersal Today"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#5542f6]"
                required
              />
            </div>

            {/* Message Body & Variable Tags */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700">
                  Message Body <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] text-gray-400 font-semibold">Insert variables:</span>
                  <button 
                    type="button" 
                    onClick={() => insertVariable('{{student_name}}')}
                    className="text-[10px] bg-indigo-50 text-[#5542f6] px-1.5 py-0.5 rounded font-mono font-bold hover:bg-indigo-100"
                  >
                    + student_name
                  </button>
                  <button 
                    type="button" 
                    onClick={() => insertVariable('{{parent_name}}')}
                    className="text-[10px] bg-indigo-50 text-[#5542f6] px-1.5 py-0.5 rounded font-mono font-bold hover:bg-indigo-100"
                  >
                    + parent_name
                  </button>
                  <button 
                    type="button" 
                    onClick={() => insertVariable('{{school_name}}')}
                    className="text-[10px] bg-indigo-50 text-[#5542f6] px-1.5 py-0.5 rounded font-mono font-bold hover:bg-indigo-100"
                  >
                    + school_name
                  </button>
                </div>
              </div>

              <textarea 
                rows={6}
                placeholder="Type your message here. Keep text concise for SMS delivery..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-xs outline-none focus:border-[#5542f6] resize-none"
                required
              />

              <div className="flex justify-between items-center text-[10px] text-gray-400 mt-1">
                <span>{message.length} characters ({Math.ceil(message.length / 160)} SMS units)</span>
                <span>Supports Unicode & Hindi characters</span>
              </div>
            </div>

            {/* Send Button */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Audience: <b>{recipientStats.total} total contacts</b>
              </span>
              <button 
                type="submit"
                disabled={sending}
                className="px-6 py-2.5 bg-[#5542f6] hover:bg-[#4533e4] text-white rounded-lg text-xs font-bold flex items-center shadow-md shadow-indigo-100 transition-all disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Dispatching...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" /> Send Broadcast Now
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Audience Estimates & Live Mobile Preview (Right 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Recipient Audience Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-[#5542f6]" />
                <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide">Recipient Estimation</h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Active Database
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                <p className="text-[10px] font-bold text-gray-500 uppercase">Total Contacts</p>
                <h4 className="text-xl font-extrabold text-[#5542f6] mt-0.5">{recipientStats.total}</h4>
              </div>

              <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                <p className="text-[10px] font-bold text-gray-500 uppercase">Parents & Students</p>
                <h4 className="text-xl font-extrabold text-emerald-600 mt-0.5">{recipientStats.parentsCount}</h4>
              </div>
            </div>

            <p className="text-[11px] text-gray-400">
              Numbers are queried directly from the verified admission database and staff directory.
            </p>
          </div>

          {/* Live Mobile Device Mockup */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col items-center">
            <div className="w-full flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
              <span className="text-xs font-bold text-gray-800 flex items-center">
                <Smartphone className="w-4 h-4 mr-1 text-gray-500" /> WhatsApp / SMS Preview
              </span>
              <span className="text-[10px] text-gray-400">Live Device Render</span>
            </div>

            {/* Phone Screen Mockup */}
            <div className="w-[260px] bg-slate-900 rounded-[28px] p-2.5 shadow-xl border-4 border-slate-700 text-white">
              <div className="w-20 h-3 bg-slate-800 rounded-full mx-auto mb-2"></div>
              
              <div className="bg-[#0b141a] rounded-[20px] p-3 min-h-[300px] flex flex-col text-[11px] text-gray-100">
                {/* Chat Header */}
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-800">
                  <div className="w-7 h-7 rounded-full bg-[#5542f6] flex items-center justify-center font-bold text-white text-[10px]">
                    G
                  </div>
                  <div>
                    <div className="font-bold text-[11px] text-white">Greenwood International</div>
                    <div className="text-[8px] text-emerald-400 font-semibold">Official WhatsApp Broadcast</div>
                  </div>
                </div>

                {/* Message Bubble */}
                <div className="mt-3 bg-[#005c4b] p-3 rounded-xl rounded-tl-none text-[10.5px] leading-relaxed shadow space-y-1">
                  <div className="font-extrabold text-white text-[11px] border-b border-white/20 pb-0.5">
                    {subject || 'Announcement Subject Line'}
                  </div>
                  <p className="text-gray-100 whitespace-pre-wrap">
                    {message || 'Your message will appear here in real-time as you compose it.'}
                  </p>
                  <div className="text-right text-[8px] text-emerald-200 mt-1">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

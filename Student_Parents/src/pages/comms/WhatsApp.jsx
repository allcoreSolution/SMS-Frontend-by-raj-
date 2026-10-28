import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageSquare, Send, CheckCheck, Check, Phone, 
  ExternalLink, ShieldCheck, User, Clock, Search, 
  RefreshCw, AlertCircle, Filter, Sparkles, Copy, 
  ChevronRight, Bell, Bus, BookOpen, Receipt, 
  Calendar, GraduationCap, Info, X, Share2, Printer,
  MessageCircle, Smartphone, CheckCircle2, HelpCircle
} from 'lucide-react';
import { parentService } from '../../api/parentService';
import Swal from 'sweetalert2';

export default function WhatsApp() {
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [parentPhone, setParentPhone] = useState('');
  const [studentInfo, setStudentInfo] = useState(null);
  const [stats, setStats] = useState({ total: 0, delivered: 0, read: 0, sent: 0 });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  // Modals & Active Selections
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Compose Form
  const [composeForm, setComposeForm] = useState({
    channel: 'class_teacher',
    category: 'General',
    message: '',
    inquiryType: 'General Inquiry'
  });
  const [sendingInquiry, setSendingInquiry] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [msgRes, settingsRes] = await Promise.all([
        parentService.getWhatsAppMessages(),
        parentService.getWhatsAppSettings()
      ]);

      if (msgRes?.success) {
        setMessages(msgRes.data || []);
        setParentPhone(msgRes.parentPhone || '');
        setStudentInfo(msgRes.studentInfo || null);
        if (msgRes.stats) {
          setStats(msgRes.stats);
        }
      }

      if (settingsRes?.success) {
        setSettings(settingsRes.data);
      }
    } catch (err) {
      console.error('Error fetching WhatsApp data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Normalize category names between backend formats
  const normalizeCategory = (cat) => {
    if (!cat) return 'General';
    const c = String(cat).toLowerCase();
    if (c.includes('fee')) return 'Fees';
    if (c.includes('attend')) return 'Attendance';
    if (c.includes('home')) return 'Homework';
    if (c.includes('ptm') || c.includes('meet')) return 'PTM';
    if (c.includes('exam') || c.includes('result') || c.includes('assess')) return 'Exams';
    if (c.includes('bus') || c.includes('transp')) return 'Transport';
    return 'General';
  };

  const getMessageText = (item) => item?.content || item?.message || '';
  const getMessageDate = (item) => item?.timestamp || item?.sentAt || item?.createdAt;

  // Filtered messages
  const filteredMessages = useMemo(() => {
    return messages.map(item => ({
      ...item,
      normalizedCategory: normalizeCategory(item.category),
      text: getMessageText(item),
      date: getMessageDate(item)
    })).filter(item => {
      // Category filter
      if (selectedCategory !== 'All' && item.normalizedCategory !== selectedCategory) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'All' && item.status !== selectedStatus) {
        return false;
      }
      // Priority filter
      if (selectedPriority !== 'All' && item.priority !== selectedPriority) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const msgMatch = item.text?.toLowerCase().includes(query);
        const catMatch = item.category?.toLowerCase().includes(query);
        const nameMatch = (item.recipientName || item.studentName || '').toLowerCase().includes(query);
        if (!msgMatch && !catMatch && !nameMatch) return false;
      }
      return true;
    });
  }, [messages, selectedCategory, selectedStatus, selectedPriority, searchQuery]);

  // Handle Send Inquiry
  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!composeForm.message.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Message',
        text: 'Please write a message before submitting.',
        confirmButtonColor: '#059669'
      });
      return;
    }

    try {
      setSendingInquiry(true);
      const res = await parentService.sendWhatsAppInquiry({
        category: composeForm.category,
        inquiryType: composeForm.inquiryType,
        message: composeForm.message,
        studentId: studentInfo?.id
      });

      if (res?.success) {
        setIsComposeOpen(false);
        setComposeForm({
          channel: 'class_teacher',
          category: 'General',
          message: '',
          inquiryType: 'General Inquiry'
        });

        // Trigger SweetAlert with direct link to launch WhatsApp
        Swal.fire({
          icon: 'success',
          title: 'Query Logged Successfully!',
          html: `
            <div class="text-left text-xs text-gray-600 mt-2 space-y-2">
              <p>Your query has been recorded on the School ERP WhatsApp Desk.</p>
              <p class="font-semibold text-gray-800">Would you like to open official WhatsApp now to send this directly to the school coordinator?</p>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: 'Open in WhatsApp 📱',
          cancelButtonText: 'Done',
          confirmButtonColor: '#25D366',
          cancelButtonColor: '#6B7280'
        }).then((result) => {
          if (result.isConfirmed && res.data?.waUrl) {
            window.open(res.data.waUrl, '_blank');
          }
        });

        // Refresh list
        fetchData();
      }
    } catch (err) {
      console.error('Error sending WhatsApp inquiry:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Send',
        text: err?.response?.data?.message || 'Something went wrong while sending your inquiry.',
        confirmButtonColor: '#DC2626'
      });
    } finally {
      setSendingInquiry(false);
    }
  };

  // Helper: Category styling & icon
  const getCategoryMeta = (cat) => {
    switch (cat) {
      case 'Fees':
        return { label: 'Fee Alert', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Receipt };
      case 'Attendance':
        return { label: 'Attendance', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock };
      case 'Homework':
        return { label: 'Homework', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: BookOpen };
      case 'PTM':
        return { label: 'PTM Notice', bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: Calendar };
      case 'Exams':
        return { label: 'Exam Results', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: GraduationCap };
      case 'Transport':
        return { label: 'Bus / Transport', bg: 'bg-orange-50 text-orange-700 border-orange-200', icon: Bus };
      default:
        return { label: cat || 'Official Notice', bg: 'bg-gray-100 text-gray-700 border-gray-200', icon: Bell };
    }
  };

  // Format message text with line breaks and highlighted bold text (*bold*)
  const renderFormattedMessage = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return (
      <div className="space-y-1 text-sm text-gray-800 leading-relaxed font-sans">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-2" />;
          
          // Simple parser for *bold* text
          const parts = line.split(/(\*[^*]+\*)/g);
          return (
            <p key={idx}>
              {parts.map((part, pIdx) => {
                if (part.startsWith('*') && part.endsWith('*')) {
                  return <strong key={pIdx} className="font-bold text-gray-950">{part.slice(1, -1)}</strong>;
                }
                return part;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] pb-24 font-sans p-3 sm:p-5 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Royal Blue Hero Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] rounded-3xl p-5 sm:p-7 text-white shadow-xl shadow-blue-900/15 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Official WhatsApp Desk &amp; Broadcasts
                </h1>
                <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 backdrop-blur-md">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" /> Meta Verified
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100 font-medium mt-1 max-w-2xl">
                Real-time official school dispatches, automated fee alerts, attendance notifications, and instant WhatsApp support channels.
              </p>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
            <button
              onClick={() => setIsComposeOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Compose Query</span>
            </button>
            
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open WhatsApp</span>
            </a>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              title="Refresh Dispatches"
              className="p-2.5 bg-white/15 hover:bg-white/25 text-white transition-all rounded-xl border border-white/25 backdrop-blur-md cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">

        {/* WhatsApp Verified Profile Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-xs p-5 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xl shadow-md relative shrink-0">
                <span>ACS</span>
                <span className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-black text-slate-900">
                    {settings?.businessName || 'All Core Solutions - Official WhatsApp Desk'}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black tracking-wide uppercase border border-emerald-200 rounded-full">
                    <ShieldCheck className="w-3 h-3" /> Meta Verified
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold border border-green-200 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Online &amp; Active
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1.5 flex items-center gap-4 flex-wrap font-medium">
                  <span className="flex items-center gap-1 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    School WA: <strong className="text-slate-900 font-bold">{settings?.schoolWhatsAppNumber || '+91 98765 43210'}</strong>
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Parent: <strong className="text-slate-800">{studentInfo?.fatherName || 'Rajesh Kumar Gupta'} ({parentPhone || '+91 98765 10000'})</strong>
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    Student: <strong className="text-slate-800">{studentInfo?.name || 'Aarav Sharma'} ({studentInfo?.className || 'Class I (A)'})</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0">
              <a
                href={settings?.schoolWaLink || 'https://wa.me/919876543210'}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto text-center px-4 py-2 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 transition-colors uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Open in WhatsApp Web</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 border border-slate-200/90 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Alerts Logged</p>
                <p className="text-2xl font-black text-slate-900 mt-1 leading-none">{stats.total || messages.length}</p>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Official dispatches to parent</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <Bell className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 border border-slate-200/90 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Delivered / Read</p>
                <p className="text-2xl font-black text-blue-600 mt-1 leading-none">{stats.read + stats.delivered || messages.length}</p>
                <div className="flex items-center gap-1 text-[11px] text-blue-600 font-bold mt-1">
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                  <span>100% Confirmation</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <CheckCheck className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 border border-slate-200/90 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Support Desks</p>
                <p className="text-2xl font-black text-purple-700 mt-1 leading-none">4 Active</p>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Teacher, Accounts, Bus</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <Phone className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 border border-slate-200/90 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">High Priority</p>
                <p className="text-2xl font-black text-amber-600 mt-1 leading-none">
                  {messages.filter(m => m.priority === 'High').length}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">Receipts, PTM, Results</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick School Support Channels Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              Direct WhatsApp Support Desks (1-Click Chat)
            </h3>
            <span className="text-xs text-gray-500">Instant response during school hours</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(settings?.supportChannels || [
              {
                id: 'class_teacher',
                name: 'Mrs. Anita Roy',
                role: 'Class Teacher (Class I-A)',
                phone: '+91 98765 43211',
                availability: '8:00 AM - 3:00 PM',
                waLink: 'https://wa.me/919876543211?text=Hello%20Mrs.%20Anita%20Roy,%20I%20am%20Rajesh%20Gupta,%20father%20of%20Aarav%20Sharma%20(Class%20I-A).'
              },
              {
                id: 'accounts',
                name: 'Accounts & Fee Desk',
                role: 'Fee Clearance & Invoices',
                phone: '+91 98765 43212',
                availability: '9:00 AM - 4:00 PM',
                waLink: 'https://wa.me/919876543212?text=Hello%20Accounts%20Desk,%20inquiry%20regarding%20fee%20receipt%20for%20Aarav%20Sharma.'
              },
              {
                id: 'transport',
                name: 'Mr. Ramesh Sharma',
                role: 'Transport Desk (Bus Route 14)',
                phone: '+91 98765 43213',
                availability: '6:30 AM - 6:00 PM',
                waLink: 'https://wa.me/919876543213?text=Hello%20Transport%20In-charge,%20query%20for%20Route%2014%20Bus%20(Aarav%20Sharma).'
              },
              {
                id: 'principal',
                name: 'Principal / Admin Desk',
                role: 'Administrative Office',
                phone: '+91 98765 43210',
                availability: '10:00 AM - 2:00 PM',
                waLink: 'https://wa.me/919876543210?text=Hello%20DPA%20Administration,%20parent%20query%20for%20Aarav%20Sharma.'
              }
            ]).map((ch) => (
              <div key={ch.id} className="bg-white border border-gray-200 p-4 hover:border-emerald-300 transition-all shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 uppercase border border-emerald-100">
                      {ch.id.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {ch.availability}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">{ch.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">{ch.role}</p>
                  <p className="text-xs font-mono text-gray-700 mb-3">{ch.phone}</p>
                </div>

                <a
                  href={ch.waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-xs rounded-none"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Chat on WhatsApp
                </a>

                {ch.id === 'accounts' && (
                  <a
                    href="http://localhost:5178"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full mt-2 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-[10.5px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors rounded-none"
                    title="Open Accountant & Fee Desk on http://localhost:5178"
                  >
                    <span>Accountant Panel :5178 ↗</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search alerts by keyword or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 rounded-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <span className="text-xs font-semibold text-gray-500 flex items-center gap-1 flex-shrink-0">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>

              {['All', 'Fees', 'Attendance', 'Homework', 'PTM', 'Exams', 'Transport'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors rounded-none ${
                    selectedCategory === cat
                      ? 'bg-[#353A40] text-white font-semibold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}

              {/* Status Filter Dropdown */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 text-xs py-1.5 px-2 bg-white text-gray-700 rounded-none focus:ring-emerald-500"
              >
                <option value="All">All Status</option>
                <option value="read">Read (✓✓ Blue)</option>
                <option value="delivered">Delivered (✓✓)</option>
                <option value="sent">Sent (✓)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Area: Main Message Feed & WhatsApp Mobile Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left / Middle: Message Dispatches Feed (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Official WhatsApp Alerts Feed ({filteredMessages.length})
              </h3>
              <span className="text-xs text-gray-500">
                Showing dispatches to {parentPhone || '+91 98765 10000'}
              </span>
            </div>

            {loading ? (
              <div className="bg-white border border-gray-200 p-12 text-center">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-600 font-medium">Fetching real WhatsApp message dispatches...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="bg-white border border-gray-200 p-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-gray-800">No WhatsApp Dispatches Found</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                  {searchQuery || selectedCategory !== 'All' 
                    ? 'No messages match your selected search criteria. Try resetting filters.'
                    : 'No WhatsApp messages have been sent to this student contact yet.'}
                </p>
                {(searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedStatus('All');
                    }}
                    className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold uppercase tracking-wider rounded-none"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            ) : (
              filteredMessages.map((item) => {
                const meta = getCategoryMeta(item.normalizedCategory || item.category);
                const IconComponent = meta.icon;
                const dateStr = item.date ? new Date(item.date).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                }) : 'Recently';

                return (
                  <div 
                    key={item._id}
                    className="bg-white border border-gray-200 p-5 shadow-sm hover:border-emerald-300 transition-all relative"
                  >
                    {/* Header of Card */}
                    <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold border rounded-none ${meta.bg}`}>
                          <IconComponent className="w-3.5 h-3.5" />
                          {meta.label}
                        </span>

                        {item.priority === 'High' && (
                          <span className="px-2 py-0.5 bg-red-50 text-red-700 text-[10px] font-bold border border-red-200 uppercase">
                            High Priority
                          </span>
                        )}

                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {dateStr}
                        </span>
                      </div>

                      {/* WhatsApp Status Tick Badge */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {item.status === 'read' ? (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-sky-600 bg-sky-50 px-2 py-0.5 border border-sky-200">
                            <CheckCheck className="w-4 h-4 text-sky-600" />
                            Read
                          </span>
                        ) : item.status === 'delivered' ? (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-gray-600 bg-gray-50 px-2 py-0.5 border border-gray-200">
                            <CheckCheck className="w-4 h-4 text-gray-500" />
                            Delivered
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 border border-gray-200">
                            <Check className="w-4 h-4 text-gray-400" />
                            Sent
                          </span>
                        )}
                      </div>
                    </div>

                    {/* WhatsApp Message Bubble Style Container */}
                    <div className="bg-[#EFEAE2]/30 p-4 border border-[#E0D8CB] mb-4 relative rounded-none">
                      {renderFormattedMessage(item.text)}
                      
                      <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-gray-400">
                        <span>{item.date ? new Date(item.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : ''}</span>
                        {item.status === 'read' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-sky-500 inline" />
                        ) : (
                          <CheckCheck className="w-3.5 h-3.5 text-gray-400 inline" />
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between text-xs text-gray-600 pt-1 flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => copyToClipboard(item.text, item._id)}
                          className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 font-medium transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          {copiedId === item._id ? 'Copied!' : 'Copy Text'}
                        </button>

                        <button
                          onClick={() => setSelectedMessage(item)}
                          className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 font-medium transition-colors"
                        >
                          <Info className="w-3.5 h-3.5" />
                          Details
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/919876543210?text=${encodeURIComponent(`Regarding school alert:\n"${item.text.slice(0, 80)}..."\nStudent: ${studentInfo?.name || 'Aarav Sharma'}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors rounded-none"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Reply on WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Pane: WhatsApp Live Simulator & Interactive Chat (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Phone Simulator Header */}
            <div className="bg-[#128C7E] text-white p-4 shadow-sm border border-emerald-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white text-emerald-800 font-bold flex items-center justify-center text-xs">
                    ACS
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight flex items-center gap-1">
                      All Core Solutions
                      <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    </h4>
                    <p className="text-[10px] text-emerald-100">Official Parent Broadcast Desk</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Phone className="w-4 h-4 cursor-pointer hover:opacity-80" />
                </div>
              </div>
            </div>

            {/* Simulated WhatsApp Wallpaper Body */}
            <div className="bg-[#ECE5DD] border border-gray-300 p-4 min-h-[420px] max-h-[560px] overflow-y-auto space-y-3 relative shadow-inner">
              <div className="text-center my-2">
                <span className="bg-[#D1E6E8] text-[#4A5D6E] text-[10px] px-2 py-0.5 shadow-xs uppercase tracking-wider font-semibold">
                  Messages are end-to-end encrypted
                </span>
              </div>

              {messages.slice(0, 3).map((simMsg) => {
                const simText = getMessageText(simMsg);
                const simDate = getMessageDate(simMsg);
                return (
                  <div key={`sim-${simMsg._id}`} className="flex flex-col items-start max-w-[92%]">
                    <div className="bg-white p-3 shadow-xs rounded-none border border-gray-200 text-xs text-gray-800 relative">
                      <p className="font-bold text-[11px] text-emerald-800 mb-1">
                        {simMsg.category} Alert:
                      </p>
                      <p className="line-clamp-3 text-xs leading-relaxed text-gray-700">
                        {simText}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1.5 text-[9px] text-gray-400">
                        <span>{simDate ? new Date(simDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : ''}</span>
                        <CheckCheck className="w-3.5 h-3.5 text-sky-500 inline" />
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="text-center my-3">
                <span className="bg-white/80 text-gray-500 text-[10px] px-3 py-1 font-medium border border-gray-200 shadow-xs">
                  Active Student: {studentInfo?.name || 'Aarav Sharma'} (Class I-A)
                </span>
              </div>
            </div>

            {/* Quick Inquiry Launcher Card */}
            <div className="bg-white border border-gray-200 p-5 shadow-sm">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                Frequently Requested WhatsApp Queries
              </h4>
              <p className="text-xs text-gray-500 mb-3">
                Click any preset below to send an automated inquiry to the school desk:
              </p>

              <div className="space-y-2">
                {(settings?.quickInquiries || [
                  { label: 'Fee Payment Receipt Confirmation', category: 'Fees' },
                  { label: 'Child Absentee Notice / Leave Application', category: 'Attendance' },
                  { label: 'Bus Route & Pick-up Timing Inquiry', category: 'Transport' },
                  { label: 'Parent-Teacher Meeting Appointment', category: 'PTM' }
                ]).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setComposeForm({
                        channel: q.category === 'Fees' ? 'accounts' : q.category === 'Transport' ? 'transport' : 'class_teacher',
                        category: q.category,
                        inquiryType: q.label,
                        message: `Hello All Core Solutions,\n\nI would like to inquire regarding: *${q.label}* for my child ${studentInfo?.name || 'Aarav Sharma'} (Class: ${studentInfo?.className || 'Class I-A'}, Roll: ${studentInfo?.rollNo || '101'}).\n\nKindly assist.`
                      });
                      setIsComposeOpen(true);
                    }}
                    className="w-full text-left p-2.5 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-xs text-gray-700 font-medium transition-colors flex items-center justify-between group"
                  >
                    <span>{q.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ===================== COMPOSE INQUIRY MODAL ===================== */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg border border-gray-300 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#353A40] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Compose WhatsApp Inquiry to School Desk
                </h3>
              </div>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSendInquiry} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Recipient Desk / Department *
                </label>
                <select
                  value={composeForm.channel}
                  onChange={(e) => {
                    const ch = e.target.value;
                    let cat = 'General';
                    if (ch === 'accounts') cat = 'Fees';
                    if (ch === 'transport') cat = 'Transport';
                    if (ch === 'class_teacher') cat = 'Homework';
                    setComposeForm({ ...composeForm, channel: ch, category: cat });
                  }}
                  className="w-full border border-gray-300 p-2 text-xs rounded-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="class_teacher">Class Teacher Desk (Mrs. Anita Roy - Class I-A)</option>
                  <option value="accounts">Accounts & Fee Clearance Counter</option>
                  <option value="transport">Transport Department (Bus Route 14)</option>
                  <option value="principal">Principal & Administrative Office</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={composeForm.category}
                    onChange={(e) => setComposeForm({ ...composeForm, category: e.target.value })}
                    className="w-full border border-gray-300 p-2 text-xs rounded-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Fees">Fee & Payment Inquiry</option>
                    <option value="Attendance">Attendance / Leave</option>
                    <option value="Homework">Homework & Academics</option>
                    <option value="PTM">PTM Meeting</option>
                    <option value="Transport">Bus / Transport</option>
                    <option value="General">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Inquiry Title
                  </label>
                  <input
                    type="text"
                    value={composeForm.inquiryType}
                    onChange={(e) => setComposeForm({ ...composeForm, inquiryType: e.target.value })}
                    placeholder="e.g. Leave Notice, Fee Check"
                    className="w-full border border-gray-300 p-2 text-xs rounded-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Message Body *
                  </label>
                  <span className="text-[10px] text-gray-400">
                    {composeForm.message.length} characters
                  </span>
                </div>
                <textarea
                  rows="5"
                  value={composeForm.message}
                  onChange={(e) => setComposeForm({ ...composeForm, message: e.target.value })}
                  placeholder="Write your detailed inquiry message here..."
                  className="w-full border border-gray-300 p-3 text-xs rounded-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                  required
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Tip: Message will be logged in school records and you can immediately open it in WhatsApp.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Official Broadcast Verification</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Sender: {studentInfo?.fatherName || 'Rajesh Kumar Gupta'} ({parentPhone || '+91 98765 10000'}) for student {studentInfo?.name || 'Aarav Sharma'}.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-semibold uppercase tracking-wider hover:bg-gray-50 transition-colors rounded-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingInquiry}
                  className="px-5 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm rounded-none"
                >
                  {sendingInquiry ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Logging Query...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Submit & Open WhatsApp
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MESSAGE DETAILS MODAL ===================== */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg border border-gray-300 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#353A40] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Dispatch Technical Metadata
                </h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <span className="text-gray-500 block uppercase font-medium text-[10px]">Recipient Phone</span>
                  <span className="font-bold text-gray-900 mt-1 block">{selectedMessage.to || parentPhone}</span>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <span className="text-gray-500 block uppercase font-medium text-[10px]">Delivery Status</span>
                  <span className="font-bold text-emerald-600 mt-1 block uppercase">{selectedMessage.status} (✓✓)</span>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <span className="text-gray-500 block uppercase font-medium text-[10px]">Category</span>
                  <span className="font-bold text-gray-900 mt-1 block">{selectedMessage.category}</span>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <span className="text-gray-500 block uppercase font-medium text-[10px]">Sent At</span>
                  <span className="font-bold text-gray-900 mt-1 block">
                    {getMessageDate(selectedMessage) ? new Date(getMessageDate(selectedMessage)).toLocaleString('en-IN') : 'N/A'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Full Message Text
                </span>
                <div className="p-3 bg-gray-50 border border-gray-200 font-mono text-xs text-gray-800 whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {getMessageText(selectedMessage)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => copyToClipboard(getMessageText(selectedMessage), 'modal')}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-semibold uppercase tracking-wider hover:bg-gray-50 transition-colors flex items-center gap-1.5 rounded-none"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedId === 'modal' ? 'Copied!' : 'Copy Text'}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-1.5 bg-gray-800 text-white text-xs font-semibold uppercase tracking-wider hover:bg-gray-700 transition-colors rounded-none"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

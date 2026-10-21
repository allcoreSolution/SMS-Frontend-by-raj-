import React, { useState, useEffect, useMemo } from 'react';
import { 
  Mail, Send, Inbox, Star, Trash2, Archive, 
  Search, RefreshCw, Paperclip, MoreVertical, 
  Printer, X, School, Check, CheckCheck, 
  AlertCircle, Clock, Filter, ChevronRight, 
  FileText, Download, ShieldCheck, Reply, 
  User, Tag, ArrowLeft, CornerUpLeft, Plus, Eye,
  Settings, KeyRound, ShieldAlert
} from 'lucide-react';
import { parentService } from '../../api/parentService';
import Swal from 'sweetalert2';

export default function Email() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [counts, setCounts] = useState({ inbox: 0, unread: 0, starred: 0, sent: 0, trash: 0 });
  const [studentInfo, setStudentInfo] = useState(null);
  const [schoolSettings, setSchoolSettings] = useState(null);

  // Navigation & Filters
  const [activeFolder, setActiveFolder] = useState('inbox'); // 'inbox' | 'starred' | 'sent' | 'trash'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterReadStatus, setFilterReadStatus] = useState('all'); // 'all' | 'unread' | 'read'

  // Reading Modal & Compose Modal
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isSmtpModalOpen, setIsSmtpModalOpen] = useState(false);

  // Compose State
  const [composeForm, setComposeForm] = useState({
    toDepartment: 'Office of the Principal',
    toEmail: 'rajy9648adav@gmail.com',
    category: 'General',
    subject: '',
    body: ''
  });
  const [replyText, setReplyText] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  // SMTP Settings State
  const [smtpForm, setSmtpForm] = useState({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    user: 'rajy9696adav@gmail.com',
    pass: '',
    testRecipient: 'rajy9648adav@gmail.com',
    hasPassword: false
  });
  const [testingSmtp, setTestingSmtp] = useState(false);

  const handleOpenSmtpModal = async () => {
    setIsSmtpModalOpen(true);
    try {
      const res = await parentService.getSmtpConfig();
      if (res?.success && res.data) {
        setSmtpForm(prev => ({
          ...prev,
          host: res.data.host || 'smtp.gmail.com',
          port: res.data.port || 587,
          secure: Boolean(res.data.secure),
          user: res.data.user || 'rajy9696adav@gmail.com',
          hasPassword: Boolean(res.data.hasPassword),
          testRecipient: res.data.defaultRecipient || 'rajy9648adav@gmail.com'
        }));
      }
    } catch (err) {
      console.error('Error fetching SMTP config:', err);
    }
  };

  const handleSaveSmtp = async (e) => {
    e.preventDefault();
    if (!smtpForm.pass && !smtpForm.hasPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'App Password Required',
        text: 'Please enter your 16-character Google App Password.',
        confirmButtonColor: '#2563EB'
      });
      return;
    }

    try {
      setTestingSmtp(true);
      const res = await parentService.saveSmtpConfig({
        host: smtpForm.host,
        port: parseInt(smtpForm.port, 10),
        secure: smtpForm.secure,
        user: smtpForm.user,
        pass: smtpForm.pass,
        sendTestEmail: true,
        testRecipient: smtpForm.testRecipient
      });

      if (res?.success) {
        setIsSmtpModalOpen(false);
        Swal.fire({
          icon: 'success',
          title: 'SMTP Connected & Verified!',
          html: `<p class="text-xs text-gray-700">SMTP connection established successfully! Test email has been delivered to <strong>${smtpForm.testRecipient}</strong>.</p>`,
          confirmButtonColor: '#2563EB'
        });
      }
    } catch (err) {
      console.error('SMTP test error:', err);
      Swal.fire({
        icon: 'error',
        title: 'SMTP Connection Failed',
        text: err?.response?.data?.message || 'Failed to authenticate with SMTP server.',
        confirmButtonColor: '#DC2626'
      });
    } finally {
      setTestingSmtp(false);
    }
  };

  useEffect(() => {
    fetchEmails();
    fetchSettings();
  }, [activeFolder, selectedCategory]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const params = { folder: activeFolder };
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res = await parentService.getEmails(params);
      if (res?.success) {
        setEmails(res.data || []);
        if (res.counts) setCounts(res.counts);
        if (res.studentInfo) setStudentInfo(res.studentInfo);
      }
    } catch (err) {
      console.error('Error fetching emails:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await parentService.getEmailSettings();
      if (res?.success) {
        setSchoolSettings(res.data);
      }
    } catch (err) {
      console.error('Error fetching email settings:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEmails();
    setRefreshing(false);
  };

  // Open email details and mark as read
  const handleOpenEmail = async (email) => {
    setSelectedEmail(email);
    if (!email.isRead) {
      // Optimistic update
      setEmails(prev => prev.map(e => e._id === email._id ? { ...e, isRead: true } : e));
      setCounts(prev => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
      try {
        await parentService.toggleReadEmail(email._id, true);
      } catch (err) {
        console.error('Error marking email as read:', err);
      }
    }
  };

  // Toggle Star
  const handleToggleStar = async (e, email) => {
    e.stopPropagation();
    const newStarState = !email.isStarred;
    
    // Optimistic update
    setEmails(prev => prev.map(item => item._id === email._id ? { ...item, isStarred: newStarState } : item));
    if (selectedEmail?._id === email._id) {
      setSelectedEmail(prev => ({ ...prev, isStarred: newStarState }));
    }
    setCounts(prev => ({
      ...prev,
      starred: newStarState ? prev.starred + 1 : Math.max(0, prev.starred - 1)
    }));

    try {
      await parentService.toggleStarEmail(email._id);
    } catch (err) {
      console.error('Error toggling star:', err);
      // Revert if error
      setEmails(prev => prev.map(item => item._id === email._id ? { ...item, isStarred: !newStarState } : item));
    }
  };

  // Delete / Trash
  const handleDeleteEmail = async (e, email) => {
    if (e) e.stopPropagation();

    const isPermanent = email.isTrash || activeFolder === 'trash';
    const confirmText = isPermanent 
      ? 'This email will be permanently deleted from the server.' 
      : 'This email will be moved to your Trash folder.';

    const result = await Swal.fire({
      title: isPermanent ? 'Permanently Delete?' : 'Move to Trash?',
      text: confirmText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: isPermanent ? 'Delete Forever' : 'Move to Trash'
    });

    if (!result.isConfirmed) return;

    try {
      await parentService.deleteEmail(email._id);
      setEmails(prev => prev.filter(item => item._id !== email._id));
      if (selectedEmail?._id === email._id) {
        setSelectedEmail(null);
      }
      Swal.fire({
        icon: 'success',
        title: isPermanent ? 'Deleted!' : 'Moved to Trash',
        toast: true,
        position: 'top-end',
        timer: 2000,
        showConfirmButton: false
      });
      fetchEmails();
    } catch (err) {
      console.error('Error deleting email:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete email.'
      });
    }
  };

  // Restore from Trash
  const handleRestoreEmail = async (e, email) => {
    if (e) e.stopPropagation();
    try {
      await parentService.restoreEmail(email._id);
      setEmails(prev => prev.filter(item => item._id !== email._id));
      if (selectedEmail?._id === email._id) {
        setSelectedEmail(null);
      }
      Swal.fire({
        icon: 'success',
        title: 'Restored!',
        text: 'Email restored back to inbox.',
        toast: true,
        position: 'top-end',
        timer: 2000,
        showConfirmButton: false
      });
      fetchEmails();
    } catch (err) {
      console.error('Error restoring email:', err);
    }
  };

  // Send New Compose Email
  const handleSendCompose = async (e) => {
    e.preventDefault();
    if (!composeForm.subject.trim() || !composeForm.body.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Email',
        text: 'Please enter both a Subject and Email Message Body.',
        confirmButtonColor: '#2563EB'
      });
      return;
    }

    try {
      setSendingEmail(true);
      const res = await parentService.sendEmail({
        toDepartment: composeForm.toDepartment,
        toEmail: composeForm.toEmail,
        subject: composeForm.subject,
        body: composeForm.body,
        category: composeForm.category,
        studentId: studentInfo?.id
      });

      if (res?.success) {
        setIsComposeOpen(false);
        const deliveredLive = res.deliveryStatus?.delivered;
        const recipient = composeForm.toEmail;
        const dept = composeForm.toDepartment;

        setComposeForm({
          toDepartment: 'Office of the Principal',
          toEmail: 'rajy9648adav@gmail.com',
          category: 'General',
          subject: '',
          body: ''
        });

        if (deliveredLive) {
          Swal.fire({
            icon: 'success',
            title: 'Delivered to Gmail via SMTP!',
            html: `
              <div class="text-left text-xs text-gray-700 space-y-2 mt-2">
                <p>✅ Your email was dispatched over live SMTP and delivered directly to <strong>${recipient}</strong>.</p>
                <p>A certified copy is also logged in the School ERP Mailbox.</p>
              </div>
            `,
            confirmButtonColor: '#2563EB'
          });
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Delivered to Principal ERP Inbox!',
            html: `
              <div class="text-left text-xs text-gray-700 space-y-2 mt-2">
                <p>✅ Your message has been placed directly in the <strong>${dept} Inbox</strong> in School ERP.</p>
                <p class="text-amber-800 bg-amber-50 p-2 border border-amber-200">
                  <strong>Note:</strong> To also deliver real emails directly into external Gmail app inboxes (<code>${recipient}</code>), enter your Google App Password in <strong>SMTP Settings</strong>.
                </p>
              </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Configure SMTP',
            cancelButtonText: 'OK',
            confirmButtonColor: '#2563EB',
            cancelButtonColor: '#6B7280'
          }).then((r) => {
            if (r.isConfirmed) {
              handleOpenSmtpModal();
            }
          });
        }

        // Switch to Sent folder or refresh
        setActiveFolder('sent');
        fetchEmails();
      }
    } catch (err) {
      console.error('Error sending email:', err);
      Swal.fire({
        icon: 'error',
        title: 'Send Failed',
        text: err?.response?.data?.message || 'Could not send email.'
      });
    } finally {
      setSendingEmail(false);
    }
  };

  // Send Quick Reply
  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    try {
      setSendingEmail(true);
      const res = await parentService.sendEmail({
        toDepartment: selectedEmail.sender,
        toEmail: selectedEmail.senderEmail,
        subject: `Re: ${selectedEmail.subject}`,
        body: replyText.trim(),
        category: selectedEmail.category || 'General',
        studentId: studentInfo?.id
      });

      if (res?.success) {
        setReplyText('');
        setIsReplyOpen(false);
        Swal.fire({
          icon: 'success',
          title: 'Reply Sent!',
          text: `Reply dispatched to ${selectedEmail.senderEmail}.`,
          toast: true,
          position: 'top-end',
          timer: 2500,
          showConfirmButton: false
        });
        fetchEmails();
      }
    } catch (err) {
      console.error('Error sending reply:', err);
    } finally {
      setSendingEmail(false);
    }
  };

  // Filtered emails based on search and read status
  const filteredEmails = useMemo(() => {
    return emails.filter(item => {
      // Read status filter
      if (filterReadStatus === 'unread' && item.isRead) return false;
      if (filterReadStatus === 'read' && !item.isRead) return false;

      // Local search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const subjectMatch = item.subject?.toLowerCase().includes(q);
        const senderMatch = item.sender?.toLowerCase().includes(q);
        const bodyMatch = item.body?.toLowerCase().includes(q);
        const mailIdMatch = item.mailId?.toLowerCase().includes(q);
        if (!subjectMatch && !senderMatch && !bodyMatch && !mailIdMatch) return false;
      }
      return true;
    });
  }, [emails, filterReadStatus, searchQuery]);

  // Category styling
  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'Fees':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Academics':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Notices':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Attendance':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Events':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Health':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      
      {/* Top Banner Header */}
      <div className="bg-[#353A40] text-white border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-blue-400 font-semibold mb-1">
                <span>Communications</span>
                <span>/</span>
                <span className="text-white">Email Inbox</span>
              </div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="p-2 bg-[#2563eb] text-white rounded-none shadow-md inline-flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </span>
                Official School Mailbox & E-Dispatches
              </h1>
              <p className="text-xs text-gray-300 mt-1 max-w-2xl">
                Encrypted official school letters, fee clearance tax receipts, academic marksheet evaluations, and direct helpdesk email dispatch.
              </p>
            </div>

            {/* Quick Actions in Top Banner */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setIsComposeOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider transition-all duration-150 flex items-center gap-2 shadow-sm rounded-none"
              >
                <Plus className="w-4 h-4" />
                Compose Mail
              </button>

              <button
                onClick={handleOpenSmtpModal}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold uppercase tracking-wider transition-all duration-150 flex items-center gap-2 rounded-none border border-gray-600"
                title="Configure Live SMTP Server"
              >
                <Settings className="w-4 h-4 text-amber-400" />
                SMTP Gateway
              </button>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                title="Refresh Mailbox"
                className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors rounded-none"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Mailbox Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">

        {/* 4 Summary Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 border border-gray-200 border-l-4 border-l-blue-600 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Inbox Mails</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{counts.inbox}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Active school messages</p>
              </div>
              <div className="p-2.5 bg-blue-50 text-blue-600">
                <Inbox className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 border border-gray-200 border-l-4 border-l-amber-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Unread Mails</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{counts.unread}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Require your review</p>
              </div>
              <div className="p-2.5 bg-amber-50 text-amber-600">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 border border-gray-200 border-l-4 border-l-yellow-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Starred</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{counts.starred}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Flagged important</p>
              </div>
              <div className="p-2.5 bg-yellow-50 text-yellow-600">
                <Star className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 border border-gray-200 border-l-4 border-l-emerald-600 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Sent Queries</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{counts.sent}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Dispatched to school</p>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-600">
                <Send className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Layout Grid: Left Sidebar (3 cols) + Right Mailbox List (9 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-5">
            
            {/* Primary Action Button */}
            <button
              onClick={() => setIsComposeOpen(true)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all rounded-none"
            >
              <Plus className="w-4 h-4" />
              New Mail to School
            </button>

            {/* Folder Navigation Menu */}
            <div className="bg-white border border-gray-200 shadow-sm p-3">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1 block">
                Mail Folders
              </span>
              <div className="space-y-1 mt-2">
                <button
                  onClick={() => { setActiveFolder('inbox'); setSelectedCategory('All'); }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors rounded-none ${
                    activeFolder === 'inbox' 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-l-blue-600 font-bold' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Inbox className="w-4 h-4" />
                    Inbox
                  </span>
                  {counts.unread > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-none">
                      {counts.unread}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => { setActiveFolder('starred'); setSelectedCategory('All'); }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors rounded-none ${
                    activeFolder === 'starred' 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-l-blue-600 font-bold' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    Starred
                  </span>
                  <span className="text-xs text-gray-400">{counts.starred}</span>
                </button>

                <button
                  onClick={() => { setActiveFolder('sent'); setSelectedCategory('All'); }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors rounded-none ${
                    activeFolder === 'sent' 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-l-blue-600 font-bold' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Send className="w-4 h-4" />
                    Sent Mails
                  </span>
                  <span className="text-xs text-gray-400">{counts.sent}</span>
                </button>

                <button
                  onClick={() => { setActiveFolder('trash'); setSelectedCategory('All'); }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors rounded-none ${
                    activeFolder === 'trash' 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-l-blue-600 font-bold' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Trash2 className="w-4 h-4" />
                    Trash Bin
                  </span>
                  <span className="text-xs text-gray-400">{counts.trash}</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="bg-white border border-gray-200 shadow-sm p-4">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-3">
                Filter by Category
              </span>
              <div className="space-y-1.5">
                {['All', 'Fees', 'Academics', 'Notices', 'Attendance', 'Health', 'Events'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors flex items-center justify-between rounded-none ${
                      selectedCategory === cat 
                        ? 'bg-[#353A40] text-white font-bold' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{cat === 'All' ? 'All Categories' : cat}</span>
                    {cat !== 'All' && (
                      <span className={`w-2 h-2 rounded-full ${
                        cat === 'Fees' ? 'bg-emerald-500' :
                        cat === 'Academics' ? 'bg-blue-500' :
                        cat === 'Notices' ? 'bg-amber-500' :
                        cat === 'Attendance' ? 'bg-cyan-500' :
                        cat === 'Health' ? 'bg-rose-500' : 'bg-purple-500'
                      }`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* School Helpdesk Directory Card */}
            <div className="bg-white border border-gray-200 shadow-sm p-4">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <School className="w-4 h-4 text-blue-600" />
                School Departments Directory
              </h4>
              <p className="text-[11px] text-gray-500 mb-3">Click any department to write an email directly:</p>

              <div className="space-y-2">
                {(schoolSettings?.departments || [
                  { name: 'Office of the Principal', email: 'rajy9648adav@gmail.com', role: 'Executive' },
                  { name: 'Accounts & Billing Cell', email: 'accounts@delhipublicacademy.edu.in', role: 'Fees' },
                  { name: 'Class Teacher (Mrs. Anita Roy)', email: 'anita.roy@delhipublicacademy.edu.in', role: 'Academics' },
                  { name: 'Examinations Office', email: 'evaluations@delhipublicacademy.edu.in', role: 'Results' }
                ]).map((dept, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      setComposeForm({
                        toDepartment: dept.name,
                        toEmail: dept.email,
                        category: dept.role === 'Fees' ? 'Fees' : dept.role === 'Academics' ? 'Academics' : 'General',
                        subject: `Query for ${dept.name} regarding Aarav Sharma (Class I-A)`,
                        body: `Respected ${dept.name},\n\nI am writing to inquire regarding...\n\nThank you,\nRajesh Kumar Gupta\nPhone: +91 98765 10000`
                      });
                      setIsComposeOpen(true);
                    }}
                    className="p-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-xs cursor-pointer transition-colors group"
                  >
                    <p className="font-bold text-gray-900 text-[11px] group-hover:text-blue-700">{dept.name}</p>
                    <p className="text-[10px] text-gray-500 font-mono truncate">{dept.email}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Main Mail List Panel */}
          <div className="lg:col-span-9 space-y-4">
            
            {/* Toolbar Header */}
            <div className="bg-white border border-gray-200 p-3 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
              
              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search emails by subject, sender, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 border border-gray-300 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-none"
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

              {/* Status & Sort Controls */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-gray-400 font-medium">Status:</span>
                  <select
                    value={filterReadStatus}
                    onChange={(e) => setFilterReadStatus(e.target.value)}
                    className="border border-gray-300 py-1.5 px-2 bg-white text-xs text-gray-700 rounded-none"
                  >
                    <option value="all">All Mails</option>
                    <option value="unread">Unread Only</option>
                    <option value="read">Read Only</option>
                  </select>
                </div>

                <span className="text-xs text-gray-400 border-l border-gray-200 pl-3">
                  Showing <strong className="text-gray-700">{filteredEmails.length}</strong> emails
                </span>
              </div>
            </div>

            {/* Email List Container */}
            <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-16 text-center">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-600">Loading your official school mailbox...</p>
                </div>
              ) : filteredEmails.length === 0 ? (
                <div className="p-16 text-center">
                  <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-gray-800">No Emails in {activeFolder.toUpperCase()}</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                    {searchQuery || selectedCategory !== 'All' 
                      ? 'No messages match your selected search or filter criteria. Try resetting.' 
                      : `You currently have no messages in this folder.`}
                  </p>
                  {(searchQuery || selectedCategory !== 'All' || filterReadStatus !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                        setFilterReadStatus('all');
                      }}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold uppercase tracking-wider rounded-none"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredEmails.map((mail) => {
                    const isUnread = !mail.isRead;
                    const dateFormatted = mail.sentAt ? new Date(mail.sentAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short'
                    }) : '';

                    return (
                      <div
                        key={mail._id}
                        onClick={() => handleOpenEmail(mail)}
                        className={`flex items-center px-4 py-3.5 hover:bg-[#F1F5F9] transition-all cursor-pointer group relative ${
                          isUnread ? 'bg-[#F8FAFC] font-semibold border-l-4 border-l-blue-600' : 'bg-white'
                        }`}
                      >
                        {/* Star Button */}
                        <button
                          onClick={(e) => handleToggleStar(e, mail)}
                          className="mr-3 text-gray-300 hover:text-yellow-500 transition-colors p-1"
                          title={mail.isStarred ? 'Unstar' : 'Star'}
                        >
                          <Star className={`w-4 h-4 ${mail.isStarred ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                        </button>

                        {/* Sender / Department */}
                        <div className="w-48 sm:w-56 flex-shrink-0 pr-2">
                          <span className={`text-xs block truncate ${isUnread ? 'font-bold text-gray-950' : 'text-gray-800'}`}>
                            {activeFolder === 'sent' ? `To: ${mail.recipient}` : mail.sender}
                          </span>
                          <span className="text-[10px] text-gray-400 block truncate">
                            {activeFolder === 'sent' ? mail.recipientEmail : mail.senderEmail}
                          </span>
                        </div>

                        {/* Subject + Snippet Preview */}
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs truncate ${isUnread ? 'font-extrabold text-gray-950' : 'text-gray-800'}`}>
                              {mail.subject}
                            </span>
                            
                            <span className={`px-2 py-0.2 text-[10px] font-bold border rounded-none ${getCategoryBadge(mail.category)}`}>
                              {mail.category}
                            </span>

                            {mail.priority === 'High' && (
                              <span className="px-1.5 py-0.2 bg-red-50 text-red-700 text-[9px] font-bold border border-red-200 uppercase">
                                Urgent
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {mail.preview || mail.body?.slice(0, 90)}
                          </p>
                        </div>

                        {/* Attachment Icon */}
                        {mail.attachments && mail.attachments.length > 0 && (
                          <div className="mr-3 text-gray-400 flex-shrink-0" title={`${mail.attachments.length} Attachment(s)`}>
                            <Paperclip className="w-3.5 h-3.5" />
                          </div>
                        )}

                        {/* Date */}
                        <div className="w-16 text-right flex-shrink-0 text-xs text-gray-500">
                          {dateFormatted}
                        </div>

                        {/* Hover Quick Action Buttons */}
                        <div className="hidden group-hover:flex items-center gap-1.5 pl-3 border-l border-gray-200 ml-2">
                          {activeFolder === 'trash' ? (
                            <button
                              onClick={(e) => handleRestoreEmail(e, mail)}
                              className="p-1 text-gray-500 hover:text-emerald-600 transition-colors"
                              title="Restore to Inbox"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => handleDeleteEmail(e, mail)}
                              className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* ===================== EMAIL READER MODAL ===================== */}
      {selectedEmail && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl border border-gray-300 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="bg-[#353A40] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider truncate max-w-lg">
                  {selectedEmail.subject}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  title="Print Official Letter"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Email Metadata Bar */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-900 text-sm">{selectedEmail.sender}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold border rounded-none ${getCategoryBadge(selectedEmail.category)}`}>
                        {selectedEmail.category}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">[{selectedEmail.mailId}]</span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      From: &lt;{selectedEmail.senderEmail}&gt; → To: {selectedEmail.recipientEmail || 'rajy9696adav@gmail.com'}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs text-gray-500 font-medium block">
                    {selectedEmail.sentAt ? new Date(selectedEmail.sentAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    }) : ''}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold inline-flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3" /> Signed & Verified
                  </span>
                </div>
              </div>

              {/* Student Context Tag */}
              <div className="mt-3 pt-2.5 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
                <span>
                  Regarding Ward: <strong className="text-gray-900">{selectedEmail.studentName || 'Aarav Sharma'} ({selectedEmail.className || 'Class I-A'})</strong>
                </span>
                <span className="text-gray-400">All Core Solutions ERP Mail Gateway</span>
              </div>
            </div>

            {/* Email Body Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="text-xs sm:text-sm text-gray-800 leading-relaxed font-sans whitespace-pre-wrap">
                {selectedEmail.body}
              </div>

              {/* Attachments Section if present */}
              {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                    Official Attached Documents ({selectedEmail.attachments.length})
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedEmail.attachments.map((att, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 hover:border-blue-400 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                          <div className="truncate">
                            <p className="font-bold text-xs text-gray-900 truncate">{att.name}</p>
                            <span className="text-[10px] text-gray-400 font-mono">{att.size || 'PDF Document'}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            Swal.fire({
                              icon: 'info',
                              title: 'Document Ready',
                              text: `Opening official certified copy: ${att.name}`,
                              confirmButtonColor: '#2563EB'
                            });
                          }}
                          className="px-2.5 py-1 bg-white border border-gray-300 hover:bg-blue-50 hover:text-blue-600 text-xs font-semibold flex items-center gap-1 transition-colors rounded-none"
                        >
                          <Download className="w-3 h-3" />
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inline Quick Reply Drawer */}
              {isReplyOpen && (
                <div className="mt-6 pt-4 border-t-2 border-blue-500 bg-blue-50/50 p-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Reply className="w-3.5 h-3.5" />
                      Replying to {selectedEmail.senderEmail}:
                    </span>
                    <button onClick={() => setIsReplyOpen(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows="4"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your official reply here..."
                    className="w-full border border-gray-300 p-2.5 text-xs rounded-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                  <div className="flex items-center justify-end gap-2 mt-2">
                    <button
                      onClick={() => setIsReplyOpen(false)}
                      className="px-3 py-1.5 text-xs text-gray-600 font-medium hover:bg-gray-100 rounded-none"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendReply}
                      disabled={sendingEmail || !replyText.trim()}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors rounded-none"
                    >
                      {sendingEmail ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                      Send Reply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsReplyOpen(!isReplyOpen)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors rounded-none"
                >
                  <Reply className="w-3.5 h-3.5" />
                  Reply
                </button>

                <button
                  onClick={(e) => handleToggleStar(e, selectedEmail)}
                  className="px-3 py-1.5 border border-gray-300 hover:bg-white text-gray-700 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors rounded-none"
                >
                  <Star className={`w-3.5 h-3.5 ${selectedEmail.isStarred ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                  {selectedEmail.isStarred ? 'Starred' : 'Star'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteEmail(null, selectedEmail)}
                  className="px-3 py-1.5 border border-gray-300 hover:bg-red-50 hover:text-red-600 text-gray-600 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors rounded-none"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>

                <button
                  onClick={() => setSelectedEmail(null)}
                  className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors rounded-none"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ===================== COMPOSE NEW EMAIL MODAL ===================== */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl border border-gray-300 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="bg-[#353A40] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Compose Email to School Administration
                </h3>
              </div>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSendCompose} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Recipient Department *
                </label>
                <select
                  value={composeForm.toDepartment}
                  onChange={(e) => {
                    const dept = e.target.value;
                    let email = 'administration@delhipublicacademy.edu.in';
                    let cat = 'General';
                    if (dept.includes('Principal')) { email = 'rajy9648adav@gmail.com'; cat = 'General'; }
                    if (dept.includes('Accounts')) { email = 'accounts@delhipublicacademy.edu.in'; cat = 'Fees'; }
                    if (dept.includes('Teacher')) { email = 'anita.roy@delhipublicacademy.edu.in'; cat = 'Academics'; }
                    if (dept.includes('Examinations')) { email = 'evaluations@delhipublicacademy.edu.in'; cat = 'Academics'; }
                    if (dept.includes('Transport')) { email = 'transport@delhipublicacademy.edu.in'; cat = 'Notices'; }
                    if (dept.includes('Health')) { email = 'health@delhipublicacademy.edu.in'; cat = 'Health'; }
                    setComposeForm({ ...composeForm, toDepartment: dept, toEmail: email, category: cat });
                  }}
                  className="w-full border border-gray-300 p-2.5 text-xs rounded-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Office of the Principal">Office of the Principal & Director</option>
                  <option value="Accounts & Billing Cell">Accounts & Fee Billing Cell</option>
                  <option value="Class Teacher (Mrs. Anita Roy)">Class Teacher Desk (Class I-A)</option>
                  <option value="Examinations & Evaluation Office">Examinations & Evaluation Office</option>
                  <option value="Transport & Bus Safety Cell">Transport & Safety Helpdesk</option>
                  <option value="Student Health & Medical Clinic">Health & Medical Center</option>
                </select>
                <span className="text-[10px] text-gray-500 mt-1 block font-mono">
                  Official Email: {composeForm.toEmail}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={composeForm.category}
                    onChange={(e) => setComposeForm({ ...composeForm, category: e.target.value })}
                    className="w-full border border-gray-300 p-2 text-xs rounded-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="General">General Inquiry</option>
                    <option value="Fees">Fee & Billing</option>
                    <option value="Academics">Academic Progress</option>
                    <option value="Attendance">Leave / Attendance</option>
                    <option value="Health">Health & Wellness</option>
                    <option value="Events">PTM & School Events</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Student Reference
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${studentInfo?.name || 'Aarav Sharma'} (${studentInfo?.className || 'Class I-A'})`}
                    className="w-full border border-gray-200 bg-gray-50 p-2 text-xs text-gray-600 rounded-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Subject Line *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leave Application for Aarav Sharma, Fee Query..."
                  value={composeForm.subject}
                  onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                  className="w-full border border-gray-300 p-2.5 text-xs rounded-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Message Body *
                </label>
                <textarea
                  required
                  rows="6"
                  placeholder="Write your detailed official email message here..."
                  value={composeForm.body}
                  onChange={(e) => setComposeForm({ ...composeForm, body: e.target.value })}
                  className="w-full border border-gray-300 p-3 text-xs rounded-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-sans"
                />
              </div>

              {/* Sender Details Callout */}
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
                <span>
                  Sender: <strong>{studentInfo?.parentName || 'Rajesh Kumar Gupta'}</strong> (rajy9696adav@gmail.com)
                </span>
                <span className="text-[10px] font-bold uppercase text-blue-700">Verified Parent</span>
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
                  disabled={sendingEmail}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors rounded-none shadow-sm"
                >
                  {sendingEmail ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ===================== SMTP CONFIGURATION MODAL ===================== */}
      {isSmtpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg border border-gray-300 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-[#353A40] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Live SMTP Email Gateway Setup
                </h3>
              </div>
              <button
                onClick={() => setIsSmtpModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSaveSmtp} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 leading-relaxed">
                <p className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
                  <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  Direct Gmail Delivery Instructions:
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-[11px] text-amber-950">
                  <li>Visit your <strong>Google Account</strong> (myaccount.google.com) → <strong>Security</strong>.</li>
                  <li>Ensure <strong>2-Step Verification</strong> is enabled.</li>
                  <li>Search for <strong>"App Passwords"</strong> (or go to myaccount.google.com/apppasswords).</li>
                  <li>Generate a 16-character App Password for "School ERP".</li>
                  <li>Paste the 16-character password below and click <strong>"Save & Verify SMTP"</strong>.</li>
                </ol>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={smtpForm.host}
                    onChange={(e) => setSmtpForm({ ...smtpForm, host: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-none focus:ring-1 focus:ring-blue-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Port
                  </label>
                  <input
                    type="number"
                    value={smtpForm.port}
                    onChange={(e) => setSmtpForm({ ...smtpForm, port: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-none focus:ring-1 focus:ring-blue-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Sender Gmail Account (Username)
                </label>
                <input
                  type="email"
                  value={smtpForm.user}
                  onChange={(e) => setSmtpForm({ ...smtpForm, user: e.target.value })}
                  placeholder="e.g. rajy9696adav@gmail.com"
                  className="w-full border border-gray-300 p-2 rounded-none focus:ring-1 focus:ring-blue-500 font-mono"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-gray-700 uppercase tracking-wider">
                    Google App Password (16 characters)
                  </label>
                  {smtpForm.hasPassword && (
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                      ✓ Password Configured
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  value={smtpForm.pass}
                  onChange={(e) => setSmtpForm({ ...smtpForm, pass: e.target.value })}
                  placeholder={smtpForm.hasPassword ? '•••••••••••••••• (Leave blank to keep existing)' : 'Enter 16-character App Password'}
                  className="w-full border border-gray-300 p-2 rounded-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Recipient for Verification Test Email
                </label>
                <input
                  type="email"
                  value={smtpForm.testRecipient}
                  onChange={(e) => setSmtpForm({ ...smtpForm, testRecipient: e.target.value })}
                  placeholder="rajy9648adav@gmail.com"
                  className="w-full border border-gray-300 p-2 rounded-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsSmtpModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold uppercase tracking-wider hover:bg-gray-50 transition-colors rounded-none"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={testingSmtp}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider flex items-center gap-2 transition-colors rounded-none shadow-sm"
                >
                  {testingSmtp ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Connecting & Verifying...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Save & Verify SMTP
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

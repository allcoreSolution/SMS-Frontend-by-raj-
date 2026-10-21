import React, { useState, useEffect, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import { 
  MessageSquare, 
  Send, 
  Lock, 
  Unlock,
  Eye, 
  RotateCcw, 
  X, 
  ShieldAlert, 
  Check, 
  Sparkles,
  ArrowLeft,
  Settings,
  AlertCircle,
  Search,
  Filter,
  Download,
  FileText,
  CheckCircle,
  RefreshCw,
  User,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Plus,
  ChevronRight,
  Shield,
  Trash2,
  CornerDownRight
} from "lucide-react";
import chatModerationService from "../api/chatModerationService";

export default function ChatModeration() {
  // Loading & Sync States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Stats State
  const [stats, setStats] = useState({
    totalConversations: 0,
    activeConversations: 0,
    lockedConversations: 0,
    flaggedCount: 0,
    pendingReports: 0,
    safetyIndex: 95,
    isMasterEnabled: true
  });

  // Policy Settings State
  const [settings, setSettings] = useState({
    chatEnabled: true,
    teacherStudentEnabled: true,
    teacherParentEnabled: true,
    studentStudentEnabled: false,
    restrictedHours: { enabled: false, startTime: "08:00", endTime: "18:00" },
    autoFilterProfanity: true,
    blockPhoneNumbers: true,
    notificationEmail: "safety@greenwood.edu"
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [studentFilter, setStudentFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("All"); // 'All' | 'Parent' | 'Student'
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'active' | 'locked' | 'flagged'
  const [severityFilter, setSeverityFilter] = useState("All"); // 'All' | 'Normal' | 'Warning' | 'Critical'

  // Conversations List
  const [conversations, setConversations] = useState([]);

  // Selected Conversation for Deep-Dive Inspector
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [inspectLoading, setInspectLoading] = useState(false);
  const [showOriginalMap, setShowOriginalMap] = useState({});
  const [newAdminNote, setNewAdminNote] = useState("");

  // Modals & Drawers
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showReportsDrawer, setShowReportsDrawer] = useState(false);
  const [reports, setReports] = useState([]);
  const [savingSettings, setSavingSettings] = useState(false);

  // ─── Fetch All Data from MongoDB ───
  const fetchAllData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setRefreshing(true);
    try {
      const [statsRes, settingsRes, convRes, reportsRes] = await Promise.all([
        chatModerationService.getStats().catch(() => null),
        chatModerationService.getSettings().catch(() => null),
        chatModerationService.getConversations({
          search: searchQuery || undefined,
          teacher: teacherFilter || undefined,
          student: studentFilter || undefined,
          type: typeFilter,
          status: statusFilter,
          severity: severityFilter
        }).catch(() => null),
        chatModerationService.getReports().catch(() => null)
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (settingsRes?.data) setSettings(settingsRes.data);
      if (convRes?.data) setConversations(convRes.data);
      if (reportsRes?.data) setReports(reportsRes.data);
    } catch (err) {
      console.error("Error loading chat moderation data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery, teacherFilter, studentFilter, typeFilter, statusFilter, severityFilter]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Open Full Conversation Inspector
  const handleOpenConversation = async (conv) => {
    setInspectLoading(true);
    try {
      const res = await chatModerationService.getConversation(conv.conversationId || conv._id);
      if (res?.success && res.data) {
        setSelectedConversation(res.data);
      } else {
        setSelectedConversation(conv);
      }
    } catch {
      setSelectedConversation(conv);
    } finally {
      setInspectLoading(false);
    }
  };

  // Toggle Lock Channel (With reason input)
  const handleToggleLock = async (conv, customReason = null) => {
    const isCurrentlyLocked = conv.isLocked;
    
    if (!isCurrentlyLocked && !customReason) {
      const { value: reason, isConfirmed } = await Swal.fire({
        title: "Lock Conversation Channel?",
        text: `Quarantine messaging between ${conv.teacherName} and ${conv.withUserName}.`,
        input: "text",
        inputPlaceholder: "Enter reason for quarantine (e.g. Inappropriate dispute, policy violation)",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Quarantine & Lock"
      });

      if (!isConfirmed) return;
      applyLockAction(conv, true, reason || "Quarantined by Administrator for policy review.");
    } else {
      const { isConfirmed } = await Swal.fire({
        title: "Unlock Conversation Channel?",
        text: `Restore active messaging permissions between ${conv.teacherName} and ${conv.withUserName}.`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#16a34a",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Unlock Channel"
      });

      if (isConfirmed) {
        applyLockAction(conv, false, "");
      }
    }
  };

  const applyLockAction = async (conv, isLocked, reason) => {
    try {
      const res = await chatModerationService.toggleLock(conv.conversationId || conv._id, {
        isLocked,
        reason,
        lockedBy: "Super Admin"
      });

      if (res?.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: isLocked ? "error" : "success",
          title: `Channel ${isLocked ? "Quarantined & Locked" : "Unlocked Successfully"}`,
          showConfirmButton: false,
          timer: 2500
        });

        // Update list & inspector reference
        setConversations(prev => prev.map(c => 
          (c.conversationId === conv.conversationId || c._id === conv._id) ? res.data : c
        ));

        if (selectedConversation && (selectedConversation.conversationId === conv.conversationId || selectedConversation._id === conv._id)) {
          setSelectedConversation(res.data);
        }

        // Refresh stats
        const statsRes = await chatModerationService.getStats().catch(() => null);
        if (statsRes?.data) setStats(statsRes.data);
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to update lock status", "error");
    }
  };

  // Redact Message for Safety Audit
  const handleRedactMessage = async (convId, msg) => {
    const { value: reason, isConfirmed } = await Swal.fire({
      title: "Redact Message for Audit?",
      html: `
        <p class="text-xs text-slate-500 mb-2">The message text will be replaced with an official compliance notice. Original content will remain strictly in administrator audit logs.</p>
        <div class="p-2.5 bg-slate-100 rounded-lg text-xs font-mono text-slate-700 text-left mb-3">"${msg.content}"</div>
      `,
      input: "text",
      inputPlaceholder: "Reason (e.g. Phone number sharing, profanity, bullying)",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Redact Message"
    });

    if (!isConfirmed) return;

    try {
      const res = await chatModerationService.redactMessage(convId, msg.messageId, {
        reason: reason || "Violated student communication guidelines.",
        removedBy: "Super Admin"
      });

      if (res?.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Message redacted for compliance",
          showConfirmButton: false,
          timer: 2000
        });

        setSelectedConversation(res.data);
        setConversations(prev => prev.map(c => (c.conversationId === convId || c._id === convId) ? res.data : c));
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to redact message", "error");
    }
  };

  // Restore Redacted Message
  const handleRestoreMessage = async (convId, msg) => {
    const { isConfirmed } = await Swal.fire({
      title: "Restore Original Message?",
      text: "This will revert the audit placeholder back to the original text.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Restore"
    });

    if (!isConfirmed) return;

    try {
      const res = await chatModerationService.restoreMessage(convId, msg.messageId);
      if (res?.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Message content restored",
          showConfirmButton: false,
          timer: 2000
        });

        setSelectedConversation(res.data);
        setConversations(prev => prev.map(c => (c.conversationId === convId || c._id === convId) ? res.data : c));
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to restore message", "error");
    }
  };

  // Add Internal Admin Note
  const handleAddAdminNote = async (e) => {
    e.preventDefault();
    if (!newAdminNote.trim() || !selectedConversation) return;

    try {
      const res = await chatModerationService.addAdminNote(selectedConversation.conversationId || selectedConversation._id, {
        note: newAdminNote.trim(),
        author: "Chief Moderator"
      });

      if (res?.success) {
        setNewAdminNote("");
        setSelectedConversation(res.data);
        setConversations(prev => prev.map(c => 
          (c.conversationId === selectedConversation.conversationId || c._id === selectedConversation._id) ? res.data : c
        ));
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to add admin note", "error");
    }
  };

  // Save Policy Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await chatModerationService.updateSettings(settings);
      if (res?.success) {
        setSavingSettings(false);
        setShowSettingsModal(false);
        Swal.fire({
          icon: "success",
          title: "Moderation Policy Saved!",
          text: "Updated policies are now enforced across live messaging channels.",
          timer: 2500,
          showConfirmButton: false
        });
        fetchAllData(true);
      }
    } catch (err) {
      setSavingSettings(false);
      Swal.fire("Error", err.response?.data?.message || "Failed to update policy", "error");
    }
  };

  // Resolve Safety Incident Report
  const handleResolveReport = async (report, newStatus) => {
    const { value: actionTaken, isConfirmed } = await Swal.fire({
      title: `${newStatus === 'Resolved' ? 'Resolve' : 'Dismiss'} Incident Report?`,
      input: "text",
      inputValue: report.actionTaken || (newStatus === 'Resolved' ? 'Investigation completed and actions enforced.' : 'Reviewed and found compliant.'),
      inputPlaceholder: "Action or resolution summary...",
      showCancelButton: true,
      confirmButtonColor: newStatus === 'Resolved' ? '#16a34a' : '#64748b',
      confirmButtonText: `Confirm ${newStatus}`
    });

    if (!isConfirmed) return;

    try {
      const res = await chatModerationService.resolveReport(report.reportId || report._id, {
        status: newStatus,
        actionTaken: actionTaken || report.actionTaken,
        resolvedBy: "Super Admin"
      });

      if (res?.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `Report marked as ${newStatus}`,
          showConfirmButton: false,
          timer: 2000
        });

        setReports(prev => prev.map(r => (r.reportId === report.reportId || r._id === report._id) ? res.data : r));
        const statsRes = await chatModerationService.getStats().catch(() => null);
        if (statsRes?.data) setStats(statsRes.data);
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to update report", "error");
    }
  };

  // Export Transcript as Clean Text File
  const handleExportTranscript = (conv) => {
    if (!conv) return;
    const lines = [
      `============================================================`,
      `ST. XAVIER / GREENWOOD ACADEMY - CHAT AUDIT TRANSCRIPT`,
      `Conversation ID: ${conv.conversationId || 'N/A'}`,
      `Teacher: ${conv.teacherName}`,
      `Participant: ${conv.withUserName} (${conv.type})`,
      `Student Name: ${conv.studentName} | Class: ${conv.className}`,
      `Channel Status: ${conv.isLocked ? 'QUARANTINED / LOCKED' : 'ACTIVE'}`,
      `Export Timestamp: ${new Date().toLocaleString()}`,
      `============================================================\n`
    ];

    (conv.messages || []).forEach((m, idx) => {
      const timeStr = m.timestamp ? new Date(m.timestamp).toLocaleString() : 'N/A';
      lines.push(`[${idx + 1}] [${timeStr}] ${m.sender} (${m.senderRole}):`);
      if (m.isAuditRemoved) {
        lines.push(`    [REDACTED AUDIT NOTICE]: ${m.content}`);
        lines.push(`    [REASON]: ${m.removedReason || 'Policy violation'}`);
        if (m.originalContent) {
          lines.push(`    [CONFIDENTIAL ARCHIVED TEXT]: ${m.originalContent}`);
        }
      } else {
        lines.push(`    ${m.content}`);
      }
      lines.push(``);
    });

    if (conv.adminNotes && conv.adminNotes.length > 0) {
      lines.push(`------------------------------------------------------------`);
      lines.push(`OFFICIAL MODERATOR AUDIT NOTES:`);
      conv.adminNotes.forEach(n => {
        lines.push(`• [${new Date(n.createdAt).toLocaleDateString()}] ${n.author}: ${n.note}`);
      });
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Audit_Transcript_${conv.conversationId || 'Chat'}_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Audit transcript exported",
      showConfirmButton: false,
      timer: 2000
    });
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setTeacherFilter("");
    setStudentFilter("");
    setTypeFilter("All");
    setStatusFilter("all");
    setSeverityFilter("All");
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800 pb-24">
      
      {/* ─── Hero Header Banner ─── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-slate-950/10 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400">
              Child Safety & Communications Surveillance
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-white/10 rounded-full border border-white/10 text-slate-300">
              Live MongoDB Sync
            </span>
            {!settings.chatEnabled && (
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-red-500/20 border border-red-500/40 text-red-300 rounded-full">
                System Chat Disabled
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Shield className="w-7 h-7 text-indigo-400 inline" />
            Chat Moderation & Child Safety Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Monitor real-time teacher-student and teacher-parent communication, audit quarantined channels, enforce safety keywords, and redact inappropriate messages.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10 self-start md:self-auto flex-wrap">
          <button
            onClick={() => fetchAllData()}
            disabled={refreshing}
            className="p-3 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-2xl text-white cursor-pointer border border-white/10"
            title="Reload from MongoDB"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          <button 
            onClick={() => setShowReportsDrawer(true)}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl transition-all flex items-center gap-2 cursor-pointer border border-white/10 relative"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Abuse Reports</span>
            {stats.pendingReports > 0 && (
              <span className="px-1.5 py-0.5 bg-red-500 text-white font-black text-[10px] rounded-full animate-bounce">
                {stats.pendingReports}
              </span>
            )}
          </button>

          <button 
            onClick={() => setShowSettingsModal(true)}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer border-none"
          >
            <Settings className="w-4 h-4" />
            <span>Policy Settings</span>
          </button>
        </div>
      </div>

      {/* ─── 4 Key Metrics Overview ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Channels */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Channels</span>
            <div className="text-2xl font-black text-slate-900">{stats.activeConversations}</div>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Safe & Monitored
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Quarantined Channels */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quarantined / Locked</span>
            <div className="text-2xl font-black text-red-600">{stats.lockedConversations}</div>
            <p className="text-[11px] text-slate-500 font-medium">Under admin review</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <Lock className="w-6 h-6" />
          </div>
        </div>

        {/* Flagged / Redacted Messages */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Flagged Messages</span>
            <div className="text-2xl font-black text-amber-600">{stats.flaggedCount}</div>
            <p className="text-[11px] text-amber-700 font-medium">Keywords / Contact flags</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Safety Compliance Score */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-5 rounded-3xl text-white shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-indigo-150 uppercase tracking-wider">Safety Index</span>
            <div className="text-2xl font-black">{stats.safetyIndex}%</div>
            <p className="text-[11px] text-indigo-100 font-medium">POCSO / Child Safe</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ─── Surveillance Filter Bar ─── */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Box */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teacher, student, or messages..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Type Filter */}
          <div className="md:col-span-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="Student">Student Channels</option>
              <option value="Parent">Parent Channels</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="locked">Quarantined / Locked</option>
              <option value="flagged">Flagged Messages Only</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="md:col-span-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Severities</option>
              <option value="Normal">Normal</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="md:col-span-2 flex justify-end">
            <button
              onClick={handleResetFilters}
              className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

        </div>
      </div>

      {/* ─── Surveillance Channels Table ─── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-black text-slate-900 text-base">Communication Channels Ledger</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {conversations.length} Threads
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active Surveillance
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-400 font-bold text-xs flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
            <span>Loading communication channels from database...</span>
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs font-semibold">
            No communication channels found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold text-[11px]">
                  <th className="py-3.5 px-4">Participants</th>
                  <th className="py-3.5 px-4">Student & Class</th>
                  <th className="py-3.5 px-4">Latest Message</th>
                  <th className="py-3.5 px-4">Safety Status</th>
                  <th className="py-3.5 px-4">Channel Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {conversations.map((conv) => {
                  const isLocked = conv.isLocked;
                  const hasFlags = (conv.flagCount || 0) > 0;
                  const isParent = conv.type === 'Parent';

                  return (
                    <tr 
                      key={conv.conversationId || conv._id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Participants */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                            isParent ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {conv.teacherName?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900">{conv.teacherName}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium">
                              <span>with {conv.withUserName}</span>
                              <span className={`px-1.5 py-0.2 rounded-md font-bold text-[9px] uppercase tracking-wider ${
                                isParent ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}>
                                {conv.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Student & Class */}
                      <td className="py-4 px-4 font-semibold text-slate-700">
                        <div>{conv.studentName}</div>
                        <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-0.5">
                          {conv.className || 'Class 10'}
                        </span>
                      </td>

                      {/* Latest Message Preview */}
                      <td className="py-4 px-4 max-w-xs">
                        <p className={`truncate font-medium ${
                          conv.lastMsg?.includes('removed') ? 'italic text-red-600 text-[11px]' : 'text-slate-600'
                        }`}>
                          {conv.lastMsg || '—'}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                          {conv.lastActivity || 'Recently'}
                        </span>
                      </td>

                      {/* Safety Status */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          {conv.severity === 'Critical' ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-red-500" /> Critical
                            </span>
                          ) : conv.severity === 'Warning' ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-500" /> Warning
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-500" /> Safe
                            </span>
                          )}

                          {hasFlags && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md">
                              {conv.flagCount} flag{conv.flagCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Channel Status (Locked vs Active) */}
                      <td className="py-4 px-4">
                        {isLocked ? (
                          <div className="space-y-0.5">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800 border border-red-200 flex items-center gap-1 w-fit">
                              <Lock className="w-3 h-3" /> Quarantined
                            </span>
                            {conv.lockReason && (
                              <p className="text-[10px] text-red-600/90 truncate max-w-[160px] font-medium" title={conv.lockReason}>
                                {conv.lockReason}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1 w-fit">
                            <Unlock className="w-3 h-3 text-emerald-500" /> Active
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenConversation(conv)}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl transition-colors flex items-center gap-1 text-[11px] cursor-pointer border border-indigo-200"
                            title="Inspect complete transcript & audit actions"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Transcript</span>
                          </button>

                          <button
                            onClick={() => handleToggleLock(conv)}
                            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                              isLocked 
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200' 
                                : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                            }`}
                            title={isLocked ? "Unlock Channel" : "Quarantine Channel"}
                          >
                            {isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── FULL TRANSCRIPT DRILL-DOWN MODAL ─── */}
      {selectedConversation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
            
            {/* Inspector Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white font-black text-sm">
                  {selectedConversation.teacherName?.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base text-white">
                      {selectedConversation.teacherName} ↔ {selectedConversation.withUserName}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-indigo-300 border border-white/10">
                      {selectedConversation.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    Student: {selectedConversation.studentName} • {selectedConversation.className} • ID: {selectedConversation.conversationId}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportTranscript(selectedConversation)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/15 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>

                <button
                  onClick={() => setSelectedConversation(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border-none cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Channel Security Banner */}
            <div className={`px-5 py-2.5 text-xs font-bold flex items-center justify-between border-b ${
              selectedConversation.isLocked 
                ? 'bg-red-50 text-red-800 border-red-200' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              <div className="flex items-center gap-2">
                {selectedConversation.isLocked ? <Lock className="w-4 h-4 text-red-600" /> : <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                <span>
                  {selectedConversation.isLocked 
                    ? `Quarantined Channel: ${selectedConversation.lockReason || 'Policy Violation'}` 
                    : 'Channel is Active & Clean under regular compliance surveillance'}
                </span>
              </div>

              <button
                onClick={() => handleToggleLock(selectedConversation)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold cursor-pointer border ${
                  selectedConversation.isLocked
                    ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
                    : 'bg-red-600 text-white border-red-700 hover:bg-red-700'
                }`}
              >
                {selectedConversation.isLocked ? "Unlock Channel" : "Quarantine Channel"}
              </button>
            </div>

            {/* Messages Transcript Scroll Area */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50/50">
              {(!selectedConversation.messages || selectedConversation.messages.length === 0) ? (
                <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                  No chat messages recorded in this channel yet.
                </div>
              ) : (
                selectedConversation.messages.map((m, idx) => {
                  const isTeacher = m.senderRole === 'Teacher';
                  const isRedacted = m.isAuditRemoved;
                  const showOriginal = showOriginalMap[m.messageId];

                  return (
                    <div 
                      key={m.messageId || idx}
                      className={`flex flex-col ${isTeacher ? 'items-end' : 'items-start'}`}
                    >
                      {/* Sender Info Pill */}
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-1 px-1">
                        <span>{m.sender}</span>
                        <span>•</span>
                        <span>{m.senderRole}</span>
                        <span>•</span>
                        <span>{m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                      </div>

                      {/* Bubble Container */}
                      <div className={`max-w-md p-4 rounded-2xl shadow-xs text-xs relative group ${
                        isRedacted
                          ? 'bg-red-50/90 border border-red-200 text-red-900 rounded-br-none'
                          : isTeacher
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                      }`}>
                        {/* Redacted Message Header Warning */}
                        {isRedacted ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-red-700 font-extrabold text-[11px]">
                              <ShieldAlert className="w-4 h-4 shrink-0" />
                              <span>{m.content}</span>
                            </div>
                            <p className="text-[10px] text-red-600 font-semibold bg-red-100/60 p-2 rounded-lg">
                              Reason: {m.removedReason || 'Violated student protection policy.'} (by {m.removedBy || 'Moderator'})
                            </p>

                            {/* View Original Toggle (Admin Only) */}
                            {m.originalContent && (
                              <div className="pt-2 border-t border-red-200/80">
                                <button
                                  type="button"
                                  onClick={() => setShowOriginalMap(prev => ({ ...prev, [m.messageId]: !prev[m.messageId] }))}
                                  className="text-[10px] font-bold text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <CornerDownRight className="w-3 h-3" />
                                  <span>{showOriginal ? "Hide Archived Content" : "View Archived Content (Confidential)"}</span>
                                </button>

                                {showOriginal && (
                                  <div className="mt-1.5 p-2 bg-white rounded-lg border border-red-200 text-slate-700 font-mono text-[11px]">
                                    "{m.originalContent}"
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Restore Button */}
                            <div className="pt-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleRestoreMessage(selectedConversation.conversationId || selectedConversation._id, m)}
                                className="px-2 py-1 bg-white hover:bg-slate-100 border border-red-300 text-red-700 font-bold text-[10px] rounded-lg cursor-pointer transition-colors"
                              >
                                Restore Content
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="leading-relaxed font-medium">{m.content}</p>
                            
                            {/* Hover Redact Action */}
                            <div className="mt-2 pt-2 border-t border-white/20 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleRedactMessage(selectedConversation.conversationId || selectedConversation._id, m)}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                                  isTeacher ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-red-50 hover:bg-red-100 text-red-600'
                                }`}
                              >
                                Redact for Audit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Internal Admin Notes Section */}
              <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                    Internal Moderator Notes & Case Annotations
                  </h4>
                </div>

                {(selectedConversation.adminNotes || []).length > 0 && (
                  <div className="space-y-2">
                    {selectedConversation.adminNotes.map((an, nIdx) => (
                      <div key={nIdx} className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs flex justify-between items-start">
                        <div>
                          <strong className="text-indigo-900 font-bold">{an.author}:</strong>
                          <p className="text-slate-700 mt-0.5">{an.note}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(an.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleAddAdminNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newAdminNote}
                    onChange={(e) => setNewAdminNote(e.target.value)}
                    placeholder="Add an internal observation or disciplinary note..."
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer border-none shadow-xs"
                  >
                    Post Note
                  </button>
                </form>
              </div>
            </div>

            {/* Inspector Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Audited by Greenwood ERP Child Safety Engine
              </span>
              <button
                onClick={() => setSelectedConversation(null)}
                className="px-5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── POLICY & SAFETY SETTINGS MODAL ─── */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base">Chat Moderation Policy</h3>
                  <p className="text-xs text-indigo-200 font-medium">System-wide rules for school chat compliance</p>
                </div>
              </div>
              <button onClick={() => setShowSettingsModal(false)} className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSaveSettings} className="p-6 space-y-5 overflow-y-auto flex-1 text-xs text-slate-700">
              
              {/* Master Chat Switch */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-slate-900 text-sm block">Master Chat Engine</span>
                  <p className="text-[11px] text-slate-500 font-medium">Toggle all messaging channels school-wide</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.chatEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, chatEnabled: e.target.checked }))}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              {/* Sub-channel Permissions */}
              <div className="space-y-3">
                <span className="font-extrabold text-slate-800 block text-xs uppercase tracking-wider">Channel Permissions</span>
                
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-900">Teacher ↔ Student Chat</span>
                    <p className="text-[10px] text-slate-500 font-medium">Allow students to query teachers regarding academic homework</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.teacherStudentEnabled}
                    onChange={(e) => setSettings(prev => ({ ...prev, teacherStudentEnabled: e.target.checked }))}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-900">Teacher ↔ Parent Chat</span>
                    <p className="text-[10px] text-slate-500 font-medium">Allow parents to coordinate student progress and PTM slots</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.teacherParentEnabled}
                    onChange={(e) => setSettings(prev => ({ ...prev, teacherParentEnabled: e.target.checked }))}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Automated Safeguards */}
              <div className="space-y-3 pt-2">
                <span className="font-extrabold text-slate-800 block text-xs uppercase tracking-wider">Automated Filters & Safeguards</span>

                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-900">Auto Profanity & Keyword Filter</span>
                    <p className="text-[10px] text-slate-500 font-medium">Quarantine or flag messages containing offensive keywords</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoFilterProfanity}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoFilterProfanity: e.target.checked }))}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-900">Block Phone Numbers & Outside Contacts</span>
                    <p className="text-[10px] text-slate-500 font-medium">Prevent sharing unverified personal phone numbers in chat</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.blockPhoneNumbers}
                    onChange={(e) => setSettings(prev => ({ ...prev, blockPhoneNumbers: e.target.checked }))}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Working Hours Restriction */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Restricted Operating Hours</span>
                  <input
                    type="checkbox"
                    checked={settings.restrictedHours?.enabled || false}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      restrictedHours: { ...prev.restrictedHours, enabled: e.target.checked }
                    }))}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                {settings.restrictedHours?.enabled && (
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500">Allow Chat From:</label>
                      <input
                        type="time"
                        value={settings.restrictedHours?.startTime || "08:00"}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          restrictedHours: { ...prev.restrictedHours, startTime: e.target.value }
                        }))}
                        className="w-full mt-1 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500">Allow Chat Until:</label>
                      <input
                        type="time"
                        value={settings.restrictedHours?.endTime || "18:00"}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          restrictedHours: { ...prev.restrictedHours, endTime: e.target.value }
                        }))}
                        className="w-full mt-1 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Safety Email */}
              <div className="space-y-1 pt-2">
                <label className="font-bold text-slate-700">Safety Incident Escalation Email</label>
                <input
                  type="email"
                  value={settings.notificationEmail || ""}
                  onChange={(e) => setSettings(prev => ({ ...prev, notificationEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer border-none flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{savingSettings ? "Saving..." : "Save Policies"}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ─── ABUSE & SAFETY REPORTS DRAWER / MODAL ─── */}
      {showReportsDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
            
            <div className="p-5 bg-gradient-to-r from-amber-600 to-orange-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base">Safety Incident Reports Queue</h3>
                  <p className="text-xs text-amber-100 font-medium">User complaints & automated AI profanity flags</p>
                </div>
              </div>
              <button onClick={() => setShowReportsDrawer(false)} className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {reports.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                  No incident reports currently pending. All communications are clean!
                </div>
              ) : (
                reports.map((rep) => (
                  <div 
                    key={rep.reportId || rep._id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            rep.severity === 'Critical' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {rep.severity} Severity
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rep.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {rep.status}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">{rep.reportId}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-xs mt-1.5">{rep.reason}</h4>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          Reported by <strong className="text-slate-700">{rep.reportedBy}</strong> ({rep.reporterRole}) • Student: {rep.studentName}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {rep.status !== 'Resolved' ? (
                          <>
                            <button
                              onClick={() => handleResolveReport(rep, 'Resolved')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer border-none shadow-xs"
                            >
                              Resolve
                            </button>
                            <button
                              onClick={() => handleResolveReport(rep, 'Dismissed')}
                              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold cursor-pointer"
                            >
                              Dismiss
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Resolved
                          </span>
                        )}
                      </div>
                    </div>

                    {rep.actionTaken && (
                      <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600 font-medium border border-slate-100">
                        <strong>Action Taken:</strong> {rep.actionTaken}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowReportsDrawer(false)}
                className="px-5 py-2 border border-slate-200 hover:bg-white text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
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

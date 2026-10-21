import React, { useState, useEffect, useMemo } from 'react';
import {
  Bell, BellRing, CheckCircle2, AlertTriangle, AlertCircle, CreditCard,
  GraduationCap, Calendar, UserCheck, Shield, HardDrive, Check, CheckCheck,
  Trash2, Search, Filter, ExternalLink, X, Eye, EyeOff, Clock,
  Settings as SettingsIcon, Info, ArrowRight, Sparkles, ShieldAlert
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import localDb from '../api/localDb';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState('ALL'); // ALL | UNREAD | finance | academic | hr | system
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL'); // ALL | urgent | high | normal | success
  const [selectedNotif, setSelectedNotif] = useState(null); // For detail preview modal

  // Load from localDb
  const loadNotifications = () => {
    try {
      setLoading(true);
      const list = localDb.getNotifications();
      setNotifications(list || []);
    } catch (e) {
      console.error(e);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      // Category filter
      if (activeCategory === 'UNREAD') {
        if (n.read) return false;
      } else if (activeCategory !== 'ALL') {
        if (n.category !== activeCategory) return false;
      }

      // Priority filter
      if (priorityFilter !== 'ALL' && n.priority !== priorityFilter) {
        return false;
      }

      // Search keyword
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = n.title?.toLowerCase().includes(q);
        const matchesMsg = n.message?.toLowerCase().includes(q);
        const matchesMeta = n.metadata && Object.values(n.metadata).some((v) => String(v).toLowerCase().includes(q));
        if (!matchesTitle && !matchesMsg && !matchesMeta) return false;
      }

      return true;
    });
  }, [notifications, activeCategory, priorityFilter, search]);

  // Overall KPIs
  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.read).length;
  const financeCount = notifications.filter((n) => n.category === 'finance').length;
  const urgentCount = notifications.filter((n) => n.priority === 'urgent' || n.priority === 'high').length;

  // Mark single as read
  const handleMarkAsRead = (id) => {
    const updated = localDb.markNotificationRead(id);
    setNotifications(updated);
  };

  // Mark single as unread
  const handleMarkAsUnread = (id) => {
    const updated = localDb.markNotificationUnread(id);
    setNotifications(updated);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Marked as unread',
      showConfirmButton: false,
      timer: 1500,
    });
  };

  // Mark all as read
  const handleMarkAllRead = () => {
    const updated = localDb.markAllNotificationsRead();
    setNotifications(updated);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'All notifications marked as read',
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // Delete notification
  const handleDelete = (id, e) => {
    if (e) e.stopPropagation();
    const updated = localDb.deleteNotification(id);
    setNotifications(updated);
    if (selectedNotif?.id === id) setSelectedNotif(null);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Notification removed',
      showConfirmButton: false,
      timer: 1500,
    });
  };

  // Clear read notifications
  const handleClearRead = async () => {
    const readCount = totalCount - unreadCount;
    if (readCount === 0) {
      Swal.fire('No Read Alerts', 'There are no read notifications to clear.', 'info');
      return;
    }

    const conf = await Swal.fire({
      title: `Clear ${readCount} read notifications?`,
      text: 'Archived and read notifications will be removed from your activity center.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dd4b39',
      confirmButtonText: 'Yes, clear read',
    });

    if (conf.isConfirmed) {
      const updated = localDb.clearReadNotifications();
      setNotifications(updated);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Cleared ${readCount} notifications`,
        showConfirmButton: false,
        timer: 1800,
      });
    }
  };

  // Navigate to actionUrl
  const handleNavigateAction = (url, notif) => {
    handleMarkAsRead(notif.id);
    if (url) {
      navigate(url);
    }
  };

  // Helper for Category Icon & Colors
  const getCategoryStyles = (category, priority) => {
    switch (category) {
      case 'finance':
        return {
          icon: CreditCard,
          iconBg: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
          badgeBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
          borderAccent: priority === 'urgent' ? 'border-l-[#dd4b39]' : 'border-l-[#00a65a]',
          label: 'Finance & Fees',
        };
      case 'academic':
        return {
          icon: GraduationCap,
          iconBg: 'bg-blue-100 text-[#3c8dbc] border border-blue-200',
          badgeBg: 'bg-blue-50 text-[#3c8dbc] border border-blue-200',
          borderAccent: 'border-l-[#3c8dbc]',
          label: 'Academic & Exams',
        };
      case 'hr':
        return {
          icon: UserCheck,
          iconBg: 'bg-purple-100 text-purple-700 border border-purple-200',
          badgeBg: 'bg-purple-50 text-purple-700 border border-purple-200',
          borderAccent: 'border-l-[#605ca8]',
          label: 'Faculty & HR',
        };
      case 'system':
      default:
        return {
          icon: priority === 'high' ? ShieldAlert : Shield,
          iconBg: priority === 'high' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-700 border border-slate-200',
          badgeBg: priority === 'high' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-50 text-slate-700 border border-slate-200',
          borderAccent: priority === 'high' ? 'border-l-[#f39c12]' : 'border-l-[#546e7a]',
          label: 'System & Security',
        };
    }
  };

  // Priority Pill
  const renderPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-black bg-red-100 text-red-700 border border-red-200 animate-pulse">
            <AlertCircle className="w-3 h-3" /> URGENT
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3" /> IMPORTANT
          </span>
        );
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-green-100 text-green-800 border border-green-200">
            <Check className="w-3 h-3 stroke-[3]" /> VERIFIED
          </span>
        );
      case 'normal':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
            INFO
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#ecf0f5] text-[#333] p-3 sm:p-5 font-sans">
      {/* ─── Top Header Ribbon ─── */}
      <div className="bg-white rounded-t-[3px] border-t-[3px] border-t-[#3c8dbc] shadow-sm p-4 sm:p-5 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#3c8dbc] shadow-sm relative">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#dd4b39] rounded-full border-2 border-white animate-pulse" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] sm:text-[22px] font-bold text-[#222d32] tracking-tight">Notification & Alert Center</h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-red-100 text-red-800 border border-red-200">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="text-[12.5px] text-gray-500 mt-0.5">
              Live updates on student fee transactions, administrative circulars, statutory alerts, and security events.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-[12.5px] font-semibold rounded border border-gray-300 shadow-xs transition-colors cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-[#00a65a]" />
              <span>Mark All as Read</span>
            </button>
          )}

          <button
            onClick={handleClearRead}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-[12.5px] font-medium rounded border border-gray-300 shadow-xs transition-colors cursor-pointer"
            title="Remove already read alerts"
          >
            <Trash2 className="w-4 h-4 text-gray-500" />
            <span>Clear Read</span>
          </button>

          <Link
            to="/settings"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-[12.5px] font-semibold rounded shadow-xs transition-colors cursor-pointer"
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Alert Preferences</span>
          </Link>
        </div>
      </div>

      {/* ─── Top 4 KPI Metrics ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* Total Notifications */}
        <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 flex items-center justify-between border-l-[4px] border-l-[#3c8dbc]">
          <div>
            <div className="text-[11.5px] font-bold text-gray-500 uppercase tracking-wider">Total Alerts</div>
            <div className="text-[22px] font-black text-gray-800 mt-0.5">{totalCount} Notifications</div>
            <div className="text-[11.5px] text-gray-500 mt-0.5">In accountant inbox</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#3c8dbc] flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
        </div>

        {/* Unread Alerts */}
        <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 flex items-center justify-between border-l-[4px] border-l-[#dd4b39]">
          <div>
            <div className="text-[11.5px] font-bold text-gray-500 uppercase tracking-wider">Pending Attention</div>
            <div className="text-[22px] font-black text-[#dd4b39] mt-0.5">{unreadCount} Unread</div>
            <div className="text-[11.5px] text-red-600 font-medium mt-0.5">Requires acknowledgment</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-50 text-[#dd4b39] flex items-center justify-center">
            <BellRing className="w-5 h-5" />
          </div>
        </div>

        {/* Financial Notices */}
        <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 flex items-center justify-between border-l-[4px] border-l-[#00a65a]">
          <div>
            <div className="text-[11.5px] font-bold text-gray-500 uppercase tracking-wider">Financial Transactions</div>
            <div className="text-[22px] font-black text-[#00a65a] mt-0.5">{financeCount} Receipts & Dues</div>
            <div className="text-[11.5px] text-emerald-600 font-medium mt-0.5">Fees & accounts events</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-50 text-[#00a65a] flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        {/* High Priority & Security */}
        <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-4 flex items-center justify-between border-l-[4px] border-l-[#f39c12]">
          <div>
            <div className="text-[11.5px] font-bold text-gray-500 uppercase tracking-wider">Urgent & Security</div>
            <div className="text-[22px] font-black text-[#f39c12] mt-0.5">{urgentCount} High Priority</div>
            <div className="text-[11.5px] text-gray-500 mt-0.5">Deadline & access alerts</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-[#f39c12] flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ─── Categorized Navigation Tabs Bar ─── */}
      <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-1.5 mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'ALL', label: 'All Alerts', count: totalCount },
            { id: 'UNREAD', label: 'Unread Only', count: unreadCount, badgeColor: 'bg-red-500 text-white' },
            { id: 'finance', label: 'Finance & Fees', count: financeCount },
            { id: 'academic', label: 'Academic & Circulars', count: notifications.filter((n) => n.category === 'academic').length },
            { id: 'hr', label: 'Staff & Leaves', count: notifications.filter((n) => n.category === 'hr').length },
            { id: 'system', label: 'System & Security', count: notifications.filter((n) => n.category === 'system').length },
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded text-[12.5px] font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#3c8dbc] text-white shadow-xs font-semibold'
                    : 'text-gray-600 hover:text-[#3c8dbc] hover:bg-blue-50/60'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10.5px] px-1.5 py-0.2 rounded-full font-bold ${
                    cat.badgeColor
                      ? cat.badgeColor
                      : isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 px-2">
          <span className="text-[12px] font-semibold text-gray-500">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-[12px] bg-white text-gray-700 outline-none focus:border-[#3c8dbc]"
          >
            <option value="ALL">All Priorities</option>
            <option value="urgent">🚨 Urgent Only</option>
            <option value="high">⚠️ Important</option>
            <option value="success">✅ Verified / Success</option>
            <option value="normal">ℹ️ Standard Info</option>
          </select>
        </div>
      </div>

      {/* ─── Search Bar ─── */}
      <div className="bg-white rounded-[3px] border border-gray-200 shadow-sm p-3 mb-5 flex items-center gap-3">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter notifications by keyword, student name, receipt number, or amount..."
          className="w-full text-[13px] text-gray-800 placeholder-gray-400 outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-[12px] text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* ─── Notification Feed List ─── */}
      {loading ? (
        <div className="bg-white rounded-[3px] border border-gray-200 p-12 text-center text-gray-500 shadow-sm">
          <div className="w-8 h-8 border-3 border-[#3c8dbc] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[13px] font-semibold">Loading notification center...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-[3px] border border-gray-200 p-12 text-center text-gray-500 shadow-sm">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-[15px] font-bold text-gray-700">No notifications found</h3>
          <p className="text-[13px] text-gray-400 mt-1 max-w-sm mx-auto">
            You are all caught up! No alerts match your current category or search filters.
          </p>
          <button
            onClick={() => {
              setActiveCategory('ALL');
              setPriorityFilter('ALL');
              setSearch('');
            }}
            className="mt-4 px-3.5 py-1.5 text-[12.5px] font-semibold text-[#3c8dbc] border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            const styles = getCategoryStyles(notif.category, notif.priority);
            const Icon = styles.icon;
            const isUnread = !notif.read;

            return (
              <div
                key={notif.id}
                onClick={() => setSelectedNotif(notif)}
                className={`group rounded-[3px] border transition-all duration-150 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer ${
                  isUnread
                    ? `bg-white border-gray-300 shadow-xs border-l-[4px] ${styles.borderAccent} hover:border-[#3c8dbc]`
                    : 'bg-white/80 border-gray-200 hover:bg-white hover:border-gray-300 opacity-90'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Category Icon */}
                  <div className={`p-2.5 rounded-full shrink-0 mt-0.5 ${styles.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Body Content */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[11px] font-bold px-2 py-0.2 rounded ${styles.badgeBg}`}>
                        {styles.label}
                      </span>
                      {renderPriorityBadge(notif.priority)}
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-[#dd4b39] shrink-0" title="Unread Alert" />
                      )}
                    </div>

                    <h3 className={`text-[14.5px] leading-snug ${isUnread ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'}`}>
                      {notif.title}
                    </h3>
                    <p className="text-[12.5px] text-gray-600 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>

                    {/* Meta chips */}
                    {notif.metadata && (
                      <div className="flex items-center gap-2 flex-wrap mt-2 text-[11px]">
                        {notif.metadata.student && (
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-semibold border border-gray-200">
                            Student: {notif.metadata.student} ({notif.metadata.class})
                          </span>
                        )}
                        {notif.metadata.amount && (
                          <span className="bg-emerald-50 px-2 py-0.5 rounded text-emerald-800 font-black border border-emerald-200">
                            Amount: ₹ {Number(notif.metadata.amount).toLocaleString('en-IN')}
                          </span>
                        )}
                        {notif.metadata.receipt && (
                          <span className="bg-blue-50 px-2 py-0.5 rounded text-[#3c8dbc] font-mono border border-blue-200">
                            Receipt: {notif.metadata.receipt}
                          </span>
                        )}
                        {notif.metadata.voucher && (
                          <span className="bg-amber-50 px-2 py-0.5 rounded text-amber-800 font-mono border border-amber-200">
                            Voucher: {notif.metadata.voucher}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Metadata & Action Buttons */}
                <div
                  className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1 text-[11.5px] text-gray-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{notif.timestamp}</span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1">
                    {notif.actionUrl && (
                      <button
                        onClick={() => handleNavigateAction(notif.actionUrl, notif)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#3c8dbc] border border-blue-200 text-[11.5px] font-bold rounded flex items-center gap-1 transition-colors cursor-pointer"
                        title="View related ERP record"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    {isUnread ? (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="p-1.5 text-gray-500 hover:text-[#00a65a] hover:bg-green-50 rounded transition-colors cursor-pointer"
                        title="Mark as Read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarkAsUnread(notif.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                        title="Mark as Unread"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={(e) => handleDelete(notif.id, e)}
                      className="p-1.5 text-gray-400 hover:text-[#dd4b39] hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* NOTIFICATION DETAIL PREVIEW MODAL                              */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {selectedNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[3px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#3c8dbc] text-white">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <h3 className="font-bold text-[15px]">Alert Specification</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotif(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                {renderPriorityBadge(selectedNotif.priority)}
                <span className="text-[12px] text-gray-500 font-mono">
                  {selectedNotif.datetime || selectedNotif.timestamp}
                </span>
              </div>

              <div>
                <h4 className="text-[16px] font-bold text-gray-900 leading-snug">
                  {selectedNotif.title}
                </h4>
                <p className="text-[13px] text-gray-700 mt-2 leading-relaxed bg-gray-50 p-3 rounded border border-gray-100">
                  {selectedNotif.message}
                </p>
              </div>

              {selectedNotif.metadata && (
                <div className="border border-gray-200 rounded p-3 bg-gray-50/50 space-y-1.5 text-[12.5px]">
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Event Metadata & Parameters
                  </div>
                  {Object.entries(selectedNotif.metadata).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-gray-100 last:border-0">
                      <span className="text-gray-500 capitalize">{key}:</span>
                      <span className="font-bold text-gray-800 font-mono">{String(val)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleDelete(selectedNotif.id)}
                  className="px-3 py-1.5 text-red-600 hover:bg-red-50 text-[12.5px] font-semibold rounded border border-red-200 cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      handleMarkAsRead(selectedNotif.id);
                      setSelectedNotif(null);
                    }}
                    className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[12.5px] font-semibold rounded cursor-pointer"
                  >
                    Close
                  </button>

                  {selectedNotif.actionUrl && (
                    <button
                      onClick={() => {
                        const url = selectedNotif.actionUrl;
                        setSelectedNotif(null);
                        handleNavigateAction(url, selectedNotif);
                      }}
                      className="px-4 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-[12.5px] font-bold rounded flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <span>Go to Module</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;

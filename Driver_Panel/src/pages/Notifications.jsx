import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Check, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  Wrench, 
  Calendar, 
  Megaphone, 
  Info, 
  Search, 
  X, 
  ArrowLeft, 
  CheckCircle2, 
  Filter, 
  RefreshCw,
  Building2,
  CalendarCheck,
  ChevronRight,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { driverService } from '../api/driverService';

// The 5 official categories specified for Transport Notice Board
const CATEGORIES = [
  'All',
  'Safety & Route',
  'Vehicle Maintenance',
  'Holiday',
  'Transport Advisory'
];

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [filterPriority, setFilterPriority] = useState('all'); // all | urgent | normal

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const res = await driverService.getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await driverService.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      if (selectedNotice && selectedNotice._id === id) {
        setSelectedNotice(prev => ({ ...prev, isRead: true }));
      }
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const unread = notifications.filter(n => !n.isRead);
      for (const notif of unread) {
        await driverService.markNotificationRead(notif._id);
      }
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
    }
  };

  // Helper for category styling and icons
  const getCategoryMeta = (cat) => {
    switch (cat) {
      case 'Safety & Route':
        return {
          icon: ShieldAlert,
          label: 'Safety & Route',
          badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          pillBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
          dotColor: 'bg-amber-500'
        };
      case 'Vehicle Maintenance':
        return {
          icon: Wrench,
          label: 'Vehicle Maintenance',
          badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300 dark:border-blue-800',
          pillBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
          dotColor: 'bg-blue-500'
        };
      case 'Holiday':
        return {
          icon: Calendar,
          label: 'Holiday',
          badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300 dark:border-purple-800',
          pillBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
          dotColor: 'bg-purple-500'
        };
      case 'Transport Advisory':
        return {
          icon: Megaphone,
          label: 'Transport Advisory',
          badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
          pillBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
          dotColor: 'bg-emerald-500'
        };
      default:
        return {
          icon: Bell,
          label: cat || 'General Notice',
          badgeClass: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
          pillBg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
          dotColor: 'bg-slate-500'
        };
    }
  };

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: notifications.length };
    CATEGORIES.slice(1).forEach(cat => {
      counts[cat] = notifications.filter(n => n.category === cat).length;
    });
    return counts;
  }, [notifications]);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      // 1. Category Filter
      if (selectedCategory !== 'All' && notif.category !== selectedCategory) {
        return false;
      }
      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = notif.title?.toLowerCase().includes(q);
        const msgMatch = (notif.message || notif.details || notif.summary)?.toLowerCase().includes(q);
        const catMatch = notif.category?.toLowerCase().includes(q);
        const badgeMatch = notif.badge?.toLowerCase().includes(q);
        const issuerMatch = notif.issuer?.toLowerCase().includes(q);
        if (!titleMatch && !msgMatch && !catMatch && !badgeMatch && !issuerMatch) {
          return false;
        }
      }
      // 3. Priority filter
      if (filterPriority === 'urgent' && notif.priority !== 'high') {
        return false;
      }
      return true;
    });
  }, [notifications, selectedCategory, searchQuery, filterPriority]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-5 animate-fade-in max-w-5xl mx-auto pb-8">
      
      {/* ===================== TOP HEADER ===================== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 hover:text-orange-600 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 font-serif">
                Campus Dispatch & Bulletins
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 mt-0.5">
              <span>Transport Notice Board</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Safety alerts, vehicle maintenance schedules, holiday calendars & driver bulletins
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-3.5 py-2 rounded-2xl bg-orange-50 dark:bg-orange-950/50 hover:bg-orange-100 text-[#ea580c] font-bold text-xs flex items-center gap-1.5 border border-orange-200 dark:border-orange-900/50 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark All Read ({unreadCount})</span>
            </button>
          )}

          <button
            onClick={fetchNotifs}
            disabled={loading}
            className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Refresh Notice Board"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* ===================== CATEGORY TABS (ALL, SAFETY & ROUTE, VEHICLE MAINTENANCE, HOLIDAY, TRANSPORT ADVISORY) ===================== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        
        {/* Horizontal Category Tab Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;
            const meta = getCategoryMeta(cat);
            const IconComponent = cat === 'All' ? Megaphone : meta.icon;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-serif font-black whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#ea580c] text-white shadow-md shadow-orange-500/20 scale-[1.02]'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{cat}</span>
                <span
                  className={`text-[10.5px] px-2 py-0.5 rounded-full font-sans font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Filter Bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search notices in ${selectedCategory}...`}
              className="w-full pl-9 pr-9 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Priority Toggle */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 text-xs">
            <span className="text-[11px] font-bold text-slate-400">Filter:</span>
            <button
              onClick={() => setFilterPriority('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterPriority === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              All Notices
            </button>
            <button
              onClick={() => setFilterPriority('urgent')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterPriority === 'urgent'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
              }`}
            >
              ⚠️ Urgent Only
            </button>
          </div>

        </div>

      </div>

      {/* ===================== NOTICES LIST ===================== */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[35vh] space-y-3 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800">
          <div className="w-9 h-9 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500">Loading notices & announcements...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-10 text-center space-y-3 shadow-sm">
          <div className="w-14 h-14 rounded-3xl bg-orange-50 dark:bg-orange-950/50 text-[#ea580c] flex items-center justify-center mx-auto shadow-sm">
            <Megaphone className="w-7 h-7 stroke-[2]" />
          </div>
          <h3 className="font-serif font-black text-base text-slate-900 dark:text-white">
            No Notices Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            {searchQuery 
              ? `No bulletins matched "${searchQuery}" in ${selectedCategory}.`
              : `There are currently no announcements under "${selectedCategory}".`}
          </p>
          {(searchQuery || filterPriority !== 'all' || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterPriority('all');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-2xl bg-orange-600 text-white text-xs font-bold shadow-md hover:bg-orange-700 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredNotifications.map((notif) => {
            const meta = getCategoryMeta(notif.category);
            const IconComponent = meta.icon;
            const dateStr = notif.createdAt 
              ? new Date(notif.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
              : 'Recent';
            const timeStr = notif.createdAt 
              ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '';

            return (
              <div
                key={notif._id}
                onClick={() => setSelectedNotice(notif)}
                className={`rounded-3xl border p-4 sm:p-5 transition-all cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.005] active:scale-[0.995] ${
                  notif.isRead
                    ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
                    : 'bg-orange-50/40 dark:bg-slate-800/80 border-orange-200 dark:border-orange-900/60 ring-1 ring-orange-500/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3.5">
                  
                  {/* Category Icon */}
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${
                    notif.priority === 'high' 
                      ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400' 
                      : meta.pillBg
                  }`}>
                    <IconComponent className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  {/* Main Notice Body */}
                  <div className="min-w-0 flex-1">
                    
                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {/* Category Tag */}
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${meta.badgeClass}`}>
                        {notif.category || 'General'}
                      </span>

                      {/* Priority Tag */}
                      {notif.priority === 'high' && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Urgent</span>
                        </span>
                      )}

                      {/* Unread Pill */}
                      {!notif.isRead && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-600 text-white flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          <span>New</span>
                        </span>
                      )}

                      {/* Date & Time */}
                      <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono ml-auto">
                        {dateStr} {timeStr && `• ${timeStr}`}
                      </span>
                    </div>

                    {/* Notice Title */}
                    <h3 className="font-serif font-black text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                      {notif.title}
                    </h3>

                    {/* Notice Description Snippet */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                      {notif.message || notif.details}
                    </p>

                    {/* Footer Row: Department issuer & Action button */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold">{notif.issuer || 'School Transport Dept.'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {!notif.isRead && (
                          <button
                            onClick={(e) => handleMarkRead(notif._id, e)}
                            className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800"
                            title="Mark as Read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <span className="text-[#ea580c] font-bold text-xs flex items-center gap-0.5 hover:underline">
                          <span>Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===================== NOTICE DETAIL MODAL ===================== */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  selectedNotice.priority === 'high' 
                    ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400' 
                    : getCategoryMeta(selectedNotice.category).pillBg
                }`}>
                  {React.createElement(getCategoryMeta(selectedNotice.category).icon, { className: 'w-5 h-5 stroke-[2.2]' })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${getCategoryMeta(selectedNotice.category).badgeClass}`}>
                      {selectedNotice.category || 'General'}
                    </span>
                    {selectedNotice.priority === 'high' && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white">
                        Urgent
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-black text-base text-slate-900 dark:text-white mt-1">
                    Transport Bulletin Details
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedNotice(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notice Title */}
            <div>
              <h4 className="font-serif font-black text-lg text-slate-900 dark:text-white leading-tight">
                📢 {selectedNotice.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                <span>
                  Date: {selectedNotice.createdAt 
                    ? new Date(selectedNotice.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
                    : 'Current Notice'}
                </span>
              </div>
            </div>

            {/* Detailed Content Box */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Official Announcement
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {selectedNotice.details || selectedNotice.message}
              </p>
            </div>

            {/* Issuer Information */}
            <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30">
              <div>
                <span className="text-[10.5px] text-slate-400 block font-medium">Issued Authority:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedNotice.issuer || 'School Safety & Fleet Management'}
                </span>
              </div>
              <div>
                <span className="text-[10.5px] text-slate-400 block font-medium">Target Audience:</span>
                <span className="font-bold text-orange-600">
                  Campus Fleet Drivers & Escorts
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setSelectedNotice(null)}
                className="flex-1 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleMarkRead(selectedNotice._id);
                  setSelectedNotice(null);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-[#ea580c] hover:bg-[#d9480f] text-white font-serif font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Acknowledge Notice</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

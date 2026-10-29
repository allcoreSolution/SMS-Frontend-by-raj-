import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, Check, UserPlus, Megaphone, Clock } from "lucide-react";
import { financeService } from '../../api/financeService';
import { noticeService } from '../../api/noticeService';
import { studentService } from '../../api/studentService';
import { getTranslation } from '../../utils/translations';

const fallbackActivities = [];

const formatRelativeTime = (dateObj) => {
  if (!dateObj || isNaN(new Date(dateObj))) return 'Recent';
  const diffMs = Date.now() - new Date(dateObj).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return `${Math.floor(diffDay / 7)}w ago`;
};

const formatShortDate = (dateObj) => {
  if (!dateObj || isNaN(new Date(dateObj))) return 'Today';
  const d = new Date(dateObj);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return 'Today';
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const formatShortTime = (dateObj) => {
  if (!dateObj || isNaN(new Date(dateObj))) return '12:00 PM';
  return new Date(dateObj).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const LiveActivity = () => {

  const [filter, setFilter] = useState('All');
  const [isExpanded, setIsExpanded] = useState(false);
  const [activities, setActivities] = useState([]);
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      const saved = localStorage.getItem('app_language');
      return (saved && saved.toLowerCase() === 'hindi') ? 'English' : (saved || 'English');
    } catch (e) {
      return 'English';
    }
  });

  // Listen to language changes
  useEffect(() => {
    const handleLangChange = (e) => {
      if (e.detail) setCurrentLang(e.detail);
    };
    window.addEventListener('app_language_changed', handleLangChange);
    return () => window.removeEventListener('app_language_changed', handleLangChange);
  }, []);

  // Fetch real data from backend
  const fetchRealActivities = async () => {
    try {
      const [txRes, noticeRes, studentRes] = await Promise.allSettled([
        financeService.getAllTransactions({ limit: 12 }),
        noticeService.getNotices(),
        studentService.getStudents({ limit: 8 })
      ]);

      const liveItems = [];

      // 1. Fee Transactions
      if (txRes.status === 'fulfilled' && Array.isArray(txRes.value?.data)) {
        txRes.value.data.forEach((tx) => {
          const sName = tx.studentName || (tx.student ? `${tx.student.firstName || ''} ${tx.student.lastName || ''}`.trim() : null) || 'Student';
          const amount = Number(tx.amountPaid || tx.amount || 0);
          const dateVal = tx.paymentDate || tx.createdAt || new Date();

          liveItems.push({
            id: `tx-${tx._id || Math.random()}`,
            type: 'Fees',
            title: `${sName} paid ₹${amount.toLocaleString('en-IN')} fee`,
            time: formatRelativeTime(dateVal),
            status: "Paid",
            date: formatShortDate(dateVal),
            timeString: formatShortTime(dateVal),
            icon: Check,
            bg: "bg-emerald-500",
            statusColor: "text-emerald-700 bg-emerald-50",
            timestamp: new Date(dateVal).getTime()
          });
        });
      }

      // 2. School Notices
      if (noticeRes.status === 'fulfilled' && Array.isArray(noticeRes.value?.data)) {
        noticeRes.value.data.forEach((n) => {
          const dateVal = n.publishDate || n.createdAt || new Date();
          liveItems.push({
            id: `notice-${n._id || Math.random()}`,
            type: 'Notice',
            title: `Notice — ${n.title || 'Official Announcement'}`,
            time: formatRelativeTime(dateVal),
            status: "Notice",
            date: formatShortDate(dateVal),
            timeString: formatShortTime(dateVal),
            icon: Megaphone,
            bg: "bg-pink-600",
            statusColor: "text-pink-700 bg-pink-50",
            timestamp: new Date(dateVal).getTime()
          });
        });
      }

      // 3. Recent Admissions
      if (studentRes.status === 'fulfilled') {
        const studentList = studentRes.value?.data || (Array.isArray(studentRes.value) ? studentRes.value : []);
        if (Array.isArray(studentList)) {
          studentList.slice(0, 5).forEach((s) => {
            const sName = `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.admissionNo || 'New Pupil';
            const dateVal = s.admissionDate || s.createdAt || new Date();
            liveItems.push({
              id: `student-${s._id || Math.random()}`,
              type: 'Admission',
              title: `${sName} — Admission Completed`,
              time: formatRelativeTime(dateVal),
              status: "Admission",
              date: formatShortDate(dateVal),
              timeString: formatShortTime(dateVal),
              icon: UserPlus,
              bg: "bg-teal-500",
              statusColor: "text-teal-700 bg-teal-50",
              timestamp: new Date(dateVal).getTime()
            });
          });
        }
      }

      if (liveItems.length > 0) {
        liveItems.sort((a, b) => b.timestamp - a.timestamp);
        setActivities(liveItems);
      } else {
        setActivities([]);
      }
    } catch (err) {
      console.warn("Live activity fallback", err);
    }
  };

  useEffect(() => {
    fetchRealActivities();
    const handleRefresh = () => fetchRealActivities();
    window.addEventListener('command_center_refresh_data', handleRefresh);
    return () => window.removeEventListener('command_center_refresh_data', handleRefresh);
  }, []);

  const filteredActivities = filter === 'All' 
    ? activities 
    : activities.filter(a => a.type === filter);

  return (
    <div className={`bg-white rounded-xl shadow-xs border border-gray-100 p-5 flex flex-col transition-all ${
      isExpanded ? 'fixed inset-4 sm:inset-10 z-50 shadow-2xl overflow-hidden' : 'h-full'
    }`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className="text-base font-bold text-gray-800">
            {getTranslation('liveActivity', currentLang)}
          </h2>
          <p className="text-xs text-gray-400">
            {getTranslation('realTimeUpdates', currentLang)}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setFilter('All')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
              filter === 'All' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {getTranslation('All', currentLang).split(' ')[0]}
          </button>
          <button 
            onClick={() => setFilter('Fees')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
              filter === 'Fees' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {getTranslation('fees', currentLang).split(' ')[0]}
          </button>
          <button 
            onClick={() => setFilter('Notice')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
              filter === 'Notice' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {getTranslation('notice', currentLang)}
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer ml-1"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity, index) => (
            <div key={activity.id} className="relative pl-11 pb-3">
              {/* Timeline connector line */}
              {index !== filteredActivities.length - 1 && (
                <div className="absolute left-4 top-8 bottom-0 w-[1.5px] bg-gray-100"></div>
              )}
              
              {/* Round Icon */}
              <div className={`absolute left-0 top-0.5 w-8 h-8 rounded-full flex items-center justify-center text-white ${activity.bg} shadow-2xs z-10 ring-2 ring-white`}>
                <activity.icon className="w-4 h-4" />
              </div>
              
              {/* Content */}
              <div className="flex justify-between items-start">
                <div className="pr-2">
                  <p className="text-xs font-bold text-gray-800 leading-snug">{activity.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-gray-400">{activity.time}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-sm ${activity.statusColor}`}>
                      {getTranslation(activity.status, currentLang) || activity.status}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] text-gray-700 font-semibold">{activity.date}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{activity.timeString}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-xs text-gray-400 space-y-1">
            <p className="font-semibold text-gray-600">No activity recorded for this school yet</p>
            <p className="text-[11px] text-gray-400">Newly registered school — start by admitting students or adding staff.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveActivity;

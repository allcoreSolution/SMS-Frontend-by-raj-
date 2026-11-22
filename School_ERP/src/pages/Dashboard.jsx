import React, { useState, useEffect } from 'react';
import { Megaphone } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import EcosystemHub from '../components/dashboard/EcosystemHub';
import LiveActivity from '../components/dashboard/LiveActivity';
import DashboardBottomWidgets from '../components/dashboard/BottomWidgets';
import { studentService } from '../api/studentService';
import { financeService } from '../api/financeService';
import { attendanceService } from '../api/attendanceService';
import { hrService } from '../api/hrService';
import { noticeService } from '../api/noticeService';
import axiosInstance from '../api/axios';
import { getTranslation } from '../utils/translations';

export default function Dashboard() {
  // User & School context
  const userStr = localStorage.getItem('user');
  let userData = null;
  if (userStr) {
    try { userData = JSON.parse(userStr); } catch (e) {}
  }

  const [metrics, setMetrics] = useState({
    totalStudents: '0',
    monthlyCollection: '₹0',
    attendanceToday: '0%',
    activeStaff: '0',
    pendingDues: '₹0'
  });

  const [latestNotice, setLatestNotice] = useState('All Core School ERP • Ready');

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      const saved = localStorage.getItem('app_language');
      return (saved && saved.toLowerCase() === 'hindi') ? 'English' : (saved || 'English');
    } catch (e) {
      return 'English';
    }
  });

  // Listen to global language change
  useEffect(() => {
    const handleLangChange = (e) => {
      if (e.detail) setCurrentLang(e.detail);
    };
    window.addEventListener('app_language_changed', handleLangChange);
    return () => window.removeEventListener('app_language_changed', handleLangChange);
  }, []);

  useEffect(() => {
    // Keep date accurate
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Synchronize school & tenant from URL parameters (e.g. from Branch Admin or Super Admin)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tid = urlParams.get('schoolId') || urlParams.get('tenant') || urlParams.get('branchId');
      const sname = urlParams.get('schoolName') || urlParams.get('name');
      if (tid) {
        localStorage.setItem('schoolId', tid);
        localStorage.setItem('active_school_id', tid);
      }
      if (sname) {
        localStorage.setItem('schoolName', sname);
        setCurrentSchoolName(sname);
      }
    } catch (_) {}
  }, []);

  // Active School Name State
  const [currentSchoolName, setCurrentSchoolName] = useState(() => {
    const s = localStorage.getItem('schoolName');
    return (s && s !== 'Greenwood International School' && s !== 'RAM INTERNATIONAL SCHOOL') ? s : 'ALL CORE SOLUTION';
  });

  // Fetch real metrics from backend API
  const fetchStats = async () => {
    try {
      const activeTenantId = localStorage.getItem('schoolId') || localStorage.getItem('active_school_id') || '';
      const params = activeTenantId ? { tenant: activeTenantId } : {};

      const [studentRes, transactionRes, attRes, staffRes, feesDashRes, noticeRes] = await Promise.allSettled([
        studentService.getStudents({ limit: 1, ...params }),
        financeService.getAllTransactions({ limit: 100, ...params }),
        attendanceService.getAttendanceSummary(params),
        hrService.getStaff({ limit: 1, ...params }),
        axiosInstance.get('/fees-dashboard', { params }),
        noticeService.getNotices()
      ]);

      if (studentRes.status === 'fulfilled') {
        const val = studentRes.value;
        const count = val?.pagination?.total ?? val?.total ?? val?.count ?? (Array.isArray(val?.data) ? val.data.length : null);
        setMetrics(prev => ({ ...prev, totalStudents: count !== null && count !== undefined ? Number(count).toLocaleString() : '0' }));
      } else {
        setMetrics(prev => ({ ...prev, totalStudents: '0' }));
      }

      if (feesDashRes.status === 'fulfilled' && feesDashRes.value?.data?.data) {
        const fData = feesDashRes.value.data.data;
        setMetrics(prev => ({
          ...prev,
          monthlyCollection: `₹${Number(fData.totalCollected || 0).toLocaleString('en-IN')}`,
          pendingDues: `₹${Number(fData.totalDue || 0).toLocaleString('en-IN')}`
        }));
      } else if (transactionRes.status === 'fulfilled') {
        const txs = Array.isArray(transactionRes.value?.data) ? transactionRes.value.data : [];
        const totalPaid = txs.reduce((acc, curr) => acc + (Number(curr.amountPaid) || Number(curr.amount) || 0), 0);
        setMetrics(prev => ({
          ...prev,
          monthlyCollection: `₹${Number(totalPaid || 0).toLocaleString('en-IN')}`,
          pendingDues: '₹0'
        }));
      } else {
        setMetrics(prev => ({ ...prev, monthlyCollection: '₹0', pendingDues: '₹0' }));
      }

      const attPercent = attRes.value?.data?.data?.percentage ?? attRes.value?.data?.percentage;
      if (attRes.status === 'fulfilled' && attPercent !== undefined) {
        setMetrics(prev => ({ ...prev, attendanceToday: `${attPercent}` }));
      } else {
        setMetrics(prev => ({ ...prev, attendanceToday: '0%' }));
      }

      if (staffRes.status === 'fulfilled') {
        const val = staffRes.value;
        const staffCount = val?.pagination?.total ?? val?.total ?? val?.count ?? (Array.isArray(val?.data) ? val.data.length : null);
        setMetrics(prev => ({ ...prev, activeStaff: staffCount !== null && staffCount !== undefined ? Number(staffCount).toString() : '0' }));
      } else {
        setMetrics(prev => ({ ...prev, activeStaff: '0' }));
      }

      if (noticeRes.status === 'fulfilled' && Array.isArray(noticeRes.value?.data) && noticeRes.value.data.length > 0) {
        setLatestNotice(noticeRes.value.data[0].title);
      } else {
        setLatestNotice('All Core School ERP • Ready');
      }
    } catch (err) {
      console.warn("Stats fetch fallback", err);
    }
  };

  useEffect(() => {
    fetchStats();
    const handleRefresh = () => {
      const s = localStorage.getItem('schoolName');
      if (s && s !== 'Greenwood International School') setCurrentSchoolName(s);
      fetchStats();
    };
    window.addEventListener('command_center_refresh_data', handleRefresh);
    window.addEventListener('school_changed', handleRefresh);
    return () => {
      window.removeEventListener('command_center_refresh_data', handleRefresh);
      window.removeEventListener('school_changed', handleRefresh);
    };
  }, []);

  // User & School greeting
  const schoolDisplayName = userData?.username || userData?.name || 'School Administrator';
  const schoolName = currentSchoolName || userData?.tenant?.schoolName || 'ALL CORE SOLUTION';

  // Time-based greeting with localization
  const hour = currentDate.getHours();
  let greeting = getTranslation('goodMorning', currentLang);
  if (hour >= 12 && hour < 17) greeting = getTranslation('goodAfternoon', currentLang);
  else if (hour >= 17) greeting = getTranslation('goodEvening', currentLang);

  // Date formatting matching screenshot: "Wednesday, 26 August 2026"
  const localeCode = currentLang === 'Hindi' ? 'hi-IN' : (currentLang === 'Spanish' ? 'es-ES' : 'en-GB');
  const formattedDate = currentDate.toLocaleDateString(localeCode, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-7 space-y-5 max-w-[1720px] mx-auto font-sans">
      
      {/* ── 1. Modern Executive SaaS Banner ───────────────────────────────── */}
      <div className="relative rounded-3xl bg-slate-950 border border-slate-800 p-5 sm:p-6 text-white shadow-xl overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full mb-2.5 border border-amber-400/30 uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ALL CORE SOLUTION • SCHOOL ERP OPERATING SYSTEM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{greeting}, {schoolDisplayName}</span>
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-xs sm:text-[13px] font-medium text-slate-400 mt-1">
            {getTranslation('whatsHappening', currentLang)} <strong className="text-slate-200">{schoolName}</strong> {getTranslation('today', currentLang)} — {formattedDate}
          </p>
        </div>

        {/* Live Announcement Ticker */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="inline-flex items-center bg-slate-900/90 border border-slate-700/80 rounded-xl shadow-inner overflow-hidden h-10 text-xs max-w-md">
            <div className="h-full px-3.5 bg-orange-500/15 text-orange-400 font-bold flex items-center gap-1.5 border-r border-slate-700/80 shrink-0">
              <Megaphone className="w-3.5 h-3.5 text-orange-400" />
              <span>{getTranslation('updates', currentLang)}</span>
            </div>
            <div className="px-3.5 text-xs text-slate-300 font-medium truncate max-w-[220px] sm:max-w-[280px]">
              {latestNotice}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Top 5 Metric KPI Cards (Compact Standard Size) ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {/* Card 1: Total Students */}
        <StatCard 
          title={getTranslation('totalStudents', currentLang)}
          value={metrics.totalStudents}
          icon="student"
          iconBg="bg-[#0284c7]"
          color="#0284c7"
          data={[0, 0, 0, 0]}
        />

        {/* Card 2: Collected This Month */}
        <StatCard 
          title={getTranslation('collectedThisMonth', currentLang)}
          value={metrics.monthlyCollection}
          icon="money"
          iconBg="bg-[#10b981]"
          trend={metrics.monthlyCollection !== '₹0' ? '+0%' : null}
          trendColor="text-emerald-700 bg-emerald-50"
          color="#10b981"
          data={[0, 0, 0, 0]}
        />

        {/* Card 3: Attendance Today */}
        <StatCard 
          title={getTranslation('attendanceToday', currentLang)}
          value={metrics.attendanceToday}
          icon="attendance"
          iconBg="bg-[#6366f1]"
          color="#6366f1"
          data={[0, 0, 0, 0]}
        />

        {/* Card 4: Active Staff */}
        <StatCard 
          title={getTranslation('activeStaff', currentLang)}
          value={metrics.activeStaff}
          icon="staff"
          iconBg="bg-[#8b5cf6]"
          color="#8b5cf6"
          data={[0, 0, 0, 0]}
        />

        {/* Card 5: Pending Dues */}
        <StatCard 
          title={getTranslation('pendingDues', currentLang)}
          value={metrics.pendingDues}
          icon="pending"
          iconBg="bg-[#f43f5e]"
          color="#f43f5e"
          data={[0, 0, 0, 0]}
        />
      </div>

      {/* ── 3. Ecosystem Hub & Live Activity ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Ecosystem Hub */}
        <div className="lg:col-span-8">
          <EcosystemHub />
        </div>

        {/* Right Column: Live Activity */}
        <div className="lg:col-span-4">
          <LiveActivity />
        </div>
      </div>

      {/* ── 4. Bottom Horizontal Widgets ────────────────────────────── */}
      <div className="pt-2">
        <DashboardBottomWidgets />
      </div>

    </div>
  );
}

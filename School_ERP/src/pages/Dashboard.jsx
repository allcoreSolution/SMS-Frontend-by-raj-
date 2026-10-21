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
import axiosInstance from '../api/axios';
import { getTranslation } from '../utils/translations';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalStudents: '280',
    monthlyCollection: '₹15,28,876',
    attendanceToday: '13%',
    activeStaff: '10',
    pendingDues: '₹92,34,500'
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      return localStorage.getItem('app_language') || 'English';
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

  // Fetch real metrics from backend API
  const fetchStats = async () => {
    try {
      const [studentRes, transactionRes, attRes, staffRes, feesDashRes] = await Promise.allSettled([
        studentService.getStudents({ limit: 1 }),
        financeService.getAllTransactions({ limit: 100 }),
        attendanceService.getAttendanceSummary(),
        hrService.getStaff({ limit: 1 }),
        axiosInstance.get('/fees-dashboard')
      ]);

      if (studentRes.status === 'fulfilled') {
        const count = studentRes.value?.total || studentRes.value?.count || (Array.isArray(studentRes.value?.data) ? studentRes.value.data.length : null);
        if (count && count > 0) {
          setMetrics(prev => ({ ...prev, totalStudents: count.toLocaleString() }));
        }
      }

      if (feesDashRes.status === 'fulfilled' && feesDashRes.value?.data?.data) {
        const fData = feesDashRes.value.data.data;
        if (fData.totalCollected > 0) {
          setMetrics(prev => ({ ...prev, monthlyCollection: `₹${Number(fData.totalCollected).toLocaleString('en-IN')}` }));
        }
        if (fData.totalDue > 0) {
          setMetrics(prev => ({ ...prev, pendingDues: `₹${Number(fData.totalDue).toLocaleString('en-IN')}` }));
        }
      } else if (transactionRes.status === 'fulfilled' && Array.isArray(transactionRes.value?.data)) {
        const txs = transactionRes.value.data;
        const totalPaid = txs.reduce((acc, curr) => acc + (Number(curr.amountPaid) || Number(curr.amount) || 0), 0);
        if (totalPaid > 0) {
          setMetrics(prev => ({ ...prev, monthlyCollection: `₹${totalPaid.toLocaleString('en-IN')}` }));
        }
      }

      if (attRes.status === 'fulfilled' && attRes.value?.data?.percentage) {
        setMetrics(prev => ({ ...prev, attendanceToday: `${attRes.value.data.percentage}%` }));
      }

      if (staffRes.status === 'fulfilled') {
        const staffCount = staffRes.value?.total || staffRes.value?.count || (Array.isArray(staffRes.value?.data) ? staffRes.value.data.length : null);
        if (staffCount && staffCount > 0) {
          setMetrics(prev => ({ ...prev, activeStaff: staffCount.toString() }));
        }
      }
    } catch (err) {
      console.warn("Stats fetch fallback", err);
    }
  };

  useEffect(() => {
    fetchStats();
    const handleRefresh = () => fetchStats();
    window.addEventListener('command_center_refresh_data', handleRefresh);
    return () => window.removeEventListener('command_center_refresh_data', handleRefresh);
  }, []);

  // User & School greeting
  const userStr = localStorage.getItem('user');
  let userData = null;
  if (userStr) {
    try { userData = JSON.parse(userStr); } catch (e) {}
  }
  const schoolDisplayName = userData?.username || userData?.name || 'school';
  const schoolName = userData?.tenant?.schoolName || 'ALL CORE SOLUTION';

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
      
      {/* ── 1. Greeting & Updates Bar ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            {greeting}, {schoolDisplayName} <span className="text-xl">👋</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {getTranslation('whatsHappening', currentLang)} {schoolName} {getTranslation('today', currentLang)} — {formattedDate}
          </p>
        </div>

        {/* Updates Action / Announcement Ticker */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center bg-white border border-gray-200/90 rounded-lg shadow-2xs overflow-hidden h-8 text-xs">
            <button className="h-full px-3 bg-orange-50 hover:bg-orange-100/80 text-[#ff5c0a] font-bold flex items-center gap-1.5 transition-colors cursor-pointer border-r border-gray-200/80">
              <Megaphone className="w-3.5 h-3.5 text-[#ff5c0a]" />
              <span>{getTranslation('updates', currentLang)}</span>
            </button>
            <div className="px-3 text-xs text-gray-600 font-medium truncate max-w-[200px] sm:max-w-[260px]">
              Fee Distribution (Sep 17)
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Top 5 Metric KPI Cards ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Students */}
        <StatCard 
          title={getTranslation('totalStudents', currentLang)}
          value={metrics.totalStudents}
          icon="student"
          iconBg="bg-[#0284c7]"
          color="#0284c7"
          data={[15, 18, 22, 26, 25, 29, 34, 38]}
        />

        {/* Card 2: Collected This Month */}
        <StatCard 
          title={getTranslation('collectedThisMonth', currentLang)}
          value={metrics.monthlyCollection}
          icon="money"
          iconBg="bg-[#10b981]"
          trend="1133%"
          trendColor="text-emerald-700 bg-emerald-50"
          color="#10b981"
          data={[10, 14, 18, 25, 32, 28, 45, 52]}
        />

        {/* Card 3: Attendance Today */}
        <StatCard 
          title={getTranslation('attendanceToday', currentLang)}
          value={metrics.attendanceToday}
          icon="attendance"
          iconBg="bg-[#6366f1]"
          color="#6366f1"
          data={[28, 26, 24, 20, 18, 16, 14, 13]}
        />

        {/* Card 4: Active Staff */}
        <StatCard 
          title={getTranslation('activeStaff', currentLang)}
          value={metrics.activeStaff}
          icon="staff"
          iconBg="bg-[#8b5cf6]"
          color="#8b5cf6"
          data={[10, 10, 10, 10, 10, 10, 10, 10]}
        />

        {/* Card 5: Pending Dues */}
        <StatCard 
          title={getTranslation('pendingDues', currentLang)}
          value={metrics.pendingDues}
          icon="pending"
          iconBg="bg-[#f43f5e]"
          color="#f43f5e"
          data={[45, 42, 38, 35, 30, 28, 25, 22]}
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

      {/* DEVELOPER BRANDING & ATTRIBUTION FOOTER */}
      <footer className="mt-8 pt-4 pb-4 border-t border-gray-200/80 text-center">
        <p className="text-[12px] font-bold text-gray-700 tracking-wide mb-1">
          &copy; 2026 School ERP
        </p>
        <p className="text-[11px] font-medium text-gray-500">
          Developed by <span className="text-gray-900 font-bold">RAJ YADAV</span> <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent font-bold">@ALLCORE SOLUTION</span>
        </p>
      </footer>

    </div>
  );
}

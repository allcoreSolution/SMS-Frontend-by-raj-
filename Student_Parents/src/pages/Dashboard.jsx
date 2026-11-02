import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Calendar, Video, ClipboardList, PenLine, Wallet, CheckSquare,
  Laptop, Grid3X3, GraduationCap, ChevronRight, User, RefreshCw,
  Clock, CheckCircle2, AlertCircle, Megaphone, Info, Dumbbell,
  BadgeCheck, HelpCircle, X, ChevronLeft, CalendarDays, Star,
  BookOpen, Sparkles, Award, Shield, FileText, Phone, School, QrCode,
  Bus, Users, Handshake
} from 'lucide-react';
import { parentService } from '../api/parentService';

const getMediaUrl = (photoPath) => {
  if (!photoPath) return null;
  if (photoPath.startsWith('http') || photoPath.startsWith('data:')) return photoPath;
  const baseUrl = (typeof window !== 'undefined' && window.__API_BASE_URL__) 
    || (typeof window !== 'undefined' && localStorage.getItem('api_base_url'))
    || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5050' : 'http://192.168.1.20:5050');
  const serverOrigin = String(baseUrl).replace(/\/api\/?$/, '');
  return `${serverOrigin}${photoPath.startsWith('/') ? '' : '/'}${photoPath}`;
};

// 9 Quick Action Modules (3 Columns on Mobile Phones) with English & Hindi support
// 9 Quick Action Modules with English & Hindi support, tailored for Student vs Parent
const getQuickModules = (lang, isStudent = false) => {
  if (isStudent) {
    return [
      { 
        key: 'timetable', 
        label: lang === 'hi' ? 'समय सारणी' : 'Timetable', 
        icon: Calendar, 
        color: '#8B5CF6', 
        bg: 'bg-purple-50 hover:bg-purple-100/80', 
        iconBg: 'bg-purple-100 text-purple-600',
        border: 'border-purple-200/80', 
        route: '/timetable' 
      },
      { 
        key: 'homework', 
        label: lang === 'hi' ? 'गृहकार्य' : 'Homework', 
        icon: ClipboardList, 
        color: '#F97316', 
        bg: 'bg-orange-50 hover:bg-orange-100/80', 
        iconBg: 'bg-orange-100 text-orange-600',
        border: 'border-orange-200/80', 
        route: '/homework' 
      },
      { 
        key: 'onlineExams', 
        label: lang === 'hi' ? 'ऑनलाइन परीक्षा' : 'CBT Exams', 
        icon: Laptop, 
        color: '#EC4899', 
        bg: 'bg-pink-50 hover:bg-pink-100/80', 
        iconBg: 'bg-pink-100 text-pink-600',
        border: 'border-pink-200/80', 
        route: '/online-exams' 
      },
      { 
        key: 'onlineClasses', 
        label: lang === 'hi' ? 'लाइव क्लास' : 'Live Class', 
        icon: Video, 
        color: '#EF4444', 
        bg: 'bg-rose-50 hover:bg-rose-100/80', 
        iconBg: 'bg-rose-100 text-rose-600',
        border: 'border-rose-200/80', 
        route: '/live-classes' 
      },
      { 
        key: 'studyCenter', 
        label: lang === 'hi' ? 'स्टडी नोट्स' : 'Study Notes', 
        icon: BookOpen, 
        color: '#06B6D4', 
        bg: 'bg-cyan-50 hover:bg-cyan-100/80', 
        iconBg: 'bg-cyan-100 text-cyan-600',
        border: 'border-cyan-200/80', 
        route: '/study-center' 
      },
      { 
        key: 'attendance', 
        label: lang === 'hi' ? 'मेरी उपस्थिति' : 'My Attendance', 
        icon: CheckSquare, 
        color: '#2563EB', 
        bg: 'bg-blue-50 hover:bg-blue-100/80', 
        iconBg: 'bg-blue-100 text-blue-600',
        border: 'border-blue-200/80', 
        route: '/attendance' 
      },
      { 
        key: 'library', 
        label: lang === 'hi' ? 'लाइब्रेरी' : 'Library', 
        icon: BookOpen, 
        color: '#9333EA', 
        bg: 'bg-purple-50 hover:bg-purple-100/80', 
        iconBg: 'bg-purple-100 text-purple-600',
        border: 'border-purple-200/80', 
        route: '/library' 
      },
      { 
        key: 'noticeBoard', 
        label: lang === 'hi' ? 'सूचनाएं' : 'Notices', 
        icon: Megaphone, 
        color: '#D97706', 
        bg: 'bg-amber-50 hover:bg-amber-100/80', 
        iconBg: 'bg-amber-100 text-amber-700',
        border: 'border-amber-200/80', 
        route: '/notice-board' 
      },
      { 
        key: 'viewAll', 
        label: lang === 'hi' ? 'सभी मॉड्यूल' : 'All Modules', 
        icon: Grid3X3, 
        color: '#2563EB', 
        bg: 'bg-indigo-50 hover:bg-indigo-100/80', 
        iconBg: 'bg-indigo-100 text-indigo-600',
        border: 'border-indigo-200/80', 
        route: '/all-modules' 
      },
    ];
  }

  // Parent Quick Modules
  return [
    { 
      key: 'fees', 
      label: lang === 'hi' ? 'शुल्क भुगतान' : 'Pay Fees', 
      icon: Wallet, 
      color: '#10B981', 
      bg: 'bg-emerald-50 hover:bg-emerald-100/80', 
      iconBg: 'bg-emerald-100 text-emerald-600',
      border: 'border-emerald-200/80', 
      route: '/fee-payments' 
    },
    { 
      key: 'attendance', 
      label: lang === 'hi' ? 'उपस्थिति' : 'Attendance', 
      icon: CheckSquare, 
      color: '#2563EB', 
      bg: 'bg-blue-50 hover:bg-blue-100/80', 
      iconBg: 'bg-blue-100 text-blue-600',
      border: 'border-blue-200/80', 
      route: '/attendance' 
    },
    { 
      key: 'timetable', 
      label: lang === 'hi' ? 'समय सारणी' : 'Timetable', 
      icon: Calendar, 
      color: '#8B5CF6', 
      bg: 'bg-purple-50 hover:bg-purple-100/80', 
      iconBg: 'bg-purple-100 text-purple-600',
      border: 'border-purple-200/80', 
      route: '/timetable' 
    },
    { 
      key: 'homework', 
      label: lang === 'hi' ? 'गृहकार्य' : 'Homework', 
      icon: ClipboardList, 
      color: '#F97316', 
      bg: 'bg-orange-50 hover:bg-orange-100/80', 
      iconBg: 'bg-orange-100 text-orange-600',
      border: 'border-orange-200/80', 
      route: '/homework' 
    },
    { 
      key: 'meetings', 
      label: lang === 'hi' ? 'पीटीएम बैठक' : 'PTM Meets', 
      icon: Users, 
      color: '#06B6D4', 
      bg: 'bg-cyan-50 hover:bg-cyan-100/80', 
      iconBg: 'bg-cyan-100 text-cyan-600',
      border: 'border-cyan-200/80', 
      route: '/meetings' 
    },
    { 
      key: 'schoolVisit', 
      label: lang === 'hi' ? 'विजिट पास' : 'Visit Pass', 
      icon: QrCode, 
      color: '#EC4899', 
      bg: 'bg-pink-50 hover:bg-pink-100/80', 
      iconBg: 'bg-pink-100 text-pink-600',
      border: 'border-pink-200/80', 
      route: '/school-visit' 
    },
    { 
      key: 'transport', 
      label: lang === 'hi' ? 'स्कूल बस' : 'Transport', 
      icon: Bus, 
      color: '#EF4444', 
      bg: 'bg-rose-50 hover:bg-rose-100/80', 
      iconBg: 'bg-rose-100 text-rose-600',
      border: 'border-rose-200/80', 
      route: '/transport' 
    },
    { 
      key: 'noticeBoard', 
      label: lang === 'hi' ? 'सूचनाएं' : 'Notices', 
      icon: Megaphone, 
      color: '#D97706', 
      bg: 'bg-amber-50 hover:bg-amber-100/80', 
      iconBg: 'bg-amber-100 text-amber-700',
      border: 'border-amber-200/80', 
      route: '/notice-board' 
    },
    { 
      key: 'viewAll', 
      label: lang === 'hi' ? 'सभी मॉड्यूल' : 'All Modules', 
      icon: Grid3X3, 
      color: '#2563EB', 
      bg: 'bg-indigo-50 hover:bg-indigo-100/80', 
      iconBg: 'bg-indigo-100 text-indigo-600',
      border: 'border-indigo-200/80', 
      route: '/all-modules' 
    },
  ];
};

const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_HI = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];
const MONTHS_HI = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
];

export default function Dashboard({ activeChild, setActiveChild }) {
  const navigate = useNavigate();
  const { currentLang, t } = useLanguage();

  // Real current date initialization
  const today = new Date();
  const [curDate, setCurDate] = useState(() => new Date());
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);
  const [activeNoticeModal, setActiveNoticeModal] = useState(null);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showIdCardModal, setShowIdCardModal] = useState(false);

  const y = curDate.getFullYear();
  const m = curDate.getMonth();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const firstDay = new Date(y, m, 1).getDay();
  const prevMonthDays = new Date(y, m, 0).getDate();

  // Fetch real data from backend API
  const fetchDashboardData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const parentUser = localStorage.getItem('parent_user');
      let parentId = null;
      if (parentUser) {
        try {
          const parsed = JSON.parse(parentUser);
          parentId = parsed.parentId || parsed._id;
        } catch (e) {}
      }

      const res = await parentService.getDashboard({
        studentId: activeChild || undefined,
        parentId: parentId || undefined,
        month: m + 1,
        year: y
      });

      if (res && res.success && res.data) {
        setDashboardData(res.data);
        if ((!activeChild || activeChild === '1') && res.data.student && res.data.student._id && setActiveChild) {
          if (activeChild !== res.data.student._id) {
            setActiveChild(res.data.student._id);
          }
        }
      }
    } catch (err) {
      console.warn('Backend live metrics sync warning:', err?.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const handleChildChanged = (e) => {
      if (e.detail) {
        fetchDashboardData();
      }
    };
    window.addEventListener('portal_child_changed', handleChildChanged);
    return () => window.removeEventListener('portal_child_changed', handleChildChanged);
  }, [activeChild, m, y]);

  // Detect role from localStorage
  const storedUser = localStorage.getItem('parent_user');
  let userRole = 'Parent';
  let parentUserName = 'Parent';
  if (storedUser) {
    try {
      const u = JSON.parse(storedUser);
      userRole = u.role || 'Parent';
      parentUserName = u.name || 'Parent';
    } catch (e) {}
  }
  const isStudent = String(userRole).toLowerCase() === 'student';

  // Multilingual dynamic data
  const quickModules = getQuickModules(currentLang, isStudent);
  const DAYS = currentLang === 'hi' ? DAYS_HI : DAYS_EN;
  const MONTHS = currentLang === 'hi' ? MONTHS_HI : MONTHS_EN;

  // Dynamic student identity from backend
  const student = {
    name: dashboardData?.student?.name || '—',
    class: dashboardData?.student?.class || '—',
    photo: dashboardData?.student?.photo || null,
    admn: dashboardData?.student?.admn || dashboardData?.student?.admissionNo || '—',
    roll: dashboardData?.student?.roll || dashboardData?.student?.rollNo || '—',
    session: dashboardData?.student?.academicSession || '—',
    dob: dashboardData?.student?.dob || '—',
    bloodGroup: dashboardData?.student?.bloodGroup || '—',
    attendanceToday: dashboardData?.attendance?.today || (currentLang === 'hi' ? 'उपस्थित' : 'Present'),
    attendanceRate: dashboardData?.attendance?.rate || '94%',
    attendanceStreak: dashboardData?.attendance?.streak || null
  };

  // Fees details from backend
  const feeDueAmount = dashboardData?.fees?.feesBalance || (currentLang === 'hi' ? 'पूर्ण चुकता' : 'All Clear');
  const feeStatus = dashboardData?.fees?.status || (currentLang === 'hi' ? 'पूर्ण चुकता' : 'All Clear');

  // Notices from backend or fallback
  const defaultNotices = [];

  const notices = (dashboardData?.notices && dashboardData.notices.length > 0)
    ? dashboardData.notices.map(n => {
        if (currentLang !== 'hi') return n;
        const t = (n.title || '').toLowerCase();
        let titleHi = n.title;
        let bodyHi = n.body;
        if (t.includes('library')) {
          titleHi = 'पुस्तकालय सप्ताह: कृपया उधार ली गई पुस्तकें वापस करें';
          bodyHi = 'यह पुस्तकालय सप्ताह है। विलंब शुल्क से बचने के लिए कृपया इस सप्ताह के अंत तक सभी पुस्तकें जमा कराएं।';
        } else if (t.includes('application') || t.includes('portal') || t.includes('launch')) {
          titleHi = 'समाचार अलर्ट: विद्यार्थी व अभिभावक डिजिटल पोर्टल लाइव';
          bodyHi = 'आदरणीय अभिभावकगण, नमस्कार! विद्यालय द्वारा फीस भुगतान, समय सारणी और उपस्थिति ट्रैकिंग के लिए डिजिटल मोबाइल पोर्टल लाइव कर दिया गया है।';
        } else if (t.includes('olympiad') || t.includes('science') || t.includes('robotics')) {
          titleHi = 'इंटर-स्कूल साइंस व रोबोटिक्स ओलंपियाड 2026';
          bodyHi = 'मुख्य विज्ञान सभागार में राज्य स्तरीय विज्ञान प्रदर्शनी और नवाचार प्रतियोगिता। सभी छात्र कल तक अपने मॉडल अवश्य पंजीकृत कराएं।';
        } else if (t.includes('diwali') || t.includes('autumn') || t.includes('break')) {
          titleHi = 'दीपावली एवं शरद कालीन अवकाश सूचना';
          bodyHi = 'स्कूल में 29 अक्टूबर से दीपावली व शरदकालीन अवकाश रहेगा। नियमित शीतकालीन समय सारणी के साथ परिसर पुनः खुलेगा।';
        }
        return {
          ...n,
          title: titleHi,
          body: bodyHi,
          date: n.date ? (currentLang === 'hi' ? `${n.date} को प्रकाशित` : n.date) : n.date
        };
      })
    : defaultNotices;

  return (
    <div className="w-full max-w-full px-2.5 sm:px-5 lg:px-7 py-3 sm:py-5 space-y-3.5 sm:space-y-4 bg-[#F8FAFF] min-h-screen font-sans text-slate-800 select-none pb-24 lg:pb-8">
      
      {/* ── DESKTOP HEADER BAR ── */}
      <div className="hidden lg:flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif">
            {isStudent 
              ? (currentLang === 'hi' ? 'विद्यार्थी पोर्टल डैशबोर्ड' : 'Student Portal Dashboard')
              : (currentLang === 'hi' ? 'अभिभावक पोर्टल डैशबोर्ड' : 'Parent Portal Dashboard')
            }
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {isStudent
              ? (currentLang === 'hi' ? 'स्मार्ट कैंपस में आपका स्वागत है • रियल-टाइम एकेडमिक हब' : 'Welcome to Student Portal • Real-time Academic & Attendance Hub')
              : (currentLang === 'hi' ? 'अभिभावक पोर्टल में आपका स्वागत है • रियल-टाइम वार्ड एकेडमिक व मॉनिटरिंग डेस्क' : 'Welcome to Parent Portal • Real-time Student Academic & Monitoring Desk')
            }
          </p>
        </div>
        <button
          onClick={() => fetchDashboardData(true)}
          className="flex items-center gap-1.5 text-xs text-blue-600 font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? (currentLang === 'hi' ? 'सिंक हो रहा है...' : 'Syncing...') : (currentLang === 'hi' ? 'लाइव सिंक' : 'Sync Live')}</span>
        </button>
      </div>

      {/* ── MAIN CONTENT 2-COLUMN GRID ── */}
      <div className="grid grid-cols-12 gap-3.5 sm:gap-4 items-start">

        {/* ── LEFT / PRIMARY COLUMN (COMPACT & MOBILE-FIRST) ── */}
        <div className="col-span-12 lg:col-span-7 xl:col-span-6 flex flex-col gap-3 sm:gap-3.5">

          {/* 1. COMPACT HERO ID CARD (ADAPTIVE FOR STUDENT VS PARENT) */}
          <div className={`w-full bg-gradient-to-r ${
            isStudent 
              ? 'from-[#1E3A8A] via-[#2563EB] to-[#1D4ED8] shadow-[0_6px_18px_-4px_rgba(37,99,235,0.3)]' 
              : 'from-[#065F46] via-[#059669] to-[#047857] shadow-[0_6px_18px_-4px_rgba(5,150,105,0.3)]'
          } rounded-2xl sm:rounded-3xl p-3 sm:p-4 text-white border border-white/20 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>

            <div className="flex items-center gap-2.5 sm:gap-3.5 relative z-10">
              {/* Avatar with Online Status Dot (NEVER CLIPPED) */}
              <div className="relative shrink-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-white/90 shadow-md bg-white/20 overflow-hidden flex items-center justify-center shrink-0">
                  <img 
                    src={getMediaUrl(student.photo) || '/kabir_singh.png'} 
                    alt={student.name}
                    className="w-full h-full object-cover shrink-0"
                    onError={(e) => { e.target.src = '/kabir_singh.png'; }}
                  />
                </div>
                <span 
                  className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border-2 border-white shadow-xs" 
                  title="Enrolled Active Student"
                />
              </div>

              {/* Identity info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-[10px] font-bold text-blue-100 tracking-wide uppercase">
                    {isStudent
                      ? (currentLang === 'hi' ? '🎓 विद्यार्थी वर्कस्पेस' : '🎓 Student Workspace')
                      : (currentLang === 'hi' ? '👨‍👩‍👧 अभिभावक डेस्क' : '👨‍👩‍👧 Parent Portal Desk')}
                  </p>
                  <button
                    onClick={() => setShowIdCardModal(true)}
                    className="shrink-0 text-[10px] font-black bg-white hover:bg-slate-100 text-slate-900 px-2 py-0.5 rounded-full shadow-2xs transition-transform active:scale-95 cursor-pointer"
                  >
                    {isStudent 
                      ? (currentLang === 'hi' ? 'पहचान पत्र देखें →' : 'View ID Card →')
                      : (currentLang === 'hi' ? 'विद्यार्थी आईडी →' : 'Student ID →')
                    }
                  </button>
                </div>
                <h2 className="text-base sm:text-xl font-black text-white font-serif tracking-tight truncate leading-tight mt-0.5">
                  {isStudent ? student.name : `${currentLang === 'hi' ? 'नमस्ते' : 'Welcome'}, ${parentUserName}`}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span className="bg-white/20 backdrop-blur-xs text-white text-[9.5px] sm:text-[10.5px] font-bold px-2 py-0.2 rounded-full border border-white/20">
                    {isStudent ? student.class : `${currentLang === 'hi' ? 'वार्ड' : 'Ward'}: ${student.name} (${student.class})`}
                  </span>
                  <span className="bg-white/25 text-white text-[9.5px] font-black px-1.5 py-0.2 rounded-full shadow-2xs">
                    {isStudent 
                      ? (currentLang === 'hi' ? 'सक्रिय विद्यार्थी ✅' : 'Active Student ✅') 
                      : (currentLang === 'hi' ? 'अभिभावक खाता ✅' : 'Parent Account ✅')}
                  </span>
                </div>
              </div>
            </div>

            {/* 3-Column Compact Details Strip */}
            <div className="mt-2.5 bg-black/20 backdrop-blur-xs rounded-xl p-1.5 sm:p-2 border border-white/15 grid grid-cols-3 gap-1 text-center relative z-10">
              <div className="text-left pl-1 min-w-0">
                <p className="text-[8.5px] text-blue-200 uppercase font-bold truncate">
                  {currentLang === 'hi' ? 'प्रवेश सं.' : 'Admission No.'}
                </p>
                <p className="text-[11px] sm:text-xs font-black text-white tracking-tight truncate">
                  {student.admn}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[8.5px] text-blue-200 uppercase font-bold truncate">
                  {currentLang === 'hi' ? 'रोल नंबर' : 'Roll Number'}
                </p>
                <p className="text-[11px] sm:text-xs font-black text-white tracking-tight truncate">
                  {student.roll}
                </p>
              </div>
              <div className="text-right pr-1 min-w-0">
                <p className="text-[8.5px] text-blue-200 uppercase font-bold truncate">
                  {currentLang === 'hi' ? 'सत्र' : 'Session'}
                </p>
                <p className="text-[11px] sm:text-xs font-black text-white tracking-tight truncate">
                  {student.session}
                </p>
              </div>
            </div>
          </div>

          {/* 2. QUICK ACTIONS (3 COLUMNS ON MOBILE PHONES) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 shadow-xs">
            <div className="flex items-center justify-between mb-2 px-0.5">
              <div className="flex items-center gap-1.5">
                <Grid3X3 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                <h3 className="text-xs sm:text-sm font-black text-slate-900 font-serif tracking-tight">
                  {currentLang === 'hi' ? 'त्वरित मॉड्यूल' : 'Quick Modules'}
                </h3>
              </div>
              <button
                onClick={() => navigate('/all-modules')}
                className="text-[10.5px] font-bold text-[#2563EB] hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>{currentLang === 'hi' ? 'सभी देखें (18)' : 'View All (18)'}</span>
                <ChevronRight className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>

            {/* 3 COLUMNS BALANCED GRID (3x3 for 9 modules, clean & untruncated) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {quickModules.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.key}
                    type="button"
                    onClick={() => navigate(action.route)}
                    className="flex flex-col items-center justify-center py-2.5 sm:py-3 px-1.5 sm:px-2 rounded-xl sm:rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xs border border-slate-200/80 hover:border-blue-300 transition-all active:scale-95 cursor-pointer text-center group"
                  >
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform ${action.iconBg}`}>
                      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" strokeWidth={2.2} />
                    </div>
                    <span className="mt-1.5 text-[10.5px] sm:text-[11.5px] font-extrabold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors whitespace-nowrap">
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. NOTICE TICKER (COMPACT & SLEEK) */}
          <div
            onClick={() => navigate('/notice-board')}
            className="w-full bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1.5 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-blue-100/60 transition-colors shadow-2xs group"
          >
            <div className="w-5 h-5 rounded-md bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Megaphone className="w-3 h-3 stroke-[2.2] shrink-0" />
            </div>
            <p className="text-[10.5px] sm:text-xs font-bold text-[#1E3A8A] truncate flex-1 min-w-0 leading-tight">
              {notices.length > 0 ? notices[0].title : (currentLang === 'hi' ? 'कोई नई सूचना नहीं है' : 'No new notices at this time')}
            </p>
            <ChevronRight className="w-3.5 h-3.5 text-[#2563EB] group-hover:translate-x-0.5 transition-transform shrink-0" />
          </div>

          {/* 4. COMPACT SCHOOL INFORMATION BANNER */}
          <div
            onClick={() => setShowSchoolModal(true)}
            className="w-full bg-white border border-[#2563EB]/25 rounded-xl p-2 sm:p-2.5 shadow-2xs flex items-center gap-2.5 cursor-pointer hover:border-[#2563EB] transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center shrink-0">
              <School className="w-4 h-4 stroke-[2.2] shrink-0" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight font-serif truncate">
                  {dashboardData?.school?.name || (currentLang === 'hi' ? 'विद्यालय' : 'School')}
                </h4>
                <span className="shrink-0 bg-[#10B981]/15 text-[#10B981] font-bold text-[8.5px] px-1.5 py-0.2 rounded-full border border-[#10B981]/25">
                  {currentLang === 'hi' ? 'सीबीएसई संबद्ध' : 'CBSE Affiliated'}
                </span>
              </div>
              <p className="text-[9.5px] sm:text-[10.5px] text-slate-500 truncate mt-0.2">
                {dashboardData?.school?.tagline || (currentLang === 'hi' ? 'ज्ञान, सत्यनिष्ठा और उत्कृष्टता' : 'Knowledge, Integrity & Excellence')}
              </p>
            </div>
          </div>

          {/* 5. SIDE-BY-SIDE FEATURE CARDS: 3 COLUMNS ON MOBILE (grid-cols-3) */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {/* School Staff */}
            <div
              onClick={() => navigate('/school-visit')}
              className="bg-white border border-[#2563EB]/25 rounded-xl p-1.5 sm:p-2 shadow-2xs flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#2563EB] transition-all active:scale-95 group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BadgeCheck className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
              </div>
              <p className="text-[10px] sm:text-[11px] font-black text-slate-900 font-serif leading-tight mt-1 truncate w-full">
                {currentLang === 'hi' ? 'स्कूल स्टाफ' : 'School Staff'}
              </p>
              <p className="text-[8.5px] sm:text-[9px] font-bold text-[#2563EB] mt-0.5 truncate w-full">
                {currentLang === 'hi' ? 'सूची देखें →' : 'Directory →'}
              </p>
            </div>

            {/* Coaching */}
            <div
              onClick={() => navigate('/coaching')}
              className="bg-white border border-[#10B981]/30 rounded-xl p-1.5 sm:p-2 shadow-2xs flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#10B981] transition-all active:scale-95 group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Dumbbell className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
              </div>
              <p className="text-[10px] sm:text-[11px] font-black text-slate-900 font-serif leading-tight mt-1 truncate w-full">
                {currentLang === 'hi' ? 'कोचिंग' : 'Coaching'}
              </p>
              <p className="text-[8.5px] sm:text-[9px] font-bold text-[#10B981] mt-0.5 truncate w-full">
                {currentLang === 'hi' ? 'कक्षाएं →' : 'Classes →'}
              </p>
            </div>

            {/* Study Center */}
            <div
              onClick={() => navigate('/study-center')}
              className="bg-white border border-purple-200/80 rounded-xl p-1.5 sm:p-2 shadow-2xs flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-400 transition-all active:scale-95 group"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
              </div>
              <p className="text-[10px] sm:text-[11px] font-black text-slate-900 font-serif leading-tight mt-1 truncate w-full">
                {currentLang === 'hi' ? 'स्टडी सेंटर' : 'Study Center'}
              </p>
              <p className="text-[8.5px] sm:text-[9px] font-bold text-purple-600 mt-0.5 truncate w-full">
                {currentLang === 'hi' ? 'डायरी →' : 'Logbook →'}
              </p>
            </div>
          </div>

          {/* 6. TODAY'S ATTENDANCE STATUS CARD (COMPACT) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {currentLang === 'hi' ? 'आज की उपस्थिति स्थिति' : "Today's Attendance Status"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-lg sm:text-xl font-black text-[#10B981] font-serif tracking-tight">
                    {student.attendanceToday}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 stroke-[2.5]" />
                </div>
                <p className="text-[9.5px] text-slate-400 font-medium mt-0.2">
                  {dashboardData?.attendance?.inTime ? (currentLang === 'hi' ? `प्रवेश • ${dashboardData.attendance.inTime}` : `Entry • ${dashboardData.attendance.inTime}`) : (currentLang === 'hi' ? 'दैनिक उपस्थिति' : 'Daily Attendance')}
                </p>
              </div>

              {/* Compact Circular Progress Gauge */}
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
                <svg className="w-11 h-11 sm:w-12 sm:h-12 transform -rotate-90">
                  <circle
                    cx="22"
                    cy="22"
                    r="17"
                    stroke="#E2E8F0"
                    strokeWidth="3.5"
                    fill="transparent"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r="17"
                    stroke="#2563EB"
                    strokeWidth="3.5"
                    strokeDasharray={2 * Math.PI * 17}
                    strokeDashoffset={(2 * Math.PI * 17) * (1 - 0.948)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute font-serif font-black text-slate-800 text-[10px] sm:text-[11px]">
                  {student.attendanceRate}
                </span>
              </div>
            </div>

            {/* Attendance Streak Banner */}
            <div className="mt-2 bg-[#F59E0B]/12 border border-[#F59E0B]/30 rounded-lg py-1 px-2.5 text-center flex items-center justify-center gap-1">
              <span className="text-[10px] sm:text-[10.5px] font-bold text-[#D97706]">
                {currentLang === 'hi' ? '🔥 14 दिन लगातार उपस्थिति स्ट्रीक!' : '🔥 14 Days Continuous Attendance Streak!'}
              </span>
            </div>
          </div>

          {/* 7. 4 COMPACT METRICS CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
            {/* Card 1: Pending Homework */}
            <div
              onClick={() => navigate('/homework')}
              className="bg-white border border-[#F97316]/25 rounded-xl p-2 shadow-2xs flex items-center gap-2 cursor-pointer hover:border-[#F97316] transition-all"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#F97316]/12 text-[#F97316] flex items-center justify-center shrink-0">
                <ClipboardList className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight truncate">
                  {dashboardData?.homeworkCount !== undefined ? `${dashboardData.homeworkCount} ${currentLang === 'hi' ? 'लंबित' : 'Pending'}` : '—'}
                </p>
                <p className="text-[8.5px] sm:text-[9.5px] font-medium text-slate-500 truncate">
                  {currentLang === 'hi' ? 'गृहकार्य' : 'Homework'}
                </p>
              </div>
            </div>

            {/* Card 2: Pending Classwork */}
            <div
              onClick={() => navigate('/classwork')}
              className="bg-white border border-[#6366F1]/25 rounded-xl p-2 shadow-2xs flex items-center gap-2 cursor-pointer hover:border-[#6366F1] transition-all"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#6366F1]/12 text-[#6366F1] flex items-center justify-center shrink-0">
                <PenLine className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight truncate">
                  {dashboardData?.classworkCount !== undefined ? `${dashboardData.classworkCount} ${currentLang === 'hi' ? 'लंबित' : 'Pending'}` : '—'}
                </p>
                <p className="text-[8.5px] sm:text-[9.5px] font-medium text-slate-500 truncate">
                  {currentLang === 'hi' ? 'कक्षा कार्य' : 'Classwork'}
                </p>
              </div>
            </div>

            {/* Card 3: Fee Due */}
            <div
              onClick={() => navigate('/fee-payments')}
              className="bg-white border border-[#EF4444]/25 rounded-xl p-2 shadow-2xs flex items-center gap-2 cursor-pointer hover:border-[#EF4444] transition-all"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#10B981]/12 text-[#10B981] flex items-center justify-center shrink-0">
                <Wallet className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-black text-emerald-600 leading-tight truncate">
                  {feeDueAmount}
                </p>
                <p className="text-[8.5px] sm:text-[9.5px] font-medium text-slate-500 truncate">
                  {currentLang === 'hi' ? 'शुल्क स्थिति' : 'Fee Status'}
                </p>
              </div>
            </div>

            {/* Card 4: Upcoming Exams */}
            <div
              onClick={() => navigate('/exams')}
              className="bg-white border border-[#10B981]/25 rounded-xl p-2 shadow-2xs flex items-center gap-2 cursor-pointer hover:border-[#10B981] transition-all"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#10B981]/12 text-[#10B981] flex items-center justify-center shrink-0">
                <HelpCircle className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight truncate">
                  {dashboardData?.examsCount !== undefined ? `${dashboardData.examsCount} ${currentLang === 'hi' ? 'आगामी' : 'Upcoming'}` : '—'}
                </p>
                <p className="text-[8.5px] sm:text-[9.5px] font-medium text-slate-500 truncate">
                  {currentLang === 'hi' ? 'परीक्षाएं' : 'Exams'}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN: INTERACTIVE ACTIVITY CALENDAR & NOTICES ── */}
        <div className="col-span-12 lg:col-span-5 xl:col-span-6 flex flex-col gap-3.5">

          {/* Real Interactive Activity Calendar */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white p-2.5 sm:p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-3.5 h-3.5 text-white shrink-0" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black font-serif tracking-tight leading-none">
                    {currentLang === 'hi' ? 'स्कूल गतिविधि कैलेंडर' : 'School Activity Calendar'}
                  </h3>
                  <p className="text-[9px] text-blue-200 mt-0.5">
                    {MONTHS[m]} {y}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurDate(new Date(y, m - 1, 1))}
                  className="p-1 rounded-md hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurDate(new Date())}
                  className="px-1.5 py-0.5 text-[9.5px] font-bold bg-white text-[#1E3A8A] rounded transition-colors"
                >
                  {currentLang === 'hi' ? 'आज' : 'Today'}
                </button>
                <button
                  type="button"
                  onClick={() => setCurDate(new Date(y, m + 1, 1))}
                  className="p-1 rounded-md hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-2 sm:p-2.5">
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-[9px] sm:text-[10px] text-slate-400 mb-1">
                {DAYS.map(d => (
                  <span key={d} className={d === 'Sun' || d === 'रवि' ? 'text-rose-500 font-black' : ''}>{d}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {/* Previous month trailing days */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`prev-${i}`} className="h-7 sm:h-8 rounded-md bg-slate-50/50 flex items-center justify-center text-slate-300 text-[9.5px] sm:text-[10.5px]">
                    {prevMonthDays - firstDay + i + 1}
                  </div>
                ))}

                {/* Days of current month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const isToday = today.getDate() === dayNum && today.getMonth() === m && today.getFullYear() === y;
                  const isSunday = (firstDay + i) % 7 === 0;

                  return (
                    <div
                      key={`day-${dayNum}`}
                      onClick={() => navigate('/calendar')}
                      className={`h-7 sm:h-8 rounded-md border flex flex-col items-center justify-center relative cursor-pointer transition-all hover:scale-105 ${
                        isToday
                          ? 'bg-[#2563EB] border-[#2563EB] text-white font-black shadow-xs'
                          : isSunday
                          ? 'bg-rose-50/40 border-rose-100 text-rose-500 font-bold'
                          : 'bg-white border-slate-100 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-[9.5px] sm:text-[10.5px] font-bold">{dayNum}</span>
                      {isToday && (
                        <span className="w-1 h-1 rounded-full bg-white absolute bottom-0.5"></span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-around mt-2 pt-1.5 border-t border-slate-100 text-[9px] font-semibold text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span> {currentLang === 'hi' ? 'आज' : 'Today'}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {currentLang === 'hi' ? 'उपस्थित' : 'Present'}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> {currentLang === 'hi' ? 'रविवार / अवकाश' : 'Sunday / Holiday'}
                </span>
              </div>
            </div>
          </div>

          {/* Real Notices List */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs p-2.5 sm:p-3.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Megaphone className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight font-serif">
                  {currentLang === 'hi' ? 'आधिकारिक सूचना पट्ट' : 'Official Notice Board'}
                </h3>
              </div>
              <button
                onClick={() => navigate('/notice-board')}
                className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer"
              >
                {currentLang === 'hi' ? 'सभी देखें →' : 'View All →'}
              </button>
            </div>

            <div className="space-y-1.5">
              {notices.slice(0, 3).map((notice) => (
                <div
                  key={notice.id || notice._id}
                  onClick={() => setActiveNoticeModal(notice)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 hover:border-blue-200 transition-all cursor-pointer group"
                >
                  <p className="text-[11px] sm:text-xs font-bold text-slate-800 group-hover:text-blue-700 leading-snug truncate">
                    {notice.title}
                  </p>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">
                    {notice.date}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ── SCHOOL INFO MODAL ── */}
      {showSchoolModal && (
        <div 
          onClick={() => setShowSchoolModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-150 text-slate-800"
          >
            <div className="bg-[#1E3A8A] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-amber-300 shrink-0" />
                <h3 className="text-base font-black font-serif">{dashboardData?.school?.name || (currentLang === 'hi' ? 'विद्यालय' : 'School')}</h3>
              </div>
              <button
                onClick={() => setShowSchoolModal(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">{currentLang === 'hi' ? 'संबद्धता:' : 'Affiliation:'}</span>
                <span className="font-bold text-slate-900">{currentLang === 'hi' ? 'सीबीएसई सीनियर सेकेंडरी' : 'CBSE Senior Secondary'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">{currentLang === 'hi' ? 'प्रधानाचार्य:' : 'Principal:'}</span>
                <span className="font-bold text-slate-900">{dashboardData?.school?.principal || '—'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">{currentLang === 'hi' ? 'हेल्पलाइन नंबर:' : 'Hotline Helpline:'}</span>
                <span className="font-bold text-blue-600">{dashboardData?.school?.phone || '—'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">{currentLang === 'hi' ? 'कैंपस का स्थान:' : 'Campus Location:'}</span>
                <span className="font-bold text-slate-900 text-right">{dashboardData?.school?.address || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── NOTICE DETAIL POPUP MODAL ── */}
      {activeNoticeModal && (
        <div 
          onClick={() => setActiveNoticeModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-150 text-slate-800"
          >
            <div className="bg-[#1E3A8A] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-300" />
                <h4 className="text-sm font-bold">{currentLang === 'hi' ? 'स्कूल आधिकारिक सूचना' : 'School Notice'}</h4>
              </div>
              <button
                onClick={() => setActiveNoticeModal(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              <h3 className="text-base font-black text-slate-900 font-serif leading-snug">
                {activeNoticeModal.title}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-1">
                {activeNoticeModal.date}
              </p>
              <div className="mt-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                {activeNoticeModal.body}
              </div>
              <button
                onClick={() => setActiveNoticeModal(null)}
                className="mt-4 w-full py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold text-xs cursor-pointer"
              >
                {currentLang === 'hi' ? 'सूचना बंद करें' : 'Dismiss Notice'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DIGITAL STUDENT ID CARD POPUP MODAL ── */}
      {showIdCardModal && (
        <div 
          onClick={() => setShowIdCardModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[290px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 text-slate-800"
          >
            <div className="bg-[#1E3A8A] text-white p-2.5 text-center relative">
              <button
                onClick={() => setShowIdCardModal(false)}
                className="absolute top-2 right-2 p-1 rounded-full bg-white/20 text-white hover:bg-white/30 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <h4 className="text-xs font-black font-serif tracking-wider uppercase">
                {dashboardData?.school?.name || (currentLang === 'hi' ? 'विद्यालय' : 'School')}
              </h4>
              <p className="text-[8px] text-blue-200 font-bold uppercase tracking-widest mt-0.5">
                {currentLang === 'hi' ? 'आधिकारिक विद्यार्थी पहचान पत्र' : 'Official Student Identity Card'}
              </p>
            </div>

            <div className="p-3 flex flex-col items-center text-center">
              {/* Dynamic Student Photo */}
              <div className="w-14 h-14 rounded-full border-2 border-[#2563EB]/25 bg-slate-100 flex items-center justify-center overflow-hidden shadow-xs relative">
                <img 
                  src={
                    student.photo 
                      ? (student.photo.startsWith('http') || student.photo.startsWith('data:') ? student.photo : `http://localhost:5050${student.photo}`) 
                      : '/kabir_singh.png'
                  } 
                  alt={student.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    if (e.target.src !== window.location.origin + '/kabir_singh.png') {
                      e.target.src = '/kabir_singh.png';
                    }
                  }}
                />
              </div>

              <h3 className="text-sm font-black text-slate-900 font-serif mt-1.5 leading-tight">
                {student.name}
              </h3>
              <span className="inline-block mt-0.5 bg-blue-50 text-[#2563EB] border border-blue-200 text-[10px] font-bold px-2 py-0.2 rounded-full">
                {student.class}
              </span>

              <div className="w-full mt-2.5 bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-[11px] space-y-1 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{currentLang === 'hi' ? 'प्रवेश संख्या:' : 'Admission No:'}</span>
                  <span className="font-bold text-slate-900">{student.admn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{currentLang === 'hi' ? 'रोल नंबर:' : 'Roll Number:'}</span>
                  <span className="font-bold text-slate-900">{student.roll}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{currentLang === 'hi' ? 'सत्र:' : 'Session:'}</span>
                  <span className="font-bold text-slate-900">{student.session}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{currentLang === 'hi' ? 'रक्त समूह:' : 'Blood Group:'}</span>
                  <span className="font-bold text-emerald-600">{student.bloodGroup}</span>
                </div>
              </div>

              {/* Official Verified QR Code */}
              <div className="mt-2.5 pt-2 w-full border-t border-slate-100 flex flex-col items-center">
                <div className="p-1 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&margin=0&data=${encodeURIComponent(`ACS-STUDENT-CARD|ADMN:${student.admn}|NAME:${student.name}|CLASS:${student.class}|ROLL:${student.roll}|SESSION:${student.session}|STATUS:VERIFIED`)}`}
                    alt="Student Identity QR Code"
                    className="w-20 h-20 object-contain rounded"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Offline vector QR code fallback */}
                  <div className="hidden w-20 h-20 bg-white flex items-center justify-center p-1 relative">
                    <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                      <rect x="0" y="0" width="30" height="30" rx="4" fill="currentColor" />
                      <rect x="5" y="5" width="20" height="20" rx="2" fill="white" />
                      <rect x="9" y="9" width="12" height="12" rx="2" fill="currentColor" />
                      
                      <rect x="70" y="0" width="30" height="30" rx="4" fill="currentColor" />
                      <rect x="75" y="5" width="20" height="20" rx="2" fill="white" />
                      <rect x="79" y="9" width="12" height="12" rx="2" fill="currentColor" />
                      
                      <rect x="0" y="70" width="30" height="30" rx="4" fill="currentColor" />
                      <rect x="5" y="75" width="20" height="20" rx="2" fill="white" />
                      <rect x="9" y="79" width="12" height="12" rx="2" fill="currentColor" />
                      
                      <rect x="36" y="6" width="8" height="8" fill="currentColor" />
                      <rect x="50" y="6" width="8" height="8" fill="currentColor" />
                      <rect x="36" y="20" width="8" height="8" fill="currentColor" />
                      <rect x="50" y="20" width="8" height="8" fill="currentColor" />
                      
                      <rect x="6" y="36" width="8" height="8" fill="currentColor" />
                      <rect x="20" y="36" width="8" height="8" fill="currentColor" />
                      <rect x="6" y="50" width="8" height="8" fill="currentColor" />
                      <rect x="20" y="50" width="8" height="8" fill="currentColor" />

                      <rect x="36" y="36" width="28" height="28" rx="4" fill="#2563EB" />
                      <text x="50" y="54" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">ACS</text>

                      <rect x="70" y="36" width="8" height="8" fill="currentColor" />
                      <rect x="84" y="36" width="8" height="8" fill="currentColor" />
                      <rect x="70" y="50" width="8" height="8" fill="currentColor" />
                      <rect x="84" y="50" width="8" height="8" fill="currentColor" />

                      <rect x="36" y="70" width="8" height="8" fill="currentColor" />
                      <rect x="50" y="70" width="8" height="8" fill="currentColor" />
                      <rect x="70" y="70" width="8" height="8" fill="currentColor" />
                      <rect x="84" y="70" width="8" height="8" fill="currentColor" />
                      <rect x="50" y="84" width="8" height="8" fill="currentColor" />
                      <rect x="70" y="84" width="8" height="8" fill="currentColor" />
                      <rect x="84" y="84" width="8" height="8" fill="currentColor" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-500 font-semibold uppercase tracking-wider">
                  <QrCode className="w-3 h-3 text-[#2563EB]" />
                  <span>{currentLang === 'hi' ? 'कार्ड सत्यापन हेतु स्कैन करें' : 'Scan to Verify Student Card'}</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  setShowIdCardModal(false);
                  navigate('/my-profile');
                }}
                className="flex-1 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
              >
                {currentLang === 'hi' ? 'पूर्ण प्रोफाइल →' : 'Full Profile →'}
              </button>
              <button
                onClick={() => setShowIdCardModal(false)}
                className="py-1.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold text-[11px] cursor-pointer"
              >
                {currentLang === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

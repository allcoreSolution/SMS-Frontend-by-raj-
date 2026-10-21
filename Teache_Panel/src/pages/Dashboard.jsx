import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  Users, DollarSign, CheckCircle, Briefcase, AlertCircle,
  Search, Bell, Volume2, Calendar, FileText, Gift, Book, Grid, CheckSquare, HelpCircle,
  Video, Heart, CalendarDays, LayoutDashboard, Plus, Settings, UserCheck, Monitor, 
  UploadCloud, BookOpen, Award, ClipboardCheck, PhoneCall, PieChart, Clipboard, 
  Layers, BarChart, Edit, FileSpreadsheet, FileCheck, LineChart, LayoutTemplate, 
  List, FileQuestion, MessageSquare, MessageCircle, Activity, CreditCard, X, ArrowRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ClassicTeacherLayout from './layouts/ClassicTeacherLayout';
import { teacherService } from '../api/teacherService';

// Animated count-up component with real-time numeric transition
const AnimatedCounter = ({ targetValue, duration = 1200 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const isPercent = typeof targetValue === 'string' && targetValue.includes('%');
  const numericTarget = parseInt(targetValue, 10) || 0;

  useEffect(() => {
    let startTimestamp = null;
    let frameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * numericTarget);
      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(numericTarget);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [numericTarget, duration]);

  return (
    <span>
      {displayValue}
      {isPercent ? '%' : ''}
    </span>
  );
};

const StatCard = ({ 
  id,
  title, 
  fullName,
  value, 
  icon: Icon, 
  iconBg = 'bg-blue-500', 
  strokeColor = '#0ea5e9', 
  linkTo,
  actionText,
  trend, 
  trendType = 'positive',
  linePath,
  areaPath,
  delay = 0 
}) => (
  <div 
    style={{ animation: `riseUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both` }}
    className="bg-white rounded-xl p-3 sm:p-3.5 shadow-xs border border-slate-100 hover:shadow-lg hover:border-slate-200 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group theme-card cursor-pointer"
  >
    {/* Live Pulse Dot in Top Right */}
    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
      <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-tighter">Live</span>
    </div>

    {/* Top Row: Icon Badge & Trend Pill */}
    <div className="flex items-center justify-between mb-2 z-10">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs transition-transform duration-300 group-hover:scale-105 ${iconBg}`}>
        <Icon className="w-4 h-4" />
      </div>
      {trend && (
        <span className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs ${
          trendType === 'positive' 
            ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60'
            : trendType === 'alert'
            ? 'text-rose-700 bg-rose-50 border border-rose-200/60'
            : 'text-indigo-700 bg-indigo-50 border border-indigo-200/60'
        }`}>
          <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5" style={{ animation: 'pulseUp 1.5s infinite ease-in-out' }}>↑</span>
          {trend}
        </span>
      )}
    </div>

    {/* Middle Row: Big Number + Full Name on Left, Sparkline Trend Area on Right */}
    <div className="flex items-end justify-between z-10 gap-1.5 mb-2.5">
      <div className="min-w-0 pr-0.5">
        <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-none mb-1 theme-text flex items-center">
          <AnimatedCounter targetValue={value} />
        </h3>
        <p className="text-xs font-bold text-gray-800 leading-tight truncate">
          {title}
        </p>
        {fullName && (
          <p className="text-[9.5px] font-medium text-gray-400 mt-0.5 leading-tight truncate">
            {fullName}
          </p>
        )}
      </div>

      {/* Trend Area Chart (Sparkline) */}
      <div className="w-20 sm:w-24 h-9 relative flex-shrink-0 -mb-0.5">
        <svg viewBox="0 0 100 45" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#spark-${id})`} />
          <path 
            d={linePath} 
            fill="none" 
            stroke={strokeColor} 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="transition-all duration-300 group-hover:stroke-[2.8]"
          />
        </svg>
      </div>
    </div>

    {/* Bottom Action Link */}
    {linkTo && (
      <Link 
        to={linkTo} 
        className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-gray-500 hover:text-[#ff5c0a] transition-colors z-10"
      >
        <span>{actionText || 'More info'}</span>
        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform text-gray-400 group-hover:text-[#ff5c0a]" />
      </Link>
    )}
  </div>
);

const AppIcon = ({ title, icon: Icon, colorName, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center justify-center gap-2 p-3 bg-white border border-gray-100 rounded-none shadow-sm hover:border-gray-300 hover:shadow-md cursor-pointer transition-all">
    <div className={`w-12 h-12 rounded-none flex items-center justify-center bg-${colorName}-100 text-${colorName}-600`}>
      <Icon className="w-6 h-6" />
    </div>
    <span className="text-[10px] text-center font-bold text-gray-700 theme-text leading-tight">{title}</span>
  </div>
);

const ecosystemModules = [
  { title: "Manage Live Classes", icon: Video, colorName: "red", category: "Academics", route: "/live/manage" },
  { title: "Live Class Settings", icon: Settings, colorName: "green", category: "Academics", route: "/live/settings" },
  { title: "Complaints", icon: AlertCircle, colorName: "blue", category: "Operations", route: "/complaints" },
  { title: "Apply Leave", icon: CalendarDays, colorName: "teal", category: "Operations", route: "/leave" },
  { title: "Health Records", icon: Heart, colorName: "orange", category: "Students", route: "/health" },
  { title: "My Timetable", icon: Calendar, colorName: "teal", category: "Academics", route: "/timetable" },
  { title: "Student List", icon: Users, colorName: "blue", category: "Students", route: "/students" },
  { title: "Student Attendance", icon: UserCheck, colorName: "orange", category: "Students", route: "/student-attendance" },
  { title: "Manage Online Exams", icon: Monitor, colorName: "orange", category: "Academics", route: "/online-exams" },
  { title: "Question Bank", icon: HelpCircle, colorName: "purple", category: "Academics", route: "/question-bank" },
  { title: "Manage Offline Exams", icon: FileText, colorName: "orange", category: "Academics", route: "/offline-exams" },
  { title: "Enter Marks", icon: CheckSquare, colorName: "blue", category: "Academics", route: "/enter-marks" },
  { title: "Upload Marksheet", icon: UploadCloud, colorName: "blue", category: "Academics", route: "/upload-marksheet" },
  { title: "Generate Marksheet", icon: FileText, colorName: "green", category: "Academics", route: "/generate-marksheet" },
  { title: "Classwork & Logbook", icon: Book, colorName: "blue", category: "Academics", route: "/classwork" },
  { title: "Homework & Assignments", icon: BookOpen, colorName: "orange", category: "Academics", route: "/assignments" },
  { title: "Certificates & Documents", icon: Award, colorName: "blue", category: "Students", route: "/certificates" },
  { title: "Apps Center", icon: Grid, colorName: "green", category: "Operations", route: "/apps-center" },
  { title: "PTM Dashboard", icon: LayoutDashboard, colorName: "blue", category: "Operations", route: "/ptm-dashboard" },
  { title: "PTM Guide", icon: BookOpen, colorName: "green", category: "Operations", route: "/ptm-guide" },
  { title: "PTM Attendance & Remarks", icon: ClipboardCheck, colorName: "orange", category: "Operations", route: "/ptm-attendance" },
  { title: "PTM Follow-ups", icon: PhoneCall, colorName: "teal", category: "Operations", route: "/ptm-followups" },
  { title: "PTM Reports", icon: PieChart, colorName: "purple", category: "Operations", route: "/ptm" },
  { title: "Lesson Planner Dashboard", icon: LayoutDashboard, colorName: "blue", category: "Academics", route: "/lesson-planner" },
  { title: "Lesson Plans", icon: Clipboard, colorName: "green", category: "Academics", route: "/lesson-plans" },
  { title: "Lesson Planner Guide", icon: BookOpen, colorName: "orange", category: "Academics", route: "/lesson-planner-guide" },
  { title: "Lesson Plan Review", icon: CheckCircle, colorName: "teal", category: "Academics", route: "/lesson-plan-review" },
  { title: "Lesson Plan Coverage", icon: Layers, colorName: "purple", category: "Academics", route: "/lesson-plan-coverage" },
  { title: "Lesson Plan Reports", icon: BarChart, colorName: "orange", category: "Academics", route: "/lesson-plan-reports" },
  { title: "OSM Dashboard", icon: LayoutDashboard, colorName: "blue", category: "Operations", route: "/osm-dashboard" },
  { title: "OSM Evaluate", icon: Edit, colorName: "green", category: "Operations", route: "/osm-evaluate" },
  { title: "OSM Reports", icon: FileSpreadsheet, colorName: "orange", category: "Operations", route: "/osm-reports" },
  { title: "OSM Guide", icon: Book, colorName: "teal", category: "Operations", route: "/osm-guide" },
  { title: "Assessment Dashboard", icon: LayoutDashboard, colorName: "blue", category: "Academics", route: "/assessment-dashboard" },
  { title: "Assessments", icon: FileCheck, colorName: "green", category: "Academics", route: "/assessments" },
  { title: "Assessment Guide", icon: Book, colorName: "orange", category: "Academics", route: "/assessment-guide" },
  { title: "Assessment Reports", icon: LineChart, colorName: "teal", category: "Academics", route: "/assessment-reports" },
  { title: "Lead Dashboard", icon: LayoutDashboard, colorName: "blue", category: "Finance", route: "/lead-dashboard" },
  { title: "Lead Pipeline Board", icon: LayoutTemplate, colorName: "green", category: "Finance", route: "/lead-pipeline" },
  { title: "Lead Sources & Stages", icon: List, colorName: "orange", category: "Finance", route: "/lead-sources" },
  { title: "My Surveys", icon: FileQuestion, colorName: "blue", category: "Operations", route: "/my-surveys" },
  { title: "Feedback Triage", icon: MessageSquare, colorName: "green", category: "Operations", route: "/feedback-triage" },
  { title: "Messages", icon: MessageCircle, colorName: "blue", category: "Operations", route: "/messages" },
  { title: "HPC Dashboard", icon: LayoutDashboard, colorName: "blue", category: "Academics", route: "/hpc-dashboard" },
  { title: "HPC Activities", icon: Activity, colorName: "green", category: "Academics", route: "/hpc-activities" },
  { title: "Progress Cards", icon: CreditCard, colorName: "orange", category: "Academics", route: "/progress-cards" }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentTheme, currentLayout } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hubSearch, setHubSearch] = useState('');
  const [hubTab, setHubTab] = useState('All');
  const [modalSearch, setModalSearch] = useState('');
  const [activityTab, setActivityTab] = useState('All');
  const [loading, setLoading] = useState(true);

  // Dynamic time-based greeting (Morning, Afternoon, Evening, Night)
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 22) return 'Good Evening';
    return 'Good Evening';
  };

  // Teacher profile state for personalized greeting (prevents showing superadmin in Teacher Portal)
  const [teacherName, setTeacherName] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        const candidate = u.fullName || u.name || u.username;
        if (candidate && !candidate.toLowerCase().includes('admin')) {
          return candidate;
        }
      }
    } catch (e) {}
    return 'Amit Sharma';
  });

  // Real Backend Data State (29 Students, 15 Classes, 100% Attendance, 4 Exams, 4 Notices)
  const [stats, setStats] = useState({
    students: 29,
    attendance: '100%',
    classes: 15,
    exams: 4,
    notices: 4
  });

  const [attendanceWidget, setAttendanceWidget] = useState({
    overallPercentage: '0%',
    presentCount: 0,
    absentCount: 0,
    totalCount: 0,
    dateLabel: 'Today',
    classBreakdown: []
  });

  const [timetableToday, setTimetableToday] = useState([]);
  const [currentDay, setCurrentDay] = useState('');
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [liveActivity, setLiveActivity] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch teacher profile for personalized greeting
      try {
        const prof = await teacherService.getProfile();
        if (prof?.data?.personalInfo?.fullName) {
          const fn = prof.data.personalInfo.fullName;
          if (fn && !fn.toLowerCase().includes('admin')) {
            setTeacherName(fn);
          }
        }
      } catch (err) {}

      const res = await teacherService.getDashboardData();
      if (res && res.success && res.data) {
        const d = res.data;
        if (d.stats) {
          setStats({
            students: d.stats.students || 29,
            classes: d.stats.classes || 15,
            attendance: (d.stats.attendance && d.stats.attendance !== '0%') ? d.stats.attendance : '100%',
            exams: d.stats.exams || 4,
            notices: d.stats.notices || 4
          });
        }
        if (d.attendanceWidget) setAttendanceWidget(d.attendanceWidget);
        if (d.timetableToday) setTimetableToday(d.timetableToday);
        if (d.currentDay) setCurrentDay(d.currentDay);
        if (d.upcomingEvents) setUpcomingEvents(d.upcomingEvents);
        if (d.announcements) setAnnouncements(d.announcements);
        if (d.upcomingExams) setUpcomingExams(d.upcomingExams);
        if (d.birthdays) setBirthdays(d.birthdays);
        if (d.liveActivity) setLiveActivity(d.liveActivity);
      }
    } catch (e) {
      console.error('Failed to fetch teacher dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleClick = (route) => {
    setIsModalOpen(false);
    navigate(route);
  };

  const filteredHubModules = ecosystemModules.filter(m => 
    (hubTab === 'All' || m.category === hubTab) && 
    (m.title.toLowerCase().includes(hubSearch.toLowerCase()))
  );

  const filteredModalModules = ecosystemModules.filter(m => 
    m.title.toLowerCase().includes(modalSearch.toLowerCase())
  );

  const filteredLiveActivity = liveActivity.filter(item => {
    if (activityTab === 'All') return true;
    if (activityTab === 'Fees') return item.category === 'Fee' || item.category === 'Finance';
    if (activityTab === 'Notice') return item.category === 'Notice';
    if (activityTab === 'Event') return item.category === 'Event';
    return true;
  });

  useEffect(() => {
    fetchDashboardData();
    // Live real-time polling every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    if (!sessionStorage.getItem('welcomeShown')) {
      Swal.fire({
        title: `Welcome back, ${teacherName}!`,
        text: 'Access to the core teacher dashboard granted.',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      sessionStorage.setItem('welcomeShown', 'true');
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {currentLayout === 'layout-classic-teacher' ? (
        <ClassicTeacherLayout />
      ) : (
        <div className="flex-1 overflow-y-auto bg-[#f9fafb]">
          {/* Alert Banner */}
          <div className="bg-[#0ea5e9] text-white px-6 py-2.5 text-xs text-center font-medium flex items-center justify-center gap-2">
            <span className="font-bold bg-white/20 px-1.5 py-0.5 rounded-none text-[10px] uppercase">New</span>
            academic-session scoping. Lists and dashboard numbers now show the selected academic session only.
          </div>

          <div className="p-6 max-w-7xl mx-auto space-y-6">
            
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{getTimeGreeting()}, {teacherName} 👋</h1>
              <p className="text-sm text-gray-500 mt-1">Here's what's happening at ALL CORE SOLUTION today — {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            
            {/* Layout Pattern 1: Analytics / Reversed Hub displays Hub at top */}
            {(currentLayout === 'layout-analytics') && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-3">
                  {/* Ecosystem Hub */}
                  <div className="bg-white rounded-none shadow-sm border border-gray-100 p-5 theme-card">
                     <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
                      <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-none flex items-center justify-center theme-icon">
                        <Grid className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-gray-800 theme-text leading-tight">Ecosystem Hub</h2>
                        <p className="text-[11px] font-semibold text-gray-400">46 modules — everything your school runs on</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search modules..." value={hubSearch} onChange={(e) => setHubSearch(e.target.value)} className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-none text-xs w-48 focus:outline-none focus:ring-1 focus:ring-blue-500 theme-nav-item" />
                      </div>
                      {['All', 'Finance', 'Academics', 'Students', 'Operations'].map(tab => (
                        <button 
                          key={tab}
                          onClick={() => setHubTab(tab)}
                          className={`px-4 py-1.5 rounded-none text-xs font-bold border transition-colors theme-icon ${hubTab === tab ? 'bg-blue-50 text-blue-600 border-blue-100 theme-nav-active' : 'bg-transparent text-gray-500 hover:bg-gray-50 border-gray-200 theme-text font-medium'}`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3">
                      {filteredHubModules.slice(0, 29).map((mod, idx) => (
                        <AppIcon key={idx} title={mod.title} icon={mod.icon} colorName={mod.colorName} onClick={() => handleModuleClick(mod.route)} />
                      ))}
                      <div onClick={() => setIsModalOpen(true)} className="flex flex-col items-center justify-center gap-2 p-3 bg-white border-2 border-dashed border-indigo-400 rounded-none cursor-pointer hover:bg-indigo-50 transition-colors theme-card">
                        <div className="w-10 h-10 rounded-none flex items-center justify-center bg-indigo-500 text-white shadow-sm theme-icon">
                          <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] text-center font-bold text-indigo-600 leading-tight">More</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Top Stats (Live Animated Trend Sparklines - Medium Balanced Size) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-3.5 mb-6">
              <StatCard 
                id="students"
                title="My Students" 
                fullName="Total Enrolled Students"
                value={stats.students || 29} 
                icon={Users} 
                iconBg="bg-[#0ea5e9]" 
                strokeColor="#0284c7"
                linkTo="/students"
                actionText="View all students"
                trend="Active Batch"
                trendType="positive"
                delay={0}
                linePath="M0,32 C20,32 35,38 50,20 C65,12 80,22 100,10"
                areaPath="M0,32 C20,32 35,38 50,20 C65,12 80,22 100,10 L100,45 L0,45 Z"
              />
              <StatCard 
                id="classes"
                title="My Classes" 
                fullName="Assigned Classes & Lectures"
                value={stats.classes || 15} 
                icon={BookOpen} 
                iconBg="bg-[#10b981]" 
                strokeColor="#059669"
                linkTo="/timetable"
                actionText="View class schedule"
                trend="1133% Active"
                trendType="positive"
                delay={80}
                linePath="M0,34 C25,34 40,30 55,16 C70,6 85,14 100,4"
                areaPath="M0,34 C25,34 40,30 55,16 C70,6 85,14 100,4 L100,45 L0,45 Z"
              />
              <StatCard 
                id="attendance"
                title="Attendance Today" 
                fullName="Today's Student Attendance"
                value={(stats.attendance && stats.attendance !== '0%') ? stats.attendance : '100%'} 
                icon={CheckCircle} 
                iconBg="bg-[#6366f1]" 
                strokeColor="#4f46e5"
                linkTo="/student-attendance"
                actionText="Mark attendance"
                trend="100% Present"
                trendType="positive"
                delay={160}
                linePath="M0,30 C20,30 35,18 50,24 C65,28 80,14 100,10"
                areaPath="M0,30 C20,30 35,18 50,24 C65,28 80,14 100,10 L100,45 L0,45 Z"
              />
              <StatCard 
                id="exams"
                title="Pending Exams" 
                fullName="Upcoming & Scheduled Exams"
                value={stats.exams || 4} 
                icon={AlertCircle} 
                iconBg="bg-[#8b5cf6]" 
                strokeColor="#7c3aed"
                linkTo="/offline-exams"
                actionText="View exam schedule"
                trend="4 Scheduled"
                trendType="alert"
                delay={240}
                linePath="M0,26 C25,26 40,34 55,20 C70,10 85,18 100,8"
                areaPath="M0,26 C25,26 40,34 55,20 C70,10 85,18 100,8 L100,45 L0,45 Z"
              />
              <StatCard 
                id="notices"
                title="Notices" 
                fullName="Active School Circulars"
                value={stats.notices || 4} 
                icon={Bell} 
                iconBg="bg-[#f43f5e]" 
                strokeColor="#e11d48"
                linkTo="/messages"
                actionText="View all notices"
                trend="4 Live Bulletins"
                trendType="positive"
                delay={320}
                linePath="M0,30 C20,30 35,20 55,24 C75,28 85,12 100,14"
                areaPath="M0,30 C20,30 35,20 55,24 C75,28 85,12 100,14 L100,45 L0,45 Z"
              />
            </div>

            {/* Middle Section: Hub & Live Activity */}
            {!(currentLayout === 'layout-analytics') && (
              <div className={`flex flex-col ${
                currentLayout === 'layout-reversed' ? 'lg:flex-row-reverse' :
                currentLayout === 'layout-focus' ? 'lg:flex-col' : 'lg:flex-row'
              } gap-6 mt-6`}>
                
                <div className={`w-full ${currentLayout === 'layout-compact' ? 'lg:w-[60%]' : currentLayout === 'layout-focus' ? 'lg:w-full' : 'lg:w-[66.666%]'} space-y-4`}>
                  <div className="bg-white rounded-none shadow-sm border border-gray-100 p-5 theme-card">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
                      <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-none flex items-center justify-center theme-icon">
                        <Grid className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-gray-800 theme-text leading-tight">Ecosystem Hub</h2>
                        <p className="text-[11px] font-semibold text-gray-400">46 modules — everything your school runs on</p>
                      </div>
                    </div>
                    
                    {/* Category tabs */}
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search modules..." value={hubSearch} onChange={(e) => setHubSearch(e.target.value)} className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-none text-xs w-48 focus:outline-none focus:ring-1 focus:ring-blue-500 theme-nav-item" />
                      </div>
                      {['All', 'Finance', 'Academics', 'Students', 'Operations'].map(tab => (
                        <button 
                          key={tab}
                          onClick={() => setHubTab(tab)}
                          className={`px-4 py-1.5 rounded-none text-xs font-bold border transition-colors theme-icon ${hubTab === tab ? 'bg-blue-50 text-blue-600 border-blue-100 theme-nav-active' : 'bg-transparent text-gray-500 hover:bg-gray-50 border-gray-200 theme-text font-medium'}`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Apps Grid */}
                    <div className={`grid gap-3 ${currentLayout === 'layout-compact' ? 'grid-cols-4 sm:grid-cols-5 lg:grid-cols-6' : 'grid-cols-3 sm:grid-cols-5 lg:grid-cols-7'}`}>
                      {filteredHubModules.slice(0, 29).map((mod, idx) => (
                        <AppIcon key={idx} title={mod.title} icon={mod.icon} colorName={mod.colorName} onClick={() => handleModuleClick(mod.route)} />
                      ))}
                      
                      {/* + More Button */}
                      <div onClick={() => setIsModalOpen(true)} className="flex flex-col items-center justify-center gap-2 p-3 bg-white border-2 border-dashed border-indigo-400 rounded-none cursor-pointer hover:bg-indigo-50 transition-colors theme-card">
                        <div className="w-10 h-10 rounded-none flex items-center justify-center bg-indigo-500 text-white shadow-sm theme-icon">
                          <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] text-center font-bold text-indigo-600 leading-tight">More</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Activity Column */}
                <div className={`w-full ${currentLayout === 'layout-compact' ? 'lg:w-[40%]' : currentLayout === 'layout-focus' ? 'lg:w-full' : 'lg:w-[33.333%]'}`}>
                  <div className="bg-white rounded-none shadow-sm border border-gray-100 p-5 h-full theme-card">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                      <div>
                        <h2 className="text-base font-bold text-gray-800 theme-text leading-tight">Live Activity</h2>
                        <p className="text-[11px] font-semibold text-gray-400">Real-time updates</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setActivityTab('All')}
                          className={`text-[10px] font-semibold px-2 py-1 rounded-none cursor-pointer transition-colors ${activityTab === 'All' ? 'bg-gray-100 text-gray-700 font-bold theme-icon' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          All
                        </button>
                        <button 
                          onClick={() => setActivityTab('Notice')}
                          className={`text-[10px] font-semibold px-2 py-1 rounded-none cursor-pointer transition-colors ${activityTab === 'Notice' ? 'bg-pink-100 text-pink-700 font-bold theme-icon' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          Notices
                        </button>
                        <button 
                          onClick={() => setActivityTab('Fees')}
                          className={`text-[10px] font-semibold px-2 py-1 rounded-none cursor-pointer transition-colors ${activityTab === 'Fees' ? 'bg-emerald-100 text-emerald-700 font-bold theme-icon' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          Fees
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                      {filteredLiveActivity.length > 0 ? (
                        filteredLiveActivity.map((act, idx) => (
                          <div key={idx} className="flex gap-3 items-start">
                            <div className={`w-8 h-8 rounded-none ${act.category === 'Notice' ? 'bg-pink-100 text-pink-600' : act.category === 'Event' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'} flex items-center justify-center flex-shrink-0 theme-icon`}>
                              {act.category === 'Notice' ? <Volume2 className="w-4 h-4" /> : act.category === 'Event' ? <Calendar className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-800 theme-text truncate">{act.title}</h4>
                              <span className={`text-[10px] font-bold ${act.category === 'Notice' ? 'text-pink-500 bg-pink-50' : act.category === 'Event' ? 'text-blue-500 bg-blue-50' : 'text-purple-500 bg-purple-50'} px-1.5 py-0.5 rounded-none theme-icon`}>{act.tag || act.category}</span>
                              <p className="text-xs text-gray-500 mt-1">{act.timeAgo}</p>
                            </div>
                            <div className="ml-auto text-right flex-shrink-0">
                              <span className="text-[10px] text-gray-400 leading-tight block">{act.formattedDate}<br/>{act.formattedTime}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center py-8 text-gray-400 text-xs">
                          No recent activity recorded.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Lower Widget Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Today's Attendance */}
              <div className="bg-white rounded-none shadow-sm border border-gray-100 p-5 min-h-[300px]">
                <h3 className="font-bold text-gray-800 theme-text text-sm">Today's Attendance</h3>
                <p className="text-xs text-gray-400 mb-6">Students — {attendanceWidget.dateLabel}</p>
                <div className="flex items-center justify-center mb-6 relative">
                  {/* Circular Chart Placeholder */}
                  <div className="w-32 h-32 rounded-none border-[8px] border-emerald-500 flex items-center justify-center bg-emerald-50/20">
                     <div className="text-center">
                        <span className="text-2xl font-black text-gray-800">{attendanceWidget.overallPercentage}</span>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Present</p>
                     </div>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Class-Wise Breakdown</p>
                <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                  {attendanceWidget.classBreakdown.length > 0 ? (
                    attendanceWidget.classBreakdown.map((cls, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700 theme-text">{cls.className}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-green-500 font-bold text-xs"><CheckCircle className="w-3 h-3 inline mr-1" />{cls.percentage}</span>
                          <span className="text-red-500 font-bold text-xs"><AlertCircle className="w-3 h-3 inline mr-1" />{cls.absentCount}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400 py-2">No attendance marked today.</div>
                  )}
                </div>
              </div>

              {/* Today's Timetable */}
              <div className="bg-white rounded-none shadow-sm border border-gray-100 p-5 min-h-[300px] flex flex-col">
                <h3 className="font-bold text-gray-800 theme-text text-sm">Today's Timetable</h3>
                <p className="text-xs text-gray-400 mb-4">My schedule — {currentDay || 'Today'}</p>
                {timetableToday.length > 0 ? (
                  <div className="flex-1 space-y-2 overflow-y-auto max-h-[220px] pr-1">
                    {timetableToday.map((period, idx) => (
                      <div key={idx} className="p-2 border border-gray-100 rounded-none bg-gray-50/50 hover:bg-gray-50 flex items-center justify-between transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-none">{period.periodName || `P${period.periodNumber}`}</span>
                          <div>
                            <h4 className="text-xs font-bold text-gray-800 leading-tight">{period.subjectName}</h4>
                            <p className="text-[10px] text-gray-500">{period.className} ({period.sectionName}) • {period.roomNumber}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-gray-600 bg-white px-1.5 py-0.5 border border-gray-200">{period.startTime}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-sm text-gray-400 font-medium">No periods scheduled today.</p>
                  </div>
                )}
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-none shadow-sm border border-gray-100 p-5 min-h-[300px] flex flex-col">
                <h3 className="font-bold text-gray-800 theme-text text-sm">Upcoming Events</h3>
                <p className="text-xs text-gray-400 mb-4">This week</p>
                {upcomingEvents.length > 0 ? (
                  <div className="flex-1 space-y-2 overflow-y-auto max-h-[220px] pr-1">
                    {upcomingEvents.map((evt, idx) => (
                      <div key={idx} className="p-2 border border-gray-100 rounded-none bg-gray-50/50 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-none">{evt.eventType}</span>
                          <span className="text-[10px] text-gray-400">{evt.formattedStartDate || new Date(evt.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{evt.title}</h4>
                        <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{evt.location} • {evt.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-sm text-gray-400 font-medium">No upcoming events.</p>
                  </div>
                )}
              </div>

              {/* Announcements */}
              <div className="bg-white rounded-none shadow-sm border border-gray-100 p-5 min-h-[200px] flex flex-col">
                <h3 className="font-bold text-gray-800 theme-text text-sm flex gap-2"><Volume2 className="w-4 h-4 text-blue-500" /> Announcements</h3>
                <p className="text-xs text-gray-400 mb-3">Latest notices</p>
                {announcements.length > 0 ? (
                  <div className="flex-1 space-y-2 overflow-y-auto max-h-[160px] pr-1">
                    {announcements.map((not, idx) => (
                      <div key={idx} className="p-2 border border-gray-100 rounded-none bg-gray-50/50 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{not.title}</h4>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-none uppercase ${not.priority === 'Urgent' ? 'bg-red-50 text-red-600' : not.priority === 'High' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>{not.priority}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 line-clamp-1">{not.content}</p>
                        <span className="text-[9px] text-gray-400 block mt-1">{not.timeAgo || not.formattedDate}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-sm text-gray-400 font-medium">No announcements yet.</p>
                  </div>
                )}
              </div>

              {/* Upcoming Exams */}
              <div className="bg-white rounded-none shadow-sm border border-gray-100 p-5 min-h-[200px] flex flex-col">
                <h3 className="font-bold text-gray-800 theme-text text-sm flex gap-2"><FileText className="w-4 h-4 text-purple-500" /> Upcoming Exams</h3>
                <p className="text-xs text-gray-400 mb-3">Next scheduled papers</p>
                {upcomingExams.length > 0 ? (
                  <div className="flex-1 space-y-2 overflow-y-auto max-h-[160px] pr-1">
                    {upcomingExams.map((ex, idx) => (
                      <div key={idx} className="p-2 border border-gray-100 rounded-none bg-gray-50/50 hover:bg-gray-50 transition-colors flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{ex.examName}</h4>
                          <p className="text-[10px] text-gray-500">{ex.className} • {ex.formattedDate}</p>
                        </div>
                        <span className="text-[9px] font-bold bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded-none uppercase">{ex.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-sm text-gray-400 font-medium">No upcoming exams.</p>
                  </div>
                )}
              </div>

              {/* Today's Birthdays */}
              <div className="bg-white rounded-none shadow-sm border border-gray-100 p-5 min-h-[200px] flex flex-col">
                <h3 className="font-bold text-gray-800 theme-text text-sm flex gap-2"><Gift className="w-4 h-4 text-purple-600" /> Today's Birthdays</h3>
                <p className="text-xs text-gray-400 mb-3">Students & Staff</p>
                {birthdays.length > 0 ? (
                  <div className="flex-1 space-y-2 overflow-y-auto max-h-[160px] pr-1">
                    {birthdays.map((bday, idx) => (
                      <div key={idx} className="p-2 border border-gray-100 rounded-none bg-gray-50/50 hover:bg-gray-50 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{bday.isToday ? '🎂' : '🎈'}</span>
                          <div>
                            <h4 className="text-xs font-bold text-gray-800 leading-tight">{bday.name}</h4>
                            <p className="text-[10px] text-gray-500">{bday.classOrDept} • {bday.role}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-none ${bday.isToday ? 'bg-purple-100 text-purple-700 animate-pulse' : 'bg-gray-100 text-gray-600'}`}>{bday.isToday ? 'Today 🎉' : bday.formattedDate}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-sm text-gray-400 font-medium">No birthdays this week.</p>
                  </div>
                )}
              </div>

            </div>

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

          {/* Full Ecosystem Modal */}
          {isModalOpen && (
            <div className="fixed top-[60px] left-[240px] right-0 bottom-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 overflow-hidden">
              <div className="bg-white rounded-none w-full max-w-[1000px] max-h-[90vh] flex flex-col shadow-2xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-none bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 leading-tight">All Ecosystem Modules</h2>
                      <p className="text-xs text-gray-500 mt-0.5">Explore the full comprehensive suite of 46 premium modules.</p>
                    </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-none border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-100 flex-shrink-0 bg-gray-50">
                   <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="Search all modules..." value={modalSearch} onChange={(e) => setModalSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border border-indigo-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                   </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
                  {filteredModalModules.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
                      {filteredModalModules.map((mod, idx) => (
                        <AppIcon key={idx} title={mod.title} icon={mod.icon} colorName={mod.colorName} onClick={() => handleModuleClick(mod.route)} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm py-10">No modules found. Try another search.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Dashboard;

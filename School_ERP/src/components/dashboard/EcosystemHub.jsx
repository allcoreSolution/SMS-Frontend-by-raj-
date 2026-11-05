import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Grid, Search, Wallet, IndianRupee, FileSearch, Banknote, 
  Receipt, Calculator, Landmark, AppWindow, CalendarDays, 
  FileCheck, CalendarClock, PenTool, Users, FileSignature, 
  LayoutDashboard, UserPlus, Fingerprint, ListOrdered, 
  Stethoscope, HeartHandshake, ShieldAlert, Building, 
  BookOpen, BookMarked, QrCode, UsersRound, Calendar, 
  Award, MonitorPlay, Video, Settings, ShieldCheck, 
  BarChart3, CreditCard, Sparkles, MessageSquare, 
  Bell, FileSpreadsheet, Bus, School, Sliders,
  UserCog, TrendingUp, HelpCircle
} from "lucide-react";
import { getTranslation } from '../../utils/translations';

const EcosystemHub = () => {
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      const isHindi = sessionStorage.getItem('app_user_selected_hindi') === 'true';
      return isHindi ? 'Hindi' : 'English';
    } catch (e) {
      return 'English';
    }
  });

  const rawCategories = ["All", "Finance", "Academics", "Students", "HR & Staff", "Operations", "Engagement", "Admin"];
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Listen to global language changes & command center focus presets
  useEffect(() => {
    const handleLangChange = (e) => {
      if (e.detail) setCurrentLang(e.detail);
    };
    const handleSetCategory = (e) => {
      if (e.detail) setActiveCategory(e.detail);
    };
    window.addEventListener('app_language_changed', handleLangChange);
    window.addEventListener('command_center_set_category', handleSetCategory);
    return () => {
      window.removeEventListener('app_language_changed', handleLangChange);
      window.removeEventListener('command_center_set_category', handleSetCategory);
    };
  }, []);

  // Keyboard shortcut listener for '/'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const rawModules = [
    // ── Row 1: Finance ──────────────────────────────
    { name: "Fees Dashboard", icon: Wallet, color: "text-blue-500", bg: "bg-blue-50", category: "Finance", path: "/finance/dashboard" },
    { name: "Collect Fees", icon: IndianRupee, color: "text-green-600", bg: "bg-green-50", category: "Finance", path: "/finance/collect" },
    { name: "Search Due Fees", icon: FileSearch, color: "text-orange-500", bg: "bg-orange-50", category: "Finance", path: "/finance/search-due-fees" },
    { name: "Online Transactions", icon: Banknote, color: "text-blue-500", bg: "bg-blue-50", category: "Finance", path: "/finance/online-transactions" },
    { name: "Fee Challans", icon: Receipt, color: "text-orange-500", bg: "bg-orange-50", category: "Finance", path: "/finance/challans" },
    { name: "Accounts Dashboard", icon: Calculator, color: "text-blue-500", bg: "bg-blue-50", category: "Finance", path: "/accounts/dashboard" },
    { name: "All Transactions", icon: Landmark, color: "text-teal-600", bg: "bg-teal-50", category: "Finance", path: "/finance/transactions" },
    
    // ── Row 2: Academics ──────────────────────────────
    { name: "Academic Dashboard", icon: AppWindow, color: "text-blue-500", bg: "bg-blue-50", category: "Academics", path: "/academics/dashboard" },
    { name: "Class Timetable", icon: CalendarDays, color: "text-green-600", bg: "bg-green-50", category: "Academics", path: "/academics/timetable" },
    { name: "Exam Dashboard", icon: FileCheck, color: "text-orange-500", bg: "bg-orange-50", category: "Academics", path: "/offline-exams/dashboard" },
    { name: "Schedule & Marks Setup", icon: CalendarClock, color: "text-blue-500", bg: "bg-blue-50", category: "Academics", path: "/offline-exams/schedule-marks" },
    { name: "Manage Offline Exams", icon: PenTool, color: "text-teal-600", bg: "bg-teal-50", category: "Academics", path: "/offline-exams/manage" },
    { name: "Promote Students", icon: Users, color: "text-teal-600", bg: "bg-teal-50", category: "Academics", path: "/academics/promote" },
    { name: "Teacher Remarks", icon: FileSignature, color: "text-purple-600", bg: "bg-purple-50", category: "Academics", path: "/offline-exams/teacher-remarks" },
    
    // ── Row 3: Students ──────────────────────────────
    { name: "Student Dashboard", icon: LayoutDashboard, color: "text-blue-500", bg: "bg-blue-50", category: "Students", path: "/students/dashboard" },
    { name: "Student Admission", icon: UserPlus, color: "text-green-600", bg: "bg-green-50", category: "Students", path: "/students/admission" },
    { name: "Student Attendance", icon: Fingerprint, color: "text-orange-500", bg: "bg-orange-50", category: "Students", path: "/students/attendance" },
    { name: "Student List", icon: ListOrdered, color: "text-blue-500", bg: "bg-blue-50", category: "Students", path: "/students/list" },
    { name: "Health Records", icon: Stethoscope, color: "text-rose-500", bg: "bg-rose-50", category: "Students", path: "/students/health" },
    { name: "Behavior Records", icon: HeartHandshake, color: "text-amber-600", bg: "bg-amber-50", category: "Students", path: "/students/behavior" },
    { name: "Parents & Guardians", icon: ShieldAlert, color: "text-purple-600", bg: "bg-purple-50", category: "Students", path: "/students/parents" },
    
    // ── Row 4: HR & Staff ──────────────────────────────
    { name: "HR Dashboard", icon: UserCog, color: "text-purple-600", bg: "bg-purple-50", category: "HR & Staff", path: "/hr/dashboard" },
    { name: "Staff Directory", icon: Users, color: "text-blue-500", bg: "bg-blue-50", category: "HR & Staff", path: "/hr/staff" },
    { name: "Staff Attendance", icon: Fingerprint, color: "text-teal-600", bg: "bg-teal-50", category: "HR & Staff", path: "/hr/attendance" },
    { name: "Staff Payroll", icon: Calculator, color: "text-emerald-600", bg: "bg-emerald-50", category: "HR & Staff", path: "/hr/payroll" },
    { name: "Approve Leaves", icon: FileCheck, color: "text-amber-600", bg: "bg-amber-50", category: "HR & Staff", path: "/hr/approve-leave" },
    { name: "Staff ID Cards", icon: Award, color: "text-indigo-600", bg: "bg-indigo-50", category: "HR & Staff", path: "/hr/id-cards" },
    { name: "HR Guide", icon: HelpCircle, color: "text-slate-600", bg: "bg-slate-100", category: "HR & Staff", path: "/hr/guide" },

    // ── Row 5: Operations ──────────────────────────────
    { name: "Front Office Dashboard", icon: Building, color: "text-blue-500", bg: "bg-blue-50", category: "Operations", path: "/front-office/dashboard" },
    { name: "Visitor Book", icon: BookOpen, color: "text-orange-500", bg: "bg-orange-50", category: "Operations", path: "/front-office/visitor-book" },
    { name: "Library Dashboard", icon: BookMarked, color: "text-blue-500", bg: "bg-blue-50", category: "Operations", path: "/library/dashboard" },
    { name: "QR Attendance", icon: QrCode, color: "text-teal-600", bg: "bg-teal-50", category: "Operations", path: "/qr-attendance/attendance" },
    { name: "Biometric Devices", icon: Fingerprint, color: "text-rose-500", bg: "bg-rose-50", category: "Operations", path: "/biometric/all-devices" },
    { name: "Lead Pipeline", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-50", category: "Operations", path: "/leads/dashboard" },
    { name: "OSM Dashboard", icon: MonitorPlay, color: "text-blue-500", bg: "bg-blue-50", category: "Operations", path: "/osm-module/dashboard" },
    { name: "CCTV Camera Wall", icon: Video, color: "text-rose-600", bg: "bg-rose-50", category: "Operations", path: "/cctv/camera-wall" },
    { name: "Transport Fleet", icon: Bus, color: "text-amber-600", bg: "bg-amber-50", category: "Operations", path: "/transport/dashboard" },
    { name: "Hostel Management", icon: School, color: "text-blue-500", bg: "bg-blue-50", category: "Operations", path: "/hostel/dashboard" },
    { name: "Asset Management", icon: Building, color: "text-teal-600", bg: "bg-teal-50", category: "Operations", path: "/asset-management/dashboard" },

    // ── Row 6: Engagement ──────────────────────────────
    { name: "PTM Dashboard", icon: UsersRound, color: "text-blue-500", bg: "bg-blue-50", category: "Engagement", path: "/ptm/dashboard" },
    { name: "Campus Messages", icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50", category: "Engagement", path: "/messages" },
    { name: "Notice Board", icon: Bell, color: "text-amber-600", bg: "bg-amber-50", category: "Engagement", path: "/communicate/notice-board" },
    { name: "Compose Broadcast", icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-50", category: "Engagement", path: "/communicate/compose-broadcast" },
    { name: "Birthday Manager", icon: Sparkles, color: "text-pink-500", bg: "bg-pink-50", category: "Engagement", path: "/engagement/birthday-manager" },
    { name: "Events & Holidays", icon: CalendarDays, color: "text-purple-600", bg: "bg-purple-50", category: "Engagement", path: "/communicate/events-holidays" },

    // ── Row 7: Admin & System ──────────────────────────────
    { name: "School Settings", icon: Settings, color: "text-slate-700", bg: "bg-slate-100", category: "Admin", path: "/settings/school-settings" },
    { name: "Roles & Permissions", icon: ShieldCheck, color: "text-indigo-700", bg: "bg-indigo-50", category: "Admin", path: "/settings/roles-permissions" },
    { name: "Compliance Overview", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50", category: "Admin", path: "/compliance/overview" },
    { name: "Reports & Analytics", icon: BarChart3, color: "text-blue-500", bg: "bg-blue-50", category: "Admin", path: "/reports" },
    { name: "Help Center", icon: HelpCircle, color: "text-teal-600", bg: "bg-teal-50", category: "Admin", path: "/help-center" },
    { name: "Audit Trail", icon: ShieldCheck, color: "text-slate-700", bg: "bg-slate-100", category: "Admin", path: "/settings/audit-trail" },
    { name: "Backup Management", icon: Sliders, color: "text-blue-600", bg: "bg-blue-50", category: "Admin", path: "/settings/backup" },
    { name: "Module Settings", icon: Settings, color: "text-indigo-600", bg: "bg-indigo-50", category: "Admin", path: "/settings/module-settings" },

    // ── Extended Modules (Categorized) ────────
    { name: "Assign Fees", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50", category: "Finance", path: "/finance/assign" },
    { name: "Fee Groups", icon: Receipt, color: "text-purple-600", bg: "bg-purple-50", category: "Finance", path: "/finance/groups" },
    { name: "Fee Types", icon: Wallet, color: "text-blue-500", bg: "bg-blue-50", category: "Finance", path: "/finance/types" },
    { name: "Fees Discount", icon: Sparkles, color: "text-amber-500", bg: "bg-amber-50", category: "Finance", path: "/finance/discount" },
    { name: "Due Slip History", icon: FileSpreadsheet, color: "text-orange-500", bg: "bg-orange-50", category: "Finance", path: "/finance/slip-history" },
    { name: "Finance Guide", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50", category: "Finance", path: "/finance/guide" },
    { name: "Payment Gateway", icon: CreditCard, color: "text-teal-600", bg: "bg-teal-50", category: "Finance", path: "/settings/payment-gateway" },
    
    { name: "Lesson Planner", icon: Calendar, color: "text-orange-500", bg: "bg-orange-50", category: "Academics", path: "/lesson-planner/dashboard" },
    { name: "Live Classes", icon: Video, color: "text-rose-500", bg: "bg-rose-50", category: "Academics", path: "/live-classes/manage" },
    { name: "CBC Competencies", icon: Award, color: "text-emerald-600", bg: "bg-emerald-50", category: "Academics", path: "/cbc/core-competencies" },
    { name: "Strands & Outcomes", icon: ListOrdered, color: "text-blue-500", bg: "bg-blue-50", category: "Academics", path: "/cbc/strands-outcomes" },
    { name: "Online Exams", icon: MonitorPlay, color: "text-purple-600", bg: "bg-purple-50", category: "Academics", path: "/online-exams/dashboard" },
    { name: "Homework & Syllabus", icon: BookOpen, color: "text-teal-600", bg: "bg-teal-50", category: "Academics", path: "/study-center/homework-assignments" },
    { name: "Offline Exams Guide", icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50", category: "Academics", path: "/offline-exams/guide" },

    { name: "Student ID Cards", icon: Award, color: "text-indigo-600", bg: "bg-indigo-50", category: "Students", path: "/id-cards/student" },
    { name: "Certificate Templates", icon: Award, color: "text-purple-600", bg: "bg-purple-50", category: "Students", path: "/certificates/templates" },
    { name: "TC & Exit Documents", icon: FileCheck, color: "text-blue-500", bg: "bg-blue-50", category: "Students", path: "/certificates/document" }
  ];

  const filteredModules = rawModules.filter(m => {
    const matchesCategory = activeCategory === "All" || m.category === activeCategory;
    const translatedName = getTranslation(m.name, currentLang);
    const matchesQuery = searchQuery.trim() === "" || 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      translatedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Grid className="w-5 h-5 text-indigo-600" />
        <h2 className="text-base font-bold text-gray-800">
          {getTranslation('ecosystemHubTitle', currentLang)}
        </h2>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        <strong className="text-indigo-600 font-bold">236</strong> {getTranslation('modulesSubtitle', currentLang)}
      </p>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-5">
        <div className="relative">
          <input 
            ref={searchInputRef}
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getTranslation('searchModulesPlaceholder', currentLang)}
            className="pl-8 pr-8 py-1.5 bg-gray-50/80 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-64 transition-all"
          />
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
          <div className="absolute right-2 top-1.5 text-[10px] text-gray-400 border border-gray-200 bg-white px-1.5 py-0.5 rounded shadow-2xs font-mono">
            /
          </div>
        </div>
        
        <div className="flex gap-1.5 text-xs font-medium text-gray-500 overflow-x-auto pb-1 sm:pb-0">
          {rawCategories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-md cursor-pointer transition-colors whitespace-nowrap text-xs font-semibold ${
                activeCategory === cat 
                  ? "bg-indigo-600 text-white font-bold shadow-2xs" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200/60"
              }`}
            >
              {getTranslation(cat.toLowerCase().replace(/ & /g, '').replace(/ /g, ''), currentLang) || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Modules */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 auto-rows-fr">
        {filteredModules.map((module, idx) => {
          const Icon = module.icon;
          return (
            <div 
              key={idx} 
              onClick={() => navigate(module.path)}
              className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-100 hover:border-indigo-200 hover:shadow-xs transition-all cursor-pointer bg-white group text-center"
            >
              <div className={`w-9 h-9 rounded-lg ${module.bg} flex items-center justify-center mb-2 group-hover:scale-105 transition-transform`}>
                <Icon className={`w-4 h-4 ${module.color}`} />
              </div>
              <span className="text-[11px] font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                {getTranslation(module.name, currentLang)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EcosystemHub;

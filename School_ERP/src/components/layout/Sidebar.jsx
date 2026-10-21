import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  Search, 
  LayoutDashboard, 
  Compass, 
  Headset, 
  Wallet, 
  Calculator, 
  Users, 
  BookOpen, 
  Monitor, 
  TrendingUp, 
  FileText, 
  ClipboardList, 
  MonitorPlay, 
  UserCog, 
  Calendar, 
  BookMarked,
  ChevronLeft,
  ChevronDown,
  PenTool,
  QrCode,
  Fingerprint,
  ClipboardCheck,
  BarChart2,
  ShieldCheck,
  LayoutGrid,
  Video,
  Award,
  IdCard,
  Megaphone,
  Library,
  Warehouse,
  Bus,
  Network,
  Building,
  HelpCircle,
  Package,
  Cctv,
  PieChart,
  Settings,
  HardDrive,
  MessageCircle,
  MessageSquare,
  User,
  ChevronsRight,
  LogOut
} from "lucide-react";
import { getTranslation } from "../../utils/translations";

const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      return localStorage.getItem('app_language') || 'English';
    } catch (e) {
      return 'English';
    }
  });

  useEffect(() => {
    const handleLangChange = (e) => {
      if (e.detail) setCurrentLang(e.detail);
    };
    window.addEventListener('app_language_changed', handleLangChange);
    return () => window.removeEventListener('app_language_changed', handleLangChange);
  }, []);

  const toggleMenu = (name) => {
    setOpenMenu(prev => (prev === name ? null : name));
  };

  const mainNav = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Lead Management", icon: TrendingUp, path: "/leads/dashboard" },
    { name: "Competency-Based (CBC)", icon: Network, path: "/cbc/dashboard" },
    { name: "Contact Support", icon: Headset, path: "/contact-support" },
  ];

  const managementNav = [
    { 
      name: "Finance & Fees", 
      icon: Wallet, 
      path: "#",
      children: [
        { name: "Fees Dashboard", path: "/finance/dashboard" },
        { name: "Collect Fees", path: "/finance/collect" },
        { name: "Search Due Fees", path: "/finance/search-due-fees" },
        { name: "All Transactions", path: "/finance/transactions" },
        { name: "Online Transactions", path: "/finance/online-transactions" },
        { name: "Fee Challans", path: "/finance/challans" },
        { name: "Assign Fees", path: "/finance/assign" },
        { name: "Fees Carry Forward", path: "/finance/carry-forward" },

        { name: "Fee Groups", path: "/finance/groups" },
        { name: "Fees Discount", path: "/finance/discount" },
        { name: "Fee Types", path: "/finance/types" },
        { name: "Generate Due Slip", path: "/finance/generate-slip" },
        { name: "Due Slip History", path: "/finance/slip-history" },
        { name: "Fee Data Audit", path: "/finance/audit" },
      ]
    },
    { 
      name: "Accounts", 
      icon: Calculator, 
      path: "#",
      children: [
        { name: "Accounts Dashboard", path: "/accounts/dashboard" },
        { name: "Income", path: "/accounts/income" },
        { name: "Expense", path: "/accounts/expense" },
        { name: "Income Heads", path: "/accounts/income-heads" },
        { name: "Expense Heads", path: "/accounts/expense-heads" },
        { name: "Bank Accounts", path: "/accounts/bank-accounts" },
      ]
    },
    { 
      name: "Student Information", 
      icon: Users, 
      path: "#",
      children: [
        { name: "Student Dashboard", path: "/students/dashboard" },
        { name: "Student Admission", path: "/students/admission" },
        { name: "Student List", path: "/students/list" },
        { name: "Search by Photo", path: "/students/search-photo" },
        { name: "Parents & Guardians", path: "/students/parents" },
        { name: "Student Attendance", path: "/students/attendance" },
        { name: "Behavior Records", path: "/students/behavior" },
        { name: "Student Houses", path: "/students/houses" },
        { name: "Student Categories", path: "/students/categories" },
        { name: "TC & Exit", path: "/students/tc" },
        { name: "Health Records", path: "/students/health" },
      ]
    },
    { 
      name: "Academics", 
      icon: BookOpen, 
      path: "#",
      children: [
        { name: "Academic Dashboard", path: "/academics/dashboard" },
        { name: "Academic Sessions", path: "/academics/sessions" },
        { name: "Classes", path: "/academics/classes" },
        { name: "Sections", path: "/academics/sections" },
        { name: "Subjects", path: "/academics/subjects" },
        { name: "Assign Subjects", path: "/academics/assign-subjects" },
        { name: "Assign Electives", path: "/academics/assign-electives" },
        { name: "Assign Class Teacher", path: "/academics/assign-class-teacher" },
        { name: "Manage Periods", path: "/academics/manage-periods" },
        { name: "Class Timetable", path: "/academics/timetable" },
        { name: "Promote Students", path: "/academics/promote" },
      ]
    },
    { 
      name: "Front Office", 
      icon: Monitor, 
      path: "#",
      children: [
        { name: "Front Office Dashboard", path: "/front-office/dashboard" },
        { name: "Admission Enquiries", path: "/front-office/admission-enquiries" },
        { name: "Visitor Book", path: "/front-office/visitor-book" },
        { name: "Complaints", path: "/front-office/complaints" },
        { name: "Postal Records", path: "/front-office/postal-records" },
        { name: "Gate Passes", path: "/front-office/gate-passes" },
        { name: "Gate Terminal", path: "/front-office/gate-passes/terminal" },
        { name: "Campus Workers", path: "/front-office/campus-workers" },
      ]
    },
    { 
      name: "Lead Management", 
      icon: TrendingUp, 
      path: "#",
      children: [
        { name: "Lead Dashboard", path: "/leads/dashboard" },
        { name: "Lead Pipeline Board", path: "/leads/pipeline" },
        { name: "All Leads", path: "/leads/all" },
        { name: "Follow-ups", path: "/leads/follow-ups" },
        { name: "Lead Sources & Stages", path: "/leads/sources-stages" },
      ]
    },
    { 
      name: "Offline Examinations", 
      icon: FileText, 
      path: "#",
      children: [
        { name: "Exam Dashboard", path: "/offline-exams/dashboard" },
        { name: "Manage Offline Exams", path: "/offline-exams/manage" },
        { name: "Exam Types", path: "/offline-exams/types" },
        { name: "Schedule & Marks Setup", path: "/offline-exams/schedule-marks" },
        { name: "Enter Marks", path: "/offline-exams/enter-marks" },
        { name: "Cocurricular Areas", path: "/offline-exams/cocurricular-areas" },
        { name: "Cocurricular Grades", path: "/offline-exams/cocurricular-grades" },
        { name: "Manage Grades", path: "/offline-exams/manage-grades" },
        { name: "Report Card Setups", path: "/offline-exams/report-card-setups" },
        { name: "Generate Marksheet", path: "/offline-exams/generate-marksheet" },
        { name: "Upload Marksheet", path: "/offline-exams/upload-marksheet" },
        { name: "Manage Uploads", path: "/offline-exams/manage-uploads" },
        { name: "Teacher Remarks", path: "/offline-exams/teacher-remarks" },
        { name: "Datesheet", path: "/offline-exams/datesheet" },
      ]
    },
    { 
      name: "CBC Academics", 
      icon: ClipboardList, 
      path: "#",
      children: [
        { name: "CBC Dashboard", path: "/cbc-academics/dashboard" },
        { name: "Strands & Outcomes", path: "/cbc-academics/strands-outcomes" },
        { name: "CBC Assessments", path: "/cbc-academics/assessments" },
        { name: "Core Competencies", path: "/cbc-academics/core-competencies" },
        { name: "Pathways & Tracks", path: "/cbc-academics/pathways-tracks" },
        { name: "CBC Reports", path: "/cbc-academics/reports" },
      ]
    },
    { 
      name: "Online Examinations", 
      icon: MonitorPlay, 
      path: "#",
      children: [
        { name: "Online Exam Dashboard", path: "/online-exams/dashboard" },
        { name: "Manage Online Exams", path: "/online-exams/manage" },
        { name: "Question Bank", path: "/online-exams/question-bank" },
        { name: "Chapters & Topics", path: "/online-exams/chapters-topics" },
      ]
    },
    { 
      name: "Human Resource", 
      icon: UserCog, 
      path: "#",
      children: [
        { name: "HR Dashboard", path: "/hr/dashboard" },
        { name: "Teacher Portal (:5177)", path: "http://localhost:5177", isExternal: true },
        { name: "Add New Staff", path: "/hr/staff/new" },
        { name: "Staff Directory", path: "/hr/staff" },
        { name: "Staff Attendance", path: "/hr/staff-attendance" },
        { name: "Payroll", path: "/hr/payroll" },
        { name: "Set Salary", path: "/hr/set-salary" },
        { name: "Approve Leave", path: "/hr/approve-leave" },
        { name: "Leave Types", path: "/hr/leave-types" },
        { name: "Departments", path: "/hr/departments" },
        { name: "Designations", path: "/hr/designations" },
        { name: "Staff ID Card", path: "/hr/id-cards" },
        { name: "HR Settings", path: "/hr/settings" },
        { name: "Manage Staff Loans", path: "/hr/manage-loans" },
        { name: "Salary Templates", path: "/hr/salary-templates" },
        { name: "Appraisal Cycles", path: "/hr/appraisal-cycles" },
        { name: "Appraisal Criteria", path: "/hr/appraisal-criteria" },
        { name: "Appraisals", path: "/hr/appraisals" },
      ]
    },
    { 
      name: "PTM Meetings", 
      icon: Calendar, 
      path: "#",
      children: [
        { name: "PTM Dashboard", path: "/ptm/dashboard" },
        { name: "PTM Schedule Meetings", path: "/ptm/schedule" },
        { name: "PTM Guide", path: "/ptm/guide" },
        { name: "PTM Attendance & Remarks", path: "/ptm/attendance-remarks" },
        { name: "PTM Follow-ups", path: "/ptm/follow-ups" },
        { name: "PTM Reports", path: "/ptm/reports" },
      ]
    },
    { 
      name: "Lesson Planner", 
      icon: BookMarked, 
      path: "#",
      children: [
        { name: "Lesson Planner Dashboard", path: "/lesson-planner/dashboard" },
        { name: "Lesson Plans", path: "/lesson-planner/plans" },
        { name: "Lesson Planner Guide", path: "/lesson-planner/guide" },
        { name: "Lesson Plan Review", path: "/lesson-planner/review" },
        { name: "Lesson Plan Approvals", path: "/lesson-planner/approvals" },
        { name: "Lesson Plan Coverage", path: "/lesson-planner/coverage" },
        { name: "Lesson Plan Reports", path: "/lesson-planner/reports" },
        { name: "Lesson Planner Settings", path: "/lesson-planner/settings" },
      ]
    },
    { 
      name: "OSM Module", 
      icon: PenTool, 
      path: "#",
      children: [
        { name: "OSM Dashboard", path: "/osm-module/dashboard" },
        { name: "OSM Sessions", path: "/osm-module/sessions" },
        { name: "OSM Evaluate", path: "/osm-module/evaluate" },
        { name: "OSM Reports", path: "/osm-module/reports" },
        { name: "OSM Guide", path: "/osm-module/guide" },
        { name: "OSM Moderation", path: "/osm-module/moderation" },
      ]
    },
    { 
      name: "QR Code Attendance", 
      icon: QrCode, 
      path: "#",
      children: [
        { name: "QR Attendance", path: "/qr-attendance/attendance" },
        { name: "QR Attendance Setting", path: "/qr-attendance/setting" },
        { name: "QR Attendance Report", path: "/qr-attendance/report" },
        { name: "QR Scan Audit", path: "/qr-attendance/scan-audit" },
      ]
    },
    { 
      name: "Biometric Devices", 
      icon: Fingerprint, 
      path: "#",
      children: [
        { name: "All Devices", path: "/biometric/all-devices" },
        { name: "Attendance Logs", path: "/biometric/attendance-logs" },
        { name: "Face Monitoring", path: "/biometric/face-monitoring" },
        { name: "Agent Logs", path: "/biometric/agent-logs" },
      ]
    },
    { 
      name: "Assessment", 
      icon: ClipboardCheck, 
      path: "#",
      children: [
        { name: "Assessment Dashboard", path: "/assessment/dashboard" },
        { name: "Assessments", path: "/assessment/list" },
        { name: "Enter Marks", path: "/assessment/enter-marks" },
        { name: "Assessment Reports", path: "/assessment/reports" },
        { name: "Student Dossier", path: "/assessment/student-report" },
        { name: "Rank List", path: "/assessment/rank-list" },
        { name: "Assessment Guide", path: "/assessment/guide" },
      ]
    },
    { 
      name: "Surveys & Feedback", 
      icon: BarChart2, 
      path: "#",
      children: [
        { name: "Survey Dashboard", path: "/surveys/dashboard" },
        { name: "All Surveys", path: "/surveys/all" },
        { name: "My Surveys", path: "/surveys/my-surveys" },
        { name: "Feedback Triage", path: "/surveys/feedback-triage" },
        { name: "Survey Guide", path: "/surveys/guide" },
      ]
    },
    { 
      name: "Compliance & Governance", 
      icon: ShieldCheck, 
      path: "#",
      children: [
        { name: "Compliance Overview", path: "/compliance/overview" },
        { name: "School Profile", path: "/compliance/school-profile" },
        { name: "Compliance Packs", path: "/compliance/packs" },
        { name: "Field Settings", path: "/compliance/field-settings" },
        { name: "Document Vault", path: "/compliance/document-vault" },
        { name: "Compliance Checklist", path: "/compliance/checklist" },
        { name: "Data Records", path: "/compliance/data-records" },
        { name: "Data Validator", path: "/compliance/data-validator" },
        { name: "Government Reports", path: "/compliance/government-reports" },
        { name: "Inspections", path: "/compliance/inspections" },
        { name: "Compliance Calendar", path: "/compliance/calendar" },
      ]
    },
  ];

  const modulesNav = [
    { name: "Apps Center", icon: LayoutGrid, path: "/apps-center" },
    { 
      name: "Live Classes", 
      icon: Video, 
      path: "#",
      children: [
        { name: "Manage Live Classes", path: "/live-classes/manage" },
        { name: "Live Class Settings", path: "/live-classes/settings" },
      ]
    },
    { 
      name: "Study Center", 
      icon: BookOpen, 
      path: "#",
      children: [
        { name: "Dashboard", path: "/study-center/dashboard" },
        { name: "Classwork & Logbook", path: "/study-center/classwork-logbook" },
        { name: "Manage Syllabus", path: "/study-center/manage-syllabus" },
        { name: "Manage Resources", path: "/study-center/manage-resources" },
        { name: "Homework & Assignments", path: "/study-center/homework-assignments" },
      ]
    },
    { 
      name: "Certificates", 
      icon: Award, 
      path: "#",
      children: [
        { name: "Certificate Templates", path: "/certificates/templates" },
        { name: "Certificates & Document", path: "/certificates/documents" },
      ]
    },
    { 
      name: "ID Cards", 
      icon: IdCard, 
      path: "#",
      children: [
        { name: "Student ID Cards", path: "/id-cards/student" },
        { name: "Staff ID Cards", path: "/id-cards/staff" },
        { name: "Card Designs", path: "/id-cards/designs" },
      ]
    },
    { 
      name: "Communicate", 
      icon: Megaphone, 
      path: "#",
      children: [
        { name: "Notice Board", path: "/communicate/notice-board" },
        { name: "Events & Holidays", path: "/communicate/events-holidays" },
        { name: "Compose Broadcast", path: "/communicate/compose-broadcast" },
        { name: "Broadcast History", path: "/communicate/broadcast-history" },
        { name: "Image Gallery", path: "/communicate/image-gallery" },
      ]
    },
    { 
      name: "Library", 
      icon: Library, 
      path: "#",
      children: [
        { name: "Library Dashboard", path: "/library/dashboard" },
        { name: "Issue/Return Book", path: "/library/issue-return" },
        { name: "Manage Books", path: "/library/manage" },
        { name: "Book Categories", path: "/library/categories" },
      ]
    },

    { 
      name: "Transport", 
      icon: Bus, 
      path: "#",
      children: [
        { name: "Transport Dashboard", path: "/transport/dashboard" },
        { name: "Live Operations", path: "/transport/live-operations" },
        { name: "Manage Vehicles", path: "/transport/manage-vehicles" },
        { name: "Manage Routes", path: "/transport/manage-routes" },
        { name: "Live Vehicle Tracking", path: "/transport/live-tracking" },
        { name: "Drivers", path: "/transport/drivers" },
      ]
    },
    { 
      name: "Hostel", 
      icon: Building, 
      path: "#",
      children: [
        { name: "Hostel Dashboard", path: "/hostel/dashboard" },
        { name: "Student Allocation", path: "/hostel/student-allocation" },
        { name: "Manage Rooms", path: "/hostel/manage-rooms" },
        { name: "Room Types", path: "/hostel/room-types" },
        { name: "Manage Hostels", path: "/hostel/manage-hostels" },
      ]
    },
    { 
      name: "Help Center", 
      icon: HelpCircle, 
      path: "#",
      children: [
        { name: "Browse Articles", path: "/help-center/articles" },
        { name: "Manage Categories", path: "/help-center/categories" },
        { name: "AI Assistant", path: "/help-center/ai-chatbot" },
        { name: "Support Desk", path: "/contact-support" },
      ]
    },
    { 
      name: "Asset Management", 
      icon: Package, 
      path: "#",
      children: [
        { name: "Asset Dashboard", path: "/asset-management/dashboard" },
        { name: "Asset Register", path: "/asset-management/register" },
        { name: "Asset Categories", path: "/asset-management/categories" },
        { name: "Asset Assignments", path: "/asset-management/assignments" },
        { name: "Asset Depreciation", path: "/asset-management/depreciation" },
        { name: "Asset Maintenance", path: "/asset-management/maintenance" },
        { name: "Asset Disposals", path: "/asset-management/disposals" },
        { name: "Asset Audits", path: "/asset-management/audits" },
        { name: "Asset Reports", path: "/asset-management/reports" },
      ]
    },
    { 
      name: "Engagement", 
      icon: Megaphone, 
      path: "#",
      children: [
        { name: "Creatives", path: "/engagement/creatives" },
        { name: "Birthday Manager", path: "/engagement/birthday-manager" },
        { name: "Festival Greetings", path: "/engagement/festival-greetings" },
        { name: "Auto-send Settings", path: "/engagement/auto-send-settings" },
      ]
    },
    { 
      name: "CCTV", 
      icon: Cctv, 
      path: "#",
      children: [
        { name: "Camera Wall", path: "/cctv/camera-wall" },
        { name: "CCTV Cameras", path: "/cctv/cameras" },
        { name: "CCTV Access Log", path: "/cctv/access-log" },
      ]
    },
    { name: "Reports & Analytics", icon: PieChart, path: "/reports" },
  ];

  const systemNav = [
    { 
      name: "Settings & Billing", 
      icon: Settings, 
      path: "#",
      children: [
        { name: "School Settings", path: "/settings/school-settings" },
        { name: "Custom Fields", path: "/settings/custom-fields" },
        { name: "Roles & Permissions", path: "/settings/roles-permissions" },
        { name: "Payment Gateway", path: "/settings/payment-gateway" },
        { name: "Notification Settings", path: "/settings/notification-settings" },
        { name: "Admission Settings", path: "/settings/admission-settings" },
        { name: "Admission Form Fields", path: "/settings/admission-form-fields" },
        { name: "Audit Trail", path: "/settings/audit-trail" },
        { name: "Subscription", path: "/settings/subscription" },
        { name: "Subscription History", path: "/settings/subscription-history" },
        { name: "Module Settings", path: "/settings/module-settings" },
        { name: "Content Safety", path: "/settings/content-safety" },
      ]
    },
    { name: "Backup Management", icon: HardDrive, path: "/backup" },
  ];

  const communicationNav = [
    { name: "Comms Wallet", icon: Wallet, path: "/comms-wallet" },
    { name: "Chat Moderation", icon: MessageSquare, path: "/chat-moderation" },
    { name: "Messages", icon: MessageCircle, path: "/messages" },
  ];

  const accountNav = [
    { name: "My Profile", icon: User, path: "/profile" },
    { name: "Sign Out", icon: LogOut, path: "/logout" },
  ];

  useEffect(() => {
    const allGroups = [...managementNav, ...modulesNav, ...systemNav, ...communicationNav, ...accountNav];
    for (const group of allGroups) {
      if (group.children && group.children.some(child => location.pathname === child.path || location.pathname.startsWith(child.path + '/'))) {
        setOpenMenu(group.name);
        break;
      }
    }
  }, [location.pathname]);


  const filterItems = (items) => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase().trim();
    return items.reduce((acc, item) => {
      const translatedName = getTranslation(item.name, currentLang);
      if (item.name.toLowerCase().includes(q) || translatedName.toLowerCase().includes(q)) {
        acc.push(item);
      } else if (item.children) {
        const matchingChildren = item.children.filter(c => {
          const childTrans = getTranslation(c.name, currentLang);
          return c.name.toLowerCase().includes(q) || childTrans.toLowerCase().includes(q);
        });
        if (matchingChildren.length > 0) {
          acc.push({ ...item, children: matchingChildren });
        }
      }
      return acc;
    }, []);
  };

  const renderNavSection = (title, items) => {
    const filtered = filterItems(items);
    if (filtered.length === 0) return null;

    return (
      <div className="mb-4">
        {!isCollapsed && (
          <h3 className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 mt-3">{getTranslation(title, currentLang)}</h3>
        )}
        <ul className="space-y-0.5">
          {filtered.map((item) => {
            const isSearchActive = !!searchQuery.trim();
            const isActiveGroup = isSearchActive || openMenu === item.name;
            return (
              <li key={item.name} title={isCollapsed ? getTranslation(item.name, currentLang) : undefined}>
                {item.children ? (
                  <div className="flex flex-col">
                    <button 
                      onClick={() => {
                        if (isCollapsed) {
                          if (item.children && item.children.length > 0 && item.children[0].path) {
                            navigate(item.children[0].path);
                          }
                        } else {
                          toggleMenu(item.name);
                        }
                      }}
                      className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-2.5 text-[13.5px] transition-all duration-200 rounded-lg mx-1 group cursor-pointer ${
                        isActiveGroup && !isCollapsed 
                          ? 'bg-slate-800/80 text-white font-medium' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                      title={isCollapsed ? getTranslation(item.name, currentLang) : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-[18px] h-[18px] transition-colors ${isActiveGroup ? 'text-[#ff5c0a]' : 'text-slate-400 group-hover:text-slate-200'}`} />
                        {!isCollapsed && <span className="font-medium text-[13px]">{getTranslation(item.name, currentLang)}</span>}
                      </div>
                      {!isCollapsed && (
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isActiveGroup ? 'rotate-180 text-[#ff5c0a]' : 'text-slate-500'}`} />
                      )}
                    </button>
                    {/* Dropdown Items */}
                    {!isCollapsed && (
                      <div className={`grid transition-all duration-300 ease-in-out ${isActiveGroup ? 'grid-rows-[1fr] opacity-100 mt-1 mb-1' : 'grid-rows-[0fr] opacity-0'}`}>
                        <ul className="overflow-hidden">
                          <div className="pl-6 pr-2 space-y-0.5 border-l border-slate-700/60 ml-6 my-1">
                            {item.children.map((child) => {
                              if (child.isExternal || child.path.startsWith('http')) {
                                return (
                                  <li key={child.name}>
                                    <a
                                      href={child.path}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between gap-2 px-3 py-1.5 text-[12.5px] rounded-md transition-all duration-150 text-emerald-400 hover:text-white hover:bg-emerald-950/40 border border-emerald-500/20 my-0.5"
                                    >
                                      <div className="flex items-center gap-2 truncate">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                                        <span className="truncate font-semibold">{getTranslation(child.name, currentLang)}</span>
                                      </div>
                                      <span className="text-[10px] text-emerald-300 font-mono font-bold bg-emerald-500/20 px-1 rounded flex-shrink-0">5177 ↗</span>
                                    </a>
                                  </li>
                                );
                              }
                              const isActiveLink = location.pathname === child.path || (child.path !== '/' && location.pathname.startsWith(child.path + '/'));
                              return (
                                <li key={child.name}>
                                  <NavLink
                                    to={child.path}
                                    className={`flex items-center gap-2.5 px-3 py-1.5 text-[12.5px] rounded-md transition-all duration-150 ${
                                      isActiveLink 
                                        ? 'text-white bg-[#ff5c0a] font-semibold shadow-xs' 
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                                    }`}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full transition-all ${isActiveLink ? 'bg-white scale-125' : 'bg-slate-500'}`} />
                                    <span className="truncate">{getTranslation(child.name, currentLang)}</span>
                                  </NavLink>
                                </li>
                              );
                            })}
                          </div>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink 
                    to={item.path}
                    className={({ isActive }) => 
                      `flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-2 text-[13.5px] rounded-lg mx-1 transition-all duration-150 ${
                        isActive 
                          ? 'bg-gradient-to-r from-[#ff5c0a] to-[#ff7a29] text-white font-semibold shadow-md shadow-orange-500/20' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-[18px] h-[18px] ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        {!isCollapsed && <span className="font-medium text-[13px]">{getTranslation(item.name, currentLang)}</span>}
                      </div>
                    )}
                  </NavLink>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const filteredMainNav = filterItems(mainNav);

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-[245px]'} transition-all duration-300 bg-[#131927] border-r border-[#1e2638] h-screen flex flex-col overflow-y-auto flex-shrink-0 shadow-xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700/60 hover:[&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full`}>
      {/* Brand & Logo Area */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-5'} py-4 sticky top-0 bg-[#131927]/95 backdrop-blur-md z-20 border-b border-[#1e2638] min-h-[64px]`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff5c0a] to-[#ff8c42] p-0.5 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
          <div className="w-full h-full bg-[#131927] rounded-[10px] flex items-center justify-center">
            <span className="font-black text-[12px] tracking-wider text-[#ff5c0a]">ERP</span>
          </div>
        </div>
        {!isCollapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-white font-bold text-[15px] tracking-tight leading-tight truncate">School ERP</span>
            <span className="text-slate-400 text-[11px] font-medium tracking-wide">Enterprise Suite</span>
          </div>
        )}
      </div>

      {/* Real-time Search Menu */}
      {!isCollapsed && (
        <div className="px-3.5 py-3 border-b border-slate-800/50">
          <div className="relative group">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter menu..." 
              className="w-full bg-slate-900/90 text-xs text-white placeholder-slate-400 border border-slate-700/70 rounded-lg pl-8 pr-7 py-2 focus:outline-none focus:ring-1 focus:ring-[#ff5c0a] focus:border-[#ff5c0a] transition-all font-normal"
            />
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <Search className="w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#ff5c0a] transition-colors" />
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation Sections */}
      <div className="flex-1 px-1.5 py-2 space-y-1">
        {/* Main Navigation */}
        {filteredMainNav.length > 0 && (
          <div className={`mb-3 ${isCollapsed ? 'mt-2' : ''}`}>
            {!isCollapsed && <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{getTranslation('MAIN MENU', currentLang)}</h3>}
            <ul className="space-y-0.5">
              {filteredMainNav.map((item) => (
                <li key={item.name} title={isCollapsed ? getTranslation(item.name, currentLang) : undefined}>
                  <NavLink 
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) => 
                      `flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-2 text-[13px] rounded-lg transition-all duration-150 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#ff5c0a] to-[#ff7a29] text-white font-semibold shadow-md shadow-orange-500/20' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                        }`} />
                        {!isCollapsed && <span className="truncate">{getTranslation(item.name, currentLang)}</span>}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}

        {renderNavSection("MANAGEMENT", managementNav)}
        {renderNavSection("MODULES", modulesNav)}
        {renderNavSection("SYSTEM", systemNav)}
        {renderNavSection("COMMUNICATION", communicationNav)}
        {renderNavSection("ACCOUNT", accountNav)}

        {/* Developer Branding & Attribution Footer (Scrollable with menu, exactly like Teacher Panel) */}
        {!isCollapsed ? (
          <div className="mt-6 mb-2 px-1 pt-3 border-t border-slate-800/80 text-center">
            <div className="bg-gradient-to-r from-slate-900/90 via-slate-800/60 to-slate-900/90 rounded-xl p-2.5 border border-slate-800/80 shadow-xs hover:border-[#ff5c0a]/40 transition-colors">
              <p className="text-[11px] font-bold text-slate-300 tracking-wide mb-1">
                &copy; 2026 School ERP
              </p>
              <p className="text-[10px] font-medium text-slate-400 leading-relaxed">
                Developed by <span className="text-white font-bold">RAJ YADAV</span> <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent font-bold">@ALLCORE SOLUTION</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 mb-2 py-2 border-t border-slate-800/80 flex items-center justify-center" title="© 2026 School ERP - Developed by RAJ YADAV @ALLCORE SOLUTION">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

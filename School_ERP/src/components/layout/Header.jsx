import { 
  Menu, 
  ChevronDown, 
  Search, 
  Plus, 
  Bell, 
  Settings, 
  Palette,
  Grid,
  User,
  LogOut,
  Building,
  CheckCircle2,
  FileText,
  UserPlus,
  MessageSquare,
  MessageCircle,
  Phone,
  ShieldCheck,
  BookOpen,
  Calendar,
  X,
  Compass,
  ArrowRight,
  Users,
  GraduationCap,
  DollarSign,
  Bus,
  Bed,
  Clock,
  Video,
  Globe
} from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import CommandCenterModal from './CommandCenterModal';
import LanguageDropdown from './LanguageDropdown';
import AcademicYearDropdown from './AcademicYearDropdown';
import { studentService } from '../../api/studentService';
import { noticeService } from '../../api/noticeService';
import { financeService } from '../../api/financeService';
import { getTranslation } from '../../utils/translations';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [isDesignsModalOpen, setIsDesignsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      const saved = localStorage.getItem('app_language');
      return (saved && saved.toLowerCase() === 'hindi') ? 'English' : (saved || 'English');
    } catch (e) {
      return 'English';
    }
  });

  const [currentUserData, setCurrentUserData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const handleProfileUpdate = (e) => {
      if (e.detail) setCurrentUserData(e.detail);
      else {
        try {
          setCurrentUserData(JSON.parse(localStorage.getItem('user') || '{}'));
        } catch (err) {}
      }
    };
    window.addEventListener('user_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('user_profile_updated', handleProfileUpdate);
  }, []);

  // Dynamic School / Tenant State
  const [schools, setSchools] = useState([]);
  const [activeSchool, setActiveSchool] = useState(() => {
    try {
      const savedName = localStorage.getItem('schoolName');
      const savedId = localStorage.getItem('active_school_id') || localStorage.getItem('schoolId');
      if (savedName && savedName !== 'Greenwood International School') {
        return { _id: savedId, schoolName: savedName };
      }
    } catch (_) {}
    return null;
  });
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);
  const schoolDropdownRef = useRef(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await axiosInstance.get('/tenant/list');
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        if (list.length > 0) {
          setSchools(list);
          const savedId = localStorage.getItem('active_school_id') || localStorage.getItem('schoolId');
          const savedName = localStorage.getItem('schoolName');
          
          let current = list.find(s => s._id === savedId || (savedName && savedName !== 'Greenwood International School' && s.schoolName === savedName));
          if (!current) {
            const userTenantId = currentUserData?.tenant?._id || currentUserData?.tenant;
            if (userTenantId) {
              current = list.find(s => s._id === userTenantId);
            }
          }
          if (!current) {
            current = list[0]; // Default to first registered school (RAM INTERNATIONAL SCHOOL)
          }

          if (current) {
            setActiveSchool(current);
            localStorage.setItem('active_school_id', current._id);
            localStorage.setItem('schoolId', current._id);
            localStorage.setItem('schoolName', current.schoolName);
          }
        }
      } catch (e) {
        console.warn('Could not load schools list:', e);
      }
    };
    fetchSchools();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (schoolDropdownRef.current && !schoolDropdownRef.current.contains(e.target)) {
        setIsSchoolDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSchool = (school) => {
    if (!school) {
      setActiveSchool({ _id: '', schoolName: 'All Schools (Global Network)' });
      localStorage.removeItem('active_school_id');
      localStorage.removeItem('schoolId');
      localStorage.setItem('schoolName', 'All Schools (Global Network)');
      window.dispatchEvent(new CustomEvent('school_changed', { detail: null }));
    } else {
      setActiveSchool(school);
      localStorage.setItem('active_school_id', school._id);
      localStorage.setItem('schoolId', school._id);
      localStorage.setItem('schoolName', school.schoolName);
      window.dispatchEvent(new CustomEvent('school_changed', { detail: school }));
    }
    setIsSchoolDropdownOpen(false);
    window.dispatchEvent(new CustomEvent('command_center_refresh_data'));
    window.dispatchEvent(new CustomEvent('user_profile_updated'));
  };

  // Helpers to persist read notification IDs across reloads
  const getReadNotificationIds = () => {
    try {
      return JSON.parse(localStorage.getItem('erp_read_notification_ids') || '[]');
    } catch (e) {
      return [];
    }
  };

  const saveReadNotificationIds = (newIds) => {
    try {
      const existing = getReadNotificationIds();
      const updated = Array.from(new Set([...existing, ...newIds]));
      localStorage.setItem('erp_read_notification_ids', JSON.stringify(updated));
    } catch (e) {}
  };

  const [notifications, setNotifications] = useState([]);

  // Fetch real notifications from backend API
  const fetchRealNotifications = async () => {
    try {
      const readIds = getReadNotificationIds();
      const [noticeRes, feeRes] = await Promise.allSettled([
        noticeService.getNotices(),
        financeService.getAllTransactions({ limit: 6 })
      ]);

      const items = [];
      // Real notices
      if (noticeRes.status === 'fulfilled' && Array.isArray(noticeRes.value?.data)) {
        noticeRes.value.data.forEach((n, idx) => {
          const notifId = `notice-${n._id || idx}`;
          items.push({
            id: notifId,
            title: n.title || 'Official School Notice',
            desc: n.content ? (n.content.length > 55 ? n.content.substring(0, 55) + '...' : n.content) : 'New announcement posted',
            time: n.publishDate ? new Date(n.publishDate).toLocaleDateString() : 'Recent',
            unread: !readIds.includes(notifId),
            type: 'notice'
          });
        });
      }

      // Real recent fee receipts
      if (feeRes.status === 'fulfilled' && Array.isArray(feeRes.value?.data)) {
        feeRes.value.data.slice(0, 5).forEach((tx, idx) => {
          const notifId = `fee-${tx._id || idx}`;
          items.push({
            id: notifId,
            title: `Fee Paid: ₹${Number(tx.amountPaid || tx.amount || 0).toLocaleString('en-IN')}`,
            desc: `Receipt #${tx.receiptNo || 'REC'} • ${tx.studentName || 'Student'}`,
            time: tx.paymentDate ? new Date(tx.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today',
            unread: !readIds.includes(notifId) && idx < 2,
            type: 'fee'
          });
        });
      }

      setNotifications(items);
    } catch (err) {
      console.warn('Real notifications fetch fallback', err);
    }
  };

  useEffect(() => {
    fetchRealNotifications();
    const handleRefresh = () => fetchRealNotifications();
    window.addEventListener('command_center_refresh_data', handleRefresh);
    return () => window.removeEventListener('command_center_refresh_data', handleRefresh);
  }, []);

  const menuRef = useRef(null);
  const searchInputRef = useRef(null);

  const activeUser = currentUserData || {};
  const displayName = activeUser?.name || activeUser?.username || 'Administrator';
  const displayEmail = activeUser?.email || 'admin@schoolerp.com';
  const userAvatar = activeUser?.avatar || '';
  const initials = String(displayName).trim().split(/\s+/).map(n => n[0] || '').join('').substring(0, 2).toUpperCase() || 'AD';
  const schoolName = activeUser?.tenant?.schoolName || 'ALL CORE SOLUTION';

  const quickLinks = [
    // General & Navigation
    { name: 'Dashboard', path: '/', category: 'General', icon: Compass, keywords: 'home main overview' },
    { name: 'ERP Navigator (All Modules)', path: '/erp-navigator', category: 'Navigation', icon: Grid, keywords: 'all screens catalog sitemap' },
    { name: 'Lead Management Dashboard', path: '/leads/dashboard', category: 'Leads CRM', icon: Compass, keywords: 'inquiries prospects pipeline' },
    
    // Students & Parents
    { name: 'Parents & Guardians Directory', path: '/students/parents', category: 'Parents', icon: Users, keywords: 'father mother guardian contact parent details phone login' },
    { name: 'Register New Parent', path: '/students/parents/add', category: 'Parents', icon: UserPlus, keywords: 'add parent create parent guardian account' },
    { name: 'Student Directory & Roster', path: '/students/list', category: 'Students', icon: User, keywords: 'all students list class section roll apar id' },
    { name: 'Student Admission Form', path: '/students/admission', category: 'Students', icon: UserPlus, keywords: 'new admission register enroll student intake' },
    { name: 'Student Attendance Tracker', path: '/students/attendance', category: 'Students', icon: Calendar, keywords: 'daily attendance absent present roll call' },
    { name: 'Student Dashboard', path: '/students/dashboard', category: 'Students', icon: Compass, keywords: 'student analytics stats performance' },
    { name: 'Student Categories', path: '/students/categories', category: 'Students', icon: Users, keywords: 'general obc sc st quota' },
    { name: 'Student Houses', path: '/students/houses', category: 'Students', icon: Building, keywords: 'red blue green yellow house' },
    { name: 'Behavior & Incident Records', path: '/students/behavior', category: 'Students', icon: ShieldCheck, keywords: 'discipline merit penalty' },
    { name: 'Search Student by Photo', path: '/students/search-photo', category: 'Students', icon: User, keywords: 'face id photo search picture' },
    { name: 'Student Health & Medical Records', path: '/students/health', category: 'Students', icon: ShieldCheck, keywords: 'infirmary allergy checkup blood' },
    { name: 'TC & Transfer Exit Records', path: '/students/tc-exit', category: 'Students', icon: FileText, keywords: 'transfer certificate leaving school exit' },

    // Finance & Fees
    { name: 'Fees Collection Desk', path: '/finance/collect', category: 'Finance', icon: FileText, keywords: 'collect fees payment fee challan receipt counter' },
    { name: 'Fees Dashboard', path: '/finance/dashboard', category: 'Finance', icon: FileText, keywords: 'fee stats collection total balance summary' },
    { name: 'Search Due Fees', path: '/finance/search-due-fees', category: 'Finance', icon: FileText, keywords: 'pending fees unpaid dues defaulters list' },
    { name: 'Fee Types & Heads', path: '/finance/fee-types', category: 'Finance', icon: FileText, keywords: 'tuition admission exam transport library fee' },
    { name: 'Fee Groups & Schedules', path: '/finance/fee-groups', category: 'Finance', icon: FileText, keywords: 'monthly quarterly annual fee group' },
    { name: 'Fee Masters & Structure', path: '/finance/fee-masters', category: 'Finance', icon: FileText, keywords: 'fee setup amount allocation class fee' },
    { name: 'All Fee Transactions', path: '/finance/transactions', category: 'Finance', icon: FileText, keywords: 'receipts transaction log upi cash card' },
    { name: 'Day Book Ledger', path: '/finance/day-book', category: 'Finance', icon: FileText, keywords: 'daily cash book debit credit balance' },
    { name: 'Income Management', path: '/finance/income', category: 'Finance', icon: FileText, keywords: 'revenue other income cash in' },
    { name: 'Expense Management', path: '/finance/expense', category: 'Finance', icon: FileText, keywords: 'expenditure bills payments cash out' },

    // Academics
    { name: 'Classes & Sections', path: '/academics/classes', category: 'Academics', icon: BookOpen, keywords: 'class section grade division' },
    { name: 'Subject Management', path: '/academics/subjects', category: 'Academics', icon: BookOpen, keywords: 'maths science english subjects syllabus' },
    { name: 'Class Timetable', path: '/academics/timetable', category: 'Academics', icon: Calendar, keywords: 'routine period schedule timetable bell' },
    { name: 'Teacher Timetable', path: '/academics/teacher-timetable', category: 'Academics', icon: Calendar, keywords: 'faculty schedule workload' },
    { name: 'Homework Management', path: '/academics/homework', category: 'Academics', icon: FileText, keywords: 'assignments daily homework home work' },
    { name: 'Study Material & Syllabus', path: '/academics/study-material', category: 'Academics', icon: BookOpen, keywords: 'syllabus notes textbooks pdf' },
    { name: 'CBC Competency Dashboard', path: '/cbc-academics/dashboard', category: 'Academics', icon: BookOpen, keywords: 'competency based curriculum cbc assessment' },

    // Examinations
    { name: 'Offline Examinations', path: '/offline-exams/dashboard', category: 'Examinations', icon: BookOpen, keywords: 'pen paper term exams schedule datesheet' },
    { name: 'Online Examinations (CBT)', path: '/online-exams/dashboard', category: 'Examinations', icon: BookOpen, keywords: 'computer based test online quiz exam paper' },
    { name: 'Exam Marks Entry', path: '/examinations/marks-entry', category: 'Examinations', icon: FileText, keywords: 'enter scores grades evaluation' },
    { name: 'Print Report Cards & Marksheets', path: '/examinations/print-marksheet', category: 'Examinations', icon: FileText, keywords: 'results print marksheet report card grade card' },
    { name: 'Question Bank', path: '/examinations/question-bank', category: 'Examinations', icon: BookOpen, keywords: 'questions mcq subjective test items' },

    // HRMS & Staff
    { name: 'Staff Directory', path: '/hr/staff', category: 'HRMS', icon: User, keywords: 'employees teachers staff list faculty' },
    { name: 'Add New Staff Member', path: '/hr/staff/new', category: 'HRMS', icon: UserPlus, keywords: 'hire teacher recruit employee' },
    { name: 'Staff Attendance', path: '/hr/attendance', category: 'HRMS', icon: Calendar, keywords: 'teacher attendance biometric leave' },
    { name: 'Staff Payroll & Salaries', path: '/hr/payroll', category: 'HRMS', icon: FileText, keywords: 'salary payslip allowances deductions' },
    { name: 'Staff Leave Management', path: '/hr/leaves', category: 'HRMS', icon: Calendar, keywords: 'casual leave medical leave approval' },

    // Services
    { name: 'Library Management', path: '/library/dashboard', category: 'Services', icon: BookOpen, keywords: 'library books issue return catalog borrow isbn' },
    { name: 'Transport & GPS Fleet', path: '/transport/dashboard', category: 'Services', icon: Building, keywords: 'buses routes driver vehicle tracking gps' },
    { name: 'Hostel Management', path: '/hostel/dashboard', category: 'Services', icon: Building, keywords: 'hostel rooms beds warden boarding' },
    { name: 'Student & Staff ID Cards', path: '/id-cards/dashboard', category: 'Services', icon: FileText, keywords: 'print id cards badge barcode canvas' },
    { name: 'School Visitor & Gate Pass', path: '/school-visit/dashboard', category: 'Services', icon: Calendar, keywords: 'visitor campus gatepass security appointment' },

    // Modern Specialized Modules
    { name: 'Lesson Planner & Syllabus Coverage', path: '/lesson-planner/dashboard', category: 'Modern Modules', icon: BookOpen, keywords: 'lesson plans syllabus tracking daily topics' },
    { name: 'Live Video Classes', path: '/live-classes/dashboard', category: 'Modern Modules', icon: BookOpen, keywords: 'zoom meeting online lectures stream' },
    { name: 'Parent-Teacher Meetings (PTM)', path: '/ptm/dashboard', category: 'Modern Modules', icon: Users, keywords: 'ptm conference feedback parent meetings' },
    { name: 'On-Screen Evaluation (OSM)', path: '/osm/dashboard', category: 'Modern Modules', icon: FileText, keywords: 'digital evaluation digital checking marks' },
    { name: 'Surveys & Feedback Hub', path: '/surveys/dashboard', category: 'Modern Modules', icon: MessageSquare, keywords: 'feedback rating reviews forms' },

    // Communication
    { name: 'Notice Board & Circulars', path: '/communicate/notice-board', category: 'Communication', icon: MessageSquare, keywords: 'circulars announcements news alerts notices' },
    { name: 'Messages, Calls & Web Dialer', path: '/messages', category: 'Communication', icon: MessageCircle, keywords: 'chat whatsapp sms internal dialer' },
    { name: 'Compose Broadcast Notice', path: '/communicate/compose-broadcast', category: 'Communication', icon: MessageSquare, keywords: 'broadcast notification push sms email' },

    // Settings & Reports
    { name: 'School Profile & Settings', path: '/settings/school-settings', category: 'Settings', icon: Settings, keywords: 'school name logo header general configuration' },
    { name: 'Roles & User Permissions', path: '/settings/roles-permissions', category: 'Settings', icon: ShieldCheck, keywords: 'acl permissions roles access control admin' },
    { name: 'Central Reports Hub', path: '/reports/hub', category: 'Reports', icon: FileText, keywords: 'all reports export pdf excel stats' },
    { name: 'My Profile', path: '/profile', category: 'Account', icon: User, keywords: 'account password settings avatar' },
  ];

  const [matchedStudents, setMatchedStudents] = useState([]);
  const [matchedParents, setMatchedParents] = useState([]);
  const [searchingData, setSearchingData] = useState(false);

  // Live search for students and parents from database
  useEffect(() => {
    const q = searchFilter.trim();
    if (!q || q.length < 2) {
      setMatchedStudents([]);
      setMatchedParents([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setSearchingData(true);
        const [studRes, parentRes] = await Promise.allSettled([
          studentService.getStudents({ search: q, limit: 5 }),
          studentService.getParents({ search: q })
        ]);
        if (studRes.status === 'fulfilled' && studRes.value?.data) {
          setMatchedStudents(studRes.value.data.slice(0, 5));
        }
        if (parentRes.status === 'fulfilled' && parentRes.value?.data) {
          setMatchedParents(parentRes.value.data.slice(0, 5));
        }
      } catch (e) {
        // silent
      } finally {
        setSearchingData(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchFilter]);

  const filteredLinks = quickLinks.filter(item => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.keywords && item.keywords.toLowerCase().includes(q))
    );
  });

  // Keyboard shortcut Ctrl+K / Cmd+K for Spotlight search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchModalOpen(false);
        setActiveMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchFilter('');
      setMatchedStudents([]);
      setMatchedParents([]);
    }
  }, [isSearchModalOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    const allIds = notifications.map(n => n.id);
    saveReadNotificationIds(allIds);
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (item) => {
    saveReadNotificationIds([item.id]);
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, unread: false } : n));
    handleNavigate(item.type === 'fee' ? '/finance/transactions' : '/communicate/notice-board');
  };

  const handleNavigate = (path) => {
    navigate(path);
    setActiveMenu(null);
    setIsSearchModalOpen(false);
  };

  return (
    <>
      <header className="bg-white h-14 sm:h-16 border-b border-gray-200/90 flex items-center justify-between px-3 sm:px-6 sticky top-0 z-40 shadow-2xs">
        {/* Left side */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={toggleSidebar} 
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors cursor-pointer"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="relative flex items-center gap-2 sm:gap-3 min-w-0" ref={schoolDropdownRef}>
            <button
              onClick={() => setIsSchoolDropdownOpen(prev => !prev)}
              className="flex items-center gap-1.5 py-1 px-2 -ml-1 rounded-lg hover:bg-slate-100 transition-colors group cursor-pointer text-left"
              title="Click to switch active school"
            >
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#ff5c0a] to-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Building className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs sm:text-base font-bold text-gray-800 tracking-tight truncate max-w-[130px] xs:max-w-[190px] sm:max-w-[260px] md:max-w-none">
                {activeSchool?.schoolName || currentUserData?.tenant?.schoolName || (localStorage.getItem('schoolName') !== 'Greenwood International School' ? localStorage.getItem('schoolName') : '') || 'RAM INTERNATIONAL SCHOOL'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700 transition-transform duration-200 shrink-0 ${isSchoolDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* School Switcher Dropdown Menu */}
            {isSchoolDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Active Institution</p>
                  <p className="text-xs text-slate-600 font-medium">Real-time data filters by selected school</p>
                </div>
                
                <div className="max-h-60 overflow-y-auto py-1">
                  {schools.map(s => {
                    const isSelected = activeSchool?._id === s._id || (!activeSchool?._id && s._id === localStorage.getItem('active_school_id'));
                    return (
                      <button
                        key={s._id}
                        onClick={() => handleSelectSchool(s)}
                        className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer ${isSelected ? 'bg-orange-50/70 text-orange-950 font-bold' : 'text-slate-700'}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#ff5c0a] text-white shadow-xs' : 'bg-slate-100 text-slate-600'}`}>
                            <Building className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate">{s.schoolName}</p>
                            <p className="text-[10px] text-slate-400 truncate">{s.address || s.city || 'Campus Branch'} • {s.phone || 'Active'}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#ff5c0a] shrink-0" />
                        )}
                      </button>
                    );
                  })}

                  {/* All Schools Option for SuperAdmin */}
                  <button
                    onClick={() => handleSelectSchool(null)}
                    className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 border-t border-slate-100 transition-colors cursor-pointer ${!activeSchool?._id ? 'bg-blue-50/70 text-blue-950 font-bold' : 'text-slate-700'}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${!activeSchool?._id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">All Schools (Global Network)</p>
                        <p className="text-[10px] text-slate-400 truncate">Consolidated institutional view</p>
                      </div>
                    </div>
                    {!activeSchool?._id && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {/* Command Center Pill - Desktop */}
            <div className="hidden lg:block relative shrink-0">
              <button 
                onClick={() => setIsDesignsModalOpen(true)}
                className="flex items-center gap-1.5 bg-white border border-gray-200/90 hover:border-gray-300 hover:bg-gray-50 px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-2xs transition-colors cursor-pointer"
                title="Command Center"
              >
                <span className="w-2 h-2 rounded-full bg-[#ff5c0a] animate-pulse"></span>
                <span>{getTranslation('commandCenter', currentLang)}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              
              <CommandCenterModal 
                isOpen={isDesignsModalOpen} 
                onClose={() => setIsDesignsModalOpen(false)} 
              />
            </div>
          </div>
        </div>

        {/* Right side - Matching Screenshot */}
        <div ref={menuRef} className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto">
          {/* Academic Session & Language */}
          <div className="flex items-center gap-1 sm:gap-1.5 text-xs font-semibold text-gray-700 shrink-0">
            <AcademicYearDropdown />
            <LanguageDropdown />
          </div>

          {/* Search Bar Trigger - Large desktop only */}
          <button 
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-500 rounded-xl text-xs font-medium border border-slate-200/80 transition-all cursor-pointer w-48 shadow-2xs group shrink-0"
            title="Search screens, students, parents, fees... (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
            <span className="flex-1 text-left truncate text-slate-400 group-hover:text-slate-600">Search screens, fees...</span>
            <kbd className="hidden md:inline-flex text-[9px] font-bold text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5 shadow-2xs">Ctrl+K</kbd>
          </button>

          {/* Search Icon Trigger for Laptop, Tablet & Mobile */}
          <button 
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className="2xl:hidden w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer shrink-0"
            title="Search (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Quick Add Menu - Large screens */}
          <div className="hidden xl:block relative shrink-0">
            <button 
              onClick={() => setActiveMenu(activeMenu === 'add' ? null : 'add')}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                activeMenu === 'add' ? 'bg-orange-50 text-[#ff5c0a]' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title="Quick Add"
            >
              <Plus className="w-4 h-4" />
            </button>
            
            {activeMenu === 'add' && (
              <div className="absolute top-[calc(100%+8px)] right-0 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl ring-1 ring-slate-900/5 z-50 py-2 animate-in fade-in slide-in-from-top-2">
                <div className="px-3.5 py-1.5 border-b border-slate-100 mb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Actions</p>
                </div>
                <button 
                  onClick={() => handleNavigate('/messages')} 
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600"/> Messages, Calls & Dialer
                </button>
                <button 
                  onClick={() => handleNavigate('/students/admission')} 
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-orange-50 hover:text-[#ff5c0a] transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#ff5c0a]"/> New Student Admission
                </button>
                <button 
                  onClick={() => handleNavigate('/finance/collect')} 
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-emerald-600"/> Collect Fees
                </button>
                <button 
                  onClick={() => handleNavigate('/communicate/compose-broadcast')} 
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-amber-600"/> Send Broadcast / Notice
                </button>
                <button 
                  onClick={() => handleNavigate('/hr/staff/new')} 
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-purple-600"/> Add Staff Member
                </button>
                <button 
                  onClick={() => handleNavigate('/offline-exams/manage')} 
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-sky-600"/> Create Examination
                </button>
              </div>
            )}
          </div>
            
          {/* Direct Messages & Real Calls Quick Button - Desktop XL only */}
          <button
            onClick={() => handleNavigate('/messages')}
            className="hidden xl:flex w-8 h-8 rounded-full items-center justify-center text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer relative shrink-0"
            title="Messages, Voice & Video Calling"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          </button>

          {/* Notifications Menu */}
          <div className="relative shrink-0">
            <button 
              onClick={() => setActiveMenu(activeMenu === 'notif' ? null : 'notif')}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all relative shrink-0 cursor-pointer ${
                activeMenu === 'notif' ? 'bg-orange-50 text-[#ff5c0a] ring-2 ring-orange-500/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-amber-500 text-slate-950 rounded-full text-[10px] font-black flex items-center justify-center shadow-xs animate-in zoom-in-50">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            
            {activeMenu === 'notif' && (
              <div className="absolute top-[calc(100%+8px)] right-0 w-72 sm:w-80 max-w-[calc(100vw-20px)] bg-white border border-slate-100 rounded-2xl shadow-xl ring-1 ring-slate-900/5 z-50 py-2 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-800">
                    {getTranslation('notifications', currentLang)} ({notifications.length})
                  </p>
                  {unreadCount > 0 ? (
                    <button 
                      onClick={markAllRead} 
                      className="text-[11px] text-[#ff5c0a] font-semibold hover:underline cursor-pointer"
                    >
                      {getTranslation('markAllRead', currentLang)}
                    </button>
                  ) : (
                    <span className="text-[10px] font-semibold text-emerald-600">All read ✓</span>
                  )}
                </div>
                <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(item => (
                      <div 
                         key={item.id} 
                        onClick={() => handleNotificationClick(item)}
                        className={`p-3 flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${item.unread ? 'bg-orange-50/30' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          item.type === 'fee' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-[#ff5c0a]'
                        }`}>
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <p className={`text-xs font-semibold truncate ${item.unread ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>{item.title}</p>
                            {item.unread && (
                              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Unread" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2">{item.desc}</p>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{item.time}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400">
                      {getTranslation('noNotifications', currentLang)}
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-slate-100 text-center">
                  <Link to="/communicate/notice-board" onClick={() => setActiveMenu(null)} className="text-xs font-semibold text-[#ff5c0a] hover:underline">
                    {getTranslation('viewAll', currentLang)} →
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Settings Quick Menu - Desktop XL only */}
          <div className="hidden xl:block relative shrink-0">
            <button 
              onClick={() => setActiveMenu(activeMenu === 'settings' ? null : 'settings')}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                activeMenu === 'settings' ? 'bg-orange-50 text-[#ff5c0a] ring-2 ring-orange-500/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title="System Settings"
            >
              <Settings className={`w-4 h-4 transition-transform duration-300 ${activeMenu === 'settings' ? 'rotate-90' : ''}`} />
            </button>
            
            {activeMenu === 'settings' && (
              <div className="absolute top-[calc(100%+8px)] right-0 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl ring-1 ring-slate-900/5 z-50 p-2 animate-in fade-in slide-in-from-top-2">
                <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Administration</p>
                </div>
                <button 
                  onClick={() => handleNavigate('/settings/school-settings')} 
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#ff5c0a] rounded-xl transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-500"/> School Settings
                </button>
                <button 
                  onClick={() => handleNavigate('/settings/roles-permissions')} 
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#ff5c0a] rounded-xl transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-500"/> Roles & Permissions
                </button>
                <button 
                  onClick={() => handleNavigate('/settings/notification-settings')} 
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#ff5c0a] rounded-xl transition-colors cursor-pointer"
                >
                  <Bell className="w-4 h-4 text-slate-500"/> Notification Alerts
                </button>
              </div>
            )}
          </div>

          {/* User Profile - Always fully visible with right safe margin */}
          <div className="relative shrink-0 pr-1 sm:pr-2">
            <button 
              onClick={() => setActiveMenu(activeMenu === 'profile' ? null : 'profile')}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#ea580c] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:ring-2 hover:ring-orange-400 transition-all cursor-pointer overflow-hidden shrink-0 border border-white"
              title={displayName}
            >
              {userAvatar ? (
                <img src={userAvatar} alt={displayName} className="w-full h-full object-cover shrink-0" />
              ) : (
                initials
              )}
            </button>
            
            {activeMenu === 'profile' && (
              <div className="absolute top-[calc(100%+8px)] right-0 w-60 sm:w-64 max-w-[calc(100vw-20px)] bg-white border border-slate-100 rounded-2xl shadow-2xl ring-1 ring-slate-900/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                {/* Dark Blue Header Card */}
                <div className="bg-[#1e293b] p-4 sm:p-5 text-center text-white">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#ea580c] text-white rounded-full flex items-center justify-center font-bold text-base mx-auto mb-2.5 shadow-md overflow-hidden border-2 border-white/20">
                    {userAvatar ? (
                      <img src={userAvatar} alt={displayName} className="w-full h-full object-cover shrink-0" />
                    ) : (
                      initials
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white leading-tight truncate px-2">{displayName}</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">{activeUser?.role || 'Administrator'}</p>
                </div>
                
                <div className="py-1">
                  <button 
                    onClick={() => handleNavigate('/profile')}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-cyan-600"/> My Profile
                  </button>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      localStorage.removeItem('schoolId');
                      window.location.href = '/login';
                    }} 
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-600"/> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Spotlight Command Modal */}
      {isSearchModalOpen && (
        <div 
          onClick={() => setIsSearchModalOpen(false)}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div 
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
              <Search className="w-5 h-5 text-indigo-600 shrink-0" />
              <input 
                ref={searchInputRef}
                type="text" 
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (filteredLinks.length > 0) {
                      handleNavigate(filteredLinks[0].path);
                    } else if (matchedStudents.length > 0) {
                      handleNavigate('/students/list');
                    } else if (matchedParents.length > 0) {
                      handleNavigate('/students/parents');
                    }
                  }
                }}
                placeholder="Type to search screens, student, parent, fees, reports..." 
                className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={() => setIsSearchModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Suggestions List */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-50">
              {/* Live Student Matches (if any) */}
              {matchedStudents.length > 0 && (
                <div className="p-1.5 mb-1 bg-indigo-50/40 rounded-xl">
                  <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">Matching Students</p>
                  {matchedStudents.map((st) => (
                    <button
                      key={st._id}
                      onClick={() => handleNavigate('/students/list')}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left hover:bg-indigo-100/60 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                          {st.firstName ? st.firstName.charAt(0) : 'S'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{st.firstName} {st.lastName || ''}</p>
                          <p className="text-[10px] text-slate-500">APAR: {st.aparId || st.admissionNo || 'N/A'} • {st.classId?.className || 'Student'}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-indigo-600 font-semibold bg-white px-2 py-0.5 rounded border border-indigo-200">View Roster</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Live Parent Matches (if any) */}
              {matchedParents.length > 0 && (
                <div className="p-1.5 mb-1 bg-amber-50/40 rounded-xl">
                  <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">Matching Parents & Guardians</p>
                  {matchedParents.map((pr) => (
                    <button
                      key={pr._id}
                      onClick={() => handleNavigate('/students/parents')}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left hover:bg-amber-100/60 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
                          {pr.name ? pr.name.charAt(0) : 'P'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{pr.name} ({pr.relation || 'Parent'})</p>
                          <p className="text-[10px] text-slate-500">Phone: {pr.phone || 'N/A'} • Login: {pr.loginId || 'N/A'}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-amber-700 font-semibold bg-white px-2 py-0.5 rounded border border-amber-200">View Directory</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Modules and Screens Matches */}
              {filteredLinks.length > 0 ? (
                filteredLinks.map((link, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleNavigate(link.path)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left hover:bg-indigo-50/70 hover:text-indigo-700 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                        <link.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-900">{link.name}</p>
                        <p className="text-[10px] text-slate-400">{link.category}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))
              ) : (
                matchedStudents.length === 0 && matchedParents.length === 0 && (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No matching module found for "{searchFilter}". Try "parent", "fees", "student", or "exam".
                  </div>
                )
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Press <kbd className="font-semibold text-slate-600 bg-white px-1.5 py-0.5 border border-slate-200 rounded">ESC</kbd> to close</span>
              <Link to="/erp-navigator" onClick={() => setIsSearchModalOpen(false)} className="text-indigo-600 font-semibold hover:underline">
                Open full 237-screen navigator →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

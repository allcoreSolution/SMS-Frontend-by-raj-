import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { parentService } from '../api/parentService';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES, TRANSLATIONS, getT, triggerGoogleTranslate } from '../utils/translations';
import {
  LayoutDashboard, Users, UserCog, Calendar, LayoutGrid, ClipboardCheck,
  GraduationCap, Handshake, Monitor, PenLine, BookMarked,
  Wallet, RefreshCcw, Megaphone, MessageCircle, Phone, Mail,
  Bus, BookOpen, Building2, HeartPulse, FolderOpen, Image,
  CalendarCheck, Bot, LogOut, Search, Globe, Grid3X3, ChevronDown,
  ChevronLeft, ChevronRight, Menu, Target, FileWarning, Check, X, ArrowRight,
  Home, Bell, User, FileQuestion
} from 'lucide-react';
const getMediaUrl = (photoPath) => {
  if (!photoPath) return null;
  if (photoPath.startsWith('http') || photoPath.startsWith('data:')) return photoPath;
  const baseUrl = (typeof window !== 'undefined' && window.__API_BASE_URL__) 
    || (typeof window !== 'undefined' && localStorage.getItem('api_base_url'))
    || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5050' : 'http://192.168.1.20:5050');
  const serverOrigin = String(baseUrl).replace(/\/api\/?$/, '');
  return `${serverOrigin}${photoPath.startsWith('/') ? '' : '/'}${photoPath}`;
};

const defaultChildren = [
  {
    id: 'YIS-2024-101',
    _id: 'YIS-2024-101',
    name: 'Student',
    class: 'Class I',
    admn: 'YIS-2024-101',
    roll: '1',
    avatar: 'S'
  }
];

// All screens & modules index for fast spotlight search
const parentPortalScreens = [
  { name: 'Dashboard', path: '/dashboard', category: 'Portal Navigation', icon: LayoutDashboard, keywords: 'home stats overview calendar' },
  { name: 'My Profile', path: '/my-profile', category: 'Portal Navigation', icon: UserCog, keywords: 'account password settings guardian father mother' },
  { name: 'School Calendar', path: '/calendar', category: 'Academics', icon: Calendar, keywords: 'events holidays schedule academic terms' },
  { name: 'Class Timetable', path: '/timetable', category: 'Academics', icon: LayoutGrid, keywords: 'schedule periods routine bells subjects' },
  { name: 'Student Attendance', path: '/attendance', category: 'Academics', icon: ClipboardCheck, keywords: 'present absent leaves attendance percentage log' },
  { name: 'Exams & Reports', path: '/exams', category: 'Academics', icon: GraduationCap, keywords: 'marks grades report card results tests marksheet' },
  { name: 'Meetings', path: '/meetings', category: 'Academics', icon: Handshake, keywords: 'parent teacher conference slots appointments' },
  { name: 'Evaluated Papers', path: '/exams', category: 'Academics', icon: PenLine, keywords: 'papers test sheets answers marks' },
  { name: 'Online CBT Exams', path: '/online-exams', category: 'Academics', icon: Monitor, keywords: 'quizzes tests questions computer assessment' },
  { name: 'Daily Homework', path: '/homework', category: 'Academics', icon: PenLine, keywords: 'assignments tasks submissions daily work' },
  { name: 'Study Center', path: '/study-center', category: 'Academics', icon: BookMarked, keywords: 'study center books pdfs downloads notes' },
];

// Each item: key, label, icon, iconBg (colored box), route, subItems
// Role-Tailored Navigation Config: Student vs Parent
const getNavSectionsConfig = (isStudent = false) => {
  if (isStudent) {
    // ── STUDENT NAVIGATION (Academics, Homework, Tests & Learning) ──
    return [
      { 
        titleKey: 'portalNav',
        defaultTitle: 'STUDENT WORKSPACE',
        items: [
          { key: 'dashboard',  label: 'Dashboard',     icon: LayoutDashboard, iconBg: 'bg-yellow-500', route: '/dashboard'  },
          { key: 'myProfile',  label: 'My Profile',    icon: UserCog,         iconBg: 'bg-purple-500', route: '/my-profile' },
        ]
      },
      { 
        titleKey: 'academics',
        defaultTitle: 'ACADEMICS & LEARNING',
        items: [
          { key: 'calendar',         label: 'Calendar',         icon: Calendar,       iconBg: 'bg-orange-500', route: '/calendar'       },
          { key: 'timetable',        label: 'Timetable',        icon: LayoutGrid,     iconBg: 'bg-pink-500',   route: '/timetable'      },
          { key: 'attendance',       label: 'My Attendance',    icon: ClipboardCheck, iconBg: 'bg-green-500',  route: '/attendance'     },
          { key: 'homework',         label: 'Homework Submit',  icon: PenLine,        iconBg: 'bg-yellow-500', route: '/homework'       },
          { key: 'onlineExams',      label: 'Online CBT Exams', icon: Monitor,        iconBg: 'bg-teal-500',   route: '/online-exams'   },
          { key: 'studyCenter',      label: 'Study Center',     icon: BookMarked,     iconBg: 'bg-red-500',    subItems: [
             { key: 'classwork',   label: 'Classwork & Logbook', route: '/classwork' },
             { key: 'syllabus',    label: 'Syllabus & Materials', route: '/study-center' },
             { key: 'liveClasses', label: 'Live Classes', route: '/live-classes' }
          ]},
          { key: 'exams',            label: 'Exams & Results',  icon: GraduationCap,  iconBg: 'bg-purple-500', route: '/exams'          },
          { key: 'evaluatedPapers',  label: 'Evaluated Papers', icon: PenLine,        iconBg: 'bg-indigo-500', route: '/exams'          },
        ]
      },
      { 
        titleKey: 'services',
        defaultTitle: 'STUDENT SERVICES',
        items: [
          { key: 'library',       label: 'Library Books',   icon: BookOpen,     iconBg: 'bg-purple-600', route: '/library'        },
          { key: 'transport',     label: 'School Bus',      icon: Bus,          iconBg: 'bg-red-500',    route: '/transport'      },
          { key: 'hostel',        label: 'Hostel',          icon: Building2,    iconBg: 'bg-teal-500',   route: '/hostel'         },
          { key: 'healthRecords', label: 'Health Records',  icon: HeartPulse,   iconBg: 'bg-orange-500', route: '/health-records' },
          { key: 'documents',     label: 'My Documents',    icon: FolderOpen,   iconBg: 'bg-pink-500',   route: '/documents'      },
          { key: 'gallery',       label: 'School Gallery',  icon: Image,        iconBg: 'bg-green-500',  route: '/gallery'        },
          { key: 'leaveApply',    label: 'Leave Apply',     icon: FileWarning,  iconBg: 'bg-yellow-500', route: '/leave-management' },
        ]
      },
      { 
        titleKey: 'communications',
        defaultTitle: 'COMMUNICATIONS',
        items: [
          { key: 'noticeBoard', label: 'Notice Board', icon: Megaphone,      iconBg: 'bg-green-500',  route: '/notice-board' },
        ]
      },
      { 
        titleKey: 'helpSupport',
        defaultTitle: 'HELP & SUPPORT',
        items: [
          { key: 'aiAssistant', label: 'AI Study Assistant', icon: Bot, iconBg: 'bg-green-500', route: '/ai-assistant' },
        ]
      },
    ];
  }

  // ── PARENT NAVIGATION (Monitoring, Fees, Safety & PTM - Strictly Parent Level) ──
  return [
    { 
      titleKey: 'portalNav',
      defaultTitle: 'PARENT PORTAL',
      items: [
        { key: 'dashboard',  label: 'Dashboard',     icon: LayoutDashboard, iconBg: 'bg-yellow-500', route: '/dashboard'  },
        { key: 'myProfile',  label: 'My Profile',    icon: UserCog,         iconBg: 'bg-purple-500', route: '/my-profile' },
      ]
    },
    { 
      titleKey: 'academics',
      defaultTitle: 'ACADEMIC MONITORING',
      items: [
        { key: 'calendar',         label: 'Calendar',         icon: Calendar,       iconBg: 'bg-orange-500', route: '/calendar'       },
        { key: 'timetable',        label: 'Timetable',        icon: LayoutGrid,     iconBg: 'bg-pink-500',   route: '/timetable'      },
        { key: 'attendance',       label: 'Attendance Monitor', icon: ClipboardCheck, iconBg: 'bg-green-500', route: '/attendance'     },
        { key: 'exams',            label: 'Exams & Reports',  icon: GraduationCap,  iconBg: 'bg-purple-500', route: '/exams'          },
        { key: 'meetings',         label: 'PTM Meetings',     icon: Handshake,      iconBg: 'bg-blue-400',   route: '/meetings'       },
        { key: 'homework',         label: 'Homework Status',  icon: PenLine,        iconBg: 'bg-yellow-500', route: '/homework'       },
        { key: 'studyCenter',      label: 'Syllabus & Logbook', icon: BookMarked,   iconBg: 'bg-red-500',    subItems: [
           { key: 'classwork',   label: 'Classwork & Logbook', route: '/classwork' },
           { key: 'syllabus',    label: 'Syllabus & Materials', route: '/study-center' },
        ]},
      ]
    },
    { 
      titleKey: 'financials',
      defaultTitle: 'FINANCIALS & DUES',
      items: [
        { key: 'feePayments',  label: 'Fee Payments', icon: Wallet,      iconBg: 'bg-cyan-500',   route: '/fee-payments' },
        { key: 'transactions', label: 'Transactions & Receipts', icon: RefreshCcw, iconBg: 'bg-orange-400', route: '/transactions' },
      ]
    },
    { 
      titleKey: 'services',
      defaultTitle: 'SERVICES & SAFETY',
      items: [
        { key: 'schoolVisit',   label: 'School Visit Pass', icon: CalendarCheck,iconBg: 'bg-purple-400', route: '/school-visit'   },
        { key: 'transport',     label: 'Bus Tracking',    icon: Bus,          iconBg: 'bg-red-500',    route: '/transport'      },
        { key: 'leaveApply',    label: 'Leave Apply',     icon: FileWarning,  iconBg: 'bg-yellow-500', route: '/leave-management' },
        { key: 'healthRecords', label: 'Health Records',  icon: HeartPulse,   iconBg: 'bg-orange-500', route: '/health-records' },
        { key: 'documents',     label: 'Documents & TC',  icon: FolderOpen,   iconBg: 'bg-pink-500',   route: '/documents'      },
        { key: 'library',       label: 'Library Status',  icon: BookOpen,     iconBg: 'bg-purple-600', route: '/library'        },
        { key: 'hostel',        label: 'Hostel Info',     icon: Building2,    iconBg: 'bg-teal-500',   route: '/hostel'         },
        { key: 'gallery',       label: 'Gallery',         icon: Image,        iconBg: 'bg-green-500',  route: '/gallery'        },
      ]
    },
    { 
      titleKey: 'communications',
      defaultTitle: 'COMMUNICATIONS',
      items: [
        { key: 'noticeBoard', label: 'Notice Board', icon: Megaphone,      iconBg: 'bg-green-500',  route: '/notice-board' },
        { key: 'whatsapp',    label: 'WhatsApp Desk', icon: Phone,         iconBg: 'bg-blue-500',   route: '/whatsapp'     },
        { key: 'email',       label: 'School Email',  icon: Mail,          iconBg: 'bg-green-600',  route: '/email'        },
        { key: 'sms',         label: 'SMS Alerts',    icon: MessageCircle,  iconBg: 'bg-purple-500', route: '/sms'          },
      ]
    },
    { 
      titleKey: 'helpSupport',
      defaultTitle: 'HELP & SUPPORT',
      items: [
        { key: 'aiAssistant', label: 'AI Parent Desk', icon: Bot, iconBg: 'bg-green-500', route: '/ai-assistant' },
      ]
    },
  ];
};

function NavItem({ item, active, navigate, location, lang, onSelect }) {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;
  const itemLabel = getT(item.key, lang) || item.label;

  if (item.subItems) {
    const isChildActive = item.subItems.some(sub => location.pathname === sub.route);
    const isOpen = open || isChildActive || item.forceOpen;
    return (
      <div className="flex flex-col w-full">
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2 transition-all text-left group
            ${(active || isChildActive)
              ? 'bg-[#1e232d] border-l-[3px] border-orange-500 text-white'
              : 'hover:bg-white/5 border-l-[3px] border-transparent text-gray-300 hover:text-white'}`}
        >
          <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${(active || isChildActive) ? 'text-orange-400' : 'text-gray-400 group-hover:text-white'}`} strokeWidth={1.8} />
          <span className="flex-1 text-[12.5px] font-medium truncate">
            {itemLabel}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="flex flex-col ml-8 mt-0.5 space-y-0.5 relative mb-1.5">
            <div className="absolute left-[-12px] top-0 bottom-3 w-[1px] bg-white/10" />
            
            {item.subItems.map(subItem => (
              <div key={subItem.route} className="relative flex items-center">
                <div className="w-2.5 h-[1px] bg-white/10 absolute left-[-12px]" />
                <button
                  onClick={() => {
                    navigate(subItem.route);
                    if (onSelect) onSelect();
                  }}
                  className={`w-full text-left flex items-center gap-2 pl-2 pr-2 py-1.5 transition-all text-[11px]
                    ${location.pathname === subItem.route ? 'text-orange-400 font-semibold' : 'text-gray-400 hover:text-white'}`}
                >
                  <span className="text-[10px] opacity-70">»</span>
                  {getT(subItem.key, lang) || subItem.label}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        navigate(item.route);
        if (onSelect) onSelect();
      }}
      className={`w-full flex items-center gap-2.5 px-3.5 py-2 transition-all text-left group
        ${active
          ? 'bg-[#1e232d] border-l-[3px] border-orange-500 text-white font-medium'
          : 'hover:bg-white/5 border-l-[3px] border-transparent text-gray-300 hover:text-white'}`}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${active ? 'text-orange-400' : 'text-gray-400 group-hover:text-white'}`} strokeWidth={1.8} />
      <span className="flex-1 text-[12.5px] font-medium truncate">
        {itemLabel}
      </span>
    </button>
  );
}

export default function Layout({ children: pageContent, activeChild, setActiveChild }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [sideOpen, setSideOpen] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : false;
  });
  const [childOpen, setChildOpen] = useState(true);
  const [topChildOpen, setTopChildOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const [avatarOpen, setAvatarOpen] = useState(false);

  // Auto-close drawer on mobile on navigation
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSideOpen(false);
    }
  }, [location.pathname]);

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSideOpen(false);
      } else {
        setSideOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Search States
  const [menuSearch, setMenuSearch] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const spotlightInputRef = useRef(null);

  // Keyboard shortcut Ctrl+K / Cmd+K for Spotlight search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => spotlightInputRef.current?.focus(), 50);
    } else {
      setSpotlightQuery('');
    }
  }, [isSearchModalOpen]);

  // Language State from Central Provider (English and Hindi only)
  const { currentLang, setLanguage, t, currentLanguageObj, languages } = useLanguage();

  const [childrenList, setChildrenList] = useState(defaultChildren);
  const [currentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('parent_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [guardianProfile, setGuardianProfile] = useState(null);

  const isStudent = useMemo(() => {
    if (!currentUser) return false;
    const role = String(currentUser.role || '').toLowerCase();
    const uname = String(currentUser.username || currentUser.userId || '').toUpperCase();
    return role === 'student' || uname.startsWith('STU') || uname.startsWith('YIS') || uname === '101';
  }, [currentUser]);

  const parentName = isStudent 
    ? (currentUser?.name || 'Student')
    : (currentUser?.name || guardianProfile?.name || 'Parent Account');
  const parentInitials = parentName
    ? parentName
        .split(' ')
        .filter(Boolean)
        .map(w => w[0].toUpperCase())
        .slice(0, 2)
        .join('')
    : (isStudent ? 'ST' : 'PA');

  const navSectionsConfig = useMemo(() => getNavSectionsConfig(isStudent), [isStudent]);

  const langDropdownRef = useRef(null);
  const avatarDropdownRef = useRef(null);
  const topChildDropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangOpen(false);
      }
      if (avatarDropdownRef.current && !avatarDropdownRef.current.contains(e.target)) {
        setAvatarOpen(false);
      }
      if (topChildDropdownRef.current && !topChildDropdownRef.current.contains(e.target)) {
        setTopChildOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Global Dark Theme Sync
  useEffect(() => {
    const syncTheme = () => {
      const isDark = localStorage.getItem('portal_theme') === 'dark';
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    syncTheme();
    window.addEventListener('theme_changed', syncTheme);
    window.addEventListener('storage', syncTheme);
    return () => {
      window.removeEventListener('theme_changed', syncTheme);
      window.removeEventListener('storage', syncTheme);
    };
  }, []);

  // Load children from real backend API
  useEffect(() => {
    async function loadPortalChildren() {
      try {
        const parentUser = localStorage.getItem('parent_user');
        let parentId = null;
        let studentId = null;
        if (parentUser) {
          try {
            const parsed = JSON.parse(parentUser);
            if (parsed.role === 'Student') {
              studentId = parsed.studentId || parsed._id;
            } else {
              parentId = parsed.parentId || parsed._id;
            }
          } catch (e) {}
        }
        const res = await parentService.getDashboard({
          parentId: parentId || undefined,
          studentId: activeChild || studentId || undefined
        });
        if (res && res.success && res.data) {
          if (res.data.children && res.data.children.length > 0) {
            setChildrenList(res.data.children);
            if (!isStudent) {
              const hasValidChild = res.data.children.some(c => (c.id === activeChild || c._id === activeChild));
              if (!hasValidChild) {
                const firstChildId = res.data.children[0].id || res.data.children[0]._id;
                if (setActiveChild && firstChildId) {
                  setActiveChild(firstChildId);
                }
              }
            }
          }
          if (res.data.parent) {
            setGuardianProfile(res.data.parent);
          }
        }
      } catch (err) {
        console.warn('Could not load dynamic portal children in Layout:', err);
      }
    }
    loadPortalChildren();

    const handleChildChanged = (e) => {
      if (e.detail && setActiveChild) {
        setActiveChild(e.detail);
      }
    };
    window.addEventListener('portal_child_changed', handleChildChanged);
    return () => window.removeEventListener('portal_child_changed', handleChildChanged);
  }, [activeChild, isStudent]);

  const studentSelfId = currentUser?.studentId || currentUser?._id;

  // Auto-sync student ID if student logged in
  useEffect(() => {
    if (isStudent && studentSelfId && activeChild !== studentSelfId && setActiveChild) {
      setActiveChild(studentSelfId);
    }
  }, [isStudent, studentSelfId, activeChild, setActiveChild]);

  const handleSelectLanguage = (langCode) => {
    setLanguage(langCode);
    setLangOpen(false);
  };

  const handleNavSelect = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSideOpen(false);
    }
  };

  const current = useMemo(() => {
    if (isStudent) {
      const found = childrenList.find(c => 
        (studentSelfId && (c.id === studentSelfId || c._id === studentSelfId)) || 
        (c.name && c.name.toLowerCase().includes('aarav')) ||
        (c.admissionNo && c.admissionNo.includes('101'))
      );
      if (found) return found;
      return {
        id: studentSelfId || '6acdc7d06660441df4764319',
        _id: studentSelfId || '6acdc7d06660441df4764319',
        name: currentUser?.name || 'Student',
        class: currentUser?.class || 'Class I (A)',
        admn: currentUser?.username || 'YIS-2024-101',
        roll: '9',
        avatar: 'A'
      };
    }
    return childrenList.find(c => (c.id === activeChild || c._id === activeChild)) || childrenList[0] || defaultChildren[0];
  }, [isStudent, childrenList, activeChild, studentSelfId, currentUser]);
  const activeLanguageObj = currentLanguageObj || LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">

      {/* ── MOBILE BACKDROP OVERLAY ── */}
      {sideOpen && (
        <div 
          onClick={() => setSideOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200"
        />
      )}

      {/* ── SIDEBAR (Fixed Drawer on Mobile, In-flow on Desktop) ──────────────── */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 lg:static lg:z-auto
          ${sideOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-0'}
          transition-all duration-300 ease-in-out
          overflow-hidden flex-shrink-0 flex flex-col bg-[#272b35] border-r border-[#1e222b] shadow-2xl lg:shadow-none
        `}
      >

        {/* Logo: ACS-SCHOOL */}
        {/* Brand Header (Static Display Emblem & Name) */}
        <div className="flex items-center justify-between px-4 py-3.5 flex-shrink-0 border-b border-[#1e222b] select-none">
          <div className="flex items-center gap-2.5 pointer-events-none">
            {/* ACS Official School Logo Emblem */}
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-600/30 border border-blue-400/30 overflow-hidden">
              <GraduationCap className="w-5 h-5 text-white drop-shadow-sm" strokeWidth={2.4} />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-[#272b35]" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-white text-[15px] tracking-wider uppercase leading-tight font-serif">
                ACS-SCHOOL
              </span>
              <span className="text-[9px] font-bold text-blue-300 tracking-widest uppercase leading-none">
                Smart Campus
              </span>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSideOpen(false);
            }}
            className="lg:hidden p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-3.5 py-3 flex-shrink-0 border-b border-[#1e222b]">
          <div className="flex items-center bg-[#353b47] rounded overflow-hidden border border-white/5">
            <input
              type="text"
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              className="bg-transparent text-[11.5px] text-gray-200 outline-none flex-1 px-3 py-1.5 placeholder-gray-400"
              placeholder="Search Menu..."
            />
            <button
              type="button"
              className="bg-[#414856] hover:bg-[#4a5263] px-2.5 py-2 text-gray-300 transition-colors cursor-pointer flex items-center justify-center"
              title="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-0.5"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>

          {menuSearch.trim() ? (
            (() => {
              const filterSectionItems = (items) => {
                const q = menuSearch.toLowerCase().trim();
                return items.reduce((acc, item) => {
                  const label = (getT(item.key, currentLang) || item.label || '').toLowerCase();
                  const matchesMain = label.includes(q) || item.key.toLowerCase().includes(q);
                  if (matchesMain) {
                    acc.push(item);
                  } else if (item.subItems) {
                    const matchingSubs = item.subItems.filter(sub => {
                      const subLabel = (getT(sub.key, currentLang) || sub.label || '').toLowerCase();
                      return subLabel.includes(q) || sub.key.toLowerCase().includes(q);
                    });
                    if (matchingSubs.length > 0) {
                      acc.push({ ...item, subItems: matchingSubs, forceOpen: true });
                    }
                  }
                  return acc;
                }, []);
              };

              const matchedSections = navSectionsConfig.map(sec => ({
                ...sec,
                items: filterSectionItems(sec.items)
              })).filter(sec => sec.items.length > 0);

              if (matchedSections.length === 0) {
                return (
                  <div className="px-4 py-8 text-center">
                    <p className="text-xs text-gray-400 mb-2">No menu item found for "{menuSearch}"</p>
                    <button
                      onClick={() => setMenuSearch('')}
                      className="text-[11px] text-orange-400 hover:underline font-bold"
                    >
                      Clear Filter
                    </button>
                  </div>
                );
              }

              return matchedSections.map(sec => (
                <div key={sec.titleKey}>
                  <p className="px-4 pt-4 pb-1.5 text-[9.5px] font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.28)' }}>
                    {getT(sec.titleKey, currentLang) || sec.defaultTitle}
                  </p>
                  {sec.items.map(item => (
                    <NavItem
                      key={item.route || item.label}
                      item={item}
                      active={location.pathname === item.route}
                      navigate={navigate}
                      location={location}
                      lang={currentLang}
                      onSelect={() => setSideOpen(false)}
                    />
                  ))}
                </div>
              ));
            })()
          ) : (
            <>
              {/* PORTAL NAVIGATION */}
              <p className="px-4 pt-3 pb-1.5 text-[9.5px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.28)' }}>
                {getT('portalNav', currentLang)}
              </p>

              {/* Dashboard Item */}
              <NavItem
                item={{ key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, iconBg: 'bg-yellow-500', route: '/dashboard' }}
                active={location.pathname === '/dashboard'}
                navigate={navigate}
                location={location}
                lang={currentLang}
                onSelect={handleNavSelect}
              />

              {/* Viewing: child dropdown (Parent) OR Student Account chip (Student) */}
              {isStudent ? (
                <div 
                  className="flex items-center gap-3 pr-3 py-2 rounded-none mx-1 bg-white/5 border-l-[3px] border-blue-500 pl-2.5 mb-1" 
                  style={{ width: 'calc(100% - 8px)' }}
                >
                  <div className="w-7 h-7 bg-blue-600 rounded-none flex items-center justify-center flex-shrink-0 shadow-sm">
                    <GraduationCap className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[12px] font-semibold text-gray-200 block truncate">
                      {currentLang === 'hi' ? 'मेरा खाता' : 'My Account'}: {current?.name ? current.name.split(' ')[0] : 'Account'}
                    </span>
                    <span className="text-[9.5px] text-blue-300/80 block truncate">
                      {current?.class || ''} &bull; {currentLang === 'hi' ? 'विद्यार्थी' : 'Student'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col w-full">
                  <button
                    onClick={() => setChildOpen(!childOpen)}
                    className={`w-full flex items-center gap-3 pr-3 py-2 rounded-none mx-1 transition-all text-left group
                      ${childOpen ? 'bg-white/10 border-l-[3px] border-pink-500 pl-2.5' : 'hover:bg-white/5 border-l-[3px] border-transparent pl-2.5'}`}
                    style={{ width: 'calc(100% - 8px)' }}
                  >
                    <div className="w-7 h-7 bg-pink-500 rounded-none flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Users className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[12px] font-semibold text-gray-200 block truncate">
                        {getT('viewingChild', currentLang)}: {current?.name ? current.name.split(' ')[0] : 'Child'}
                      </span>
                      <span className="text-[9.5px] text-pink-300/80 block truncate">
                        {current?.class || ''}
                      </span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform ${childOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {childOpen && (
                    <div className="flex flex-col ml-[42px] mt-1 space-y-1 relative mb-2">
                      <div className="absolute left-[-16px] top-0 bottom-4 w-[1px] bg-white/10" />
                      {childrenList.map(child => {
                        const childId = child.id || child._id;
                        const isSelected = activeChild === childId || activeChild === child.id || activeChild === child._id;
                        return (
                          <button
                            key={childId}
                            onClick={() => {
                              if (setActiveChild) setActiveChild(childId);
                              handleNavSelect();
                            }}
                            className={`w-full text-left flex items-center justify-between pl-3 pr-2 py-1.5 rounded-none transition-all text-[11.5px]
                              ${isSelected ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                          >
                            <span className="truncate">{child.name}</span>
                            {isSelected && <span className="text-pink-400 text-xs font-bold">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* My Profile */}
              <NavItem
                item={{ key: 'myProfile', label: 'My Profile', icon: UserCog, iconBg: 'bg-purple-500', route: '/my-profile' }}
                active={location.pathname === '/my-profile'}
                navigate={navigate}
                location={location}
                lang={currentLang}
                onSelect={handleNavSelect}
              />

              {/* Other Sections */}
              {navSectionsConfig.slice(1).map(sec => (
                <div key={sec.titleKey}>
                  <p className="px-4 pt-4 pb-1.5 text-[9.5px] font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.28)' }}>
                    {getT(sec.titleKey, currentLang) || sec.defaultTitle}
                  </p>
                  {sec.items.map(item => (
                    <NavItem
                      key={item.route || item.label}
                      item={item}
                      active={location.pathname === item.route}
                      navigate={navigate}
                      location={location}
                      lang={currentLang}
                      onSelect={handleNavSelect}
                    />
                  ))}
                </div>
              ))}
            </>
          )}

          {/* ACCOUNT */}
          <p className="px-4 pt-4 pb-1.5 text-[9.5px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.28)' }}>
            {getT('account', currentLang)}
          </p>

          {/* Quick Language Switcher in Sidebar: Toggles between English & Hindi */}
          <button
            type="button"
            onClick={() => {
              handleSelectLanguage(currentLang === 'hi' ? 'en' : 'hi');
              handleNavSelect();
            }}
            className="w-full flex items-center gap-3 pr-3 py-2 rounded-none mx-1 hover:bg-white/5 transition-all text-left group border-l-[3px] border-transparent pl-2.5 cursor-pointer"
            style={{ width: 'calc(100% - 8px)' }}
            title="Switch Language / भाषा बदलें"
          >
            <div className="w-7 h-7 bg-indigo-600 rounded-none flex items-center justify-center flex-shrink-0 shadow-sm">
              <Globe className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[12.5px] font-medium text-gray-300 group-hover:text-white truncate">
                {currentLang === 'hi' ? 'अंग्रेज़ी में बदलें (English)' : 'हिन्दी में बदलें (Hindi)'}
              </span>
              <span className="text-[10px] text-indigo-300 font-bold truncate">
                {currentLang === 'hi' ? 'सक्रिय: हिन्दी 🇮🇳' : `${activeLanguageObj.flag} ${activeLanguageObj.native}`}
              </span>
            </div>
          </button>
          <button
            onClick={() => {
              navigate('/logout');
              handleNavSelect();
            }}
            className="w-full flex items-center gap-3 pr-3 py-2 rounded-none mx-1 hover:bg-white/5 transition-all text-left group border-l-[3px] border-transparent pl-2.5"
            style={{ width: 'calc(100% - 8px)' }}
          >
            <div className="w-7 h-7 bg-orange-500 rounded-none flex items-center justify-center flex-shrink-0 shadow-sm">
              <LogOut className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />
            </div>
            <span className="text-[12.5px] font-medium text-gray-300 group-hover:text-white">
              {getT('logout', currentLang)}
            </span>
          </button>
          
          {/* DEVELOPER BRANDING & ATTRIBUTION FOOTER */}
          <div className="mt-6 mb-3 pt-3 border-t border-white/10 px-2 text-center">
            <div className="bg-gradient-to-r from-slate-900/90 via-slate-800/60 to-slate-900/90 rounded-xl p-3 border border-white/10 shadow-xs hover:border-[#ff5c0a]/40 transition-colors text-center">
              <p className="text-[11px] font-bold text-slate-300 tracking-wide mb-1">
                &copy; 2026 {currentLang === 'hi' ? 'स्कूल ईआरपी' : 'School ERP'}
              </p>
              <p className="text-[10px] font-medium text-slate-400 leading-relaxed">
                {currentLang === 'hi' ? 'निर्माता' : 'Developed by'}{' '}
                <span className="text-white font-bold">RAJ YADAV</span>{' '}
                <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent font-bold">
                  @ALLCORE SOLUTION
                </span>
              </p>
            </div>
          </div>
          
        </nav>
      </aside>

      {/* ── MAIN ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-2 sm:px-4 py-1 sm:py-2 flex items-center justify-between flex-shrink-0 w-full max-w-full relative z-40 select-none overflow-visible" style={{ paddingRight: 'max(0.85rem, env(safe-area-inset-right))', paddingLeft: 'max(0.5rem, env(safe-area-inset-left))' }}>
          
          {/* Left Actions: Menu Toggle & Student Portal Logo */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 min-w-0">
            <button 
              onClick={() => setSideOpen(!sideOpen)} 
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors shrink-0 cursor-pointer"
              title="Toggle Sidebar Menu"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            </button>
            
            <div className="flex items-center gap-1 sm:gap-2 select-none min-w-0">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg ${isStudent ? 'bg-blue-600/10 text-[#2563EB]' : 'bg-emerald-600/10 text-emerald-600'} flex items-center justify-center shrink-0 shadow-2xs group-hover:opacity-90 transition-colors`}>
                {isStudent ? (
                  <GraduationCap className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 shrink-0" strokeWidth={2.4} />
                ) : (
                  <Users className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 shrink-0" strokeWidth={2.4} />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-base font-black text-slate-900 tracking-tight font-serif leading-tight truncate max-w-[65px] xs:max-w-[110px] sm:max-w-none">
                  {isStudent 
                    ? (currentLang === 'hi' ? 'विद्यार्थी पोर्टल' : 'Student Portal')
                    : (currentLang === 'hi' ? 'अभिभावक पोर्टल' : 'Parent Portal')}
                </span>
                <span className={`text-[8.5px] font-bold tracking-widest uppercase hidden sm:block ${isStudent ? 'text-blue-600' : 'text-emerald-600'}`}>
                  {isStudent ? (currentLang === 'hi' ? 'स्मार्ट कैम्पस' : 'Smart Campus') : (currentLang === 'hi' ? 'पैरेंट डेस्क' : 'Parent Desk')}
                </span>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1 min-w-[2px] sm:min-w-[4px]"></div>
          
          {/* Active Ward / Child Switcher (Dual Portal) */}
          <div className="relative shrink-0" ref={topChildDropdownRef}>
            {isStudent ? (
              /* Student Mode: Static Identity Chip (No multi-child dropdown) */
              <div 
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-blue-50/90 border border-blue-200/90 text-blue-950 text-xs font-bold shadow-2xs shrink-0 select-none"
                title={`Logged in as Student: ${current?.name || 'Student'}`}
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-600 text-white text-[9px] sm:text-[10px] font-black flex items-center justify-center shrink-0 shadow-2xs">
                  {current?.avatar || current?.name?.[0] || 'S'}
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-900 leading-tight truncate max-w-[55px] xs:max-w-[85px] sm:max-w-[150px]">
                    {current?.name || 'Aarav Sharma'}
                  </span>
                  <span className="text-[8px] sm:text-[8.5px] font-bold text-blue-600 truncate leading-tight hidden xs:block">
                    {current?.class || 'Class I (A)'} &bull; {currentLang === 'hi' ? 'विद्यार्थी' : 'Student'}
                  </span>
                </div>
              </div>
            ) : (
              /* Parent Mode: Multi-ward Switcher Button with Dropdown */
              <button
                type="button"
                id="student-switcher-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setTopChildOpen(!topChildOpen);
                  setLangOpen(false);
                  setAvatarOpen(false);
                }}
                className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-xl bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-200/90 text-emerald-950 transition-all text-xs font-bold cursor-pointer shadow-2xs shrink-0 active:scale-95"
                title="Switch Ward / विद्यार्थी चुनें"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-600 text-white text-[9px] sm:text-[10px] font-black flex items-center justify-center shrink-0 shadow-2xs pointer-events-none">
                  {current?.avatar || current?.name?.[0] || 'A'}
                </div>
                <div className="flex flex-col text-left min-w-0 pointer-events-none">
                  <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-900 leading-tight truncate max-w-[45px] xs:max-w-[70px] sm:max-w-[130px]">
                    {current?.name || 'Aarav Sharma'}
                  </span>
                  <span className="text-[8px] sm:text-[8.5px] font-bold text-emerald-700 truncate leading-tight hidden xs:block max-w-[45px] xs:max-w-[70px] sm:max-w-[130px]">
                    {current?.class || 'Class I (A)'}
                  </span>
                </div>
                <ChevronDown className={`w-3 h-3 text-emerald-700 transition-transform shrink-0 pointer-events-none ${topChildOpen ? 'rotate-180' : ''}`} />
              </button>
            )}

            {/* Mobile backdrop for student switcher */}
            {topChildOpen && (
              <div 
                className="fixed inset-0 z-[80] sm:hidden bg-black/30 backdrop-blur-2xs" 
                onClick={() => setTopChildOpen(false)} 
              />
            )}

            {topChildOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{ top: '56px' }}
                className="fixed sm:absolute sm:top-full mt-1.5 left-2 right-2 sm:left-0 sm:right-auto max-w-sm sm:w-72 bg-white border border-slate-200/90 shadow-2xl rounded-2xl z-[100] py-2 animate-in fade-in zoom-in-95 sm:zoom-in-100 duration-150 overflow-hidden"
              >
                <div className="px-3 py-1.5 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-blue-900 tracking-wider">
                    {currentLang === 'hi' ? 'विद्यार्थी चुनें' : 'Select Student / Ward'}
                  </span>
                  <span className="text-[9px] font-bold text-blue-600 bg-white border border-blue-200 px-1.5 py-0.5 rounded-full">
                    {childrenList.length} {currentLang === 'hi' ? 'छात्र' : 'Wards'}
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                  {childrenList.map((c) => {
                    const cId = c.id || c._id;
                    const isSelected = (current?.id === cId || current?._id === cId);
                    return (
                      <button
                        key={cId}
                        type="button"
                        onClick={() => {
                          if (setActiveChild) setActiveChild(cId);
                          try {
                            localStorage.setItem('active_child', cId);
                          } catch (e) {}
                          setTopChildOpen(false);
                          window.dispatchEvent(new CustomEvent('portal_child_changed', { detail: cId }));
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected ? 'bg-blue-50 text-blue-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pointer-events-none">
                          <div className={`w-7 h-7 rounded-full text-white text-xs font-black flex items-center justify-center shrink-0 shadow-2xs ${
                            isSelected ? 'bg-blue-600' : 'bg-slate-400'
                          }`}>
                            {c.avatar || c.name?.[0] || 'A'}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-extrabold text-slate-900 leading-tight truncate">{c.name}</span>
                            <span className="text-[10px] text-blue-600 font-medium">{c.class}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-blue-600 stroke-[3] flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons: Language, Apps, Avatar */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 min-w-0 ml-0.5 sm:ml-1 pr-1 sm:pr-0">
            
            {/* Dedicated 2-Language Selector (English & Hindi Only) */}
            <div className="relative shrink-0" ref={langDropdownRef}>
              <button 
                type="button"
                id="language-switch-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setLangOpen(!langOpen);
                  setTopChildOpen(false);
                  setAvatarOpen(false);
                }}
                className={`flex items-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-xl cursor-pointer transition-all shadow-2xs border shrink-0 active:scale-95 ${
                  langOpen 
                    ? 'bg-blue-50 border-blue-400 text-blue-900 ring-2 ring-blue-200' 
                    : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700'
                }`}
                title="Change Language / भाषा बदलें (English / हिन्दी)"
                aria-label="Change Language"
              >
                <span className="text-sm leading-none shrink-0 pointer-events-none">{currentLang === 'hi' ? '🇮🇳' : '🇬🇧'}</span>
                <span className="font-extrabold text-slate-900 text-xs tracking-tight hidden sm:inline-block pointer-events-none">
                  {currentLang === 'hi' ? 'हिन्दी' : 'English'}
                </span>
                <span className="text-[9px] sm:text-[9.5px] font-black uppercase text-blue-700 bg-blue-100/80 px-1 sm:px-1.5 py-0.2 rounded-md shrink-0 pointer-events-none">
                  {currentLang.toUpperCase()}
                </span>
                <ChevronDown className={`w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 transition-transform shrink-0 pointer-events-none ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mobile backdrop for language dropdown */}
              {langOpen && (
                <div 
                  className="fixed inset-0 z-[80] sm:hidden bg-black/30 backdrop-blur-2xs" 
                  onClick={() => setLangOpen(false)} 
                />
              )}

              {langOpen && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  style={{ top: '56px' }}
                  className="fixed sm:absolute sm:top-full mt-1.5 left-2 right-2 sm:left-auto sm:right-0 max-w-sm sm:w-80 bg-white border border-slate-200/90 shadow-2xl rounded-2xl sm:rounded-3xl z-[100] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 sm:zoom-in-100 duration-150"
                >
                   {/* Popover Header */}
                   <div className="p-3.5 bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white flex items-center justify-between">
                      <div className="flex items-center gap-2 pointer-events-none">
                        <Globe className="w-4 h-4 text-blue-200" />
                        <p className="text-xs font-black uppercase tracking-wider">
                          Select Language / भाषा चुनें
                        </p>
                      </div>
                      <span className="text-[10px] font-extrabold text-white bg-white/20 backdrop-blur-xs border border-white/30 px-2 py-0.5 rounded-full">
                        {currentLang === 'hi' ? 'HI Active' : 'EN Active'}
                      </span>
                   </div>

                   {/* 2 Exclusive Languages: English & Hindi */}
                   <div className="p-3 space-y-2">
                     {/* 1. English (Default) */}
                     <button
                       type="button"
                       onClick={(e) => {
                         e.stopPropagation();
                         handleSelectLanguage('en');
                       }}
                       className={`w-full p-3 rounded-2xl text-left text-xs flex items-center justify-between transition-all cursor-pointer border active:scale-98 ${
                         currentLang === 'en'
                           ? 'bg-blue-50/90 text-blue-900 font-black border-blue-500 shadow-xs ring-1 ring-blue-400'
                           : 'text-slate-700 hover:bg-slate-50 border-slate-200 font-medium'
                       }`}
                     >
                       <div className="flex items-center gap-3 min-w-0 pointer-events-none">
                         <span className="text-2xl leading-none shrink-0">🇬🇧</span>
                         <div className="flex flex-col min-w-0">
                           <div className="flex items-center gap-1.5">
                             <span className="font-extrabold text-slate-900 text-sm leading-tight">English</span>
                             <span className="text-[9px] font-bold text-blue-600 bg-blue-100/80 px-1.5 py-0.2 rounded">Default</span>
                           </div>
                           <span className="text-[11px] text-slate-400 font-semibold mt-0.5">Primary Portal Language</span>
                         </div>
                       </div>
                       {currentLang === 'en' && (
                         <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                           <Check className="w-3 h-3 stroke-[3]" />
                         </div>
                       )}
                     </button>

                     {/* 2. Hindi */}
                     <button
                       type="button"
                       onClick={(e) => {
                         e.stopPropagation();
                         handleSelectLanguage('hi');
                       }}
                       className={`w-full p-3 rounded-2xl text-left text-xs flex items-center justify-between transition-all cursor-pointer border active:scale-98 ${
                         currentLang === 'hi'
                           ? 'bg-blue-50/90 text-blue-900 font-black border-blue-500 shadow-xs ring-1 ring-blue-400'
                           : 'text-slate-700 hover:bg-slate-50 border-slate-200 font-medium'
                       }`}
                     >
                       <div className="flex items-center gap-3 min-w-0 pointer-events-none">
                         <span className="text-2xl leading-none shrink-0">🇮🇳</span>
                         <div className="flex flex-col min-w-0">
                           <div className="flex items-center gap-1.5">
                             <span className="font-extrabold text-slate-900 text-sm leading-tight">हिन्दी</span>
                             <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">Hindi</span>
                           </div>
                           <span className="text-[11px] text-slate-400 font-semibold mt-0.5">हिन्दी भाषा में अनुवाद</span>
                         </div>
                       </div>
                       {currentLang === 'hi' && (
                         <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                           <Check className="w-3 h-3 stroke-[3]" />
                         </div>
                       )}
                     </button>
                   </div>

                   {/* Footer Status */}
                   <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-[10.5px] font-medium text-slate-500 text-center flex items-center justify-center gap-1.5">
                     <span>🌐 Instant portal switch (English &bull; हिन्दी)</span>
                   </div>
                </div>
              )}
            </div>
            
            {/* Grid Apps Button -> Navigates to All Modules */}
            <button 
              onClick={() => navigate('/all-modules')}
              className="hidden sm:flex p-1.5 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group relative flex-shrink-0"
              title="All Modules"
            >
              <Grid3X3 className="w-4 h-4 text-gray-600" />
              <div className="absolute top-full right-0 mt-2 bg-gray-900 border border-black text-white text-[9px] font-black px-2.5 py-1.5 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md">
                Modules
              </div>
            </button>

            {/* Notification Bell with red badge */}
            <button
              type="button"
              onClick={() => navigate('/notice-board')}
              className="relative p-1 sm:p-1.5 rounded-full text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              title="Notice Board & Notifications"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700 shrink-0" />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            
            {/* Profile Avatar Button with Dropdown Menu */}
            <div className="relative shrink-0" ref={avatarDropdownRef}>
              <button
                type="button"
                id="profile-avatar-btn"
                onClick={(e) => { 
                  e.stopPropagation();
                  setAvatarOpen(!avatarOpen);
                  setLangOpen(false); 
                  setTopChildOpen(false); 
                }}
                className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 border-blue-500/90 bg-[#2563EB] text-white font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-xs transition-transform cursor-pointer hover:ring-2 hover:ring-blue-300 hover:scale-105 shrink-0 overflow-hidden active:scale-95"
                title={`My Profile - ${current?.name || 'Student'}`}
                aria-label="My Profile"
              >
                <img 
                  src={getMediaUrl(current?.photo) || '/kabir_singh.png'}
                  alt={current?.name || 'Student Profile'}
                  className="w-full h-full object-cover pointer-events-none"
                  onError={(e) => {
                    if (e.target.src !== window.location.origin + '/kabir_singh.png') {
                      e.target.src = '/kabir_singh.png';
                    }
                  }}
                />
              </button>

              {/* Mobile backdrop for avatar dropdown */}
              {avatarOpen && (
                <div 
                  className="fixed inset-0 z-[80] sm:hidden bg-black/30 backdrop-blur-2xs" 
                  onClick={() => setAvatarOpen(false)} 
                />
              )}

              {avatarOpen && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  style={{ top: '56px' }}
                  className="fixed sm:absolute sm:top-full mt-1.5 right-2 sm:right-0 max-w-sm w-64 sm:w-72 bg-white border border-slate-200/90 shadow-2xl rounded-2xl z-[100] p-3 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 sm:zoom-in-100 duration-150"
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className={`w-11 h-11 rounded-full border ${isStudent ? 'border-blue-200 bg-blue-50' : 'border-emerald-200 bg-emerald-50'} overflow-hidden flex items-center justify-center shrink-0`}>
                      <img 
                        src={getMediaUrl(isStudent ? current?.photo : null) || '/kabir_singh.png'}
                        alt={isStudent ? current?.name : parentName}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/kabir_singh.png'; }}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-extrabold text-slate-900 text-sm leading-tight truncate">
                        {isStudent ? (current?.name || currentUser?.name || 'Student') : parentName}
                      </span>
                      <span className={`text-[11px] font-bold mt-0.5 truncate ${isStudent ? 'text-blue-600' : 'text-emerald-700'}`}>
                        {isStudent 
                          ? `${current?.class || 'Class I (A)'} • ${currentLang === 'hi' ? 'विद्यार्थी' : 'Student'}` 
                          : (currentLang === 'hi' ? '👨‍👩‍👧 अभिभावक (Parent)' : '👨‍👩‍👧 Parent / Guardian')}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium truncate">
                        {isStudent 
                          ? `Admn: ${current?.admn || currentUser?.username || 'YIS-2024-101'}` 
                          : `${currentLang === 'hi' ? 'वार्ड' : 'Ward'}: ${current?.name || 'Student'}`}
                      </span>
                    </div>
                  </div>

                  <div className="py-2 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarOpen(false);
                        navigate('/my-profile');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-blue-50/80 rounded-xl transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      <span>{currentLang === 'hi' ? 'मेरी प्रोफाइल देखें' : 'View My Profile'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarOpen(false);
                        navigate('/dashboard');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-blue-50/80 rounded-xl transition-colors cursor-pointer"
                    >
                      {isStudent ? (
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Users className="w-4 h-4 text-emerald-600" />
                      )}
                      <span>
                        {isStudent
                          ? (currentLang === 'hi' ? 'विद्यार्थी डैशबोर्ड' : 'Student Dashboard')
                          : (currentLang === 'hi' ? 'अभिभावक डैशबोर्ड' : 'Parent Dashboard')}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarOpen(false);
                        navigate('/logout');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50/80 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>{currentLang === 'hi' ? 'लॉगआउट करें' : 'Logout / साइन आउट'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          {pageContent}
        </main>

        {/* Fixed Native Mobile Bottom Navigation Bar */}
        <nav 
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-1 py-1 flex items-center justify-around shadow-[0_-3px_12px_rgba(0,0,0,0.05)] lg:hidden select-none"
          style={{ paddingBottom: 'max(0.35rem, env(safe-area-inset-bottom))' }}
        >
          {[
            { label: currentLang === 'hi' ? 'होम' : 'Home', path: '/dashboard', icon: Home },
            { label: currentLang === 'hi' ? 'समय सारणी' : 'Timetable', path: '/timetable', icon: Calendar },
            { label: currentLang === 'hi' ? 'गृहकार्य' : 'Homework', path: '/homework', icon: ClipboardCheck },
            { label: currentLang === 'hi' ? 'परीक्षाएं' : 'Exams', path: '/exams', icon: FileQuestion },
            { label: currentLang === 'hi' ? 'प्रोफाइल' : 'Profile', path: '/my-profile', icon: User },
          ].map((tab) => {
            const isActive = location.pathname === tab.path || (tab.path === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard'));
            const Icon = tab.icon;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => navigate(tab.path)}
                className={`flex flex-col items-center justify-center py-0.5 px-1 min-w-[50px] transition-all cursor-pointer ${
                  isActive ? 'text-[#2563EB]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className={`p-0.5 rounded-lg transition-colors shrink-0 ${isActive ? 'bg-blue-50 text-blue-600' : 'bg-transparent'}`}>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                </div>
                <span className={`text-[8.5px] sm:text-[9px] mt-0.5 tracking-tight truncate max-w-full ${isActive ? 'font-black text-[#2563EB]' : 'font-semibold text-slate-500'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Spotlight Command Modal */}
      {isSearchModalOpen && (
        <div 
          onClick={() => setIsSearchModalOpen(false)}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-white border border-gray-200 shadow-2xl rounded-none overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-gray-200 gap-3 bg-gray-50/50">
              <Search className="w-5 h-5 text-indigo-600 shrink-0" />
              <input 
                ref={spotlightInputRef}
                type="text" 
                value={spotlightQuery}
                onChange={(e) => setSpotlightQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const firstMatch = parentPortalScreens.find(screen => {
                      if (!spotlightQuery.trim()) return true;
                      const q = spotlightQuery.toLowerCase().trim();
                      return (
                        screen.name.toLowerCase().includes(q) ||
                        screen.category.toLowerCase().includes(q) ||
                        screen.keywords.toLowerCase().includes(q)
                      );
                    });
                    if (firstMatch) {
                      navigate(firstMatch.path);
                      setIsSearchModalOpen(false);
                    }
                  }
                }}
                placeholder="Type to search portal modules (fees, homework, timetable, exams)..." 
                className="w-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none font-medium bg-transparent"
              />
              {spotlightQuery && (
                <button
                  type="button"
                  onClick={() => setSpotlightQuery('')}
                  className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={() => setIsSearchModalOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Suggestions List */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-gray-100">
              {(() => {
                const results = parentPortalScreens.filter(screen => {
                  if (!spotlightQuery.trim()) return true;
                  const q = spotlightQuery.toLowerCase().trim();
                  return (
                    screen.name.toLowerCase().includes(q) ||
                    screen.category.toLowerCase().includes(q) ||
                    screen.keywords.toLowerCase().includes(q)
                  );
                });

                if (results.length === 0) {
                  return (
                    <div className="py-8 text-center text-gray-400 text-xs">
                      No matching screen found for "{spotlightQuery}". Try "fees", "homework", or "attendance".
                    </div>
                  );
                }

                return results.map((screen, idx) => {
                  const ScreenIcon = screen.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        navigate(screen.path);
                        setIsSearchModalOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 text-left hover:bg-indigo-50/70 hover:text-indigo-700 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 group-hover:bg-indigo-100 text-gray-600 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                          <ScreenIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800 group-hover:text-indigo-900">{screen.name}</p>
                          <p className="text-[10px] text-gray-400">{screen.category}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  );
                });
              })()}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-400">
              <span>Press <kbd className="font-semibold text-gray-600 bg-white px-1.5 py-0.5 border border-gray-200 rounded">ESC</kbd> to close</span>
              <button 
                onClick={() => {
                  navigate('/ai-assistant');
                  setIsSearchModalOpen(false);
                }} 
                className="text-indigo-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" /> Ask AI Assistant →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

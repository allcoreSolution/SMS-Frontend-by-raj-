import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { parentService } from '../api/parentService';
import { LANGUAGES, TRANSLATIONS, getT } from '../utils/translations';
import {
  LayoutDashboard, Users, UserCog, Calendar, LayoutGrid, ClipboardCheck,
  GraduationCap, Handshake, Monitor, PenLine, BookMarked,
  Wallet, RefreshCcw, Megaphone, MessageCircle, Phone, Mail,
  Bus, BookOpen, Building2, HeartPulse, FolderOpen, Image,
  CalendarCheck, Bot, LogOut, Search, Globe, Grid3X3, ChevronDown,
  ChevronLeft, ChevronRight, Menu, Target, FileWarning, Check, X, ArrowRight
} from 'lucide-react';

const defaultChildren = [
  { id: '1', name: 'Kabir Singh',   class: 'Class V (A)',   avatar: 'K' },
  { id: '2', name: 'Shlok Verma',  class: 'Class III (B)', avatar: 'S' },
  { id: '3', name: 'Rajesh Singh', class: 'Class II (A)',  avatar: 'R' },
];

// All screens & modules index for fast spotlight search
const parentPortalScreens = [
  { name: 'Dashboard', path: '/dashboard', category: 'Portal Navigation', icon: LayoutDashboard, keywords: 'home stats overview calendar' },
  { name: 'My Profile', path: '/my-profile', category: 'Portal Navigation', icon: UserCog, keywords: 'account password settings guardian father mother' },
  { name: 'School Calendar', path: '/calendar', category: 'Academics', icon: Calendar, keywords: 'events holidays schedule academic terms' },
  { name: 'Class Timetable', path: '/timetable', category: 'Academics', icon: LayoutGrid, keywords: 'schedule periods routine bells subjects' },
  { name: 'Student Attendance', path: '/attendance', category: 'Academics', icon: ClipboardCheck, keywords: 'present absent leaves attendance percentage log' },
  { name: 'Exams & Reports', path: '/exams', category: 'Academics', icon: GraduationCap, keywords: 'marks grades report card results tests marksheet' },
  { name: 'Coaching & Mentorship', path: '/coaching', category: 'Academics', icon: Target, keywords: 'remedial tuition extra classes batches' },
  { name: 'PTM & Teacher Meetings', path: '/meetings', category: 'Academics', icon: Handshake, keywords: 'parent teacher conference slots appointments' },
  { name: 'Online CBT Exams', path: '/online-exams', category: 'Academics', icon: Monitor, keywords: 'quizzes tests questions computer assessment' },
  { name: 'Daily Homework', path: '/homework', category: 'Academics', icon: PenLine, keywords: 'assignments tasks submissions daily work' },
  { name: 'Classwork & Logbook', path: '/classwork', category: 'Academics', icon: BookMarked, keywords: 'topics taught diary daily log lesson notes' },
  { name: 'Syllabus & Materials', path: '/study-center', category: 'Academics', icon: BookMarked, keywords: 'study center books pdfs downloads notes' },
  { name: 'Live Online Classes', path: '/live-classes', category: 'Academics', icon: Monitor, keywords: 'zoom video stream lectures online tuition' },
  { name: 'Fee Payments (Pay Online)', path: '/fee-payments', category: 'Financials', icon: Wallet, keywords: 'pay fees upi challan credit card netbanking dues' },
  { name: 'Fee Receipts & Transactions', path: '/transactions', category: 'Financials', icon: RefreshCcw, keywords: 'receipts invoices history payment records' },
  { name: 'Notice Board & Circulars', path: '/notice-board', category: 'Communications', icon: Megaphone, keywords: 'announcements news circulars notices' },
  { name: 'SMS Notifications', path: '/sms', category: 'Communications', icon: MessageCircle, keywords: 'sms alerts mobile texts broadcasts' },
  { name: 'WhatsApp Support', path: '/whatsapp', category: 'Communications', icon: Phone, keywords: 'chat whatsapp desk queries help' },
  { name: 'School Email Portal', path: '/email', category: 'Communications', icon: Mail, keywords: 'inbox letters formal mail sent draft' },
  { name: 'Bus Transport & GPS', path: '/transport', category: 'Services & Resources', icon: Bus, keywords: 'van bus tracking route live location driver' },
  { name: 'Library & Book Search', path: '/library', category: 'Services & Resources', icon: BookOpen, keywords: 'borrow return books catalog isbn reading' },
  { name: 'Hostel Accommodation', path: '/hostel', category: 'Services & Resources', icon: Building2, keywords: 'room warden mess boarding pass' },
  { name: 'Health & Medical Records', path: '/health-records', category: 'Services & Resources', icon: HeartPulse, keywords: 'vaccine allergy medical checkup blood group' },
  { name: 'Documents & Certificates', path: '/documents', category: 'Services & Resources', icon: FolderOpen, keywords: 'bonafide id card transfer marks certificate download' },
  { name: 'School Photo Gallery', path: '/gallery', category: 'Services & Resources', icon: Image, keywords: 'events photos functions sports day annual day' },
  { name: 'School Visit & Gate Pass', path: '/school-visit', category: 'Services & Resources', icon: CalendarCheck, keywords: 'visitor pass appointment campus visit' },
  { name: 'Leave Application', path: '/leave-management', category: 'Services & Resources', icon: FileWarning, keywords: 'apply leave sick leave vacation absence permission' },
  { name: 'AI School Assistant (24/7)', path: '/ai-assistant', category: 'Help & Support', icon: Bot, keywords: 'chatbot ai robot questions fees attendance help' },
];

// Each item: key, label, icon, iconBg (colored box), route, subItems
const navSectionsConfig = [
  { 
    titleKey: 'portalNav',
    defaultTitle: 'PORTAL NAVIGATION',
    items: [
      { key: 'dashboard',  label: 'Dashboard',     icon: LayoutDashboard, iconBg: 'bg-yellow-500', route: '/dashboard'  },
      { key: 'myProfile',  label: 'My Profile',    icon: UserCog,         iconBg: 'bg-purple-500', route: '/my-profile' },
    ]
  },
  { 
    titleKey: 'academics',
    defaultTitle: 'ACADEMICS',
    items: [
      { key: 'calendar',     label: 'Calendar',        icon: Calendar,      iconBg: 'bg-orange-500', route: '/calendar'       },
      { key: 'timetable',    label: 'Timetable',       icon: LayoutGrid,    iconBg: 'bg-pink-500',   route: '/timetable'      },
      { key: 'attendance',   label: 'Attendance',      icon: ClipboardCheck,iconBg: 'bg-green-500',  route: '/attendance'     },
      { key: 'exams',        label: 'Exams & Reports', icon: GraduationCap, iconBg: 'bg-purple-500', route: '/exams'          },
      { key: 'coaching',     label: 'Coaching',        icon: Target,        iconBg: 'bg-indigo-500', route: '/coaching'       },
      { key: 'meetings',     label: 'Meetings',        icon: Handshake,     iconBg: 'bg-blue-400',   route: '/meetings'       },
      { key: 'onlineExams',  label: 'Online Exams',    icon: Monitor,       iconBg: 'bg-teal-500',   route: '/online-exams'   },
      { key: 'homework',     label: 'Homework',        icon: PenLine,       iconBg: 'bg-yellow-500', route: '/homework'       },
      { key: 'studyCenter',  label: 'Study Center',    icon: BookMarked,    iconBg: 'bg-red-500',    subItems: [
         { key: 'classwork',   label: 'Classwork & Logbook', route: '/classwork' },
         { key: 'syllabus',    label: 'Syllabus & Materials', route: '/study-center' },
         { key: 'liveClasses', label: 'Live Classes', route: '/live-classes' }
      ]},
    ]
  },
  { 
    titleKey: 'financials',
    defaultTitle: 'FINANCIALS',
    items: [
      { key: 'feePayments',  label: 'Fee Payments', icon: Wallet,      iconBg: 'bg-cyan-500',   route: '/fee-payments' },
      { key: 'transactions', label: 'Transactions', icon: RefreshCcw,  iconBg: 'bg-orange-400', route: '/transactions'  },
    ]
  },
  { 
    titleKey: 'communications',
    defaultTitle: 'COMMUNICATIONS',
    items: [
      { key: 'noticeBoard', label: 'Notice Board', icon: Megaphone,      iconBg: 'bg-green-500',  route: '/notice-board' },
      { key: 'sms',         label: 'SMS',          icon: MessageCircle,  iconBg: 'bg-purple-500', route: '/sms'          },
      { key: 'whatsapp',    label: 'WhatsApp',     icon: Phone,          iconBg: 'bg-blue-500',   route: '/whatsapp'     },
      { key: 'email',       label: 'Email',        icon: Mail,           iconBg: 'bg-green-600',  route: '/email'        },
    ]
  },
  { 
    titleKey: 'services',
    defaultTitle: 'SERVICES & RESOURCES',
    items: [
      { key: 'transport',     label: 'Transport',       icon: Bus,          iconBg: 'bg-red-500',    route: '/transport'      },
      { key: 'library',       label: 'Library',         icon: BookOpen,     iconBg: 'bg-purple-600', route: '/library'        },
      { key: 'hostel',        label: 'Hostel',          icon: Building2,    iconBg: 'bg-teal-500',   route: '/hostel'         },
      { key: 'healthRecords', label: 'Health Records',  icon: HeartPulse,   iconBg: 'bg-orange-500', route: '/health-records' },
      { key: 'documents',     label: 'Documents',       icon: FolderOpen,   iconBg: 'bg-pink-500',   route: '/documents'      },
      { key: 'gallery',       label: 'Gallery',         icon: Image,        iconBg: 'bg-green-500',  route: '/gallery'        },
      { key: 'schoolVisit',   label: 'School Visit',    icon: CalendarCheck,iconBg: 'bg-purple-400', route: '/school-visit'   },
      { key: 'leaveApply',    label: 'Leave Apply',     icon: FileWarning,  iconBg: 'bg-yellow-500', route: '/leave-management' },
    ]
  },
  { 
    titleKey: 'helpSupport',
    defaultTitle: 'HELP & SUPPORT',
    items: [
      { key: 'aiAssistant', label: 'AI Assistant', icon: Bot, iconBg: 'bg-green-500', route: '/ai-assistant' },
    ]
  },
];

function NavItem({ item, active, navigate, location, lang }) {
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
          className={`w-full flex items-center gap-3 pr-3 py-2 rounded-none mx-1 transition-all text-left group
            ${(active || isChildActive)
              ? 'bg-white/5 border-l-[3px] border-orange-400 pl-2.5'
              : 'hover:bg-white/5 border-l-[3px] border-transparent pl-2.5'}`}
          style={{ width: 'calc(100% - 8px)' }}
        >
          <div className={`w-7 h-7 ${item.iconBg} rounded-none flex items-center justify-center flex-shrink-0 shadow-sm`}>
            <Icon className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />
          </div>
          <span className={`flex-1 text-[12.5px] font-medium truncate ${(active || isChildActive) ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
            {itemLabel}
          </span>
          <ChevronDown className={`w-3 h-3 text-gray-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="flex flex-col ml-[42px] mt-1 space-y-1 relative mb-2">
            <div className="absolute left-[-16px] top-0 bottom-4 w-[1px] bg-white/10" />
            
            {item.subItems.map(subItem => (
              <div key={subItem.route} className="relative flex items-center">
                <div className="w-3 h-[1px] bg-white/10 absolute left-[-16px]" />
                <button
                  onClick={() => navigate(subItem.route)}
                  className={`w-full text-left flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-none transition-all text-[11.5px]
                    ${location.pathname === subItem.route ? 'text-gray-100 font-medium' : 'text-gray-400 hover:text-white'}`}
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
      onClick={() => navigate(item.route)}
      className={`w-full flex items-center gap-3 pr-3 py-2 rounded-none mx-1 transition-all text-left group
        ${active
          ? 'bg-white/10 border-l-[3px] border-orange-400 pl-2.5'
          : 'hover:bg-white/5 border-l-[3px] border-transparent pl-2.5'}`}
      style={{ width: 'calc(100% - 8px)' }}
    >
      <div className={`w-7 h-7 ${item.iconBg} rounded-none flex items-center justify-center flex-shrink-0 shadow-sm`}>
        <Icon className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />
      </div>
      <span className={`flex-1 text-[12.5px] font-medium truncate ${active ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
        {itemLabel}
      </span>
    </button>
  );
}

export default function Layout({ children: pageContent, activeChild, setActiveChild }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [sideOpen, setSideOpen] = useState(true);
  const [childOpen, setChildOpen] = useState(true);
  const [topChildOpen, setTopChildOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

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

  // Language State
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      return localStorage.getItem('portal_language') || localStorage.getItem('app_language') || 'en';
    } catch (e) {
      return 'en';
    }
  });

  const [childrenList, setChildrenList] = useState(defaultChildren);
  const [parentProfile, setParentProfile] = useState(null);
  const langDropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen to external language changes
  useEffect(() => {
    const handleLangChange = (e) => {
      if (e.detail && e.detail !== currentLang) {
        setCurrentLang(e.detail);
      }
    };
    window.addEventListener('portal_language_changed', handleLangChange);
    window.addEventListener('app_language_changed', handleLangChange);
    return () => {
      window.removeEventListener('portal_language_changed', handleLangChange);
      window.removeEventListener('app_language_changed', handleLangChange);
    };
  }, [currentLang]);

  // Load children
  useEffect(() => {
    async function loadPortalChildren() {
      try {
        const parentUser = localStorage.getItem('parent_user');
        let parentId = null;
        if (parentUser) {
          try {
            const parsed = JSON.parse(parentUser);
            parentId = parsed.parentId || parsed._id;
          } catch (e) {}
        }
        const res = await parentService.getDashboard({ parentId });
        if (res && res.success && res.data) {
          if (res.data.children && res.data.children.length > 0) {
            setChildrenList(res.data.children);
            const hasValidChild = res.data.children.some(c => (c.id === activeChild || c._id === activeChild));
            if (!hasValidChild) {
              const firstChildId = res.data.children[0].id || res.data.children[0]._id;
              if (setActiveChild && firstChildId) {
                setActiveChild(firstChildId);
              }
            }
          }
          if (res.data.parent) {
            setParentProfile(res.data.parent);
          }
        }
      } catch (err) {
        console.warn('Could not load dynamic portal children in Layout:', err);
      }
    }
    loadPortalChildren();
  }, []);

  const handleSelectLanguage = (langCode) => {
    setCurrentLang(langCode);
    try {
      localStorage.setItem('portal_language', langCode);
      localStorage.setItem('app_language', langCode);
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('portal_language_changed', { detail: langCode }));
    window.dispatchEvent(new CustomEvent('app_language_changed', { detail: langCode }));
    setLangOpen(false);
  };

  const current = childrenList.find(c => (c.id === activeChild || c._id === activeChild)) || childrenList[0] || defaultChildren[0];
  const activeLanguageObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">

      {/* ── SIDEBAR ─────────────────────────────────────── */}
      <aside className={`${sideOpen ? 'w-60' : 'w-0'} transition-all duration-300 overflow-hidden flex-shrink-0 flex flex-col bg-[#353A40] border-r border-[#2a2e33]`}>

        {/* Logo: ALL CORE SOLUTION */}
        <div 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2.5 px-[15px] py-3.5 flex-shrink-0 border-b border-[#2a2e33] cursor-pointer hover:bg-white/5 transition-colors"
          title="All Core Solution School ERP - Go to Dashboard"
        >
          <div className="w-8 h-8 rounded-none flex-shrink-0 overflow-hidden shadow-sm">
            <div className="w-full h-full bg-gradient-to-br from-orange-500 via-amber-500 to-red-600 flex items-center justify-center">
              <span className="text-white font-black text-[11px] tracking-wider">ACS</span>
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-white text-[13px] tracking-wide truncate">
              ALL CORE SOLUTION
            </span>
            <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest leading-none">
              School ERP
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2.5 flex-shrink-0 border-b border-[#2a2e33]">
          <div className="flex items-center gap-2 bg-[#2a2e33] rounded-none px-3 py-2 border border-white/5 mx-1 relative" style={{ width: 'calc(100% - 8px)' }}>
            <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              className="bg-transparent text-[12px] text-gray-200 outline-none flex-1 w-0 placeholder-gray-500 pr-5"
              placeholder={getT('searchMenu', currentLang) || 'Search Menu...'}
            />
            {menuSearch && (
              <button
                type="button"
                onClick={() => setMenuSearch('')}
                className="absolute right-2 text-gray-400 hover:text-white text-xs cursor-pointer"
                title="Clear filter"
              >
                ✕
              </button>
            )}
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
              />

              {/* Viewing: child dropdown */}
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
                      {getT('viewingChild', currentLang)}: {current.name.split(' ')[0]}
                    </span>
                    <span className="text-[9.5px] text-pink-300/80 block truncate">
                      {current.class}
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

              {/* My Profile */}
              <NavItem
                item={{ key: 'myProfile', label: 'My Profile', icon: UserCog, iconBg: 'bg-purple-500', route: '/my-profile' }}
                active={location.pathname === '/my-profile'}
                navigate={navigate}
                location={location}
                lang={currentLang}
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
          <button
            onClick={() => navigate('/logout')}
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
          
          {/* Developed by RAJ @ALLCORE SOLUTION - Exact Teacher Panel Style */}
          <div className="mx-3 mt-6 mb-4 p-2.5 bg-gradient-to-r from-slate-900/90 via-slate-800/60 to-slate-900/90 rounded-none border border-slate-700/80 shadow-xs hover:border-[#ff5c0a]/40 transition-colors">
            <p className="text-[11px] font-bold text-slate-300 tracking-wide mb-1">
              &copy; 2026 School ERP
            </p>
            <p className="text-[10px] font-medium text-slate-400 leading-relaxed">
              Developed by <span className="text-white font-bold">RAJ YADAV</span> <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent font-bold">@ALLCORE SOLUTION</span>
            </p>
          </div>
          
        </nav>
      </aside>

      {/* ── MAIN ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
          
          {/* Left Actions: Menu Toggle & Quick Dashboard Button */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSideOpen(!sideOpen)} 
              className="p-1.5 rounded-none hover:bg-gray-100 text-gray-600 transition-colors"
              title="Toggle Sidebar Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            
            {/* Working Dashboard Button in Topbar */}
            <button
              onClick={() => navigate('/dashboard')}
              className={`px-2.5 py-1.5 rounded-none transition-colors flex items-center gap-1.5 text-xs font-bold ${
                location.pathname === '/dashboard'
                  ? 'bg-yellow-50 text-yellow-800 border border-yellow-300'
                  : 'hover:bg-gray-100 text-gray-700 border border-gray-200 bg-gray-50'
              }`}
              title="Navigate to Dashboard"
            >
              <LayoutDashboard className="w-4 h-4 text-yellow-500" strokeWidth={2.3} />
              <span className="hidden sm:inline font-bold">{getT('dashboard', currentLang)}</span>
            </button>
          </div>

          {/* Center Search Box Trigger */}
          <div className="flex-1 max-w-xs md:max-w-md mx-3">
            <button
              type="button"
              onClick={() => setIsSearchModalOpen(true)}
              className="w-full flex items-center justify-between gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-none text-xs text-gray-500 font-medium transition-colors shadow-2xs group cursor-pointer"
              title="Search modules, fees, homework... (Ctrl+K)"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Search className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
                <span className="truncate text-gray-500 group-hover:text-gray-700">
                  {getT('searchPortal', currentLang) || 'Search portal (fees, homework, exams...)'}
                </span>
              </div>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold text-gray-400 bg-white border border-gray-200 rounded-none shadow-2xs">
                Ctrl+K
              </kbd>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            
            {/* Active Student Pill Dropdown */}
            <div className="relative hidden sm:block">
              <div 
                onClick={() => { setTopChildOpen(!topChildOpen); setLangOpen(false); setAvatarOpen(false); }}
                className="flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-200 rounded-none shadow-sm cursor-pointer hover:bg-purple-100 transition-colors"
              >
                {current.photo ? (
                  <img
                    src={current.photo.startsWith('http') || current.photo.startsWith('data:') ? current.photo : `http://localhost:5050${current.photo.startsWith('/') ? '' : '/'}${current.photo}`}
                    alt={current.name}
                    className="w-5 h-5 rounded-none object-cover shadow-xs"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-none bg-purple-500 text-white flex items-center justify-center text-[10px] font-black shadow-inner">
                    {current.avatar}
                  </div>
                )}
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-purple-700">{current.name}</span>
                <span className="text-[10px] uppercase font-bold text-purple-400 opacity-70 border-l border-purple-300 pl-1.5 ml-1">• {current.class}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-purple-600 transition-transform ml-1 ${topChildOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {topChildOpen && (
                <div className="absolute top-full mt-2 w-64 right-0 bg-white border border-gray-200 shadow-xl rounded-none z-50 flex flex-col divide-y divide-gray-100">
                  <div className="px-3 py-1.5 bg-gray-50 text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                    {getT('viewingChild', currentLang)}
                  </div>
                  {childrenList.map(child => {
                    const childId = child.id || child._id;
                    const isSelected = activeChild === childId || activeChild === child.id || activeChild === child._id;
                    const cPhoto = child.photo ? (child.photo.startsWith('http') || child.photo.startsWith('data:') ? child.photo : `http://localhost:5050${child.photo.startsWith('/') ? '' : '/'}${child.photo}`) : null;
                    return (
                      <button
                        key={childId}
                        onClick={() => { setActiveChild(childId); setTopChildOpen(false); }}
                        className={`text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center gap-2.5 ${
                          isSelected ? 'bg-purple-50 text-purple-700 border-l-[3px] border-purple-500 font-extrabold' : 'text-gray-600 hover:bg-gray-50 border-l-[3px] border-transparent'
                        }`}
                      >
                        {cPhoto ? (
                          <img src={cPhoto} alt={child.name} className="w-6 h-6 rounded-none object-cover shadow-xs flex-shrink-0" />
                        ) : (
                          <div className="w-6 h-6 bg-purple-500 text-white flex items-center justify-center text-[10px] shadow-sm font-black flex-shrink-0">{child.avatar}</div>
                        )}
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="truncate">{child.name}</span>
                          <span className="text-[9px] text-gray-400 font-medium normal-case">{child.class} • Roll #{child.roll || '-'}</span>
                        </div>
                        {isSelected && <span className="text-purple-600 text-xs font-bold">✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Working Multi-Language Selector Dropdown with 14 Languages */}
            <div className="relative" ref={langDropdownRef}>
              <div 
                onClick={() => { setLangOpen(!langOpen); setTopChildOpen(false); setAvatarOpen(false); }}
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-700 border border-gray-200 bg-white rounded-none px-2.5 py-1.5 cursor-pointer hover:bg-gray-50 shadow-xs transition-colors select-none"
                title="Change Portal Language"
              >
                <span className="text-sm leading-none">{activeLanguageObj.flag}</span>
                <span>{activeLanguageObj.native || activeLanguageObj.name}</span>
                <ChevronDown className={`w-3 h-3 text-gray-400 opacity-80 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </div>

              {langOpen && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-white border border-gray-200 shadow-xl rounded-none z-50 flex flex-col py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                   <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100 mb-1">
                      <p className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">
                        {getT('selectLanguage', currentLang)}
                      </p>
                   </div>
                   <div className="max-h-64 overflow-y-auto custom-scrollbar divide-y divide-gray-50">
                     {LANGUAGES.map((lang) => {
                       const isSelected = currentLang === lang.code;
                       return (
                         <button
                           key={lang.code}
                           onClick={() => handleSelectLanguage(lang.code)}
                           className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                             isSelected 
                               ? 'bg-indigo-50 text-indigo-700 font-bold border-l-[3px] border-indigo-600' 
                               : 'text-gray-700 hover:bg-gray-50 border-l-[3px] border-transparent font-medium'
                           }`}
                         >
                           <div className="flex items-center gap-2">
                             <span className="text-sm leading-none">{lang.flag}</span>
                             <span>{lang.native} ({lang.name})</span>
                           </div>
                           {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 stroke-[3]" />}
                         </button>
                       );
                     })}
                   </div>
                </div>
              )}
            </div>
            
            {/* Grid Apps Button -> Also Navigates to Dashboard */}
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-1.5 rounded-none border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group relative"
              title="Quick Dashboard"
            >
              <Grid3X3 className="w-4 h-4 text-gray-600" />
              <div className="absolute top-full right-0 mt-2 bg-gray-900 border border-black text-white text-[9px] font-black px-2.5 py-1.5 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md">
                {getT('dashboard', currentLang)}
              </div>
            </button>
            
            {/* Profile Avatar Click Menu */}
            <div className="relative inline-block z-40">
              <div
                className={`w-8 h-8 rounded-none border border-orange-300 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-black text-[13px] shadow-sm transition-transform cursor-pointer hover:scale-105 ${avatarOpen ? 'ring-2 ring-orange-300' : ''}`}
                onClick={() => { setAvatarOpen(!avatarOpen); setLangOpen(false); setTopChildOpen(false); }}
              >
                {parentProfile?.name ? parentProfile.name.charAt(0).toUpperCase() : 'P'}
              </div>
              
              {avatarOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-gray-200 shadow-xl rounded-none z-50 flex flex-col">
                   <div className="p-3 border-b border-gray-100 bg-orange-50/50">
                      <p className="text-[12px] font-black text-gray-800 leading-tight uppercase tracking-wide truncate">
                        {parentProfile?.name || 'Parent / Guardian'}
                      </p>
                      <p className="text-[10px] font-bold text-gray-500 truncate mt-1">
                        {parentProfile?.email || parentProfile?.phone || 'parent@portal.edu'}
                      </p>
                   </div>
                   <button onClick={() => { setAvatarOpen(false); navigate('/my-profile'); }} className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:bg-orange-50 hover:text-orange-700 flex items-center gap-2 border-l-[3px] border-transparent hover:border-orange-400 transition-all">
                     <UserCog className="w-3.5 h-3.5" /> {getT('myProfile', currentLang)}
                   </button>
                   <button onClick={() => { setAvatarOpen(false); navigate('/logout'); }} className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 flex items-center gap-2 border-l-[3px] border-transparent hover:border-red-400 transition-all">
                     <LogOut className="w-3.5 h-3.5" /> {getT('logout', currentLang)}
                   </button>
                </div>
              )}
            </div>
            
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {pageContent}
        </main>
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

import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, Calendar, Globe, Search, Plus, Bell, Grid, Palette, 
  User, Settings, LogOut, Check, Users, FileText, ChevronDown, X,
  Trash2, ExternalLink, Sparkles, BookOpen, Clock, AlertTriangle,
  GraduationCap, MessageCircle, BarChart2, CheckCircle2, Sliders
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useSidebar } from '../context/SidebarContext';
import notificationService from '../api/notificationService';
import teacherService from '../api/teacherService';
import axiosInstance from '../api/axios';

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [session, setSession] = useState(() => localStorage.getItem('erp_session') || '2026-2027');
  const navigate = useNavigate();

  // Contexts
  const { currentTheme, changeTheme, themes, currentLayout, changeLayout, layouts } = useTheme();
  const { currentLang, changeLanguage, languages, supportedLanguages, t } = useLanguage();
  const { toggleSidebar } = useSidebar();

  // Teacher Profile State
  const [profile, setProfile] = useState({
    name: 'Amit Sharma',
    role: 'Teacher',
    designation: 'Senior PGT Mathematics',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  // Notifications State
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchInputRef = useRef(null);

  // Quick Settings State
  const [settingsForm, setSettingsForm] = useState({
    soundAlerts: true,
    emailAlerts: true,
    theme: currentTheme,
    language: currentLang
  });

  // Load Real Profile & Notifications on mount
  useEffect(() => {
    loadProfile();
    loadNotifications();
  }, []);

  // Sync settingsForm when theme or lang changes
  useEffect(() => {
    setSettingsForm(prev => ({
      ...prev,
      theme: currentTheme,
      language: currentLang
    }));
  }, [currentTheme, currentLang]);

  // Focus search input when search opens
  useEffect(() => {
    if (activeMenu === 'search' && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [activeMenu]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = () => {
      if (activeMenu !== 'commandCenter' && activeMenu !== 'quickSettings') {
        setActiveMenu(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenu]);

  // Load Profile from Backend API
  const loadProfile = async () => {
    try {
      const res = await teacherService.getProfile();
      if (res?.data?.personalInfo) {
        const info = res.data.personalInfo;
        setProfile({
          name: info.fullName || 'Amit Sharma',
          role: info.role || 'Teacher',
          designation: info.designation || 'Senior PGT Mathematics',
          avatar: info.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        });
      }
    } catch (err) {
      // Fallback to localStorage user if present
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const u = JSON.parse(stored);
          setProfile(prev => ({
            ...prev,
            name: u.fullName || u.username || prev.name,
            role: u.role || prev.role
          }));
        } catch(e) {}
      }
    }
  };

  // Load Notifications from Backend
  const loadNotifications = async () => {
    try {
      setLoadingNotifs(true);
      const res = await notificationService.getNotifications();
      if (res?.success) {
        setNotifications(res.data || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Load notifications error:', err);
    } finally {
      setLoadingNotifs(false);
    }
  };

  // Mark all notifications as read
  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      showToast(t('markAllRead', 'Marked all as read'), 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Mark single notification as read & navigate
  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.isRead) {
        await notificationService.markAsRead(notif._id);
        setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      setActiveMenu(null);
      if (notif.link) {
        navigate(notif.link);
      }
    } catch (err) {
      navigate(notif.link || '/');
    }
  };

  // Delete notification
  const handleDeleteNotification = async (e, id) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      setUnreadCount(prev => {
        const deleted = notifications.find(n => n._id === id);
        return deleted && !deleted.isRead ? Math.max(0, prev - 1) : prev;
      });
    } catch (err) {
      showToast('Could not delete notification', 'error');
    }
  };

  // ERP Searchable Modules
  const erpModules = [
    { name: 'Dashboard', path: '/', category: 'Core', icon: BarChart2 },
    { name: 'My Profile', path: '/my-profile', category: 'Account', icon: User },
    { name: 'Student Attendance', path: '/student-attendance', category: 'Academics', icon: CheckCircle2 },
    { name: 'Holistic Progress Card (HPC)', path: '/hpc-dashboard', category: 'Communication', icon: Sparkles },
    { name: 'HPC Activities', path: '/hpc-activities', category: 'Communication', icon: BookOpen },
    { name: 'HPC Progress Cards', path: '/progress-cards', category: 'Communication', icon: FileText },
    { name: 'Messages & Broadcast', path: '/messages', category: 'Communication', icon: MessageCircle },
    { name: 'PTM Meetings', path: '/ptm', category: 'Documents', icon: Users },
    { name: 'Online Exams', path: '/online-exams', category: 'Exams', icon: FileText },
    { name: 'Question Bank', path: '/question-bank', category: 'Exams', icon: BookOpen },
    { name: 'Enter Marks', path: '/enter-marks', category: 'Exams', icon: FileText },
    { name: 'Classwork & Logbook', path: '/classwork', category: 'Study', icon: BookOpen },
    { name: 'Homework & Assignments', path: '/assignments', category: 'Study', icon: FileText },
    { name: 'Certificates & Documents', path: '/certificates', category: 'Documents', icon: FileText },
    { name: 'Apps Center', path: '/apps-center', category: 'Apps', icon: Grid },
    { name: 'Apply Leave', path: '/leave', category: 'HR', icon: Clock },
    { name: 'Complaints & Grievances', path: '/complaints', category: 'Support', icon: AlertTriangle },
    { name: 'Manage Live Classes', path: '/live/manage', category: 'Academics', icon: GraduationCap },
    { name: 'My Loans & Advances', path: '/loans', category: 'Payroll', icon: Users },
    { name: 'Surveys & Feedback', path: '/surveys', category: 'Documents', icon: FileText },
    { name: 'Lead Management', path: '/leads', category: 'Documents', icon: Users },
    { name: 'OSM Module', path: '/osm', category: 'Documents', icon: BookOpen },
    { name: 'Lesson Planner', path: '/lesson-planner', category: 'Documents', icon: BookOpen }
  ];

  // Perform search across modules & live students
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const q = searchQuery.toLowerCase();
    const matchedModules = erpModules.filter(m => 
      m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)
    );

    setSearchResults(matchedModules);

    // Live search students from API
    const timer = setTimeout(async () => {
      try {
        setSearching(true);
        const res = await axiosInstance.get(`/students?search=${encodeURIComponent(searchQuery)}&limit=5`);
        if (res.data?.data && Array.isArray(res.data.data)) {
          const studentResults = res.data.data.map(s => ({
            name: `${s.firstName || ''} ${s.lastName || ''} (${s.admissionNo || s.rollNo || 'Student'})`,
            path: '/students',
            category: s.className ? `Class ${s.className}` : 'Student',
            icon: GraduationCap,
            isStudent: true
          }));
          setSearchResults(prev => [...matchedModules, ...studentResults]);
        }
      } catch (err) {
        // keep module results
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggle = (e, menuName) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const showToast = (msg, icon = 'info') => {
    Swal.fire({
      title: msg,
      icon: icon,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const handleSessionChange = (s) => {
    setSession(s);
    localStorage.setItem('erp_session', s);
    showToast(`${t('sessionChangedToast', 'Academic session switched to')} ${s}`, 'success');
  };

  const handleSignOut = () => {
    Swal.fire({
      title: t('signOut', 'Sign out?'),
      text: 'Are you sure you want to end your current session?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Sign Out',
      confirmButtonColor: '#ff5c0a',
      cancelButtonText: 'Cancel'
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      }
    });
  };

  return (
    <>
    <header className="h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-30 box-border theme-header select-none">
      
      {/* Left Items */}
      <div className="flex items-center gap-3">
        {/* Hamburger Menu Icon */}
        <button 
          title="Toggle Sidebar"
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer" 
          onClick={toggleSidebar}
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="text-[14px] font-bold text-gray-800 tracking-tight hidden sm:block theme-text">
          ALL CORE SOLUTION
        </span>
        
        {/* Command Center Button */}
        <button 
          onClick={(e) => toggle(e, 'commandCenter')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 border border-orange-200 bg-orange-50/80 rounded-xl text-xs font-semibold text-orange-600 ml-2 hover:bg-orange-100 transition-colors shadow-xs cursor-pointer"
        >
          <Palette className="w-3.5 h-3.5 text-[#ff5c0a]" />
          <span>{t('commandCenter', 'Command Center')}</span>
          <span className="bg-[#ff5c0a] text-white text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ml-1">{t('themePreview', 'Preview')}</span>
        </button>
      </div>
      
      {/* Right Items */}
      <div className="flex items-center gap-2 sm:gap-3 text-gray-500">
        
        {/* Academic Session Selector */}
        <div className="relative">
          <button 
            onClick={(e) => toggle(e, 'session')} 
            className="hidden lg:flex items-center gap-1.5 cursor-pointer hover:text-gray-900 hover:bg-gray-50 px-2.5 py-1.5 rounded-xl border border-transparent hover:border-gray-200 transition-colors"
          >
            <Calendar className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-semibold theme-text">{session}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>
          {activeMenu === 'session' && (
            <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-slate-200 shadow-xl rounded-2xl py-1.5 z-50 theme-card">
              <div className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('session', 'Session')}</div>
              {['2026-2027', '2025-2026', '2024-2025'].map(s => (
                <div 
                  key={s} 
                  onClick={() => { handleSessionChange(s); setActiveMenu(null); }} 
                  className="px-3.5 py-2 text-xs hover:bg-orange-50 hover:text-[#ff5c0a] cursor-pointer flex items-center justify-between text-gray-700 font-medium transition-colors"
                >
                  {s} {session === s && <Check className="w-3.5 h-3.5 text-[#ff5c0a]"/>}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Language Switcher */}
        <div className="relative">
          <button 
            onClick={(e) => toggle(e, 'lang')} 
            className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900 hover:bg-gray-50 px-2 sm:px-2.5 py-1.5 rounded-xl border border-transparent hover:border-gray-200 transition-colors"
            title="Change Language"
          >
            <Globe className="w-4 h-4 text-sky-500" />
            <span className="text-xs font-semibold theme-text">
              {supportedLanguages.find(l => l.name === currentLang)?.native || currentLang}
            </span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>
          {activeMenu === 'lang' && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 shadow-2xl rounded-2xl py-2 z-50 theme-card overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-1.5 border-b border-gray-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('selectLanguage', 'Select Language')}</span>
                <span className="text-[10px] text-[#ff5c0a] font-bold">2 Languages</span>
              </div>
              <div className="p-1 space-y-1">
                {supportedLanguages.map(l => (
                  <div 
                    key={l.code} 
                    onClick={() => { changeLanguage(l.name); setActiveMenu(null); }} 
                    className={`px-3 py-2.5 rounded-xl text-xs cursor-pointer flex items-center justify-between font-medium transition-colors ${
                      currentLang === l.name ? 'bg-orange-50 text-[#ff5c0a] font-bold' : 'hover:bg-slate-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{l.flag || '🌐'}</span>
                      <div className="flex flex-col">
                        <span className="font-bold text-xs">{l.native}</span>
                        <span className="text-[10px] text-gray-400 font-normal">{l.name}</span>
                      </div>
                    </div>
                    {currentLang === l.name && <Check className="w-4 h-4 text-[#ff5c0a] flex-shrink-0"/>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Global ERP Search Icon */}
        <div className="relative flex items-center">
          <button 
            onClick={(e) => toggle(e, 'search')} 
            className="hover:text-gray-900 hover:bg-gray-100 text-gray-500 transition-colors p-2 rounded-xl cursor-pointer"
            title="Quick Search Modules & Students"
          >
            <Search className="w-4 h-4" />
          </button>

          {activeMenu === 'search' && (
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 shadow-2xl rounded-2xl z-50 overflow-hidden theme-card animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center px-3.5 py-2.5 border-b border-gray-100 bg-slate-50/70">
                <Search className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder', 'Search students, exams, modules...')}
                  className="w-full text-xs outline-none bg-transparent py-1 text-gray-800 placeholder-gray-400" 
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 p-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                {searchResults.length > 0 ? (
                  searchResults.map((item, idx) => {
                    const ItemIcon = item.icon || FileText;
                    return (
                      <div 
                        key={idx}
                        onClick={() => {
                          navigate(item.path);
                          setActiveMenu(null);
                          setSearchQuery('');
                        }}
                        className="px-3.5 py-2.5 hover:bg-orange-50/70 cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-orange-100/60 text-[#ff5c0a] flex items-center justify-center">
                            <ItemIcon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-800 group-hover:text-[#ff5c0a] transition-colors">{item.name}</p>
                            <p className="text-[10px] text-gray-400">{item.category}</p>
                          </div>
                        </div>
                        <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-[#ff5c0a] transition-colors" />
                      </div>
                    );
                  })
                ) : searchQuery.length >= 2 ? (
                  <div className="p-6 text-center">
                    <p className="text-xs font-medium text-gray-500">{t('noResultsFound', 'No matching modules or students found')}</p>
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <span className="text-xs text-slate-400 leading-relaxed block">
                      {t('searchHint', 'Type at least 2 characters to search anything in the ERP.')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Quick Add Menu */}
        <div className="relative flex items-center">
          <button 
            onClick={(e) => toggle(e, 'add')} 
            className="hover:text-gray-900 hover:bg-gray-100 text-gray-500 transition-colors p-2 rounded-xl cursor-pointer"
            title="Quick Actions"
          >
            <Plus className="w-4 h-4" />
          </button>
          {activeMenu === 'add' && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 shadow-xl rounded-2xl py-1.5 z-50 theme-card animate-in fade-in duration-100">
              <div className="px-3.5 py-1.5 border-b border-gray-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('quickActions', 'Quick Actions')}</div>
              <div onClick={() => { navigate('/students?add=true'); setActiveMenu(null); }} className="px-3.5 py-2 text-xs hover:bg-orange-50 hover:text-[#ff5c0a] cursor-pointer flex items-center gap-2.5 text-gray-700 font-medium">
                <Users className="w-3.5 h-3.5 text-blue-500"/> {t('addStudent', 'Add Student')}
              </div>
              <div onClick={() => { navigate('/enter-marks'); setActiveMenu(null); }} className="px-3.5 py-2 text-xs hover:bg-orange-50 hover:text-[#ff5c0a] cursor-pointer flex items-center gap-2.5 text-gray-700 font-medium">
                <FileText className="w-3.5 h-3.5 text-emerald-500"/> {t('enterMarks', 'Enter Marks')}
              </div>
              <div onClick={() => { navigate('/leave'); setActiveMenu(null); }} className="px-3.5 py-2 text-xs hover:bg-orange-50 hover:text-[#ff5c0a] cursor-pointer flex items-center gap-2.5 text-gray-700 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-500"/> {t('applyLeave', 'Apply Leave')}
              </div>
              <div onClick={() => { navigate('/hpc-activities'); setActiveMenu(null); }} className="px-3.5 py-2 text-xs hover:bg-orange-50 hover:text-[#ff5c0a] cursor-pointer flex items-center gap-2.5 text-gray-700 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-purple-500"/> HPC Activity
              </div>
            </div>
          )}
        </div>

        {/* Real Backend Notifications */}
        <div className="relative flex items-center">
          <button 
            onClick={(e) => toggle(e, 'notify')} 
            className="relative hover:text-gray-900 hover:bg-gray-100 text-gray-500 transition-colors p-2 rounded-xl cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#ff5c0a] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {activeMenu === 'notify' && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-88 bg-white border border-slate-200 shadow-2xl rounded-2xl py-1.5 z-50 overflow-hidden theme-card animate-in fade-in duration-100">
              <div className="px-4 py-2.5 border-b border-gray-100 flex justify-between items-center bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-800">{t('notifications', 'Notifications')}</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-[#ff5c0a] font-bold cursor-pointer hover:underline"
                  >
                    {t('markAllRead', 'Mark all read')}
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <div 
                      key={item._id}
                      onClick={() => handleNotificationClick(item)}
                      className={`px-4 py-3 cursor-pointer transition-colors flex items-start gap-3 group ${
                        item.isRead ? 'hover:bg-slate-50 opacity-80' : 'bg-orange-50/30 hover:bg-orange-50/60'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        item.type === 'exam' ? 'bg-indigo-100 text-indigo-600' :
                        item.type === 'leave' ? 'bg-amber-100 text-amber-600' :
                        item.type === 'hpc' ? 'bg-purple-100 text-purple-600' :
                        item.type === 'attendance' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {item.type === 'exam' && <FileText className="w-4 h-4" />}
                        {item.type === 'leave' && <Clock className="w-4 h-4" />}
                        {item.type === 'hpc' && <Sparkles className="w-4 h-4" />}
                        {item.type === 'attendance' && <CheckCircle2 className="w-4 h-4" />}
                        {item.type === 'system' && <Bell className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`text-xs truncate ${item.isRead ? 'font-semibold text-gray-700' : 'font-bold text-gray-900'}`}>
                            {item.title}
                          </p>
                          {!item.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#ff5c0a] flex-shrink-0"></span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                      </div>

                      <button 
                        onClick={(e) => handleDeleteNotification(e, item._id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 transition-opacity"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-xs text-gray-400">{t('noNotifications', 'No new notifications')}</p>
                  </div>
                )}
              </div>

              <div 
                onClick={() => { setActiveMenu(null); navigate('/messages'); }}
                className="px-3 py-2 border-t border-gray-100 text-center cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <span className="text-xs text-[#ff5c0a] font-bold">{t('viewAll', 'View All Messages & Alerts')}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Apps Center Shortcut Icon */}
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/apps-center')} 
            className="hover:text-gray-900 hover:bg-gray-100 text-gray-500 transition-colors p-2 rounded-xl cursor-pointer"
            title="Apps Center"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
        
        {/* User Profile Dropdown */}
        <div className="relative flex items-center ml-1 border-l border-gray-200 pl-3">
          <div 
            onClick={(e) => toggle(e, 'profile')} 
            className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                }}
              />
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-gray-800 leading-tight truncate max-w-[110px]">{profile.name}</span>
              <span className="text-[10px] text-gray-400 font-medium truncate max-w-[110px]">{profile.role}</span>
            </div>
            <ChevronDown className="w-3 h-3 text-gray-400 hidden xl:block" />
          </div>

          {activeMenu === 'profile' && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 shadow-2xl rounded-2xl py-1.5 z-50 theme-card animate-in fade-in duration-100">
              <div className="px-4 py-2.5 border-b border-gray-100 bg-slate-50/70">
                <p className="text-xs font-bold text-gray-800 truncate">{profile.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{profile.designation}</p>
              </div>

              <div 
                onClick={() => { navigate('/my-profile'); setActiveMenu(null); }} 
                className="px-4 py-2 flex items-center gap-2.5 text-xs text-gray-700 hover:bg-orange-50 hover:text-[#ff5c0a] cursor-pointer font-medium transition-colors"
              >
                <User className="w-3.5 h-3.5 text-orange-500" /> {t('myProfile', 'My Profile')}
              </div>

              <div 
                onClick={() => { navigate('/settings'); setActiveMenu(null); }} 
                className="px-4 py-2 flex items-center gap-2.5 text-xs text-gray-700 hover:bg-orange-50 hover:text-[#ff5c0a] cursor-pointer font-medium transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-sky-500" /> {t('settings', 'Settings & Preferences')}
              </div>

              <div className="border-t border-gray-100 my-1"></div>

              <div 
                onClick={handleSignOut} 
                className="px-4 py-2 flex items-center gap-2.5 text-xs text-red-600 hover:bg-red-50 cursor-pointer font-medium transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> {t('signOut', 'Sign out')}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

    {/* Quick Settings Modal */}
    {activeMenu === 'quickSettings' && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" onClick={() => setActiveMenu(null)}>
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-orange-500" />
              <h3 className="text-sm font-bold text-gray-800">{t('settings', 'System Preferences & Settings')}</h3>
            </div>
            <button onClick={() => setActiveMenu(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Language Option */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">{t('selectLanguage', 'Select Language')} ({supportedLanguages.length})</label>
              <div className="grid grid-cols-2 gap-2 p-1.5 border border-gray-100 rounded-xl bg-gray-50/50">
                {supportedLanguages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => changeLanguage(l.name)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 text-center ${
                      currentLang === l.name 
                        ? 'bg-orange-50 border-[#ff5c0a] text-[#ff5c0a] shadow-xs' 
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-sm">{l.flag || '🌐'}</span>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-xs">{l.native}</span>
                      <span className="text-[10px] text-gray-400 font-normal">{l.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Academic Session */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">{t('session', 'Academic Session')}</label>
              <select 
                value={session} 
                onChange={(e) => handleSessionChange(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#ff5c0a]"
              >
                <option value="2026-2027">2026-2027 (Active Current)</option>
                <option value="2025-2026">2025-2026 (Archived)</option>
                <option value="2024-2025">2024-2025 (Historical)</option>
              </select>
            </div>

            {/* Theme Quick Preview */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Visual Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {themes.slice(0, 4).map((th) => (
                  <button
                    key={th.id}
                    onClick={() => { changeTheme(th.id); showToast(`${th.name} Applied!`, 'success'); }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border text-left flex items-center justify-between transition-all cursor-pointer ${
                      currentTheme === th.id
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="truncate">{th.name}</span>
                    {currentTheme === th.id && <Check className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <button 
              onClick={() => { setActiveMenu(null); navigate('/settings'); }}
              className="text-xs text-[#ff5c0a] hover:underline font-bold cursor-pointer"
            >
              Open Full Settings Page →
            </button>
            <button 
              onClick={() => setActiveMenu(null)}
              className="px-4 py-2 bg-[#ff5c0a] hover:bg-[#ea5206] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Command Center Modal (Theme & Layout Engine) */}
    {activeMenu === 'commandCenter' && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" onClick={() => setActiveMenu(null)}>
        <div className="bg-[#f8f9fa] w-full max-w-5xl rounded-none shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
           <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
             <div>
               <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Palette className="w-6 h-6 text-orange-500"/> Command Center : Theme & Layout Engine</h2>
               <p className="text-sm text-gray-500 mt-1">Select from different aesthetic themes and structural layouts to instantly transform your ERP.</p>
             </div>
             <button onClick={() => setActiveMenu(null)} className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-none transition-colors border-none cursor-pointer">
               <X className="w-5 h-5"/>
             </button>
           </div>
           
           <div className="p-8 overflow-y-auto flex-1 space-y-10">
             
             {/* THEMES SECTION */}
             <div>
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Color Themes & Aesthetics</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {themes.map((theme) => (
                     <div 
                       key={theme.id}
                       onClick={() => { changeTheme(theme.id); showToast(`${theme.name} Theme Applied!`, 'success'); }}
                       className={`cursor-pointer transition-all duration-200 flex flex-col group ${currentTheme === theme.id ? 'ring-4 ring-orange-500 scale-105 shadow-xl' : 'hover:scale-105 shadow-md hover:shadow-lg ring-1 ring-gray-200'}`}
                     >
                       <div className={`h-24 w-full bg-gray-100 relative overflow-hidden flex ${
                          theme.id === 'theme-modern' ? 'rounded-t-2xl' : 
                          theme.id === 'theme-dark' ? 'rounded-t-xl bg-[#222]' : 
                          theme.id === 'theme-glass' ? 'bg-gradient-to-r from-blue-400 to-purple-500' : 
                          theme.id === 'theme-neo' ? 'border-b-4 border-black' : 
                          theme.id === 'theme-nature' ? 'bg-[#2E4F32]/10' :
                          theme.id === 'theme-ocean' ? 'bg-[#0D3B66]/10' : 
                          theme.id === 'theme-monochrome' ? 'bg-black/5' : ''
                       }`}>
                          <div className={`w-1/4 h-full border-r ${
                            theme.id === 'theme-dark' ? 'bg-[#111] border-gray-800' :
                            theme.id === 'theme-enterprise' ? 'bg-[#353A40] border-[#2a2e33]' :
                            theme.id === 'theme-modern' ? 'bg-white border-gray-100' :
                            theme.id === 'theme-glass' ? 'bg-white/20 backdrop-blur-sm border-white/20' :
                            theme.id === 'theme-nature' ? 'bg-[#2E4F32] border-[#203D23]' :
                            theme.id === 'theme-ocean' ? 'bg-[#0D3B66]' :
                            theme.id === 'theme-sunset' ? 'bg-[#7A2828]' :
                            theme.id === 'theme-monochrome' ? 'bg-black' : 'bg-white'
                          }`}></div>
                          <div className="flex-1 flex flex-col">
                             <div className={`h-8 border-b ${
                               theme.id === 'theme-dark' ? 'bg-[#1a1a1a] border-gray-800' : 
                               theme.id === 'theme-glass' ? 'bg-white/10 backdrop-blur-sm border-white/10' : 
                               theme.id === 'theme-neo' ? 'bg-white border-black border-b-2' : 
                               'bg-white border-gray-100'
                             }`}></div>
                             <div className={`flex-1 p-2 flex gap-2 ${
                               theme.id === 'theme-dark' ? 'bg-[#0a0a0a]' : 
                               theme.id === 'theme-nature' ? 'bg-[#F2F4EB]' :
                               theme.id === 'theme-ocean' ? 'bg-[#EBF4F6]' : 
                               theme.id === 'theme-sunset' ? 'bg-[#FFF0E6]' :
                               theme.id === 'theme-neo' ? 'bg-[#FFE873]' :
                               theme.id === 'theme-glass' ? 'bg-transparent' :
                               'bg-[#f4f7f6]'
                             }`}>
                                <div className={`w-full h-full bg-white opacity-60 ${
                                  theme.id === 'theme-modern' ? 'rounded-xl' :
                                  theme.id === 'theme-dark' ? 'rounded-lg bg-gray-800 border border-gray-700' :
                                  theme.id === 'theme-glass' ? 'rounded-2xl bg-white/30 backdrop-blur-md' :
                                  theme.id === 'theme-neo' ? 'border-2 border-black shadow-[2px_2px_0px_black]' :
                                  theme.id === 'theme-playful' ? 'rounded-3xl bg-pink-100' :
                                  'rounded-none shadow-sm'
                                }`}></div>
                             </div>
                          </div>
                       </div>
                       <div className={`p-4 bg-white flex-1 flex flex-col justify-between ${
                          theme.id === 'theme-modern' ? 'rounded-b-2xl' : 
                          theme.id === 'theme-dark' ? 'bg-[#1a1a1a] rounded-b-xl border border-t-0 border-gray-800' : 
                          theme.id === 'theme-neo' ? 'border-t-0 border-4 border-black' : 
                          ''
                       }`}>
                          <h3 className={`text-sm font-bold ${theme.id === 'theme-dark' ? 'text-white' : 'text-gray-800'}`}>{theme.name}</h3>
                          <p className={`text-[10px] mt-1 line-clamp-2 ${theme.id === 'theme-dark' ? 'text-gray-400' : 'text-gray-500'}`}>{theme.desc}</p>
                          <div className="mt-3 flex items-center justify-between">
                             <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 ${currentTheme === theme.id ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{currentTheme === theme.id ? 'Active' : 'Select'}</span>
                          </div>
                       </div>
                     </div>
                  ))}
               </div>
             </div>

             {/* LAYOUTS SECTION */}
             <div>
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 border-t border-gray-200 pt-8">Dashboard Layout Structure</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {layouts && layouts.map((layout) => (
                     <div 
                       key={layout.id}
                       onClick={() => { changeLayout(layout.id); showToast(`${layout.name} Layout Applied!`, 'success'); setActiveMenu(null); }}
                       className={`cursor-pointer transition-all duration-200 flex flex-col bg-white p-4 group ${currentLayout === layout.id ? 'ring-4 ring-blue-500 scale-105 shadow-xl' : 'hover:scale-105 shadow-sm ring-1 ring-gray-200'}`}
                     >
                        <div className="h-20 w-full bg-gray-50 border border-gray-100 mb-3 flex flex-col gap-1 p-1">
                           {layout.id === 'layout-default' && (
                             <>
                                <div className="flex gap-1 h-1/4 w-full"> <div className="bg-blue-200 flex-1"></div><div className="bg-blue-200 flex-1"></div><div className="bg-blue-200 flex-1"></div><div className="bg-blue-200 flex-1"></div> </div>
                                <div className="flex gap-1 h-3/4 w-full"> <div className="bg-gray-300 w-2/3"></div><div className="bg-gray-300 w-1/3"></div> </div>
                             </>
                           )}
                           {layout.id === 'layout-analytics' && (
                             <>
                                <div className="bg-gray-300 h-1/2 w-full"></div>
                                <div className="flex gap-1 h-1/2 w-full"> <div className="bg-blue-200 flex-1"></div><div className="bg-blue-200 flex-1"></div><div className="bg-blue-200 flex-1"></div> </div>
                             </>
                           )}
                           {layout.id === 'layout-compact' && (
                             <>
                                <div className="flex gap-px h-1/3 w-full"> <div className="bg-blue-200 flex-1"></div><div className="bg-blue-200 flex-1"></div><div className="bg-blue-200 flex-1"></div><div className="bg-blue-200 flex-1"></div><div className="bg-blue-200 flex-1"></div> </div>
                                <div className="flex gap-px h-2/3 w-full"> <div className="bg-gray-300 flex-1"></div><div className="bg-gray-300 flex-1"></div><div className="bg-gray-300 flex-1"></div> </div>
                             </>
                           )}
                           {layout.id === 'layout-focus' && (
                             <>
                                <div className="bg-gray-300 h-1/3 w-full"></div>
                                <div className="bg-blue-200 h-1/3 w-full"></div>
                                <div className="bg-gray-300 h-1/3 w-full"></div>
                             </>
                           )}
                           {layout.id === 'layout-classic-teacher' && (
                             <>
                                <div className="flex gap-1 h-1/4 w-full"> <div className="bg-blue-400 w-1/3"></div><div className="bg-teal-400 w-1/3"></div><div className="bg-yellow-400 w-1/3"></div> </div>
                                <div className="bg-gray-200 h-[2px] w-full mt-px border-b border-orange-400/30"></div>
                                <div className="flex gap-1 h-3/4 w-full mt-px"> <div className="bg-white border border-gray-300 w-2/3"></div><div className="bg-gray-100 border border-gray-200 w-1/3"></div> </div>
                             </>
                           )}
                           {layout.id === 'layout-reversed' && (
                             <>
                                <div className="flex gap-1 h-2/3 w-full"> <div className="bg-white border border-gray-300 w-1/3"></div><div className="bg-gray-700 w-2/3"></div> </div>
                                <div className="flex gap-1 h-1/3 w-full"> <div className="bg-blue-200 flex-1"></div><div className="bg-blue-200 flex-1"></div><div className="bg-blue-200 flex-1"></div> </div>
                             </>
                           )}
                        </div>
                        <h3 className="text-sm font-bold text-gray-800">{layout.name}</h3>
                        <p className="text-[10px] mt-1 text-gray-500">{layout.desc}</p>
                        <div className="mt-3 flex items-center justify-between">
                           <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 ${currentLayout === layout.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{currentLayout === layout.id ? 'Active' : 'Select'}</span>
                        </div>
                     </div>
                  ))}
               </div>
             </div>
             
           </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Header;

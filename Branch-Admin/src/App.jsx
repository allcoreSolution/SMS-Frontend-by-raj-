import React, { useState, useEffect, Component } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  Menu, Bell, User, Search, Globe, ChevronDown, ChevronRight,
  LogOut, School, CreditCard, LayoutTemplate, BarChart2, BookOpen,
  Building2, Users, FileText, CheckCircle2, X, Sparkles, ShieldCheck
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import GenericPage from './pages/GenericPage';
import Profile from './pages/Profile';
import Branches from './pages/Branches';
import Payments from './pages/Payments';
import Templates from './pages/Templates';
import LoginLogs from './pages/LoginLogs';
import SchoolsUsage from './pages/SchoolsUsage';
import FeeCollections from './pages/FeeCollections';
import IncomeExpense from './pages/IncomeExpense';
import AttendanceTrends from './pages/AttendanceTrends';
import EngagementAudit from './pages/EngagementAudit';
import CommunicationsReport from './pages/CommunicationsReport';
import Login from './pages/Login';
import Swal from 'sweetalert2';
import branchLocalDb from './api/branchLocalDb';
import authService from './api/authService';

// Error Boundary to prevent any blank screen in the browser
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Branch Admin Error Caught:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('branch_admin_token');
      localStorage.removeItem('branch_admin_user');
      authService.ensureDemoSession();
    } catch (_) {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f4f7fa] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-lg w-full">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
              ⚠️
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Branch Overview Recovery</h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              We recovered from a component render error. Click the button below to reload Branch Overview cleanly.
            </p>
            <div className="p-3 bg-red-50 text-red-700 text-xs font-mono rounded-lg mb-6 text-left overflow-x-auto max-h-32">
              {this.state.error?.message || 'Component failed to mount.'}
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-sm font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              Reload Branch Overview Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const Sidebar = ({ isOpen, isDesktopOpen = true, setOpen, onToggle, onLogout }) => {
  const location = useLocation();
  const [reportsOpen, setReportsOpen] = useState(location.pathname.startsWith('/reports'));
  const [branchesCount, setBranchesCount] = useState(5);

  useEffect(() => {
    try {
      const list = branchLocalDb.getBranches();
      if (Array.isArray(list)) setBranchesCount(list.length);
    } catch (_) {}
  }, [location.pathname]);

  const links = [
    { name: 'Branch Overview', path: '/', icon: <BarChart2 className="w-4 h-4" /> },
    { name: 'My Branches', path: '/branches', icon: <Building2 className="w-4 h-4" />, badge: branchesCount },
    { name: 'Payment History', path: '/payments', icon: <CreditCard className="w-4 h-4" /> },
    { name: 'Ready Templates', path: '/templates', icon: <LayoutTemplate className="w-4 h-4" /> },
    { name: 'Admin Profile', path: '/profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 bg-[#0b1329] w-[240px] text-gray-300 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${isDesktopOpen ? 'md:translate-x-0' : 'md:-translate-x-full'} shadow-[4px_0_24px_rgba(0,0,0,0.15)] border-r border-slate-800/80`}>
      
      {/* Branding Header */}
      <div className="h-[70px] flex items-center justify-between px-4 border-b border-slate-800 bg-[#070d1e]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#fd7e14] to-[#f59e0b] flex items-center justify-center font-bold text-white shadow-md ring-2 ring-orange-500/30">
            <School className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-[15px] text-white tracking-tight block leading-tight">
              Multi-School ERP
            </span>
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block">
              Branch Admin
            </span>
          </div>
        </div>

        {/* Toggle / Close Button */}
        <button 
          onClick={onToggle || (() => setOpen(false))}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Toggle Sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4 font-medium text-[13.5px]">
        <div className="px-5 mb-2 text-[10.5px] uppercase tracking-wider text-slate-500 font-bold">
          Core Operations
        </div>
        
        {links.map((link, idx) => {
          const isOverview = location.pathname === '/' || location.pathname === '/branch-overview' || location.pathname === '/overview' || location.pathname === '/dashboard';
          const isActive = link.path === '/' ? isOverview : location.pathname === link.path;
          return (
            <Link 
              key={idx} 
              to={link.path} 
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between px-5 py-2.5 my-0.5 mx-2 rounded-md transition-all font-medium ${
                isActive 
                  ? 'text-white bg-gradient-to-r from-orange-500/20 to-orange-500/5 border-l-[3px] border-[#fd7e14] font-bold shadow-xs' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${isActive ? 'text-[#fd7e14]' : 'text-slate-400'}`}>{link.icon}</span>
                <span>{link.name}</span>
              </div>
              {link.badge !== undefined && (
                <span className="text-[11px] font-bold px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Reports Expandable Submenu */}
        <div className="mt-2">
          <button 
            onClick={() => setReportsOpen(!reportsOpen)}
            className={`w-full flex items-center justify-between px-5 py-2.5 my-0.5 mx-2 rounded-md font-medium transition-colors ${
              location.pathname.startsWith('/reports') 
                ? 'text-white bg-slate-800/80 font-bold' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={location.pathname.startsWith('/reports') ? 'text-[#fd7e14]' : 'text-slate-400'}>
                <BookOpen className="w-4 h-4" />
              </span>
              <span>Reports & Audit</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform text-slate-500 ${reportsOpen ? 'rotate-90 text-orange-400' : ''}`} />
          </button>
          
          {reportsOpen && (
            <div className="bg-[#070d1e]/80 py-1.5 my-1 mx-2 rounded-lg flex flex-col font-medium border border-slate-800/60">
              {[
                { name: 'Login Logs', path: '/reports/login-logs' },
                { name: 'Schools Usage', path: '/reports/schools-usage' },
                { name: 'Fee Collections', path: '/reports/fee-collections' },
                { name: 'Income & Expense', path: '/reports/income-expense' },
                { name: 'Attendance Trends', path: '/reports/attendance-trends' },
                { name: 'Engagement Audit', path: '/reports/engagement-audit' },
                { name: 'Communications', path: '/reports/communications' }
              ].map((link, idx) => {
                const isSubActive = location.pathname === link.path;
                return (
                  <Link 
                    key={idx} 
                    to={link.path} 
                    onClick={() => setOpen(false)}
                    className={`px-8 py-2 text-[12.5px] transition-colors flex items-center justify-between ${
                      isSubActive 
                        ? 'text-orange-400 bg-orange-500/10 font-bold' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <span>{link.name}</span>
                    <span className={`text-[10px] ${isSubActive ? 'text-orange-400' : 'text-slate-600'}`}>»</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-5 mt-6 mb-2 text-[10.5px] uppercase tracking-wider text-slate-500 font-bold">
          Account Actions
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-5 py-2.5 mx-2 rounded-md font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors focus:outline-none cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Sidebar Footer */}
      <div className="bg-[#070d1e] px-4 py-3 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <p className="text-[10.5px] text-slate-400 font-bold">Branch Network Admin</p>
          <p className="text-[9.5px] text-slate-500">v3.0 • Verified Secure Session</p>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
      </div>
    </div>
  );
};

const Header = ({ onToggle, isDesktopOpen = true, onLogout }) => {
  const navigate = useNavigate();
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('English (US)');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    try {
      const n = branchLocalDb.getNotifications();
      if (Array.isArray(n)) setNotifications(n);
      const p = branchLocalDb.getProfile();
      if (p) setProfile(p);
    } catch (_) {}
  }, []);

  const toggleMenu = (menu) => {
    if (menu === 'lang') { setLangOpen(!langOpen); setNotifOpen(false); setProfileOpen(false); }
    if (menu === 'notif') { setNotifOpen(!notifOpen); setLangOpen(false); setProfileOpen(false); }
    if (menu === 'profile') { setProfileOpen(!profileOpen); setLangOpen(false); setNotifOpen(false); }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchTerm.toLowerCase().trim();
    if (!q) return;

    if (q.includes('branch') || q.includes('school')) navigate('/branches');
    else if (q.includes('pay') || q.includes('sub')) navigate('/payments');
    else if (q.includes('fee') || q.includes('collect')) navigate('/reports/fee-collections');
    else if (q.includes('template') || q.includes('card') || q.includes('cert')) navigate('/templates');
    else if (q.includes('log') || q.includes('audit')) navigate('/reports/login-logs');
    else if (q.includes('income') || q.includes('expense')) navigate('/reports/income-expense');
    else if (q.includes('attend')) navigate('/reports/attendance-trends');
    else navigate('/branches');
    setSearchTerm('');
  };

  const handleMarkAllRead = () => {
    try {
      const updated = branchLocalDb.markAllNotificationsRead();
      if (Array.isArray(updated)) setNotifications(updated);
    } catch (_) {}
  };

  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => n && !n.read).length : 0;

  return (
    <div className="h-[70px] bg-white flex items-center justify-between px-4 sm:px-6 shadow-sm sticky top-0 z-40 border-b border-gray-100">
      
      {/* Left: Mobile Toggle & Fast Navigation Search */}
      <div className="flex items-center gap-3">
        <button 
          className="text-gray-600 hover:text-orange-600 p-2 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer flex items-center justify-center border border-gray-200/80 shadow-3xs" 
          onClick={onToggle}
          title={isDesktopOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative items-center">
          <input 
            type="text" 
            placeholder="Search branches, fees, templates..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#f3f7f9] text-[13px] border border-gray-200/80 rounded-md pl-4 pr-10 py-1.5 w-64 md:w-80 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
          />
          <button 
            type="submit"
            className="absolute right-3 text-gray-400 hover:text-orange-500 focus:outline-none cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Right Controls: Language, Notifications & Profile */}
      <div className="flex items-center gap-4 relative">
        
        {/* Language Selector */}
        <div className="relative">
          <div 
            onClick={() => toggleMenu('lang')}
            className={`flex items-center gap-1.5 cursor-pointer px-2.5 py-1.5 rounded-md hover:bg-gray-50 text-[13px] font-semibold transition-colors ${langOpen ? 'text-[#fd7e14]' : 'text-gray-600'}`}
          >
            <Globe className="w-4 h-4" />
            <span className="hidden md:inline">{currentLang}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
          </div>

          {langOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-md shadow-lg py-1.5 z-50">
              {['English (US)', 'Hindi (हिन्दी)', 'Spanish (Español)', 'French (Français)'].map((lang) => (
                <div 
                  key={lang}
                  onClick={() => { setCurrentLang(lang); setLangOpen(false); }}
                  className={`px-4 py-2 text-[12.5px] cursor-pointer transition-colors ${currentLang === lang ? 'bg-orange-50 text-orange-600 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {lang}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Notifications Dropdown */}
        <div className="relative">
          <div 
            onClick={() => toggleMenu('notif')}
            className={`relative cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors ${notifOpen ? 'text-[#fd7e14]' : 'text-gray-600'}`}
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </div>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-100 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col">
              <div className="px-4 py-3 bg-[#f8f9fa] border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[13.5px] text-gray-800">Branch Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-red-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <span 
                    onClick={handleMarkAllRead} 
                    className="text-[11px] text-orange-600 hover:underline cursor-pointer font-bold"
                  >
                    Mark all read
                  </span>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                {(Array.isArray(notifications) ? notifications : []).map((n) => (
                  <div key={n.id} className={`p-3.5 hover:bg-gray-50/80 cursor-pointer transition-colors ${!n.read ? 'bg-orange-50/30' : ''}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold uppercase text-orange-600 bg-orange-100/60 px-1.5 py-0.2 rounded">
                        {n.tag}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">{n.time}</span>
                    </div>
                    <div className="text-[13px] font-bold text-gray-800 leading-snug">{n.title}</div>
                    <div className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{n.desc}</div>
                  </div>
                ))}
              </div>
              <div className="p-2.5 text-center border-t border-gray-100 text-[12px] text-orange-600 font-bold hover:bg-gray-50 cursor-pointer transition-colors">
                All Systems Normal
              </div>
            </div>
          )}
        </div>
        
        {/* User Profile Dropdown */}
        <div className="relative">
          <div 
            onClick={() => toggleMenu('profile')}
            className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:ring-2 hover:ring-orange-500/30 transition-all"
          >
            <img 
              src={profile?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"}
              alt="Admin"
              className="w-8 h-8 rounded-full object-cover border border-orange-200"
            />
          </div>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-100 rounded-lg shadow-xl py-1.5 z-50">
              <div className="px-4 py-3 border-b border-gray-50 mb-1 bg-gray-50/50">
                <div className="font-bold text-[14px] text-gray-900 leading-tight">{profile?.name || 'Branch General Manager'}</div>
                <div className="text-[11.5px] text-gray-500 truncate mt-0.5">{profile?.email || 'admin@branch.com'}</div>
                <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                  {profile?.role || 'Branch Admin'}
                </span>
              </div>
              <Link 
                to="/profile" 
                onClick={() => setProfileOpen(false)} 
                className="flex items-center gap-2 px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors"
              >
                <User className="w-4 h-4 text-gray-400" /> My Profile & Security
              </Link>
              <div className="border-t border-gray-100 my-1"></div>
              <div 
                onClick={onLogout} 
                className="flex items-center gap-2 px-4 py-2 text-[13px] text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const App = () => {
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('branch_admin_sidebar_open');
      return saved !== null ? saved === 'true' : true;
    } catch (_) {
      return true;
    }
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      authService.ensureDemoSession();
    } catch (_) {}
    return true;
  });

  useEffect(() => {
    try {
      localStorage.setItem('branch_admin_sidebar_open', String(desktopSidebarOpen));
    } catch (_) {}
  }, [desktopSidebarOpen]);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileSidebarOpen(prev => !prev);
    } else {
      setDesktopSidebarOpen(prev => !prev);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Sign Out?',
      text: "You will be logged out of the Branch Admin Network.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#fd7e14',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, sign out'
    }).then((result) => {
      if (result.isConfirmed) {
        authService.logout();
        setIsAuthenticated(false);
        Swal.fire({
          icon: 'success',
          title: 'Signed Out',
          text: 'You have been safely signed out.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="flex h-screen overflow-hidden bg-[#f4f7fa]">
          <Sidebar 
            isOpen={mobileSidebarOpen} 
            isDesktopOpen={desktopSidebarOpen}
            setOpen={setMobileSidebarOpen} 
            onToggle={handleToggleSidebar}
            onLogout={handleLogout} 
          />
          
          {/* Mobile Sidebar Overlay */}
          {mobileSidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" onClick={() => setMobileSidebarOpen(false)} />
          )}

          <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${desktopSidebarOpen ? 'md:ml-[240px]' : 'md:ml-0'}`}>
            <Header onToggle={handleToggleSidebar} isDesktopOpen={desktopSidebarOpen} onLogout={handleLogout} />
            
            <main className="flex-1 overflow-y-auto bg-[#f4f7fa]">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/overview" element={<Dashboard />} />
                <Route path="/branch-overview" element={<Dashboard />} />
                <Route path="/branch_overview" element={<Dashboard />} />
                <Route path="/branches-overview" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/branches" element={<Branches />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/reports/login-logs" element={<LoginLogs />} />
                <Route path="/reports/schools-usage" element={<SchoolsUsage />} />
                <Route path="/reports/fee-collections" element={<FeeCollections />} />
                <Route path="/reports/income-expense" element={<IncomeExpense />} />
                <Route path="/reports/attendance-trends" element={<AttendanceTrends />} />
                <Route path="/reports/engagement-audit" element={<EngagementAudit />} />
                <Route path="/reports/communications" element={<CommunicationsReport />} />
                {/* Fallback to Dashboard to avoid any dead ends */}
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;

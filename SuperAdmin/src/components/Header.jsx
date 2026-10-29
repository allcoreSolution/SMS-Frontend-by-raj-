import React, { useState, useRef, useEffect } from 'react';
import { Menu, Settings, Globe, Bell, Search, ChevronDown, Sparkles, X, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { tenantService } from '../api/tenantService';
import { toArray } from '../utils/helpers';

const allPages = [
  { label: 'Schools', path: '/schools' },
  { label: 'Dashboard', path: '/' },
  { label: 'Plans', path: '/plans' },
  { label: 'Payments', path: '/payments' },
  { label: 'Reports', path: '/reports' },
  { label: 'Team', path: '/team' },
  { label: 'Support', path: '/support' },
  { label: 'Settings', path: '/settings-center' },
  { label: 'Server Health', path: '/server' },
  { label: 'Blog', path: '/blog/posts' },
  { label: 'Landing Page', path: '/landing-page' },
  { label: 'AI Analytics', path: '/ai-analytics' },
  { label: 'Backup Center', path: '/backup-center' },
  { label: 'Storage Center', path: '/storage-center' },
  { label: 'Cron Monitor', path: '/cron-monitor' },
  { label: 'API Docs', path: '/api-docs' },
  { label: 'Profile', path: '/profile' },
];

const Header = ({ onMenuClick, sidebarOpen = true }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const { lang, code, setLanguage, languages } = useLanguage();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  const searchResults = searchQuery.trim().length > 0
    ? allPages.filter(p => p.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') { setShowSearch(false); setSearchQuery(''); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSelect = (path) => {
    navigate(path);
    setShowSearch(false);
    setSearchQuery('');
  };

  const [notifications, setNotifications] = useState([]);

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Recently';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const fetchRealNotifications = async () => {
    try {
      const [tenantsRes, ticketsRes] = await Promise.allSettled([
        tenantService.getTenants(),
        tenantService.getAllTickets()
      ]);

      const items = [];

      // 1. Real registered schools
      if (tenantsRes.status === 'fulfilled' && tenantsRes.value?.data) {
        const schools = toArray(tenantsRes.value);
        schools.forEach((t) => {
          items.push({
            id: `school-${t._id}`,
            title: `School: ${t.schoolName}`,
            desc: `${t.email || 'N/A'} • ${t.plan || 'Basic'} Plan • ${t.status || 'Active'}`,
            time: formatTimeAgo(t.createdAt),
            dot: t.status === 'Active' ? 'bg-emerald-500' : 'bg-orange-500',
            link: '/schools'
          });
        });
      }

      // 2. Real support tickets
      if (ticketsRes.status === 'fulfilled' && ticketsRes.value?.data && Array.isArray(ticketsRes.value.data)) {
        ticketsRes.value.data.forEach((t) => {
          items.push({
            id: `ticket-${t._id}`,
            title: `Ticket: ${t.title || 'Inquiry'}`,
            desc: `${t.schoolId?.schoolName || 'School'} • Priority: ${t.priority || 'Normal'}`,
            time: formatTimeAgo(t.createdAt),
            dot: 'bg-indigo-500',
            link: '/support'
          });
        });
      }

      setNotifications(items);
    } catch (err) {
      console.warn('SuperAdmin notifications fetch error:', err);
    }
  };

  useEffect(() => {
    fetchRealNotifications();
  }, []);

  return (
    <header className={`h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 left-0 transition-all duration-300 ease-in-out z-20 shadow-xs ${sidebarOpen ? 'lg:left-64' : 'lg:left-0'}`}>

      {/* Left */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick} 
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search bar */}
        <div
          onClick={() => { setShowSearch(true); setTimeout(() => searchRef.current?.focus(), 50); }}
          className="hidden md:flex items-center gap-2 bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2 w-72 cursor-pointer hover:border-orange-400 hover:bg-white transition-all group shadow-3xs">
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500 transition-colors" />
          <span className="text-xs text-slate-400 font-medium">Quick search modules, schools...</span>
          <div className="ml-auto flex items-center gap-1">
            <kbd className="text-[10px] bg-slate-200/70 text-slate-500 px-1.5 py-0.5 rounded-md font-mono font-semibold">⌘K</kbd>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-start justify-center pt-24" onClick={() => { setShowSearch(false); setSearchQuery(''); }}>
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-lg mx-4 overflow-hidden animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100">
              <Search className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Type to search platform features..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && searchResults.length > 0) handleSelect(searchResults[0].path); }}
                className="flex-1 text-sm font-semibold outline-none text-slate-800 placeholder-slate-400"
                autoFocus
              />
              <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            {searchResults.length > 0 ? (
              <ul className="py-2 max-h-72 overflow-y-auto">
                {searchResults.map((r, i) => (
                  <li key={i}>
                    <button onClick={() => handleSelect(r.path)}
                      className="w-full text-left px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-3 transition-colors">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      {r.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : searchQuery.trim() ? (
              <div className="px-4 py-8 text-center text-xs font-medium text-slate-400">No pages found for "{searchQuery}"</div>
            ) : (
              <div className="px-5 py-4 bg-slate-50/50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Popular Quick Access</p>
                <div className="flex flex-wrap gap-2">
                  {allPages.slice(0, 8).map((p, i) => (
                    <button key={i} onClick={() => handleSelect(p.path)}
                      className="text-xs font-semibold bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 text-slate-700 px-3 py-1.5 rounded-xl transition-all shadow-3xs">
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Language */}
        <div className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => setShowLang(s => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors text-xs font-semibold"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span data-no-translate>{code.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          {showLang && (
            <div className="absolute right-0 top-11 w-48 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 py-1.5 overflow-hidden">
              {languages.map(l => (
                <button
                  key={l.code}
                  type="button"
                  data-no-translate
                  onClick={() => { setLanguage(l.name); setShowLang(false); }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-orange-50 flex items-center justify-between ${lang === l.name ? 'font-bold text-orange-600' : 'text-slate-700'}`}
                >
                  <span>{l.name}</span>
                  {l.native && <span className="text-[11px] text-slate-400">{l.native}</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(s => !s)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            title="Platform Notifications"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-scale-up">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Platform Alerts</p>
                <span className="text-[10px] bg-orange-50 text-orange-600 font-bold px-2.5 py-0.5 rounded-full border border-orange-200">
                  {notifications.length} {notifications.length === 1 ? 'alert' : 'alerts'}
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 font-medium">
                    No new platform alerts
                  </div>
                ) : (
                  notifications.map((n, i) => (
                    <div
                      key={n.id || i}
                      onClick={() => {
                        setShowNotif(false);
                        if (n.link) navigate(n.link);
                      }}
                      className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3"
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800">{n.title}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{n.desc}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2.5 border-t border-slate-100 text-center bg-slate-50/50">
                <button
                  onClick={() => { setShowNotif(false); navigate('/schools'); }}
                  className="text-xs text-orange-600 font-bold hover:underline cursor-pointer">
                  Manage schools & alerts →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          onClick={() => navigate('/settings-center')}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors">
          <Settings className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* User */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-xl hover:bg-slate-100 transition-colors group">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0 uppercase shadow-md shadow-orange-500/20"
              style={{ background: 'linear-gradient(135deg, #ff5c0a, #ff8c55)' }}>
              {user?.name ? user.name.slice(0, 2) : 'SA'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'Super Admin'}</p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] text-orange-600 font-bold">Platform Owner</p>
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-scale-up">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                 <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Super Admin'}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user?.email || 'superadmin@erp.com'}</p>
                 </div>
              </div>
              <div className="py-1">
                <button onClick={() => { setShowUserMenu(false); navigate('/profile'); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2.5">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" /> My Profile
                </button>
                <button onClick={() => { setShowUserMenu(false); navigate('/settings-center'); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2.5">
                  <Settings className="w-3.5 h-3.5 text-slate-400" /> Settings Center
                </button>
                <div className="border-t border-slate-100 my-1"></div>
                <button onClick={() => { setShowUserMenu(false); logout(); navigate('/login'); }} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2.5">
                  <LogOut className="w-3.5 h-3.5 text-red-500" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close notif or userMenu */}
      {(showNotif || showUserMenu || showLang) && <div className="fixed inset-0 z-40" onClick={() => { setShowNotif(false); setShowUserMenu(false); setShowLang(false); }} />}
    </header>
  );
};

export default Header;

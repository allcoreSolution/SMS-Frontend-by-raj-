import React, { useState, useRef, useEffect } from 'react';
import { Menu, Settings, Globe, Bell, Search, ChevronDown, Sparkles, X, LogOut, User as UserIcon, ShieldCheck, ShoppingBag } from 'lucide-react';
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
  { label: 'License Orders', path: '/license-orders' },
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
      if (e.key === 'Escape') { 
        setShowSearch(false); 
        setSearchQuery('');
        setShowUserMenu(false);
        setShowNotif(false);
        setShowLang(false);
      }
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

  const displayName = user?.name || user?.username || 'Super Admin';
  const displayEmail = user?.email || 'superadmin@erp.com';
  const avatarInitials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'SA';

  return (
    <>
      <header 
        className={`h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-3 sm:px-4 md:px-6 fixed top-0 right-0 left-0 transition-all duration-300 ease-in-out z-30 shadow-xs ${sidebarOpen ? 'lg:left-64' : 'lg:left-0'}`}
        style={{
          paddingRight: 'max(0.75rem, env(safe-area-inset-right))',
          paddingLeft: 'max(0.75rem, env(safe-area-inset-left))'
        }}
      >

        {/* Left */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            type="button"
            onClick={onMenuClick} 
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer active:scale-95"
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

        {/* Right */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto pr-0.5 sm:pr-1">

          {/* Language Switcher */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => { setShowLang(s => !s); setShowNotif(false); setShowUserMenu(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors text-xs font-semibold cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span data-no-translate>{code.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {showLang && (
              <div className="absolute right-0 top-11 w-48 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 py-1.5 overflow-hidden animate-scale-up">
                {languages.map(l => (
                  <button
                    key={l.code}
                    type="button"
                    data-no-translate
                    onClick={() => { setLanguage(l.name); setShowLang(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-orange-50 flex items-center justify-between cursor-pointer ${lang === l.name ? 'font-bold text-orange-600 bg-orange-50/50' : 'text-slate-700'}`}
                  >
                    <span>{l.name}</span>
                    {l.native && <span className="text-[11px] text-slate-400">{l.native}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Center */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setShowNotif(s => !s); setShowUserMenu(false); setShowLang(false); }}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer active:scale-95"
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

          {/* Settings Center Button */}
          <button
            type="button"
            onClick={() => navigate('/settings-center')}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer active:scale-95"
            title="Settings Center"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-slate-200 mx-1" />

          {/* User Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setShowUserMenu(s => !s); setShowNotif(false); setShowLang(false); }}
              className="flex items-center gap-2 pl-1 sm:pl-1.5 pr-1.5 sm:pr-2.5 py-1 rounded-xl hover:bg-slate-100 transition-colors group cursor-pointer active:scale-95 select-none"
              title="SuperAdmin Profile Menu"
            >
              {/* User Avatar */}
              <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 shadow-sm ring-1 ring-orange-500/20 bg-slate-100 flex items-center justify-center">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={displayName} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center text-white text-xs font-black uppercase shadow-md shadow-orange-500/20"
                    style={{ background: 'linear-gradient(135deg, #ff5c0a, #ff8c55)' }}
                  >
                    {avatarInitials}
                  </div>
                )}
              </div>

              {/* User Name & Role (Desktop) */}
              <div className="hidden md:block text-left shrink-0">
                <p className="text-xs font-bold text-slate-800 leading-tight max-w-[120px] truncate">{displayName}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-[10px] text-orange-600 font-bold">Platform Owner</p>
                </div>
              </div>

              <ChevronDown className={`w-3 h-3 text-slate-400 hidden md:block shrink-0 transition-transform ${showUserMenu ? 'rotate-180 text-orange-500' : ''}`} />
            </button>
            
            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 animate-scale-up">
                {/* User Header Info Card */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-orange-50/30">
                   <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-xs ring-1 ring-orange-500/30">
                     {user?.avatar ? (
                       <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
                     ) : (
                       <div 
                         className="w-full h-full flex items-center justify-center text-white text-xs font-black uppercase"
                         style={{ background: 'linear-gradient(135deg, #ff5c0a, #ff8c55)' }}
                       >
                         {avatarInitials}
                       </div>
                     )}
                   </div>
                   <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-slate-900 truncate">{displayName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{displayEmail}</p>
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-orange-600 bg-orange-100/70 px-1.5 py-0.5 rounded mt-1 uppercase tracking-wider">
                        <ShieldCheck className="w-2.5 h-2.5" /> Root SuperAdmin
                      </span>
                   </div>
                </div>

                {/* Dropdown Action Items */}
                <div className="p-1.5 space-y-0.5 text-xs">
                  <button 
                    type="button"
                    onClick={() => { setShowUserMenu(false); navigate('/profile'); }} 
                    className="w-full text-left px-3 py-2 rounded-xl font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-orange-500" />
                    <span>My Profile & Settings</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => { setShowUserMenu(false); navigate('/license-orders'); }} 
                    className="w-full text-left px-3 py-2 rounded-xl font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShoppingBag className="w-4 h-4 text-amber-500" />
                      <span>License Orders</span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">₹10K</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => { setShowUserMenu(false); navigate('/settings-center'); }} 
                    className="w-full text-left px-3 py-2 rounded-xl font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Settings Center</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button 
                    type="button"
                    onClick={() => { setShowUserMenu(false); logout(); navigate('/login'); }} 
                    className="w-full text-left px-3 py-2 rounded-xl font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Logout Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </header>

      {/* Global backdrop for dropdowns */}
      {(showNotif || showUserMenu || showLang) && (
        <div 
          className="fixed inset-0 z-25 bg-transparent" 
          onClick={() => { 
            setShowNotif(false); 
            setShowUserMenu(false); 
            setShowLang(false); 
          }} 
        />
      )}

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-start justify-center pt-20 px-4" onClick={() => { setShowSearch(false); setSearchQuery(''); }}>
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100">
              <Search className="w-4 h-4 text-orange-500 shrink-0" />
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
                      className="text-xs font-semibold bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 text-slate-700 px-3 py-1.5 rounded-xl transition-all shadow-3xs cursor-pointer">
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

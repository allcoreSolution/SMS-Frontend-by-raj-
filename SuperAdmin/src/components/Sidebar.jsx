import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search, LayoutDashboard, User, Building2, Layers,
  Users, LayoutTemplate, BarChart3,
  Settings, FileText, LifeBuoy, Server,
  MonitorPlay, Rss, BookOpen, BrainCircuit, LayoutList,
  LogOut, ChevronDown, ChevronLeft, Sparkles, Zap, Bell, X, Puzzle, CreditCard, Wallet, Plug,
  Megaphone, Headset, Landmark, ShieldCheck
} from 'lucide-react';

const navSections = [
  {
    label: 'PLATFORM',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard', color: '#fb923c', bg: 'rgba(251,146,60,0.15)' },
      { to: '/profile', icon: User, label: 'My Profile', color: '#f472b6', bg: 'rgba(244,114,182,0.15)' },
      { to: '/schools', icon: Building2, label: 'Schools', color: '#818cf8', bg: 'rgba(129,140,248,0.15)' },
      { to: '/plans', icon: Layers, label: 'Plans', color: '#2dd4bf', bg: 'rgba(45,212,191,0.15)' },
      { to: '/plan-addons', icon: Puzzle, label: 'Plan Add-ons', color: '#fb923c', bg: 'rgba(251,146,60,0.15)' },
      { to: '/team', icon: Users, label: 'Team', color: '#f472b6', bg: 'rgba(244,114,182,0.15)' },
      { to: '/payments', icon: CreditCard, label: 'Payments', color: '#4ade80', bg: 'rgba(74,222,128,0.15)' },
      { to: '/templates', icon: LayoutTemplate, label: 'Templates', color: '#c084fc', bg: 'rgba(192,132,252,0.15)' },
      {
        icon: BarChart3, label: 'Reports', color: '#60a5fa', bg: 'rgba(96,165,250,0.15)',
        children: [
          { to: '/reports/login-logs', label: 'Login Logs' },
          { to: '/reports/schools-usage', label: 'Schools Usage' },
          { to: '/reports/fee-collections', label: 'Fee Collections' },
          { to: '/reports/attendance-trends', label: 'Attendance Trends' },
          { to: '/reports/engagement-audit', label: 'Engagement Audit' },
          { to: '/reports/communications', label: 'Communications' },
          { to: '/reports', label: 'Platform Reports' },
          { to: '/schools-report', label: 'Schools Report' },
          { to: '/attendance-report', label: 'Attendance Report' }
        ]
      },
      {
        icon: Settings, label: 'Settings', color: '#4ade80', bg: 'rgba(74,222,128,0.15)',
        children: [
          { to: '/settings-center', label: 'Settings Center' },
          { to: '/settings-general', label: 'General' },
          { to: '/settings-menu', label: 'Menu Builder' },
          { to: '/settings-payments', label: 'Payments' },
          { to: '/settings-sms', label: 'SMS' },
          { to: '/settings-notifications', label: 'Notifications' },
          { to: '/settings-appearance', label: 'Appearance' },
          { to: '/settings-branding', label: 'App Branding' },
          { to: '/settings-registration', label: 'Registration & Security' },
          { to: '/settings-subscriptions', label: 'Subscriptions' },
          { to: '/settings-whatsapp', label: 'WhatsApp Gateway' },
          { to: '/settings-mail-smtp', label: 'Mail / SMTP' },
          { to: '/settings-telegram', label: 'Telegram Bot' },
          { to: '/settings-login-designs', label: 'Login Page Designs' },
          { to: '/settings-face-vectors', label: 'Face Vectors' }
        ]
      },
      {
        icon: Wallet, label: 'Comms Wallet', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)',
        children: [
          { to: '/comms/wallets', label: 'Wallet Oversight' },
          { to: '/comms/rate-cards', label: 'Rate Cards' },
          { to: '/comms/meta-dlt', label: 'Meta / DLT Config' }
        ]
      },
      {
        icon: Landmark, label: 'Billing & Gateways', color: '#22d3ee', bg: 'rgba(34,211,238,0.15)',
        children: [
          { to: '/payment-gateways', label: 'Payment Gateways' },
          { to: '/comms-rates', label: 'Comms Rates' },
          { to: '/sms-gateways', label: 'SMS Gateways' },
          { to: '/sms-report', label: 'SMS Report' }
        ]
      },
      { to: '/api-docs', icon: Plug, label: 'API Docs', color: '#f87171', bg: 'rgba(248,113,113,0.15)' },
      { to: '/support', icon: Headset, label: 'Support Tickets', color: '#9333ea', bg: 'rgba(147,51,234,0.15)' },
      {
        icon: Server, label: 'Server & Health', color: '#06b6d4', bg: 'rgba(6,182,212,0.15)',
        children: [
          { to: '/server',           label: 'Server Health' },
          { to: '/storage-center',   label: 'Storage' },
          { to: '/backup-center',    label: 'Backups' },
          { to: '/software-updates', label: 'Software Updates' },
          { to: '/server-settings',  label: 'Server Settings' },
          { to: '/cron-monitor',     label: 'Cron Monitor' },
          { to: '/infrastructure',   label: 'Infrastructure' }
        ]
      },
      {
        icon: ShieldCheck, label: 'Admin Tools', color: '#f87171', bg: 'rgba(248,113,113,0.15)',
        children: [
          { to: '/master-menus', label: 'Master Menus' },
          { to: '/alerts', label: 'Alerts & Notifications' },
          { to: '/login-report', label: 'Login Report' },
          { to: '/engagement-report', label: 'Engagement Report' },
          { to: '/theme-engine', label: 'Theme Engine' },
          { to: '/notifications', label: 'Notifications Inbox' }
        ]
      }
    ]
  },
  {
    label: 'WEBSITE',
    items: [
      {
        icon: Megaphone, label: 'Landing Page', color: '#f472b6', bg: 'rgba(244,114,182,0.15)',
        children: [
          { to: '/landing-templates', label: 'Landing Templates' },
          { to: '/landing-page/visual-builder', label: 'Visual Builder' },
          { to: '/landing-page/full-templates', label: 'Full Templates' },
          { to: '/website-pages', label: 'Pages' },
          { to: '/website-menu', label: 'Navigation & Footer' },
          { to: '/sitemap', label: 'Sitemap' },
          { to: '/landing-page/school-templates', label: 'School Site Templates' },
          { to: '/landing-page/preview', label: 'Preview Site' }
        ]
      }
    ]
  },
  {
    label: 'AI & CONTENT',
    items: [
      {
        icon: Rss, label: 'Blog', color: '#a855f7', bg: 'rgba(168,85,247,0.15)',
        children: [
          { to: '/blog/posts', label: 'Posts' },
          { to: '/blog/categories', label: 'Categories' }
        ]
      },
      {
        icon: BookOpen, label: 'Knowledge Base', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)',
        children: [
          { to: '/knowledge-base/articles', label: 'Articles' },
          { to: '/knowledge-base/categories', label: 'Categories' }
        ]
      },
      {
        icon: BrainCircuit, label: 'AI Management', color: '#22c55e', bg: 'rgba(34,197,94,0.15)',
        children: [
          { to: '/ai-analytics', label: 'Analytics' },
          { to: '/settings-ai-mgmt', label: 'Configuration' },
          { to: '/content-safety', label: 'Content Safety' },
          { to: '/canvas-designer', label: 'Canvas Designer' },
          { to: '/app-distribution', label: 'App Distribution' }
        ]
      },
      { to: '/onboarding-templates', icon: LayoutList, label: 'Onboarding Templates', color: '#eab308', bg: 'rgba(234,179,8,0.15)' }
    ]
  },
  {
    label: 'ACCOUNT',
    items: []
  }
];

const NavItem = ({ item, onClose, isOpen, onToggle }) => {
  const location = useLocation();
  const isChildActive = item.children?.some(c => location.pathname === c.to || (c.to !== '/' && location.pathname.startsWith(c.to + '/')));

  if (item.children) {
    return (
      <li className="mb-0.5">
        <button
          onClick={onToggle}
          className={`w-full flex items-center justify-between px-3 py-2 -ml-3 relative transition-all duration-200 border-l-[3px] rounded-r-xl ` +
            (isChildActive ? 'text-white shadow-xs font-bold' : 'text-slate-300 hover:text-white hover:bg-white/5 border-transparent')
          }
          style={isChildActive ? { backgroundColor: item.bg || 'rgba(255,92,10,0.15)', borderColor: item.color || '#ff5c0a' } : {}}
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 relative z-10 pl-3">
              <item.icon className="w-4 h-4 pointer-events-none transition-colors" style={{ color: isChildActive ? (item.color || '#ff5c0a') : 'inherit', filter: isChildActive ? `drop-shadow(0 0 6px ${item.color || '#ff5c0a'}80)` : 'none' }} />
            </div>
            <span className={`text-[13px] tracking-wide relative z-10 pl-1 ${isChildActive ? 'font-bold text-white' : 'font-medium'}`}>{item.label}</span>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-orange-400' : 'text-gray-400'}`} />
        </button>
        {isOpen && (
          <ul className="mt-1.5 mb-2 ml-11 space-y-1 pr-3">
            {item.children.map((child, i) => (
              <li key={i}>
                <NavLink to={child.to} onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-xl text-[12px] transition-all duration-200 cursor-pointer ` +
                    (isActive 
                      ? 'text-white font-bold bg-gradient-to-r from-orange-500/25 to-orange-500/10 shadow-[inset_0_1px_rgba(255,255,255,0.1)] border-l-2 border-orange-400' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium')
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`w-1.5 h-1.5 rounded-full mr-3 transition-colors ${isActive ? 'bg-orange-400 opacity-100' : 'opacity-0'}`} />
                      <span className="tracking-wide relative -left-1">{child.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li className="mb-0.5">
      <NavLink to={item.to} end={item.to === '/'} onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 -ml-3 relative transition-all duration-200 border-l-[3px] rounded-r-xl ` +
          (isActive 
            ? 'text-white shadow-xs font-bold' 
            : 'text-slate-300 hover:text-white hover:bg-white/5 border-transparent')
        }
        style={({ isActive }) => isActive ? { backgroundColor: item.bg || 'rgba(255,92,10,0.15)', borderColor: item.color || '#ff5c0a' } : {}}
      >
        {({ isActive }) => (
          <>
            <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 relative z-10 pl-3">
              <item.icon className="w-4 h-4 pointer-events-none transition-colors" style={{ color: isActive ? (item.color || '#ff5c0a') : 'inherit', filter: isActive ? `drop-shadow(0 0 6px ${item.color || '#ff5c0a'}80)` : 'none' }} />
            </div>
            <span className={`text-[13px] tracking-wide relative z-10 pl-1 ${isActive ? 'font-bold text-white' : 'font-medium'}`}>{item.label}</span>
          </>
        )}
      </NavLink>
    </li>
  );
};

const Sidebar = ({ open, desktopOpen = true, mobileOpen = false, onClose, onToggleDesktop }) => {
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [openSection, setOpenSection] = useState('PLATFORM');
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    for (const section of navSections) {
      for (const item of section.items) {
        if (item.to && (location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to + '/')))) {
          setOpenSection(section.label);
          setOpenSubmenu(null);
          return;
        }
        if (item.children && item.children.some(c => location.pathname === c.to || (c.to !== '/' && location.pathname.startsWith(c.to + '/')))) {
          setOpenSection(section.label);
          setOpenSubmenu(item.label);
          return;
        }
      }
    }
  }, [location.pathname]);

  const toggleSection = (label) => {
    setOpenSection(prev => prev === label ? null : label);
  };

  const toggleSubmenu = (label) => {
    setOpenSubmenu(prev => prev === label ? null : label);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const flatItems = navSections.flatMap(s => s.items).flatMap(item =>
    item.children
      ? item.children.map(c => ({ ...c, icon: item.icon, color: item.color, bg: item.bg }))
      : [item]
  );

  const filteredItems = search
    ? flatItems.filter(item => item.label?.toLowerCase().includes(search.toLowerCase()))
    : null;

  const isMobileVisible = mobileOpen ?? open;

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen w-64 z-30 flex flex-col overflow-hidden
        transition-transform duration-300 ease-in-out bg-[#131927] border-r border-[#1e2638] shadow-2xl
        ${isMobileVisible ? 'translate-x-0' : '-translate-x-full'}
        ${desktopOpen ? 'lg:translate-x-0' : 'lg:-translate-x-full'}
      `}
    >
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,92,10,0.6), transparent)' }} />

      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-3.5 flex-shrink-0 border-b border-[#1e2638] bg-[#0f1420]/80 backdrop-blur-sm">
        <NavLink 
          to="/" 
          onClick={onClose}
          className="flex items-center gap-2.5 min-w-0 group cursor-pointer"
          title="Multi-School ERP - Platform Owner Dashboard"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#ff5c0a] to-[#ff8c55] flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-500/20 ring-1 ring-orange-500/40 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold text-[13px] tracking-tight truncate leading-none group-hover:text-orange-400 transition-colors">
                Multi-School ERP
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 leading-none">
                PRO
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide leading-none truncate">
                v3.7 • Platform Owner
              </span>
            </div>
          </div>
        </NavLink>

        {/* Action Toggle / Close Button */}
        <div className="flex items-center flex-shrink-0 ml-1">
          {/* Close button — mobile */}
          <button 
            onClick={onClose} 
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Menu"
          >
            <X className="w-4 h-4" />
          </button>
          {/* Collapse button — desktop */}
          <button 
            onClick={onToggleDesktop || onClose} 
            className="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
          <input
            type="search"
            name="sidebar_search_menu"
            autoComplete="off"
            placeholder="Search menu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full text-xs font-semibold text-gray-200 placeholder-gray-500 pl-8 pr-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all bg-white/[0.04]"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 min-h-0 px-3 pb-3 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {filteredItems ? (
          <div className="mb-2">
            <p className="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Results</p>
            <ul className="space-y-0.5">
              {filteredItems.length > 0
                ? filteredItems.map((item, i) => item.to && <NavItem key={i} item={item} onClose={onClose} />)
                : <li className="px-3 py-2 text-xs text-gray-500">No results found</li>
              }
            </ul>
          </div>
        ) : (
          navSections.map((section, si) => {
            const isSectionOpen = !!search.trim() || openSection === section.label;
            return (
              <div key={si} className="mb-3">
                <button
                  type="button"
                  onClick={() => toggleSection(section.label)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400/80 hover:text-white transition-colors cursor-pointer group rounded-lg hover:bg-white/5 my-0.5"
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isSectionOpen ? 'bg-[#ff5c0a]' : 'bg-slate-600 group-hover:bg-slate-400'}`} />
                    {section.label}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isSectionOpen ? 'rotate-180 text-orange-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                </button>
                <div className={`grid transition-all duration-300 ease-in-out ${isSectionOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
                  <div className="overflow-hidden">
                    {section.label.toUpperCase() === 'ACCOUNT' ? (
                      <ul className="space-y-0.5 pt-1">
                        <li>
                          <button onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                              <LogOut className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold">Logout</span>
                          </button>
                        </li>
                      </ul>
                    ) : (
                      <ul className="space-y-0.5 pt-1">
                        {section.items.map((item, i) => (
                          <NavItem 
                            key={i} 
                            item={item} 
                            onClose={onClose} 
                            isOpen={openSubmenu === item.label || !!search.trim()}
                            onToggle={() => toggleSubmenu(item.label)}
                          />
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Developer Branding & Attribution Footer (Scrollable with menu, exactly like Teacher Panel) */}
        <div className="mt-6 mb-2 pt-3 border-t border-white/10 px-1 text-center">
          <div className="bg-gradient-to-r from-slate-900/90 via-slate-800/60 to-slate-900/90 rounded-xl p-2.5 border border-white/10 shadow-xs hover:border-[#ff5c0a]/40 transition-colors">
            <p className="text-[11px] font-bold text-slate-300 tracking-wide mb-0.5">
              &copy; 2026 School ERP
            </p>
            <p className="text-[10px] font-medium text-slate-400 leading-tight">
              Developed by <span className="text-white font-bold">RAJ YADAV</span> <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent font-bold">@ALLCORE SOLUTION</span>
            </p>
          </div>
        </div>
      </nav>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,92,10,0.4), transparent)' }} />
    </aside>
  );
};

export default Sidebar;

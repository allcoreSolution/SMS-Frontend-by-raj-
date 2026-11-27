import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  Gauge, UserCircle2, HandCoins, Send, Users, 
  HandHeart, FileSearch, UserPlus, Layers, Tags, 
  ArrowDown, ArrowUp, Tag, Filter, LogOut, ChevronLeft, ChevronDown, Search, X, Settings as SettingsIcon,
  ShieldCheck
} from 'lucide-react';

const NavItem = ({ to, icon: Icon, label, iconColor, subItems, closeSidebar, isOpen, onToggle }) => {
  const isDropdown = subItems && subItems.length > 0;
  
  if (isDropdown) {
    return (
      <li className="my-0.5">
        <div 
          onClick={onToggle}
          className={`flex items-center justify-between mx-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isOpen ? 'bg-[#ff5c0a]/15 text-[#ff5c0a]' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}`}
        >
          <div className="flex items-center gap-3">
            <Icon className={`w-4 h-4 ${isOpen ? 'text-[#ff5c0a]' : iconColor}`} />
            <span>{label}</span>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#ff5c0a]' : 'text-slate-400'}`} />
        </div>
        {isOpen && (
          <ul className="bg-slate-900/60 rounded-xl mx-2.5 my-1 py-1.5 space-y-0.5 border border-slate-800/60">
            {subItems.map((item, idx) => (
              <li key={idx}>
                <NavLink 
                  to={item.to} 
                  onClick={closeSidebar}
                  className={({isActive}) => `flex items-center gap-2.5 pl-6 py-2 rounded-lg mx-1.5 text-xs transition-colors ${isActive ? 'bg-[#ff5c0a] text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                >
                  <span className="text-[10px] opacity-70">»</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li className="my-0.5">
      <NavLink 
        to={to} 
        onClick={closeSidebar}
        className={({isActive}) => `flex items-center justify-between mx-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive ? 'bg-gradient-to-r from-[#ff5c0a] to-[#ff7a29] text-white shadow-md shadow-orange-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'}`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </div>
      </NavLink>
    </li>
  );
};

const MENU_SECTIONS = [
  {
    category: 'Main Navigation',
    items: [
      { to: '/accounts/dashboard', icon: Gauge, iconColor: 'text-[#f39c12]', label: 'Dashboard' },
      { to: '/profile', icon: UserCircle2, iconColor: 'text-[#dd4b39]', label: 'My Profile' },
      { to: '/loans', icon: HandCoins, iconColor: 'text-[#605ca8]', label: 'My Loans & Advances' },
      { to: '/leave', icon: Send, iconColor: 'text-[#00c0ef]', label: 'Apply Leave' },
      { to: '/students', icon: Users, iconColor: 'text-[#f39c12]', label: 'Student List', permissions: ['students', 'fees'] },
    ]
  },
  {
    category: 'Fees',
    items: [
      { to: '/fees/collect', icon: HandHeart, iconColor: 'text-[#00a65a]', label: 'Collect Fees', permissions: ['fees', 'fees.collect.manage'] },
      { to: '/fees/due', icon: FileSearch, iconColor: 'text-[#d81b60]', label: 'Search Due Fees', permissions: ['fees', 'fees.due.view'] },
      { to: '/fees/assign', icon: UserPlus, iconColor: 'text-[#3c8dbc]', label: 'Assign Fees', permissions: ['fees', 'fees.assign.manage'] },
      { to: '/fees/groups', icon: Layers, iconColor: 'text-[#00a65a]', label: 'Fee Groups', permissions: ['fees', 'fees.structure.manage'] },
      { to: '/fees/types', icon: Tags, iconColor: 'text-[#f39c12]', label: 'Fee Types', permissions: ['fees', 'fees.structure.manage'] },
    ]
  },
  {
    category: 'Accounts Management',
    items: [
      { to: '/accounts/income', icon: ArrowDown, iconColor: 'text-[#605ca8]', label: 'Income', permissions: ['accounts', 'accounts.income.manage'] },
      { to: '/accounts/expense', icon: ArrowUp, iconColor: 'text-[#00c0ef]', label: 'Expense', permissions: ['accounts', 'accounts.expense.manage'] },
      { to: '/accounts/income-heads', icon: Tag, iconColor: 'text-[#f39c12]', label: 'Income Heads', permissions: ['accounts', 'accounts.heads.manage'] },
      { to: '/accounts/expense-heads', icon: Tag, iconColor: 'text-[#e83e8c]', label: 'Expense Heads', permissions: ['accounts', 'accounts.heads.manage'] },
      { to: '/accounts/day-book', icon: FileSearch, iconColor: 'text-[#3c8dbc]', label: 'Day Book', permissions: ['accounts', 'accounts.reports.view'] },
      { 
        icon: Filter, 
        iconColor: 'text-[#00a65a]', 
        label: 'Lead Management',
        permissions: ['leads', 'front_office'],
        subItems: [
          { label: 'Lead Dashboard', to: '/leads/dashboard' },
          { label: 'Lead Pipeline Board', to: '/leads/pipeline' },
          { label: 'Lead Sources & Stages', to: '/leads/sources' }
        ]
      }
    ]
  },
  {
    category: 'Account',
    items: [
      { to: '/logout', icon: LogOut, iconColor: 'text-[#3c8dbc]', label: 'Logout' },
      { to: '/settings', icon: SettingsIcon, iconColor: 'text-[#00c0ef]', label: 'System Settings', permissions: ['settings', 'admin'] },
    ]
  }
];

const getSchoolMeta = () => {
  try {
    const storedSchool = localStorage.getItem('school_info');
    if (storedSchool) {
      const parsed = JSON.parse(storedSchool);
      if (parsed?.name && !parsed.name.includes('Xavier')) return parsed;
    }
    const rawUser = sessionStorage.getItem('accountant_user') || localStorage.getItem('accountant_user') || localStorage.getItem('user');
    if (rawUser) {
      const u = JSON.parse(rawUser);
      if (u.school?.name && !u.school.name.includes('Xavier')) return u.school;
      if (u.schoolName && !u.schoolName.includes('Xavier')) return { name: u.schoolName, logo: u.schoolLogo || null, shortName: u.schoolShortName || '' };
    }
    const rawSchoolName = localStorage.getItem('schoolName');
    if (rawSchoolName && !rawSchoolName.includes('Xavier')) return { name: rawSchoolName, logo: null, shortName: '' };
  } catch (_) {}
  return { name: 'ALL CORE SOLUTION', logo: null, shortName: 'allcore' };
};

const getSchoolInitials = (name) => {
  if (!name) return 'ERP';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 3).toUpperCase();
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [menuSearch, setMenuSearch] = useState('');
  const [openCategory, setOpenCategory] = useState('Main Navigation');
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [schoolInfo, setSchoolInfo] = useState(getSchoolMeta);
  const [logoError, setLogoError] = useState(false);

  const [userData, setUserData] = useState(() => {
    try {
      const u = JSON.parse(sessionStorage.getItem('accountant_user') || localStorage.getItem('accountant_user') || localStorage.getItem('user') || '{}');
      return u;
    } catch (_) {
      return {};
    }
  });

  const userRole = userData?.role || 'Accountant';
  const userRoleName = typeof userRole === 'object' ? (userRole?.name || 'Accountant') : (userData?.roleName || userRole || 'Accountant');
  const userPermissions = Array.isArray(userData?.permissions) 
    ? userData.permissions 
    : (Array.isArray(userData?.role?.permissions) ? userData.role.permissions : []);

  const isSuperAdmin = userPermissions.includes('*') || 
                       userPermissions.includes('all') || 
                       userRoleName.toLowerCase().includes('admin');

  const hasPermission = (requiredKeys) => {
    if (isSuperAdmin) return true;
    if (!requiredKeys || requiredKeys.length === 0) return true;
    if (!Array.isArray(requiredKeys)) requiredKeys = [requiredKeys];

    // Baseline accountant access to core financial tools
    const isAccountant = userRoleName.toLowerCase().includes('account') || userRoleName.toLowerCase().includes('finance');
    if (isAccountant) {
      const baseline = ['fees', 'accounts', 'students'];
      if (requiredKeys.some(k => baseline.some(b => k.startsWith(b)))) {
        return true;
      }
    }

    return requiredKeys.some(key => {
      if (userPermissions.includes(key)) return true;
      const [module] = key.split('.');
      if (userPermissions.includes(module) || userPermissions.includes(`${module}.*`)) return true;
      if (userPermissions.some(p => p.startsWith(module + '.') || p === module)) return true;
      return false;
    });
  };

  const showRolePermissionsModal = () => {
    const isFull = isSuperAdmin;
    const permListHtml = isFull 
      ? `<div style="padding:12px; border-radius:10px; background:#ecfdf5; border:1px solid #a7f3d0; color:#065f46; font-weight:600; font-size:13px; text-align:center;">
           ✨ Full Super Access (All modules unlocked)
         </div>`
      : userPermissions.length === 0
        ? `<div style="padding:12px; border-radius:10px; background:#fff7ed; border:1px solid #fed7aa; color:#9a3412; font-size:13px; text-align:center;">
             Standard Accountant baseline permissions active.
           </div>`
        : `<div style="max-height: 220px; overflow-y: auto; text-align: left; display: flex; flex-wrap: wrap; gap: 6px; padding: 6px 0;">
             ${userPermissions.map(p => `
               <span style="display:inline-flex; align-items:center; gap:4px; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-family: monospace; font-weight: 600; background: #f1f5f9; color: #1e293b; border: 1px solid #cbd5e1;">
                 <span style="color:#10b981; font-weight:bold;">✓</span> ${p}
               </span>
             `).join('')}
           </div>`;

    Swal.fire({
      title: `<span style="font-size:18px; font-weight:800; color:#1e293b;">Active Role & Permissions</span>`,
      html: `
        <div style="font-family: system-ui, sans-serif; font-size: 13px; color: #475569; text-align: left;">
          <div style="display:flex; justify-content:space-between; align-items:center; padding: 10px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 12px;">
            <div>
              <div style="font-size:11px; text-transform:uppercase; color:#94a3b8; font-weight:700;">Role & Position</div>
              <div style="font-size:15px; font-weight:800; color:#0f172a; text-transform: capitalize;">${userRoleName}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:11px; text-transform:uppercase; color:#94a3b8; font-weight:700;">Privileges</div>
              <div style="font-size:14px; font-weight:700; color:#10b981;">
                ${isFull ? 'Super Access' : `${userPermissions.length} Active`}
              </div>
            </div>
          </div>
          <div style="font-size:12px; font-weight:700; color:#64748b; margin-bottom: 6px; text-transform: uppercase;">
            Authorized Permission Scopes:
          </div>
          ${permListHtml}
        </div>
      `,
      confirmButtonText: 'Done',
      confirmButtonColor: '#ff5c0a'
    });
  };

  useEffect(() => {
    const handleSchoolSync = () => {
      setSchoolInfo(getSchoolMeta());
      setLogoError(false);
      try {
        const u = JSON.parse(sessionStorage.getItem('accountant_user') || localStorage.getItem('accountant_user') || localStorage.getItem('user') || '{}');
        setUserData(u);
      } catch (_) {}
    };
    window.addEventListener('school_info_updated', handleSchoolSync);
    window.addEventListener('accountant_profile_updated', handleSchoolSync);
    window.addEventListener('storage', handleSchoolSync);
    return () => {
      window.removeEventListener('school_info_updated', handleSchoolSync);
      window.removeEventListener('accountant_profile_updated', handleSchoolSync);
      window.removeEventListener('storage', handleSchoolSync);
    };
  }, []);

  useEffect(() => {
    for (const section of MENU_SECTIONS) {
      for (const item of section.items) {
        if (item.to && (location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to + '/')))) {
          setOpenCategory(section.category);
          setOpenSubmenu(null);
          return;
        }
        if (item.subItems && item.subItems.some(sub => location.pathname === sub.to || (sub.to !== '/' && location.pathname.startsWith(sub.to + '/')))) {
          setOpenCategory(section.category);
          setOpenSubmenu(item.label);
          return;
        }
      }
    }
  }, [location.pathname]);

  const toggleCategory = (cat) => {
    setOpenCategory(prev => prev === cat ? null : cat);
  };

  const toggleSubmenu = (label) => {
    setOpenSubmenu(prev => prev === label ? null : label);
  };

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const q = menuSearch.toLowerCase().trim();

  // Filter sections based on permissions and search query
  const filteredSections = MENU_SECTIONS.map(section => {
    const matchedItems = section.items.filter(item => {
      if (item.permissions && !hasPermission(item.permissions)) return false;
      if (!q) return true;
      const labelMatch = item.label.toLowerCase().includes(q);
      const subMatch = item.subItems && item.subItems.some(sub => sub.label.toLowerCase().includes(q));
      return labelMatch || subMatch;
    });
    return { ...section, items: matchedItems };
  }).filter(section => section.items.length > 0);

  return (
    <aside 
      className={`bg-slate-950 text-slate-300 h-full border-r border-slate-800/80 flex flex-col font-sans overflow-hidden flex-shrink-0 z-50 transition-all duration-300 ease-in-out fixed lg:relative
        ${isOpen 
          ? 'w-[240px] translate-x-0 opacity-100 shadow-xl lg:shadow-none' 
          : 'w-0 -translate-x-full opacity-0 pointer-events-none lg:w-0'
        }
      `}
    >
      {/* Brand Logo Area (Static Display, No Redirection) */}
      <div 
        className="h-16 flex items-center gap-3 px-4 bg-slate-950 border-b border-slate-800/80 text-white shrink-0 select-none"
        title={`${schoolInfo.name || 'ALL CORE SOLUTION'} • Accountant Portal`}
      >
        <div 
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff5c0a] via-amber-500 to-[#ff7a29] p-[1.5px] flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0 overflow-hidden"
          translate="no"
        >
          <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center overflow-hidden">
            {schoolInfo.logo && !logoError ? (
              <img
                src={schoolInfo.logo}
                alt={schoolInfo.name}
                onError={() => setLogoError(true)}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-tr from-amber-300 via-orange-400 to-[#ff5c0a] text-xs font-black tracking-wider uppercase select-none font-mono">
                {getSchoolInitials(schoolInfo.name) || 'ACS'}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-extrabold text-[14px] text-white tracking-wide leading-tight truncate max-w-[155px]">
            {schoolInfo.name || 'ALL CORE SOLUTION'}
          </span>
          <span className="text-[10px] text-orange-400/90 font-semibold truncate max-w-[155px]">
            {schoolInfo.shortName ? `${schoolInfo.shortName} • Accounts` : 'Accounts & Finance Cloud Console'}
          </span>
        </div>
      </div>

      {/* Role & Permissions Badge Bar */}
      <div className="px-3 pt-2">
        <div className="px-2.5 py-1.5 flex items-center justify-between bg-slate-900/90 rounded-xl border border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-white truncate capitalize">{userRoleName}</span>
              <span className="text-[9px] text-emerald-400 font-medium">
                {isSuperAdmin ? 'Full School Access' : `${userPermissions.length} Active Permissions`}
              </span>
            </div>
          </div>
          <button 
            type="button"
            onClick={showRolePermissionsModal}
            title="Inspect Active Permissions" 
            className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-[#ff5c0a] text-slate-300 hover:text-white text-[10px] font-bold transition-colors cursor-pointer shrink-0"
          >
            Inspect
          </button>
        </div>
      </div>

      {/* Scrollable Navigation Menu */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
        {/* Search Menu Input */}
        <div className="px-3 mb-3 mt-1">
          <div className="flex items-center bg-slate-900/90 rounded-xl overflow-hidden border border-slate-700/70 focus-within:border-[#ff5c0a] transition-colors">
            <input 
              type="text" 
              placeholder="Search Menu..." 
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              className="w-full bg-transparent text-xs text-white placeholder-slate-400 px-3 py-2 focus:outline-none"
            />
            {menuSearch ? (
              <button 
                onClick={() => setMenuSearch('')}
                className="px-2.5 bg-transparent text-slate-400 hover:text-white"
                title="Clear filter"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <span className="px-3 bg-transparent text-slate-400">
                <Search className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
        </div>

        {/* Categories & Links */}
        <div className="space-y-1 text-xs pb-4">
          {filteredSections.length > 0 ? (
            filteredSections.map((section, sIdx) => {
              const isCategoryOpen = !!menuSearch.trim() || openCategory === section.category;
              return (
                <div key={sIdx} className="mb-1.5">
                  <button
                    type="button"
                    onClick={() => toggleCategory(section.category)}
                    className="w-full flex items-center justify-between px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-white transition-all cursor-pointer group rounded-lg hover:bg-slate-800/50 my-0.5"
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isCategoryOpen ? 'bg-[#ff5c0a]' : 'bg-slate-600 group-hover:bg-slate-400'}`} />
                      {section.category}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180 text-[#ff5c0a]' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ease-in-out ${isCategoryOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
                    <ul className="overflow-hidden space-y-0.5 pt-0.5">
                      {section.items.map((item, iIdx) => (
                        <NavItem 
                          key={iIdx} 
                          closeSidebar={closeSidebar} 
                          to={item.to} 
                          icon={item.icon} 
                          iconColor={item.iconColor} 
                          label={item.label} 
                          subItems={item.subItems} 
                          isOpen={openSubmenu === item.label || !!menuSearch.trim()}
                          onToggle={() => toggleSubmenu(item.label)}
                        />
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-xs text-slate-400">
              No menu items matching "{menuSearch}"
              <button 
                onClick={() => setMenuSearch('')}
                className="block mx-auto mt-2 text-[#ff5c0a] font-bold underline text-xs"
              >
                Show all menu items
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DEVELOPER BRANDING & ATTRIBUTION FOOTER - FIXED PERMANENTLY AT BOTTOM */}
      <div className="shrink-0 p-3 border-t border-slate-800/80 bg-slate-950 text-center">
        <div className="bg-gradient-to-r from-slate-900/90 via-slate-800/60 to-slate-900/90 rounded-xl p-2.5 border border-slate-800/80 shadow-xs hover:border-[#ff5c0a]/40 transition-colors">
          <p className="text-[11px] font-bold text-slate-300 tracking-wide mb-1">
            &copy; 2026 ALL CORE SOLUTION
          </p>
          <p className="text-[10px] font-medium text-slate-400 leading-relaxed">
            Developed by <span className="text-white font-bold">RAJ YADAV</span> <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent font-bold">@ALLCORE SOLUTION</span>
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

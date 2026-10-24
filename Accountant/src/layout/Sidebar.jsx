import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Gauge, UserCircle2, HandCoins, Send, Users, 
  HandHeart, FileSearch, UserPlus, Layers, Tags, 
  ArrowDown, ArrowUp, Tag, Filter, LogOut, ChevronLeft, ChevronDown, Search, X, Settings as SettingsIcon
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
      { to: '/students', icon: Users, iconColor: 'text-[#f39c12]', label: 'Student List' },
    ]
  },
  {
    category: 'Fees',
    items: [
      { to: '/fees/collect', icon: HandHeart, iconColor: 'text-[#00a65a]', label: 'Collect Fees' },
      { to: '/fees/due', icon: FileSearch, iconColor: 'text-[#d81b60]', label: 'Search Due Fees' },
      { to: '/fees/assign', icon: UserPlus, iconColor: 'text-[#3c8dbc]', label: 'Assign Fees' },
      { to: '/fees/groups', icon: Layers, iconColor: 'text-[#00a65a]', label: 'Fee Groups' },
      { to: '/fees/types', icon: Tags, iconColor: 'text-[#f39c12]', label: 'Fee Types' },
    ]
  },
  {
    category: 'Accounts Management',
    items: [
      { to: '/accounts/income', icon: ArrowDown, iconColor: 'text-[#605ca8]', label: 'Income' },
      { to: '/accounts/expense', icon: ArrowUp, iconColor: 'text-[#00c0ef]', label: 'Expense' },
      { to: '/accounts/income-heads', icon: Tag, iconColor: 'text-[#f39c12]', label: 'Income Heads' },
      { to: '/accounts/expense-heads', icon: Tag, iconColor: 'text-[#e83e8c]', label: 'Expense Heads' },
      { to: '/accounts/day-book', icon: FileSearch, iconColor: 'text-[#3c8dbc]', label: 'Day Book' },
      { 
        icon: Filter, 
        iconColor: 'text-[#00a65a]', 
        label: 'Lead Management',
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
      { to: '/settings', icon: SettingsIcon, iconColor: 'text-[#00c0ef]', label: 'System Settings' },
    ]
  }
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [menuSearch, setMenuSearch] = useState('');
  const [openCategory, setOpenCategory] = useState('Main Navigation');
  const [openSubmenu, setOpenSubmenu] = useState(null);

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

  // Filter sections based on search query
  const filteredSections = MENU_SECTIONS.map(section => {
    const matchedItems = section.items.filter(item => {
      if (!q) return true;
      const labelMatch = item.label.toLowerCase().includes(q);
      const subMatch = item.subItems && item.subItems.some(sub => sub.label.toLowerCase().includes(q));
      return labelMatch || subMatch;
    });
    return { ...section, items: matchedItems };
  }).filter(section => section.items.length > 0);

  return (
    <aside 
      className={`bg-[#131927] text-slate-300 h-full border-r border-[#1e2638] flex flex-col font-sans overflow-hidden flex-shrink-0 z-50 transition-all duration-300 ease-in-out fixed lg:relative
        ${isOpen 
          ? 'w-[240px] translate-x-0 opacity-100 shadow-xl lg:shadow-none' 
          : 'w-0 -translate-x-full opacity-0 pointer-events-none lg:w-0'
        }
      `}
    >
      {/* Brand Logo Area */}
      <NavLink 
        to="/accounts/dashboard"
        className="h-16 flex items-center gap-3 px-4 bg-[#131927] border-b border-[#1e2638] text-white shrink-0 hover:brightness-110 transition-all group"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff5c0a] to-[#ff8c42] p-0.5 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
          <div className="w-full h-full bg-[#131927] rounded-[10px] flex items-center justify-center">
            <span className="font-black text-[11px] tracking-wider text-[#ff5c0a]">ERP</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[14px] tracking-wide leading-tight group-hover:text-orange-400 transition-colors">
            Accountant Portal
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Multi-School ERP v3.7</span>
        </div>
      </NavLink>

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
      <div className="shrink-0 p-3 border-t border-slate-800/80 bg-[#131927] text-center">
        <div className="bg-gradient-to-r from-slate-900/90 via-slate-800/60 to-slate-900/90 rounded-xl p-2.5 border border-slate-800/80 shadow-xs hover:border-[#ff5c0a]/40 transition-colors">
          <p className="text-[11px] font-bold text-slate-300 tracking-wide mb-1">
            &copy; 2026 School ERP
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

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Menu, Search, Bell, Settings as SettingsIcon, X,
  ArrowRight, Users, HandCoins, ArrowDown, ArrowUp,
  FileText, PlaneTakeoff, Tags, Layers, Gauge, User, CornerDownLeft,
  GraduationCap, Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import localDb from '../api/localDb';

const SYSTEM_PAGES = [
  { label: 'Dashboard', path: '/accounts/dashboard', category: 'Navigation', icon: Gauge, desc: 'Overview, stats & calendar' },
  { label: 'Collect Fees', path: '/fees/collect', category: 'Fees', icon: HandCoins, desc: 'Collect student fee installments' },
  { label: 'Search Due Fees', path: '/fees/due', category: 'Fees', icon: Search, desc: 'Search pending student fees' },
  { label: 'Assign Fees', path: '/fees/assign', category: 'Fees', icon: HandCoins, desc: 'Assign fee structures to students' },
  { label: 'Fee Groups', path: '/fees/groups', category: 'Fees', icon: Layers, desc: 'Manage class fee groups' },
  { label: 'Fee Types', path: '/fees/types', category: 'Fees', icon: Tags, desc: 'Tuition, Transport, Library & Exams' },
  { label: 'Income Records', path: '/accounts/income', category: 'Accounts', icon: ArrowDown, desc: 'All received income vouchers' },
  { label: 'Add New Income', path: '/accounts/income/add', category: 'Accounts', icon: ArrowDown, desc: 'Create income voucher' },
  { label: 'Expense Records', path: '/accounts/expense', category: 'Accounts', icon: ArrowUp, desc: 'All school expense records' },
  { label: 'Add New Expense', path: '/accounts/expense/add', category: 'Accounts', icon: ArrowUp, desc: 'Record school expenditure' },
  { label: 'Income Heads', path: '/accounts/income-heads', category: 'Accounts', icon: Tags, desc: 'Categories for income' },
  { label: 'Expense Heads', path: '/accounts/expense-heads', category: 'Accounts', icon: Tags, desc: 'Categories for expenses' },
  { label: 'Day Book', path: '/accounts/day-book', category: 'Accounts', icon: FileText, desc: 'Daily accounting ledger' },
  { label: 'My Loans & Advances', path: '/loans', category: 'Human Resource', icon: HandCoins, desc: 'Staff loan applications & EMI' },
  { label: 'Apply for Loan', path: '/loans/add', category: 'Human Resource', icon: HandCoins, desc: 'Submit loan request' },
  { label: 'Apply Leave', path: '/leave', category: 'Human Resource', icon: PlaneTakeoff, desc: 'Staff leave applications' },
  { label: 'Student List', path: '/students', category: 'Students', icon: Users, desc: 'Directory of all enrolled students' },
  { label: 'My Profile', path: '/profile', category: 'General', icon: User, desc: 'Accountant details & salary' },
  { label: 'Settings', path: '/settings', category: 'General', icon: SettingsIcon, desc: 'System configuration' },
  { label: 'Notifications', path: '/notifications', category: 'General', icon: Bell, desc: 'Alerts & updates' },
];

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ pages: [], students: [], records: [] });
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // Compute live unread notifications count
  const unreadNotifsCount = useMemo(() => {
    try {
      const list = localDb.getNotifications();
      return Array.isArray(list) ? list.filter((n) => !n.read).length : 0;
    } catch (_) {
      return 0;
    }
  }, [showSearch]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(prev => !prev);
      } else if (e.key === 'Escape' && showSearch) {
        setShowSearch(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  // Focus input when modal opens
  useEffect(() => {
    if (showSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [showSearch]);

  // Live search across pages, students, transactions
  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      setSearchResults({
        pages: SYSTEM_PAGES.slice(0, 6),
        students: [],
        records: []
      });
      return;
    }

    // 1. Pages matching
    const matchedPages = SYSTEM_PAGES.filter(p =>
      p.label.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    );

    // 2. Students matching
    let matchedStudents = [];
    try {
      const allStudents = localDb.getAll('students');
      matchedStudents = allStudents.filter(s =>
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.class && s.class.toLowerCase().includes(q)) ||
        (s.roll && String(s.roll).includes(q))
      ).slice(0, 4);
    } catch (_) { }

    // 3. Transactions / Records matching
    let matchedRecords = [];
    try {
      const incomes = localDb.getAll('incomes').map(i => ({ ...i, kind: 'Income', title: i.head || i.note }));
      const expenses = localDb.getAll('expenses').map(e => ({ ...e, kind: 'Expense', title: e.head || e.note }));
      const loans = localDb.getAll('loans').map(l => ({ ...l, kind: 'Loan', title: `${l.type || 'Loan'} (₹${l.amount})` }));

      const all = [...incomes, ...expenses, ...loans];
      matchedRecords = all.filter(r =>
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.kind && r.kind.toLowerCase().includes(q)) ||
        (String(r.amount).includes(q))
      ).slice(0, 4);
    } catch (_) { }

    setSearchResults({
      pages: matchedPages,
      students: matchedStudents,
      records: matchedRecords
    });
  }, [searchQuery]);

  const handleSelectPage = (path) => {
    setShowSearch(false);
    setSearchQuery('');
    navigate(path);
  };

  return (
    <header 
      className="h-[55px] bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-5 sticky top-0 z-40 shrink-0 font-sans w-full max-w-full overflow-hidden"
      style={{
        paddingRight: 'max(0.75rem, env(safe-area-inset-right))',
        paddingLeft: 'max(0.75rem, env(safe-area-inset-left))'
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3.5">
        {/* Working Sidebar Toggle Hamburger Button */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-1.5 sm:p-2 rounded-lg text-gray-600 hover:text-[#3c8dbc] hover:bg-blue-50/80 active:scale-95 transition-all focus:outline-none flex items-center justify-center border border-gray-200/90 hover:border-blue-300 shadow-xs cursor-pointer group"
          title={isSidebarOpen ? "Collapse navigation menu" : "Expand navigation menu"}
          aria-label="Toggle Sidebar"
        >
          <Menu className={`w-[20px] h-[20px] transition-transform duration-300 ${!isSidebarOpen ? 'rotate-90 text-[#ff5c0a]' : 'group-hover:scale-105'}`} />
        </button>

        {/* Brand Unit */}
        <Link
          to="/accounts/dashboard"
          className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer select-none no-underline"
          title="Accountant Portal • Multi-School ERP"
        >
          {/* School Emblem Icon */}
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#ff5c0a] to-[#ff8c42] p-0.5 shadow-xs group-hover:shadow-md transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#131927] rounded-[10px] flex items-center justify-center overflow-hidden relative">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 group-hover:text-orange-300 transition-transform group-hover:rotate-6 duration-300" />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 border border-white animate-pulse" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-800 tracking-tight text-[15px] sm:text-[17px] leading-tight group-hover:text-[#ff5c0a] transition-all">
                ALL CORE SOLUTION
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-50 text-[#ff5c0a] border border-orange-200 shadow-xs">
                <Sparkles className="w-2.5 h-2.5 text-[#ff5c0a]" />
                <span>ACCOUNTANT</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:block font-medium tracking-wide">
              Financial & Fee Management • Session 2026-27
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto pr-0.5 sm:pr-1">
        {/* Universal Search Bar Trigger */}
        <button
          onClick={() => setShowSearch(true)}
          className="flex items-center gap-2 text-slate-500 hover:text-[#ff5c0a] bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors focus:outline-none shadow-xs"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline text-slate-600">Search modules, fees, students...</span>
          <span className="hidden sm:inline-flex items-center text-[10px] bg-white border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded-lg font-mono">
            Ctrl K
          </span>
        </button>

        {/* Notifications */}
        <Link
          to="/notifications"
          title="Notifications"
          className="relative px-2 sm:px-3 py-2 flex items-center cursor-pointer text-slate-500 hover:text-[#ff5c0a] transition-colors focus:outline-none"
        >
          <Bell className="w-[18px] h-[18px] sm:w-[19px] sm:h-[19px]" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-[3px] right-[3px] sm:right-[5px] min-w-[17px] h-[17px] px-1 bg-[#ff5c0a] text-white text-[10px] font-bold rounded-full border border-white flex items-center justify-center shadow-xs">
              {unreadNotifsCount}
            </span>
          )}
        </Link>

        {/* Vertical Divider */}
        <div className="hidden sm:block h-[22px] w-[1px] bg-slate-200 mx-1"></div>

        {/* Settings */}
        <Link
          to="/settings"
          title="Settings"
          className="hidden sm:flex text-slate-500 hover:text-[#ff5c0a] transition-colors px-2 py-2 items-center focus:outline-none"
        >
          <SettingsIcon className="w-[19px] h-[19px]" />
        </Link>

        {/* User Profile */}
        <Link
          to="/profile"
          title="Accountant Profile"
          className="ml-1 sm:ml-2 w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ff5c0a] to-[#ff7a29] hover:brightness-110 transition-all text-white flex items-center justify-center font-bold text-[12px] shadow-sm transform hover:scale-105 duration-200 focus:outline-none"
        >
          AC
        </Link>
      </div>

      {/* UNIVERSAL SEARCH MODAL */}
      {showSearch && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => { setShowSearch(false); setSearchQuery(''); }}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
              <Search className="w-5 h-5 text-[#ff5c0a] shrink-0 mr-3" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search pages, students, fees, vouchers, loans..."
                className="flex-1 bg-transparent text-[14px] outline-none text-slate-800 placeholder-slate-400 font-sans font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <span className="text-[11px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-mono text-center">
                ESC
              </span>
            </div>

            {/* Results Area */}
            <div className="overflow-y-auto p-4 space-y-4 text-sm divide-y divide-slate-100">

              {/* 1. Pages & Modules */}
              {searchResults.pages.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2 flex items-center justify-between">
                    <span>Navigation & Modules</span>
                    <span className="text-[10px] text-gray-400 font-normal">Direct Link</span>
                  </p>
                  <div className="space-y-1">
                    {searchResults.pages.map((p, i) => {
                      const Icon = p.icon || FileText;
                      return (
                        <div
                          key={i}
                          onClick={() => handleSelectPage(p.path)}
                          className="flex items-center justify-between px-3 py-2 rounded hover:bg-purple-50 hover:text-[#5a52d7] cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center text-gray-600 group-hover:text-[#5a52d7] transition-colors">
                              <Icon className="w-4 h-4" />
                            </span>
                            <div>
                              <p className="font-semibold text-gray-800 group-hover:text-[#5a52d7] leading-snug">{p.label}</p>
                              <p className="text-[11px] text-gray-400">{p.desc}</p>
                            </div>
                          </div>
                          <span className="text-gray-400 group-hover:text-[#5a52d7] text-xs flex items-center gap-1 font-mono">
                            <span className="text-[11px]">{p.category}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Students */}
              {searchResults.students.length > 0 && (
                <div className="pt-3">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                    Students ({searchResults.students.length})
                  </p>
                  <div className="space-y-1">
                    {searchResults.students.map((st, i) => (
                      <div
                        key={i}
                        onClick={() => handleSelectPage('/students')}
                        className="flex items-center justify-between px-3 py-2 rounded hover:bg-blue-50 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                            {st.name?.slice(0, 2).toUpperCase()}
                          </span>
                          <div>
                            <p className="font-semibold text-gray-800 group-hover:text-blue-600">{st.name}</p>
                            <p className="text-[11px] text-gray-500">Class: {st.class} • Roll: {st.roll || st.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${Number(st.due) > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                            {Number(st.due) > 0 ? `Due ₹${st.due}` : 'Paid'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Transactions / Records */}
              {searchResults.records.length > 0 && (
                <div className="pt-3">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                    Transactions & Ledgers
                  </p>
                  <div className="space-y-1">
                    {searchResults.records.map((r, i) => (
                      <div
                        key={i}
                        onClick={() => handleSelectPage(r.kind === 'Loan' ? '/loans' : r.kind === 'Income' ? '/accounts/income' : '/accounts/expense')}
                        className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${r.kind === 'Income' ? 'bg-green-100 text-green-700' :
                              r.kind === 'Expense' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
                            }`}>
                            {r.kind}
                          </span>
                          <span className="font-medium text-gray-800">{r.title}</span>
                        </div>
                        <span className="font-bold text-gray-700 text-xs">
                          {r.amount ? `₹${Number(r.amount).toLocaleString('en-IN')}` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No results state */}
              {searchQuery && searchResults.pages.length === 0 && searchResults.students.length === 0 && searchResults.records.length === 0 && (
                <div className="py-10 text-center text-gray-400">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#5a52d7]" />
                  <p className="font-semibold text-gray-600">No matching results for "{searchQuery}"</p>
                  <p className="text-xs text-gray-400 mt-1">Try searching for "Fees", "Loan", "Leave", "Income", or a student name.</p>
                </div>
              )}

            </div>

            {/* Bottom Keyboard Guide */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1.5">
                <CornerDownLeft className="w-3 h-3" /> Press to open
              </span>
              <span>ESC to exit</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

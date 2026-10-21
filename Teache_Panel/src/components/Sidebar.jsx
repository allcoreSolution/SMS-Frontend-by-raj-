import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Search, PieChart, LayoutDashboard, User, DollarSign, Video, AlertCircle, FileText,
  Heart, CalendarDays, Users, CheckCircle, HelpCircle, ChevronLeft, ChevronDown,
  PenTool, List, Edit, UploadCloud, Printer, Book, Grid, Handshake, Clipboard, ClipboardCheck, 
  Filter, BarChart, MessageCircle, LogOut, PhoneCall, Accessibility, CreditCard,
  Settings
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';
import { useLanguage } from '../context/LanguageContext';

// Reusable Collapsible Submenu with smooth toggle open & close support
const CollapsibleSubMenu = ({ 
  icon: Icon, 
  iconColor = 'text-pink-400', 
  label, 
  checkActive, 
  items, 
  isDiv = false 
}) => {
  const location = useLocation();
  const isChildActive = checkActive(location.pathname);
  
  // Controls whether the submenu is currently open or closed
  const [open, setOpen] = useState(isChildActive);
  const prevPathRef = useRef(location.pathname);

  // Auto-expand only when navigating into this section from a different section
  useEffect(() => {
    const wasActive = checkActive(prevPathRef.current);
    const nowActive = checkActive(location.pathname);
    if (!wasActive && nowActive) {
      setOpen(true);
    }
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(prev => !prev);
  };

  const content = (
    <>
      <button
        type="button"
        onClick={toggle}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          isChildActive ? 'bg-[#ff5c0a]/15 text-[#ff5c0a]' : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
          <span className="flex-1 text-left">{label}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180 text-[#ff5c0a]' : 'text-slate-400'}`} />
      </button>

      {open && (
        <ul className="ml-3 my-1 space-y-0.5 bg-slate-900/60 rounded-xl p-1.5 border border-slate-800/60 transition-all">
          {items.map(item => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    isActive ? 'text-white bg-[#ff5c0a] font-bold shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <span className="text-[10px] opacity-70">»</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  return isDiv ? <div className="my-0.5">{content}</div> : <li className="my-0.5">{content}</li>;
};

const LiveClassesMenu = () => (
  <CollapsibleSubMenu
    isDiv={true}
    icon={Video}
    iconColor="text-blue-400"
    label="Live Classes"
    checkActive={(path) => path.startsWith('/live')}
    items={[
      { path: '/live/manage', label: 'Manage Live Classes' },
      { path: '/live/settings', label: 'Live Class Settings' }
    ]}
  />
);

const PTMMenu = () => (
  <CollapsibleSubMenu
    icon={Handshake}
    iconColor="text-pink-400"
    label="PTM Meetings"
    checkActive={(path) => path.startsWith('/ptm')}
    items={[
      { path: '/ptm-dashboard', label: 'PTM Dashboard' },
      { path: '/ptm-guide', label: 'PTM Guide' },
      { path: '/ptm-attendance', label: 'PTM Attendance & Rec' },
      { path: '/ptm-followups', label: 'PTM Follow-ups' },
      { path: '/ptm', label: 'PTM Reports' }
    ]}
  />
);

const LessonPlannerMenu = () => (
  <CollapsibleSubMenu
    icon={Clipboard}
    iconColor="text-emerald-400"
    label="Lesson Planner"
    checkActive={(path) => path.startsWith('/lesson-planner') || path.startsWith('/lesson-plans')}
    items={[
      { path: '/lesson-planner', label: 'Lesson Planner Dashboard' },
      { path: '/lesson-plans', label: 'Lesson Plans' },
      { path: '/lesson-planner-guide', label: 'Lesson Planner Guide' },
      { path: '/lesson-plan-review', label: 'Lesson Plan Review' },
      { path: '/lesson-plan-coverage', label: 'Lesson Plan Coverage' },
      { path: '/lesson-plan-reports', label: 'Lesson Plan Reports' }
    ]}
  />
);

const OSMMenu = () => (
  <CollapsibleSubMenu
    icon={PenTool}
    iconColor="text-purple-400"
    label="OSM Module"
    checkActive={(path) => path.startsWith('/osm')}
    items={[
      { path: '/osm-dashboard', label: 'OSM Dashboard' },
      { path: '/osm-evaluate', label: 'OSM Evaluate' },
      { path: '/osm-reports', label: 'OSM Reports' },
      { path: '/osm-guide', label: 'OSM Guide' }
    ]}
  />
);

const SurveysMenu = () => (
  <CollapsibleSubMenu
    icon={BarChart}
    iconColor="text-amber-400"
    label="Surveys & Feedback"
    checkActive={(path) => path.startsWith('/my-surveys') || path.startsWith('/feedback-triage') || path.startsWith('/surveys')}
    items={[
      { path: '/my-surveys', label: 'My Surveys' },
      { path: '/feedback-triage', label: 'Feedback Triage' }
    ]}
  />
);

const AssessmentMenu = () => (
  <CollapsibleSubMenu
    icon={ClipboardCheck}
    iconColor="text-cyan-400"
    label="Assessment"
    checkActive={(path) => path.startsWith('/assessment')}
    items={[
      { path: '/assessment-dashboard', label: 'Assessment Dashboard' },
      { path: '/assessments', label: 'Assessments' },
      { path: '/assessment-guide', label: 'Assessment Guide' },
      { path: '/assessment-reports', label: 'Assessment Reports' }
    ]}
  />
);

const LeadManagementMenu = () => (
  <CollapsibleSubMenu
    icon={Filter}
    iconColor="text-teal-400"
    label="Lead Management"
    checkActive={(path) => path.startsWith('/lead')}
    items={[
      { path: '/lead-dashboard', label: 'Lead Dashboard' },
      { path: '/lead-pipeline', label: 'Lead Pipeline Board' },
      { path: '/lead-sources', label: 'Lead Sources & Stages' }
    ]}
  />
);

const HolisticProgressMenu = () => (
  <CollapsibleSubMenu
    icon={Accessibility}
    iconColor="text-sky-400"
    label="Holistic Progress Card"
    checkActive={(path) => path.startsWith('/hpc') || path.startsWith('/progress-cards')}
    items={[
      { path: '/hpc-dashboard', label: 'HPC Dashboard' },
      { path: '/hpc-activities', label: 'HPC Activities' },
      { path: '/progress-cards', label: 'Progress Cards' }
    ]}
  />
);

const navLinkClass = ({ isActive }) => 
  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all my-0.5 ${
    isActive 
      ? 'bg-gradient-to-r from-[#ff5c0a] to-[#ff7a29] text-white shadow-md shadow-orange-500/20' 
      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
  }`;

const navLinkFlexBetweenClass = ({ isActive }) => 
  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all my-0.5 ${
    isActive 
      ? 'bg-gradient-to-r from-[#ff5c0a] to-[#ff7a29] text-white shadow-md shadow-orange-500/20' 
      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
  }`;

const Sidebar = () => {
  const { isSidebarOpen } = useSidebar();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  
  return (
    <aside className={`h-screen bg-[#131927] text-slate-300 flex flex-col overflow-hidden border-r border-[#1e2638] flex-shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-[240px] opacity-100' : 'w-0 opacity-0 pointer-events-none border-r-0'}`}>
      
      {/* Logo Area */}
      <div className="h-16 px-4 flex items-center flex-shrink-0 border-b border-[#1e2638] bg-[#131927]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff5c0a] to-[#ff8c42] p-0.5 flex items-center justify-center shadow-sm">
            <div className="w-full h-full bg-[#131927] rounded-[10px] flex items-center justify-center">
              <span className="font-black text-[11px] tracking-wider text-[#ff5c0a]">ERP</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-white tracking-tight leading-tight">Teacher Portal</span>
            <span className="text-[10px] text-slate-400 font-medium">Multi-School ERP v3.7</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 flex-shrink-0">
         <div className="flex bg-slate-900/90 rounded-xl overflow-hidden border border-slate-700/70 focus-within:border-[#ff5c0a] transition-colors">
           <input 
             type="text" 
             placeholder="Search Menu..." 
             className="w-full bg-transparent text-xs px-3 py-2 focus:outline-none placeholder-slate-400 text-white"
             value={search}
             onChange={e => setSearch(e.target.value)}
           />
           <button className="px-3 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
             <Search className="w-3.5 h-3.5" />
           </button>
         </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto px-3 pb-10 custom-scrollbar" style={{ scrollbarWidth: 'thin' }}>
        
        {/* MAIN NAVIGATION */}
        <div className="mb-6 mt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 ml-1">Main Navigation</p>
          <ul className="space-y-1">
            <li><NavLink to="/" className={navLinkClass}><LayoutDashboard className="w-[18px] h-[18px]" /> Dashboard</NavLink></li>
            <li><NavLink to="/my-profile" className={navLinkClass}><User className="w-[18px] h-[18px] text-red-400" /> My Profile</NavLink></li>
            <li><NavLink to="/loans" className={navLinkClass}><DollarSign className="w-[18px] h-[18px] text-purple-400" /> My Loans &amp; Advances</NavLink></li>
            <li><LiveClassesMenu /></li>
            <li><NavLink to="/complaints" className={navLinkClass}><AlertCircle className="w-[18px] h-[18px] text-orange-400" /> Complaints</NavLink></li>
            <li><NavLink to="/leave" className={navLinkClass}><FileText className="w-[18px] h-[18px] text-pink-500" /> Apply Leave</NavLink></li>
            <li><NavLink to="/health" className={navLinkClass}><Heart className="w-[18px] h-[18px] text-green-400" /> Health Records</NavLink></li>
            <li><NavLink to="/timetable" className={navLinkClass}><CalendarDays className="w-[18px] h-[18px] text-purple-500" /> My Timetable</NavLink></li>
          </ul>
        </div>
        
        {/* STUDENTS */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 ml-1">Students</p>
          <ul className="space-y-1">
            <li><NavLink to="/students" className={navLinkClass}><Users className="w-[18px] h-[18px] text-teal-400" /> Student List</NavLink></li>
            <li><NavLink to="/student-attendance" className={navLinkClass}><CheckCircle className="w-[18px] h-[18px] text-amber-400" /> Student Attendance</NavLink></li>
          </ul>
        </div>

        {/* ONLINE EXAMS */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 ml-1">Online Exams</p>
          <ul className="space-y-1">
            <li><NavLink to="/online-exams" className={navLinkClass}><PenTool className="w-[18px] h-[18px] text-purple-400" /> Manage Online Exams</NavLink></li>
            <li><NavLink to="/question-bank" className={navLinkClass}><List className="w-[18px] h-[18px] text-cyan-400" /> Question Bank</NavLink></li>
          </ul>
        </div>

        {/* EXAMS */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 ml-1">Exams</p>
          <ul className="space-y-1">
            <li><NavLink to="/offline-exams" className={navLinkClass}><List className="w-[18px] h-[18px] text-pink-400" /> Manage Offline Exams</NavLink></li>
            <li><NavLink to="/admit-cards" className={navLinkClass}><CreditCard className="w-[18px] h-[18px] text-amber-400" /> Admit Cards</NavLink></li>
            <li><NavLink to="/enter-marks" className={navLinkClass}><Edit className="w-[18px] h-[18px] text-green-400" /> Enter Marks</NavLink></li>
            <li><NavLink to="/upload-marksheet" className={navLinkClass}><UploadCloud className="w-[18px] h-[18px] text-purple-400" /> Upload Marksheet</NavLink></li>
            <li><NavLink to="/generate-marksheet" className={navLinkClass}><Printer className="w-[18px] h-[18px] text-blue-400" /> Generate Marksheet</NavLink></li>
          </ul>
        </div>

        {/* STUDY MANAGEMENT */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 ml-1">{t('studyManagement', 'Study Management')}</p>
          <ul className="space-y-1">
            <li><NavLink to="/classwork" className={navLinkClass}><Book className="w-[18px] h-[18px] text-yellow-500" /> Classwork & Logbook</NavLink></li>
            <li><NavLink to="/assignments" className={navLinkClass}><Edit className="w-[18px] h-[18px] text-red-400" /> Homework & Assignments</NavLink></li>
          </ul>
        </div>

        {/* DOCUMENTS */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 ml-1">{t('documents', 'Documents')}</p>
          <ul className="space-y-1">
            <li><NavLink to="/certificates" className={navLinkClass}><Printer className="w-[18px] h-[18px] text-cyan-500" /> Certificates & Documents</NavLink></li>
            <li><NavLink to="/apps-center" className={navLinkClass}><Grid className="w-[18px] h-[18px] text-orange-400" /> Apps Center</NavLink></li>
            <PTMMenu />
            <LessonPlannerMenu />
            <OSMMenu />
            <AssessmentMenu />
            <LeadManagementMenu />
            <SurveysMenu />
          </ul>
        </div>

        {/* COMMUNICATION */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 ml-1">{t('communication', 'Communication')}</p>
          <ul className="space-y-1">
            <li><NavLink to="/messages" className={navLinkClass}><MessageCircle className="w-[18px] h-[18px] text-purple-400" /> Messages</NavLink></li>
            <HolisticProgressMenu />
          </ul>
        </div>
        
        {/* ACCOUNT */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 ml-1">{t('account', 'Account')}</p>
          <ul className="space-y-1">
            <li>
               <button 
                 onClick={() => {
                   localStorage.clear();
                   sessionStorage.clear();
                   window.location.href = '/login';
                 }} 
                 className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
               >
                 <LogOut className="w-4 h-4 text-rose-400" /> {t('logout', 'Logout')}
               </button>
            </li>
            <li>
              <NavLink to="/settings" className={navLinkClass}>
                <Settings className="w-[18px] h-[18px] text-amber-400" />
                <span>{t('settings', 'Settings')}</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* DEVELOPER BRANDING & ATTRIBUTION FOOTER */}
        <div className="mt-6 mb-3 pt-3 border-t border-slate-800/80 px-1 text-center">
          <div className="bg-gradient-to-r from-slate-900/90 via-slate-800/60 to-slate-900/90 rounded-xl p-3 border border-slate-800/80 shadow-xs hover:border-[#ff5c0a]/40 transition-colors">
            <p className="text-[11px] font-bold text-slate-300 tracking-wide mb-1">
              &copy; 2026 School ERP
            </p>
            <p className="text-[10px] font-medium text-slate-400 leading-relaxed">
              Developed by <span className="text-white font-bold">RAJ YADAV</span> <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent font-bold">@ALLCORE SOLUTION</span>
            </p>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

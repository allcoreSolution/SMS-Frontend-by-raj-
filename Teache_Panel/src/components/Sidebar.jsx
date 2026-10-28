import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Search, LayoutDashboard, User, DollarSign, Video, AlertCircle, FileText,
  Heart, CalendarDays, Users, CheckCircle, ChevronDown,
  PenTool, List, Edit, UploadCloud, Printer, Book, Grid, Handshake, Clipboard, ClipboardCheck, 
  Filter, BarChart, MessageCircle, LogOut, Accessibility, CreditCard,
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
  isDiv = false,
  isOpen,
  onToggle
}) => {
  const location = useLocation();
  const isChildActive = checkActive(location.pathname);

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggle) onToggle();
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
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#ff5c0a]' : 'text-slate-400'}`} />
      </button>

      {isOpen && (
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

const LiveClassesMenu = ({ t, ...props }) => (
  <CollapsibleSubMenu
    isDiv={true}
    icon={Video}
    iconColor="text-blue-400"
    label={t('liveClasses', 'Live Classes')}
    checkActive={(path) => path.startsWith('/live')}
    items={[
      { path: '/live/manage', label: t('manageLiveClasses', 'Manage Live Classes') },
      { path: '/live/settings', label: t('liveClassSettings', 'Live Class Settings') }
    ]}
    {...props}
  />
);

const PTMMenu = ({ t, ...props }) => (
  <CollapsibleSubMenu
    icon={Handshake}
    iconColor="text-pink-400"
    label={t('ptm', 'PTM Meetings')}
    checkActive={(path) => path.startsWith('/ptm')}
    items={[
      { path: '/ptm-dashboard', label: t('ptmDashboard', 'PTM Dashboard') },
      { path: '/ptm-guide', label: t('ptmGuide', 'PTM Guide') },
      { path: '/ptm-attendance', label: t('ptmAttendance', 'PTM Attendance & Rec') },
      { path: '/ptm-followups', label: t('ptmFollowups', 'PTM Follow-ups') },
      { path: '/ptm', label: t('ptmReports', 'PTM Reports') }
    ]}
    {...props}
  />
);

const LessonPlannerMenu = ({ t, ...props }) => (
  <CollapsibleSubMenu
    icon={Clipboard}
    iconColor="text-emerald-400"
    label={t('lessonPlanner', 'Lesson Planner')}
    checkActive={(path) => path.startsWith('/lesson-planner') || path.startsWith('/lesson-plans')}
    items={[
      { path: '/lesson-planner', label: t('lessonPlanner', 'Lesson Planner Dashboard') },
      { path: '/lesson-plans', label: t('lessonPlans', 'Lesson Plans') },
      { path: '/lesson-planner-guide', label: t('lessonPlannerGuide', 'Lesson Planner Guide') },
      { path: '/lesson-plan-review', label: t('lessonPlanReview', 'Lesson Plan Review') },
      { path: '/lesson-plan-coverage', label: t('lessonPlanCoverage', 'Lesson Plan Coverage') },
      { path: '/lesson-plan-reports', label: t('lessonPlanReports', 'Lesson Plan Reports') }
    ]}
    {...props}
  />
);

const OSMMenu = ({ t, ...props }) => (
  <CollapsibleSubMenu
    icon={PenTool}
    iconColor="text-purple-400"
    label={t('osm', 'OSM Module')}
    checkActive={(path) => path.startsWith('/osm')}
    items={[
      { path: '/osm-dashboard', label: t('osmDashboard', 'OSM Dashboard') },
      { path: '/osm-evaluate', label: t('osmEvaluate', 'OSM Evaluate') },
      { path: '/osm-reports', label: t('osmReports', 'OSM Reports') },
      { path: '/osm-guide', label: t('osmGuide', 'OSM Guide') }
    ]}
    {...props}
  />
);

const SurveysMenu = ({ t, ...props }) => (
  <CollapsibleSubMenu
    icon={BarChart}
    iconColor="text-amber-400"
    label={t('surveys', 'Surveys & Feedback')}
    checkActive={(path) => path.startsWith('/my-surveys') || path.startsWith('/feedback-triage') || path.startsWith('/surveys')}
    items={[
      { path: '/my-surveys', label: t('mySurveys', 'My Surveys') },
      { path: '/feedback-triage', label: t('feedbackTriage', 'Feedback Triage') }
    ]}
    {...props}
  />
);

const AssessmentMenu = ({ t, ...props }) => (
  <CollapsibleSubMenu
    icon={ClipboardCheck}
    iconColor="text-cyan-400"
    label={t('assessment', 'Assessment')}
    checkActive={(path) => path.startsWith('/assessment')}
    items={[
      { path: '/assessment-dashboard', label: t('assessmentDashboard', 'Assessment Dashboard') },
      { path: '/assessments', label: t('assessments', 'Assessments') },
      { path: '/assessment-guide', label: t('assessmentGuide', 'Assessment Guide') },
      { path: '/assessment-reports', label: t('assessmentReports', 'Assessment Reports') }
    ]}
    {...props}
  />
);

const LeadManagementMenu = ({ t, ...props }) => (
  <CollapsibleSubMenu
    icon={Filter}
    iconColor="text-teal-400"
    label={t('leadManagement', 'Lead Management')}
    checkActive={(path) => path.startsWith('/lead')}
    items={[
      { path: '/lead-dashboard', label: t('leadDashboard', 'Lead Dashboard') },
      { path: '/lead-pipeline', label: t('leadPipeline', 'Lead Pipeline Board') },
      { path: '/lead-sources', label: t('leadSources', 'Lead Sources & Stages') }
    ]}
    {...props}
  />
);

const HolisticProgressMenu = ({ t, ...props }) => (
  <CollapsibleSubMenu
    icon={Accessibility}
    iconColor="text-sky-400"
    label={t('hpc', 'Holistic Progress Card')}
    checkActive={(path) => path.startsWith('/hpc') || path.startsWith('/progress-cards')}
    items={[
      { path: '/hpc-dashboard', label: t('hpcDashboard', 'HPC Dashboard') },
      { path: '/hpc-activities', label: t('hpcActivities', 'HPC Activities') },
      { path: '/progress-cards', label: t('progressCards', 'Progress Cards') }
    ]}
    {...props}
  />
);

const navLinkClass = ({ isActive }) => 
  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all my-0.5 ${
    isActive 
      ? 'bg-gradient-to-r from-[#ff5c0a] to-[#ff7a29] text-white shadow-md shadow-orange-500/20' 
      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
  }`;

const Sidebar = () => {
  const { isSidebarOpen } = useSidebar();
  const { t } = useLanguage();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [openSection, setOpenSection] = useState('MAIN NAVIGATION');
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const [userRole, setUserRole] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      return u?.role || 'Teacher';
    } catch (_) {
      return 'Teacher';
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(u?.role || 'Teacher');
      } catch (_) {}
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const p = location.pathname;
    if (p.startsWith('/live')) {
      setOpenSection('MAIN NAVIGATION');
      setOpenSubmenu('Live Classes');
    } else if (p === '/' || p === '/my-profile' || p === '/loans' || p === '/complaints' || p === '/leave' || p === '/health' || p === '/timetable') {
      setOpenSection('MAIN NAVIGATION');
      setOpenSubmenu(null);
    } else if (p.startsWith('/students') || p.startsWith('/student-attendance')) {
      setOpenSection('STUDENTS');
      setOpenSubmenu(null);
    } else if (p.startsWith('/online-exams') || p.startsWith('/question-bank')) {
      setOpenSection('ONLINE EXAMS');
      setOpenSubmenu(null);
    } else if (p.startsWith('/offline-exams') || p.startsWith('/admit-cards') || p.startsWith('/enter-marks') || p.startsWith('/upload-marksheet') || p.startsWith('/generate-marksheet')) {
      setOpenSection('EXAMS');
      setOpenSubmenu(null);
    } else if (p.startsWith('/classwork') || p.startsWith('/assignments')) {
      setOpenSection('STUDY MANAGEMENT');
      setOpenSubmenu(null);
    } else if (p.startsWith('/ptm')) {
      setOpenSection('DOCUMENTS');
      setOpenSubmenu('PTM Meetings');
    } else if (p.startsWith('/lesson-planner') || p.startsWith('/lesson-plans')) {
      setOpenSection('DOCUMENTS');
      setOpenSubmenu('Lesson Planner');
    } else if (p.startsWith('/osm')) {
      setOpenSection('DOCUMENTS');
      setOpenSubmenu('OSM Module');
    } else if (p.startsWith('/assessment')) {
      setOpenSection('DOCUMENTS');
      setOpenSubmenu('Assessment');
    } else if (p.startsWith('/lead')) {
      setOpenSection('DOCUMENTS');
      setOpenSubmenu('Lead Management');
    } else if (p.startsWith('/surveys') || p.startsWith('/my-surveys') || p.startsWith('/feedback-triage')) {
      setOpenSection('DOCUMENTS');
      setOpenSubmenu('Surveys & Feedback');
    } else if (p.startsWith('/certificates') || p.startsWith('/apps-center')) {
      setOpenSection('DOCUMENTS');
      setOpenSubmenu(null);
    } else if (p.startsWith('/hpc') || p.startsWith('/progress-cards')) {
      setOpenSection('COMMUNICATION');
      setOpenSubmenu('Holistic Progress Card');
    } else if (p.startsWith('/messages')) {
      setOpenSection('COMMUNICATION');
      setOpenSubmenu(null);
    } else if (p.startsWith('/settings')) {
      setOpenSection('ACCOUNT');
      setOpenSubmenu(null);
    }
  }, [location.pathname]);

  const toggleSection = (sec) => {
    setOpenSection(prev => prev === sec ? null : sec);
  };

  const toggleSubmenu = (menuName) => {
    setOpenSubmenu(prev => prev === menuName ? null : menuName);
  };

  const renderSectionHeader = (secKey, title) => {
    const isSecOpen = !!search.trim() || openSection === secKey;
    return (
      <button
        type="button"
        onClick={() => toggleSection(secKey)}
        className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-white transition-all cursor-pointer group rounded-lg hover:bg-slate-800/50 my-1"
      >
        <span className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isSecOpen ? 'bg-[#ff5c0a]' : 'bg-slate-600 group-hover:bg-slate-400'}`} />
          {title}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isSecOpen ? 'rotate-180 text-[#ff5c0a]' : 'text-slate-500 group-hover:text-slate-300'}`} />
      </button>
    );
  };
  
  return (
    <aside className={`h-screen bg-[#131927] text-slate-300 flex flex-col overflow-hidden border-r border-[#1e2638] flex-shrink-0 z-50 transition-all duration-300 ease-in-out fixed lg:relative ${
      isSidebarOpen 
        ? 'w-[240px] translate-x-0 opacity-100 shadow-2xl lg:shadow-none' 
        : 'w-0 -translate-x-full opacity-0 pointer-events-none lg:w-0 border-r-0'
    }`}>
      
      {/* Logo Area */}
      <div className="h-16 px-4 flex items-center flex-shrink-0 border-b border-[#1e2638] bg-[#131927]">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff5c0a] to-[#ff8c42] p-[1.5px] flex items-center justify-center shadow-md shadow-orange-500/15 shrink-0 overflow-hidden"
            translate="no"
          >
            <div className="w-full h-full bg-[#131927] rounded-[9px] flex items-center justify-center overflow-hidden">
              <svg 
                viewBox="0 0 36 36" 
                className="w-full h-full notranslate select-none pointer-events-none" 
                translate="no" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="36" height="36" rx="9" fill="#131927"/>
                <text 
                  x="18" 
                  y="18.5" 
                  dominantBaseline="central" 
                  textAnchor="middle" 
                  fill="#ff5c0a" 
                  fontSize="11" 
                  fontWeight="900" 
                  fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                  letterSpacing="0.5px"
                >
                  ERP
                </text>
              </svg>
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] font-bold text-white tracking-tight leading-tight truncate">
              {userRole === 'Staff' ? t('Staff Portal', 'Staff Portal') : t('Teacher Portal', 'Teacher Portal')}
            </span>
            <span className="text-[10px] text-slate-400 font-medium truncate">Multi-School ERP v3.7</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 flex-shrink-0">
         <div className="flex bg-slate-900/90 rounded-xl overflow-hidden border border-slate-700/70 focus-within:border-[#ff5c0a] transition-colors">
           <input 
             type="text" 
             placeholder={t('searchMenu', 'Search Menu...')} 
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
        <div className="mb-2 mt-2">
          {renderSectionHeader('MAIN NAVIGATION', t('mainNavigation', 'Main Navigation'))}
          <div className={`grid transition-all duration-300 ease-in-out ${!!search.trim() || openSection === 'MAIN NAVIGATION' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
            <ul className="overflow-hidden space-y-1 pt-0.5">
              <li><NavLink to="/" className={navLinkClass}><LayoutDashboard className="w-[18px] h-[18px]" /> {t('dashboard', 'Dashboard')}</NavLink></li>
              <li><NavLink to="/my-profile" className={navLinkClass}><User className="w-[18px] h-[18px] text-red-400" /> {t('myProfile', 'My Profile')}</NavLink></li>
              <li><NavLink to="/loans" className={navLinkClass}><DollarSign className="w-[18px] h-[18px] text-purple-400" /> {t('loans', 'My Loans & Advances')}</NavLink></li>
              {userRole !== 'Staff' && (
                <li><LiveClassesMenu t={t} isOpen={openSubmenu === 'Live Classes' || !!search.trim()} onToggle={() => toggleSubmenu('Live Classes')} /></li>
              )}
              <li><NavLink to="/complaints" className={navLinkClass}><AlertCircle className="w-[18px] h-[18px] text-orange-400" /> {t('complaints', 'Complaints')}</NavLink></li>
              <li><NavLink to="/leave" className={navLinkClass}><FileText className="w-[18px] h-[18px] text-pink-500" /> {t('leave', 'Apply Leave')}</NavLink></li>
              <li><NavLink to="/health" className={navLinkClass}><Heart className="w-[18px] h-[18px] text-green-400" /> {t('health', 'Health Records')}</NavLink></li>
              <li><NavLink to="/timetable" className={navLinkClass}><CalendarDays className="w-[18px] h-[18px] text-purple-500" /> {userRole === 'Staff' ? t('dutyTimetable', 'My Duty Timetable') : t('timetable', 'My Timetable')}</NavLink></li>
            </ul>
          </div>
        </div>
        
        {/* STUDENTS - TEACHER ONLY */}
        {userRole !== 'Staff' && (
          <div className="mb-2">
            {renderSectionHeader('STUDENTS', t('students', 'Students'))}
            <div className={`grid transition-all duration-300 ease-in-out ${!!search.trim() || openSection === 'STUDENTS' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
              <ul className="overflow-hidden space-y-1 pt-0.5">
                <li><NavLink to="/students" className={navLinkClass}><Users className="w-[18px] h-[18px] text-teal-400" /> {t('studentList', 'Student List')}</NavLink></li>
                <li><NavLink to="/student-attendance" className={navLinkClass}><CheckCircle className="w-[18px] h-[18px] text-amber-400" /> {t('studentAttendance', 'Student Attendance')}</NavLink></li>
              </ul>
            </div>
          </div>
        )}

        {/* ONLINE EXAMS - TEACHER ONLY */}
        {userRole !== 'Staff' && (
          <div className="mb-2">
            {renderSectionHeader('ONLINE EXAMS', t('onlineExams', 'Online Exams'))}
            <div className={`grid transition-all duration-300 ease-in-out ${!!search.trim() || openSection === 'ONLINE EXAMS' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
              <ul className="overflow-hidden space-y-1 pt-0.5">
                <li><NavLink to="/online-exams" className={navLinkClass}><PenTool className="w-[18px] h-[18px] text-purple-400" /> {t('manageOnlineExams', 'Manage Online Exams')}</NavLink></li>
                <li><NavLink to="/question-bank" className={navLinkClass}><List className="w-[18px] h-[18px] text-cyan-400" /> {t('questionBank', 'Question Bank')}</NavLink></li>
              </ul>
            </div>
          </div>
        )}

        {/* EXAMS - TEACHER ONLY */}
        {userRole !== 'Staff' && (
          <div className="mb-2">
            {renderSectionHeader('EXAMS', t('exams', 'Exams'))}
            <div className={`grid transition-all duration-300 ease-in-out ${!!search.trim() || openSection === 'EXAMS' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
              <ul className="overflow-hidden space-y-1 pt-0.5">
                <li><NavLink to="/offline-exams" className={navLinkClass}><List className="w-[18px] h-[18px] text-pink-400" /> {t('manageOfflineExams', 'Manage Offline Exams')}</NavLink></li>
                <li><NavLink to="/admit-cards" className={navLinkClass}><CreditCard className="w-[18px] h-[18px] text-amber-400" /> {t('admitCards', 'Admit Cards')}</NavLink></li>
                <li><NavLink to="/enter-marks" className={navLinkClass}><Edit className="w-[18px] h-[18px] text-green-400" /> {t('enterMarks', 'Enter Marks')}</NavLink></li>
                <li><NavLink to="/upload-marksheet" className={navLinkClass}><UploadCloud className="w-[18px] h-[18px] text-purple-400" /> {t('uploadMarksheet', 'Upload Marksheet')}</NavLink></li>
                <li><NavLink to="/generate-marksheet" className={navLinkClass}><Printer className="w-[18px] h-[18px] text-blue-400" /> {t('generateMarksheet', 'Generate Marksheet')}</NavLink></li>
              </ul>
            </div>
          </div>
        )}

        {/* STUDY MANAGEMENT - TEACHER ONLY */}
        {userRole !== 'Staff' && (
          <div className="mb-2">
            {renderSectionHeader('STUDY MANAGEMENT', t('studyManagement', 'Study Management'))}
            <div className={`grid transition-all duration-300 ease-in-out ${!!search.trim() || openSection === 'STUDY MANAGEMENT' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
              <ul className="overflow-hidden space-y-1 pt-0.5">
                <li><NavLink to="/classwork" className={navLinkClass}><Book className="w-[18px] h-[18px] text-yellow-500" /> {t('classwork', 'Classwork & Logbook')}</NavLink></li>
                <li><NavLink to="/assignments" className={navLinkClass}><Edit className="w-[18px] h-[18px] text-red-400" /> {t('assignments', 'Homework & Assignments')}</NavLink></li>
              </ul>
            </div>
          </div>
        )}

        {/* DOCUMENTS & SERVICES */}
        <div className="mb-2">
          {renderSectionHeader('DOCUMENTS', userRole === 'Staff' ? t('officeServices', 'Office & Services') : t('documents', 'Documents'))}
          <div className={`grid transition-all duration-300 ease-in-out ${!!search.trim() || openSection === 'DOCUMENTS' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
            <ul className="overflow-hidden space-y-1 pt-0.5">
              <li><NavLink to="/certificates" className={navLinkClass}><Printer className="w-[18px] h-[18px] text-cyan-500" /> {t('certificates', 'Certificates & Documents')}</NavLink></li>
              <li><NavLink to="/apps-center" className={navLinkClass}><Grid className="w-[18px] h-[18px] text-orange-400" /> {t('appsCenter', 'Apps Center')}</NavLink></li>
              {userRole !== 'Staff' && (
                <>
                  <PTMMenu t={t} isOpen={openSubmenu === 'PTM Meetings' || !!search.trim()} onToggle={() => toggleSubmenu('PTM Meetings')} />
                  <LessonPlannerMenu t={t} isOpen={openSubmenu === 'Lesson Planner' || !!search.trim()} onToggle={() => toggleSubmenu('Lesson Planner')} />
                  <OSMMenu t={t} isOpen={openSubmenu === 'OSM Module' || !!search.trim()} onToggle={() => toggleSubmenu('OSM Module')} />
                  <AssessmentMenu t={t} isOpen={openSubmenu === 'Assessment' || !!search.trim()} onToggle={() => toggleSubmenu('Assessment')} />
                </>
              )}
              <LeadManagementMenu t={t} isOpen={openSubmenu === 'Lead Management' || !!search.trim()} onToggle={() => toggleSubmenu('Lead Management')} />
              <SurveysMenu t={t} isOpen={openSubmenu === 'Surveys & Feedback' || !!search.trim()} onToggle={() => toggleSubmenu('Surveys & Feedback')} />
            </ul>
          </div>
        </div>

        {/* COMMUNICATION */}
        <div className="mb-2">
          {renderSectionHeader('COMMUNICATION', t('communication', 'Communication'))}
          <div className={`grid transition-all duration-300 ease-in-out ${!!search.trim() || openSection === 'COMMUNICATION' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
            <ul className="overflow-hidden space-y-1 pt-0.5">
              <li><NavLink to="/messages" className={navLinkClass}><MessageCircle className="w-[18px] h-[18px] text-purple-400" /> {t('messages', 'Messages')}</NavLink></li>
              {userRole !== 'Staff' && (
                <HolisticProgressMenu t={t} isOpen={openSubmenu === 'Holistic Progress Card' || !!search.trim()} onToggle={() => toggleSubmenu('Holistic Progress Card')} />
              )}
            </ul>
          </div>
        </div>
        
        {/* ACCOUNT */}
        <div className="mb-2">
          {renderSectionHeader('ACCOUNT', t('account', 'Account'))}
          <div className={`grid transition-all duration-300 ease-in-out ${!!search.trim() || openSection === 'ACCOUNT' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}>
            <ul className="overflow-hidden space-y-1 pt-0.5">
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
        </div>
      </nav>

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

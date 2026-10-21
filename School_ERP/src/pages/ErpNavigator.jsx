import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Book, Settings, Users, Shield, Receipt, Layers, UserCog, MessageSquare, 
  Lightbulb, ChevronRight, GraduationCap, Laptop, Globe,
  Heart, CheckCircle2, Link as LinkIcon, UserPlus, 
  FileText, Calendar, PenTool, Image, FileBadge, Send, Bus, LogOut, Ticket,
  Sparkles, Compass, ArrowUpRight, Check, RotateCcw, Filter, Eye, ArrowRight,
  SlidersHorizontal, Award, Briefcase, Clock, Building, School, Network, Star, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ErpNavigator = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // States
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeRole, setActiveRole] = useState('School Admin');
  const [filterByRoleOnly, setFilterByRoleOnly] = useState(false);
  const [onlyCore, setOnlyCore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeHub, setActiveHub] = useState('Student Information');
  const [hoveredSpoke, setHoveredSpoke] = useState(null);
  const [showAllRoles, setShowAllRoles] = useState(false);

  // Institution Branding (from settings or fallback)
  const schoolName = localStorage.getItem('school_name') || 'Apex International Academy';

  // School Journey completed steps tracking
  const [completedJourneys, setCompletedJourneys] = useState(() => {
    try {
      const saved = localStorage.getItem('school_journey_progress');
      if (saved) return JSON.parse(saved);
      return [0, 1, 2, 3, 4, 5]; // Default demo progress: first 6 setup steps done
    } catch {
      return [0, 1, 2, 3];
    }
  });

  const toggleJourney = (index) => {
    setCompletedJourneys(prev => {
      const updated = prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index];
      localStorage.setItem('school_journey_progress', JSON.stringify(updated));
      return updated;
    });
  };

  const markAllJourneys = (completed) => {
    const updated = completed ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : [];
    setCompletedJourneys(updated);
    localStorage.setItem('school_journey_progress', JSON.stringify(updated));
  };

  // Keyboard shortcut listener for search focus '/'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 1. STATS METRICS
  const stats = [
    { value: '39', label: 'Integrated Modules', sub: 'Single unified database', icon: Layers, gradient: 'from-indigo-500 to-indigo-600', text: 'text-indigo-600', bg: 'bg-indigo-50/80 border-indigo-100' },
    { value: '237', label: 'Screen Endpoints', sub: 'Deep workflows & reports', icon: Laptop, gradient: 'from-blue-500 to-cyan-600', text: 'text-blue-600', bg: 'bg-blue-50/80 border-blue-100' },
    { value: '7', label: 'Functional Suites', sub: 'Academics to Finance', icon: Compass, gradient: 'from-purple-500 to-violet-600', text: 'text-purple-600', bg: 'bg-purple-50/80 border-purple-100' },
    { value: '53+', label: 'Module Connections', sub: 'Automated data flows', icon: Network, gradient: 'from-emerald-500 to-teal-600', text: 'text-emerald-600', bg: 'bg-emerald-50/80 border-emerald-100' },
  ];

  // 2. SCHOOL JOURNEY
  const journeys = [
    { title: 'Set up the school', sub: 'Profile, branding, and academic sessions', link: '/settings/school-settings', stage: 'Foundation' },
    { title: 'Classes & subjects', sub: 'Course streams, syllabi, and section splits', link: '/academics/subjects', stage: 'Academics' },
    { title: 'Add your staff', sub: 'Teachers, faculty roles, and payroll master', link: '/hr/staff/new', stage: 'Staff' },
    { title: 'Admit students', sub: 'Student records, parents, and document vault', link: '/students/admission', stage: 'Admissions' },
    { title: 'Build timetable', sub: 'Periods, room allocations, and faculty load', link: '/academics/timetable', stage: 'Scheduling' },
    { title: 'Take attendance', sub: 'Daily class, biometric, and QR check-ins', link: '/students/attendance', stage: 'Daily Operations' },
    { title: 'Set up & collect fees', sub: 'Fee heads, installment slabs, and online portal', link: '/finance/dashboard', stage: 'Finance' },
    { title: 'Run examinations', sub: 'Datesheets, hall tickets, marks, and report cards', link: '/assessment/offline-exams', stage: 'Assessments' },
    { title: 'Reach parents', sub: 'SMS, WhatsApp, circular notices, and alerts', link: '/communicate/compose-broadcast', stage: 'Engagement' },
    { title: 'Run transport', sub: 'GPS bus routes, stops, vehicle fleets, and passes', link: '/transport/dashboard', stage: 'Logistics' },
    { title: 'Go mobile & web', sub: 'Parent/student portal access and apps', link: '/apps-center', stage: 'Go-Live' }
  ];

  // 3. ROLE PERSONAS & ACCESS PROFILES
  const primaryRoles = [
    'School Admin', 'Principal (Head Of School)', 'Teacher', 'Accountant', 
    'Librarian', 'Receptionist', 'Academic Master', 'Administrator'
  ];

  const facultyRoles = [
    'Senior Teacher', 'Jr. Teacher', 'Biology', 'Chemistry', 'Telugu', 'English', 
    'Maths', 'Hindi', 'Computer', 'Science', 'Physics', 'P E T', 'Drawing', 
    'Nursery', 'L K G', 'U K G', 'Social'
  ];

  const staffRoles = [
    'Accounts Officer (Payable)', 'Accounts Officer (Cashier)', 'IT Engineer', 
    'Coordinator', 'Office', 'Incharge', 'Civil', 'Operator'
  ];

  const allRoles = [...primaryRoles, ...facultyRoles, ...staffRoles];

  // Role metadata & target module mappings
  const roleProfiles = {
    'School Admin': {
      type: 'admin',
      label: 'Super Administrator',
      desc: 'Institutional authority: full management across academics, finance, HR, and settings.',
      modules: ['Students', 'Academics', 'Finance & Fees', 'Staff', 'Operations', 'Engagement', 'Admin & Settings'],
    },
    'Principal (Head Of School)': {
      type: 'leadership',
      label: 'Head of Institution',
      desc: 'Academic standards, faculty oversight, NEP 2020 compliance, and institutional governance.',
      modules: ['Students', 'Academics', 'Staff', 'Engagement', 'Admin & Settings'],
    },
    'Administrator': {
      type: 'admin',
      label: 'System Administrator',
      desc: 'System configurations, role-based access controls, campus records, and IT security.',
      modules: ['Admin & Settings', 'Staff', 'Operations', 'Students'],
    },
    'Academic Master': {
      type: 'leadership',
      label: 'Academic Dean & Master',
      desc: 'Curriculum architecture, timetable coordination, exam oversight, and syllabus pacing.',
      modules: ['Academics', 'Students', 'Engagement'],
    },
    'Teacher': {
      type: 'teaching',
      label: 'Class Faculty',
      desc: 'Classroom attendance, offline & online assessments, homework, study center, and PTM logs.',
      modules: ['Academics', 'Students', 'Engagement'],
    },
    'Senior Teacher': {
      type: 'teaching',
      label: 'Senior Faculty Lead',
      desc: 'Curriculum oversight, assessment grading, lesson plans, mentor remarks, and student report cards.',
      modules: ['Academics', 'Students', 'Engagement'],
    },
    'Accountant': {
      type: 'finance',
      label: 'Chief Accountant',
      desc: 'Tuition collections, fee structures, pending dues, financial ledgers, and day-end registers.',
      modules: ['Finance & Fees', 'Operations', 'Admin & Settings'],
    },
    'Accounts Officer (Payable)': {
      type: 'finance',
      label: 'Payables Officer',
      desc: 'Vendor disbursements, asset acquisitions, payroll registers, and petty cash logs.',
      modules: ['Finance & Fees', 'Operations'],
    },
    'Accounts Officer (Cashier)': {
      type: 'finance',
      label: 'Fee Cashier',
      desc: 'Over-the-counter payments, instant receipt printing, online gateway reconciliations, and dues.',
      modules: ['Finance & Fees'],
    },
    'Receptionist': {
      type: 'reception',
      label: 'Front Desk Officer',
      desc: 'Admissions enquiry desk, visitor logs, visitor badges, gate passes, and parent reception.',
      modules: ['Operations', 'Students', 'Engagement'],
    },
    'Librarian': {
      type: 'library',
      label: 'Library Head',
      desc: 'Catalog accessioning, circulation desk, issue/return barcode scans, and overdue notices.',
      modules: ['Operations', 'Students'],
    },
    'IT Engineer': {
      type: 'it',
      label: 'Campus IT & Systems',
      desc: 'CCTV wall, biometric punch devices, QR attendance kiosks, portal setup, and hardware assets.',
      modules: ['Operations', 'Admin & Settings'],
    },
    'Coordinator': {
      type: 'leadership',
      label: 'Section Coordinator',
      desc: 'Period scheduling, substitute teachers, parent-teacher meetings, and student affairs.',
      modules: ['Academics', 'Students', 'Engagement'],
    }
  };

  const currentRoleProfile = roleProfiles[activeRole] || {
    type: 'teaching',
    label: `${activeRole} Specialist`,
    desc: `Subject instruction, syllabus lesson plans, marks entry, and student guidance for ${activeRole}.`,
    modules: ['Academics', 'Students', 'Engagement']
  };

  // 4. ACTION TASKS
  const taskIcons = [
    { n: 'Admit a new student', i: UserPlus, link: '/students/admission', category: 'Students', roles: ['admin', 'leadership', 'reception'] },
    { n: 'Collect fee payment', i: Receipt, link: '/finance/collect', category: 'Finance', roles: ['admin', 'finance'] },
    { n: 'Check pending fee dues', i: FileText, link: '/finance/search-due-fees', category: 'Finance', roles: ['admin', 'finance'] },
    { n: 'Assign fees to students', i: Shield, link: '/finance/assign', category: 'Finance', roles: ['admin', 'finance'] },
    { n: 'Take daily attendance', i: CheckCircle2, link: '/students/attendance', category: 'Students', roles: ['admin', 'teaching', 'leadership'] },
    { n: 'Enter exam marks', i: PenTool, link: '/offline-exams/enter-marks', category: 'Academics', roles: ['admin', 'teaching', 'leadership'] },
    { n: 'Grade CBC rubrics', i: Award, link: '/cbc/assessments', category: 'Academics', roles: ['admin', 'teaching', 'leadership'] },
    { n: 'Schedule an exam', i: Calendar, link: '/offline-exams/datesheet/manage', category: 'Academics', roles: ['admin', 'teaching', 'leadership'] },
    { n: 'Generate marksheets', i: FileText, link: '/offline-exams/generate-marksheet', category: 'Academics', roles: ['admin', 'teaching', 'leadership'] },
    { n: 'Create timetable', i: Calendar, link: '/academics/timetable', category: 'Academics', roles: ['admin', 'teaching', 'leadership'] },
    { n: 'Promote students a year', i: ChevronRight, link: '/academics/promote', category: 'Academics', roles: ['admin', 'leadership'] },
    { n: 'Post a notice / circular', i: MessageSquare, link: '/communicate/notice-board', category: 'Engagement', roles: ['admin', 'teaching', 'leadership', 'reception'] },
    { n: 'Send broadcast SMS / WhatsApp', i: Send, link: '/communicate/compose-broadcast', category: 'Engagement', roles: ['admin', 'leadership', 'reception'] },
    { n: 'Issue bonafide / TC certificate', i: FileBadge, link: '/certificates/document', category: 'Students', roles: ['admin', 'reception', 'leadership'] },
    { n: 'Print student ID cards', i: Image, link: '/id-cards/student', category: 'Students', roles: ['admin', 'reception', 'library', 'it'] },
    { n: 'Assign homework', i: Book, link: '/study-center/homework-assignments', category: 'Academics', roles: ['admin', 'teaching'] },
    { n: 'Add a staff member', i: UserPlus, link: '/hr/staff/new', category: 'Staff', roles: ['admin', 'leadership'] },
    { n: 'Manage transport routes & GPS', i: Bus, link: '/transport/dashboard', category: 'Operations', roles: ['admin', 'operations', 'leadership'] },
    { n: 'Issue or return library book', i: Book, link: '/library/issue-return', category: 'Operations', roles: ['admin', 'library'] },
    { n: 'Log visitor entry & badge', i: Users, link: '/front-office/visitor-book', category: 'Operations', roles: ['admin', 'reception'] },
    { n: 'Record admission enquiry', i: Lightbulb, link: '/front-office/admission-enquiries', category: 'Operations', roles: ['admin', 'reception', 'leadership'] },
    { n: 'Work CRM lead pipeline', i: Lightbulb, link: '/leads/pipeline', category: 'Students', roles: ['admin', 'reception', 'leadership'] },
    { n: 'Issue campus gate pass', i: Ticket, link: '/front-office/gate-passes/terminal', category: 'Operations', roles: ['admin', 'reception', 'operations'] },
    { n: 'Review statutory compliance', i: Shield, link: '/compliance/dashboard', category: 'Admin', roles: ['admin', 'leadership'] },
    { n: 'View institutional reports', i: Layers, link: '/reports', category: 'Admin', roles: ['admin', 'finance', 'leadership'] }
  ];

  // Filter Categories
  const filterCategories = [
    { name: 'All', count: 39, color: 'bg-indigo-600', textColor: 'text-indigo-700', activeBg: 'bg-indigo-600 text-white' },
    { name: 'Students', count: 5, color: 'bg-blue-100', textColor: 'text-blue-700', activeBg: 'bg-blue-600 text-white' },
    { name: 'Academics', count: 11, color: 'bg-purple-100', textColor: 'text-purple-700', activeBg: 'bg-purple-600 text-white' },
    { name: 'Finance & Fees', count: 2, color: 'bg-emerald-100', textColor: 'text-emerald-700', activeBg: 'bg-emerald-600 text-white' },
    { name: 'Staff', count: 1, color: 'bg-amber-100', textColor: 'text-amber-700', activeBg: 'bg-amber-600 text-white' },
    { name: 'Operations', count: 9, color: 'bg-teal-100', textColor: 'text-teal-700', activeBg: 'bg-teal-600 text-white' },
    { name: 'Engagement', count: 6, color: 'bg-rose-100', textColor: 'text-rose-700', activeBg: 'bg-rose-600 text-white' },
    { name: 'Admin & Settings', count: 5, color: 'bg-slate-100', textColor: 'text-slate-700', activeBg: 'bg-slate-700 text-white' },
  ];

  // 5. MODULE DATA (39 Modules / 237 Screens)
  const moduleData = [
    {
      categoryId: 'Students',
      categoryTitle: 'Students',
      categoryDesc: 'Admission to alumni — student biographical data, health logs, sibling mapping, and documentation.',
      categoryScreens: 24,
      theme: {
        bannerBg: 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700',
        cardBg: 'bg-white',
        border: 'border-blue-100 hover:border-blue-300',
        tagBg: 'bg-blue-50 text-blue-700 border-blue-200',
        iconBg: 'bg-blue-600 text-white shadow-blue-500/20',
        textDark: 'text-slate-900',
        textLight: 'text-blue-600',
      },
      items: [
        {
          title: 'Student Information',
          icon: Users,
          link: '/students/dashboard',
          core: true, count: 12,
          desc: 'The bedrock student master — admission records, sibling linkages, bio-data, guardian details, and archives.',
          connected: ['Academics', 'Fees Collection', 'Biometric Attendance', 'ID Cards', 'Transport', 'Lead Management', 'Certificates & Documents', 'Health Records']
        },
        {
          title: 'Certificates & Documents',
          icon: Shield,
          link: '/certificates/templates',
          core: true, count: 4,
          desc: 'Designed printable school credentials — Transfer Certificates (TC), Bonafide certificates, and Character proofs.',
          connected: ['Student Information', 'Offline Examinations']
        },
        {
          title: 'ID Cards Studio',
          icon: Image,
          link: '/id-cards/student',
          core: true, count: 4,
          desc: 'Visual badge designer with automated QR codes, barcode layouts, and batch printing for students and staff.',
          connected: ['Student Information', 'Human Resource']
        },
        {
          title: 'Lead Management (CRM)',
          icon: Lightbulb,
          link: '/leads/dashboard',
          core: false, count: 3,
          desc: 'Full admission enquiry funnel — stage kanban, follow-up call schedules, conversion tracking, and analytics.',
          connected: ['Front Office', 'Student Information', 'Communications']
        },
        {
          title: 'Student Health Records',
          icon: Heart,
          link: '/students/health',
          core: false, count: 1,
          desc: 'Medical checkup records, emergency contacts, allergy registers, and infirmary visit logs against student records.',
          connected: ['Student Information']
        }
      ]
    },
    {
      categoryId: 'Academics',
      categoryTitle: 'Academics & Curriculum',
      categoryDesc: 'Classes, timetables, lesson syllabus tracking, NEP 2020 competency rubrics, and comprehensive examinations.',
      categoryScreens: 63,
      theme: {
        bannerBg: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-700',
        cardBg: 'bg-white',
        border: 'border-purple-100 hover:border-purple-300',
        tagBg: 'bg-purple-50 text-purple-700 border-purple-200',
        iconBg: 'bg-purple-600 text-white shadow-purple-500/20',
        textDark: 'text-slate-900',
        textLight: 'text-purple-600',
      },
      items: [
        {
          title: 'Offline Examinations',
          icon: GraduationCap,
          link: '/assessment/offline-exams',
          core: true, count: 12,
          desc: 'Exams setup, datesheet generation, hall tickets, multi-component marks entry, moderation, and printed marksheets.',
          connected: ['Academics', 'CBC / Competency Academics', 'Certificates & Documents', 'Digital Evaluation (OSM)', 'Student Information']
        },
        {
          title: 'Academics Master',
          icon: Book,
          link: '/academics/dashboard',
          core: true, count: 11,
          desc: 'Classes, sections, subject offerings, academic year sessions, and conflict-free period timetable generator.',
          connected: ['Offline Examinations', 'CBC / Competency Academics', 'Lesson Planner', 'Homework', 'Human Resource']
        },
        {
          title: 'Lesson Planner',
          icon: Calendar,
          link: '/lesson-planner/dashboard',
          core: false, count: 8,
          desc: 'Lesson objectives mapped to syllabus, daily teaching plans, supervisory approvals, and curriculum completion metrics.',
          connected: ['Academics', 'Human Resource']
        },
        {
          title: 'CBC / Competency Academics',
          icon: Award,
          link: '/cbc/dashboard',
          core: false, count: 6,
          desc: 'Competency-based curriculum framework: learning areas, strands, 4-level performance rubrics, and pathways.',
          connected: ['Academics', 'Offline Examinations', 'Holistic Progress Card']
        },
        {
          title: 'Digital Evaluation (OSM)',
          icon: Laptop,
          link: '/osm-module/dashboard',
          core: false, count: 6,
          desc: 'On-Screen Marking (OSM): scanned answer script distribution, screen grading, annotation, and evaluator moderation.',
          connected: ['Offline Examinations']
        },
        {
          title: 'Holistic Progress Card (HPC)',
          icon: Users,
          link: '/cbc-academics/dashboard',
          core: false, count: 5,
          desc: 'NEP 2020 / PARAKH aligned 360-degree holistic cards — self, peer, parent, and teacher competency evaluations.',
          connected: ['CBC / Competency Academics', 'Offline Examinations']
        },
        {
          title: 'Continuous Assessment',
          icon: FileText,
          link: '/assessment/assessments',
          core: false, count: 4,
          desc: 'Formative quizzes, daily unit tests, internal assessments, and project work scores tracked separate from term exams.',
          connected: ['Academics', 'Offline Examinations']
        },
        {
          title: 'Online Examinations',
          icon: Laptop,
          link: '/online-exams/question-bank',
          core: false, count: 4,
          desc: 'MCQ & descriptive question banks, timed student test sessions, anti-cheat detection, and instant evaluation.',
          connected: ['Academics']
        },
        {
          title: 'Study Center & E-Library',
          icon: Layers,
          link: '/study-center/dashboard',
          core: false, count: 4,
          desc: 'Curated digital notes, syllabus PDFs, video lecture links, and past question papers shared by class and subject.',
          connected: ['Academics']
        },
        {
          title: 'Live Virtual Classes',
          icon: Laptop,
          link: '/live-classes/manage',
          core: false, count: 2,
          desc: 'Interactive live session scheduling with Zoom / Google Meet syncing and automated push notifications to apps.',
          connected: ['Academics']
        },
        {
          title: 'Homework & Assignments',
          icon: PenTool,
          link: '/study-center/homework-assignments',
          core: false, count: 1,
          desc: 'Daily homework assignments, submission deadlines, file attachment uploads, and teacher feedback notes.',
          connected: ['Academics', 'Student Information']
        }
      ]
    },
    {
      categoryId: 'Finance & Fees',
      categoryTitle: 'Finance & Fees',
      categoryDesc: 'Tuition collections, payment gateways, fee assignments, concession approvals, and institutional ledgers.',
      categoryScreens: 21,
      theme: {
        bannerBg: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700',
        cardBg: 'bg-white',
        border: 'border-emerald-100 hover:border-emerald-300',
        tagBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        iconBg: 'bg-emerald-600 text-white shadow-emerald-500/20',
        textDark: 'text-slate-900',
        textLight: 'text-emerald-600',
      },
      items: [
        {
          title: 'Fees Collection Master',
          icon: Receipt,
          link: '/finance/dashboard',
          core: true, count: 14,
          desc: 'Tuition structures, installment terms, cash/UPI/card counters, discount quotas, fines, and automated receipts.',
          connected: ['Student Information', 'Accounts & Finance', 'Transport', 'Hostel', 'Communications']
        },
        {
          title: 'Accounts & Ledger Books',
          icon: FileText,
          link: '/accounts/dashboard',
          core: false, count: 7,
          desc: 'Double-entry bookkeeping — chart of accounts, journal entries, vouchers, cash flow statements, and balance sheets.',
          connected: ['Fees Collection', 'Human Resource', 'Asset Management', 'Inventory']
        }
      ]
    },
    {
      categoryId: 'Staff',
      categoryTitle: 'Human Resources & Staff',
      categoryDesc: 'Teacher onboarding, biometric attendance records, salary payroll slips, and leave management.',
      categoryScreens: 15,
      theme: {
        bannerBg: 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700',
        cardBg: 'bg-white',
        border: 'border-amber-100 hover:border-amber-300',
        tagBg: 'bg-amber-50 text-amber-700 border-amber-200',
        iconBg: 'bg-amber-600 text-white shadow-amber-500/20',
        textDark: 'text-slate-900',
        textLight: 'text-amber-600',
      },
      items: [
        {
          title: 'Human Resource & Payroll',
          icon: UserCog,
          link: '/hr/dashboard',
          core: true, count: 15,
          desc: 'Staff digital dossier, biometric punches, leave applications, payroll slips, PF deductions, and performance reviews.',
          connected: ['Academics', 'Accounts & Finance', 'Biometric Attendance', 'ID Cards', 'Compliance & Governance']
        }
      ]
    },
    {
      categoryId: 'Operations',
      categoryTitle: 'Campus Operations & Logistics',
      categoryDesc: 'Front office, transport bus routes, hostel rooms, library catalogue, CCTV wall, and biometric punch devices.',
      categoryScreens: 54,
      theme: {
        bannerBg: 'bg-gradient-to-r from-teal-600 via-cyan-700 to-emerald-700',
        cardBg: 'bg-white',
        border: 'border-teal-100 hover:border-teal-300',
        tagBg: 'bg-teal-50 text-teal-700 border-teal-200',
        iconBg: 'bg-teal-600 text-white shadow-teal-500/20',
        textDark: 'text-slate-900',
        textLight: 'text-teal-600',
      },
      items: [
        {
          title: 'Campus Inventory',
          icon: Layers,
          link: '/inventory/dashboard',
          core: false, count: 11,
          desc: 'School supply store, uniform distribution, textbook inventory, purchase orders, and vendor stock issuances.',
          connected: ['Accounts & Finance']
        },
        {
          title: 'Fixed Asset Management',
          icon: CheckCircle2,
          link: '/asset-management/dashboard',
          core: false, count: 9,
          desc: 'Campus assets register, barcode tracking, classroom furniture audits, maintenance logs, and depreciation schedules.',
          connected: ['Accounts & Finance']
        },
        {
          title: 'Front Office & Reception',
          icon: MessageSquare,
          link: '/front-office/dashboard',
          core: false, count: 8,
          desc: 'Visitor badges, parent walk-in logs, gate passes, phone inquiries, incoming/outgoing postal dispatches, and grievances.',
          connected: ['Lead Management', 'Student Information']
        },
        {
          title: 'Transport & Fleet',
          icon: Bus,
          link: '/transport/dashboard',
          core: false, count: 6,
          desc: 'Bus routes, pickup/drop stops, vehicle fitness certificates, driver assignments, and live student boarding logs.',
          connected: ['Fees Collection', 'Student Information']
        },
        {
          title: 'Hostel & Residential',
          icon: Users,
          link: '/hostel/dashboard',
          core: false, count: 5,
          desc: 'Dormitory blocks, room allocations, bed availability, warden logs, and boarder mess fee management.',
          connected: ['Fees Collection', 'Student Information']
        },
        {
          title: 'Biometric Attendance Devices',
          icon: CheckCircle2,
          link: '/biometric/all-devices',
          core: false, count: 4,
          desc: 'Hardware device fleet (ZKTeco/eSSL), real-time punch ingestion, IP configuration, and staff/student syncing.',
          connected: ['Human Resource', 'Student Information']
        },
        {
          title: 'Library Management',
          icon: Book,
          link: '/library/dashboard',
          core: false, count: 4,
          desc: 'Catalog accessioning, barcode scanning, book issues/returns, fine calculations, and digital book reservations.',
          connected: ['Student Information']
        },
        {
          title: 'QR Code Attendance Kiosk',
          icon: CheckCircle2,
          link: '/students/dashboard',
          core: false, count: 4,
          desc: 'Fast kiosk attendance mode: students and staff scan their physical barcode/QR badge at campus entrances.',
          connected: ['Student Information']
        },
        {
          title: 'CCTV & Live Surveillance',
          icon: Laptop,
          link: '/cctv/cameras',
          core: false, count: 3,
          desc: 'Central security control wall — RTSP camera streams, campus monitoring, and security gate monitoring.',
          connected: ['Biometric Attendance']
        }
      ]
    },
    {
      categoryId: 'Engagement',
      categoryTitle: 'Engagement & Communications',
      categoryDesc: 'Broadcast notices, WhatsApp/SMS alerts, parent-teacher conferences, and moderated communication channels.',
      categoryScreens: 26,
      theme: {
        bannerBg: 'bg-gradient-to-r from-rose-600 via-pink-600 to-red-600',
        cardBg: 'bg-white',
        border: 'border-rose-100 hover:border-rose-300',
        tagBg: 'bg-rose-50 text-rose-700 border-rose-200',
        iconBg: 'bg-rose-600 text-white shadow-rose-500/20',
        textDark: 'text-slate-900',
        textLight: 'text-rose-600',
      },
      items: [
        {
          title: 'Parent-Teacher Meetings (PTM)',
          icon: Users,
          link: '/ptm/dashboard',
          core: false, count: 6,
          desc: 'Conference slot booking, teacher remarks, attendance logs, and automated SMS appointment reminders for parents.',
          connected: ['Communications', 'Offline Examinations']
        },
        {
          title: 'Multi-Channel Communications',
          icon: Send,
          link: '/communicate/notice-board',
          core: false, count: 5,
          desc: 'School digital notice board, mass SMS, WhatsApp gateway, parent circulars, and email broadcast logs.',
          connected: ['Student Information', 'Fees Collection', 'Offline Examinations', 'Parent-Teacher Meetings']
        },
        {
          title: 'Creatives & Social Studio',
          icon: Image,
          link: '/engagement/creatives',
          core: false, count: 5,
          desc: 'Branded school festival banners, student birthday cards, achievement spotlights, and portal notices.',
          connected: ['Communications']
        },
        {
          title: 'Surveys & Community Feedback',
          icon: CheckCircle2,
          link: '/messages',
          core: false, count: 5,
          desc: 'Digital questionnaires, parent satisfaction feedback surveys, student polls, and analytics dashboards.',
          connected: ['Communications']
        },
        {
          title: 'AI Knowledge Base & Helpdesk',
          icon: MessageSquare,
          link: '/help-center/ai-chatbot',
          core: false, count: 3,
          desc: 'School policy FAQs, self-service knowledge base, and automated AI assistance for staff and parents.',
          connected: ['Communications']
        },
        {
          title: 'Teacher-Parent Direct Chat',
          icon: MessageSquare,
          link: '/chat-moderation',
          core: false, count: 2,
          desc: 'Secure and monitored messaging channels between teachers and guardians with compliance audit trails.',
          connected: ['Communications', 'Student Information']
        }
      ]
    },
    {
      categoryId: 'Admin & Settings',
      categoryTitle: 'Governance, Settings & Platform',
      categoryDesc: 'Statutory compliance, public website manager, audit logs, system backups, and cross-departmental analytics.',
      categoryScreens: 34,
      theme: {
        bannerBg: 'bg-gradient-to-r from-slate-700 via-slate-800 to-zinc-900',
        cardBg: 'bg-white',
        border: 'border-slate-200 hover:border-slate-400',
        tagBg: 'bg-slate-100 text-slate-800 border-slate-200',
        iconBg: 'bg-slate-800 text-white shadow-slate-900/20',
        textDark: 'text-slate-900',
        textLight: 'text-slate-700',
      },
      items: [
        {
          title: 'Compliance & Governance',
          icon: Shield,
          link: '/compliance/dashboard',
          core: false, count: 12,
          desc: 'State statutory document vault, APAAR/PEN verification, fire/safety certificates, and board compliance audits.',
          connected: ['Academics', 'Human Resource', 'Student Information']
        },
        {
          title: 'School Public Website CMS',
          icon: Globe,
          link: '/school-settings',
          core: false, count: 10,
          desc: 'Institutional web pages, news updates, photo galleries, mandatory disclosures, and online enquiry widgets.',
          connected: ['Communications', 'Lead Management']
        },
        {
          title: 'System & Institutional Settings',
          icon: Settings,
          link: '/settings/school-settings',
          core: false, count: 10,
          desc: 'Institutional logo/branding, academic sessions, role permissions, automated database backups, and security logs.',
          connected: ['All Modules']
        },
        {
          title: 'Apps & Utility Center',
          icon: Layers,
          link: '/apps-center',
          core: false, count: 1,
          desc: 'Built-in staff utilities: interactive digital whiteboard, unit converters, PDF tools, and productivity gadgets.',
          connected: []
        },
        {
          title: 'Consolidated Reports & Registers',
          icon: FileText,
          link: '/reports',
          core: false, count: 1,
          desc: 'Comprehensive multi-department reporting — student admissions, fee collections, exam marks, and financial ledgers.',
          connected: ['All Modules']
        }
      ]
    }
  ];

  // 6. INTERACTIVE MIND MAP DATA (Hub & Spoke architecture)
  const hubData = {
    'Student Information': {
      icon: Users,
      themeColor: 'indigo',
      totalLinks: 17,
      openLink: '/students/dashboard',
      description: 'The core profile registry driving attendance, grading, fee demands, bus manifests, and credentials.',
      spokes: [
        { name: 'Transport (Bus Fleet)', color: 'border-teal-500 text-teal-800 bg-teal-50/70', x: 20, y: 18, link: '/transport/dashboard', relation: 'Routes, bus stops, boarding passes, and pick-up/drop alerts' },
        { name: 'Academics & Classes', color: 'border-purple-500 text-purple-800 bg-purple-50/70', x: 50, y: 12, link: '/academics/dashboard', isHub: true, relation: 'Class, section, and subject enrollments' },
        { name: 'Biometric Attendance', color: 'border-teal-700 text-teal-800 bg-teal-50/70', x: 80, y: 18, link: '/biometric/all-devices', relation: 'Fingerprint & facial biometric punch mappings' },
        { name: 'Certificates & Documents', color: 'border-blue-600 text-blue-800 bg-blue-50/70', x: 86, y: 36, link: '/certificates/templates', relation: 'Bonafide, transfer, and character certificate generations' },
        { name: 'Student Health Logs', color: 'border-blue-500 text-blue-800 bg-blue-50/70', x: 14, y: 36, link: '/students/health', relation: 'Allergies, blood groups, and medical clinic visits' },
        { name: 'Teacher-Parent Chat', color: 'border-pink-500 text-pink-800 bg-pink-50/70', x: 16, y: 55, link: '/chat-moderation', relation: 'Safe parent & teacher messaging channels' },
        { name: 'Communications (SMS/WA)', color: 'border-rose-500 text-rose-800 bg-rose-50/70', x: 84, y: 55, link: '/communicate/notice-board', relation: 'Targeted SMS, WhatsApp, and notice broadcasts' },
        { name: 'QR Attendance Kiosk', color: 'border-teal-600 text-teal-800 bg-teal-50/70', x: 20, y: 72, link: '/students/attendance', relation: 'Kiosk student ID card barcode & QR scanning' },
        { name: 'Compliance & APAAR', color: 'border-slate-500 text-slate-800 bg-slate-50/70', x: 80, y: 72, link: '/compliance/dashboard', relation: 'PEN, APAAR ID, and statutory civil documentation' },
        { name: 'Offline Examinations', color: 'border-purple-600 text-purple-800 bg-purple-50/70', x: 30, y: 88, link: '/assessment/offline-exams', isHub: true, relation: 'Admit cards, hall seating, marks, and marksheets' },
        { name: 'Library Management', color: 'border-teal-600 text-teal-800 bg-teal-50/70', x: 50, y: 90, link: '/library/dashboard', relation: 'Library card barcode, book loans, and overdue dues' },
        { name: 'Fees Collection', color: 'border-emerald-600 text-emerald-800 bg-emerald-50/70', x: 70, y: 88, link: '/finance/dashboard', isHub: true, relation: 'Tuition dues, fine waivers, and payment receipts' },
      ]
    },
    'Academics': {
      icon: Book,
      themeColor: 'purple',
      totalLinks: 9,
      openLink: '/academics/dashboard',
      description: 'Syllabus frameworks, section timetables, faculty load, and continuous student evaluations.',
      spokes: [
        { name: 'Student Information', color: 'border-indigo-500 text-indigo-800 bg-indigo-50/70', x: 22, y: 22, link: '/students/dashboard', isHub: true, relation: 'Student class roster and section assignments' },
        { name: 'Timetable Schedules', color: 'border-purple-500 text-purple-800 bg-purple-50/70', x: 50, y: 14, link: '/academics/timetable', relation: 'Period timings, room bookings, and teacher conflict checks' },
        { name: 'Offline Examinations', color: 'border-purple-600 text-purple-800 bg-purple-50/70', x: 78, y: 22, link: '/assessment/offline-exams', isHub: true, relation: 'Datesheets, grading schemes, and report cards' },
        { name: 'Study Center & Notes', color: 'border-emerald-500 text-emerald-800 bg-emerald-50/70', x: 16, y: 55, link: '/study-center/dashboard', relation: 'Class syllabus notes, assignments, and e-learning resources' },
        { name: 'Statutory Compliance', color: 'border-slate-500 text-slate-800 bg-slate-50/70', x: 84, y: 55, link: '/compliance/dashboard', relation: 'NEP 2020 curriculum mandates and board affiliations' },
        { name: 'Live Classes Online', color: 'border-red-500 text-red-800 bg-red-50/70', x: 24, y: 84, link: '/live-classes/manage', relation: 'Virtual classrooms, Zoom / Google Meet integration' },
        { name: 'CBC Competencies', color: 'border-amber-600 text-amber-800 bg-amber-50/70', x: 50, y: 88, link: '/cbc/dashboard', relation: 'Learning strands, performance rubrics, and pathways' },
        { name: 'Human Resource (Faculty)', color: 'border-blue-500 text-blue-800 bg-blue-50/70', x: 76, y: 84, link: '/hr/dashboard', isHub: true, relation: 'Teacher subject allotments and timetable periods' },
      ]
    },
    'Fees Collection': {
      icon: Receipt,
      themeColor: 'emerald',
      totalLinks: 6,
      openLink: '/finance/dashboard',
      description: 'Fee structures, automated dues tracking, online payments, reconciliations, and ledgers.',
      spokes: [
        { name: 'Student Information', color: 'border-indigo-500 text-indigo-800 bg-indigo-50/70', x: 26, y: 22, link: '/students/dashboard', isHub: true, relation: 'Student profile fee structure and sibling discounts' },
        { name: 'Transport Bus Dues', color: 'border-teal-500 text-teal-800 bg-teal-50/70', x: 74, y: 22, link: '/transport/dashboard', relation: 'Slab-based bus fare calculations by route distance' },
        { name: 'Hostel Fees', color: 'border-emerald-500 text-emerald-800 bg-emerald-50/70', x: 18, y: 56, link: '/hostel/dashboard', relation: 'Hostel accommodation, mess, and facility dues' },
        { name: 'Double-Entry Ledgers', color: 'border-blue-500 text-blue-800 bg-blue-50/70', x: 82, y: 56, link: '/accounts/dashboard', relation: 'Double-entry journal ledgers and bank reconciliations' },
        { name: 'Online Payment Gateway', color: 'border-purple-500 text-purple-800 bg-purple-50/70', x: 32, y: 84, link: '/settings/school-settings', relation: 'UPI, card, and net-banking automated receipt generation' },
        { name: 'Financial Ledgers & Reports', color: 'border-slate-500 text-slate-800 bg-slate-50/70', x: 68, y: 84, link: '/reports', relation: 'Dues analysis, defalcation registers, and collection summaries' },
      ]
    },
    'Offline Examinations': {
      icon: GraduationCap,
      themeColor: 'violet',
      totalLinks: 7,
      openLink: '/assessment/offline-exams',
      description: 'Term exam cycles, hall tickets, multi-teacher grading, moderation, and printed marksheets.',
      spokes: [
        { name: 'Academics (Syllabus)', color: 'border-purple-500 text-purple-800 bg-purple-50/70', x: 25, y: 22, link: '/academics/dashboard', isHub: true, relation: 'Subject mappings, syllabus weightage, and grade thresholds' },
        { name: 'Student Roster', color: 'border-indigo-500 text-indigo-800 bg-indigo-50/70', x: 75, y: 22, link: '/students/dashboard', isHub: true, relation: 'Candidate roll numbers and student passport photos' },
        { name: 'Fee Dues Clearance', color: 'border-emerald-500 text-emerald-800 bg-emerald-50/70', x: 16, y: 56, link: '/finance/dashboard', isHub: true, relation: 'No-dues clearance verification for hall ticket printing' },
        { name: 'Faculty Evaluators', color: 'border-blue-500 text-blue-800 bg-blue-50/70', x: 84, y: 56, link: '/hr/dashboard', isHub: true, relation: 'Evaluator assignment and marks entry portals' },
        { name: 'CBC Competency Rubrics', color: 'border-amber-500 text-amber-800 bg-amber-50/70', x: 26, y: 84, link: '/cbc/dashboard', relation: 'Competency integration and descriptive indicator reports' },
        { name: 'CBSE Marksheet Studio', color: 'border-teal-500 text-teal-800 bg-teal-50/70', x: 50, y: 90, link: '/offline-exams/generate-marksheet', relation: 'Official marksheet layout formatting and PDF printing' },
        { name: 'Parent Portal Publish', color: 'border-slate-500 text-slate-800 bg-slate-50/70', x: 74, y: 84, link: '/ptm/dashboard', relation: 'Instant result publishing to parent mobile app' },
      ]
    },
    'Human Resource': {
      icon: UserCog,
      themeColor: 'amber',
      totalLinks: 8,
      openLink: '/hr/dashboard',
      description: 'Staff payroll, biometric punch sync, leave approvals, and faculty allotments.',
      spokes: [
        { name: 'Biometric Device Fleet', color: 'border-teal-500 text-teal-800 bg-teal-50/70', x: 26, y: 20, link: '/biometric/all-devices', relation: 'Employee biometric punches and overtime calculations' },
        { name: 'Faculty ID Badges', color: 'border-red-500 text-red-800 bg-red-50/70', x: 50, y: 14, link: '/id-cards/staff', relation: 'Staff barcode ID cards and access badge generation' },
        { name: 'Academics Allotments', color: 'border-purple-500 text-purple-800 bg-purple-50/70', x: 74, y: 20, link: '/academics/dashboard', isHub: true, relation: 'Teacher subject qualifications and period limits' },
        { name: 'Accounts Payroll Ledger', color: 'border-emerald-500 text-emerald-800 bg-emerald-50/70', x: 16, y: 56, link: '/accounts/dashboard', relation: 'Salary payroll slips, PF, ESI, and tax deductions' },
        { name: 'Leave & Absence Balances', color: 'border-blue-500 text-blue-800 bg-blue-50/70', x: 84, y: 56, link: '/hr/staff-attendance', relation: 'Casual, sick, and earned leave approval workflows' },
        { name: 'Campus Gate Passes', color: 'border-orange-500 text-orange-800 bg-orange-50/70', x: 26, y: 84, link: '/front-office/dashboard', relation: 'Staff duty gate pass logs and departure tracking' },
        { name: 'Transport Fleet Drivers', color: 'border-teal-500 text-teal-800 bg-teal-50/70', x: 74, y: 84, link: '/transport/dashboard', relation: 'Bus driver licenses, route duties, and emergency contacts' },
      ]
    }
  };

  const currentHub = hubData[activeHub] || hubData['Student Information'];
  const ActiveHubIcon = currentHub.icon;

  // Filter Tasks based on Search & Role Persona
  const filteredTasks = taskIcons.filter(t => {
    const matchesSearch = t.n.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterByRoleOnly) {
      return t.roles.includes(currentRoleProfile.type);
    }
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/70 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* 1. HERO HEADER WITH INSTITUTION BRANDING */}
      <div className="bg-gradient-to-b from-white via-white to-slate-50/80 border-b border-slate-200/80 pt-8 pb-10 px-6 md:px-12 shadow-sm">
        <div className="max-w-[1700px] mx-auto w-full">
          
          {/* Top Pill & Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                <span>Central System Map & Live Workflow Navigator</span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span className="font-medium text-slate-600">{schoolName}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                Explore Your School ERP
              </h1>
              <p className="text-sm md:text-base text-slate-600 max-w-3xl mt-1.5 leading-relaxed font-normal">
                An interconnected architecture of all 39 institutional modules and 237 operational screens. Switch your role below to focus on your day-to-day duties, or trace data links between campus departments.
              </p>
            </div>

            {/* Quick Actions Header */}
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => navigate('/settings/school-settings')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs flex items-center gap-2 transition-all hover:border-slate-300"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span>System Settings</span>
              </button>
              <button 
                onClick={() => navigate('/students/admission')}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm hover:shadow-indigo-500/20 flex items-center gap-2 transition-all"
              >
                <UserPlus className="w-4 h-4 text-indigo-100" />
                <span>Admit Student</span>
              </button>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div 
                  key={i} 
                  className="flex items-center gap-4 p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-none">{s.value}</h3>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">Live</span>
                    </div>
                    <p className="text-xs font-bold text-slate-700 mt-1">{s.label}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{s.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      <div className="px-6 md:px-12 max-w-[1700px] mx-auto w-full mt-8 space-y-12">

        {/* 2. SCHOOL JOURNEY ROADMAP (INTERACTIVE ONBOARDING CHECKLIST) */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    Institutional Journey Roadmap
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Recommended implementation sequence — track onboarding progress and click any stage to open its screen.
                  </p>
                </div>
              </div>
            </div>

            {/* Live Progress Indicator & Reset */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800">
                    {completedJourneys.length} of {journeys.length} Completed
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {Math.round((completedJourneys.length / journeys.length) * 100)}% Onboarded
                  </p>
                </div>
                <div className="w-28 md:w-36 h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(completedJourneys.length / journeys.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                <button 
                  onClick={() => markAllJourneys(true)}
                  title="Mark all as completed"
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-emerald-600 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => markAllJourneys(false)}
                  title="Reset journey progress"
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-rose-600 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal Scroll Journey Cards */}
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent snap-x snap-mandatory">
            {journeys.map((j, i) => {
              const isDone = completedJourneys.includes(i);
              return (
                <div 
                  key={i}
                  className={`snap-start shrink-0 w-[280px] rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between group ${
                    isDone 
                      ? 'bg-emerald-50/40 border-emerald-200/80 hover:bg-emerald-50/80 shadow-xs' 
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        Stage 0{i + 1} • {j.stage}
                      </span>

                      {/* Interactive toggle checkbox */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleJourney(i);
                        }}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                          isDone 
                            ? 'bg-emerald-600 text-white shadow-xs' 
                            : 'border border-slate-300 text-transparent hover:border-slate-400 bg-white'
                        }`}
                        title={isDone ? 'Mark incomplete' : 'Mark completed'}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-1">
                      {j.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-snug line-clamp-2">
                      {j.sub}
                    </p>
                  </div>

                  {/* Launch screen button */}
                  <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">
                      {isDone ? 'Configured' : 'Pending Setup'}
                    </span>
                    <button 
                      onClick={() => navigate(j.link)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      <span>Open Screen</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. ROLE SELECTOR & PERSONA HIGHLIGHT ("I AM A...") */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserCog className="w-4 h-4 text-indigo-600" />
                <span>Persona & Role Architecture ("I AM A...")</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Select your institutional role to view contextual duties, role-specific actions, and priority modules.
              </p>
            </div>

            {/* Quick Filter toggle */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer select-none bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <input 
                  type="checkbox"
                  checked={filterByRoleOnly}
                  onChange={(e) => setFilterByRoleOnly(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-700">Filter modules to this persona</span>
              </label>
              {activeRole !== 'School Admin' && (
                <button
                  onClick={() => {
                    setActiveRole('School Admin');
                    setFilterByRoleOnly(false);
                  }}
                  className="text-xs text-slate-500 hover:text-indigo-600 font-medium underline"
                >
                  Reset to Super Admin
                </button>
              )}
            </div>
          </div>

          {/* Primary Roles Row */}
          <div className="flex flex-wrap gap-2.5 mb-3">
            {primaryRoles.map((r, i) => {
              const isActive = activeRole === r;
              return (
                <button 
                  key={i} 
                  onClick={() => setActiveRole(r)}
                  className={`rounded-xl text-xs font-bold border transition-all duration-200 flex items-center gap-2 px-3.5 py-2 ${
                    isActive 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm scale-102 ring-2 ring-indigo-200' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <UserPlus className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`} />
                  <span>{r}</span>
                  {isActive && (
                    <span className="bg-white/20 text-white px-1.5 py-0.5 rounded-md text-[9px] uppercase tracking-wider font-extrabold">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Secondary / Faculty Roles Toggle */}
          <div className="mt-3">
            <button
              onClick={() => setShowAllRoles(!showAllRoles)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1.5 mb-3"
            >
              <span>{showAllRoles ? 'Hide subject & specialized faculty roles' : `Show all 37 specialized roles (Faculty, IT, Accounts & Operations)`}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAllRoles ? 'rotate-90' : ''}`} />
            </button>

            {showAllRoles && (
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4 animate-in fade-in duration-200">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Subject Teachers & Academic Faculty</p>
                  <div className="flex flex-wrap gap-2">
                    {facultyRoles.map((r, i) => {
                      const isActive = activeRole === r;
                      return (
                        <button
                          key={i}
                          onClick={() => setActiveRole(r)}
                          className={`rounded-lg text-xs font-semibold px-3 py-1.5 border transition-all ${
                            isActive 
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {r}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Finance, Operations & Technical Staff</p>
                  <div className="flex flex-wrap gap-2">
                    {staffRoles.map((r, i) => {
                      const isActive = activeRole === r;
                      return (
                        <button
                          key={i}
                          onClick={() => setActiveRole(r)}
                          className={`rounded-lg text-xs font-semibold px-3 py-1.5 border transition-all ${
                            isActive 
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {r}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Active Persona Spotlight Banner */}
          <div className="mt-5 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-indigo-950">
                    Viewing as: {activeRole}
                  </h4>
                  <span className="text-[11px] font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md">
                    {currentRoleProfile.label}
                  </span>
                </div>
                <p className="text-xs text-indigo-900/80 mt-0.5 max-w-2xl">
                  {currentRoleProfile.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-semibold text-indigo-700 bg-white px-3 py-1.5 rounded-xl border border-indigo-200 shadow-xs">
                {currentRoleProfile.modules.length} Recommended Module Suites
              </span>
            </div>
          </div>
        </section>

        {/* 4. INSTANT LAUNCH TASKS ("WHAT CAN I DO?") */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-amber-500 text-lg leading-none">⚡</span>
                <h2 className="text-base font-bold text-slate-900">
                  Instant Action Launcher ("WHAT CAN I DO?")
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {filteredTasks.length} common workflows you can initiate immediately with a single click.
              </p>
            </div>

            {searchQuery && (
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                Filtering by "{searchQuery}"
              </span>
            )}
          </div>

          {/* Action Tasks Grid */}
          <div className="flex flex-wrap gap-2.5">
            {filteredTasks.map((t, i) => {
              const Icon = t.i;
              return (
                <button 
                  key={i} 
                  onClick={() => navigate(t.link)}
                  className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-50/70 hover:bg-indigo-50 border border-slate-200/90 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 transition-all duration-200 shadow-2xs hover:shadow-sm"
                >
                  <Icon className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <span>{t.n}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 opacity-60 group-hover:opacity-100 transition-all" />
                </button>
              );
            })}
            {filteredTasks.length === 0 && (
              <div className="p-8 text-center w-full">
                <p className="text-xs text-slate-400">No actions matched your query for this persona.</p>
              </div>
            )}
          </div>
        </section>

        {/* 5. HOW EVERYTHING CONNECTS (INTERACTIVE HUB & SPOKE MIND MAP) */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Network className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    How Everything Connects (Inter-Departmental Architecture)
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    53 automated data pathways between modules. Pick a central hub to inspect live connections and trace data flows.
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate(currentHub.openLink)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-all"
            >
              <ActiveHubIcon className="w-3.5 h-3.5" />
              <span>Launch {activeHub}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Hub Selector Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.keys(hubData).map((hubName) => {
              const HubIcon = hubData[hubName].icon;
              const isActive = activeHub === hubName;
              return (
                <button 
                  key={hubName}
                  onClick={() => {
                    setActiveHub(hubName);
                    setHoveredSpoke(null);
                  }}
                  className={`text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-200' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <HubIcon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-200' : 'text-slate-500'}`} />
                  <span>{hubName}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isActive ? 'bg-indigo-500/80 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {hubData[hubName].totalLinks}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Spoke Relationship Preview Bar */}
          <div className="min-h-[44px] mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs transition-all">
            {hoveredSpoke ? (
              <div className="flex items-center gap-2 text-slate-800">
                <span className="font-extrabold text-indigo-600">{activeHub}</span>
                <span className="text-slate-400 font-bold">⇄</span>
                <span className="font-extrabold text-slate-900">{hoveredSpoke.name}:</span>
                <span className="text-slate-600 font-medium">{hoveredSpoke.relation}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-400 italic">
                <Eye className="w-3.5 h-3.5" />
                <span>Hover over any satellite node to preview data synchronization details, or click to open.</span>
              </div>
            )}
            {hoveredSpoke && (
              <button 
                onClick={() => navigate(hoveredSpoke.link)}
                className="text-[11px] font-bold text-indigo-600 hover:underline shrink-0 ml-3 flex items-center gap-1"
              >
                <span>Navigate</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Interactive Mind Map Visualizer Canvas */}
          <div className="relative w-full h-[460px] md:h-[520px] rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50/70 via-white to-indigo-50/20 overflow-hidden shadow-inner select-none">
            
            {/* SVG Connecting Flow Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {currentHub.spokes.map((n, i) => {
                const isHovered = hoveredSpoke?.name === n.name;
                return (
                  <line 
                    key={i} 
                    x1="50" 
                    y1="50" 
                    x2={n.x} 
                    y2={n.y} 
                    stroke={isHovered ? '#4f46e5' : '#818cf8'} 
                    strokeWidth={isHovered ? '0.6' : '0.25'} 
                    strokeDasharray={isHovered ? '1 0.5' : 'none'}
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>
            
            {/* Pulsing Central Hub Node */}
            <div 
              onClick={() => navigate(currentHub.openLink)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white w-36 h-36 md:w-44 md:h-44 rounded-3xl flex flex-col items-center justify-center shadow-xl ring-8 ring-indigo-100/70 z-20 cursor-pointer hover:scale-105 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-1 group-hover:rotate-6 transition-transform">
                <ActiveHubIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xs md:text-sm text-center leading-tight px-3 drop-shadow-xs">
                {activeHub}
              </span>
              <span className="text-[10px] font-semibold text-indigo-200 mt-1 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                {currentHub.totalLinks} Linked Modules
              </span>
              <span className="text-[9px] text-indigo-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to Open Hub ↗
              </span>
            </div>

            {/* Satellite Spoke Nodes */}
            {currentHub.spokes.map((n, i) => {
              const isHovered = hoveredSpoke?.name === n.name;
              return (
                <div 
                  key={i} 
                  onMouseEnter={() => setHoveredSpoke(n)}
                  onMouseLeave={() => setHoveredSpoke(null)}
                  onClick={() => navigate(n.link)}
                  className={`absolute px-3 py-2 rounded-xl border-2 ${n.color} shadow-sm font-bold text-xs -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-10 whitespace-nowrap backdrop-blur-md flex items-center gap-1.5 group ${
                    isHovered ? 'scale-115 z-30 shadow-lg ring-4 ring-indigo-200' : 'hover:scale-105'
                  }`} 
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                >
                  <LinkIcon className="w-3 h-3 opacity-60 group-hover:text-indigo-600" />
                  <span>{n.name}</span>
                  {n.isHub && (
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHub(n.name.split(' ')[0] === 'Offline' ? 'Offline Examinations' : n.name.split(' ')[0]);
                      }}
                      title="Set as central hub"
                      className="ml-1 text-[9px] bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-1 rounded cursor-pointer"
                    >
                      Focus
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. STICKY SEARCH & FILTER CONTROL BAR */}
        <div className="sticky top-2 z-40 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 shadow-lg shadow-slate-900/5">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
                placeholder='Search 237 screens (e.g., "marksheet", "fees", "timetable")...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                {searchQuery ? (
                  <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-200 rounded bg-white">
                    /
                  </kbd>
                )}
              </div>
            </div>

            {/* Core Only Toggle */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-600">
                <input 
                  type="checkbox"
                  checked={onlyCore}
                  onChange={(e) => setOnlyCore(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>Core Modules Only</span>
              </label>

              <div className="text-xs font-medium text-slate-400">
                {searchQuery ? 'Live Search Active' : 'All Modules Active'}
              </div>
            </div>

          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-3 border-t border-slate-100 mt-3 scrollbar-none">
            {filterCategories.map((cat, idx) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : `bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100`
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                    isActive ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. COMPREHENSIVE MODULE SUITES DIRECTORY */}
        <div className="space-y-16">
          {moduleData
            .filter(cat => activeCategory === 'All' || cat.categoryId === activeCategory)
            .map((category, idx) => {
              // Filter items within category
              const filteredItems = category.items.filter(item => {
                const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                     item.desc.toLowerCase().includes(searchQuery.toLowerCase());
                if (!matchesSearch) return false;
                if (onlyCore && !item.core) return false;
                if (filterByRoleOnly) {
                  return currentRoleProfile.modules.includes(category.categoryId);
                }
                return true;
              });

              if (filteredItems.length === 0) return null;

              return (
                <div key={idx} className="flex flex-col gap-6">
                  
                  {/* Category Banner Card */}
                  <div className={`w-full rounded-3xl ${category.theme.bannerBg} p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md text-white`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-sm">
                        <Layers className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight drop-shadow-xs">
                            {category.categoryTitle}
                          </h2>
                          {currentRoleProfile.modules.includes(category.categoryId) && (
                            <span className="text-[10px] font-extrabold uppercase bg-white/20 border border-white/20 px-2 py-0.5 rounded-full text-white">
                              Priority for {activeRole}
                            </span>
                          )}
                        </div>
                        <p className="text-xs md:text-sm font-medium text-white/90 max-w-2xl mt-0.5">
                          {category.categoryDesc}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 py-2 rounded-2xl text-xs font-black shadow-sm bg-white text-slate-900 shrink-0">
                      {category.categoryScreens} Operational Screens
                    </div>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
                    {filteredItems.map((item, itemIdx) => {
                      const Icon = item.icon;
                      const isRecommended = currentRoleProfile.modules.includes(category.categoryId);

                      return (
                        <div 
                          key={itemIdx}
                          onClick={() => item.link ? navigate(item.link) : null}
                          className={`rounded-3xl p-6 cursor-pointer flex flex-col justify-between transition-all duration-300 border bg-white hover:shadow-xl hover:-translate-y-1 group ${category.theme.border}`}
                        >
                          <div>
                            {/* Card Header Row */}
                            <div className="flex items-start justify-between gap-3 mb-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${category.theme.iconBg} group-hover:scale-105 transition-transform`}>
                                <Icon className="w-6 h-6" />
                              </div>
                              
                              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                {item.core && (
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-600 text-white tracking-wider">
                                    CORE
                                  </span>
                                )}
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                  {item.count} screens
                                </span>
                              </div>
                            </div>

                            {/* Title & Badge */}
                            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-2">
                              {item.title}
                            </h3>

                            {/* Description */}
                            <p className="text-xs text-slate-500 leading-relaxed font-normal min-h-[44px] line-clamp-3 mb-4">
                              {item.desc}
                            </p>
                          </div>

                          {/* Bottom Sections: Interconnected Modules & Action */}
                          <div className="mt-auto pt-4 border-t border-slate-100">
                            
                            {/* Connected Nodes Badges */}
                            <div className="mb-4">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                                Data Connections ({item.connected.length})
                              </span>
                              <div className="flex flex-wrap gap-1.5 max-h-[58px] overflow-hidden">
                                {item.connected.slice(0, 3).map((conn, cIdx) => (
                                  <span 
                                    key={cIdx} 
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${category.theme.tagBg}`}
                                  >
                                    <LinkIcon className="w-2.5 h-2.5 opacity-60" />
                                    <span>{conn}</span>
                                  </span>
                                ))}
                                {item.connected.length > 3 && (
                                  <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">
                                    +{item.connected.length - 3} more
                                  </span>
                                )}
                                {item.connected.length === 0 && (
                                  <span className="text-[10px] text-slate-400 italic">Standalone utility</span>
                                )}
                              </div>
                            </div>

                            {/* Direct Open Button */}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(item.link);
                              }}
                              className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 group-hover:bg-indigo-600 group-hover:text-white"
                            >
                              <span>Open Module</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>

                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
        </div>

      </div>

    </div>
  );
};

export default ErpNavigator;

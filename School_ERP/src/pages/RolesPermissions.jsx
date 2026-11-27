import React, { useState, useMemo, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { 
  Plus, 
  HelpCircle, 
  Edit2, 
  Trash2, 
  User, 
  Search, 
  ChevronUp, 
  ChevronDown, 
  ArrowLeft, 
  Save, 
  CheckSquare, 
  Square,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  ShieldAlert,
  Info,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Lock,
  Check,
  CheckCircle2,
  Key,
  BookOpen,
  Wallet,
  Calculator,
  FileText,
  UserCog,
  Monitor,
  TrendingUp,
  Bus,
  Building,
  Library,
  Warehouse,
  Calendar,
  BookMarked,
  Cctv,
  Settings,
  MonitorPlay,
  Network,
  X,
  Mail,
  Phone,
  Eye,
  Download,
  Filter,
  Sliders,
  Shield,
  Layers,
  CheckCheck
} from "lucide-react";
import settingsService from "../api/settingsService";

// Comprehensive fallback permission modules across all 18 School ERP modules
const ALL_PERMISSIONS_MODULES = [
  {
    key: "academics",
    name: "Academics & Curriculum",
    icon: "🎓",
    description: "Academic sessions, classes, subjects, timetable, and student promotions.",
    permissions: [
      { name: "Academic Sessions Switch & Manage", slug: "academics.sessions.manage" },
      { name: "Classes & Sections Setup", slug: "academics.classes.manage" },
      { name: "Subjects & Syllabus Allocation", slug: "academics.subjects.manage" },
      { name: "Assign Subject & Class Teachers", slug: "academics.assign_teachers.manage" },
      { name: "Class Timetable Builder", slug: "academics.timetable.manage" },
      { name: "Student Class Promotion", slug: "academics.promote.manage" }
    ]
  },
  {
    key: "students",
    name: "Student Registry & Directory",
    icon: "👥",
    description: "Student admissions, directory, profiles, daily attendance, behavior, and exit TC.",
    permissions: [
      { name: "New Student Admission", slug: "students.admission.create" },
      { name: "Student Directory List & View", slug: "students.list.view" },
      { name: "Student Profile Edit & Photo Upload", slug: "students.profile.edit" },
      { name: "Student Daily Attendance Punch", slug: "students.attendance.manage" },
      { name: "Behavior & Incident Records", slug: "students.behavior.manage" },
      { name: "Medical & Health Records", slug: "students.health.manage" },
      { name: "Transfer Certificate & TC Exit", slug: "students.exit.manage" },
      { name: "Parent & Guardian Information", slug: "students.parents.manage" }
    ]
  },
  {
    key: "fees",
    name: "Fees & Counter Collection",
    icon: "💵",
    description: "Fee groups, offline and bank collections, challans, due fees ledger, and discounts.",
    permissions: [
      { name: "Fee Groups & Structure Manage", slug: "fees.structure.manage" },
      { name: "Counter Fee Collection Punch", slug: "fees.collect.manage" },
      { name: "Offline & Bank Challan Generation", slug: "fees.challans.manage" },
      { name: "Assign Fees to Class / Students", slug: "fees.assign.manage" },
      { name: "Due Fees Ledger & Search", slug: "fees.due.view" },
      { name: "Transaction Reversal & Void Receipt", slug: "fees.revert.manage" },
      { name: "Fee Discounts & Concessions", slug: "fees.discounts.manage" }
    ]
  },
  {
    key: "accounts",
    name: "Finance & Accounts",
    icon: "📊",
    description: "Income & expense vouchers, heads, school bank accounts, and finance audit ledger.",
    permissions: [
      { name: "Income Voucher Entry", slug: "accounts.income.manage" },
      { name: "Expense Voucher Entry", slug: "accounts.expense.manage" },
      { name: "Income & Expense Heads Setup", slug: "accounts.heads.manage" },
      { name: "School Bank Accounts & Transfers", slug: "accounts.bank.manage" },
      { name: "Finance Audit Ledger & Balance Sheet", slug: "accounts.reports.view" }
    ]
  },
  {
    key: "exams",
    name: "Offline Examinations & Marks",
    icon: "📝",
    description: "Datesheets, admit card printing, teacher marks entry, co-curricular areas, and report cards.",
    permissions: [
      { name: "Exam Datesheets & Schedules", slug: "exams.datesheet.manage" },
      { name: "Admit Card Generation & Print", slug: "exams.admit_cards.manage" },
      { name: "Teacher Marks Entry & Lock", slug: "exams.marks.entry" },
      { name: "Grading Scale & Co-curricular Areas", slug: "exams.grades.manage" },
      { name: "Generate & Print Report Cards", slug: "exams.report_cards.manage" }
    ]
  },
  {
    key: "online_exams",
    name: "Online CBT Examination Engine",
    icon: "💻",
    description: "Online quiz and exam builder, question bank, chapters, and computer-based results.",
    permissions: [
      { name: "Online Quiz & Test Builder", slug: "online_exams.manage" },
      { name: "Question Bank & Categorization", slug: "online_exams.questions.manage" },
      { name: "Evaluate & Publish Results", slug: "online_exams.results.manage" }
    ]
  },
  {
    key: "cbc",
    name: "Competency-Based Curriculum (CBC)",
    icon: "🌱",
    description: "Strands, learning outcomes, formative assessments, and competency reports.",
    permissions: [
      { name: "Strands & Learning Outcomes", slug: "cbc.strands.manage" },
      { name: "Formative & Summative Assessments", slug: "cbc.assessments.manage" },
      { name: "Core Competency Reports", slug: "cbc.reports.view" }
    ]
  },
  {
    key: "hr",
    name: "Staff & Human Resource",
    icon: "💼",
    description: "Staff directory, biometric attendance, monthly payroll, leave approvals, and appraisals.",
    permissions: [
      { name: "Staff Directory & Profile", slug: "hr.staff.manage" },
      { name: "Staff Biometric Attendance", slug: "hr.attendance.manage" },
      { name: "Monthly Payroll Generation & Payslips", slug: "hr.payroll.manage" },
      { name: "Leave Authorizations & Approvals", slug: "hr.leaves.manage" },
      { name: "Staff Designations & Departments", slug: "hr.designations.manage" },
      { name: "Staff Performance Appraisals", slug: "hr.appraisals.manage" }
    ]
  },
  {
    key: "front_office",
    name: "Front Office & Visitors",
    icon: "🏢",
    description: "Admission inquiries, visitor book, complaints, postal records, and gate passes.",
    permissions: [
      { name: "Admission Enquiries & Followups", slug: "front_office.enquiries.manage" },
      { name: "Visitor Book & Campus Passes", slug: "front_office.visitors.manage" },
      { name: "Student Gate Pass Terminal", slug: "front_office.gate_pass.manage" },
      { name: "Parent & Public Complaints", slug: "front_office.complaints.manage" },
      { name: "Postal Records & Courier Dispatch", slug: "front_office.postal.manage" }
    ]
  },
  {
    key: "leads",
    name: "Lead CRM & Admissions Funnel",
    icon: "📈",
    description: "Pipeline Kanban board, phone calls and follow-ups, and lead conversion sources.",
    permissions: [
      { name: "Lead Pipeline Kanban Board", slug: "leads.pipeline.manage" },
      { name: "Log Calls & Followups", slug: "leads.followups.manage" },
      { name: "Lead Sources & Conversion Stages", slug: "leads.sources.manage" }
    ]
  },
  {
    key: "transport",
    name: "Fleet & Transport Management",
    icon: "🚌",
    description: "Vehicles, bus routes, stoppages, driver profiles, and passenger rosters.",
    permissions: [
      { name: "Vehicle & Fleet Register", slug: "transport.vehicles.manage" },
      { name: "Routes, Stoppages & Fare Setup", slug: "transport.routes.manage" },
      { name: "Assign Students & Staff to Routes", slug: "transport.assign.manage" },
      { name: "Driver Profiles & Tracking", slug: "transport.drivers.manage" }
    ]
  },
  {
    key: "hostel",
    name: "Hostel & Dormitory",
    icon: "🛏️",
    description: "Hostel buildings, room types, and student room/bed allocations.",
    permissions: [
      { name: "Hostel Buildings & Room Types", slug: "hostel.rooms.manage" },
      { name: "Student Bed & Room Allocation", slug: "hostel.allocation.manage" }
    ]
  },
  {
    key: "library",
    name: "Library & Book Circulation",
    icon: "📚",
    description: "Books catalog, barcode accession, book lending, and overdue fine logs.",
    permissions: [
      { name: "Books Catalog & Barcode Register", slug: "library.books.manage" },
      { name: "Issue & Return Book Circulation", slug: "library.circulation.manage" },
      { name: "Overdue Fines & Member Cards", slug: "library.fines.manage" }
    ]
  },
  {
    key: "inventory",
    name: "Inventory & Assets",
    icon: "📦",
    description: "Items, stock issue vouchers, asset register, and vendor purchase logs.",
    permissions: [
      { name: "Store Inventory Items & Categories", slug: "inventory.items.manage" },
      { name: "Issue Items to Staff / Department", slug: "inventory.issue.manage" },
      { name: "Asset Register & Depreciation", slug: "inventory.assets.manage" },
      { name: "Vendor Management & Purchase Logs", slug: "inventory.vendors.manage" }
    ]
  },
  {
    key: "ptm",
    name: "PTM Meetings & Follow-ups",
    icon: "🗓️",
    description: "Parent-teacher meetings schedule, attendance, and interaction notes.",
    permissions: [
      { name: "Schedule Parent-Teacher Meetings", slug: "ptm.schedule.manage" },
      { name: "Record Parent Remarks & Attendance", slug: "ptm.remarks.manage" }
    ]
  },
  {
    key: "lesson_plan",
    name: "Lesson Planner & Syllabus Tracker",
    icon: "📖",
    description: "Teacher lesson plans submission, supervisor review, and syllabus progress.",
    permissions: [
      { name: "Submit Daily / Weekly Lesson Plans", slug: "lesson_plan.submit" },
      { name: "Review & Approve Lesson Plans", slug: "lesson_plan.review.manage" },
      { name: "Syllabus Coverage Tracking", slug: "lesson_plan.coverage.view" }
    ]
  },
  {
    key: "cctv",
    name: "CCTV & Campus Surveillance",
    icon: "📹",
    description: "Campus live video wall, RTSP cameras setup, and streaming access audit.",
    permissions: [
      { name: "Live Camera Wall View", slug: "cctv.live.view" },
      { name: "Camera Configurations & RTSP", slug: "cctv.manage" },
      { name: "Access & Surveillance Logs", slug: "cctv.logs.view" }
    ]
  },
  {
    key: "settings",
    name: "School Settings & Administration",
    icon: "⚙️",
    description: "School profile, roles and permissions, payment gateways, and system backup.",
    permissions: [
      { name: "School Profile & General Configuration", slug: "settings.school_profile.manage" },
      { name: "Roles & Permissions (RBAC)", slug: "settings.roles.manage" },
      { name: "Payment Gateway Credentials", slug: "settings.gateway.manage" },
      { name: "Notification Triggers & Templates", slug: "settings.notifications.manage" },
      { name: "Custom Fields Builder", slug: "settings.custom_fields.manage" },
      { name: "Audit Trail & System Backups", slug: "settings.backup.manage" }
    ]
  }
];

// Guaranteed Default Campus Roles for instant display
const DEFAULT_SCHOOL_ROLES = [
  {
    _id: "role-principal",
    name: "Principal / Headmaster",
    description: "Supreme administrative & academic head with full authority across all 18 school campus modules.",
    isSystem: true,
    userCount: 1,
    permissions: ["all"]
  },
  {
    _id: "role-vp",
    name: "Vice Principal",
    description: "Supervises academic timetable, student disciplinary records, faculty observations, and exams.",
    isSystem: true,
    userCount: 2,
    permissions: [
      "academics.sessions.manage", "academics.classes.manage", "academics.subjects.manage",
      "academics.assign_teachers.manage", "academics.timetable.manage", "academics.promote.manage",
      "students.admission.create", "students.list.view", "students.attendance.manage", "students.behavior.manage",
      "exams.datesheet.manage", "exams.admit_cards.manage", "exams.marks.entry", "exams.report_cards.manage",
      "lesson_plan.review.manage", "ptm.schedule.manage", "hr.staff.manage"
    ]
  },
  {
    _id: "role-coordinator",
    name: "Academic Coordinator",
    description: "Oversees syllabus progress, lesson plan compliance, teacher timetables, and competency assessments.",
    isSystem: false,
    userCount: 3,
    permissions: [
      "academics.classes.manage", "academics.subjects.manage", "academics.timetable.manage",
      "lesson_plan.submit", "lesson_plan.review.manage", "lesson_plan.coverage.view",
      "exams.datesheet.manage", "exams.marks.entry", "online_exams.manage", "cbc.strands.manage", "cbc.assessments.manage"
    ]
  },
  {
    _id: "role-teacher",
    name: "Teacher / Faculty",
    description: "Student daily attendance marking, marks entry, digital homework, lesson plans, and parent remarks.",
    isSystem: true,
    userCount: 14,
    permissions: [
      "students.list.view", "students.attendance.manage", "students.behavior.manage",
      "academics.assign_teachers.manage", "exams.marks.entry", "online_exams.questions.manage",
      "lesson_plan.submit", "ptm.remarks.manage"
    ]
  },
  {
    _id: "role-accountant",
    name: "Accountant / Fee Cashier",
    description: "Student counter fee collection, fee challans generation, income/expense vouchers, and bank ledgers.",
    isSystem: true,
    userCount: 2,
    permissions: [
      "fees.structure.manage", "fees.collect.manage", "fees.challans.manage", "fees.assign.manage",
      "fees.due.view", "fees.revert.manage", "fees.discounts.manage",
      "accounts.income.manage", "accounts.expense.manage", "accounts.heads.manage", "accounts.bank.manage", "accounts.reports.view"
    ]
  },
  {
    _id: "role-receptionist",
    name: "Front Desk / Receptionist",
    description: "Visitor logs, student admission inquiries, complaints register, postal dispatches, and campus gate passes.",
    isSystem: false,
    userCount: 1,
    permissions: [
      "front_office.enquiries.manage", "front_office.visitors.manage",
      "front_office.complaints.manage", "front_office.postal.manage",
      "front_office.gate_pass.manage", "students.admission.create", "students.list.view"
    ]
  },
  {
    _id: "role-librarian",
    name: "Librarian",
    description: "Book accessioning, catalog search, student/staff library cards, issue/return transactions, and overdue fines.",
    isSystem: false,
    userCount: 1,
    permissions: [
      "library.books.manage", "library.circulation.manage", "library.fines.manage"
    ]
  },
  {
    _id: "role-transport",
    name: "Transport Manager",
    description: "School bus fleet details, bus stop routes, driver assignments, vehicle documents, and transport passes.",
    isSystem: false,
    userCount: 2,
    permissions: [
      "transport.routes.manage", "transport.vehicles.manage", "transport.assign.manage", "transport.drivers.manage"
    ]
  },
  {
    _id: "role-hostel",
    name: "Hostel Warden",
    description: "Hostel building rooms, student bed allocations, hostel mess attendance, and night gate pass authorizations.",
    isSystem: false,
    userCount: 1,
    permissions: [
      "hostel.rooms.manage", "hostel.allocation.manage"
    ]
  },
  {
    _id: "role-itadmin",
    name: "IT Administrator",
    description: "Campus biometric machines, system configurations, automated backups, and CCTV live surveillance walls.",
    isSystem: false,
    userCount: 1,
    permissions: [
      "settings.school_profile.manage", "settings.roles.manage", "settings.backup.manage",
      "cctv.live.view", "cctv.manage", "cctv.logs.view"
    ]
  }
];

// Initial staff users mapped to roles
const DEFAULT_ROLE_USERS = [
  {
    _id: "usr-01",
    name: "Dr. Arvind Sharma",
    email: "principal@schoolerp.edu",
    phone: "+91 98765 01001",
    roleId: "role-principal",
    roleName: "Principal / Headmaster",
    designation: "Executive Principal",
    department: "Executive Academic Leadership",
    status: "Active"
  },
  {
    _id: "usr-02",
    name: "Mrs. Sunita Verma",
    email: "vp.sunita@schoolerp.edu",
    phone: "+91 98765 01002",
    roleId: "role-vp",
    roleName: "Vice Principal",
    designation: "Vice Principal (Secondary Wing)",
    department: "Academics",
    status: "Active"
  },
  {
    _id: "usr-03",
    name: "Mr. Rajesh Khanna",
    email: "rajesh.vp@schoolerp.edu",
    phone: "+91 98765 01003",
    roleId: "role-vp",
    roleName: "Vice Principal",
    designation: "Vice Principal (Senior Wing)",
    department: "Academics",
    status: "Active"
  },
  {
    _id: "usr-04",
    name: "Pooja Malhotra",
    email: "pooja.coord@schoolerp.edu",
    phone: "+91 98765 01004",
    roleId: "role-coordinator",
    roleName: "Academic Coordinator",
    designation: "Middle School Head Coordinator",
    department: "Curriculum & Timetable",
    status: "Active"
  },
  {
    _id: "usr-05",
    name: "Ramesh Saxena",
    email: "ramesh.accountant@schoolerp.edu",
    phone: "+91 98765 01005",
    roleId: "role-accountant",
    roleName: "Accountant / Fee Cashier",
    designation: "Senior School Accountant",
    department: "Finance & Accounts",
    status: "Active"
  },
  {
    _id: "usr-06",
    name: "Sneha Kapoor",
    email: "sneha.cashier@schoolerp.edu",
    phone: "+91 98765 01006",
    roleId: "role-accountant",
    roleName: "Accountant / Fee Cashier",
    designation: "Fee Counter Executive",
    department: "Accounts Desk",
    status: "Active"
  },
  {
    _id: "usr-07",
    name: "Deepak Mehra",
    email: "deepak.reception@schoolerp.edu",
    phone: "+91 98765 01007",
    roleId: "role-receptionist",
    roleName: "Front Desk / Receptionist",
    designation: "Front Desk Officer",
    department: "Front Office & PR",
    status: "Active"
  },
  {
    _id: "usr-08",
    name: "Geeta Rao",
    email: "geeta.library@schoolerp.edu",
    phone: "+91 98765 01008",
    roleId: "role-librarian",
    roleName: "Librarian",
    designation: "Head Librarian",
    department: "Central Library",
    status: "Active"
  },
  {
    _id: "usr-09",
    name: "Vikram Chauhan",
    email: "transport.vikram@schoolerp.edu",
    phone: "+91 98765 01009",
    roleId: "role-transport",
    roleName: "Transport Manager",
    designation: "Fleet & Logistics Manager",
    department: "Transport Department",
    status: "Active"
  },
  {
    _id: "usr-10",
    name: "Sarita Devi",
    email: "sarita.hostel@schoolerp.edu",
    phone: "+91 98765 01010",
    roleId: "role-hostel",
    roleName: "Hostel Warden",
    designation: "Girls Hostel Chief Warden",
    department: "Hostel & Residential",
    status: "Active"
  },
  {
    _id: "usr-11",
    name: "Amit Patel",
    email: "amit.patel@schoolerp.edu",
    phone: "+91 98765 01011",
    roleId: "role-itadmin",
    roleName: "IT Administrator",
    designation: "Systems & Network Administrator",
    department: "IT & Infrastructure",
    status: "Active"
  }
];

const getInitialRoles = () => {
  try {
    const cached = localStorage.getItem('sms_school_roles_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return DEFAULT_SCHOOL_ROLES;
};

const getInitialRoleUsers = () => {
  try {
    const cached = localStorage.getItem('sms_school_role_users_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return DEFAULT_ROLE_USERS;
};

const emptyUserForm = {
  name: '',
  email: '',
  phone: '',
  password: 'admin@123',
  roleId: '',
  designation: 'Staff',
  department: 'Administration',
  status: 'Active'
};

export default function RolesPermissions() {
  // SVG Consultancy 3-Tab RBAC standard: "roles" | "matrix" | "users"
  const [activeTab, setActiveTab] = useState("roles");
  const [loading, setLoading] = useState(false);
  const [savingMatrix, setSavingMatrix] = useState(false);

  // Core Data
  const [roles, setRoles] = useState(getInitialRoles);
  const [permissionModules, setPermissionModules] = useState(ALL_PERMISSIONS_MODULES);
  const [searchQuery, setSearchQuery] = useState("");
  const [usersSearchQuery, setUsersSearchQuery] = useState("");
  const [usersRoleFilter, setUsersRoleFilter] = useState("all");

  // Selected Role for Matrix Table View / Edit
  const [selectedMatrixRoleId, setSelectedMatrixRoleId] = useState(() => {
    const initial = getInitialRoles();
    return initial[0]?._id || initial[0]?.id || "role-principal";
  });

  // Current Selected Role in Matrix Tab
  const activeMatrixRole = useMemo(() => {
    return roles.find(r => (r._id || r.id) === selectedMatrixRoleId) || roles[0] || null;
  }, [roles, selectedMatrixRoleId]);

  // Selected permission slugs for the active matrix role
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());

  // Search filter inside permissions matrix table
  const [matrixFilterQuery, setMatrixFilterQuery] = useState("");

  // Expandable accordions for granular module slugs
  const [expandedModules, setExpandedModules] = useState({});

  // ─── Modal States ───
  // 1. Role Create / Edit Modal
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleFormName, setRoleFormName] = useState("");
  const [roleFormDesc, setRoleFormDesc] = useState("");
  const [roleFormPreset, setRoleFormPreset] = useState("custom");
  const [savingRole, setSavingRole] = useState(false);

  // 2. Add User Modal
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [savingUser, setSavingUser] = useState(false);

  // 3. Change User Role Modal
  const [changeRoleModalOpen, setChangeRoleModalOpen] = useState(false);
  const [userToChangeRole, setUserToChangeRole] = useState(null);
  const [newSelectedRoleId, setNewSelectedRoleId] = useState("");

  // Role Users Directory
  const [roleUsers, setRoleUsers] = useState(getInitialRoleUsers);

  // Total system capabilities
  const totalSystemPerms = useMemo(() => {
    return permissionModules.reduce((sum, mod) => sum + (mod.permissions?.length || 0), 0);
  }, [permissionModules]);

  // Sync selectedPermissions when activeMatrixRole changes
  useEffect(() => {
    if (!activeMatrixRole) return;
    const perms = activeMatrixRole.permissions || activeMatrixRole.permissionSlugs || [];
    const isAll = perms.includes("all") || 
      activeMatrixRole.name === 'Admin' || 
      activeMatrixRole.name === 'SuperAdmin' || 
      activeMatrixRole.name === 'Principal / Headmaster' ||
      activeMatrixRole.name === 'Principal / Academic Director';

    if (isAll) {
      const allSlugs = permissionModules.flatMap(m => [
        `${m.key}.view`,
        `${m.key}.create`,
        `${m.key}.edit`,
        `${m.key}.delete`,
        `${m.key}.export`,
        ...m.permissions.map(p => p.slug)
      ]);
      setSelectedPermissions(new Set(allSlugs));
    } else {
      const set = new Set();
      perms.forEach(p => {
        if (!p) return;
        if (p.endsWith('.*')) {
          const modKey = p.replace('.*', '');
          set.add(`${modKey}.view`);
          set.add(`${modKey}.create`);
          set.add(`${modKey}.edit`);
          set.add(`${modKey}.delete`);
          set.add(`${modKey}.export`);
          const mod = permissionModules.find(m => m.key === modKey);
          if (mod) mod.permissions.forEach(mp => set.add(mp.slug));
        } else {
          set.add(p);
        }
      });
      setSelectedPermissions(set);
    }
  }, [activeMatrixRole, permissionModules]);

  // Fetch roles and permission matrix from API with local cache fallback
  const fetchRolesData = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesRes, matrixRes, usersRes] = await Promise.allSettled([
        settingsService.getRoles(),
        settingsService.getPermissionsMatrix(),
        settingsService.getRoleUsers()
      ]);

      if (rolesRes.status === "fulfilled" && rolesRes.value?.success && Array.isArray(rolesRes.value.data) && rolesRes.value.data.length > 0) {
        setRoles(rolesRes.value.data);
        try {
          localStorage.setItem('sms_school_roles_cache', JSON.stringify(rolesRes.value.data));
        } catch (e) {}
      } else {
        const cached = localStorage.getItem('sms_school_roles_cache');
        if (cached) {
          try { setRoles(JSON.parse(cached)); } catch(e){}
        }
      }

      if (matrixRes.status === "fulfilled" && matrixRes.value?.success && Array.isArray(matrixRes.value.data) && matrixRes.value.data.length > 0) {
        setPermissionModules(matrixRes.value.data);
      }

      if (usersRes.status === "fulfilled" && usersRes.value?.success && Array.isArray(usersRes.value.data) && usersRes.value.data.length > 0) {
        setRoleUsers(usersRes.value.data);
        try {
          localStorage.setItem('sms_school_role_users_cache', JSON.stringify(usersRes.value.data));
        } catch (e) {}
      }
    } catch (err) {
      console.warn("Could not fetch roles from API, keeping active state:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRolesData();
  }, [fetchRolesData]);

  // ─── SVG CONSULTANCY MATRIX HELPERS ───
  // Standard Action Slugs per module: view, create, edit, delete, export
  const getActionSlug = (modKey, action) => {
    return `${modKey}.${action}`;
  };

  const isActionChecked = (modKey, action) => {
    const slug = getActionSlug(modKey, action);
    if (selectedPermissions.has(slug)) return true;
    // Check if relevant granular permissions are present
    const mod = permissionModules.find(m => m.key === modKey);
    if (!mod) return false;

    if (action === "view") {
      return mod.permissions.some(p => p.slug.includes("view") && selectedPermissions.has(p.slug));
    }
    if (action === "create") {
      return mod.permissions.some(p => (p.slug.includes("create") || p.slug.includes("admission") || p.slug.includes("submit")) && selectedPermissions.has(p.slug));
    }
    if (action === "edit") {
      return mod.permissions.some(p => (p.slug.includes("edit") || p.slug.includes("manage") || p.slug.includes("setup")) && selectedPermissions.has(p.slug));
    }
    if (action === "delete") {
      return selectedPermissions.has(`${modKey}.delete`) || selectedPermissions.has(`${modKey}.revert.manage`);
    }
    if (action === "export") {
      return selectedPermissions.has(`${modKey}.export`) || mod.permissions.some(p => (p.slug.includes("print") || p.slug.includes("reports")) && selectedPermissions.has(p.slug));
    }
    return false;
  };

  const toggleAction = (modKey, action) => {
    const mainSlug = getActionSlug(modKey, action);
    const mod = permissionModules.find(m => m.key === modKey);
    const currentlyChecked = isActionChecked(modKey, action);

    setSelectedPermissions(prev => {
      const next = new Set(prev);
      if (currentlyChecked) {
        next.delete(mainSlug);
        // Also remove related granular slugs
        if (mod) {
          mod.permissions.forEach(p => {
            if (action === "view" && p.slug.includes("view")) next.delete(p.slug);
            if (action === "create" && (p.slug.includes("create") || p.slug.includes("admission"))) next.delete(p.slug);
            if (action === "export" && (p.slug.includes("print") || p.slug.includes("reports"))) next.delete(p.slug);
          });
        }
      } else {
        next.add(mainSlug);
        // Also add related granular slugs
        if (mod) {
          mod.permissions.forEach(p => {
            if (action === "view" && p.slug.includes("view")) next.add(p.slug);
            if (action === "create" && (p.slug.includes("create") || p.slug.includes("admission"))) next.add(p.slug);
            if (action === "export" && (p.slug.includes("print") || p.slug.includes("reports"))) next.add(p.slug);
          });
        }
      }
      return next;
    });
  };

  // Toggle entire row (all actions + all granular slugs of the module)
  const isRowAllChecked = (mod) => {
    const actions = ["view", "create", "edit", "delete", "export"];
    const actionsAll = actions.every(act => isActionChecked(mod.key, act));
    const granularAll = mod.permissions.every(p => selectedPermissions.has(p.slug));
    return actionsAll && granularAll;
  };

  const toggleRowAll = (mod) => {
    const isAll = isRowAllChecked(mod);
    const allSlugsInMod = [
      `${mod.key}.view`,
      `${mod.key}.create`,
      `${mod.key}.edit`,
      `${mod.key}.delete`,
      `${mod.key}.export`,
      ...mod.permissions.map(p => p.slug)
    ];

    setSelectedPermissions(prev => {
      const next = new Set(prev);
      if (isAll) {
        allSlugsInMod.forEach(s => next.delete(s));
      } else {
        allSlugsInMod.forEach(s => next.add(s));
      }
      return next;
    });
  };

  // Toggle single granular permission slug
  const handleToggleSlug = (slug) => {
    setSelectedPermissions(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  // Quick Presets: All, Clear, Read-Only
  const handlePresetSelectAll = () => {
    const allSlugs = permissionModules.flatMap(m => [
      `${m.key}.view`,
      `${m.key}.create`,
      `${m.key}.edit`,
      `${m.key}.delete`,
      `${m.key}.export`,
      ...m.permissions.map(p => p.slug)
    ]);
    setSelectedPermissions(new Set(allSlugs));
  };

  const handlePresetClearAll = () => {
    setSelectedPermissions(new Set());
  };

  const handlePresetReadOnly = () => {
    const readSlugs = permissionModules.flatMap(m => {
      const views = [`${m.key}.view`];
      m.permissions.forEach(p => {
        if (p.slug.includes("view") || p.slug.includes("list") || p.slug.includes("coverage")) {
          views.push(p.slug);
        }
      });
      return views;
    });
    setSelectedPermissions(new Set(readSlugs));
  };

  // Toggle accordion expansion for granular slugs inside matrix table
  const toggleModuleExpansion = (modKey) => {
    setExpandedModules(prev => ({ ...prev, [modKey]: !prev[modKey] }));
  };

  // Save Permissions Matrix Changes for active role
  const handleSaveMatrix = async () => {
    if (!activeMatrixRole) return;
    setSavingMatrix(true);

    const updatedPermsList = Array.from(selectedPermissions);

    try {
      try {
        await settingsService.updateRole(activeMatrixRole._id || activeMatrixRole.id, {
          permissions: updatedPermsList
        });
      } catch (apiErr) {
        console.warn("API role update error, updating local state & cache:", apiErr);
      }

      // Update state & cache
      setRoles(prev => {
        const next = prev.map(r => {
          if ((r._id || r.id) === (activeMatrixRole._id || activeMatrixRole.id)) {
            return {
              ...r,
              permissions: updatedPermsList,
              permissionSlugs: updatedPermsList
            };
          }
          return r;
        });
        try {
          localStorage.setItem('sms_school_roles_cache', JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      Swal.fire({
        icon: "success",
        title: "Matrix Privileges Saved!",
        text: `Permissions for role '${activeMatrixRole.name}' have been updated successfully across all school modules.`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Could not save matrix",
        text: err.message
      });
    } finally {
      setSavingMatrix(false);
    }
  };

  // ─── ROLE CREATE / EDIT MODAL HANDLERS ───
  const handleOpenCreateRole = () => {
    setEditingRole(null);
    setRoleFormName("");
    setRoleFormDesc("");
    setRoleFormPreset("custom");
    setRoleModalOpen(true);
  };

  const handleOpenEditRole = (role) => {
    setEditingRole(role);
    setRoleFormName(role.name);
    setRoleFormDesc(role.description || role.desc || "");
    setRoleFormPreset("custom");
    setRoleModalOpen(true);
  };

  const handleSaveRoleModal = async (e) => {
    e.preventDefault();
    if (!roleFormName.trim()) {
      Swal.fire({ icon: 'warning', title: 'Role title required', text: 'Please specify a title for this role.' });
      return;
    }

    setSavingRole(true);
    try {
      if (editingRole) {
        // Edit existing role
        const roleId = editingRole._id || editingRole.id;
        try {
          await settingsService.updateRole(roleId, {
            name: roleFormName.trim(),
            description: roleFormDesc.trim()
          });
        } catch (apiErr) {
          console.warn("API update failed, applying local update:", apiErr);
        }

        setRoles(prev => {
          const updated = prev.map(r => {
            if ((r._id || r.id) === roleId) {
              return { ...r, name: roleFormName.trim(), description: roleFormDesc.trim() };
            }
            return r;
          });
          try { localStorage.setItem('sms_school_roles_cache', JSON.stringify(updated)); } catch(e){}
          return updated;
        });

        Swal.fire({ icon: 'success', title: 'Role Updated', timer: 1500, showConfirmButton: false });
      } else {
        // Create new role
        const newRoleId = `role-${Date.now()}`;
        let initialPerms = [];
        if (roleFormPreset === "full") {
          initialPerms = ["all"];
        } else if (roleFormPreset === "readonly") {
          initialPerms = permissionModules.map(m => `${m.key}.view`);
        } else {
          initialPerms = ["students.list.view", "academics.classes.manage"];
        }

        const newRole = {
          _id: newRoleId,
          name: roleFormName.trim(),
          description: roleFormDesc.trim() || "Custom school staff role.",
          isSystem: false,
          userCount: 0,
          permissions: initialPerms
        };

        try {
          const res = await settingsService.createRole({
            name: roleFormName.trim(),
            description: roleFormDesc.trim(),
            permissions: initialPerms
          });
          if (res?.success && res.data) {
            newRole._id = res.data._id || newRole._id;
          }
        } catch (apiErr) {
          console.warn("API role creation failed, saved to local cache:", apiErr);
        }

        setRoles(prev => {
          const updated = [...prev, newRole];
          try { localStorage.setItem('sms_school_roles_cache', JSON.stringify(updated)); } catch(e){}
          return updated;
        });

        setSelectedMatrixRoleId(newRole._id);
        Swal.fire({
          icon: 'success',
          title: 'Role Created!',
          text: `Role '${newRole.name}' created. You can now configure its permissions in the Matrix table.`,
          timer: 2000,
          showConfirmButton: false
        });
      }

      setRoleModalOpen(false);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error saving role', text: err.message });
    } finally {
      setSavingRole(false);
    }
  };

  const handleDeleteRole = (role) => {
    if (role.isSystem) {
      Swal.fire({
        icon: "warning",
        title: "Protected System Role",
        text: `Role '${role.name}' is an essential core role and cannot be deleted.`
      });
      return;
    }

    Swal.fire({
      title: `Delete Role '${role.name}'?`,
      text: "Assigned staff members will be unlinked from this role.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete role"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await settingsService.deleteRole(role._id || role.id);
        } catch (err) {
          console.warn("API delete failed, updating local state:", err);
        }

        const roleId = role._id || role.id;
        setRoles(prev => {
          const updated = prev.filter(r => (r._id || r.id) !== roleId);
          try { localStorage.setItem('sms_school_roles_cache', JSON.stringify(updated)); } catch(e){}
          return updated;
        });

        if (selectedMatrixRoleId === roleId) {
          setSelectedMatrixRoleId("role-principal");
        }

        Swal.fire({ icon: "success", title: "Role Deleted", timer: 1500, showConfirmButton: false });
      }
    });
  };

  // ─── USER MANAGEMENT HANDLERS ───
  const openAddUserModal = (targetRoleId = "") => {
    setUserForm({
      ...emptyUserForm,
      roleId: targetRoleId || selectedMatrixRoleId || (roles[0]?._id || "role-principal")
    });
    setUserModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email || !userForm.roleId) {
      Swal.fire({ icon: 'warning', title: 'Incomplete Details', text: 'Name, email, and assigned role are required.' });
      return;
    }

    setSavingUser(true);
    const selectedRole = roles.find(r => (r._id || r.id) === userForm.roleId) || { name: 'Staff' };

    try {
      const newUser = {
        _id: `usr-${Date.now()}`,
        name: userForm.name.trim(),
        email: userForm.email.trim(),
        phone: userForm.phone.trim() || "+91 98765 43210",
        roleId: userForm.roleId,
        roleName: selectedRole.name,
        designation: userForm.designation.trim() || "Staff",
        department: userForm.department.trim() || "Administration",
        status: userForm.status || "Active"
      };

      try {
        const res = await settingsService.addRoleUser(userForm);
        if (res?.success && res.data) {
          newUser._id = res.data._id || newUser._id;
        }
      } catch (apiErr) {
        console.warn("API add user failed, cached locally:", apiErr);
      }

      setRoleUsers(prev => {
        const next = [newUser, ...prev];
        try { localStorage.setItem('sms_school_role_users_cache', JSON.stringify(next)); } catch(e){}
        return next;
      });

      // Update role user count
      setRoles(prev => {
        const updated = prev.map(r => (r._id || r.id) === userForm.roleId ? { ...r, userCount: (r.userCount || 0) + 1 } : r);
        try { localStorage.setItem('sms_school_roles_cache', JSON.stringify(updated)); } catch (e) {}
        return updated;
      });

      Swal.fire({
        icon: 'success',
        title: 'Staff Member Added!',
        text: `${newUser.name} assigned as '${selectedRole.name}'.`,
        timer: 2000,
        showConfirmButton: false
      });

      setUserModalOpen(false);
      setUserForm(emptyUserForm);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    } finally {
      setSavingUser(false);
    }
  };

  const handleOpenChangeRole = (user) => {
    setUserToChangeRole(user);
    setNewSelectedRoleId(user.roleId || (roles[0]?._id || ""));
    setChangeRoleModalOpen(true);
  };

  const handleSaveChangeRole = async () => {
    if (!userToChangeRole || !newSelectedRoleId) return;
    const targetRole = roles.find(r => (r._id || r.id) === newSelectedRoleId);
    if (!targetRole) return;

    try {
      try {
        await settingsService.updateRoleUser(userToChangeRole._id, { roleId: newSelectedRoleId });
      } catch (e) {
        console.warn("API role change failed, applying local update:", e);
      }

      setRoleUsers(prev => {
        const updated = prev.map(u => {
          if (u._id === userToChangeRole._id) {
            return {
              ...u,
              roleId: newSelectedRoleId,
              roleName: targetRole.name
            };
          }
          return u;
        });
        try { localStorage.setItem('sms_school_role_users_cache', JSON.stringify(updated)); } catch(e){}
        return updated;
      });

      // Update user counts
      setRoles(prev => {
        const updated = prev.map(r => {
          const rId = r._id || r.id;
          if (rId === userToChangeRole.roleId) {
            return { ...r, userCount: Math.max(0, (r.userCount || 1) - 1) };
          }
          if (rId === newSelectedRoleId) {
            return { ...r, userCount: (r.userCount || 0) + 1 };
          }
          return r;
        });
        try { localStorage.setItem('sms_school_roles_cache', JSON.stringify(updated)); } catch(e){}
        return updated;
      });

      Swal.fire({
        icon: 'success',
        title: 'Role Updated!',
        text: `${userToChangeRole.name}'s role changed to '${targetRole.name}'.`,
        timer: 1800,
        showConfirmButton: false
      });
      setChangeRoleModalOpen(false);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
  };

  const handleDeleteUser = (userId, userName) => {
    Swal.fire({
      title: `Remove ${userName}?`,
      text: "This staff member will lose access to school ERP systems.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, remove staff"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await settingsService.deleteRoleUser(userId);
        } catch (e) {
          console.warn("API delete failed, updating local state:", e);
        }

        const targetUser = roleUsers.find(u => u._id === userId);
        setRoleUsers(prev => {
          const updated = prev.filter(u => u._id !== userId);
          try { localStorage.setItem('sms_school_role_users_cache', JSON.stringify(updated)); } catch(e){}
          return updated;
        });

        if (targetUser && targetUser.roleId) {
          setRoles(prev => {
            const updated = prev.map(r => (r._id || r.id) === targetUser.roleId ? { ...r, userCount: Math.max(0, (r.userCount || 1) - 1) } : r);
            try { localStorage.setItem('sms_school_roles_cache', JSON.stringify(updated)); } catch(e){}
            return updated;
          });
        }

        Swal.fire({ icon: 'success', title: 'Staff Member Removed', timer: 1500, showConfirmButton: false });
      }
    });
  };

  // ─── FILTERED DATA ───
  // Filter roles
  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return roles;
    const q = searchQuery.toLowerCase();
    return roles.filter(r => 
      r.name.toLowerCase().includes(q) ||
      ((r.description || r.desc) && (r.description || r.desc).toLowerCase().includes(q))
    );
  }, [searchQuery, roles]);

  // Filter modules in matrix table
  const filteredMatrixModules = useMemo(() => {
    if (!matrixFilterQuery.trim()) return permissionModules;
    const q = matrixFilterQuery.toLowerCase();
    return permissionModules.filter(m => 
      m.name.toLowerCase().includes(q) ||
      m.key.toLowerCase().includes(q) ||
      (m.description && m.description.toLowerCase().includes(q)) ||
      m.permissions.some(p => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q))
    );
  }, [matrixFilterQuery, permissionModules]);

  // Filter role users
  const filteredRoleUsers = useMemo(() => {
    return roleUsers.filter(u => {
      const matchRole = usersRoleFilter === "all" || u.roleId === usersRoleFilter;
      const q = usersSearchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        u.name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q) || 
        (u.phone && u.phone.toLowerCase().includes(q)) ||
        (u.designation && u.designation.toLowerCase().includes(q)) ||
        (u.department && u.department.toLowerCase().includes(q));
      return matchRole && matchSearch;
    });
  }, [roleUsers, usersRoleFilter, usersSearchQuery]);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800 pb-28">
      
      {/* ─── Hero Header ─── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-slate-950/10 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              Campus RBAC Access Security
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-white/10 rounded-full border border-white/10 text-slate-300">
              Enterprise Role Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Key className="w-7 h-7 text-indigo-400 inline" />
            Roles & Granular Permissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            SVG Consultancy style Role-Based Access Control: Define staff roles, inspect the interactive Module × Action Matrix grid, and govern user privileges seamlessly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 self-start md:self-auto">
          <button
            onClick={() => openAddUserModal()}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer border-none"
          >
            <UserPlus className="w-4 h-4 text-white" />
            <span>Add Staff Member</span>
          </button>
          <button
            onClick={handleOpenCreateRole}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer border-none"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Create New Role</span>
          </button>
        </div>
      </div>

      {/* ─── 3-Tab Navigation Bar (SVG Consultancy Model) ─── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("roles")}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === "roles"
              ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Campus Roles Directory</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === "roles" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
          }`}>
            {roles.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("matrix")}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === "matrix"
              ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Permissions Matrix Grid</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === "matrix" ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-700"
          }`}>
            {activeMatrixRole?.name || "Matrix"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === "users"
              ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Assigned Staff & Users</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === "users" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
          }`}>
            {roleUsers.length}
          </span>
        </button>
      </div>

      {/* ─── KPI Stats Row ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Campus Roles</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{roles.length}</div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">Active Roles Defined</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">System Protected</div>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {roles.filter(r => r.isSystem).length}
          </div>
          <div className="text-[11px] text-purple-600 font-semibold mt-0.5">Core Institutional Roles</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Staff</div>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {roleUsers.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Active Campus Users</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Capabilities</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{totalSystemPerms}</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-0.5">{permissionModules.length} Modules Governed</div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB 1: CAMPUS ROLES DIRECTORY ─────────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "roles" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search campus roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchRolesData}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer border-none bg-transparent"
                title="Refresh Roles"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <div className="text-xs font-bold text-slate-400">
                Showing <span className="text-indigo-600 font-black">{filteredRoles.length}</span> staff roles
              </div>
            </div>
          </div>

          {filteredRoles.length === 0 ? (
            <div className="p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-600">No roles matched your search</p>
              <button
                onClick={handleOpenCreateRole}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Create New Role
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRoles.map((role) => {
                const perms = role.permissions || role.permissionSlugs || [];
                const isAll = perms.includes("all") || 
                  role.name === 'Admin' || 
                  role.name === 'SuperAdmin' || 
                  role.name === 'Principal / Headmaster' ||
                  role.name === 'Principal / Academic Director';
                
                let permCount = isAll ? totalSystemPerms : 0;
                if (!isAll) {
                  const set = new Set();
                  perms.forEach(p => {
                    if (!p) return;
                    if (p.endsWith('.*')) {
                      const modKey = p.replace('.*', '');
                      const mod = permissionModules.find(m => m.key === modKey);
                      if (mod) mod.permissions.forEach(mp => set.add(mp.slug));
                    } else {
                      set.add(p);
                    }
                  });
                  permCount = set.size;
                }

                const assignedCount = roleUsers.filter(u => u.roleId === (role._id || role.id)).length;

                return (
                  <div
                    key={role._id || role.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-sm text-slate-900">{role.name}</h3>
                            {role.isSystem ? (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" /> System Core
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Custom Role
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed line-clamp-2">
                            {role.description || role.desc || "No description provided."}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedMatrixRoleId(role._id || role.id);
                              setActiveTab("matrix");
                            }}
                            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-indigo-200"
                            title="Open Permissions Matrix"
                          >
                            <Sliders className="w-3 h-3" />
                            <span>Matrix</span>
                          </button>
                          <button
                            onClick={() => openAddUserModal(role._id || role.id)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer border-none bg-transparent"
                            title="Add User to this Role"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditRole(role)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer border-none bg-transparent"
                            title="Edit Role Title"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {!role.isSystem && (
                            <button
                              onClick={() => handleDeleteRole(role)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer border-none bg-transparent"
                              title="Delete Role"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Capabilities pill & assigned users */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setUsersRoleFilter(role._id || role.id);
                            setActiveTab("users");
                          }}
                          className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-indigo-700 transition-colors cursor-pointer bg-transparent border-none p-0"
                          title="Click to view assigned members"
                        >
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            <strong className="text-slate-800">{assignedCount}</strong> assigned staff
                          </span>
                        </button>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                          <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                          <span>
                            {isAll ? 'All Modules Unlocked' : `${permCount} of ${totalSystemPerms} capabilities`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB 2: SVG CONSULTANCY PERMISSIONS MATRIX TABLE ───────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "matrix" && (
        <div className="space-y-6">
          {/* Top Control Bar: Role Switcher & Matrix Actions */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Active Role Configuring
                  </label>
                  <select
                    value={selectedMatrixRoleId}
                    onChange={(e) => setSelectedMatrixRoleId(e.target.value)}
                    className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer min-w-[240px]"
                  >
                    {roles.map(r => (
                      <option key={r._id || r.id} value={r._id || r.id}>
                        {r.name} {r.isSystem ? '(System Core)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Filter Modules
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filter module name..."
                      value={matrixFilterQuery}
                      onChange={(e) => setMatrixFilterQuery(e.target.value)}
                      className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-52"
                    />
                  </div>
                </div>
              </div>

              {/* Action Presets */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePresetSelectAll}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-all cursor-pointer border border-indigo-200 flex items-center gap-1.5"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Grant All</span>
                </button>
                <button
                  type="button"
                  onClick={handlePresetReadOnly}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-200 flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Read-Only Preset</span>
                </button>
                <button
                  type="button"
                  onClick={handlePresetClearAll}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-all cursor-pointer border border-rose-200"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={handleSaveMatrix}
                  disabled={savingMatrix}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ml-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingMatrix ? "Saving..." : "Save Matrix Changes"}</span>
                </button>
              </div>
            </div>

            {/* Quick Role Switcher Chips */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">Quick Roles:</span>
              {roles.slice(0, 8).map(r => {
                const isSelected = (r._id || r.id) === selectedMatrixRoleId;
                return (
                  <button
                    key={r._id || r.id}
                    type="button"
                    onClick={() => setSelectedMatrixRoleId(r._id || r.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {r.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── SVG CONSULTANCY MATRIX TABLE ─── */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider border-b border-slate-800">
                    <th className="py-4 px-5 min-w-[260px]">ERP Module / Domain</th>
                    <th className="py-4 px-4 text-center min-w-[90px]">
                      <span className="flex items-center justify-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        <span>View</span>
                      </span>
                    </th>
                    <th className="py-4 px-4 text-center min-w-[90px]">
                      <span className="flex items-center justify-center gap-1">
                        <Plus className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Add</span>
                      </span>
                    </th>
                    <th className="py-4 px-4 text-center min-w-[90px]">
                      <span className="flex items-center justify-center gap-1">
                        <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Edit</span>
                      </span>
                    </th>
                    <th className="py-4 px-4 text-center min-w-[90px]">
                      <span className="flex items-center justify-center gap-1">
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        <span>Delete</span>
                      </span>
                    </th>
                    <th className="py-4 px-4 text-center min-w-[90px]">
                      <span className="flex items-center justify-center gap-1">
                        <Download className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Export</span>
                      </span>
                    </th>
                    <th className="py-4 px-4 text-center min-w-[100px]">
                      <span className="flex items-center justify-center gap-1">
                        <CheckSquare className="w-3.5 h-3.5 text-purple-400" />
                        <span>All</span>
                      </span>
                    </th>
                    <th className="py-4 px-3 text-center min-w-[70px]">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMatrixModules.map((mod, idx) => {
                    const isViewChecked = isActionChecked(mod.key, "view");
                    const isAddChecked = isActionChecked(mod.key, "create");
                    const isEditChecked = isActionChecked(mod.key, "edit");
                    const isDeleteChecked = isActionChecked(mod.key, "delete");
                    const isExportChecked = isActionChecked(mod.key, "export");
                    const isAll = isRowAllChecked(mod);
                    const isExpanded = !!expandedModules[mod.key];

                    const grantedSlugsCount = mod.permissions.filter(p => selectedPermissions.has(p.slug)).length;

                    return (
                      <React.Fragment key={mod.key}>
                        <tr className={`hover:bg-indigo-50/40 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                          {/* Module Name & Icon */}
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-3">
                              <span className="text-xl shrink-0 p-2 bg-slate-100 rounded-xl">{mod.icon || "📁"}</span>
                              <div>
                                <div className="font-black text-slate-900 flex items-center gap-2">
                                  <span>{mod.name}</span>
                                  {grantedSlugsCount > 0 && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                      {grantedSlugsCount}/{mod.permissions.length} Active
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400 line-clamp-1 max-w-sm mt-0.5 font-medium">
                                  {mod.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* View Action Checkbox */}
                          <td className="py-3.5 px-4 text-center">
                            <label className="inline-flex items-center justify-center cursor-pointer p-1">
                              <input
                                type="checkbox"
                                checked={isViewChecked}
                                onChange={() => toggleAction(mod.key, "view")}
                                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                              />
                            </label>
                          </td>

                          {/* Add Action Checkbox */}
                          <td className="py-3.5 px-4 text-center">
                            <label className="inline-flex items-center justify-center cursor-pointer p-1">
                              <input
                                type="checkbox"
                                checked={isAddChecked}
                                onChange={() => toggleAction(mod.key, "create")}
                                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                              />
                            </label>
                          </td>

                          {/* Edit Action Checkbox */}
                          <td className="py-3.5 px-4 text-center">
                            <label className="inline-flex items-center justify-center cursor-pointer p-1">
                              <input
                                type="checkbox"
                                checked={isEditChecked}
                                onChange={() => toggleAction(mod.key, "edit")}
                                className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
                              />
                            </label>
                          </td>

                          {/* Delete Action Checkbox */}
                          <td className="py-3.5 px-4 text-center">
                            <label className="inline-flex items-center justify-center cursor-pointer p-1">
                              <input
                                type="checkbox"
                                checked={isDeleteChecked}
                                onChange={() => toggleAction(mod.key, "delete")}
                                className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
                              />
                            </label>
                          </td>

                          {/* Export Action Checkbox */}
                          <td className="py-3.5 px-4 text-center">
                            <label className="inline-flex items-center justify-center cursor-pointer p-1">
                              <input
                                type="checkbox"
                                checked={isExportChecked}
                                onChange={() => toggleAction(mod.key, "export")}
                                className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500 cursor-pointer"
                              />
                            </label>
                          </td>

                          {/* All Toggle Checkbox */}
                          <td className="py-3.5 px-4 text-center">
                            <label className="inline-flex items-center justify-center cursor-pointer p-1">
                              <input
                                type="checkbox"
                                checked={isAll}
                                onChange={() => toggleRowAll(mod)}
                                className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
                              />
                            </label>
                          </td>

                          {/* Granular Details Accordion Toggle */}
                          <td className="py-3.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => toggleModuleExpansion(mod.key)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer border-none bg-transparent"
                              title={isExpanded ? "Hide detailed slugs" : "View detailed slugs"}
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>

                        {/* Expandable Granular Slugs Sub-Grid */}
                        {isExpanded && (
                          <tr className="bg-indigo-50/30 border-b border-indigo-100">
                            <td colSpan={8} className="p-4 pl-14">
                              <div className="space-y-2">
                                <div className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>Granular Sub-Capabilities for {mod.name}:</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                                  {mod.permissions.map(p => {
                                    const isSlugChecked = selectedPermissions.has(p.slug);
                                    return (
                                      <label
                                        key={p.slug}
                                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                                          isSlugChecked
                                            ? "bg-white border-indigo-300 text-indigo-950 shadow-xs ring-1 ring-indigo-300/50"
                                            : "bg-white/80 border-slate-200 text-slate-600 hover:bg-white"
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isSlugChecked}
                                          onChange={() => handleToggleSlug(p.slug)}
                                          className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <div className="space-y-0.5 min-w-0">
                                          <div className={`font-bold leading-tight ${isSlugChecked ? 'text-indigo-950 font-black' : 'text-slate-700'}`}>
                                            {p.name}
                                          </div>
                                          <div className="text-[10px] font-mono text-slate-400 truncate">
                                            {p.slug}
                                          </div>
                                        </div>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sticky Bottom Actions Bar */}
          <div className="sticky bottom-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-xl flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <div className="text-xs text-slate-600 font-bold">
                Configuring: <strong className="text-indigo-600 font-black">{activeMatrixRole?.name}</strong> •{" "}
                <span className="text-slate-800 font-black">{selectedPermissions.size}</span> active capabilities assigned
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePresetClearAll}
                className="px-3.5 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-bold transition-all cursor-pointer bg-transparent border-none"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleSaveMatrix}
                disabled={savingMatrix}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingMatrix ? "Saving Matrix..." : "Save Matrix Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB 3: ASSIGNED STAFF & USERS DIRECTORY ───────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search staff name, email, phone..."
                  value={usersSearchQuery}
                  onChange={(e) => setUsersSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <select
                value={usersRoleFilter}
                onChange={(e) => setUsersRoleFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="all">All Roles Filter</option>
                {roles.map(r => (
                  <option key={r._id || r.id} value={r._id || r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAddUserModal()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Staff User</span>
              </button>
            </div>
          </div>

          {/* Staff Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Staff Member</th>
                    <th className="py-3.5 px-4">Contact Info</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Assigned Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRoleUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                        No staff members found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRoleUsers.map(u => {
                      const roleObj = roles.find(r => (r._id || r.id) === u.roleId);
                      const isSystem = roleObj?.isSystem;

                      return (
                        <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                                {u.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{u.name}</div>
                                <div className="text-[11px] text-slate-400 font-medium">{u.designation || 'Campus Staff'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span>{u.email}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{u.phone || 'N/A'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-600">
                            {u.department || 'Administration'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              <ShieldCheck className="w-3 h-3 text-indigo-600" />
                              <span>{u.roleName || roleObj?.name || 'Assigned Staff'}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {u.status || 'Active'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenChangeRole(u)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer border border-slate-200"
                                title="Change User Role"
                              >
                                Change Role
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u._id, u.name)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer border-none bg-transparent"
                                title="Remove User"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL 1: CREATE / EDIT ROLE MODAL ─────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scaleUp">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {editingRole ? `Edit Role: ${editingRole.name}` : "Create New Campus Role"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Define custom administrative privileges and campus responsibilities.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRoleModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer border-none bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoleModal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Role Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={roleFormName}
                  onChange={(e) => setRoleFormName(e.target.value)}
                  disabled={editingRole?.isSystem}
                  placeholder="e.g. Senior Accountant, Transport Coordinator, Librarian"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 disabled:bg-slate-100 disabled:text-slate-500"
                />
                {editingRole?.isSystem && (
                  <p className="text-[11px] text-amber-600 mt-1 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Core system role title is locked. Permissions can still be tailored in the Matrix.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Role Description
                </label>
                <textarea
                  rows={3}
                  value={roleFormDesc}
                  onChange={(e) => setRoleFormDesc(e.target.value)}
                  placeholder="Operational responsibilities and scope of this role..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              {!editingRole && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Initial Privilege Preset
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRoleFormPreset("custom")}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                        roleFormPreset === "custom"
                          ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Custom Matrix
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoleFormPreset("readonly")}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                        roleFormPreset === "readonly"
                          ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Read-Only
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoleFormPreset("full")}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                        roleFormPreset === "full"
                          ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Full Admin
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRoleModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRole}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingRole ? "Saving..." : editingRole ? "Update Role" : "Create Role"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL 2: ADD STAFF USER MODAL ─────────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scaleUp">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Add Campus Staff User</h3>
                  <p className="text-xs text-slate-400">Assign a staff member to an administrative role.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUserModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer border-none bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={userForm.name}
                    onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="ramesh@schoolerp.edu"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    value={userForm.phone}
                    onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Assigned Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={userForm.roleId}
                    onChange={(e) => setUserForm(prev => ({ ...prev, roleId: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 cursor-pointer"
                  >
                    <option value="" disabled>Select a role...</option>
                    {roles.map((r) => (
                      <option key={r._id || r.id} value={r._id || r.id}>
                        {r.name} {r.isSystem ? '(System Core)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={userForm.designation}
                    onChange={(e) => setUserForm(prev => ({ ...prev, designation: e.target.value }))}
                    placeholder="e.g. Senior Accountant"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    value={userForm.department}
                    onChange={(e) => setUserForm(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="e.g. Finance & Accounts"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{savingUser ? "Adding..." : "Add Staff Member"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* ─── MODAL 3: CHANGE USER ROLE MODAL ───────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {changeRoleModalOpen && userToChangeRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-scaleUp">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Reassign Staff Role</h3>
                  <p className="text-xs text-slate-400">Change role for {userToChangeRole.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChangeRoleModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer border-none bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-900">{userToChangeRole.name}</div>
                <div className="text-[11px] text-slate-500">{userToChangeRole.email}</div>
                <div className="text-[11px] text-indigo-600 font-bold mt-1">
                  Current Role: {userToChangeRole.roleName || 'Assigned Staff'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select New Role <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newSelectedRoleId}
                  onChange={(e) => setNewSelectedRoleId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {roles.map(r => (
                    <option key={r._id || r.id} value={r._id || r.id}>
                      {r.name} {r.isSystem ? '(System Core)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setChangeRoleModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveChangeRole}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Role</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

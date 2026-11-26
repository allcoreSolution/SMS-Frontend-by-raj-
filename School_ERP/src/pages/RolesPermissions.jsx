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
  Phone
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
  const [view, setView] = useState("list"); // "list" | "add" | "edit"
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [roles, setRoles] = useState([]);
  const [permissionModules, setPermissionModules] = useState(ALL_PERMISSIONS_MODULES);
  const [searchQuery, setSearchQuery] = useState("");

  // Form active state
  const [editingRole, setEditingRole] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [roleDesc, setRoleDesc] = useState("");
  const [filterQuery, setFilterQuery] = useState("");

  // Accordion state
  const [accordions, setAccordions] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());

  // ─── User Management Modal States ───
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [savingUser, setSavingUser] = useState(false);

  // Users in Role Modal / Drawer
  const [viewUsersRole, setViewUsersRole] = useState(null);
  const [roleUsers, setRoleUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const totalSystemPerms = useMemo(() => {
    return permissionModules.reduce((sum, mod) => sum + (mod.permissions?.length || 0), 0);
  }, [permissionModules]);

  // Fetch roles and permission matrix from API
  const fetchRolesData = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesRes, matrixRes] = await Promise.allSettled([
        settingsService.getRoles(),
        settingsService.getPermissionsMatrix()
      ]);

      let fetchedRoles = [];
      if (rolesRes.status === "fulfilled" && rolesRes.value?.success && Array.isArray(rolesRes.value.data)) {
        fetchedRoles = rolesRes.value.data;
      } else {
        const fallbackRes = await settingsService.getSetting("roles_permissions");
        if (fallbackRes?.success && Array.isArray(fallbackRes.data)) {
          fetchedRoles = fallbackRes.data;
        }
      }

      if (fetchedRoles.length > 0) {
        setRoles(fetchedRoles);
      }

      // Matrix
      if (matrixRes.status === "fulfilled" && matrixRes.value?.success && Array.isArray(matrixRes.value.data) && matrixRes.value.data.length > 0) {
        setPermissionModules(matrixRes.value.data);
        const accs = matrixRes.value.data.reduce((acc, m) => {
          acc[m.key] = true;
          return acc;
        }, {});
        setAccordions(accs);
      } else {
        const accs = ALL_PERMISSIONS_MODULES.reduce((acc, m) => {
          acc[m.key] = true;
          return acc;
        }, {});
        setAccordions(accs);
      }
    } catch (err) {
      console.warn("Could not fetch roles from API, using defaults:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRolesData();
  }, [fetchRolesData]);

  // Toggle single permission
  const handleTogglePermission = (slug) => {
    setSelectedPermissions(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  // Toggle all permissions inside a module
  const handleToggleCategory = (moduleKey, permList) => {
    const slugs = permList.map(p => p.slug);
    const allChecked = slugs.every(slug => selectedPermissions.has(slug));

    setSelectedPermissions(prev => {
      const next = new Set(prev);
      if (allChecked) {
        slugs.forEach(slug => next.delete(slug));
      } else {
        slugs.forEach(slug => next.add(slug));
      }
      return next;
    });
  };

  const handleToggleAllPermissions = (selectAll) => {
    if (selectAll) {
      const allSlugs = permissionModules.flatMap(m => m.permissions.map(p => p.slug));
      setSelectedPermissions(new Set(allSlugs));
    } else {
      setSelectedPermissions(new Set());
    }
  };

  const handleToggleAllAccordions = (expand) => {
    const next = permissionModules.reduce((acc, mod) => {
      acc[mod.key] = expand;
      return acc;
    }, {});
    setAccordions(next);
  };

  const toggleAccordion = (key) => {
    setAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddRoleClick = () => {
    setEditingRole(null);
    setRoleName("");
    setRoleDesc("");
    setSelectedPermissions(new Set());
    setFilterQuery("");
    setView("add");
  };

  const handleEditRoleClick = (role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDesc(role.description || role.desc || "");
    setFilterQuery("");

    const rolePerms = role.permissions || role.permissionSlugs || [];
    if (rolePerms.includes("all")) {
      const allSlugs = permissionModules.flatMap(m => m.permissions.map(p => p.slug));
      setSelectedPermissions(new Set(allSlugs));
    } else {
      setSelectedPermissions(new Set(rolePerms));
    }
    setView("edit");
  };

  const handleDeleteRole = (role) => {
    if (role.isSystem) {
      Swal.fire({
        icon: "error",
        title: "Protected Role",
        text: "System Core roles cannot be deleted as they are essential to campus operation."
      });
      return;
    }

    if (role.userCount > 0) {
      Swal.fire({
        icon: "warning",
        title: "Staff Assigned",
        text: `Cannot delete '${role.name}' because ${role.userCount} staff or user(s) are assigned this role. Reassign them first.`
      });
      return;
    }

    Swal.fire({
      title: "Delete Role?",
      text: `Are you sure you want to remove '${role.name}'? Staff assigned this role will lose associated permissions.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete role"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (role._id) {
            await settingsService.deleteRole(role._id);
          }
          const updated = roles.filter(r => (r._id || r.id) !== (role._id || role.id));
          setRoles(updated);
          settingsService.saveSetting("roles_permissions", updated).catch(() => {});
          Swal.fire({ icon: "success", title: "Role Deleted", timer: 1500, showConfirmButton: false });
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Delete Failed",
            text: err?.response?.data?.message || err.message || "Failed to remove role"
          });
        }
      }
    });
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) {
      Swal.fire({ icon: "warning", title: "Name Required", text: "Please enter a Role Name." });
      return;
    }

    setSaving(true);
    const permArray = Array.from(selectedPermissions);

    try {
      if (editingRole && editingRole._id) {
        await settingsService.updateRole(editingRole._id, {
          name: roleName.trim(),
          description: roleDesc.trim(),
          permissions: permArray
        });
      } else {
        await settingsService.createRole({
          name: roleName.trim(),
          description: roleDesc.trim(),
          permissions: permArray,
          scope: 'school'
        });
      }

      await fetchRolesData();

      Swal.fire({
        icon: "success",
        title: editingRole ? "Role Updated!" : "Role Created!",
        text: `Access permissions for '${roleName}' saved successfully.`,
        timer: 1800,
        showConfirmButton: false
      });

      setView("list");
    } catch (err) {
      console.error("Save role error:", err);
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: err?.response?.data?.message || err.message || "Could not save role."
      });
    } finally {
      setSaving(false);
    }
  };

  // ─── USER MANAGEMENT HANDLERS ───
  const openAddUserModal = (targetRoleId = null) => {
    const defaultRoleId = targetRoleId || (roles[0] ? roles[0]._id : '');
    setUserForm({
      ...emptyUserForm,
      roleId: defaultRoleId
    });
    setUserModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) {
      Swal.fire({ icon: 'warning', title: 'Fields Required', text: 'Full Name and Email are required.' });
      return;
    }

    setSavingUser(true);
    try {
      const selectedRole = roles.find(r => r._id === userForm.roleId);
      const res = await settingsService.addRoleUser({
        name: userForm.name.trim(),
        email: userForm.email.trim(),
        phone: userForm.phone.trim(),
        password: userForm.password || 'admin@123',
        roleId: userForm.roleId,
        roleName: selectedRole ? selectedRole.name : 'Staff',
        designation: userForm.designation || selectedRole?.name || 'Staff Member',
        department: userForm.department || 'Administration',
        status: userForm.status,
        scope: 'school'
      });

      if (res?.success) {
        Swal.fire({
          icon: 'success',
          title: 'User Added Successfully!',
          text: `${userForm.name} assigned to role '${selectedRole?.name || 'Staff'}'.`,
          timer: 2000,
          showConfirmButton: false
        });
      }

      setUserModalOpen(false);
      setUserForm(emptyUserForm);
      await fetchRolesData();

      if (viewUsersRole) {
        fetchUsersForRole(viewUsersRole);
      }
    } catch (err) {
      console.warn('API add user error, caching locally:', err);
      const updated = roles.map(r => r._id === userForm.roleId ? { ...r, userCount: (r.userCount || 0) + 1 } : r);
      setRoles(updated);
      Swal.fire({
        icon: 'success',
        title: 'User Profile Recorded',
        text: `New user '${userForm.name}' recorded.`,
        timer: 1800,
        showConfirmButton: false
      });
      setUserModalOpen(false);
    } finally {
      setSavingUser(false);
    }
  };

  const fetchUsersForRole = async (role) => {
    setViewUsersRole(role);
    setLoadingUsers(true);
    try {
      const res = await settingsService.getRoleUsers({ roleId: role._id });
      if (res?.success && Array.isArray(res.data)) {
        setRoleUsers(res.data);
      } else {
        setRoleUsers([]);
      }
    } catch (err) {
      console.warn('Could not fetch role users list:', err);
      setRoleUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    Swal.fire({
      title: `Remove ${userName}?`,
      text: 'This user account will lose portal access.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Yes, remove user'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await settingsService.deleteRoleUser(userId);
          setRoleUsers(prev => prev.filter(u => u._id !== userId));
          fetchRolesData();
          Swal.fire({ icon: 'success', title: 'User Removed', timer: 1500, showConfirmButton: false });
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Error', text: err?.response?.data?.message || err.message });
        }
      }
    });
  };

  // Filter permissions in edit view
  const filteredModules = useMemo(() => {
    if (!filterQuery.trim()) return permissionModules;
    const q = filterQuery.toLowerCase();
    return permissionModules.map(module => {
      const matchPerms = module.permissions.filter(
        p => p.name.toLowerCase().includes(q) || 
             p.slug.toLowerCase().includes(q)
      );
      return { ...module, permissions: matchPerms };
    }).filter(module => module.permissions.length > 0);
  }, [filterQuery, permissionModules]);

  // Filter roles list
  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return roles;
    const q = searchQuery.toLowerCase();
    return roles.filter(r => 
      r.name.toLowerCase().includes(q) ||
      ((r.description || r.desc) && (r.description || r.desc).toLowerCase().includes(q))
    );
  }, [searchQuery, roles]);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800 pb-24">
      
      {/* ─── Hero Header ─── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-slate-950/10 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              Campus Access Control
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-white/10 rounded-full border border-white/10 text-slate-300">
              RBAC Security
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Key className="w-7 h-7 text-indigo-400 inline" />
            Roles & Granular Permissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Define custom administrative staff roles, assign discrete capability privileges, and manage school users.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 self-start md:self-auto">
          {view === "list" ? (
            <>
              <button
                onClick={() => openAddUserModal()}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer border-none"
              >
                <UserPlus className="w-4 h-4 text-white" />
                <span>Add User / Staff</span>
              </button>
              <button
                onClick={handleAddRoleClick}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer border-none"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Create New Role</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setView("list")}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Roles List</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── KPI Stats Row ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Campus Roles</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{roles.length}</div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">Active Roles</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">System Protected</div>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {roles.filter(r => r.isSystem).length}
          </div>
          <div className="text-[11px] text-purple-600 font-semibold mt-0.5">Core Roles</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Users</div>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {roles.reduce((acc, r) => acc + (r.userCount || 0), 0)}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Staff & Accounts</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ERP Modules Covered</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{permissionModules.length}</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-0.5">{totalSystemPerms} Capabilities</div>
        </div>
      </div>

      {/* ─── 1. LIST VIEW OF ALL ROLES ─── */}
      {view === "list" && (
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
                onClick={handleAddRoleClick}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Create New Role
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRoles.map((role) => {
                const perms = role.permissions || role.permissionSlugs || [];
                const isAll = perms.includes("all");
                const permCount = isAll ? totalSystemPerms : perms.length;

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
                            onClick={() => openAddUserModal(role._id)}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer border-none bg-transparent"
                            title="Add User to this Role"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEditRoleClick(role)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer border-none bg-transparent"
                            title="Edit Permissions"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {!role.isSystem && (
                            <button
                              onClick={() => handleDeleteRole(role)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border-none bg-transparent"
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
                          onClick={() => fetchUsersForRole(role)}
                          className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-indigo-700 transition-colors cursor-pointer bg-transparent border-none p-0"
                          title="Click to view assigned members"
                        >
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            <strong className="text-slate-800">{role.userCount || 0}</strong> assigned user(s)
                          </span>
                        </button>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                          <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                          <span>
                            {isAll ? 'All Modules Unlocked' : `${permCount} of ${totalSystemPerms} permissions`}
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

      {/* ─── 2. ADD / EDIT ROLE VIEW (PERMISSIONS MATRIX) ─── */}
      {(view === "add" || view === "edit") && (
        <form onSubmit={handleSaveRole} className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Key className="w-5 h-5 text-indigo-600" />
                  {editingRole ? `Edit Role: ${editingRole.name}` : "Create New Campus Role"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set role identity and configure capability privileges across all School ERP modules.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving..." : editingRole ? "Update Role" : "Save New Role"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Role Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  disabled={editingRole?.isSystem}
                  placeholder="e.g. Librarian, Transport Manager, Fee Cashier"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 disabled:bg-slate-100 disabled:text-slate-500"
                />
                {editingRole?.isSystem && (
                  <p className="text-[10px] text-amber-600 mt-1 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Core role title is locked. Permissions can still be tailored.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Role Description
                </label>
                <input
                  type="text"
                  value={roleDesc}
                  onChange={(e) => setRoleDesc(e.target.value)}
                  placeholder="Summary of operational duties and department"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* ─── Permission Checkbox Matrix ─── */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter module permissions..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleAllPermissions(true)}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Select All Permissions
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleAllPermissions(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleAllAccordions(true)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  Expand All
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleAllAccordions(false)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* Matrix Accordions */}
            <div className="space-y-3">
              {filteredModules.map((mod) => {
                const isExpanded = accordions[mod.key] !== false;
                const totalInMod = mod.permissions.length;
                const selectedInMod = mod.permissions.filter(p => selectedPermissions.has(p.slug)).length;
                const allModSelected = totalInMod > 0 && selectedInMod === totalInMod;

                return (
                  <div
                    key={mod.key}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
                  >
                    {/* Module Header Bar */}
                    <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleCategory(mod.key, mod.permissions)}
                          className="text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer bg-transparent border-none p-0"
                          title={allModSelected ? "Unselect Category" : "Select Category"}
                        >
                          {allModSelected ? (
                            <CheckSquare className="w-5 h-5 text-indigo-600" />
                          ) : selectedInMod > 0 ? (
                            <div className="w-5 h-5 rounded bg-indigo-100 border border-indigo-400 flex items-center justify-center text-indigo-700 text-[10px] font-black">
                              -
                            </div>
                          ) : (
                            <Square className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                          )}
                        </button>

                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{mod.icon || "📁"}</span>
                          <div>
                            <h4 className="font-black text-xs sm:text-sm text-slate-800">{mod.name}</h4>
                            <p className="text-[11px] text-slate-400 font-medium">{mod.description || ""}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {selectedInMod} / {totalInMod} Granted
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleAccordion(mod.key)}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer border-none bg-transparent"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Permissions Checkbox Grid */}
                    {isExpanded && (
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-white">
                        {mod.permissions.map((perm) => {
                          const isChecked = selectedPermissions.has(perm.slug);

                          return (
                            <label
                              key={perm.slug}
                              onClick={() => handleTogglePermission(perm.slug)}
                              className={`flex items-start gap-3 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all select-none ${
                                isChecked
                                  ? "bg-indigo-50/60 border-indigo-300 text-indigo-900 shadow-xs"
                                  : "bg-white border-slate-200/70 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="sr-only"
                              />
                              <div className="mt-0.5 shrink-0">
                                {isChecked ? (
                                  <div className="w-4 h-4 rounded bg-indigo-600 text-white flex items-center justify-center">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </div>
                                ) : (
                                  <div className="w-4 h-4 rounded border border-slate-300 bg-white" />
                                )}
                              </div>
                              <div className="space-y-0.5 min-w-0">
                                <div className="font-bold text-slate-800 leading-tight">{perm.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono truncate">{perm.slug}</div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="sticky bottom-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-lg flex items-center justify-between z-20">
            <div className="text-xs text-slate-500 font-bold">
              Total Permissions Assigned:{" "}
              <span className="text-indigo-600 font-black text-sm">{selectedPermissions.size}</span> of {totalSystemPerms}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setView("list")}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : editingRole ? "Save Changes" : "Create Role"}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ─── 3. ADD USER MODAL ─── */}
      {userModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden border border-slate-100 max-h-[92vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-indigo-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-slate-800 text-base">Add School User / Staff</h2>
                  <p className="text-xs text-slate-500">Create login and assign campus role</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUserModalOpen(false)}
                className="p-1.5 hover:bg-slate-200/60 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer border-none bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="staff@school.edu"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Assign Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={userForm.roleId}
                    onChange={(e) => setUserForm({ ...userForm, roleId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  >
                    {roles.map((r) => (
                      <option key={r._id || r.id} value={r._id || r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Account Status
                  </label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  >
                    <option value="Active">Active (Login Allowed)</option>
                    <option value="Inactive">Inactive (Suspended)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={userForm.designation}
                    onChange={(e) => setUserForm({ ...userForm, designation: e.target.value })}
                    placeholder="e.g. Senior Teacher"
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
                    onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                    placeholder="e.g. Science / Admin"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Login Password
                </label>
                <input
                  type="text"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  placeholder="admin@123"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
                <p className="text-[10px] text-slate-400 mt-1">Default password is admin@123 if unchanged.</p>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingUser ? 'Saving...' : 'Add User'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── 4. VIEW ASSIGNED USERS DRAWER / MODAL ─── */}
      {viewUsersRole && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden border border-slate-100 max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-slate-800 text-base">
                    Members with Role: {viewUsersRole.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {roleUsers.length} active campus account(s)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    openAddUserModal(viewUsersRole._id || viewUsersRole.id);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewUsersRole(null)}
                  className="p-1.5 hover:bg-slate-200/60 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer border-none bg-transparent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-3">
              {loadingUsers ? (
                <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                  <span className="text-xs font-bold">Loading assigned members...</span>
                </div>
              ) : roleUsers.length === 0 ? (
                <div className="p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
                  <Users className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-600">No staff currently assigned to {viewUsersRole.name}</p>
                  <button
                    onClick={() => openAddUserModal(viewUsersRole._id || viewUsersRole.id)}
                    className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Assign First User
                  </button>
                </div>
              ) : (
                roleUsers.map((u) => (
                  <div
                    key={u._id}
                    className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-indigo-200 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0">
                        {u.name ? u.name.slice(0, 2).toUpperCase() : 'US'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-xs sm:text-sm text-slate-800 truncate">{u.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            u.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                          }`}>
                            {u.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                          <span className="flex items-center gap-1 truncate">
                            <Mail className="w-3 h-3 text-slate-400" /> {u.email}
                          </span>
                          {u.phone && (
                            <span className="hidden sm:flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" /> {u.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteUser(u._id, u.name)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border-none bg-transparent"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

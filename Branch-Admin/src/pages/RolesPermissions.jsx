import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import {
  ShieldCheck,
  ShieldAlert,
  Key,
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Lock,
  ArrowLeft,
  Save,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Building2,
  CreditCard,
  Wallet,
  Settings,
  LayoutTemplate,
  Info,
  CheckCircle2,
  Check,
  X,
  Mail,
  Phone,
  Copy,
  Filter,
  BarChart2,
  BookOpen,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  Eye,
  Download,
  Sliders,
  CheckCheck
} from 'lucide-react';
import branchAdminService from '../api/branchAdminService';
import branchLocalDb from '../api/branchLocalDb';

// Master Permission Modules across all Multi-Campus Operations
const BRANCH_PERMISSION_MODULES = [
  {
    key: "overview",
    name: "Multi-Campus Overview & KPIs",
    icon: BarChart2,
    color: "from-blue-500 to-indigo-600",
    description: "Consolidated executive stats, high-value KPI metrics, and multi-campus summary widgets.",
    permissions: [
      { name: "View Consolidated Overview", slug: "overview.view", desc: "Access the main Multi-Campus summary dashboard" },
      { name: "View High-Value KPI Widgets", slug: "overview.kpis", desc: "Inspect student counts, collections, and staff metrics" },
      { name: "Export Aggregated Reports", slug: "overview.export", desc: "Download high-level executive CSV summaries" }
    ]
  },
  {
    key: "branches",
    name: "Campuses & Branches Management",
    icon: Building2,
    color: "from-amber-500 to-orange-600",
    description: "Multi-branch directory, onboarding new campuses, editing details, and direct portal launch.",
    permissions: [
      { name: "View Branches Directory", slug: "branches.view", desc: "Browse full list of campuses, contacts, and student strength" },
      { name: "Register New Branch Campus", slug: "branches.create", desc: "Onboard new school branch into the trust network" },
      { name: "Edit Campus Profile & Staff", slug: "branches.edit", desc: "Modify principal name, contact phone, and subscription plan" },
      { name: "Activate / Suspend Branch", slug: "branches.status", desc: "Toggle active or suspended state of a school branch" },
      { name: "Delete / Archive Branch", slug: "branches.delete", desc: "Permanently delete or archive a branch campus record" },
      { name: "Launch School Admin Portal", slug: "branches.launch", desc: "SSO redirect directly into campus School ERP dashboard" }
    ]
  },
  {
    key: "finances",
    name: "Multi-Campus Financial Audit",
    icon: Wallet,
    color: "from-emerald-500 to-teal-600",
    description: "Consolidated fee collections, multi-campus dues ledger, and income vs expense balances.",
    permissions: [
      { name: "View Fee Collections Ledger", slug: "finances.fees.view", desc: "Inspect student fee collections across all branches" },
      { name: "Audit Defaulters & Class Dues", slug: "finances.fees.audit", desc: "Analyze outstanding dues and pending fee collections" },
      { name: "View Income & Expenses", slug: "finances.expense.view", desc: "Review cross-campus operational income and expenditure" },
      { name: "Financial Audit & Approval", slug: "finances.expense.audit", desc: "Conduct internal financial checks and audit compliance" },
      { name: "Export Financial Books", slug: "finances.export", desc: "Download audit-ready financial CSV reports" }
    ]
  },
  {
    key: "payments",
    name: "Trust Billing & Invoices",
    icon: CreditCard,
    color: "from-purple-500 to-violet-600",
    description: "SaaS platform license fees, renewal payments, payment gateway transactions, and invoices.",
    permissions: [
      { name: "View Payment History", slug: "payments.view", desc: "Browse all subscription and trust licensing payments" },
      { name: "Download GST Invoices", slug: "payments.invoices", desc: "Generate and download official billing invoices" },
      { name: "Manage Plans & Renewals", slug: "payments.manage", desc: "Upgrade campus tiers and handle subscription renewals" }
    ]
  },
  {
    key: "attendance",
    name: "Attendance Analytics & Trends",
    icon: Activity,
    color: "from-sky-500 to-cyan-600",
    description: "Multi-campus student attendance benchmarks, teacher punctuality, and absentee patterns.",
    permissions: [
      { name: "Student Attendance Analytics", slug: "attendance.students.view", desc: "Compare student attendance trends across campuses" },
      { name: "Staff Attendance Telemetry", slug: "attendance.staff.view", desc: "Monitor teacher & non-teaching staff attendance rates" },
      { name: "Export Attendance Trends", slug: "attendance.trends.export", desc: "Download multi-branch attendance comparison records" }
    ]
  },
  {
    key: "templates",
    name: "Standardized Document Templates",
    icon: LayoutTemplate,
    color: "from-rose-500 to-pink-600",
    description: "Trust-wide standardized certificates, fee receipts, student ID cards, and circular templates.",
    permissions: [
      { name: "View Template Repository", slug: "templates.view", desc: "Browse pre-designed standardized trust templates" },
      { name: "Create New Template", slug: "templates.create", desc: "Author custom circulars and standardized documents" },
      { name: "Edit Template Formats", slug: "templates.edit", desc: "Modify layout, headers, and formatting of documents" },
      { name: "Delete Templates", slug: "templates.delete", desc: "Remove obsolete or unapproved template designs" },
      { name: "Download & Print Templates", slug: "templates.download", desc: "Export print-ready document formats" }
    ]
  },
  {
    key: "communications",
    name: "Multi-Campus Communications",
    icon: Mail,
    color: "from-indigo-500 to-blue-600",
    description: "Broadcast circulars, trust notices, emergency SMS alerts, and delivery logs across branches.",
    permissions: [
      { name: "View Communications Log", slug: "communications.view", desc: "Inspect circulars and broadcast history" },
      { name: "Send Multi-Campus Broadcast", slug: "communications.broadcast", desc: "Transmit trust notices or emergency alerts to all branches" },
      { name: "Export Delivery Audit", slug: "communications.export", desc: "Download communication analytics and recipient logs" }
    ]
  },
  {
    key: "audit",
    name: "Access & Security Audit Logs",
    icon: ShieldAlert,
    color: "from-amber-600 to-red-600",
    description: "System security telemetry, admin login logs, IP tracking, and user activity audit trails.",
    permissions: [
      { name: "View Login Audit Logs", slug: "audit.login_logs", desc: "Monitor multi-branch admin and operator login attempts" },
      { name: "Inspect User Engagement", slug: "audit.engagement", desc: "Review feature usage and operator activities" },
      { name: "Platform Security Telemetry", slug: "audit.telemetry", desc: "Access high-level device, browser, and security telemetry" }
    ]
  },
  {
    key: "roles_staff",
    name: "Branch Team & RBAC Governance",
    icon: Users,
    color: "from-orange-500 to-amber-600",
    description: "Define HQ access roles, allocate branch supervision scopes, and manage headquarters users.",
    permissions: [
      { name: "Manage Branch Access Roles", slug: "roles_staff.roles.manage", desc: "Create, edit, or configure custom branch roles" },
      { name: "Manage HQ Staff Users", slug: "roles_staff.staff.manage", desc: "Invite, update, or deactivate branch admin personnel" },
      { name: "Assign Roles & Scopes", slug: "roles_staff.assign", desc: "Map users to specific roles and branch clusters" }
    ]
  }
];

const emptyUserForm = {
  name: '',
  email: '',
  phone: '',
  roleId: '',
  status: 'Active',
  branchScope: 'All Campuses'
};

export default function RolesPermissions() {
  // SVG Consultancy 3-Tab RBAC standard: "roles" | "matrix" | "users"
  const [activeTab, setActiveTab] = useState("roles");
  const [loading, setLoading] = useState(true);
  const [savingMatrix, setSavingMatrix] = useState(false);

  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [usersRoleFilter, setUsersRoleFilter] = useState('all');

  // Selected Role for Matrix Table View / Edit
  const [selectedMatrixRoleId, setSelectedMatrixRoleId] = useState('');

  // Active role in Matrix
  const activeMatrixRole = useMemo(() => {
    return roles.find(r => (r.id || r._id) === selectedMatrixRoleId) || roles[0] || null;
  }, [roles, selectedMatrixRoleId]);

  const [selectedPermissions, setSelectedPermissions] = useState(new Set());
  const [matrixFilterQuery, setMatrixFilterQuery] = useState('');
  const [expandedModules, setExpandedModules] = useState({});

  // ─── Modal States ───
  // 1. Role Create / Edit Modal
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleFormName, setRoleFormName] = useState('');
  const [roleFormDesc, setRoleFormDesc] = useState('');
  const [roleFormPreset, setRoleFormPreset] = useState('custom');
  const [savingRole, setSavingRole] = useState(false);

  // 2. Add User Modal
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [savingUser, setSavingUser] = useState(false);

  // 3. Change User Role Modal
  const [changeRoleModalOpen, setChangeRoleModalOpen] = useState(false);
  const [userToChangeRole, setUserToChangeRole] = useState(null);
  const [newSelectedRoleId, setNewSelectedRoleId] = useState('');

  // Total system permissions
  const totalSystemPerms = useMemo(() => {
    return BRANCH_PERMISSION_MODULES.reduce((sum, mod) => sum + mod.permissions.length, 0);
  }, []);

  // Load roles & users
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [rolesRes, usersRes] = await Promise.all([
        branchAdminService.getRoles(),
        branchAdminService.getRoleUsers()
      ]);
      const loadedRoles = rolesRes.data || [];
      const loadedUsers = usersRes.data || [];
      setRoles(loadedRoles);
      setUsers(loadedUsers);

      if (!selectedMatrixRoleId && loadedRoles.length > 0) {
        setSelectedMatrixRoleId(loadedRoles[0].id || loadedRoles[0]._id);
      }
    } catch (err) {
      console.error("Failed to load roles and users:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedMatrixRoleId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sync selectedPermissions when activeMatrixRole changes
  useEffect(() => {
    if (!activeMatrixRole) return;
    const perms = activeMatrixRole.permissions || [];
    const isAll = perms.includes("all") || activeMatrixRole.name === 'Super Admin' || activeMatrixRole.name === 'Trustee / Director';

    if (isAll) {
      const allSlugs = BRANCH_PERMISSION_MODULES.flatMap(m => [
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
          const mod = BRANCH_PERMISSION_MODULES.find(m => m.key === modKey);
          if (mod) mod.permissions.forEach(mp => set.add(mp.slug));
        } else {
          set.add(p);
        }
      });
      setSelectedPermissions(set);
    }
  }, [activeMatrixRole]);

  // ─── SVG CONSULTANCY MATRIX HELPERS ───
  const getActionSlug = (modKey, action) => {
    return `${modKey}.${action}`;
  };

  const isActionChecked = (modKey, action) => {
    const slug = getActionSlug(modKey, action);
    if (selectedPermissions.has(slug)) return true;
    const mod = BRANCH_PERMISSION_MODULES.find(m => m.key === modKey);
    if (!mod) return false;

    if (action === "view") {
      return mod.permissions.some(p => p.slug.includes("view") && selectedPermissions.has(p.slug));
    }
    if (action === "create") {
      return mod.permissions.some(p => (p.slug.includes("create") || p.slug.includes("manage") || p.slug.includes("broadcast")) && selectedPermissions.has(p.slug));
    }
    if (action === "edit") {
      return mod.permissions.some(p => (p.slug.includes("edit") || p.slug.includes("manage") || p.slug.includes("status")) && selectedPermissions.has(p.slug));
    }
    if (action === "delete") {
      return selectedPermissions.has(`${modKey}.delete`) || mod.permissions.some(p => p.slug.includes("delete") && selectedPermissions.has(p.slug));
    }
    if (action === "export") {
      return selectedPermissions.has(`${modKey}.export`) || mod.permissions.some(p => (p.slug.includes("export") || p.slug.includes("download") || p.slug.includes("invoices")) && selectedPermissions.has(p.slug));
    }
    return false;
  };

  const toggleAction = (modKey, action) => {
    const mainSlug = getActionSlug(modKey, action);
    const mod = BRANCH_PERMISSION_MODULES.find(m => m.key === modKey);
    const currentlyChecked = isActionChecked(modKey, action);

    setSelectedPermissions(prev => {
      const next = new Set(prev);
      if (currentlyChecked) {
        next.delete(mainSlug);
        if (mod) {
          mod.permissions.forEach(p => {
            if (action === "view" && p.slug.includes("view")) next.delete(p.slug);
            if (action === "create" && p.slug.includes("create")) next.delete(p.slug);
            if (action === "delete" && p.slug.includes("delete")) next.delete(p.slug);
            if (action === "export" && p.slug.includes("export")) next.delete(p.slug);
          });
        }
      } else {
        next.add(mainSlug);
        if (mod) {
          mod.permissions.forEach(p => {
            if (action === "view" && p.slug.includes("view")) next.add(p.slug);
            if (action === "create" && p.slug.includes("create")) next.add(p.slug);
            if (action === "delete" && p.slug.includes("delete")) next.add(p.slug);
            if (action === "export" && p.slug.includes("export")) next.add(p.slug);
          });
        }
      }
      return next;
    });
  };

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

  const handleToggleSlug = (slug) => {
    setSelectedPermissions(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const handlePresetSelectAll = () => {
    const allSlugs = BRANCH_PERMISSION_MODULES.flatMap(m => [
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
    const readSlugs = BRANCH_PERMISSION_MODULES.flatMap(m => {
      const views = [`${m.key}.view`];
      m.permissions.forEach(p => {
        if (p.slug.includes("view") || p.slug.includes("kpis")) {
          views.push(p.slug);
        }
      });
      return views;
    });
    setSelectedPermissions(new Set(readSlugs));
  };

  const toggleModuleExpansion = (modKey) => {
    setExpandedModules(prev => ({ ...prev, [modKey]: !prev[modKey] }));
  };

  // Save Permissions Matrix Changes for active role
  const handleSaveMatrix = async () => {
    if (!activeMatrixRole) return;
    setSavingMatrix(true);

    const updatedPermsList = Array.from(selectedPermissions);
    const roleId = activeMatrixRole.id || activeMatrixRole._id;

    try {
      await branchAdminService.updateRole(roleId, {
        permissions: updatedPermsList
      });

      setRoles(prev => prev.map(r => {
        if ((r.id || r._id) === roleId) {
          return { ...r, permissions: updatedPermsList };
        }
        return r;
      }));

      Swal.fire({
        icon: "success",
        title: "Matrix Privileges Saved!",
        text: `Permissions for branch role '${activeMatrixRole.name}' have been saved.`,
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
    setRoleFormDesc(role.description || "");
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
        const roleId = editingRole.id || editingRole._id;
        await branchAdminService.updateRole(roleId, {
          name: roleFormName.trim(),
          description: roleFormDesc.trim()
        });

        setRoles(prev => prev.map(r => {
          if ((r.id || r._id) === roleId) {
            return { ...r, name: roleFormName.trim(), description: roleFormDesc.trim() };
          }
          return r;
        }));

        Swal.fire({ icon: 'success', title: 'Role Updated', timer: 1500, showConfirmButton: false });
      } else {
        let initialPerms = [];
        if (roleFormPreset === "full") {
          initialPerms = ["all"];
        } else if (roleFormPreset === "readonly") {
          initialPerms = BRANCH_PERMISSION_MODULES.map(m => `${m.key}.view`);
        } else {
          initialPerms = ["overview.view", "branches.view"];
        }

        const res = await branchAdminService.createRole({
          name: roleFormName.trim(),
          description: roleFormDesc.trim() || "Custom multi-campus role.",
          isSystem: false,
          permissions: initialPerms
        });

        const newRole = res.data;
        setRoles(prev => [...prev, newRole]);
        setSelectedMatrixRoleId(newRole.id || newRole._id);

        Swal.fire({
          icon: 'success',
          title: 'Role Created!',
          text: `Role '${newRole.name}' created. Configure permissions in the Matrix.`,
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
        text: `Role '${role.name}' is an essential system role and cannot be deleted.`
      });
      return;
    }

    Swal.fire({
      title: `Delete Role '${role.name}'?`,
      text: "HQ staff members assigned to this role will lose access privileges.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete role"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const roleId = role.id || role._id;
        await branchAdminService.deleteRole(roleId);
        setRoles(prev => prev.filter(r => (r.id || r._id) !== roleId));

        if (selectedMatrixRoleId === roleId) {
          const remaining = roles.filter(r => (r.id || r._id) !== roleId);
          setSelectedMatrixRoleId(remaining[0]?.id || remaining[0]?._id || '');
        }

        Swal.fire({ icon: "success", title: "Role Deleted", timer: 1500, showConfirmButton: false });
      }
    });
  };

  // ─── USER MANAGEMENT HANDLERS ───
  const openAddUserModal = (targetRoleId = "") => {
    setUserForm({
      ...emptyUserForm,
      roleId: targetRoleId || selectedMatrixRoleId || (roles[0]?.id || roles[0]?._id || '')
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
    const selectedRole = roles.find(r => (r.id || r._id) === userForm.roleId) || { name: 'HQ Staff' };

    try {
      const res = await branchAdminService.addRoleUser({
        ...userForm,
        roleName: selectedRole.name
      });

      const newUser = res.data;
      setUsers(prev => [newUser, ...prev]);

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
    setNewSelectedRoleId(user.roleId || (roles[0]?.id || roles[0]?._id || ''));
    setChangeRoleModalOpen(true);
  };

  const handleSaveChangeRole = async () => {
    if (!userToChangeRole || !newSelectedRoleId) return;
    const targetRole = roles.find(r => (r.id || r._id) === newSelectedRoleId);
    if (!targetRole) return;

    try {
      await branchAdminService.updateRoleUser(userToChangeRole.id || userToChangeRole._id, {
        roleId: newSelectedRoleId,
        roleName: targetRole.name
      });

      setUsers(prev => prev.map(u => {
        if ((u.id || u._id) === (userToChangeRole.id || userToChangeRole._id)) {
          return { ...u, roleId: newSelectedRoleId, roleName: targetRole.name };
        }
        return u;
      }));

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
      text: "This user will lose access to branch HQ operations.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, remove user"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await branchAdminService.deleteRoleUser(userId);
        setUsers(prev => prev.filter(u => (u.id || u._id) !== userId));
        Swal.fire({ icon: 'success', title: 'User Removed', timer: 1500, showConfirmButton: false });
      }
    });
  };

  // ─── FILTERED DATA ───
  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return roles;
    const q = searchQuery.toLowerCase();
    return roles.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
    );
  }, [roles, searchQuery]);

  const filteredMatrixModules = useMemo(() => {
    if (!matrixFilterQuery.trim()) return BRANCH_PERMISSION_MODULES;
    const q = matrixFilterQuery.toLowerCase();
    return BRANCH_PERMISSION_MODULES.filter(m => 
      m.name.toLowerCase().includes(q) ||
      m.key.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.permissions.some(p => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q))
    );
  }, [matrixFilterQuery]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchRole = usersRoleFilter === "all" || u.roleId === usersRoleFilter;
      const q = userSearchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        u.name?.toLowerCase().includes(q) || 
        u.email?.toLowerCase().includes(q) || 
        u.phone?.toLowerCase().includes(q) ||
        u.branchScope?.toLowerCase().includes(q);
      return matchRole && matchSearch;
    });
  }, [users, usersRoleFilter, userSearchQuery]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans text-slate-800 pb-24">
      {/* ─── Hero Header ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#070d1e] via-[#0f172a] to-[#1e1b4b] p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-96 h-96 bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Enterprise RBAC & Branch Governance
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <Key className="w-7 h-7 text-orange-400 inline" />
              Multi-Campus Roles & Granular Permissions
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              SVG Consultancy style RBAC: Govern HQ roles, inspect the interactive Module × Action Matrix grid, and delegate cross-campus supervision to regional managers and auditors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => openAddUserModal()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer border-none"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span>Add Staff Member</span>
            </button>
            <button
              onClick={handleOpenCreateRole}
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center gap-1.5 cursor-pointer border-none"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Create Branch Role</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── 3-Tab Navigation Bar (SVG Consultancy Model) ─── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("roles")}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === "roles"
              ? "bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/20"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Branch Roles Directory</span>
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
              ? "bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/20"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Permissions Matrix Grid</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === "matrix" ? "bg-white/20 text-white" : "bg-orange-50 text-orange-700"
          }`}>
            {activeMatrixRole?.name || "Matrix"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === "users"
              ? "bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/20"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>HQ & Branch Staff</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === "users" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
          }`}>
            {users.length}
          </span>
        </button>
      </div>

      {/* ─── KPI Stats Row ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Branch Roles</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{roles.length}</div>
          <div className="text-[11px] text-orange-600 font-semibold mt-0.5">Configured Roles</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">System Protected</div>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {roles.filter((r) => r.isSystem).length}
          </div>
          <div className="text-[11px] text-purple-600 font-semibold mt-0.5">Core Trust Roles</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">HQ Staff Assigned</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{users.length}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Personnel With Access</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Capabilities</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{totalSystemPerms}</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-0.5">{BRANCH_PERMISSION_MODULES.length} Multi-Branch Modules</div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB 1: BRANCH ROLES DIRECTORY ─────────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "roles" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search branch roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadData}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer border-none bg-transparent"
                title="Refresh Roles"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <div className="text-xs font-bold text-slate-400">
                Showing <span className="text-orange-600 font-black">{filteredRoles.length}</span> roles
              </div>
            </div>
          </div>

          {filteredRoles.length === 0 ? (
            <div className="p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-600">No branch roles found</p>
              <button
                onClick={handleOpenCreateRole}
                className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Create Branch Role
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRoles.map((role) => {
                const perms = role.permissions || [];
                const isAll = perms.includes('all') || role.name === 'Super Admin' || role.name === 'Trustee / Director';
                let permCount = isAll ? totalSystemPerms : perms.length;

                const assignedCount = users.filter(u => u.roleId === (role.id || role._id)).length;

                return (
                  <div
                    key={role.id || role._id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between"
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
                                Custom Branch Role
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed line-clamp-2">
                            {role.description || "No description provided."}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedMatrixRoleId(role.id || role._id);
                              setActiveTab("matrix");
                            }}
                            className="px-2.5 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-orange-200"
                            title="Open Permissions Matrix"
                          >
                            <Sliders className="w-3 h-3" />
                            <span>Matrix</span>
                          </button>
                          <button
                            onClick={() => openAddUserModal(role.id || role._id)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer border-none bg-transparent"
                            title="Add Staff"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditRole(role)}
                            className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all cursor-pointer border-none bg-transparent"
                            title="Edit Role"
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
                            setUsersRoleFilter(role.id || role._id);
                            setActiveTab("users");
                          }}
                          className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-orange-700 transition-colors cursor-pointer bg-transparent border-none p-0"
                          title="Click to view assigned members"
                        >
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            <strong className="text-slate-800">{assignedCount}</strong> staff assigned
                          </span>
                        </button>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-lg border border-orange-100">
                          <CheckCircle2 className="w-3 h-3 text-orange-600" />
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
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Active Branch Role Configuring
                  </label>
                  <select
                    value={selectedMatrixRoleId}
                    onChange={(e) => setSelectedMatrixRoleId(e.target.value)}
                    className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer min-w-[240px]"
                  >
                    {roles.map(r => (
                      <option key={r.id || r._id} value={r.id || r._id}>
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
                      className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 w-52"
                    />
                  </div>
                </div>
              </div>

              {/* Action Presets */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePresetSelectAll}
                  className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold rounded-xl transition-all cursor-pointer border border-orange-200 flex items-center gap-1.5"
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
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black rounded-xl shadow-md shadow-orange-500/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ml-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingMatrix ? "Saving..." : "Save Matrix Changes"}</span>
                </button>
              </div>
            </div>

            {/* Quick Role Switcher Chips */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">Quick Roles:</span>
              {roles.slice(0, 6).map(r => {
                const isSelected = (r.id || r._id) === selectedMatrixRoleId;
                return (
                  <button
                    key={r.id || r._id}
                    type="button"
                    onClick={() => setSelectedMatrixRoleId(r.id || r._id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                      isSelected
                        ? "bg-orange-600 text-white border-orange-600 shadow-xs"
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
                    <th className="py-4 px-5 min-w-[260px]">Multi-Branch Domain / Module</th>
                    <th className="py-4 px-4 text-center min-w-[90px]">
                      <span className="flex items-center justify-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-orange-400" />
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
                    const ModIcon = mod.icon || Building2;

                    return (
                      <React.Fragment key={mod.key}>
                        <tr className={`hover:bg-orange-50/40 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                          {/* Module Name & Icon */}
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-3">
                              <span className="p-2.5 bg-orange-50 text-orange-600 rounded-xl shrink-0">
                                <ModIcon className="w-4 h-4" />
                              </span>
                              <div>
                                <div className="font-black text-slate-900 flex items-center gap-2">
                                  <span>{mod.name}</span>
                                  {grantedSlugsCount > 0 && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
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
                                className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500 cursor-pointer"
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
                              className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all cursor-pointer border-none bg-transparent"
                              title={isExpanded ? "Hide detailed slugs" : "View detailed slugs"}
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>

                        {/* Expandable Granular Slugs Sub-Grid */}
                        {isExpanded && (
                          <tr className="bg-orange-50/30 border-b border-orange-100">
                            <td colSpan={8} className="p-4 pl-14">
                              <div className="space-y-2">
                                <div className="text-[11px] font-bold text-orange-900 uppercase tracking-wider flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
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
                                            ? "bg-white border-orange-300 text-orange-950 shadow-xs ring-1 ring-orange-300/50"
                                            : "bg-white/80 border-slate-200 text-slate-600 hover:bg-white"
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isSlugChecked}
                                          onChange={() => handleToggleSlug(p.slug)}
                                          className="mt-0.5 rounded text-orange-600 focus:ring-orange-500"
                                        />
                                        <div className="space-y-0.5 min-w-0">
                                          <div className={`font-bold leading-tight ${isSlugChecked ? 'text-orange-950 font-black' : 'text-slate-700'}`}>
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
                Configuring: <strong className="text-orange-600 font-black">{activeMatrixRole?.name}</strong> •{" "}
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
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white rounded-xl text-xs font-black shadow-lg shadow-orange-500/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingMatrix ? "Saving Matrix..." : "Save Matrix Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB 3: HQ & BRANCH STAFF USERS ────────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user name, email, phone..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
                />
              </div>

              <select
                value={usersRoleFilter}
                onChange={(e) => setUsersRoleFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                <option value="all">All Roles Filter</option>
                {roles.map(r => (
                  <option key={r.id || r._id} value={r.id || r._id}>{r.name}</option>
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
                    <th className="py-3.5 px-4">HQ Personnel</th>
                    <th className="py-3.5 px-4">Contact Info</th>
                    <th className="py-3.5 px-4">Campus Jurisdiction</th>
                    <th className="py-3.5 px-4">Assigned Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                        No HQ personnel found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => {
                      const roleObj = roles.find(r => (r.id || r._id) === u.roleId);

                      return (
                        <tr key={u.id || u._id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                                {u.name ? u.name.charAt(0) : 'U'}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{u.name}</div>
                                <div className="text-[11px] text-slate-400 font-medium">{u.designation || 'Branch Administrator'}</div>
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
                            {u.branchScope || 'All Campuses'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                              <ShieldCheck className="w-3 h-3 text-orange-600" />
                              <span>{u.roleName || roleObj?.name || 'Assigned Role'}</span>
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
                                onClick={() => handleDeleteUser(u.id || u._id, u.name)}
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
                <div className="p-2.5 bg-orange-500/20 text-orange-400 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {editingRole ? `Edit Role: ${editingRole.name}` : "Create New Branch Role"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Define multi-campus governance authority and supervisory scope.
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
                  placeholder="e.g. Regional Campus Director, Chief Internal Auditor"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 disabled:bg-slate-100 disabled:text-slate-500"
                />
                {editingRole?.isSystem && (
                  <p className="text-[11px] text-amber-600 mt-1 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Core role title is locked. Permissions can still be tailored in the Matrix.
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
                  placeholder="Operational responsibilities and branch cluster jurisdiction..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
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
                          ? "bg-orange-50 border-orange-500 text-orange-700 ring-1 ring-orange-500"
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
                          ? "bg-orange-50 border-orange-500 text-orange-700 ring-1 ring-orange-500"
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
                          ? "bg-orange-50 border-orange-500 text-orange-700 ring-1 ring-orange-500"
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
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-black shadow-md shadow-orange-500/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
                  <h3 className="text-base font-black text-white">Add HQ / Branch Personnel</h3>
                  <p className="text-xs text-slate-400">Assign a staff member to an administrative branch role.</p>
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
                    placeholder="e.g. Anand Kulkarni"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
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
                    placeholder="anand@trustnetwork.edu"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
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
                    placeholder="+91 98765 00000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 cursor-pointer"
                  >
                    <option value="" disabled>Select a role...</option>
                    {roles.map((r) => (
                      <option key={r.id || r._id} value={r.id || r._id}>
                        {r.name} {r.isSystem ? '(System Core)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Campus Jurisdiction / Scope
                </label>
                <input
                  type="text"
                  value={userForm.branchScope}
                  onChange={(e) => setUserForm(prev => ({ ...prev, branchScope: e.target.value }))}
                  placeholder="e.g. All Campuses, North Region, Campus Delhi"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
                />
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
                <div className="p-2.5 bg-orange-500/20 text-orange-400 rounded-xl">
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
                <div className="text-[11px] text-orange-600 font-bold mt-1">
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                >
                  {roles.map(r => (
                    <option key={r.id || r._id} value={r.id || r._id}>
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
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-black shadow-md shadow-orange-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
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

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Layers,
  CreditCard,
  Wallet,
  Server,
  Settings,
  LayoutTemplate,
  Headset,
  Info,
  CheckCircle2,
  Check,
  CloudOff,
  X,
  Mail,
  Phone,
  Power,
  Eye,
  Download,
  Filter,
  Sliders,
  CheckCheck,
  Sparkles
} from 'lucide-react';
import { superAdminService } from '../../api/superAdminService';

// Module Icon map
const MODULE_ICONS = {
  tenants: Building2,
  plans: Layers,
  billing: CreditCard,
  team: Users,
  comms: Wallet,
  server: Server,
  settings: Settings,
  website: LayoutTemplate,
  support: Headset,
};

// Fallback Master Permissions for SuperAdmin
const FALLBACK_SUPERADMIN_MODULES = [
  {
    key: "tenants",
    name: "Tenants & Schools",
    icon: "Building2",
    description: "Manage registered schools, onboarding, plan allocation, and tenant domains.",
    permissions: [
      { name: "View Schools Directory", slug: "tenants.view" },
      { name: "Register New School", slug: "tenants.create" },
      { name: "Edit School Profile", slug: "tenants.edit" },
      { name: "Suspend / Activate School", slug: "tenants.status" },
      { name: "Delete School Tenant", slug: "tenants.delete" },
      { name: "Impersonate School Admin", slug: "tenants.impersonate" },
      { name: "Manage School Custom Domains", slug: "tenants.domains" }
    ]
  },
  {
    key: "plans",
    name: "SaaS Plans & Add-ons",
    icon: "Layers",
    description: "Subscription tiers, custom plan limits, and add-on pricing.",
    permissions: [
      { name: "View Plans & Tiers", slug: "plans.view" },
      { name: "Create & Edit SaaS Plans", slug: "plans.manage" },
      { name: "Configure Plan Add-ons", slug: "plans.addons.manage" },
      { name: "Adjust Pricing & Billing Cycles", slug: "plans.pricing" }
    ]
  },
  {
    key: "billing",
    name: "Payments & Invoicing",
    icon: "CreditCard",
    description: "Platform subscription fees, gateway integrations, and GST invoices.",
    permissions: [
      { name: "View Transaction History", slug: "billing.payments.view" },
      { name: "Generate & Download Invoices", slug: "billing.invoices.manage" },
      { name: "Configure Payment Gateways", slug: "billing.gateways.manage" },
      { name: "Manage License Orders", slug: "billing.license_orders.manage" }
    ]
  },
  {
    key: "team",
    name: "Platform Team & RBAC",
    icon: "Users",
    description: "Platform super administrators, support agents, and access privileges.",
    permissions: [
      { name: "View Team Members", slug: "team.view" },
      { name: "Add Team Member", slug: "team.create" },
      { name: "Edit Team Member Profile", slug: "team.edit" },
      { name: "Manage Roles & Permissions", slug: "team.roles.manage" },
      { name: "Reset Passwords & Status", slug: "team.security" },
      { name: "Delete Team Member", slug: "team.delete" }
    ]
  },
  {
    key: "comms",
    name: "Communication & Telecom Hub",
    icon: "Wallet",
    description: "Comms wallets, SMS & WhatsApp gateways, Meta DLT, and rate cards.",
    permissions: [
      { name: "Wallet Oversight & Recharges", slug: "comms.wallets.manage" },
      { name: "Configure Rate Cards", slug: "comms.rates.manage" },
      { name: "SMS Gateways & Routing", slug: "comms.sms.manage" },
      { name: "Meta WhatsApp & DLT Setup", slug: "comms.meta_dlt.manage" },
      { name: "View Delivery Reports", slug: "comms.reports.view" }
    ]
  },
  {
    key: "server",
    name: "Infrastructure & Telemetry",
    icon: "Server",
    description: "Server metrics, database nodes, automated backups, and cron monitor.",
    permissions: [
      { name: "View Server Telemetry & Health", slug: "server.health.view" },
      { name: "Trigger Automated Backups", slug: "server.backups.manage" },
      { name: "Manage Storage Nodes", slug: "server.storage.manage" },
      { name: "Monitor Cron Jobs", slug: "server.cron.manage" },
      { name: "Software Update Deployments", slug: "server.updates.manage" }
    ]
  },
  {
    key: "settings",
    name: "Global Platform Settings",
    icon: "Settings",
    description: "White-label branding, SMTP configurations, and system defaults.",
    permissions: [
      { name: "Platform General Settings", slug: "settings.general.manage" },
      { name: "App Branding & White Label", slug: "settings.branding.manage" },
      { name: "Configure Mail / SMTP Servers", slug: "settings.smtp.manage" },
      { name: "Telegram Bot Integration", slug: "settings.telegram.manage" },
      { name: "Registration & Security Policy", slug: "settings.security.manage" }
    ]
  },
  {
    key: "website",
    name: "Website & Landing CMS",
    icon: "LayoutTemplate",
    description: "Marketing landing pages, visual theme engine, and ready templates.",
    permissions: [
      { name: "Manage Website Pages", slug: "website.pages.manage" },
      { name: "Visual Site Builder", slug: "website.builder.manage" },
      { name: "Template Library Oversight", slug: "website.templates.manage" },
      { name: "SEO & Header / Footer Config", slug: "website.seo.manage" }
    ]
  },
  {
    key: "support",
    name: "Customer Support Desk",
    icon: "Headset",
    description: "Incoming support tickets from schools, resolution tracking, and chat.",
    permissions: [
      { name: "View Support Tickets", slug: "support.tickets.view" },
      { name: "Assign & Reply to Tickets", slug: "support.tickets.reply" },
      { name: "Close & Resolve Issues", slug: "support.tickets.close" }
    ]
  }
];

// Fallback Default Roles for SuperAdmin
const FALLBACK_DEFAULT_ROLES = [
  {
    _id: "role_sa_1",
    name: "SuperAdmin",
    scope: "superadmin",
    isSystem: true,
    userCount: 1,
    description: "Platform owner with unrestricted access to all tenants, billing, server, and platform settings.",
    permissions: ["all"]
  },
  {
    _id: "role_sa_2",
    name: "Operations & Tenant Manager",
    scope: "superadmin",
    isSystem: false,
    userCount: 0,
    description: "Manages school onboarding, plan upgrades, domains, and school account status.",
    permissions: [
      "tenants.view", "tenants.create", "tenants.edit", "tenants.status", "tenants.domains",
      "plans.view", "billing.payments.view", "support.tickets.view", "support.tickets.reply"
    ]
  },
  {
    _id: "role_sa_3",
    name: "Billing & Financial Controller",
    scope: "superadmin",
    isSystem: false,
    userCount: 0,
    description: "Oversees subscription invoices, payments, payment gateways, and communications wallet rate cards.",
    permissions: [
      "billing.payments.view", "billing.invoices.manage", "billing.gateways.manage", "billing.license_orders.manage",
      "plans.view", "plans.pricing", "comms.wallets.manage", "comms.rates.manage"
    ]
  },
  {
    _id: "role_sa_4",
    name: "Customer Support Lead",
    scope: "superadmin",
    isSystem: false,
    userCount: 0,
    description: "Handles incoming customer support tickets, school troubleshooting, and communication oversight.",
    permissions: [
      "tenants.view", "support.tickets.view", "support.tickets.reply", "support.tickets.close",
      "comms.reports.view"
    ]
  },
  {
    _id: "role_sa_5",
    name: "Content & Visual Specialist",
    scope: "superadmin",
    isSystem: false,
    userCount: 0,
    description: "Builds landing pages, visual templates, theme styling, and public documentation.",
    permissions: [
      "website.pages.manage", "website.builder.manage", "website.templates.manage", "website.seo.manage",
      "settings.branding.manage"
    ]
  }
];

// Fallback SuperAdmin Team Members
const FALLBACK_TEAM_USERS = [
  {
    _id: "usr_sa_01",
    name: "Raj Yadav (Super Admin)",
    email: "admin@allcoresolution.com",
    phone: "+91 98765 00001",
    roleId: "role_sa_1",
    roleName: "SuperAdmin",
    designation: "Platform Owner",
    department: "Executive Leadership",
    status: "Active"
  },
  {
    _id: "usr_sa_02",
    name: "Vikram Malhotra",
    email: "vikram.ops@allcoresolution.com",
    phone: "+91 98765 00002",
    roleId: "role_sa_2",
    roleName: "Operations & Tenant Manager",
    designation: "Head of School Onboarding",
    department: "Operations",
    status: "Active"
  },
  {
    _id: "usr_sa_03",
    name: "Pooja Verma",
    email: "pooja.billing@allcoresolution.com",
    phone: "+91 98765 00003",
    roleId: "role_sa_3",
    roleName: "Billing & Financial Controller",
    designation: "Finance Director",
    department: "Finance & Invoicing",
    status: "Active"
  }
];

const emptyUserForm = {
  name: '',
  email: '',
  phone: '',
  password: 'admin@123',
  roleId: '',
  designation: 'Operations Specialist',
  department: 'Operations',
  status: 'Active'
};

export default function RolesPermissions() {
  const navigate = useNavigate();

  // SVG Consultancy 3-Tab RBAC standard: "roles" | "matrix" | "users"
  const [activeTab, setActiveTab] = useState("roles");
  const [loading, setLoading] = useState(true);
  const [savingMatrix, setSavingMatrix] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const [roles, setRoles] = useState(() => {
    try {
      const cached = localStorage.getItem('superadmin_cached_roles');
      if (cached) return JSON.parse(cached);
    } catch (_) {}
    return FALLBACK_DEFAULT_ROLES;
  });

  const [permissionsMatrix, setPermissionsMatrix] = useState(FALLBACK_SUPERADMIN_MODULES);
  const [searchQuery, setSearchQuery] = useState('');
  const [usersSearchQuery, setUsersSearchQuery] = useState('');
  const [usersRoleFilter, setUsersRoleFilter] = useState('all');

  // Selected Role for Matrix Table View / Edit
  const [selectedMatrixRoleId, setSelectedMatrixRoleId] = useState(() => {
    return roles[0]?._id || "role_sa_1";
  });

  // Current Selected Role in Matrix Tab
  const activeMatrixRole = useMemo(() => {
    return roles.find(r => (r._id || r.id) === selectedMatrixRoleId) || roles[0] || null;
  }, [roles, selectedMatrixRoleId]);

  // Selected permission slugs for the active matrix role
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());
  const [matrixFilterQuery, setMatrixFilterQuery] = useState("");
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
  const [roleUsers, setRoleUsers] = useState(() => {
    try {
      const cached = localStorage.getItem('superadmin_cached_role_users');
      if (cached) return JSON.parse(cached);
    } catch (_) {}
    return FALLBACK_TEAM_USERS;
  });

  // Sync selectedPermissions when activeMatrixRole changes
  useEffect(() => {
    if (!activeMatrixRole) return;
    const perms = activeMatrixRole.permissions || activeMatrixRole.permissionSlugs || [];
    const isAll = perms.includes("all") || activeMatrixRole.name === 'SuperAdmin';

    if (isAll) {
      const allSlugs = permissionsMatrix.flatMap(m => [
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
          const mod = permissionsMatrix.find(m => m.key === modKey);
          if (mod) mod.permissions.forEach(mp => set.add(mp.slug));
        } else {
          set.add(p);
        }
      });
      setSelectedPermissions(set);
    }
  }, [activeMatrixRole, permissionsMatrix]);

  // 1. Fetch Roles & Permissions Matrix
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesRes, matrixRes, usersRes] = await Promise.allSettled([
        superAdminService.getRoles('superadmin'),
        superAdminService.getPermissionsMatrix('superadmin'),
        superAdminService.getRoleUsers({ scope: 'superadmin' })
      ]);

      let loadedRoles = false;
      if (rolesRes.status === 'fulfilled' && rolesRes.value?.success && Array.isArray(rolesRes.value.data) && rolesRes.value.data.length > 0) {
        setRoles(rolesRes.value.data);
        localStorage.setItem('superadmin_cached_roles', JSON.stringify(rolesRes.value.data));
        loadedRoles = true;
      }

      if (matrixRes.status === 'fulfilled' && matrixRes.value?.success && Array.isArray(matrixRes.value.data) && matrixRes.value.data.length > 0) {
        setPermissionsMatrix(matrixRes.value.data);
      }

      if (usersRes.status === 'fulfilled' && usersRes.value?.success && Array.isArray(usersRes.value.data) && usersRes.value.data.length > 0) {
        setRoleUsers(usersRes.value.data);
        localStorage.setItem('superadmin_cached_role_users', JSON.stringify(usersRes.value.data));
      }

      setIsOfflineMode(!loadedRoles);
    } catch (err) {
      console.warn('API sync in progress or unreachable, using cached roles:', err);
      setIsOfflineMode(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalSystemPerms = useMemo(() => {
    return permissionsMatrix.reduce((sum, mod) => sum + (mod.permissions?.length || 0), 0);
  }, [permissionsMatrix]);

  // ─── SVG CONSULTANCY MATRIX HELPERS ───
  const getActionSlug = (modKey, action) => {
    return `${modKey}.${action}`;
  };

  const isActionChecked = (modKey, action) => {
    const slug = getActionSlug(modKey, action);
    if (selectedPermissions.has(slug)) return true;
    const mod = permissionsMatrix.find(m => m.key === modKey);
    if (!mod) return false;

    if (action === "view") {
      return mod.permissions.some(p => p.slug.includes("view") && selectedPermissions.has(p.slug));
    }
    if (action === "create") {
      return mod.permissions.some(p => (p.slug.includes("create") || p.slug.includes("manage")) && selectedPermissions.has(p.slug));
    }
    if (action === "edit") {
      return mod.permissions.some(p => (p.slug.includes("edit") || p.slug.includes("manage") || p.slug.includes("pricing")) && selectedPermissions.has(p.slug));
    }
    if (action === "delete") {
      return selectedPermissions.has(`${modKey}.delete`) || mod.permissions.some(p => p.slug.includes("delete") && selectedPermissions.has(p.slug));
    }
    if (action === "export") {
      return selectedPermissions.has(`${modKey}.export`) || mod.permissions.some(p => (p.slug.includes("report") || p.slug.includes("download") || p.slug.includes("invoices")) && selectedPermissions.has(p.slug));
    }
    return false;
  };

  const toggleAction = (modKey, action) => {
    const mainSlug = getActionSlug(modKey, action);
    const mod = permissionsMatrix.find(m => m.key === modKey);
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
          });
        }
      } else {
        next.add(mainSlug);
        if (mod) {
          mod.permissions.forEach(p => {
            if (action === "view" && p.slug.includes("view")) next.add(p.slug);
            if (action === "create" && p.slug.includes("create")) next.add(p.slug);
            if (action === "delete" && p.slug.includes("delete")) next.add(p.slug);
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
    const allSlugs = permissionsMatrix.flatMap(m => [
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
    const readSlugs = permissionsMatrix.flatMap(m => {
      const views = [`${m.key}.view`];
      m.permissions.forEach(p => {
        if (p.slug.includes("view") || p.slug.includes("report")) {
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

    try {
      try {
        await superAdminService.updateRole(activeMatrixRole._id || activeMatrixRole.id, {
          permissions: updatedPermsList
        });
      } catch (apiErr) {
        console.warn("API role update error, updating local state & cache:", apiErr);
      }

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
          localStorage.setItem('superadmin_cached_roles', JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      Swal.fire({
        icon: "success",
        title: "Matrix Privileges Saved!",
        text: `Permissions for platform role '${activeMatrixRole.name}' have been saved.`,
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
        const roleId = editingRole._id || editingRole.id;
        try {
          await superAdminService.updateRole(roleId, {
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
          try { localStorage.setItem('superadmin_cached_roles', JSON.stringify(updated)); } catch(e){}
          return updated;
        });

        Swal.fire({ icon: 'success', title: 'Role Updated', timer: 1500, showConfirmButton: false });
      } else {
        const newRoleId = `role_sa_${Date.now()}`;
        let initialPerms = [];
        if (roleFormPreset === "full") {
          initialPerms = ["all"];
        } else if (roleFormPreset === "readonly") {
          initialPerms = permissionsMatrix.map(m => `${m.key}.view`);
        } else {
          initialPerms = ["tenants.view", "plans.view"];
        }

        const newRole = {
          _id: newRoleId,
          name: roleFormName.trim(),
          description: roleFormDesc.trim() || "Custom SuperAdmin platform role.",
          isSystem: false,
          userCount: 0,
          scope: 'superadmin',
          permissions: initialPerms
        };

        try {
          const res = await superAdminService.createRole({
            name: roleFormName.trim(),
            description: roleFormDesc.trim(),
            scope: 'superadmin',
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
          try { localStorage.setItem('superadmin_cached_roles', JSON.stringify(updated)); } catch(e){}
          return updated;
        });

        setSelectedMatrixRoleId(newRole._id);
        Swal.fire({
          icon: 'success',
          title: 'Platform Role Created!',
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
        text: `Role '${role.name}' is an essential platform core role and cannot be deleted.`
      });
      return;
    }

    Swal.fire({
      title: `Delete Role '${role.name}'?`,
      text: "Staff members assigned to this platform role will lose access privileges.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete role"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await superAdminService.deleteRole(role._id || role.id);
        } catch (err) {
          console.warn("API delete failed, updating local state:", err);
        }

        const roleId = role._id || role.id;
        setRoles(prev => {
          const updated = prev.filter(r => (r._id || r.id) !== roleId);
          try { localStorage.setItem('superadmin_cached_roles', JSON.stringify(updated)); } catch(e){}
          return updated;
        });

        if (selectedMatrixRoleId === roleId) {
          setSelectedMatrixRoleId("role_sa_1");
        }

        Swal.fire({ icon: "success", title: "Role Deleted", timer: 1500, showConfirmButton: false });
      }
    });
  };

  // ─── USER MANAGEMENT HANDLERS ───
  const openAddUserModal = (targetRoleId = "") => {
    setUserForm({
      ...emptyUserForm,
      roleId: targetRoleId || selectedMatrixRoleId || (roles[0]?._id || "role_sa_1")
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
    const selectedRole = roles.find(r => (r._id || r.id) === userForm.roleId) || { name: 'Operations Specialist' };

    try {
      const newUser = {
        _id: `usr_sa_${Date.now()}`,
        name: userForm.name.trim(),
        email: userForm.email.trim(),
        phone: userForm.phone.trim() || "+91 98765 00000",
        roleId: userForm.roleId,
        roleName: selectedRole.name,
        designation: userForm.designation.trim() || "Platform Specialist",
        department: userForm.department.trim() || "Operations",
        status: userForm.status || "Active"
      };

      try {
        const res = await superAdminService.addRoleUser({
          ...userForm,
          scope: 'superadmin'
        });
        if (res?.success && res.data) {
          newUser._id = res.data._id || newUser._id;
        }
      } catch (apiErr) {
        console.warn("API add user failed, cached locally:", apiErr);
      }

      setRoleUsers(prev => {
        const next = [newUser, ...prev];
        try { localStorage.setItem('superadmin_cached_role_users', JSON.stringify(next)); } catch(e){}
        return next;
      });

      // Update role user count
      setRoles(prev => {
        const updated = prev.map(r => (r._id || r.id) === userForm.roleId ? { ...r, userCount: (r.userCount || 0) + 1 } : r);
        try { localStorage.setItem('superadmin_cached_roles', JSON.stringify(updated)); } catch (e) {}
        return updated;
      });

      Swal.fire({
        icon: 'success',
        title: 'Team Member Added!',
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
        await superAdminService.updateRoleUser(userToChangeRole._id, { roleId: newSelectedRoleId });
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
        try { localStorage.setItem('superadmin_cached_role_users', JSON.stringify(updated)); } catch(e){}
        return updated;
      });

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
        try { localStorage.setItem('superadmin_cached_roles', JSON.stringify(updated)); } catch(e){}
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
      text: "This user account will lose access to the SuperAdmin console.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, remove user"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await superAdminService.deleteRoleUser(userId);
        } catch (e) {
          console.warn("API delete failed, updating local state:", e);
        }

        const targetUser = roleUsers.find(u => u._id === userId);
        setRoleUsers(prev => {
          const updated = prev.filter(u => u._id !== userId);
          try { localStorage.setItem('superadmin_cached_role_users', JSON.stringify(updated)); } catch(e){}
          return updated;
        });

        if (targetUser && targetUser.roleId) {
          setRoles(prev => {
            const updated = prev.map(r => (r._id || r.id) === targetUser.roleId ? { ...r, userCount: Math.max(0, (r.userCount || 1) - 1) } : r);
            try { localStorage.setItem('superadmin_cached_roles', JSON.stringify(updated)); } catch(e){}
            return updated;
          });
        }

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
        r.name.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q))
    );
  }, [roles, searchQuery]);

  const filteredMatrixModules = useMemo(() => {
    if (!matrixFilterQuery.trim()) return permissionsMatrix;
    const q = matrixFilterQuery.toLowerCase();
    return permissionsMatrix.filter(m => 
      m.name.toLowerCase().includes(q) ||
      m.key.toLowerCase().includes(q) ||
      (m.description && m.description.toLowerCase().includes(q)) ||
      m.permissions.some(p => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q))
    );
  }, [matrixFilterQuery, permissionsMatrix]);

  const filteredRoleUsers = useMemo(() => {
    return roleUsers.filter(u => {
      const matchRole = usersRoleFilter === "all" || u.roleId === usersRoleFilter;
      const q = usersSearchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        u.name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q) || 
        (u.phone && u.phone.toLowerCase().includes(q)) ||
        (u.designation && u.designation.toLowerCase().includes(q));
      return matchRole && matchSearch;
    });
  }, [roleUsers, usersRoleFilter, usersSearchQuery]);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800 pb-24">
      {/* ─── Offline / Cloud Sync Notice ─── */}
      {isOfflineMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center gap-2.5">
            <CloudOff className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Backend Cloud Sync:</strong> Displaying platform roles and permissions. Changes are safely cached locally.
            </span>
          </div>
          <button
            type="button"
            onClick={fetchData}
            className="px-3 py-1 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-colors cursor-pointer text-[11px]"
          >
            Retry Sync
          </button>
        </div>
      )}

      {/* ─── Hero Header ─── */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-slate-950/10 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              Platform RBAC Engine
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-white/10 rounded-full border border-white/10 text-purple-200">
              SuperAdmin Security
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Key className="w-7 h-7 text-purple-400 inline" />
            Platform Roles & Granular Permissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            SVG Consultancy style platform RBAC: Govern SuperAdmin privileges, tenant authorizations, billing modules, and platform team permissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 self-start md:self-auto">
          <button
            onClick={() => openAddUserModal()}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer border-none"
          >
            <UserPlus className="w-4 h-4 text-white" />
            <span>Add Team Member</span>
          </button>
          <button
            onClick={handleOpenCreateRole}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5 cursor-pointer border-none"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Create Platform Role</span>
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
              ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Platform Roles Directory</span>
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
              ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Permissions Matrix Grid</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === "matrix" ? "bg-white/20 text-white" : "bg-purple-50 text-purple-700"
          }`}>
            {activeMatrixRole?.name || "Matrix"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === "users"
              ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Platform Team Members</span>
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
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Platform Roles</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{roles.length}</div>
          <div className="text-[11px] text-purple-600 font-semibold mt-0.5">Platform Defined</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">System Protected</div>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {roles.filter((r) => r.isSystem).length}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-0.5">Core System Roles</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Platform Users</div>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {roleUsers.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Assigned Members</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Capabilities</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{totalSystemPerms}</div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">{permissionsMatrix.length} Modules Governed</div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB 1: PLATFORM ROLES DIRECTORY ───────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === "roles" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search platform roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchData}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer border-none bg-transparent"
                title="Refresh Roles"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <div className="text-xs font-bold text-slate-400">
                Showing <span className="text-purple-600 font-black">{filteredRoles.length}</span> platform roles
              </div>
            </div>
          </div>

          {filteredRoles.length === 0 ? (
            <div className="p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-600">No platform roles matched your search</p>
              <button
                onClick={handleOpenCreateRole}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Create Platform Role
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRoles.map((role) => {
                const perms = role.permissions || [];
                const isAll = perms.includes('all') || role.name === 'SuperAdmin';
                let permCount = isAll ? totalSystemPerms : perms.length;

                const assignedCount = roleUsers.filter(u => u.roleId === (role._id || role.id)).length;

                return (
                  <div
                    key={role._id || role.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between"
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
                                Custom Platform Role
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
                              setSelectedMatrixRoleId(role._id || role.id);
                              setActiveTab("matrix");
                            }}
                            className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-purple-200"
                            title="Open Permissions Matrix"
                          >
                            <Sliders className="w-3 h-3" />
                            <span>Matrix</span>
                          </button>
                          <button
                            onClick={() => openAddUserModal(role._id || role.id)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer border-none bg-transparent"
                            title="Add Team Member"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditRole(role)}
                            className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all cursor-pointer border-none bg-transparent"
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
                            setUsersRoleFilter(role._id || role.id);
                            setActiveTab("users");
                          }}
                          className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-purple-700 transition-colors cursor-pointer bg-transparent border-none p-0"
                          title="Click to view assigned members"
                        >
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            <strong className="text-slate-800">{assignedCount}</strong> platform user(s)
                          </span>
                        </button>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-100">
                          <CheckCircle2 className="w-3 h-3 text-purple-600" />
                          <span>
                            {isAll ? 'Full Platform Access' : `${permCount} of ${totalSystemPerms} capabilities`}
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
                    Active Platform Role Configuring
                  </label>
                  <select
                    value={selectedMatrixRoleId}
                    onChange={(e) => setSelectedMatrixRoleId(e.target.value)}
                    className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer min-w-[240px]"
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
                      className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 w-52"
                    />
                  </div>
                </div>
              </div>

              {/* Action Presets */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePresetSelectAll}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl transition-all cursor-pointer border border-purple-200 flex items-center gap-1.5"
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
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black rounded-xl shadow-md shadow-purple-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ml-2"
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
                const isSelected = (r._id || r.id) === selectedMatrixRoleId;
                return (
                  <button
                    key={r._id || r.id}
                    type="button"
                    onClick={() => setSelectedMatrixRoleId(r._id || r.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                      isSelected
                        ? "bg-purple-600 text-white border-purple-600 shadow-xs"
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
                    <th className="py-4 px-5 min-w-[260px]">Platform Resource / Module</th>
                    <th className="py-4 px-4 text-center min-w-[90px]">
                      <span className="flex items-center justify-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-purple-400" />
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
                    const ModIcon = MODULE_ICONS[mod.key] || Building2;

                    return (
                      <React.Fragment key={mod.key}>
                        <tr className={`hover:bg-purple-50/40 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                          {/* Module Name & Icon */}
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-3">
                              <span className="p-2.5 bg-purple-50 text-purple-700 rounded-xl shrink-0">
                                <ModIcon className="w-4 h-4" />
                              </span>
                              <div>
                                <div className="font-black text-slate-900 flex items-center gap-2">
                                  <span>{mod.name}</span>
                                  {grantedSlugsCount > 0 && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
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
                                className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
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
                              className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all cursor-pointer border-none bg-transparent"
                              title={isExpanded ? "Hide detailed slugs" : "View detailed slugs"}
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>

                        {/* Expandable Granular Slugs Sub-Grid */}
                        {isExpanded && (
                          <tr className="bg-purple-50/30 border-b border-purple-100">
                            <td colSpan={8} className="p-4 pl-14">
                              <div className="space-y-2">
                                <div className="text-[11px] font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
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
                                            ? "bg-white border-purple-300 text-purple-950 shadow-xs ring-1 ring-purple-300/50"
                                            : "bg-white/80 border-slate-200 text-slate-600 hover:bg-white"
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isSlugChecked}
                                          onChange={() => handleToggleSlug(p.slug)}
                                          className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                                        />
                                        <div className="space-y-0.5 min-w-0">
                                          <div className={`font-bold leading-tight ${isSlugChecked ? 'text-purple-950 font-black' : 'text-slate-700'}`}>
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
                Configuring: <strong className="text-purple-600 font-black">{activeMatrixRole?.name}</strong> •{" "}
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
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white rounded-xl text-xs font-black shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingMatrix ? "Saving Matrix..." : "Save Matrix Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════ */}
      {/* ─── TAB 3: PLATFORM TEAM MEMBERS & USERS ──────────────────────────────── */}
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
                  value={usersSearchQuery}
                  onChange={(e) => setUsersSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
                />
              </div>

              <select
                value={usersRoleFilter}
                onChange={(e) => setUsersRoleFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
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
                <span>Add Team Member</span>
              </button>
            </div>
          </div>

          {/* Platform Staff Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Platform Member</th>
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
                        No team members found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRoleUsers.map(u => {
                      const roleObj = roles.find(r => (r._id || r.id) === u.roleId);

                      return (
                        <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                                {u.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{u.name}</div>
                                <div className="text-[11px] text-slate-400 font-medium">{u.designation || 'Platform Administrator'}</div>
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
                            {u.department || 'Operations'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              <ShieldCheck className="w-3 h-3 text-purple-600" />
                              <span>{u.roleName || roleObj?.name || 'Platform Staff'}</span>
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
                <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {editingRole ? `Edit Platform Role: ${editingRole.name}` : "Create New Platform Role"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Define platform administrative authority and security scope.
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
                  placeholder="e.g. Compliance Auditor, Financial Controller"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 disabled:bg-slate-100 disabled:text-slate-500"
                />
                {editingRole?.isSystem && (
                  <p className="text-[11px] text-amber-600 mt-1 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Core platform role title is locked. Permissions can still be tailored in the Matrix.
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
                  placeholder="Operational responsibilities and platform authority..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
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
                          ? "bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500"
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
                          ? "bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500"
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
                          ? "bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500"
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
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-md shadow-purple-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
      {/* ─── MODAL 2: ADD TEAM MEMBER MODAL ────────────────────────────────────── */}
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
                  <h3 className="text-base font-black text-white">Add Platform Team Member</h3>
                  <p className="text-xs text-slate-400">Assign an administrator to a SuperAdmin role.</p>
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
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
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
                    placeholder="vikram@allcoresolution.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 cursor-pointer"
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
                    placeholder="e.g. Operations Director"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
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
                    placeholder="e.g. Operations & Compliance"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
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
                  <span>{savingUser ? "Adding..." : "Add Team Member"}</span>
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
                <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Reassign Platform Role</h3>
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
                <div className="text-[11px] text-purple-600 font-bold mt-1">
                  Current Role: {userToChangeRole.roleName || 'Platform Staff'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select New Role <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newSelectedRoleId}
                  onChange={(e) => setNewSelectedRoleId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
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
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-md shadow-purple-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
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

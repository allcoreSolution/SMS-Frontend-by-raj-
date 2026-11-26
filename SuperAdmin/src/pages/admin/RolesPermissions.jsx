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
  CloudOff
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

// Fallback Master Permissions for SuperAdmin (Guarantees zero-blank screen)
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

export default function RolesPermissions() {
  const navigate = useNavigate();
  const [view, setView] = useState('list'); // 'list' | 'add' | 'edit'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  // Form state
  const [editingRole, setEditingRole] = useState(null);
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());
  
  const initialAccordions = useMemo(() => {
    return FALLBACK_SUPERADMIN_MODULES.reduce((acc, m) => {
      acc[m.key] = true;
      return acc;
    }, {});
  }, []);
  const [accordions, setAccordions] = useState(initialAccordions);

  // 1. Fetch Roles & Permissions Matrix with seamless fallback
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesRes, matrixRes] = await Promise.allSettled([
        superAdminService.getRoles('superadmin'),
        superAdminService.getPermissionsMatrix('superadmin'),
      ]);

      let loadedRoles = false;
      if (rolesRes.status === 'fulfilled' && rolesRes.value?.success && Array.isArray(rolesRes.value.data) && rolesRes.value.data.length > 0) {
        setRoles(rolesRes.value.data);
        localStorage.setItem('superadmin_cached_roles', JSON.stringify(rolesRes.value.data));
        loadedRoles = true;
      }

      if (matrixRes.status === 'fulfilled' && matrixRes.value?.success && Array.isArray(matrixRes.value.data) && matrixRes.value.data.length > 0) {
        setPermissionsMatrix(matrixRes.value.data);
        const accs = matrixRes.value.data.reduce((acc, m) => {
          acc[m.key] = true;
          return acc;
        }, {});
        setAccordions(accs);
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

  // Handle add click
  const handleAddRoleClick = () => {
    setEditingRole(null);
    setRoleName('');
    setRoleDesc('');
    setSelectedPermissions(new Set());
    setFilterQuery('');
    setView('add');
  };

  // Handle edit click
  const handleEditRoleClick = (role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDesc(role.description || '');
    setFilterQuery('');

    if (role.permissions?.includes('all')) {
      const allSlugs = permissionsMatrix.flatMap((m) => m.permissions.map((p) => p.slug));
      setSelectedPermissions(new Set(allSlugs));
    } else {
      setSelectedPermissions(new Set(role.permissions || []));
    }
    setView('edit');
  };

  // Toggle single permission
  const handleTogglePermission = (slug) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  // Toggle all permissions in a module
  const handleToggleCategory = (moduleKey, permList) => {
    const slugs = permList.map((p) => p.slug);
    const allChecked = slugs.every((s) => selectedPermissions.has(s));

    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (allChecked) {
        slugs.forEach((s) => next.delete(s));
      } else {
        slugs.forEach((s) => next.add(s));
      }
      return next;
    });
  };

  // Toggle all permissions in the whole system
  const handleToggleAllPermissions = (select) => {
    if (select) {
      const allSlugs = permissionsMatrix.flatMap((m) => m.permissions.map((p) => p.slug));
      setSelectedPermissions(new Set(allSlugs));
    } else {
      setSelectedPermissions(new Set());
    }
  };

  // Accordion toggle
  const toggleAccordion = (key) => {
    setAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setAllAccordions = (expanded) => {
    const next = permissionsMatrix.reduce((acc, m) => {
      acc[m.key] = expanded;
      return acc;
    }, {});
    setAccordions(next);
  };

  // Save Role (Online + Offline fallback)
  const handleSaveRole = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) {
      Swal.fire({ icon: 'warning', title: 'Name Required', text: 'Please enter a Role Name.' });
      return;
    }

    setSaving(true);
    const permArray = Array.from(selectedPermissions);

    try {
      if (editingRole && !editingRole._id.startsWith('role_sa_')) {
        await superAdminService.updateRole(editingRole._id, {
          name: roleName.trim(),
          description: roleDesc.trim(),
          permissions: permArray,
        });
      } else {
        await superAdminService.createRole({
          name: roleName.trim(),
          description: roleDesc.trim(),
          scope: 'superadmin',
          permissions: permArray,
        });
      }

      await fetchData();
      Swal.fire({
        icon: 'success',
        title: editingRole ? 'Role Updated' : 'Role Created',
        text: `Role '${roleName}' permissions saved successfully.`,
        timer: 1800,
        showConfirmButton: false,
      });
      setView('list');
    } catch (err) {
      console.warn('Backend sync delayed, updating locally:', err);
      // Fallback local update
      let updated = [];
      if (editingRole) {
        updated = roles.map(r => r._id === editingRole._id ? {
          ...r,
          name: roleName.trim(),
          description: roleDesc.trim(),
          permissions: permArray
        } : r);
      } else {
        const newLocal = {
          _id: `role_custom_${Date.now()}`,
          name: roleName.trim(),
          description: roleDesc.trim(),
          scope: 'superadmin',
          isSystem: false,
          userCount: 0,
          permissions: permArray
        };
        updated = [...roles, newLocal];
      }
      setRoles(updated);
      localStorage.setItem('superadmin_cached_roles', JSON.stringify(updated));

      Swal.fire({
        icon: 'success',
        title: editingRole ? 'Role Updated' : 'Role Created',
        text: `Role '${roleName}' saved.`,
        timer: 1800,
        showConfirmButton: false,
      });
      setView('list');
    } finally {
      setSaving(false);
    }
  };

  // Delete Role
  const handleDeleteRole = (role) => {
    if (role.isSystem) {
      Swal.fire({
        icon: 'error',
        title: 'Protected Role',
        text: 'System Core roles cannot be deleted as they are essential to system operation.',
      });
      return;
    }

    if (role.userCount > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Active Members Assigned',
        text: `Cannot delete '${role.name}' because ${role.userCount} platform member(s) are currently assigned to it. Reassign them first.`,
      });
      return;
    }

    Swal.fire({
      title: `Delete Role '${role.name}'?`,
      text: 'This action cannot be undone. Any custom privileges will be permanently removed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete role',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (!role._id.startsWith('role_')) {
            await superAdminService.deleteRole(role._id);
          }
        } catch (_) {}

        const updated = roles.filter(r => r._id !== role._id);
        setRoles(updated);
        localStorage.setItem('superadmin_cached_roles', JSON.stringify(updated));
        Swal.fire({ icon: 'success', title: 'Role Deleted', timer: 1500, showConfirmButton: false });
      }
    });
  };

  // Filter roles
  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return roles;
    const q = searchQuery.toLowerCase();
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q))
    );
  }, [roles, searchQuery]);

  // Filter modules in matrix
  const filteredMatrix = useMemo(() => {
    if (!filterQuery.trim()) return permissionsMatrix;
    const q = filterQuery.toLowerCase();
    return permissionsMatrix
      .map((mod) => {
        const matchingPerms = mod.permissions.filter(
          (p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
        );
        return { ...mod, permissions: matchingPerms };
      })
      .filter((mod) => mod.permissions.length > 0);
  }, [permissionsMatrix, filterQuery]);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800 pb-24">
      {/* ─── Tabs Navigation (Team / Roles) ─── */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => navigate('/team')}
          className="px-4 py-2 text-xs font-bold rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-2"
        >
          <Users className="w-4 h-4 text-slate-400" />
          <span>Platform Team Members</span>
        </button>
        <button
          type="button"
          className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-50 text-purple-700 border border-purple-200 shadow-xs flex items-center gap-2 cursor-default"
        >
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span>Platform Roles & Permissions</span>
        </button>
      </div>

      {/* ─── Offline / Cloud Sync Notice (Non-blocking) ─── */}
      {isOfflineMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center gap-2.5">
            <CloudOff className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Backend Cloud Sync:</strong> Displaying standard platform roles. Backend changes are syncing.
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
            Roles & Granular Permissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Configure administrative roles for platform managers, billing controllers, support agents, and technicians with granular access control.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10 self-start md:self-auto">
          {view === 'list' ? (
            <button
              onClick={handleAddRoleClick}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5 cursor-pointer border-none"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Create Platform Role</span>
            </button>
          ) : (
            <button
              onClick={() => setView('list')}
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
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Roles</div>
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
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Custom Roles</div>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {roles.filter((r) => !r.isSystem).length}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Configured</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Capabilities</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{totalSystemPerms}</div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">Granular Permissions</div>
        </div>
      </div>

      {/* ─── 1. LIST VIEW ─── */}
      {view === 'list' && (
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
              <p className="text-sm font-bold text-slate-600">No roles matched your search</p>
              <button
                onClick={handleAddRoleClick}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Create New Role
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRoles.map((role) => {
                const isAll = role.permissions?.includes('all');
                const permCount = isAll ? totalSystemPerms : role.permissions?.length || 0;

                return (
                  <div
                    key={role._id}
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
                                Custom Role
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed line-clamp-2">
                            {role.description || 'No description provided.'}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditRoleClick(role)}
                            className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all cursor-pointer border-none bg-transparent"
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
                        <div className="flex items-center gap-1.5 font-bold text-slate-600">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            <strong className="text-slate-800">{role.userCount || 0}</strong> assigned member(s)
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-100">
                          <CheckCircle2 className="w-3 h-3 text-purple-600" />
                          <span>
                            {isAll ? 'All Privileges Granted' : `${permCount} of ${totalSystemPerms} permissions`}
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
      {(view === 'add' || view === 'edit') && (
        <form onSubmit={handleSaveRole} className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Key className="w-5 h-5 text-purple-600" />
                  {editingRole ? `Edit Role: ${editingRole.name}` : 'Create New Platform Role'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set role identity and toggle capability privileges across SuperAdmin platform services.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : editingRole ? 'Update Role' : 'Save New Role'}</span>
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
                  placeholder="e.g. Operations Manager, Billing Executive"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 disabled:bg-slate-100 disabled:text-slate-500"
                />
                {editingRole?.isSystem && (
                  <p className="text-[10px] text-amber-600 mt-1 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> System core role title is locked. Permissions can still be tailored.
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
                  placeholder="Brief description of responsibilities and scope"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
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
                  placeholder="Filter permissions..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleAllPermissions(true)}
                  className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Select All Platform Permissions
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
                  onClick={() => setAllAccordions(true)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  Expand All
                </button>
                <button
                  type="button"
                  onClick={() => setAllAccordions(false)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* Matrix Accordions */}
            <div className="space-y-3">
              {filteredMatrix.map((mod) => {
                const IconComponent = MODULE_ICONS[mod.key] || ShieldCheck;
                const isExpanded = accordions[mod.key] !== false;
                const totalInMod = mod.permissions.length;
                const selectedInMod = mod.permissions.filter((p) => selectedPermissions.has(p.slug)).length;
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
                          className="text-purple-600 hover:text-purple-800 transition-colors cursor-pointer bg-transparent border-none p-0"
                          title={allModSelected ? 'Unselect Category' : 'Select Category'}
                        >
                          {allModSelected ? (
                            <CheckSquare className="w-5 h-5 text-purple-600" />
                          ) : selectedInMod > 0 ? (
                            <div className="w-5 h-5 rounded bg-purple-100 border border-purple-400 flex items-center justify-center text-purple-700 text-[10px] font-black">
                              -
                            </div>
                          ) : (
                            <Square className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                          )}
                        </button>

                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-black text-xs sm:text-sm text-slate-800">{mod.name}</h4>
                            <p className="text-[11px] text-slate-400 font-medium">{mod.description}</p>
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
                                  ? 'bg-purple-50/60 border-purple-300 text-purple-900 shadow-xs'
                                  : 'bg-white border-slate-200/70 text-slate-600 hover:bg-slate-50'
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
                                  <div className="w-4 h-4 rounded bg-purple-600 text-white flex items-center justify-center">
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
              Total Permissions Assigned:{' '}
              <span className="text-purple-600 font-black text-sm">{selectedPermissions.size}</span> of {totalSystemPerms}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setView('list')}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : editingRole ? 'Save Changes' : 'Create Role'}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

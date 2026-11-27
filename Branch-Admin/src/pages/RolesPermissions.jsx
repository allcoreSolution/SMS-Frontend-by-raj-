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
  ExternalLink
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

// All permission slugs flat array
const ALL_PERMISSION_SLUGS = BRANCH_PERMISSION_MODULES.flatMap(m => m.permissions.map(p => p.slug));

export default function RolesPermissions() {
  const [activeTab, setActiveTab] = useState('roles'); // 'roles' | 'users' | 'catalog'
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);

  // Modal states
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Role Form state
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    status: 'Active',
    permissions: []
  });

  // User Form state
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    roleId: '',
    status: 'Active',
    branchScope: 'All Campuses'
  });

  // Filter permission in role editor
  const [permFilter, setPermFilter] = useState('');

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

      // Default select first role if none selected
      if (!selectedRole && loadedRoles.length > 0) {
        setSelectedRole(loadedRoles[0]);
      } else if (selectedRole) {
        const refreshed = loadedRoles.find(r => (r.id || r._id) === (selectedRole.id || selectedRole._id));
        if (refreshed) setSelectedRole(refreshed);
      }
    } catch (err) {
      console.error("Failed to load roles and users:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedRole]);

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Roles
  const filteredRoles = useMemo(() => {
    return roles.filter(r => 
      r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [roles, searchQuery]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.roleName?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.branchScope?.toLowerCase().includes(userSearchQuery.toLowerCase())
    );
  }, [users, userSearchQuery]);

  // Quick stats
  const stats = useMemo(() => {
    const totalRoles = roles.length;
    const systemRoles = roles.filter(r => r.isSystem).length;
    const customRoles = roles.filter(r => !r.isSystem).length;
    const totalStaff = users.length;
    const activeStaff = users.filter(u => u.status === 'Active').length;
    return { totalRoles, systemRoles, customRoles, totalStaff, activeStaff };
  }, [roles, users]);

  // Handle open Role Modal (Create or Edit)
  const handleOpenRoleModal = (role = null) => {
    if (role) {
      setEditingRole(role);
      setRoleForm({
        name: role.name || '',
        description: role.description || '',
        status: role.status || 'Active',
        permissions: Array.isArray(role.permissions) ? [...role.permissions] : []
      });
    } else {
      setEditingRole(null);
      setRoleForm({
        name: '',
        description: '',
        status: 'Active',
        permissions: []
      });
    }
    setPermFilter('');
    setIsRoleModalOpen(true);
  };

  // Toggle single permission slug
  const togglePermission = (slug) => {
    setRoleForm(prev => {
      const exists = prev.permissions.includes(slug);
      return {
        ...prev,
        permissions: exists 
          ? prev.permissions.filter(s => s !== slug)
          : [...prev.permissions, slug]
      };
    });
  };

  // Toggle all permissions in a module
  const toggleModulePermissions = (modulePerms) => {
    const slugs = modulePerms.map(p => p.slug);
    const allSelected = slugs.every(s => roleForm.permissions.includes(s));
    setRoleForm(prev => {
      if (allSelected) {
        return {
          ...prev,
          permissions: prev.permissions.filter(s => !slugs.includes(s))
        };
      } else {
        const combined = Array.from(new Set([...prev.permissions, ...slugs]));
        return {
          ...prev,
          permissions: combined
        };
      }
    });
  };

  // Select All / Deselect All
  const handleSelectAllGlobal = () => {
    setRoleForm(prev => ({
      ...prev,
      permissions: [...ALL_PERMISSION_SLUGS]
    }));
  };

  const handleDeselectAllGlobal = () => {
    setRoleForm(prev => ({
      ...prev,
      permissions: []
    }));
  };

  // Save Role
  const handleSaveRole = async (e) => {
    e.preventDefault();
    if (!roleForm.name.trim()) {
      Swal.fire({ icon: 'warning', title: 'Missing Role Name', text: 'Please enter a role name.', confirmButtonColor: '#f97316' });
      return;
    }

    try {
      if (editingRole) {
        const id = editingRole.id || editingRole._id;
        await branchAdminService.updateRole(id, roleForm);
        Swal.fire({
          icon: 'success',
          title: 'Role Updated',
          text: `"${roleForm.name}" permissions have been safely updated.`,
          timer: 1800,
          showConfirmButton: false
        });
      } else {
        await branchAdminService.createRole(roleForm);
        Swal.fire({
          icon: 'success',
          title: 'Role Created',
          text: `New role "${roleForm.name}" created successfully.`,
          timer: 1800,
          showConfirmButton: false
        });
      }
      setIsRoleModalOpen(false);
      loadData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Save Failed', text: err.message || 'Could not save role.' });
    }
  };

  // Clone Role
  const handleCloneRole = (role) => {
    setEditingRole(null);
    setRoleForm({
      name: `${role.name} (Copy)`,
      description: `Copy of ${role.name}: ${role.description || ''}`,
      status: 'Active',
      permissions: Array.isArray(role.permissions) ? [...role.permissions] : []
    });
    setPermFilter('');
    setIsRoleModalOpen(true);
  };

  // Delete Role
  const handleDeleteRole = (role) => {
    if (role.isSystem) {
      Swal.fire({
        icon: 'error',
        title: 'System Protected Role',
        text: 'This system role is essential for branch governance and cannot be deleted.',
        confirmButtonColor: '#f97316'
      });
      return;
    }

    Swal.fire({
      title: `Delete Role "${role.name}"?`,
      text: "HQ staff assigned to this role will need to be reallocated. This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete Role'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const id = role.id || role._id;
          await branchAdminService.deleteRole(id);
          Swal.fire({ icon: 'success', title: 'Deleted', text: 'Role removed successfully.', timer: 1500, showConfirmButton: false });
          if ((selectedRole?.id || selectedRole?._id) === id) {
            setSelectedRole(null);
          }
          loadData();
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Delete Failed', text: err.message });
        }
      }
    });
  };

  // User Management Handlers
  const handleOpenUserModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        roleId: user.roleId || user.role?._id || '',
        status: user.status || 'Active',
        branchScope: user.branchScope || 'All Campuses'
      });
    } else {
      setEditingUser(null);
      setUserForm({
        name: '',
        email: '',
        phone: '',
        roleId: roles[0]?.id || roles[0]?._id || '',
        status: 'Active',
        branchScope: 'All Campuses'
      });
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!userForm.name.trim() || !userForm.email.trim()) {
      Swal.fire({ icon: 'warning', title: 'Required Fields', text: 'Name and Email are mandatory.', confirmButtonColor: '#f97316' });
      return;
    }

    const matchedRole = roles.find(r => (r.id || r._id) === userForm.roleId);
    const payload = {
      ...userForm,
      roleName: matchedRole ? matchedRole.name : 'Branch Staff'
    };

    try {
      if (editingUser) {
        const id = editingUser.id || editingUser._id;
        await branchAdminService.updateRoleUser(id, payload);
        Swal.fire({ icon: 'success', title: 'Staff Updated', timer: 1500, showConfirmButton: false });
      } else {
        await branchAdminService.addRoleUser(payload);
        Swal.fire({ icon: 'success', title: 'Staff Member Added', timer: 1500, showConfirmButton: false });
      }
      setIsUserModalOpen(false);
      loadData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Action Failed', text: err.message });
    }
  };

  const handleDeleteUser = (user) => {
    Swal.fire({
      title: `Remove "${user.name}"?`,
      text: "This staff member will lose access to the Multi-Campus Branch Console.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Remove'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const id = user.id || user._id;
          await branchAdminService.deleteRoleUser(id);
          Swal.fire({ icon: 'success', title: 'Removed', timer: 1500, showConfirmButton: false });
          loadData();
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Delete Failed', text: err.message });
        }
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#070d1e] via-[#0f172a] to-[#1e1b4b] p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-96 h-96 bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Enterprise RBAC & Branch Governance
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Multi-Campus Roles & Permissions
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Create customized HQ roles, govern granular multi-branch permissions, and delegate cross-campus supervision to regional managers, chief auditors, and coordinators.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleOpenRoleModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Custom Role
            </button>
            <button
              onClick={() => handleOpenUserModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 font-bold text-sm transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-orange-400" />
              Assign HQ Staff
            </button>
            <button
              onClick={loadData}
              title="Refresh Matrix"
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quick Stat Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/60 backdrop-blur-sm p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total HQ Roles</span>
            <span className="text-2xl font-black text-white">{stats.totalRoles}</span>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-sm p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">System Roles</span>
            <span className="text-2xl font-black text-amber-400">{stats.systemRoles}</span>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-sm p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Custom Roles</span>
            <span className="text-2xl font-black text-orange-400">{stats.customRoles}</span>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-sm p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Staff</span>
            <span className="text-2xl font-black text-emerald-400">{stats.totalStaff}</span>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center gap-2 py-3 px-3 text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'roles'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Roles & Matrix ({roles.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 py-3 px-3 text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Assigned HQ Staff ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 py-3 px-3 text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Key className="w-4 h-4" />
            Permissions Directory ({ALL_PERMISSION_SLUGS.length})
          </button>
        </div>
      </div>

      {/* TAB 1: ROLES & MATRIX */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Roles List */}
          <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Access Roles</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                {roles.length} Roles
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search roles..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            {/* Roles List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredRoles.map(role => {
                const isSelected = (selectedRole?.id || selectedRole?._id) === (role.id || role._id);
                const permCount = Array.isArray(role.permissions) ? role.permissions.length : 0;
                const permPercentage = Math.round((permCount / ALL_PERMISSION_SLUGS.length) * 100);

                return (
                  <div
                    key={role.id || role._id}
                    onClick={() => setSelectedRole(role)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border-orange-500 ring-1 ring-orange-500 shadow-sm'
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-sm text-gray-900">{role.name}</span>
                          {role.isSystem ? (
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                              SYSTEM
                            </span>
                          ) : (
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200">
                              CUSTOM
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {role.description || 'No description provided.'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-semibold text-gray-700">{role.userCount || 0} Staff</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-orange-600">
                          {permCount} / {ALL_PERMISSION_SLUGS.length}
                        </span>
                        <div className="w-12 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-orange-500 h-full rounded-full transition-all"
                            style={{ width: `${permPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredRoles.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-xs">
                  No roles match "{searchQuery}"
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Selected Role Details & Permissions Inspector */}
          <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 space-y-6">
            {selectedRole ? (
              <>
                {/* Role Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-gray-900">{selectedRole.name}</h2>
                      {selectedRole.isSystem ? (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          SYSTEM PROTECTED
                        </span>
                      ) : (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                          CUSTOM HQ ROLE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed max-w-xl">
                      {selectedRole.description || 'Enterprise role governing assigned multi-branch operations and supervision.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenRoleModal(selectedRole)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit Role & Permissions
                    </button>
                    <button
                      onClick={() => handleCloneRole(selectedRole)}
                      title="Duplicate this role"
                      className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs transition-all cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {!selectedRole.isSystem && (
                      <button
                        onClick={() => handleDeleteRole(selectedRole)}
                        title="Delete custom role"
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Module-by-Module Permission Breakdown */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-gray-700 uppercase tracking-wider">
                      Module Access Breakdown ({selectedRole.permissions?.length || 0} Active Slugs)
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      Coverage: {Math.round(((selectedRole.permissions?.length || 0) / ALL_PERMISSION_SLUGS.length) * 100)}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {BRANCH_PERMISSION_MODULES.map(module => {
                      const Icon = module.icon;
                      const activePermsInMod = module.permissions.filter(p => selectedRole.permissions?.includes(p.slug));
                      const isFullAccess = activePermsInMod.length === module.permissions.length;
                      const isNoAccess = activePermsInMod.length === 0;

                      return (
                        <div 
                          key={module.key}
                          className={`p-3.5 rounded-xl border transition-all ${
                            isFullAccess 
                              ? 'bg-emerald-50/40 border-emerald-200' 
                              : isNoAccess 
                                ? 'bg-gray-50/60 border-gray-200 opacity-60' 
                                : 'bg-amber-50/40 border-amber-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${module.color} flex items-center justify-center text-white shadow-xs`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <span className="font-bold text-xs text-gray-900">{module.name}</span>
                            </div>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              isFullAccess 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : isNoAccess 
                                  ? 'bg-gray-200 text-gray-600' 
                                  : 'bg-amber-100 text-amber-800'
                            }`}>
                              {activePermsInMod.length} / {module.permissions.length}
                            </span>
                          </div>

                          <div className="space-y-1 mt-2">
                            {module.permissions.map(perm => {
                              const isAllowed = selectedRole.permissions?.includes(perm.slug);
                              return (
                                <div key={perm.slug} className="flex items-center justify-between text-[11px] py-0.5">
                                  <span className={`truncate max-w-[200px] ${isAllowed ? 'text-gray-800 font-medium' : 'text-gray-400 line-through'}`}>
                                    {perm.name}
                                  </span>
                                  {isAllowed ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  ) : (
                                    <X className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Assigned Staff Preview for Selected Role */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-500" />
                      Staff Assigned to "{selectedRole.name}"
                    </span>
                    <button
                      onClick={() => handleOpenUserModal({ roleId: selectedRole.id || selectedRole._id })}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                    >
                      + Assign New Member
                    </button>
                  </div>

                  {users.filter(u => u.roleId === (selectedRole.id || selectedRole._id) || u.roleName === selectedRole.name).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {users
                        .filter(u => u.roleId === (selectedRole.id || selectedRole._id) || u.roleName === selectedRole.name)
                        .map(u => (
                          <div key={u.id || u._id} className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-gray-900 block">{u.name}</span>
                              <span className="text-[11px] text-gray-500 block truncate">{u.email}</span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">
                              {u.branchScope || 'All Campuses'}
                            </span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic py-2">
                      No staff members currently mapped to this role.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-gray-600">Select a role to inspect permissions</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ASSIGNED HQ STAFF */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-black text-gray-900">Headquarters & Regional Staff</h2>
              <p className="text-xs text-gray-500">
                Manage branch executives, trust directors, and multi-campus coordinators mapped to RBAC roles.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Filter by name, email, role..."
                  className="pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 w-64"
                />
              </div>
              <button
                onClick={() => handleOpenUserModal()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" /> Add Staff Member
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Supervision Scope</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredUsers.map(user => (
                  <tr key={user.id || user._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900">{user.name}</div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                        <span>{user.email}</span>
                        {user.phone && <span className="text-gray-400">| {user.phone}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                        {user.roleName || 'Branch Staff'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-600">
                      {user.branchScope || 'All Campuses'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${
                        user.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                      {user.joinedDate || '—'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenUserModal(user)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                        title="Edit User"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">
                      No staff members found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PERMISSIONS CATALOG */}
      {activeTab === 'catalog' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 space-y-6">
          <div className="pb-4 border-b border-gray-100">
            <h2 className="text-base font-black text-gray-900">Master Permissions Directory</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Comprehensive list of all granular operational permissions across Multi-Campus Branch Console.
            </p>
          </div>

          <div className="space-y-6">
            {BRANCH_PERMISSION_MODULES.map(module => {
              const Icon = module.icon;
              return (
                <div key={module.key} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${module.color} flex items-center justify-center text-white shadow-xs`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">{module.name}</h3>
                      <p className="text-[11px] text-gray-500">{module.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-2">
                    {module.permissions.map(perm => (
                      <div key={perm.slug} className="p-2.5 bg-white rounded-lg border border-gray-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-gray-900">{perm.name}</span>
                          <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
                            {perm.slug}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-gray-500 leading-snug">{perm.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ROLE EDITOR MODAL */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-[#070d1e] text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {editingRole ? `Edit Role: ${editingRole.name}` : 'Create New Branch Role'}
                  </h3>
                  <span className="text-[11px] text-slate-400 block">
                    Configure role identity and assign granular multi-campus permissions.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveRole} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Role Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={roleForm.name}
                    onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                    placeholder="e.g. West Zone Regional Auditor"
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Status
                  </label>
                  <select
                    value={roleForm.status}
                    onChange={(e) => setRoleForm({ ...roleForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Description & Mandate
                  </label>
                  <input
                    type="text"
                    value={roleForm.description}
                    onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                    placeholder="Summarize the operational scope and responsibilities of this role..."
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Permissions Matrix Controller */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-black text-gray-900 flex items-center gap-2">
                      <Key className="w-4 h-4 text-orange-500" />
                      Granular Module Permissions
                    </h4>
                    <span className="text-xs text-gray-500">
                      Selected: <strong className="text-orange-600 font-mono">{roleForm.permissions.length}</strong> of {ALL_PERMISSION_SLUGS.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllGlobal}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 cursor-pointer"
                    >
                      Grant All
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAllGlobal}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 cursor-pointer"
                    >
                      Clear All
                    </button>
                    <input
                      type="text"
                      placeholder="Filter slugs..."
                      value={permFilter}
                      onChange={(e) => setPermFilter(e.target.value)}
                      className="px-2.5 py-1 text-[11px] bg-gray-50 border border-gray-300 rounded-lg w-36 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Modules Grid */}
                <div className="space-y-3">
                  {BRANCH_PERMISSION_MODULES.map(module => {
                    const filteredPerms = module.permissions.filter(p => 
                      !permFilter || 
                      p.name.toLowerCase().includes(permFilter.toLowerCase()) || 
                      p.slug.toLowerCase().includes(permFilter.toLowerCase())
                    );

                    if (filteredPerms.length === 0) return null;

                    const allChecked = module.permissions.every(p => roleForm.permissions.includes(p.slug));
                    const someChecked = module.permissions.some(p => roleForm.permissions.includes(p.slug));

                    return (
                      <div key={module.key} className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/40">
                        <div className="p-3 bg-gray-100/70 border-b border-gray-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-gray-900">{module.name}</span>
                            <span className="text-[10px] text-gray-500">({module.permissions.length} slugs)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleModulePermissions(module.permissions)}
                            className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                          >
                            {allChecked ? 'Deselect Module' : 'Select All'}
                          </button>
                        </div>

                        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                          {filteredPerms.map(perm => {
                            const isChecked = roleForm.permissions.includes(perm.slug);
                            return (
                              <label
                                key={perm.slug}
                                className={`flex items-start gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                                  isChecked 
                                    ? 'bg-orange-50/60 border-orange-300 text-gray-900 font-semibold' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePermission(perm.slug)}
                                  className="mt-0.5 rounded text-orange-600 focus:ring-orange-500"
                                />
                                <div className="space-y-0.5">
                                  <span className="block leading-tight">{perm.name}</span>
                                  <span className="block text-[10px] font-mono text-gray-400">{perm.slug}</span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Role & Permissions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STAFF ASSIGNMENT MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
            
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-[#070d1e] text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-orange-400" />
                <h3 className="font-bold text-sm text-white">
                  {editingUser ? 'Edit Staff Member' : 'Assign New HQ Staff Member'}
                </h3>
              </div>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveUser} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="e.g. Rajesh Khurana"
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="officer@branch.edu"
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Assigned RBAC Role <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={userForm.roleId}
                  onChange={(e) => setUserForm({ ...userForm, roleId: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  {roles.map(r => (
                    <option key={r.id || r._id} value={r.id || r._id}>
                      {r.name} {r.isSystem ? '(System)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Branch Supervision Scope
                  </label>
                  <select
                    value={userForm.branchScope}
                    onChange={(e) => setUserForm({ ...userForm, branchScope: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="All Campuses">All Campuses (Trust Wide)</option>
                    <option value="North Zone Campuses">North Zone Campuses</option>
                    <option value="South Zone Campuses">South Zone Campuses</option>
                    <option value="Central & Metro Campuses">Central & Metro Campuses</option>
                    <option value="West Zone Campuses">West Zone Campuses</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Account Status
                  </label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-3 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

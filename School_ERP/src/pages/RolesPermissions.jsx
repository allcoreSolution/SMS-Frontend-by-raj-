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
  ShieldAlert,
  Info,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Lock,
  Check,
  CheckCircle2,
  Key
} from "lucide-react";
import settingsService from "../api/settingsService";

// List of all permissions structured
const ALL_PERMISSIONS_MODULES = [
  {
    key: "academics",
    name: "Academics & Curriculum",
    icon: "🎓",
    permissions: [
      { name: "Academic Master Manage", slug: "academics.manage" },
      { name: "Academic Session Switch", slug: "academics.session.switch" },
      { name: "Classes & Sections Setup", slug: "academics.class.manage" },
      { name: "Subjects & Syllabus Map", slug: "academics.subject.manage" },
      { name: "Assign Subject Teachers", slug: "academics.assign_teacher.manage" },
      { name: "Class Timetable Builder", slug: "academics.timetable.manage" },
      { name: "Student Class Promotion", slug: "academics.promote.manage" }
    ]
  },
  {
    key: "student",
    name: "Student Registry & Directory",
    icon: "👥",
    permissions: [
      { name: "Student Master Manage", slug: "student.manage" },
      { name: "New Student Admission", slug: "student.admission.create" },
      { name: "Student Directory List", slug: "student.list.view" },
      { name: "Student Profile Edit", slug: "student.profile.edit" },
      { name: "Daily Attendance Punch", slug: "student.attendance.manage" },
      { name: "Behavior & Remarks", slug: "student.behavior.manage" },
      { name: "Medical & Clinic Log", slug: "student.health.manage" },
      { name: "TC & Student Exit", slug: "student.exit.manage" }
    ]
  },
  {
    key: "fees",
    name: "Fees & Online Collection",
    icon: "💵",
    permissions: [
      { name: "Fee Structure Manage", slug: "fees.manage" },
      { name: "Counter Fee Collection", slug: "fees.collection.manage" },
      { name: "Challan Generation", slug: "fees.setup.manage" },
      { name: "Assign Fee Groups", slug: "fees.assign.manage" },
      { name: "Due Fees Ledger View", slug: "fees.due.view" },
      { name: "Transaction Revert", slug: "fees.revert.manage" }
    ]
  },
  {
    key: "exams",
    name: "Examinations & Grading",
    icon: "📝",
    permissions: [
      { name: "Exam Schedules & Datesheet", slug: "exams.datesheet.manage" },
      { name: "Admit Cards Printing", slug: "exams.admit_cards.manage" },
      { name: "Marks Entry & Verification", slug: "exams.marks.entry" },
      { name: "Grade Cards & Reports", slug: "exams.report_cards.view" },
      { name: "CBT Online Exam Engine", slug: "exams.online.manage" }
    ]
  },
  {
    key: "hr",
    name: "Staff & Human Resource",
    icon: "💼",
    permissions: [
      { name: "Staff Directory Manage", slug: "hr.staff.manage" },
      { name: "Staff Biometric Attendance", slug: "hr.staff_attendance.manage" },
      { name: "Monthly Payroll Run", slug: "hr.payroll.manage" },
      { name: "Leave Authorizations", slug: "hr.leave.approve" }
    ]
  }
];

const DEFAULT_ROLES = [
  {
    id: 1,
    name: "Super Administrator",
    desc: "Unrestricted master access to all system configurations, audits, and financial ledgers.",
    isSystem: true,
    permissionSlugs: ALL_PERMISSIONS_MODULES.flatMap(m => m.permissions.map(p => p.slug)),
    moduleCounts: { academics: 7, student: 8, fees: 6, exams: 5, hr: 4 }
  },
  {
    id: 2,
    name: "Principal / Academic Director",
    desc: "Oversees academic operations, syllabus, teacher rosters, exam grades, and leave approvals.",
    isSystem: false,
    permissionSlugs: [
      "academics.manage", "academics.session.switch", "academics.class.manage", "academics.subject.manage", "academics.assign_teacher.manage", "academics.timetable.manage", "academics.promote.manage",
      "student.manage", "student.list.view", "student.profile.edit", "student.attendance.manage", "student.behavior.manage", "student.exit.manage",
      "exams.datesheet.manage", "exams.marks.entry", "exams.report_cards.view",
      "hr.staff.manage", "hr.leave.approve"
    ],
    moduleCounts: { academics: 7, student: 6, exams: 3, hr: 2 }
  },
  {
    id: 3,
    name: "Accountant & Fee Cashier",
    desc: "Responsible for tuition collection, receipt generation, bank ledgers, and due reports.",
    isSystem: false,
    permissionSlugs: [
      "fees.manage", "fees.collection.manage", "fees.setup.manage", "fees.assign.manage", "fees.due.view",
      "student.list.view"
    ],
    moduleCounts: { fees: 5, student: 1 }
  },
  {
    id: 4,
    name: "Class Teacher & Mentor",
    desc: "Conducts daily roll-call, enters subject exam marks, homework, and student behavior notes.",
    isSystem: false,
    permissionSlugs: [
      "academics.timetable.manage",
      "student.list.view", "student.attendance.manage", "student.behavior.manage",
      "exams.marks.entry"
    ],
    moduleCounts: { academics: 1, student: 3, exams: 1 }
  }
];

export default function RolesPermissions() {
  const [view, setView] = useState("list"); // "list" | "add" | "edit"
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [searchQuery, setSearchQuery] = useState("");

  // Form active state
  const [editingRole, setEditingRole] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [roleDesc, setRoleDesc] = useState("");
  const [filterQuery, setFilterQuery] = useState("");

  // Build accordion initial state
  const initialAccordions = ALL_PERMISSIONS_MODULES.reduce((acc, mod) => {
    acc[mod.key] = true;
    return acc;
  }, {});
  const [accordions, setAccordions] = useState(initialAccordions);
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());

  const TOTAL_SYSTEM_PERMS = ALL_PERMISSIONS_MODULES.reduce((sum, mod) => sum + mod.permissions.length, 0);

  // Fetch roles from MongoDB
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await settingsService.getSetting("roles_permissions");
      if (res?.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
        setRoles(res.data);
      }
    } catch (err) {
      console.error("Could not fetch roles from MongoDB:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Save roles list to MongoDB
  const persistRoles = async (updatedRoles) => {
    setSaving(true);
    try {
      await settingsService.saveSetting("roles_permissions", updatedRoles);
    } catch (e) {
      console.error("Persist failed:", e);
    } finally {
      setSaving(false);
    }
  };

  // Toggle single permission
  const handleTogglePermission = (slug) => {
    setSelectedPermissions(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  // Toggle all permissions inside category
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

  const handleToggleAllAccordions = (expand) => {
    const next = ALL_PERMISSIONS_MODULES.reduce((acc, mod) => {
      acc[mod.key] = expand;
      return acc;
    }, {});
    setAccordions(next);
  };

  const handleAddRoleClick = () => {
    setEditingRole(null);
    setRoleName("");
    setRoleDesc("");
    setSelectedPermissions(new Set());
    setView("add");
  };

  const handleEditRoleClick = (role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDesc(role.desc || "");
    const prefill = new Set(role.permissionSlugs || []);
    setSelectedPermissions(prefill);
    setView("edit");
  };

  const handleDeleteRole = (id) => {
    const roleToDelete = roles.find(r => r.id === id);
    if (roleToDelete?.isSystem) {
      Swal.fire({ icon: "error", title: "Protected Role", text: "System Administrator role cannot be deleted." });
      return;
    }

    Swal.fire({
      title: "Delete Role?",
      text: `Are you sure you want to remove '${roleToDelete?.name}'? Staff assigned this role will lose associated permissions.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete role"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updated = roles.filter(r => r.id !== id);
        setRoles(updated);
        await persistRoles(updated);
        Swal.fire({ icon: "success", title: "Role Deleted", timer: 1500, showConfirmButton: false });
      }
    });
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) {
      Swal.fire({ icon: "warning", title: "Name Required", text: "Please enter a Role Name." });
      return;
    }

    const moduleCounts = {};
    ALL_PERMISSIONS_MODULES.forEach(mod => {
      const checkedInModule = mod.permissions.filter(p => selectedPermissions.has(p.slug)).length;
      if (checkedInModule > 0) {
        moduleCounts[mod.key] = checkedInModule;
      }
    });

    let updatedRoles = [];
    if (editingRole) {
      updatedRoles = roles.map(r => r.id === editingRole.id
        ? { ...r, name: roleName, desc: roleDesc, moduleCounts, permissionSlugs: Array.from(selectedPermissions) }
        : r
      );
    } else {
      const newRole = {
        id: Date.now(),
        name: roleName,
        desc: roleDesc,
        isSystem: false,
        moduleCounts,
        permissionSlugs: Array.from(selectedPermissions)
      };
      updatedRoles = [...roles, newRole];
    }

    setRoles(updatedRoles);
    await persistRoles(updatedRoles);

    Swal.fire({
      icon: "success",
      title: editingRole ? "Role Updated!" : "Role Created!",
      text: `Access permissions for '${roleName}' saved to MongoDB.`,
      timer: 2000,
      showConfirmButton: false
    });

    setView("list");
  };

  // Filter permissions in edit modal
  const filteredModules = useMemo(() => {
    if (!filterQuery.trim()) return ALL_PERMISSIONS_MODULES;
    return ALL_PERMISSIONS_MODULES.map(module => {
      const matchPerms = module.permissions.filter(
        p => p.name.toLowerCase().includes(filterQuery.toLowerCase()) || 
             p.slug.toLowerCase().includes(filterQuery.toLowerCase())
      );
      return { ...module, permissions: matchPerms };
    }).filter(module => module.permissions.length > 0);
  }, [filterQuery]);

  // Filter roles list
  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return roles;
    return roles.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.desc && r.desc.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, roles]);

  const areAllExpanded = Object.values(accordions).every(v => v === true);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800 pb-24">
      
      {/* ─── Hero Header ─── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-slate-950/10 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              Access Control Framework
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
            Define custom administrative staff roles and assign discrete capability privileges across academics, billing, student records, and human resources.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10 self-start md:self-auto">
          {view === "list" ? (
            <button
              onClick={handleAddRoleClick}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer border-none"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Create New Role</span>
            </button>
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

      {/* ─── 1. LIST VIEW OF ALL ROLES ─── */}
      {view === "list" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>
            <div className="text-xs font-bold text-slate-400">
              Showing <span className="text-indigo-600 font-black">{filteredRoles.length}</span> active staff roles
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRoles.map((role) => (
              <div
                key={role.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
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
                      <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">{role.desc}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditRoleClick(role)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer border-none bg-transparent"
                        title="Edit Role"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {!role.isSystem && (
                        <button
                          onClick={() => handleDeleteRole(role.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border-none bg-transparent"
                          title="Delete Role"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Permissions pill list */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                    {role.moduleCounts && Object.entries(role.moduleCounts).map(([modKey, count]) => (
                      count > 0 && (
                        <span key={modKey} className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-[10px] font-bold text-slate-600 flex items-center gap-1">
                          <Check className="w-3 h-3 text-indigo-600" />
                          <span>{ALL_PERMISSIONS_MODULES.find(m => m.key === modKey)?.name || modKey}</span>
                          <span className="text-indigo-600 font-black">({count})</span>
                        </span>
                      )
                    ))}
                    {(!role.moduleCounts || Object.keys(role.moduleCounts).length === 0) && (
                      <span className="text-slate-400 text-xs italic">No specific permissions assigned</span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>Authorized Capabilities:</span>
                  <span className="text-indigo-600 font-black">{role.permissionSlugs?.length || 0} / {TOTAL_SYSTEM_PERMS}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 2. ADD / EDIT ROLE VIEW ─── */}
      {(view === "add" || view === "edit") && (
        <form onSubmit={handleSaveRole} className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-slate-900 tracking-tight">
                  {view === "edit" ? `Edit Role: ${roleName}` : "Create New Access Role"}
                </h3>
                <p className="text-xs text-slate-400">Specify role identification and granular access rights</p>
              </div>

              <div className="text-xs font-bold text-slate-500">
                <span className="text-indigo-600 font-black">{selectedPermissions.size}</span> of {TOTAL_SYSTEM_PERMS} privileges granted
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Role Title / Designation *</label>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. Senior Academic Supervisor"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Scope Description</label>
                <input
                  type="text"
                  value={roleDesc}
                  onChange={(e) => setRoleDesc(e.target.value)}
                  placeholder="e.g. Manages syllabus and conducts teacher evaluations"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Permissions Accordions Container */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter permissions..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleAllAccordions(!areAllExpanded)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 text-xs font-bold cursor-pointer flex items-center gap-1.5"
                >
                  {areAllExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  <span>{areAllExpanded ? "Collapse All" : "Expand All"}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredModules.map((module) => {
                const isExpanded = !!accordions[module.key];
                const checkedInModule = module.permissions.filter(p => selectedPermissions.has(p.slug)).length;
                const isAllCheckedInModule = module.permissions.length > 0 && checkedInModule === module.permissions.length;

                return (
                  <div
                    key={module.key}
                    className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-3xs"
                  >
                    {/* Header */}
                    <div
                      onClick={() => setAccordions(prev => ({ ...prev, [module.key]: !isExpanded }))}
                      className="px-5 py-3.5 bg-slate-50/70 hover:bg-slate-100/60 transition-colors flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCategory(module.key, module.permissions);
                          }}
                          className="text-slate-400 hover:text-indigo-600 transition-colors bg-transparent border-none cursor-pointer p-0"
                        >
                          {isAllCheckedInModule ? (
                            <CheckSquare className="w-5 h-5 text-indigo-600 fill-indigo-50" />
                          ) : checkedInModule > 0 ? (
                            <div className="w-5 h-5 border border-indigo-600 rounded bg-indigo-50 flex items-center justify-center">
                              <div className="w-2.5 h-0.5 bg-indigo-600"></div>
                            </div>
                          ) : (
                            <Square className="w-5 h-5 text-slate-300" />
                          )}
                        </button>

                        <div className="flex items-center gap-2">
                          <span className="text-base">{module.icon}</span>
                          <span className="font-black text-sm text-slate-900">{module.name}</span>
                        </div>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                          {checkedInModule} / {module.permissions.length}
                        </span>
                      </div>

                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {/* Permissions 3-Col Grid */}
                    {isExpanded && (
                      <div className="p-4 bg-white border-t border-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {module.permissions.map((perm) => {
                            const isChecked = selectedPermissions.has(perm.slug);
                            return (
                              <div
                                key={perm.slug}
                                onClick={() => handleTogglePermission(perm.slug)}
                                className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                                  isChecked 
                                    ? "bg-indigo-50/50 border-indigo-200" 
                                    : "bg-slate-50/40 border-slate-200/50 hover:bg-slate-50"
                                }`}
                              >
                                <button
                                  type="button"
                                  className="mt-0.5 bg-transparent border-none p-0 cursor-pointer text-slate-400"
                                >
                                  {isChecked ? (
                                    <CheckSquare className="w-4 h-4 text-indigo-600" />
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-300" />
                                  )}
                                </button>
                                <div>
                                  <div className="text-xs font-bold text-slate-800">{perm.name}</div>
                                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">{perm.slug}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setView("list")}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer border-none flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving Role..." : "Save Role Permissions"}</span>
              </button>
            </div>
          </div>
        </form>
      )}

    </div>
  );
}

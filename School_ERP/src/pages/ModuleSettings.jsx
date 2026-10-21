import React, { useState, useEffect, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import { 
  Save, 
  Info, 
  Check, 
  HelpCircle, 
  Smartphone, 
  Lock, 
  User, 
  BookOpen, 
  Settings, 
  Globe, 
  Edit3, 
  Package, 
  Tag, 
  Cpu, 
  MessageSquare, 
  Monitor, 
  Video, 
  DollarSign, 
  Building, 
  ListTodo, 
  Volume2, 
  FileQuestion, 
  Fingerprint, 
  Award, 
  Heart, 
  Grid, 
  Handshake, 
  BookOpenCheck, 
  PenTool,
  CheckCircle,
  Eye,
  Camera,
  Activity,
  BarChart,
  Truck,
  FileText,
  Search,
  RefreshCw,
  Sparkles,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import settingsService from "../api/settingsService";

// Core Modules List configuration (Always enabled & locked)
const CORE_MODULES = [
  { key: "students", name: "Student Information", icon: "🎓", desc: "Core enrollment, profile directory, KYC & student master records" },
  { key: "academics", name: "Academics & Classes", icon: "📖", desc: "Class sections, subjects, syllabus mapping & period rosters" },
  { key: "fees", name: "Fees & Collections", icon: "💵", desc: "Fee vouchers, challan printing, due tracking & online payments" },
  { key: "hr", name: "Staff & Human Resource", icon: "💼", desc: "Teacher directory, payroll processing & leave management" },
  { key: "exams", name: "Offline Examinations", icon: "📝", desc: "Datesheets, admit cards generation & report card grading" },
  { key: "certificates", name: "Certificates & TC", icon: "📜", desc: "Transfer certificates, bonafide & character documents" },
  { key: "idCards", name: "Student & Staff ID Cards", icon: "💳", desc: "PVC card designer, QR badge generator & batch print" }
];

// Optional / Toggleable Modules
const OPTIONAL_MODULES = [
  { key: "schoolWebsite", name: "School Public Website", icon: Globe, category: "Operations", desc: "Institutional CMS, public notices & inquiry forms" },
  { key: "homework", name: "Digital Homework Hub", icon: Edit3, category: "Academic", desc: "Online assignment submissions & teacher evaluations" },
  { key: "libraryManagement", name: "Library & OPAC Hub", icon: BookOpen, category: "Academic", desc: "Book inventory, barcode checkouts & catalog search" },
  { key: "transport", name: "Fleet & Transport", icon: Truck, category: "Operations", desc: "Bus route mapping, driver manifests & GPS tracking" },
  { key: "hostel", name: "Hostel & Dormitories", icon: Building, category: "Operations", desc: "Room allocations, mess schedule & student check-ins" },
  { key: "inventory", name: "Inventory & Stock", icon: Package, category: "Operations", desc: "Stationery, uniforms, lab consumables & purchase orders" },
  { key: "assetManagement", name: "Campus Asset Register", icon: Tag, category: "Operations", desc: "Depreciation logs, campus equipment & maintenance audits" },
  { key: "aiAssistant", name: "AI Assistant & Copilot", icon: Cpu, category: "Tech", desc: "Automated report card remarks & smart queries" },
  { key: "chatbot", name: "Knowledge Bot & Helpdesk", icon: MessageSquare, category: "Tech", desc: "24/7 parent inquiry chatbot & automated response desk" },
  { key: "studyCenter", name: "E-Learning Study Center", icon: Monitor, category: "Academic", desc: "Video lessons, digital question banks & downloadable notes" },
  { key: "liveClasses", name: "Virtual Live Classes", icon: Video, category: "Academic", desc: "Integrated Zoom / Google Meet classroom conferencing" },
  { key: "finance", name: "Accounting & Cash Books", icon: DollarSign, category: "Operations", desc: "Voucher expense heads, bank reconciliation & ledger books" },
  { key: "frontOffice", name: "Front Office & Visitors", icon: Building, category: "Operations", desc: "Visitor security pass badges & reception phone call logs" },
  { key: "leadManagement", name: "Admission Inquiries & CRM", icon: ListTodo, category: "Operations", desc: "Prospect pipeline, follow-up reminders & conversion rate" },
  { key: "communications", name: "SMS & WhatsApp Blaster", icon: Volume2, category: "Tech", desc: "Bulk circular broadcasts, notices & emergency flash alerts" },
  { key: "onlineExams", name: "CBT Online Examinations", icon: FileQuestion, category: "Academic", desc: "Timed online quiz engine with anti-cheat lockdown" },
  { key: "biometricAttendance", name: "Biometric & RFID Sync", icon: Fingerprint, category: "Tech", desc: "Direct machine push API, RFID gate scans & geo-attendance" },
  { key: "cbcAcademics", name: "Competency (CBC) Grading", icon: Award, category: "Academic", desc: "Outcome-based skill rubrics & NEP 2020 scorecards" },
  { key: "healthRecords", name: "Student Health & Clinic", icon: Heart, category: "Operations", desc: "Immunization records, medical incidents & growth metrics" },
  { key: "appsCenter", name: "App Extension Center", icon: Grid, category: "Tech", desc: "Seating planner, question generator & digital whiteboards" },
  { key: "ptm", name: "PTM Slot Scheduler", icon: Handshake, category: "Academic", desc: "Parent-teacher slot booking & meeting feedback notes" },
  { key: "lessonPlanner", name: "Syllabus & Lesson Tracker", icon: BookOpenCheck, category: "Academic", desc: "Teacher weekly teaching diaries & lesson milestones" },
  { key: "osmEvaluation", name: "Digital On-Screen Marking", icon: PenTool, category: "Academic", desc: "Scanned answer sheet annotation & digital marksheet entry" }
];

// Parent App Visibility Modules List
const PARENT_VISIBILITY_MODULES = [
  { key: "aiAssistant", name: "AI Assistant & Remarks", icon: Cpu, desc: "Allow parents to view AI-generated learning tips" },
  { key: "assessment", name: "Exam Marks & Result Cards", icon: CheckCircle, desc: "Instant term report cards & grade insights" },
  { key: "cbcAcademics", name: "Competency Badges", icon: Award, desc: "Holistic skill progress & behavioral badges" },
  { key: "cctvSurveillance", name: "CCTV Campus View", icon: Camera, desc: "Live streaming of selected public campus cameras" },
  { key: "osmEvaluation", name: "Evaluated Answer Sheets", icon: PenTool, desc: "Annotated answer copies for exam transparency" },
  { key: "healthRecords", name: "Health & Clinic Log", icon: Heart, desc: "Infirmary visits, allergy notices & checkups" },
  { key: "homework", name: "Daily Homework & Tasks", icon: Edit3, desc: "Homework assignments, deadlines & submissions" },
  { key: "chatbot", name: "Support Bot & Helpdesk", icon: MessageSquare, desc: "Self-service FAQ bot for parents" },
  { key: "lessonPlanner", name: "Classroom Syllabus Progress", icon: BookOpenCheck, desc: "Upcoming curriculum topics & teaching schedules" },
  { key: "libraryManagement", name: "Issued Books & Dues", icon: BookOpen, desc: "Books currently issued to ward & return dates" },
  { key: "onlineExams", name: "Online Quizzes & Practice", icon: FileQuestion, desc: "Take-home test links and mock practice tests" },
  { key: "ptm", name: "PTM Appointment Booking", icon: Handshake, desc: "Book 1-on-1 discussion slots with subject teachers" },
  { key: "studyCenter", name: "Study Material & Notes", icon: Monitor, desc: "Downloadable PDF notes, worksheets & videos" },
  { key: "surveysFeedback", name: "Parent Surveys & Polls", icon: BarChart, desc: "School satisfaction ratings & event feedback forms" },
  { key: "transport", name: "Live Bus GPS Tracking", icon: Truck, desc: "Real-time bus location & arrival alerts on mobile" }
];

export default function ModuleSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'academic' | 'operations' | 'tech' | 'parent'

  // Module active state
  const [modules, setModules] = useState({
    schoolWebsite: true,
    homework: true,
    libraryManagement: true,
    transport: true,
    hostel: true,
    inventory: true,
    assetManagement: true,
    aiAssistant: true,
    chatbot: true,
    studyCenter: true,
    liveClasses: true,
    finance: true,
    frontOffice: true,
    leadManagement: true,
    communications: true,
    onlineExams: true,
    biometricAttendance: true,
    cbcAcademics: true,
    healthRecords: true,
    appsCenter: true,
    ptm: true,
    lessonPlanner: true,
    osmEvaluation: true
  });

  // Parent App Visibility active state
  const [parentVisibility, setParentVisibility] = useState({
    aiAssistant: true,
    assessment: true,
    cbcAcademics: true,
    cctvSurveillance: true,
    osmEvaluation: true,
    healthRecords: true,
    homework: true,
    chatbot: true,
    lessonPlanner: true,
    libraryManagement: true,
    onlineExams: true,
    ptm: true,
    studyCenter: true,
    surveysFeedback: true,
    transport: true
  });

  // Fetch persisted settings from MongoDB
  const fetchModuleSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await settingsService.getSetting("module_settings");
      if (res?.success && res.data) {
        if (res.data.modules) setModules(prev => ({ ...prev, ...res.data.modules }));
        if (res.data.parentVisibility) setParentVisibility(prev => ({ ...prev, ...res.data.parentVisibility }));
      }
    } catch (err) {
      console.error("Could not fetch module settings from MongoDB:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModuleSettings();
  }, [fetchModuleSettings]);

  // Handle module toggle
  const handleToggleModule = (key) => {
    setModules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle parent visibility toggle
  const handleToggleParentVisibility = (key) => {
    setParentVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Save changes to MongoDB
  const handleSaveConfiguration = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const payload = {
        modules,
        parentVisibility,
        updatedAt: new Date().toISOString()
      };

      const res = await settingsService.saveSetting("module_settings", payload);
      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "Modules Saved!",
          text: "Module features & parent mobile app visibility persisted to MongoDB.",
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      console.error("Save failed:", err);
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: err.response?.data?.message || "Could not save module configuration to server."
      });
    } finally {
      setSaving(false);
    }
  };

  // Bulk actions
  const handleEnableAll = () => {
    const updated = {};
    OPTIONAL_MODULES.forEach(m => { updated[m.key] = true; });
    setModules(updated);
  };

  const handleDisableAllOptional = () => {
    const updated = {};
    OPTIONAL_MODULES.forEach(m => { updated[m.key] = false; });
    setModules(updated);
  };

  // Filter modules
  const filteredOptional = useMemo(() => {
    return OPTIONAL_MODULES.filter(m => {
      const matchesSearch = !searchQuery.trim() || 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.desc.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = activeTab === "all" || 
        (activeTab === "academic" && m.category === "Academic") ||
        (activeTab === "operations" && m.category === "Operations") ||
        (activeTab === "tech" && m.category === "Tech");

      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  const filteredParent = useMemo(() => {
    return PARENT_VISIBILITY_MODULES.filter(m => {
      return !searchQuery.trim() || 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.desc.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  // Derived counts
  const totalOptional = OPTIONAL_MODULES.length;
  const activeOptionalCount = Object.values(modules).filter(Boolean).length;
  const activeParentCount = Object.values(parentVisibility).filter(Boolean).length;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800 pb-24">
      
      {/* ─── Hero Header Banner ─── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-slate-950/10 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              System Engine Control
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-white/10 rounded-full border border-white/10 text-slate-300">
              Real MongoDB Sync
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Sliders className="w-7 h-7 text-indigo-400 inline" />
            Module Management & Visibility
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Activate or deactivate institutional ERP functional modules and granularly control which features are published to the Parent Mobile Portal.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 self-start md:self-auto">
          <button
            onClick={fetchModuleSettings}
            disabled={loading}
            className="p-3 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-2xl text-white cursor-pointer border border-white/10"
            title="Reload from MongoDB"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={handleSaveConfiguration}
            disabled={saving || loading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 border-none"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Configuration"}</span>
          </button>
        </div>
      </div>

      {/* ─── Metric KPI Badges ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Grid className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{CORE_MODULES.length + totalOptional}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Modules</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">{CORE_MODULES.length + activeOptionalCount}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Staff Modules</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-600">{totalOptional - activeOptionalCount}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Disabled Modules</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-purple-600">{activeParentCount}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Parent App Features</div>
          </div>
        </div>
      </div>

      {/* ─── Search & Tab Filters Bar ─── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search modules by name or capability..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "All Modules" },
            { id: "academic", label: "Academic & Learning" },
            { id: "operations", label: "Operations & Admin" },
            { id: "tech", label: "Digital Tech & AI" },
            { id: "parent", label: "📱 Parent App Visibility" }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/30"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleEnableAll}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 text-[11px] font-bold cursor-pointer"
          >
            Enable All
          </button>
          <button
            onClick={handleDisableAllOptional}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 text-[11px] font-bold cursor-pointer"
          >
            Disable Optional
          </button>
        </div>
      </div>

      {/* ─── Main Content Views ─── */}
      {activeTab !== "parent" ? (
        <div className="space-y-8">
          
          {/* 1. Core Modules Section (Shown if on 'all' tab and no strict search) */}
          {activeTab === "all" && !searchQuery.trim() && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    Core Institutional Engines (Always Active)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Mandatory architecture components essential for school operations and student database integrity.
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-black rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Locked System Core
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {CORE_MODULES.map((mod) => (
                  <div
                    key={mod.key}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between shadow-xs hover:border-emerald-300 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg font-bold">
                          {mod.icon}
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                          <Check className="w-3 h-3" /> Enabled
                        </span>
                      </div>
                      <h3 className="font-black text-sm text-slate-900 mb-1">{mod.name}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">{mod.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-bold">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" /> Essential Engine
                      </span>
                      <span className="text-emerald-600">Always ON</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Optional / Configurable Modules Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Grid className="w-5 h-5 text-indigo-600" />
                  Configurable School Modules ({filteredOptional.length})
                </h2>
                <p className="text-xs text-slate-400">
                  Toggle off modules your campus doesn't use to keep staff navigation streamlined.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredOptional.map((mod) => {
                const isActive = !!modules[mod.key];
                const Icon = mod.icon;

                return (
                  <div
                    key={mod.key}
                    className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md ${
                      isActive 
                        ? "border-indigo-200 hover:border-indigo-400" 
                        : "border-slate-200 bg-slate-50/50 opacity-75"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          isActive ? "bg-indigo-50 text-indigo-600 shadow-inner" : "bg-slate-100 text-slate-400"
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Modern iOS Switch Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleModule(mod.key)}
                          className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isActive ? "bg-indigo-600" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              isActive ? "translate-x-6" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      <h3 className="font-black text-sm text-slate-900 mb-1">{mod.name}</h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">{mod.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 uppercase tracking-wider text-[10px]">
                        {mod.category}
                      </span>
                      <span className={isActive ? "text-indigo-600 font-black" : "text-slate-400 font-semibold"}>
                        {isActive ? "Active on Sidebar" : "Hidden from Sidebar"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        /* ─── PARENT APP VISIBILITY TAB ─── */
        <div className="space-y-4">
          <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-5 flex items-start gap-3 text-indigo-900">
            <Smartphone className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-black">Parent Mobile App & Web Portal Visibility Control</h3>
              <p className="text-xs text-indigo-700/80 mt-1 leading-relaxed">
                Toggle features on or off for parents without disabling the modules for your administrative staff. 
                For example, you can keep Transport active for staff dispatchers while keeping live bus tracking hidden from parents until route testing is complete.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredParent.map((mod) => {
              const isVisible = !!parentVisibility[mod.key];
              const Icon = mod.icon;

              return (
                <div
                  key={mod.key}
                  className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md ${
                    isVisible 
                      ? "border-purple-200 hover:border-purple-400" 
                      : "border-slate-200 bg-slate-50/50 opacity-70"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isVisible ? "bg-purple-50 text-purple-600 shadow-inner" : "bg-slate-100 text-slate-400"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Sliding switch */}
                      <button
                        type="button"
                        onClick={() => handleToggleParentVisibility(mod.key)}
                        className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isVisible ? "bg-purple-600" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            isVisible ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <h3 className="font-black text-sm text-slate-900 mb-1">{mod.name}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">{mod.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-400">Parent Access:</span>
                    <span className={isVisible ? "text-purple-600 font-black" : "text-slate-400"}>
                      {isVisible ? "Visible to Parents" : "Hidden from Parents"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Save Bar */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleSaveConfiguration}
          disabled={saving || loading}
          className="flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-sm rounded-full shadow-2xl shadow-indigo-600/40 active:scale-95 transition-all cursor-pointer border-none"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save Module Setup"}</span>
        </button>
      </div>

    </div>
  );
}

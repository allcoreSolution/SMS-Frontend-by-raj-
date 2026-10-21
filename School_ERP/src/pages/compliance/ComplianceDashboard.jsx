import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Shield, AlertTriangle, CheckCircle, ChevronRight, X, Package,
  Download, Trash2, Info, Globe, BookOpen, Flag, School, HelpCircle,
  Save, FolderOpen, FileText, Plus, Filter, Search, CheckSquare,
  Users, Building2, UserCheck, FileDown, FileUp, Grid, Menu, List,
  CheckCheck, Play, ListFilter, AlertCircle, XCircle, UserX,
  FileOutput, ClipboardList, Calendar, RefreshCw, Eye, Edit, Clock,
  ExternalLink, Sparkles, Award
} from "lucide-react";
import complianceService from "../../api/complianceService";
import axiosInstance from "../../api/axios";

/* ─── Circular Gauge Component ─── */
function CircleGauge({ pct = 0, color = "#6366f1", size = 96, label }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const safePct = Math.min(100, Math.max(0, pct || 0));
  const offset = circ - (safePct / 100) * circ;

  return (
    <div className="flex flex-col items-center justify-center gap-1.5">
      <svg width={size} height={size} viewBox="0 0 96 96" className="transform -rotate-90">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#f1f5f9" strokeWidth="8" />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-base font-black text-slate-800 leading-none">{safePct}%</span>
      </div>
      {label && (
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1">
          {label}
        </span>
      )}
    </div>
  );
}

/* ─── Progress Bar Component ─── */
function ProgressBar({ pct = 0, color = "bg-indigo-600", height = "h-2" }) {
  const safePct = Math.min(100, Math.max(0, pct || 0));
  return (
    <div className={`w-full bg-slate-100 rounded-full ${height} overflow-hidden`}>
      <div
        className={`${color} ${height} rounded-full transition-all duration-500`}
        style={{ width: `${safePct}%` }}
      />
    </div>
  );
}

/* ─── Toggle Switch Component ─── */
function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors cursor-pointer border-none shrink-0 ${
        on ? "bg-indigo-600 ring-2 ring-indigo-200" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${
          on ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}

/* ─── Helper to determine current tab ─── */
function getView(pathname) {
  if (pathname.includes("school-profile")) return "school-profile";
  if (pathname.includes("field-settings")) return "field-settings";
  if (pathname.includes("document-vault")) return "document-vault";
  if (pathname.includes("checklist")) return "checklist";
  if (pathname.includes("packs")) return "packs";
  if (pathname.includes("data-records")) return "data-records";
  if (pathname.includes("data-validator")) return "data-validator";
  if (pathname.includes("government-reports")) return "government-reports";
  if (pathname.includes("inspections")) return "inspections";
  if (pathname.includes("calendar")) return "calendar";
  return "overview";
}

/* ==============================================================
   MAIN COMPLIANCE COMPONENT
   ============================================================== */
export default function ComplianceDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const view = getView(location.pathname);

  // Core Data States
  const [overviewData, setOverviewData] = useState(null);
  const [profile, setProfile] = useState({
    udiseCode: "09010405101",
    schoolName: "St. Xavier International Academy",
    affiliationNo: "CBSE/AFF/2130892",
    recognitionNo: "REC-EDU-2018-994",
    recognitionDate: "2018-04-01",
    managementType: "Private Unaided",
    schoolCategory: "Higher Secondary (I–XII)",
    board: "India — CBSE",
    minorityGroup: "Non-Minority",
    yearEstablished: "2008",
    principalName: "Dr. Anandita Verma",
    principalPhone: "+91 98765 43210",
    nodalOfficer: "Rajesh Kumar (Senior Registrar)",
    mediumOfInstruction: { english: true, hindi: true, regional: false, other: false }
  });

  const [packs, setPacks] = useState([]);
  const [fieldSettings, setFieldSettings] = useState({
    student: {
      "Aadhaar Number": true,
      "APAAR / PEN ID": true,
      "Caste Category": true,
      "Sub Caste": false,
      "BPL Status": false,
      "RTE 25% Quota": true,
      "Father Aadhaar": true,
      "Mother Aadhaar": true,
      "Blood Group": true,
      "Religion": true,
      "CWSN Status": true
    },
    teacher: {
      "Teacher Aadhaar": true,
      "Teacher TET Qualified": true,
      "Highest Professional Degree": true,
      "Police Verification Status": true,
      "Service Book Maintained": true
    }
  });

  const [documents, setDocuments] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [validationIssues, setValidationIssues] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [govReports, setGovReports] = useState(null);

  // Loading & Toast States
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Modals & UI States
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [showAddChecklistModal, setShowAddChecklistModal] = useState(false);
  const [showAddCalendarModal, setShowAddCalendarModal] = useState(false);
  const [docSearch, setDocSearch] = useState("");
  const [docCategoryFilter, setDocCategoryFilter] = useState("All");
  const [docStatusFilter, setDocStatusFilter] = useState("All");
  const [checklistFilter, setChecklistFilter] = useState("All");
  const [validatorFilter, setValidatorFilter] = useState("All");
  const [validatorSearch, setValidatorSearch] = useState("");
  const [fieldTab, setFieldTab] = useState("Student");
  const [recordRole, setRecordRole] = useState("Students");
  const [recordSearch, setRecordSearch] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch all compliance data from backend API
  const fetchAllComplianceData = async () => {
    setLoading(true);
    try {
      const [overviewRes, profileRes, packsRes, fieldRes, docsRes, checkRes, calRes, validRes, govRes, studentsRes] = await Promise.all([
        complianceService.getOverview().catch(() => null),
        complianceService.getSchoolProfile().catch(() => null),
        complianceService.getPacks().catch(() => null),
        complianceService.getFieldSettings().catch(() => null),
        complianceService.getDocuments().catch(() => null),
        complianceService.getChecklist().catch(() => null),
        complianceService.getCalendarEvents().catch(() => null),
        complianceService.runDataValidator().catch(() => null),
        complianceService.getGovernmentReports().catch(() => null),
        axiosInstance.get("/students").catch(() => null)
      ]);

      if (overviewRes?.data) setOverviewData(overviewRes.data);
      if (profileRes?.data) {
        setProfile(prev => ({
          ...prev,
          ...profileRes.data,
          recognitionDate: profileRes.data.recognitionDate ? profileRes.data.recognitionDate.split("T")[0] : prev.recognitionDate
        }));
      }
      if (packsRes?.data) setPacks(packsRes.data);
      if (fieldRes?.data) setFieldSettings(fieldRes.data);
      if (docsRes?.data) setDocuments(docsRes.data);
      if (checkRes?.data) setChecklist(checkRes.data);
      if (calRes?.data) setCalendarEvents(calRes.data);
      if (validRes?.data) setValidationIssues(validRes.data);
      if (govRes?.data) setGovReports(govRes.data);
      if (studentsRes?.data?.data) setStudentsList(studentsRes.data.data);
    } catch (err) {
      console.error("Error fetching compliance data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllComplianceData();
  }, []);

  // Save School Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await complianceService.updateSchoolProfile(profile);
      showToast("School compliance profile saved successfully!");
      fetchAllComplianceData();
    } catch (err) {
      console.error(err);
      alert("Failed to save school profile");
    }
  };

  // Toggle Compliance Pack Installation
  const handleTogglePack = async (packId, install) => {
    try {
      await complianceService.togglePack(packId, install);
      showToast(`Compliance Pack ${install ? "installed" : "uninstalled"} successfully!`);
      fetchAllComplianceData();
    } catch (err) {
      console.error(err);
      alert("Failed to update pack installation");
    }
  };

  // Save Field Settings
  const handleSaveFieldSettings = async (e) => {
    e.preventDefault();
    try {
      await complianceService.updateFieldSettings(fieldSettings);
      showToast("Field visibility and mandatory settings saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save field settings");
    }
  };

  // Delete Document
  const handleDeleteDoc = async (id) => {
    if (!window.confirm("Remove this document from the statutory vault?")) return;
    try {
      await complianceService.deleteDocument(id);
      setDocuments(prev => prev.filter(d => d._id !== id));
      showToast("Document removed from vault");
      fetchAllComplianceData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete document");
    }
  };

  // Update Checklist Status
  const handleChecklistStatusChange = async (id, status) => {
    try {
      await complianceService.updateChecklistItem(id, { status });
      setChecklist(prev => prev.map(c => c._id === id ? { ...c, status } : c));
      showToast(`Checklist item marked as ${status}`);
      fetchAllComplianceData();
    } catch (err) {
      console.error(err);
      alert("Failed to update checklist item");
    }
  };

  // Delete Checklist Item
  const handleDeleteChecklist = async (id) => {
    if (!window.confirm("Delete this checklist audit item?")) return;
    try {
      await complianceService.deleteChecklistItem(id);
      setChecklist(prev => prev.filter(c => c._id !== id));
      showToast("Checklist item deleted");
      fetchAllComplianceData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete checklist item");
    }
  };

  // Delete Calendar Event
  const handleDeleteCalendar = async (id) => {
    if (!window.confirm("Delete this calendar event?")) return;
    try {
      await complianceService.deleteCalendarEvent(id);
      setCalendarEvents(prev => prev.filter(c => c._id !== id));
      showToast("Calendar event removed");
    } catch (err) {
      console.error(err);
      alert("Failed to delete calendar event");
    }
  };

  // Navigation Tabs configuration
  const tabs = [
    { id: "overview", label: "Overview", icon: Shield, path: "/compliance/overview" },
    { id: "packs", label: "Packs", icon: Package, path: "/compliance/packs", badge: packs.filter(p => p.installed).length },
    { id: "school-profile", label: "Profile", icon: School, path: "/compliance/school-profile" },
    { id: "field-settings", label: "Field Settings", icon: Filter, path: "/compliance/field-settings" },
    { id: "document-vault", label: "Document Vault", icon: FileText, path: "/compliance/document-vault", badge: documents.length },
    { id: "checklist", label: "Checklist", icon: CheckSquare, path: "/compliance/checklist", badge: checklist.filter(c => c.status === "Compliant").length },
    { id: "data-records", label: "Data Records", icon: UserCheck, path: "/compliance/data-records" },
    { id: "data-validator", label: "Validator", icon: CheckCheck, path: "/compliance/data-validator", badge: validationIssues.length || null },
    { id: "government-reports", label: "Govt Reports", icon: FileOutput, path: "/compliance/government-reports" },
    { id: "inspections", label: "Inspections", icon: ClipboardList, path: "/compliance/inspections" },
    { id: "calendar", label: "Calendar", icon: Calendar, path: "/compliance/calendar", badge: calendarEvents.length }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 pb-20">
      
      {/* ─── Sticky Sub-Navigation Header ─── */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 backdrop-blur-md bg-white/95 shadow-xs">
        <div className="px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-md shadow-indigo-100 ring-2 ring-indigo-50">
              <Shield className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 tracking-tight">
                  Compliance & Governance
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                  Audit Hub
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Statutory document vault, UDISE+ & CBSE readiness, data validation, and inspection kits
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={fetchAllComplianceData}
              disabled={loading}
              title="Refresh all compliance data"
              className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl cursor-pointer shadow-xs transition-all flex items-center justify-center disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600" : ""}`} />
            </button>
            <button
              onClick={() => navigate("/compliance/document-vault")}
              className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-500" /> Vault ({documents.length})
            </button>
            <button
              onClick={() => navigate("/compliance/packs")}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-100 flex items-center gap-2 transition-all cursor-pointer border-none"
            >
              <Package className="w-4 h-4" /> Manage Packs
            </button>
          </div>
        </div>

        {/* Tab row */}
        <div className="px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = view === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold border-b-2 transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-lg"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.badge !== null && tab.badge !== undefined && (
                  <span className={`px-2 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Toast Notification ─── */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-2xl shadow-xl text-xs font-bold border border-slate-700 animate-slide-up">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-white bg-transparent border-none cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ─── Main Content Container ─── */}
      <div className="p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">

        {/* ══════════════ 1. OVERVIEW ══════════════ */}
        {view === "overview" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shadow-indigo-100 text-white relative overflow-hidden">
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                  <Shield className="w-7 h-7 text-white fill-white/20" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black tracking-tight">Institutional Compliance Command</h2>
                  <p className="text-indigo-100 text-xs md:text-sm font-medium mt-1 max-w-xl leading-relaxed">
                    Track fire/civil NOCs, board affiliation renewals, UDISE+ and APAAR ID readiness, and maintain inspection audit trails.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 relative z-10">
                <button
                  onClick={() => navigate("/compliance/checklist")}
                  className="px-3.5 py-2 bg-white/15 hover:bg-white/25 transition-all rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border-none text-white backdrop-blur-xs"
                >
                  <CheckSquare className="w-4 h-4" /> Audit Checklist
                </button>
                <button
                  onClick={() => navigate("/compliance/data-validator")}
                  className="px-4 py-2 bg-white text-indigo-700 hover:bg-slate-50 transition-all rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-indigo-900/20 cursor-pointer border-none"
                >
                  <Play className="w-4 h-4" /> Run Validator
                </button>
              </div>
            </div>

            {/* Readiness Gauges & Risk Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider self-start">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> UDISE+ Readiness
                </div>
                <div className="py-2 relative flex items-center justify-center">
                  <CircleGauge pct={overviewData?.readiness?.udiseReady ?? 78} color="#6366f1" label="READY" />
                </div>
                <div className="text-center w-full pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500">
                    {overviewData?.readiness?.studentDataQuality ?? 85}% data quality score
                  </span>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider self-start">
                  <Award className="w-3.5 h-3.5 text-emerald-600" /> CBSE Affiliation / SARAS
                </div>
                <div className="py-2 relative flex items-center justify-center">
                  <CircleGauge pct={overviewData?.readiness?.cbseReady ?? 82} color="#10b981" label="READY" />
                </div>
                <div className="text-center w-full pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-emerald-600">
                    All statutory certificates verified
                  </span>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider self-start">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Overall Health Score
                </div>
                <div className="py-2 relative flex items-center justify-center">
                  <CircleGauge pct={overviewData?.readiness?.healthScore ?? 85} color="#8b5cf6" label="SCORE" />
                </div>
                <div className="text-center w-full pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500">
                    Based on vault, checklist & profile
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-5 shadow-xs text-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-wider">Audit Risk Level</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      (overviewData?.readiness?.riskLevel || "Low") === "High" ? "bg-red-500/20 text-red-300 border border-red-400/30" :
                      (overviewData?.readiness?.riskLevel || "Low") === "Medium" ? "bg-amber-500/20 text-amber-300 border border-amber-400/30" :
                      "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                    }`}>
                      {overviewData?.readiness?.riskLevel || "Low"} Risk
                    </span>
                  </div>
                  <div className="text-2xl font-black mt-3">
                    {validationIssues.length} Findings
                  </div>
                  <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">
                    Student records scanned against UIDAI Aadhaar checksum and APAAR ID standard.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/compliance/data-validator")}
                  className="mt-4 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border-none cursor-pointer transition-colors"
                >
                  Inspect Findings <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Vault Documents</div>
                <div className="text-2xl font-black text-slate-800 mt-1">{documents.length}</div>
                <span className="text-[10px] font-bold text-emerald-600">
                  {documents.filter(d => d.status === "Valid").length} Active & Valid
                </span>
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Expiring / Overdue</div>
                <div className="text-2xl font-black text-amber-600 mt-1">
                  {documents.filter(d => ["Expiring Soon", "Expired"].includes(d.status)).length}
                </div>
                <span className="text-[10px] font-bold text-slate-400">Within 60 days</span>
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Audit Checklist</div>
                <div className="text-2xl font-black text-slate-800 mt-1">{checklist.length}</div>
                <span className="text-[10px] font-bold text-indigo-600">
                  {checklist.filter(c => c.status === "Compliant").length} Complied
                </span>
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Active Packs</div>
                <div className="text-2xl font-black text-indigo-600 mt-1">
                  {packs.filter(p => p.installed).length}
                </div>
                <span className="text-[10px] font-bold text-slate-400">CBSE & UDISE+ Active</span>
              </div>
            </div>

            {/* Two Column Layout: Urgent Items & Vault Snippet */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column (2/3): Statutory Documents on File */}
              <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>Statutory Document Vault Highlights</span>
                  </div>
                  <button
                    onClick={() => navigate("/compliance/document-vault")}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer bg-transparent border-none"
                  >
                    View All ({documents.length}) →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">CERTIFICATE / NOC</th>
                        <th className="py-3 px-3">CATEGORY</th>
                        <th className="py-3 px-3">DOC NO</th>
                        <th className="py-3 px-3">EXPIRY DATE</th>
                        <th className="py-3 px-3 text-center">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                      {documents.slice(0, 5).map((doc, idx) => (
                        <tr key={doc._id || idx} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900">{doc.title}</td>
                          <td className="py-3.5 px-3 text-slate-600">
                            <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px]">
                              {doc.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-500 text-[11px]">{doc.docNo || "—"}</td>
                          <td className="py-3.5 px-3 text-slate-600 text-[11px]">
                            {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : "Permanent"}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              doc.status === "Valid" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                              doc.status === "Expiring Soon" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                              "bg-red-50 text-red-700 border border-red-200"
                            }`}>
                              {doc.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column (1/3): Action Items & Installed Packs */}
              <div className="space-y-6">
                {/* Urgent Action Card */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm border-b pb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Inspection Action Required</span>
                  </div>
                  <div className="space-y-3">
                    {checklist.slice(0, 3).map((item, idx) => (
                      <div key={item._id || idx} className="p-3 bg-slate-50 rounded-2xl flex items-start gap-2.5">
                        <span className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-black mt-0.5 ${
                          item.status === "Compliant" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {item.status === "Compliant" ? "✓" : "!"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 leading-snug line-clamp-1">{item.title}</p>
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                            Priority: {item.priority} • Assigned: {item.assignedTo}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Installed Packs Card */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                      <Package className="w-4 h-4 text-indigo-600" />
                      <span>Active Regulatory Packs</span>
                    </div>
                    <button
                      onClick={() => navigate("/compliance/packs")}
                      className="text-xs font-bold text-indigo-600 hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Configure
                    </button>
                  </div>
                  <div className="space-y-2">
                    {packs.filter(p => p.installed).map(p => (
                      <div key={p.id} className="p-3 bg-indigo-50/50 border border-indigo-100/70 rounded-2xl flex items-center gap-3">
                        <span className="text-xl">{p.icon}</span>
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900 leading-tight">{p.name}</h4>
                          <span className="text-[10px] text-indigo-700 font-semibold">{p.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ 2. COMPLIANCE PACKS ══════════════ */}
        {view === "packs" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Regulatory & Board Compliance Packs</h2>
              <p className="text-slate-500 text-xs md:text-sm font-semibold mt-0.5">
                Install standardized regulatory frameworks. Activating a pack unlocks board-specific validation rules, statutory document requirements, and UDISE+ export formats.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {packs.map((pack) => (
                <div
                  key={pack.id}
                  className={`bg-white border rounded-3xl p-6 shadow-xs flex flex-col justify-between transition-all duration-200 ${
                    pack.installed
                      ? "border-indigo-400 ring-2 ring-indigo-50 shadow-md shadow-indigo-100/50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-3xl">{pack.icon}</span>
                      {pack.installed && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active & Installed
                        </span>
                      )}
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">{pack.name}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{pack.desc}</p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {(pack.badges || []).map((b, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 mt-6">
                    {pack.installed ? (
                      <button
                        onClick={() => handleTogglePack(pack.id, false)}
                        className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-slate-600 text-xs font-bold cursor-pointer transition-colors"
                      >
                        Uninstall Pack
                      </button>
                    ) : (
                      <button
                        onClick={() => handleTogglePack(pack.id, true)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black cursor-pointer border-none shadow-md shadow-indigo-100 transition-all"
                      >
                        + Install Pack
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════ 3. SCHOOL COMPLIANCE PROFILE ══════════════ */}
        {view === "school-profile" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">School Statutory Compliance Profile</h2>
              <p className="text-slate-500 text-xs md:text-sm font-semibold mt-0.5">
                Official institution credentials used on government UDISE+ portals, CBSE SARAS affiliation returns, and fee regulation filings.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-6">
                <div className="flex items-center gap-2 border-b pb-4 text-xs font-black text-indigo-700 uppercase tracking-wider">
                  <School className="w-4 h-4" /> Identity & Affiliation
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-bold text-slate-700">
                  <div className="space-y-1">
                    <label>UDISE+ Code (11-Digit)</label>
                    <input
                      type="text"
                      value={profile.udiseCode}
                      onChange={(e) => setProfile({ ...profile, udiseCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-semibold focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label>CBSE / Board Affiliation No.</label>
                    <input
                      type="text"
                      value={profile.affiliationNo}
                      onChange={(e) => setProfile({ ...profile, affiliationNo: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-semibold focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label>State Recognition No.</label>
                    <input
                      type="text"
                      value={profile.recognitionNo}
                      onChange={(e) => setProfile({ ...profile, recognitionNo: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-semibold focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-bold text-slate-700">
                  <div className="space-y-1">
                    <label>Recognition Grant Date</label>
                    <input
                      type="date"
                      value={profile.recognitionDate}
                      onChange={(e) => setProfile({ ...profile, recognitionDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-semibold focus:outline-none focus:border-indigo-600 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label>Management Type</label>
                    <select
                      value={profile.managementType}
                      onChange={(e) => setProfile({ ...profile, managementType: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-semibold focus:outline-none focus:border-indigo-600 bg-white"
                    >
                      <option value="Private Unaided">Private Unaided</option>
                      <option value="Government">Government</option>
                      <option value="Government Aided">Government Aided</option>
                      <option value="Trust / Society">Trust / Society Run</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label>School Category</label>
                    <select
                      value={profile.schoolCategory}
                      onChange={(e) => setProfile({ ...profile, schoolCategory: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-semibold focus:outline-none focus:border-indigo-600 bg-white"
                    >
                      <option value="Primary (I–V)">Primary (I–V)</option>
                      <option value="Upper Primary (I–VIII)">Upper Primary (I–VIII)</option>
                      <option value="Secondary (I–X)">Secondary (I–X)</option>
                      <option value="Higher Secondary (I–XII)">Higher Secondary (I–XII)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-bold text-slate-700">
                  <div className="space-y-1">
                    <label>Affiliated Board</label>
                    <input
                      type="text"
                      value={profile.board}
                      onChange={(e) => setProfile({ ...profile, board: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-semibold focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label>Year Established</label>
                    <input
                      type="text"
                      value={profile.yearEstablished}
                      onChange={(e) => setProfile({ ...profile, yearEstablished: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-semibold focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label>Nodal Compliance Officer</label>
                    <input
                      type="text"
                      value={profile.nodalOfficer}
                      onChange={(e) => setProfile({ ...profile, nodalOfficer: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-semibold focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs shadow-md shadow-indigo-100 cursor-pointer border-none flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Profile Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ══════════════ 4. FIELD SETTINGS ══════════════ */}
        {view === "field-settings" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Compliance Field Visibility & Mandates</h2>
              <p className="text-slate-500 text-xs md:text-sm font-semibold mt-0.5">
                Enable or require statutory fields across student admissions, teacher profiles, and staff background records.
              </p>
            </div>

            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setFieldTab("Student")}
                className={`px-5 py-2 rounded-xl text-xs font-black cursor-pointer transition-colors border-none ${
                  fieldTab === "Student" ? "bg-indigo-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                Student Compliance Fields
              </button>
              <button
                onClick={() => setFieldTab("Teacher")}
                className={`px-5 py-2 rounded-xl text-xs font-black cursor-pointer transition-colors border-none ${
                  fieldTab === "Teacher" ? "bg-indigo-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                Teacher & Staff Fields
              </button>
            </div>

            <form onSubmit={handleSaveFieldSettings} className="space-y-6">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(fieldTab === "Student" ? (fieldSettings.student || {}) : (fieldSettings.teacher || {})).map(([field, isEnabled]) => (
                    <div key={field} className="p-4 bg-slate-50/70 border border-slate-200/70 rounded-2xl flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{field}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {isEnabled ? "Visible on Admission Form" : "Hidden"}
                        </span>
                      </div>
                      <Toggle
                        on={isEnabled}
                        onChange={(val) => {
                          const targetKey = fieldTab === "Student" ? "student" : "teacher";
                          setFieldSettings({
                            ...fieldSettings,
                            [targetKey]: {
                              ...fieldSettings[targetKey],
                              [field]: val
                            }
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs shadow-md shadow-indigo-100 cursor-pointer border-none flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Field Settings
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ══════════════ 5. DOCUMENT VAULT ══════════════ */}
        {view === "document-vault" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">Statutory Document Vault</h2>
                <p className="text-slate-500 text-xs md:text-sm font-semibold mt-0.5">
                  Secure archive of Fire Safety NOCs, Building Fitness, Drinking Water & Sanitation, and Affiliation Certificates with auto-reminders.
                </p>
              </div>
              <button
                onClick={() => setShowAddDocModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 flex items-center gap-1.5 cursor-pointer border-none"
              >
                <Plus className="w-4 h-4" /> Upload Document
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row items-end gap-3 shadow-xs">
              <div className="flex-1 w-full space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Search Documents</label>
                <input
                  type="text"
                  placeholder="Search by title, authority, or document number..."
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 bg-white"
                />
              </div>
              <div className="w-full md:w-52 space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Category</label>
                <select
                  value={docCategoryFilter}
                  onChange={(e) => setDocCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 bg-white"
                >
                  <option value="All">All Categories</option>
                  <option value="Fire Safety">Fire Safety</option>
                  <option value="Building Safety">Building Safety</option>
                  <option value="Water & Sanitation">Water & Sanitation</option>
                  <option value="CBSE Affiliation / SARAS">CBSE Affiliation / SARAS</option>
                  <option value="Transport Fitness & Permit">Transport Fitness</option>
                  <option value="Land & Lease Title">Land & Lease Title</option>
                </select>
              </div>
              <div className="w-full md:w-44 space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Status</label>
                <select
                  value={docStatusFilter}
                  onChange={(e) => setDocStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 bg-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Valid">Valid</option>
                  <option value="Expiring Soon">Expiring Soon</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>

            {/* Documents List Table */}
            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">DOCUMENT TITLE</th>
                      <th className="py-3 px-3">CATEGORY</th>
                      <th className="py-3 px-3">DOC NO</th>
                      <th className="py-3 px-3">ISSUING AUTHORITY</th>
                      <th className="py-3 px-3">VALIDITY</th>
                      <th className="py-3 px-3 text-center">STATUS</th>
                      <th className="py-3 px-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {documents
                      .filter(d => {
                        const matchSearch = !docSearch.trim() || d.title.toLowerCase().includes(docSearch.toLowerCase()) || d.docNo.toLowerCase().includes(docSearch.toLowerCase());
                        const matchCat = docCategoryFilter === "All" || d.category === docCategoryFilter;
                        const matchStatus = docStatusFilter === "All" || d.status === docStatusFilter;
                        return matchSearch && matchCat && matchStatus;
                      })
                      .map((doc, idx) => (
                        <tr key={doc._id || idx} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-4 font-bold text-slate-900 max-w-xs">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="block leading-tight">{doc.title}</span>
                                {doc.notes && <span className="text-[10px] text-slate-400 font-medium line-clamp-1">{doc.notes}</span>}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-3">
                            <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold">
                              {doc.category}
                            </span>
                          </td>
                          <td className="py-4 px-3 text-slate-600 text-[11px] font-mono">{doc.docNo || "—"}</td>
                          <td className="py-4 px-3 text-slate-600 text-[11px] max-w-xs truncate">{doc.issuingAuthority || "State Education Dept"}</td>
                          <td className="py-4 px-3 text-slate-600 text-[11px]">
                            {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : "Permanent Record"}
                          </td>
                          <td className="py-4 px-3 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              doc.status === "Valid" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                              doc.status === "Expiring Soon" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                              "bg-red-50 text-red-700 border border-red-200"
                            }`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => handleDeleteDoc(doc._id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer bg-transparent border-none transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    {documents.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400 text-xs font-semibold">
                          No documents registered in the vault yet. Click "+ Upload Document" to add certificates.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ 6. CHECKLIST ══════════════ */}
        {view === "checklist" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">Statutory Inspection & Audit Checklist</h2>
                <p className="text-slate-500 text-xs md:text-sm font-semibold mt-0.5">
                  Track CBSE Affiliation Bye-Laws, POCSO Committee constitution, and civil safety mandates.
                </p>
              </div>
              <button
                onClick={() => setShowAddChecklistModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 flex items-center gap-1.5 cursor-pointer border-none"
              >
                <Plus className="w-4 h-4" /> Add Checklist Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {checklist.map((item, idx) => (
                <div key={item._id || idx} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-3 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-black shrink-0 mt-0.5">
                        {item.code}
                      </span>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 leading-snug">{item.title}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold">{item.category}</span>
                      </div>
                    </div>
                    <select
                      value={item.status}
                      onChange={(e) => handleChecklistStatusChange(item._id, e.target.value)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer border appearance-none text-center ${
                        item.status === "Compliant" ? "bg-emerald-50 text-emerald-700 border-emerald-300" :
                        item.status === "In Progress" ? "bg-blue-50 text-blue-700 border-blue-300" :
                        "bg-amber-50 text-amber-700 border-amber-300"
                      }`}
                    >
                      <option value="Compliant">Compliant</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Pending">Pending</option>
                      <option value="Non-Compliant">Non-Compliant</option>
                    </select>
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-500 font-medium leading-relaxed pl-8">
                      {item.description}
                    </p>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between pl-8 text-[11px] font-bold text-slate-500">
                    <span>Assigned to: <strong className="text-slate-700">{item.assignedTo}</strong></span>
                    <button
                      onClick={() => handleDeleteChecklist(item._id)}
                      className="text-slate-400 hover:text-red-600 bg-transparent border-none cursor-pointer p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════ 7. DATA RECORDS ══════════════ */}
        {view === "data-records" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Student & Staff Compliance Records</h2>
              <p className="text-slate-500 text-xs md:text-sm font-semibold mt-0.5">
                Maintain APAAR Permanent Education Numbers (PEN), Aadhaar verification, RTE quota, and social category mappings.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Search student by name or admission no..."
                  value={recordSearch}
                  onChange={(e) => setRecordSearch(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600"
                />
              </div>
              <span className="text-xs font-bold text-slate-500">
                {studentsList.length} Student Records on File
              </span>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">ADMISSION NO</th>
                      <th className="py-3 px-3">STUDENT NAME</th>
                      <th className="py-3 px-3">APAAR / PEN ID</th>
                      <th className="py-3 px-3">AADHAAR</th>
                      <th className="py-3 px-3">CATEGORY</th>
                      <th className="py-3 px-3 text-center">VERIFICATION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {studentsList
                      .filter(st => {
                        const name = `${st.firstName || ""} ${st.lastName || ""}`.toLowerCase();
                        return !recordSearch.trim() || name.includes(recordSearch.toLowerCase()) || (st.admissionNo && st.admissionNo.toLowerCase().includes(recordSearch.toLowerCase()));
                      })
                      .slice(0, 10)
                      .map((st, i) => (
                        <tr key={st._id || i} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{st.admissionNo || `ADM-${i + 100}`}</td>
                          <td className="py-3.5 px-3 font-bold text-slate-900">{st.firstName} {st.lastName}</td>
                          <td className="py-3.5 px-3 font-mono text-slate-600">{st.aparId || "Pending Verification"}</td>
                          <td className="py-3.5 px-3 font-mono text-slate-600">{st.aadhaar ? `•••• •••• ${st.aadhaar.slice(-4)}` : "Missing"}</td>
                          <td className="py-3.5 px-3 text-slate-600">{st.category || "General"}</td>
                          <td className="py-3.5 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              st.aparId && st.aadhaar ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                            }`}>
                              {st.aparId && st.aadhaar ? "UDISE+ Verified" : "Needs Review"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    {studentsList.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-semibold">
                          No student records loaded from database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ 8. DATA VALIDATOR ══════════════ */}
        {view === "data-validator" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">UDISE+ & Board Data Quality Engine</h2>
                <p className="text-slate-500 text-xs md:text-sm font-semibold mt-0.5">
                  Validates student demographics, 12-digit UIDAI checksums, and APAAR IDs before state portal export.
                </p>
              </div>
              <button
                onClick={fetchAllComplianceData}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs rounded-xl shadow-md shadow-indigo-100 flex items-center gap-1.5 cursor-pointer border-none"
              >
                <Play className="w-4 h-4" /> Run Live Validator
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                <span className="text-[10px] font-black text-red-500 uppercase tracking-wider">Critical Blocking Errors</span>
                <div className="text-2xl font-black text-red-600 mt-1">
                  {validationIssues.filter(i => i.severity === "Critical").length}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">Blocks UDISE+ final submission</span>
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider">Warnings & Gaps</span>
                <div className="text-2xl font-black text-amber-600 mt-1">
                  {validationIssues.filter(i => i.severity === "Warning").length}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">Recommended to fill before audit</span>
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">Audit Pass Rate</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">
                  {studentsList.length > 0 ? `${Math.round(((studentsList.length - validationIssues.length) / studentsList.length) * 100)}%` : "92%"}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">Clean student records</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                  <ListFilter className="w-4 h-4 text-indigo-600" />
                  <span>Validation Findings Worklist ({validationIssues.length})</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">STUDENT</th>
                      <th className="py-3 px-3">FIELD</th>
                      <th className="py-3 px-3 text-center">SEVERITY</th>
                      <th className="py-3 px-4">ISSUE DESCRIPTION & SUGGESTED ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {validationIssues.map((issue, idx) => (
                      <tr key={issue.id || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{issue.studentName}</td>
                        <td className="py-3.5 px-3 text-slate-600">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px]">
                            {issue.field}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            issue.severity === "Critical" ? "bg-red-50 text-red-600 border border-red-200" : "bg-amber-50 text-amber-600 border border-amber-200"
                          }`}>
                            {issue.severity}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 leading-snug">
                          <div className="font-medium">{issue.description}</div>
                          <span className="text-[10px] text-indigo-600 font-bold block mt-0.5">
                            Fix: {issue.suggestedFix}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {validationIssues.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-400 text-xs font-semibold">
                          No validation issues found. All records pass statutory checks!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ 9. GOVERNMENT REPORTS ══════════════ */}
        {view === "government-reports" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Statutory Government Exports</h2>
              <p className="text-slate-500 text-xs md:text-sm font-semibold mt-0.5">
                Official UDISE+ Data Capture Format (DCF) summary and CBSE SARAS self-certification return files.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <FileOutput className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-extrabold text-slate-900 text-base">UDISE+ DCF Return Summary</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700">
                    Ready
                  </span>
                </div>
                <div className="space-y-2 text-xs font-medium text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>School UDISE Code:</span>
                    <strong className="text-slate-800">{govReports?.udiseSummary?.udiseCode || profile.udiseCode}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Total Enrolled Students:</span>
                    <strong className="text-slate-800">{govReports?.udiseSummary?.totalEnrollment || studentsList.length}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Gender Ratio (M/F):</span>
                    <strong className="text-slate-800">
                      {govReports?.udiseSummary?.genderRatio?.boys || 0} Boys / {govReports?.udiseSummary?.genderRatio?.girls || 0} Girls
                    </strong>
                  </div>
                </div>
                <button
                  onClick={() => alert("Downloading UDISE+ JSON Export file...")}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border-none shadow-sm"
                >
                  <FileDown className="w-4 h-4" /> Download UDISE+ DCF (JSON)
                </button>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-extrabold text-slate-900 text-base">CBSE SARAS Infrastructure Return</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700">
                    Compliant
                  </span>
                </div>
                <div className="space-y-2 text-xs font-medium text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Campus Land Area:</span>
                    <strong className="text-slate-800">{govReports?.cbseSarasReport?.landAreaAcres || "3.5"} Acres</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Playground Area:</span>
                    <strong className="text-slate-800">{govReports?.cbseSarasReport?.playGroundAreaSqMeters || "6,200"} sq. m</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Science & Computer Labs:</span>
                    <strong className="text-slate-800">{govReports?.cbseSarasReport?.scienceLabs || 3} Units</strong>
                  </div>
                </div>
                <button
                  onClick={() => alert("Generating CBSE OASIS/SARAS Return Dossier...")}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border-none shadow-sm"
                >
                  <FileDown className="w-4 h-4" /> Export SARAS Return (PDF)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ 10. INSPECTIONS ══════════════ */}
        {view === "inspections" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Inspection Kits & Board Affiliation Audit</h2>
              <p className="text-slate-500 text-xs md:text-sm font-semibold mt-0.5">
                Pre-packaged inspection kits for visiting education officers and accreditation committees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Fire & Civil Safety Kit</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Consolidated folder containing building structural safety certificate, fire NOC, water testing lab reports, and evacuation drill logs.
                </p>
                <div className="pt-2">
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    3 of 3 Verified
                  </span>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <School className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">CBSE Affiliation Inspection Dossier</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Teacher salary ECS bank payment records, EPF compliance certificates, service books, and PTA committee constitution minutes.
                </p>
                <div className="pt-2">
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Ready for Review
                  </span>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">RTE 25% Quota & Inclusion Audit</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Admissions register under section 12(1)(c), fee reimbursement claims submitted to District Education Office, and CWSN facilities.
                </p>
                <div className="pt-2">
                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                    Audited Annually
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ 11. CALENDAR ══════════════ */}
        {view === "calendar" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">Statutory Compliance Calendar</h2>
                <p className="text-slate-500 text-xs md:text-sm font-semibold mt-0.5">
                  Statutory renewal dates, fee regulation committee filings, and board registration deadlines.
                </p>
              </div>
              <button
                onClick={() => setShowAddCalendarModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 flex items-center gap-1.5 cursor-pointer border-none"
              >
                <Plus className="w-4 h-4" /> Add Event Deadline
              </button>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">DUE DATE</th>
                      <th className="py-3 px-3">EVENT / DEADLINE</th>
                      <th className="py-3 px-3">CATEGORY</th>
                      <th className="py-3 px-3">AUTHORITY</th>
                      <th className="py-3 px-3 text-center">PRIORITY</th>
                      <th className="py-3 px-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {calendarEvents.map((evt, idx) => (
                      <tr key={evt._id || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {new Date(evt.dueDate).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-3 font-bold text-slate-900">
                          <div>{evt.title}</div>
                          {evt.notes && <span className="text-[10px] text-slate-400 font-medium">{evt.notes}</span>}
                        </td>
                        <td className="py-3.5 px-3 text-slate-600">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px]">
                            {evt.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600 text-[11px]">{evt.authority}</td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            evt.priority === "Urgent" ? "bg-red-50 text-red-600 border border-red-200" :
                            evt.priority === "High" ? "bg-orange-50 text-orange-600 border border-orange-200" :
                            "bg-slate-100 text-slate-600"
                          }`}>
                            {evt.priority}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteCalendar(evt._id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer bg-transparent border-none transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ─── MODALS ─── */}
      {/* 1. Add Document Modal */}
      {showAddDocModal && (
        <AddDocumentModal
          onClose={() => setShowAddDocModal(false)}
          onAdded={(msg) => {
            showToast(msg);
            fetchAllComplianceData();
          }}
        />
      )}

      {/* 2. Add Checklist Modal */}
      {showAddChecklistModal && (
        <AddChecklistModal
          onClose={() => setShowAddChecklistModal(false)}
          onAdded={(msg) => {
            showToast(msg);
            fetchAllComplianceData();
          }}
        />
      )}

      {/* 3. Add Calendar Modal */}
      {showAddCalendarModal && (
        <AddCalendarModal
          onClose={() => setShowAddCalendarModal(false)}
          onAdded={(msg) => {
            showToast(msg);
            fetchAllComplianceData();
          }}
        />
      )}
    </div>
  );
}

/* ==============================================================
   HELPER MODALS
   ============================================================== */

function AddDocumentModal({ onClose, onAdded }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Building Safety");
  const [docNo, setDocNo] = useState("");
  const [issuingAuthority, setIssuingAuthority] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Document title is required");
      return;
    }
    setSubmitting(true);
    try {
      await complianceService.createDocument({
        title: title.trim(),
        category,
        docNo: docNo.trim(),
        issuingAuthority: issuingAuthority.trim(),
        issueDate: issueDate || null,
        expiryDate: expiryDate || null,
        notes: notes.trim()
      });
      onAdded("Document registered in statutory vault!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save document");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-8">
        <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <h3 className="font-black text-base">Register Statutory Document</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white border-none cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-bold text-slate-700">
          <div>
            <label className="block mb-1">Document Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="e.g. Fire Safety NOC Renewal 2026-27"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 bg-white font-semibold"
              >
                <option value="Building Safety">Building Safety</option>
                <option value="Fire Safety">Fire Safety</option>
                <option value="Water & Sanitation">Water & Sanitation</option>
                <option value="Recognition Certificate">Recognition Certificate</option>
                <option value="CBSE Affiliation / SARAS">CBSE Affiliation / SARAS</option>
                <option value="Land & Lease Title">Land & Lease Title</option>
                <option value="Transport Fitness & Permit">Transport Fitness</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Document / Certificate No.</label>
              <input
                type="text"
                placeholder="e.g. FS-NOC/2026/102"
                value={docNo}
                onChange={(e) => setDocNo(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Issuing Authority</label>
            <input
              type="text"
              placeholder="e.g. Chief Fire Officer, Municipal Fire Service"
              value={issuingAuthority}
              onChange={(e) => setIssuingAuthority(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 bg-white font-semibold"
              />
            </div>
            <div>
              <label className="block mb-1">Expiry Date (Leave blank if permanent)</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 bg-white font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Notes / Remarks</label>
            <textarea
              rows={2}
              placeholder="Any inspection notes or condition caveats..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 font-normal resize-y"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs cursor-pointer border-none flex items-center gap-1.5"
            >
              {submitting ? "Saving..." : "Save Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddChecklistModal({ onClose, onAdded }) {
  const [code, setCode] = useState(`AUD-${Date.now().toString().slice(-4)}`);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Safety & Infrastructure");
  const [priority, setPriority] = useState("Mandatory");
  const [assignedTo, setAssignedTo] = useState("Principal");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Checklist title is required");
      return;
    }
    setSubmitting(true);
    try {
      await complianceService.createChecklistItem({
        code,
        title: title.trim(),
        category,
        priority,
        status: "Pending",
        assignedTo,
        description: description.trim()
      });
      onAdded("Checklist item created successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create checklist item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-8">
        <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            <h3 className="font-black text-base">New Inspection Checklist Item</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white border-none cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-bold text-slate-700">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Check Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 font-semibold"
              />
            </div>
            <div>
              <label className="block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 bg-white font-semibold"
              >
                <option value="Critical">Critical</option>
                <option value="Mandatory">Mandatory</option>
                <option value="Recommended">Recommended</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1">Requirement Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="e.g. CCTV Surveillance in Common Corridors and Gates"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 bg-white font-semibold"
              >
                <option value="Statutory Approvals">Statutory Approvals</option>
                <option value="Safety & Infrastructure">Safety & Infrastructure</option>
                <option value="Academic Standards & NEP 2020">Academic & NEP 2020</option>
                <option value="Student Welfare & Protection">Student Welfare</option>
                <option value="Staff Governance & Service">Staff Governance</option>
                <option value="Affiliation & Annual Returns">Affiliation & Returns</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Assigned Staff / Owner</label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Detailed Description & Standard</label>
            <textarea
              rows={2}
              placeholder="Detail out the exact compliance benchmark required..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 font-normal resize-y"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs cursor-pointer border-none flex items-center gap-1.5"
            >
              {submitting ? "Saving..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddCalendarModal({ onClose, onAdded }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Statutory Renewal");
  const [authority, setAuthority] = useState("Education Department");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("High");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      alert("Title and Due Date are required");
      return;
    }
    setSubmitting(true);
    try {
      await complianceService.createCalendarEvent({
        title: title.trim(),
        category,
        authority,
        dueDate,
        priority,
        status: "Upcoming",
        notes: notes.trim()
      });
      onAdded("Statutory event deadline added to calendar!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add calendar event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-8">
        <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <h3 className="font-black text-base">Add Statutory Compliance Deadline</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white border-none cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-bold text-slate-700">
          <div>
            <label className="block mb-1">Event / Deadline Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="e.g. CBSE LOC (List of Candidates) Final Registration"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Due Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 bg-white font-semibold"
              />
            </div>
            <div>
              <label className="block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 bg-white font-semibold"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Category</label>
              <input
                type="text"
                placeholder="e.g. Board Registration"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 font-semibold"
              />
            </div>
            <div>
              <label className="block mb-1">Filing Authority</label>
              <input
                type="text"
                placeholder="e.g. CBSE Examination Controller"
                value={authority}
                onChange={(e) => setAuthority(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Notes / Instructions</label>
            <textarea
              rows={2}
              placeholder="Any prerequisites before filing..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 font-normal resize-y"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs cursor-pointer border-none flex items-center gap-1.5"
            >
              {submitting ? "Saving..." : "Add Deadline"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

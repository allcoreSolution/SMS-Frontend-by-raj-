import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
  Building,
  Sliders,
  Clock,
  Shield,
  Plug,
  Share2,
  Send,
  Bell,
  BookOpen,
  Info,
  Save,
  Check,
  ChevronDown,
  LayoutGrid,
  FileText,
  MapPin,
  Fingerprint,
  UserCheck,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowLeft,
  Search,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Plus,
  MessageSquare,
  Sparkles,
  Edit2,
  Upload,
  Globe,
  DollarSign,
  Palette,
  ExternalLink,
  Copy
} from "lucide-react";
import settingsService from "../api/settingsService";

export default function SchoolSettings() {
  const [activeTab, setActiveTab] = useState("profile"); // profile | system | attendance | security | integrations | notifications | social | telegram
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile Form States
  const [schoolName, setSchoolName] = useState("RAM INTERNATIONAL SCHOOL");
  const [shortName, setShortName] = useState("RIS");
  const [email, setEmail] = useState("ram@gmail.com");
  const [phone, setPhone] = useState("8694893893");
  const [principalName, setPrincipalName] = useState("Principal");
  const [country, setCountry] = useState("India (+91)");
  const [address, setAddress] = useState("Main Campus");
  const [schoolLogo, setSchoolLogo] = useState("");
  const [favicon, setFavicon] = useState("");

  // System & Formats Form States
  const [schoolCode, setSchoolCode] = useState("GIS-8891");
  const [affiliatedBy, setAffiliatedBy] = useState("C.B.S.E (AFF-2024-9812)");
  const [selectedTheme, setSelectedTheme] = useState("executive");
  const [currency, setCurrency] = useState("Indian Rupee (₹)");
  const [academicSession, setAcademicSession] = useState("2026-2027");
  const [timezone, setTimezone] = useState("Asia/Kolkata (GMT +05:30)");

  // Prefix & Numbering States
  const [feePrefix, setFeePrefix] = useState("REC");
  const [feeSeparator, setFeeSeparator] = useState("-");
  const [feePadding, setFeePadding] = useState("4");
  const [feeIncludeSession, setFeeIncludeSession] = useState(true);
  const [feeNextNumber, setFeeNextNumber] = useState(1045);

  const [admPrefix, setAdmPrefix] = useState("GIS");
  const [admSeparator, setAdmSeparator] = useState("-");
  const [admNextNumber, setAdmNextNumber] = useState(2024);

  const [rollPrefix, setRollPrefix] = useState("ROLL");
  const [rollSeparator, setRollSeparator] = useState("-");
  const [rollPadding, setRollPadding] = useState("3");

  // Attendance Settings States
  const [geoRestricted, setGeoRestricted] = useState(false);
  const [latitude, setLatitude] = useState("28.613939");
  const [longitude, setLongitude] = useState("77.209021");
  const [radius, setRadius] = useState("1000");
  const [punchInStart, setPunchInStart] = useState("07:30");
  const [punchInEnd, setPunchInEnd] = useState("18:00");
  const [punchOutStart, setPunchOutStart] = useState("13:00");
  const [punchOutEnd, setPunchOutEnd] = useState("19:00");
  const [matchThreshold, setMatchThreshold] = useState("0.40");

  // Security Settings States
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [enforce2FA, setEnforce2FA] = useState(true);
  const [allowParentPortal, setAllowParentPortal] = useState(true);

  // Integrations & API States
  const [apiKey, setApiKey] = useState("pw_live_8849bfa8a329d20c3a2f903820a1993ccb1192");
  const [showApiKey, setShowApiKey] = useState(false);
  const [telegramActive, setTelegramActive] = useState(true);
  const [botToken, setBotToken] = useState("718923091:AAE_9f88dJk1029zXq");
  const [telegramChatId, setTelegramChatId] = useState("-1001928374829");

  // Notification Center States
  const [notificationSearch, setNotificationSearch] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, name: "Parent Fee Paid", desc: "Sent to parent when an online fee payment is successful.", status: "Active", email: true, sms: false, whatsapp: true, push: true, type: "billing" },
    { id: 2, name: "Exam Result Published", desc: "Sent when exam marks & result cards are released.", status: "Active", email: true, sms: true, whatsapp: true, push: true, type: "academic" },
    { id: 3, name: "Student Attendance Alert", desc: "Sent when student is marked absent in daily roll-call.", status: "Active", email: false, sms: true, whatsapp: true, push: true, type: "attendance" },
    { id: 4, name: "Student Leave Approved", desc: "Sent to parent when leave application is approved.", status: "Active", email: true, sms: false, whatsapp: true, push: true, type: "leave" },
    { id: 5, name: "Online Admission Form Received", desc: "Sent when online admission enquiry is submitted.", status: "Active", email: true, sms: true, whatsapp: true, push: true, type: "admission" },
    { id: 6, name: "Fee Dues Reminder", desc: "Automated notice sent 3 days before fee due date.", status: "Active", email: true, sms: true, whatsapp: true, push: true, type: "billing" }
  ]);

  // Previews
  const feePreview = `${feePrefix}${feeIncludeSession ? "-2026-27" : ""}${feeSeparator}${String(feeNextNumber).padStart(Number(feePadding), "0")}`;
  const admPreview = `${admPrefix}${admSeparator}${admNextNumber}`;
  const rollPreview = `${rollPrefix}${rollSeparator}${"1".padStart(Number(rollPadding), "0")}`;

  // 1. Fetch live settings from MongoDB
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [profRes, prefRes, notifRes, attRes, secRes] = await Promise.all([
        settingsService.getSetting("school_profile"),
        settingsService.getSetting("system_prefixes"),
        settingsService.getSetting("notification_settings"),
        settingsService.getSetting("attendance_settings"),
        settingsService.getSetting("security_settings")
      ]);

      if (profRes.success && profRes.data) {
        const p = profRes.data;
        if (p.schoolName) setSchoolName(p.schoolName);
        if (p.shortName) setShortName(p.shortName);
        if (p.email) setEmail(p.email);
        if (p.phone) setPhone(p.phone);
        if (p.address) setAddress(p.address);
        if (p.schoolCode) setSchoolCode(p.schoolCode);
        if (p.affiliationNo) setAffiliatedBy(p.affiliationNo);
        if (p.currency) setCurrency(p.currency);
        if (p.academicSession) setAcademicSession(p.academicSession);
        if (p.schoolLogo) setSchoolLogo(p.schoolLogo);
      }

      if (prefRes.success && prefRes.data) {
        const pref = prefRes.data;
        if (pref.feePrefix) setFeePrefix(pref.feePrefix);
        if (pref.feeSeparator) setFeeSeparator(pref.feeSeparator);
        if (pref.admPrefix) setAdmPrefix(pref.admPrefix);
        if (pref.admSeparator) setAdmSeparator(pref.admSeparator);
        if (pref.rollPrefix) setRollPrefix(pref.rollPrefix);
        if (pref.rollSeparator) setRollSeparator(pref.rollSeparator);
      }

      if (notifRes.success && Array.isArray(notifRes.data) && notifRes.data.length > 0) {
        setNotifications(notifRes.data);
      }

      if (attRes.success && attRes.data) {
        const a = attRes.data;
        if (a.geoRestricted !== undefined) setGeoRestricted(a.geoRestricted);
        if (a.latitude) setLatitude(a.latitude);
        if (a.longitude) setLongitude(a.longitude);
        if (a.radius) setRadius(a.radius);
      }

      if (secRes.success && secRes.data) {
        const s = secRes.data;
        if (s.maintenanceMode !== undefined) setMaintenanceMode(s.maintenanceMode);
        if (s.enforce2FA !== undefined) setEnforce2FA(s.enforce2FA);
        if (s.allowParentPortal !== undefined) setAllowParentPortal(s.allowParentPortal);
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // 2. Save settings to MongoDB
  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const profilePayload = {
        schoolName,
        shortName,
        email,
        phone,
        principalName,
        country,
        address,
        schoolLogo,
        favicon,
        schoolCode,
        affiliationNo: affiliatedBy,
        selectedTheme,
        currency,
        academicSession,
        timezone
      };

      const prefixesPayload = {
        feePrefix,
        feeSeparator,
        feePadding,
        feeIncludeSession,
        feeNextNumber,
        admPrefix,
        admSeparator,
        admNextNumber,
        rollPrefix,
        rollSeparator,
        rollPadding
      };

      const attendancePayload = {
        geoRestricted,
        latitude,
        longitude,
        radius,
        punchInStart,
        punchInEnd,
        punchOutStart,
        punchOutEnd,
        matchThreshold
      };

      const securityPayload = {
        maintenanceMode,
        enforce2FA,
        allowParentPortal
      };

      await Promise.all([
        settingsService.saveSetting("school_profile", profilePayload),
        settingsService.saveSetting("system_prefixes", prefixesPayload),
        settingsService.saveSetting("notification_settings", notifications),
        settingsService.saveSetting("attendance_settings", attendancePayload),
        settingsService.saveSetting("security_settings", securityPayload)
      ]);

      // Propagate school name update globally
      localStorage.setItem('schoolName', schoolName);
      window.dispatchEvent(new CustomEvent('school_changed', { detail: { schoolName } }));
      window.dispatchEvent(new CustomEvent('user_profile_updated', { detail: { schoolName } }));
      window.dispatchEvent(new CustomEvent('command_center_refresh_data'));

      Swal.fire({
        icon: "success",
        title: "Configuration Saved!",
        text: "School settings and preferences successfully updated in MongoDB.",
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: err.response?.data?.message || "Could not save configuration."
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleChannel = (id, channel) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [channel]: !n[channel] } : n))
    );
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "API Key copied to clipboard",
      showConfirmButton: false,
      timer: 2000
    });
  };

  const tabs = [
    { id: "profile", label: "School Profile", icon: Building },
    { id: "system", label: "System & Prefixes", icon: Sliders },
    { id: "attendance", label: "Attendance & Geo", icon: Clock },
    { id: "security", label: "Security & Access", icon: Shield },
    { id: "integrations", label: "Biometric & APIs", icon: Plug },
    { id: "notifications", label: "Notification Center", icon: Bell }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl shadow-slate-950/10 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              Institution Master Config
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-white/10 rounded-full border border-white/10 text-slate-300">
              Persistent MongoDB Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Building className="w-7 h-7 text-indigo-400 inline" />
            School Settings & System Parameters
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Configure institutional profile branding, automated voucher prefixes, biometric geo-fencing, and multi-channel notification alerts.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save All Settings"}</span>
        </button>
      </div>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Tab Pills Navigation */}
        <div className="lg:col-span-3 space-y-2 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                    : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Tab Content Panels */}
        <div className="lg:col-span-9 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          {loading ? (
            <div className="p-16 text-center text-slate-400 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
              <p className="text-xs font-bold">Loading school settings from MongoDB...</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {/* ============================================================== */}
              {/* 1. SCHOOL PROFILE TAB                                          */}
              {/* ============================================================== */}
              {activeTab === "profile" && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      Institutional Identity & Branding
                    </h3>
                    <p className="text-xs text-slate-400">
                      Official school name, affiliation numbers, and communication coordinates
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold text-slate-700">Official School Name *</label>
                      <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Short Name / Acronym</label>
                      <input
                        type="text"
                        value={shortName}
                        onChange={(e) => setShortName(e.target.value)}
                        placeholder="e.g. GIS"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">School Code</label>
                      <input
                        type="text"
                        value={schoolCode}
                        onChange={(e) => setSchoolCode(e.target.value)}
                        placeholder="e.g. GIS-8891"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">School Email Address *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Official Phone Number *</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Principal / Head of School</label>
                      <input
                        type="text"
                        value={principalName}
                        onChange={(e) => setPrincipalName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Affiliation & Board</label>
                      <input
                        type="text"
                        value={affiliatedBy}
                        onChange={(e) => setAffiliatedBy(e.target.value)}
                        placeholder="e.g. CBSE / ICSE / State"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold text-slate-700">Campus Physical Address</label>
                      <textarea
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* 2. SYSTEM & FORMATS TAB                                        */}
              {/* ============================================================== */}
              {activeTab === "system" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      Voucher Prefixes & System Numbering
                    </h3>
                    <p className="text-xs text-slate-400">
                      Configure automated sequence numbering for fee receipts, student IDs, and rolls
                    </p>
                  </div>

                  {/* Prefix Configurators with Live Preview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Fee Receipt Card */}
                    <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 block">
                        Fee Receipt Numbering
                      </span>
                      <div className="p-3 bg-white rounded-xl border border-indigo-200/60 text-center font-mono font-black text-sm text-indigo-700 shadow-2xs">
                        {feePreview}
                      </div>
                      <div className="space-y-2 text-xs">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block">Prefix</label>
                          <input
                            type="text"
                            value={feePrefix}
                            onChange={(e) => setFeePrefix(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block">Separator</label>
                          <input
                            type="text"
                            value={feeSeparator}
                            onChange={(e) => setFeeSeparator(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Admission Number Card */}
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                        Admission Sequence
                      </span>
                      <div className="p-3 bg-white rounded-xl border border-emerald-200/60 text-center font-mono font-black text-sm text-emerald-700 shadow-2xs">
                        {admPreview}
                      </div>
                      <div className="space-y-2 text-xs">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block">Prefix</label>
                          <input
                            type="text"
                            value={admPrefix}
                            onChange={(e) => setAdmPrefix(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block">Next ID</label>
                          <input
                            type="number"
                            value={admNextNumber}
                            onChange={(e) => setAdmNextNumber(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Roll Number Card */}
                    <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 block">
                        Student Roll Format
                      </span>
                      <div className="p-3 bg-white rounded-xl border border-purple-200/60 text-center font-mono font-black text-sm text-purple-700 shadow-2xs">
                        {rollPreview}
                      </div>
                      <div className="space-y-2 text-xs">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block">Prefix</label>
                          <input
                            type="text"
                            value={rollPrefix}
                            onChange={(e) => setRollPrefix(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block">Digits Padding</label>
                          <input
                            type="text"
                            value={rollPadding}
                            onChange={(e) => setRollPadding(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* General Currency & Session Format */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Active Academic Session</label>
                      <input
                        type="text"
                        value={academicSession}
                        onChange={(e) => setAcademicSession(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Display Currency</label>
                      <input
                        type="text"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* 3. ATTENDANCE & GEO-FENCING TAB                                */}
              {/* ============================================================== */}
              {activeTab === "attendance" && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      Biometric & Mobile Geo-Fencing
                    </h3>
                    <p className="text-xs text-slate-400">
                      Restrict staff mobile attendance punching to the physical school campus perimeter
                    </p>
                  </div>

                  {/* Geo-fence Switch */}
                  <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setGeoRestricted(!geoRestricted)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 mt-0.5 ${
                        geoRestricted ? "bg-indigo-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ${
                          geoRestricted ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900">
                        Campus Perimeter Geo-Fencing Restraint
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Staff can only register attendance when their smartphone GPS coordinates are within the authorized radius.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Campus Latitude</label>
                      <input
                        type="text"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Campus Longitude</label>
                      <input
                        type="text"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Perimeter Radius (Meters)</label>
                      <input
                        type="number"
                        value={radius}
                        onChange={(e) => setRadius(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* 4. SECURITY & ACCESS TAB                                       */}
              {/* ============================================================== */}
              {activeTab === "security" && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      Security & Platform Controls
                    </h3>
                    <p className="text-xs text-slate-400">
                      Manage campus-wide lockdown switches and login authentication rules
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setMaintenanceMode(!maintenanceMode)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 mt-0.5 ${
                          maintenanceMode ? "bg-rose-600" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ${
                            maintenanceMode ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900">
                          Maintenance Mode (Lockdown)
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Temporarily blocks student and parent logins while database upgrades or financial reconciliations are running.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setEnforce2FA(!enforce2FA)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 mt-0.5 ${
                          enforce2FA ? "bg-indigo-600" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ${
                            enforce2FA ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900">
                          Enforce Two-Factor Authentication for Admin Accounts
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Requires OTP verification via registered mobile or email on every admin login session.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* 5. BIOMETRIC & INTEGRATIONS TAB                                */}
              {/* ============================================================== */}
              {activeTab === "integrations" && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      Biometric Device Sync & Developer API Key
                    </h3>
                    <p className="text-xs text-slate-400">
                      Credentials for hardware attendance bridges (ESSL, Realtime, ZKTeco) and external systems
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <label className="font-bold text-slate-700 block">
                      Master Hardware Bridge API Key
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type={showApiKey ? "text" : "password"}
                        value={apiKey}
                        readOnly
                        className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold cursor-pointer"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyApiKey}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy Key
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* 6. NOTIFICATION CENTER TAB                                     */}
              {/* ============================================================== */}
              {activeTab === "notifications" && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-base font-black text-slate-900 tracking-tight">
                        Automated Trigger Notifications
                      </h3>
                      <p className="text-xs text-slate-400">
                        Choose delivery channels for automated transactional alerts
                      </p>
                    </div>
                    <div className="relative w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search alerts..."
                        value={notificationSearch}
                        onChange={(e) => setNotificationSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {notifications
                      .filter((n) =>
                        n.name.toLowerCase().includes(notificationSearch.toLowerCase())
                      )
                      .map((n) => (
                        <div
                          key={n.id}
                          className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-0.5">
                            <h4 className="font-bold text-xs text-slate-900">{n.name}</h4>
                            <p className="text-[11px] text-slate-500">{n.desc}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            {[
                              { key: "email", label: "Email" },
                              { key: "sms", label: "SMS" },
                              { key: "whatsapp", label: "WhatsApp" },
                              { key: "push", label: "Push" }
                            ].map((ch) => (
                              <button
                                key={ch.key}
                                type="button"
                                onClick={() => handleToggleChannel(n.id, ch.key)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                  n[ch.key]
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                                    : "bg-white text-slate-400 border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                {ch.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

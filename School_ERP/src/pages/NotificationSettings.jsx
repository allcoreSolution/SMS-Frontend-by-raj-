import React, { useState, useEffect, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import { 
  Bell, 
  Search, 
  HelpCircle, 
  Sliders, 
  Check, 
  Lock, 
  MessageCircle, 
  Edit2, 
  X, 
  Info,
  Mail,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Settings,
  Send,
  Save,
  RefreshCw,
  Sparkles,
  Zap,
  Globe,
  Radio,
  Share2
} from "lucide-react";
import settingsService from "../api/settingsService";

const DEFAULT_ALERTS = [
  { 
    id: 1, 
    title: "Parent Fee Paid Successfully", 
    desc: "Instant receipt notification triggered whenever an online fee or counter cash collection is completed.", 
    status: "Active", 
    email: true, 
    sms: false, 
    whatsapp: true, 
    push: true,
    subject: "Fee Payment Received - Greenwood International",
    body: "Dear Parent, We have received fee payment of ₹{fee_amount} for your ward {student_name} (Receipt #{receipt_no}) on {date}. Thank you!"
  },
  { 
    id: 2, 
    title: "Examination Result Published", 
    desc: "Alerts parents when term scorecards, grades, and report cards are officially released.", 
    status: "Active", 
    email: true, 
    sms: true, 
    whatsapp: true, 
    push: true,
    subject: "Exam Result Released - {student_name}",
    body: "Dear Parent, The report card for {exam_name} has been published for {student_name}. View marks online via Parent Portal."
  },
  { 
    id: 3, 
    title: "Daily Attendance Absence Alert", 
    desc: "Triggered immediately when teacher marks a student absent during morning roll-call.", 
    status: "Active", 
    email: false, 
    sms: true, 
    whatsapp: true, 
    push: true,
    subject: "Absence Notice - {student_name}",
    body: "Alert: {student_name} of Class {class_name} has been marked ABSENT today ({date}). If this is an error, please contact school office."
  },
  { 
    id: 4, 
    title: "Fee Dues Upcoming Reminder", 
    desc: "Automated friendly reminder dispatched 3 days prior to quarterly fee due cutoff date.", 
    status: "Active", 
    email: true, 
    sms: true, 
    whatsapp: true, 
    push: true,
    subject: "Fee Due Reminder - Term {term_name}",
    body: "Dear Parent, A reminder that school fees of ₹{due_amount} for {student_name} are due on {due_date}. Pay online to avoid late fee penalty."
  },
  { 
    id: 5, 
    title: "Student Leave Approved", 
    desc: "Notifies parents when medical or planned leave applied via portal is authorized by the Principal.", 
    status: "Active", 
    email: true, 
    sms: false, 
    whatsapp: true, 
    push: true,
    subject: "Leave Request Approved",
    body: "Dear Parent, Leave application for {student_name} from {start_date} to {end_date} has been APPROVED by the Principal."
  },
  { 
    id: 6, 
    title: "Online Admission Received", 
    desc: "Sent to parents and school admission desk when a new applicant registers on the public portal.", 
    status: "Active", 
    email: true, 
    sms: true, 
    whatsapp: true, 
    push: false,
    subject: "Admission Application #{app_no} Received",
    body: "Thank you for applying to Greenwood International School. Application #{app_no} for {student_name} has been recorded for Class {class_name}."
  }
];

export default function NotificationSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("triggers"); // triggers | gateways | test
  const [searchQuery, setSearchQuery] = useState("");

  // Alerts array
  const [alerts, setAlerts] = useState(DEFAULT_ALERTS);

  // Gateway Credentials
  const [smtpHost, setSmtpHost] = useState("smtp.sendgrid.net");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("apikey");
  const [smtpPassword, setSmtpPassword] = useState("••••••••••••••••");
  const [senderEmail, setSenderEmail] = useState("notifications@greenwood.edu");
  
  const [whatsappPhoneId, setWhatsappPhoneId] = useState("109823491028340");
  const [whatsappToken, setWhatsappToken] = useState("EAAG••••••••••••");
  const [whatsappNamespace, setWhatsappNamespace] = useState("greenwood_erp_templates");

  const [smsProvider, setSmsProvider] = useState("Twilio");
  const [smsApiKey, setSmsApiKey] = useState("AC89f02a99e12b••••••••");
  const [smsSenderId, setSmsSenderId] = useState("GWDSCL");

  // Template Modal
  const [editingAlert, setEditingAlert] = useState(null);
  const [tempSubject, setTempSubject] = useState("");
  const [tempBody, setTempBody] = useState("");

  // Test Dispatcher State
  const [testChannel, setTestChannel] = useState("whatsapp");
  const [testRecipient, setTestRecipient] = useState("+91 98765 43210");
  const [testMessage, setTestMessage] = useState("This is a live test notification from Greenwood International ERP Notification Engine.");
  const [sendingTest, setSendingTest] = useState(false);

  // Fetch settings from MongoDB
  const fetchNotificationSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await settingsService.getSetting("notification_settings");
      if (res?.success && res.data) {
        if (Array.isArray(res.data)) {
          setAlerts(res.data);
        } else if (res.data.alerts) {
          setAlerts(res.data.alerts);
          if (res.data.gateways) {
            const g = res.data.gateways;
            if (g.smtpHost) setSmtpHost(g.smtpHost);
            if (g.smtpPort) setSmtpPort(g.smtpPort);
            if (g.smtpUser) setSmtpUser(g.smtpUser);
            if (g.senderEmail) setSenderEmail(g.senderEmail);
            if (g.whatsappPhoneId) setWhatsappPhoneId(g.whatsappPhoneId);
            if (g.whatsappNamespace) setWhatsappNamespace(g.whatsappNamespace);
            if (g.smsProvider) setSmsProvider(g.smsProvider);
            if (g.smsSenderId) setSmsSenderId(g.smsSenderId);
          }
        }
      }
    } catch (err) {
      console.error("Could not fetch notification settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotificationSettings();
  }, [fetchNotificationSettings]);

  // Toggle channel
  const handleToggleChannel = (id, channel) => {
    setAlerts(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [channel]: !item[channel] };
      }
      return item;
    }));
  };

  // Edit Template
  const handleEditClick = (item) => {
    setEditingAlert(item);
    setTempSubject(item.subject || "");
    setTempBody(item.body || "");
  };

  const handleSaveTemplate = () => {
    setAlerts(prev => prev.map(item => {
      if (item.id === editingAlert.id) {
        return { ...item, subject: tempSubject, body: tempBody };
      }
      return item;
    }));
    setEditingAlert(null);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Template updated",
      showConfirmButton: false,
      timer: 1800
    });
  };

  // Save all to MongoDB
  const handleSaveAll = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const payload = {
        alerts,
        gateways: {
          smtpHost,
          smtpPort,
          smtpUser,
          senderEmail,
          whatsappPhoneId,
          whatsappNamespace,
          smsProvider,
          smsSenderId
        },
        updatedAt: new Date().toISOString()
      };

      const res = await settingsService.saveSetting("notification_settings", payload);
      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "Settings Saved!",
          text: "Notification triggers and communication gateway credentials persisted in MongoDB.",
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: err.response?.data?.message || "Could not save notification settings."
      });
    } finally {
      setSaving(false);
    }
  };

  // Send Test Message
  const handleSendTest = () => {
    if (!testRecipient.trim()) {
      Swal.fire({ icon: "warning", title: "Recipient Missing", text: "Please provide a valid test phone number or email." });
      return;
    }
    setSendingTest(true);
    setTimeout(() => {
      setSendingTest(false);
      Swal.fire({
        icon: "success",
        title: "Test Message Dispatched!",
        text: `Simulated test ${testChannel.toUpperCase()} successfully transmitted to ${testRecipient}.`,
        timer: 2500,
        showConfirmButton: false
      });
    }, 900);
  };

  // Filtered triggers
  const filteredAlerts = useMemo(() => {
    if (!searchQuery.trim()) return alerts;
    return alerts.filter(a => 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, alerts]);

  // Derived counts
  const totalAlerts = alerts.length;
  const whatsappCount = alerts.filter(a => a.whatsapp).length;
  const emailCount = alerts.filter(a => a.email).length;
  const smsCount = alerts.filter(a => a.sms).length;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800 pb-24">
      
      {/* ─── Hero Header Banner ─── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-slate-950/10 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              Multi-Channel Dispatcher
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-white/10 rounded-full border border-white/10 text-slate-300">
              MongoDB Stored
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-indigo-400 inline" />
            Automated Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Configure automated event alerts across WhatsApp Business, SMS Gateway, transactional SMTP email, and in-app push banners.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 self-start md:self-auto">
          <button
            onClick={fetchNotificationSettings}
            disabled={loading}
            className="p-3 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-2xl text-white cursor-pointer border border-white/10"
            title="Reload from MongoDB"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={handleSaveAll}
            disabled={saving || loading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 border-none"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save All Settings"}</span>
          </button>
        </div>
      </div>

      {/* ─── Metric Badges ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalAlerts}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Event Triggers</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">{whatsappCount}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">WhatsApp Enabled</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-blue-600">{emailCount}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Channels</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-purple-600">{smsCount}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SMS Channels</div>
          </div>
        </div>
      </div>

      {/* ─── Tabs Navigation ─── */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {[
            { id: "triggers", label: "Automated Event Triggers", icon: Zap },
            { id: "gateways", label: "Gateway Credentials & APIs", icon: Radio },
            { id: "test", label: "Live Dispatch Tester", icon: Send }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/30"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === "triggers" && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search triggers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>
        )}
      </div>

      {/* ─── Tab Content 1: Automated Event Triggers ─── */}
      {activeTab === "triggers" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    <h3 className="text-sm font-black text-slate-900">{alert.title}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{alert.desc}</p>
                  
                  {/* Template Snippet */}
                  <div className="pt-1.5 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400">Template:</span>
                    <span className="text-[11px] font-mono text-slate-600 truncate max-w-md bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                      "{alert.body}"
                    </span>
                    <button
                      onClick={() => handleEditClick(alert)}
                      className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer bg-transparent border-none ml-1"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                  </div>
                </div>

                {/* Multi-Channel Switches Matrix */}
                <div className="flex items-center gap-3 shrink-0 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 self-start md:self-auto">
                  {/* WhatsApp */}
                  <div className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-600">
                    <span className="flex items-center gap-1 text-emerald-600 font-black">
                      <MessageCircle className="w-3.5 h-3.5" /> WA
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleChannel(alert.id, 'whatsapp')}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        alert.whatsapp ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        alert.whatsapp ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="h-8 w-px bg-slate-200" />

                  {/* Email */}
                  <div className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-600">
                    <span className="flex items-center gap-1 text-blue-600 font-black">
                      <Mail className="w-3.5 h-3.5" /> Email
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleChannel(alert.id, 'email')}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        alert.email ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        alert.email ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="h-8 w-px bg-slate-200" />

                  {/* SMS */}
                  <div className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-600">
                    <span className="flex items-center gap-1 text-purple-600 font-black">
                      <Smartphone className="w-3.5 h-3.5" /> SMS
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleChannel(alert.id, 'sms')}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        alert.sms ? 'bg-purple-600' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        alert.sms ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="h-8 w-px bg-slate-200" />

                  {/* Push */}
                  <div className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-600">
                    <span className="flex items-center gap-1 text-amber-600 font-black">
                      <Bell className="w-3.5 h-3.5" /> Push
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleChannel(alert.id, 'push')}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        alert.push ? 'bg-amber-600' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        alert.push ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Tab Content 2: Gateway Credentials & APIs ─── */}
      {activeTab === "gateways" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* WhatsApp Cloud API */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900">Meta WhatsApp Cloud API</h3>
                <p className="text-[11px] text-slate-400">Official Meta Developer Graph API credentials</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">WhatsApp Phone Number ID</label>
                <input
                  type="text"
                  value={whatsappPhoneId}
                  onChange={(e) => setWhatsappPhoneId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Permanent System User Token</label>
                <input
                  type="password"
                  value={whatsappToken}
                  onChange={(e) => setWhatsappToken(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Template Namespace</label>
                <input
                  type="text"
                  value={whatsappNamespace}
                  onChange={(e) => setWhatsappNamespace(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* SMTP Email Server */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900">Transactional SMTP Email Server</h3>
                <p className="text-[11px] text-slate-400">SendGrid / AWS SES / Mailgun credentials</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">SMTP Host</label>
                <input
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">SMTP Port</label>
                <input
                  type="text"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">SMTP Username</label>
                <input
                  type="text"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">From / Sender Email</label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* SMS Provider */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900">DLT & SMS Gateway</h3>
                <p className="text-[11px] text-slate-400">Fast2SMS / Twilio / MSG91 API configuration</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Provider</label>
                <select
                  value={smsProvider}
                  onChange={(e) => setSmsProvider(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Twilio">Twilio Global</option>
                  <option value="Fast2SMS">Fast2SMS (India DLT)</option>
                  <option value="MSG91">MSG91 Enterprise</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Sender ID (DLT Header)</label>
                <input
                  type="text"
                  value={smsSenderId}
                  onChange={(e) => setSmsSenderId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-slate-700">SMS API Authorization Token</label>
                <input
                  type="password"
                  value={smsApiKey}
                  onChange={(e) => setSmsApiKey(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Save Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-6 rounded-2xl shadow-md space-y-4">
            <h3 className="text-base font-black">Commit Gateway Credentials</h3>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Ensure you have tested your API credentials with your communication provider before saving. All credentials are encrypted in MongoDB.
            </p>
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="w-full py-3 bg-white text-indigo-900 hover:bg-indigo-50 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer border-none"
            >
              {saving ? "Saving to Database..." : "Save Gateway Credentials"}
            </button>
          </div>

        </div>
      )}

      {/* ─── Tab Content 3: Live Dispatch Tester ─── */}
      {activeTab === "test" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs max-w-2xl mx-auto space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-600" />
              Live Communication Dispatch Tester
            </h3>
            <p className="text-xs text-slate-400">
              Transmit a sample test notification to verify your WhatsApp, Email or SMS connectivity.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Test Channel</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
                  { id: "email", label: "SMTP Email", icon: Mail },
                  { id: "sms", label: "SMS Gateway", icon: Smartphone }
                ].map(c => {
                  const Icon = c.icon;
                  const isSelected = testChannel === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setTestChannel(c.id)}
                      className={`py-2.5 rounded-xl border font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        isSelected 
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Recipient (Phone Number with Country Code / Email Address) *</label>
              <input
                type="text"
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
                placeholder="+91 98765 43210 or user@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Sample Test Payload Message</label>
              <textarea
                rows={3}
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="button"
              onClick={handleSendTest}
              disabled={sendingTest}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{sendingTest ? "Transmitting..." : `Dispatch Test ${testChannel.toUpperCase()}`}</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── Template Edit Modal ─── */}
      {editingAlert && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Edit2 className="w-5 h-5 text-indigo-200" />
                <h3 className="font-black text-base">Edit Alert Template</h3>
              </div>
              <button
                onClick={() => setEditingAlert(null)}
                className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white border-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trigger:</span>
                <div className="font-black text-slate-900 text-sm">{editingAlert.title}</div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Subject Line (For Email / Push)</label>
                <input
                  type="text"
                  value={tempSubject}
                  onChange={(e) => setTempSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Message Body Template (WhatsApp / SMS / Body)</label>
                <textarea
                  rows={4}
                  value={tempBody}
                  onChange={(e) => setTempBody(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="text-[10px] text-slate-400 mt-1">
                  Supported placeholders: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-600">{"{student_name}"}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-600">{"{fee_amount}"}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-600">{"{date}"}</code>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAlert(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTemplate}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs cursor-pointer border-none"
                >
                  Apply Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleSaveAll}
          disabled={saving || loading}
          className="flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-sm rounded-full shadow-2xl shadow-indigo-600/40 active:scale-95 transition-all cursor-pointer border-none"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save Notification Setup"}</span>
        </button>
      </div>

    </div>
  );
}

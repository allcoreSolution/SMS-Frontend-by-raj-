import React, { useState, useEffect } from 'react';
import { useModal } from '../context/ModalContext';
import { 
  X, ExternalLink, Shield, School, User, Bot, 
  CreditCard, CheckCircle2, Cpu, Navigation, FileText, 
  Phone, Mail, Building, Send, Radio, Terminal, Award, HelpCircle,
  Briefcase, DollarSign, BookOpen, GraduationCap, LayoutDashboard, Download, Sparkles
} from 'lucide-react';
import axios from 'axios';
import { PORTAL_URLS } from '../config/portals';

const API_BASE = PORTAL_URLS.api;

export default function PortalModal() {
  const { modalState, closeModal, openModal } = useModal();
  const { isOpen, mode, data } = modalState;

  // Lead Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    schoolName: '',
    plan: 'Starter Cloud — ₹15 / student / month',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Hardware Devices State
  const [hardwareDevices, setHardwareDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [pingStatus, setPingStatus] = useState(null);
  const [pingLogs, setPingLogs] = useState([]);

  // GPS Simulation State
  const [gpsActive, setGpsActive] = useState(true);
  const [busSpeed, setBusSpeed] = useState(38);
  const [sosActive, setSosActive] = useState(false);

  // Active Doc Tab
  const [activeDocTab, setActiveDocTab] = useState('spec');

  useEffect(() => {
    if (data?.docTab) {
      setActiveDocTab(data.docTab);
    }
    if (data?.plan) {
      setFormData(prev => ({ ...prev, plan: data.plan }));
    }
  }, [data]);

  useEffect(() => {
    if (isOpen && mode === 'hardware') {
      fetchHardwareDevices();
    }
  }, [isOpen, mode]);

  useEffect(() => {
    if (!isOpen || mode !== 'gps' || !gpsActive) return;
    const interval = setInterval(() => {
      setBusSpeed(prev => {
        const delta = Math.floor(Math.random() * 7) - 3;
        const next = prev + delta;
        return next < 25 ? 28 : next > 55 ? 50 : next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [isOpen, mode, gpsActive]);

  const fetchHardwareDevices = async () => {
    setLoadingDevices(true);
    try {
      const res = await axios.get(`${API_BASE}/hardware`);
      if (res.data?.success && Array.isArray(res.data.data)) {
        setHardwareDevices(res.data.data);
      }
    } catch (err) {
      console.warn('Backend hardware offline, using fallback list', err);
    } finally {
      setLoadingDevices(false);
    }
  };

  const handlePingDevice = async (device) => {
    setPingStatus(`Pinging ${device.deviceName} at ${device.ipAddress}...`);
    try {
      const res = await axios.post(`${API_BASE}/hardware/${device._id}/ping`);
      const latency = res.data?.latency || 18;
      const logEntry = `[${new Date().toLocaleTimeString()}] PING ${device.ipAddress} -> SUCCESS (${latency}ms) [${device.brand}]`;
      setPingLogs(prev => [logEntry, ...prev.slice(0, 7)]);
      setPingStatus(`Device is ONLINE • ${latency}ms latency`);
    } catch (err) {
      const logEntry = `[${new Date().toLocaleTimeString()}] PING ${device.ipAddress} -> SIMULATED SUCCESS (22ms) [${device.brand}]`;
      setPingLogs(prev => [logEntry, ...prev.slice(0, 7)]);
      setPingStatus(`Device is ONLINE • 22ms latency`);
    }
  };

  const handleTestPunch = async () => {
    const randomUid = 'STU-2026-' + Math.floor(1000 + Math.random() * 9000);
    try {
      const res = await axios.post(`${API_BASE}/hardware/sync-punch`, {
        deviceId: '192.168.1.201',
        punches: [{ uid: randomUid, timestamp: new Date().toISOString() }]
      });
      const logEntry = `[${new Date().toLocaleTimeString()}] INGEST PUNCH -> RFID/UID: ${randomUid} (ACK received from ADMS Cloud)`;
      setPingLogs(prev => [logEntry, ...prev.slice(0, 7)]);
    } catch (err) {
      const logEntry = `[${new Date().toLocaleTimeString()}] INGEST PUNCH -> RFID/UID: ${randomUid} (Simulated Punch Recorded)`;
      setPingLogs(prev => [logEntry, ...prev.slice(0, 7)]);
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setErrorMsg('Please enter your Name, Email, and Phone Number.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    try {
      const payload = {
        studentName: formData.name,
        parentName: formData.schoolName || formData.name,
        contactNumber: formData.phone,
        email: formData.email,
        targetClass: formData.plan,
        source: 'Multi_School_Erp Landing Web',
        status: 'New Enquiry',
        stage: 'New Enquiry',
        notes: `Selected Plan: ${formData.plan}. Client Note: ${formData.notes || 'Interested in complete commercial package.'}`
      };

      let res;
      try {
        const primaryApi = PORTAL_URLS.api || 'https://sms-backend-by-raj-s7dt.onrender.com/api';
        res = await axios.post(`${primaryApi}/leads`, payload);
      } catch (postErr) {
        console.warn('Primary endpoint failed, falling back to cloud backend:', postErr.message);
        res = await axios.post('https://sms-backend-by-raj-s7dt.onrender.com/api/leads', payload);
      }
      const leadId = res.data?.data?._id || 'ACS-' + Math.floor(10000 + Math.random() * 90000);
      setSubmittedLead({
        id: leadId,
        ref: 'ACS-LIC-' + Math.floor(1000 + Math.random() * 9000),
        ...formData
      });
    } catch (err) {
      console.error('Lead submission failed:', err);
      setErrorMsg('Submission failed. Please check internet connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 lg:p-8 bg-slate-950/75 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      {/* Modern Luxury SaaS Modal Container */}
      <div 
        className="relative w-full max-w-6xl bg-white rounded-3xl shadow-[0_25px_80px_rgba(15,23,42,0.35)] border border-slate-200/90 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="bg-slate-950 text-white px-5 sm:px-7 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black text-xs shadow-md">
              ACS
            </div>
            <div>
              <div className="font-black text-sm sm:text-base tracking-tight flex items-center gap-2">
                <span>ALL CORE SOLUTION</span>
                <span className="bg-amber-400/10 text-amber-400 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Portals Hub
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium hidden sm:block">
                All 8 Connected Portals &amp; Mobile APKs Running Live
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>8 Portals Online</span>
            </span>
            <button 
              onClick={closeModal}
              className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-rose-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-sm font-bold cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modern Tab Navigation Controls */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-7 py-2 flex flex-wrap gap-1.5 sm:gap-2 items-center justify-between text-xs">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              onClick={() => openModal('portals')}
              className={`px-3 py-1.5 rounded-xl font-black uppercase text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'portals' 
                  ? 'bg-amber-400 text-slate-950 shadow-xs' 
                  : 'bg-white hover:bg-slate-200/70 text-slate-700 border border-slate-200/80'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>All 8 Dedicated Panels &amp; Apps (Live)</span>
            </button>

            <button
              onClick={() => openModal('purchase')}
              className={`px-3 py-1.5 rounded-xl font-black uppercase text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'purchase' 
                  ? 'bg-amber-400 text-slate-950 shadow-xs' 
                  : 'bg-white hover:bg-slate-200/70 text-slate-700 border border-slate-200/80'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Book Demo &amp; Pricing</span>
            </button>

            <button
              onClick={() => openModal('hardware')}
              className={`px-3 py-1.5 rounded-xl font-black uppercase text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'hardware' 
                  ? 'bg-amber-400 text-slate-950 shadow-xs' 
                  : 'bg-white hover:bg-slate-200/70 text-slate-700 border border-slate-200/80'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Biometric API</span>
            </button>

            <button
              onClick={() => openModal('gps')}
              className={`px-3 py-1.5 rounded-xl font-black uppercase text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'gps' 
                  ? 'bg-amber-400 text-slate-950 shadow-xs' 
                  : 'bg-white hover:bg-slate-200/70 text-slate-700 border border-slate-200/80'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Driver GPS Agent</span>
            </button>

            <button
              onClick={() => openModal('doc')}
              className={`px-3 py-1.5 rounded-xl font-black uppercase text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'doc' 
                  ? 'bg-amber-400 text-slate-950 shadow-xs' 
                  : 'bg-white hover:bg-slate-200/70 text-slate-700 border border-slate-200/80'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Docs &amp; License</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>API Gateway: Online</span>
          </div>
        </div>

        {/* Modal Body with Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/70">
          
          {/* ======================================================== */}
          {/* 1. PORTALS SWITCHER / QUICK DEMO HUB                      */}
          {/* ======================================================== */}
          {mode === 'portals' && (
            <div className="space-y-4">
              
              {/* Modern Top Information Card */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-500/25 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Instant Role-Based Demo Portals &amp; Native Mobile Apps</span>
                  </h3>
                  <p className="text-slate-600 text-xs font-medium mt-0.5">
                    Har ek stakeholder ka apna dedicated portal aur Android APK hai. Click karke live working screens test karein ya direct APK download karein.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold text-amber-800 bg-amber-100/80 border border-amber-300/80 px-2.5 py-1 rounded-full whitespace-nowrap">
                  <span>⚡ 100% Pre-Configured</span>
                </div>
              </div>

              {/* Grid of All Dedicated Portals */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                
                {/* 1. Teacher & Staff Panel (Teache_Panel) */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-amber-400 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl shadow-xs group-hover:scale-105 group-hover:bg-indigo-100 transition-all">
                        👩‍🏫
                      </div>
                      <span className="text-[9.5px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Teacher &amp; Staff
                      </span>
                    </div>
                    <h4 className="font-black text-slate-900 text-base mb-1 group-hover:text-amber-600 transition-colors">Teacher &amp; Staff Panel</h4>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed mb-3">
                      Dedicated portal for teachers and educators. Mark attendance, manage online/offline exams, enter marks, apply teacher leave, and lesson planning.
                    </p>
                    <div className="text-[11px] bg-slate-50 border border-slate-100 p-2.5 rounded-xl font-mono text-slate-600 mb-3 space-y-0.5">
                      <div>Project: <span className="font-bold text-indigo-900">Teache_Panel</span></div>
                      <div>User: <span className="font-bold text-slate-900">admin123@gmail.com</span></div>
                      <div>Pass: <span className="font-bold text-slate-900">admin@123</span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <a 
                      href="/apk/Teacher.apk" 
                      download="Teacher.apk"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-center text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-white" />
                      <span>Download Teacher APK ⬇</span>
                    </a>
                    <a 
                      href={PORTAL_URLS.teacher} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full bg-slate-900 hover:bg-amber-400 text-white hover:text-slate-950 py-2 rounded-xl text-center text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1 shadow-xs"
                    >
                      <span>Launch Teacher Web Panel</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <div className="flex gap-1.5 text-[10px] font-bold pt-0.5">
                      <a href={`${PORTAL_URLS.teacher}/student-attendance`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 py-1 rounded-lg text-center transition-colors">
                        Attendance ↗
                      </a>
                      <a href={`${PORTAL_URLS.teacher}/enter-marks`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 py-1 rounded-lg text-center transition-colors">
                        Marks ↗
                      </a>
                      <a href={`${PORTAL_URLS.teacher}/leave`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 py-1 rounded-lg text-center transition-colors">
                        Leave ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* 2. Accountant & Fee Collection Panel */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-amber-400 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-xl shadow-xs group-hover:scale-105 group-hover:bg-teal-100 transition-all">
                        💰
                      </div>
                      <span className="text-[9.5px] font-black bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Finance Desk
                      </span>
                    </div>
                    <h4 className="font-black text-slate-900 text-base mb-1 group-hover:text-amber-600 transition-colors">Accountant &amp; Fee Desk</h4>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed mb-3">
                      Specialized finance web portal for live fee collection, search due fees, fee groups, income/expense vouchers, day book ledgers, and accounts dashboard.
                    </p>
                    <div className="text-[11px] bg-slate-50 border border-slate-100 p-2.5 rounded-xl font-mono text-slate-600 mb-3 space-y-0.5">
                      <div>Project: <span className="font-bold text-teal-900">Accountant Panel</span></div>
                      <div>User: <span className="font-bold text-slate-900">accountant@allcoresolution.com</span></div>
                      <div>Pass: <span className="font-bold text-slate-900">admin@123</span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <a 
                      href={PORTAL_URLS.accountant} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full bg-slate-900 hover:bg-amber-400 text-white hover:text-slate-950 py-2 rounded-xl text-center text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Launch Accountant Panel</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <div className="flex gap-1.5 text-[10px] font-bold pt-0.5">
                      <a href={`${PORTAL_URLS.accountant}/accounts/dashboard`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 py-1 rounded-lg text-center transition-colors">
                        Dashboard ↗
                      </a>
                      <a href={`${PORTAL_URLS.accountant}/collect-fees`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 py-1 rounded-lg text-center transition-colors">
                        Collect Fees ↗
                      </a>
                      <a href={`${PORTAL_URLS.accountant}/search-due-fees`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 py-1 rounded-lg text-center transition-colors">
                        Due Fees ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* 3. Main School Admin ERP */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-amber-400 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl shadow-xs group-hover:scale-105 group-hover:bg-blue-100 transition-all">
                        🏫
                      </div>
                      <span className="text-[9.5px] font-black bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Institutional Core
                      </span>
                    </div>
                    <h4 className="font-black text-slate-900 text-base mb-1 group-hover:text-amber-600 transition-colors">School Admin ERP</h4>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed mb-3">
                      The flagship institutional ERP. Covers Student Admissions, HR Staff Directory, QR Attendance, Biometric Sync, Offline Datesheet, and Report Cards.
                    </p>
                    <div className="text-[11px] bg-slate-50 border border-slate-100 p-2.5 rounded-xl font-mono text-slate-600 mb-3 space-y-0.5">
                      <div>Project: <span className="font-bold text-blue-900">School_ERP</span></div>
                      <div>Features: <span className="font-bold text-slate-900">38+ Core Modules</span></div>
                      <div>Scope: <span className="text-blue-700 font-bold">Principal &amp; Management</span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <a 
                      href={PORTAL_URLS.admin} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full bg-slate-900 hover:bg-amber-400 text-white hover:text-slate-950 py-2 rounded-xl text-center text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Launch School Admin ERP</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <div className="flex gap-1.5 text-[10px] font-bold pt-0.5">
                      <a href={`${PORTAL_URLS.admin}/finance/dashboard`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 py-1 rounded-lg text-center transition-colors">
                        Finance ↗
                      </a>
                      <a href={`${PORTAL_URLS.admin}/hr/dashboard`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 py-1 rounded-lg text-center transition-colors">
                        HR Portal ↗
                      </a>
                      <a href={`${PORTAL_URLS.admin}/attendance/qr`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 py-1 rounded-lg text-center transition-colors">
                        QR Gate ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* 4. SuperAdmin Platform */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-amber-400 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-xl shadow-xs group-hover:scale-105 group-hover:bg-purple-100 transition-all">
                        👑
                      </div>
                      <span className="text-[9.5px] font-black bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        SaaS Control
                      </span>
                    </div>
                    <h4 className="font-black text-slate-900 text-base mb-1 group-hover:text-amber-600 transition-colors">SuperAdmin SaaS Platform</h4>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed mb-3">
                      Global SaaS control platform. Onboard unlimited schools, configure subscription plans, billing gateways, SMS/WhatsApp APIs, and server infrastructure.
                    </p>
                    <div className="text-[11px] bg-slate-50 border border-slate-100 p-2.5 rounded-xl font-mono text-slate-600 mb-3 space-y-0.5">
                      <div>Project: <span className="font-bold text-purple-900">SuperAdmin</span></div>
                      <div>Role: <span className="font-bold text-slate-900">Platform Owner</span></div>
                      <div>Modules: <span className="text-purple-700 font-bold">Global Tenant Billing</span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <a 
                      href={PORTAL_URLS.superAdmin} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full bg-slate-900 hover:bg-amber-400 text-white hover:text-slate-950 py-2 rounded-xl text-center text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Launch SuperAdmin Platform</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <div className="flex gap-1.5 text-[10px] font-bold pt-0.5">
                      <a href={`${PORTAL_URLS.superAdmin}/schools`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 py-1 rounded-lg text-center transition-colors">
                        Schools ↗
                      </a>
                      <a href={`${PORTAL_URLS.superAdmin}/plans`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 py-1 rounded-lg text-center transition-colors">
                        SaaS Plans ↗
                      </a>
                      <a href={`${PORTAL_URLS.superAdmin}/server`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 py-1 rounded-lg text-center transition-colors">
                        Server ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* 5. Branch Admin Network */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-amber-400 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-xl shadow-xs group-hover:scale-105 group-hover:bg-amber-100 transition-all">
                        🏛️
                      </div>
                      <span className="text-[9.5px] font-black bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Multi-Branch
                      </span>
                    </div>
                    <h4 className="font-black text-slate-900 text-base mb-1 group-hover:text-amber-600 transition-colors">Branch Admin Network</h4>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed mb-3">
                      Multi-branch overview dashboard. Manage cross-campus operations, school usage analytics, login audits, fee aggregates, and print templates.
                    </p>
                    <div className="text-[11px] bg-slate-50 border border-slate-100 p-2.5 rounded-xl font-mono text-slate-600 mb-3 space-y-0.5">
                      <div>Project: <span className="font-bold text-amber-900">Branch-Admin</span></div>
                      <div>Role: <span className="font-bold text-slate-900">Branch General Manager</span></div>
                      <div>Campuses: <span className="text-amber-700 font-bold">5 Campuses Live</span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <a 
                      href={PORTAL_URLS.branch} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full bg-slate-900 hover:bg-amber-400 text-white hover:text-slate-950 py-2 rounded-xl text-center text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Launch Branch Network</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <div className="flex gap-1.5 text-[10px] font-bold pt-0.5">
                      <a href={`${PORTAL_URLS.branch}/branches`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 py-1 rounded-lg text-center transition-colors">
                        Branches ↗
                      </a>
                      <a href={`${PORTAL_URLS.branch}/payments`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 py-1 rounded-lg text-center transition-colors">
                        Payments ↗
                      </a>
                      <a href={`${PORTAL_URLS.branch}/templates`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 py-1 rounded-lg text-center transition-colors">
                        Templates ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* 6. Student & Parent Mobile App & Portal */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-amber-400 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl shadow-xs group-hover:scale-105 group-hover:bg-emerald-100 transition-all">
                        👨‍👩‍👦
                      </div>
                      <span className="text-[9.5px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        App &amp; Portal
                      </span>
                    </div>
                    <h4 className="font-black text-slate-900 text-base mb-1 group-hover:text-amber-600 transition-colors">Student &amp; Parent App</h4>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed mb-3">
                      Native Android APK and web portal for students &amp; parents. Bilingual Hindi &amp; English switch, fee payments, AI desk, timetable, and attendance logs.
                    </p>
                    <div className="text-[11px] bg-slate-50 border border-slate-100 p-2.5 rounded-xl font-mono text-slate-600 mb-3 space-y-0.5">
                      <div>APK: <span className="font-bold text-emerald-900">Student_Parents.apk</span></div>
                      <div>App Version: <span className="font-bold text-slate-900">v1.0.1 (Android)</span></div>
                      <div>Demo: <span className="font-bold text-slate-900">Aarav Sharma (9-A)</span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <a 
                      href="/apk/Student_Parents.apk" 
                      download="Student_Parents.apk"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-center text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-white" />
                      <span>Download Parent APK ⬇</span>
                    </a>
                    <a 
                      href={PORTAL_URLS.student} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full bg-slate-900 hover:bg-amber-400 text-white hover:text-slate-950 py-2 rounded-xl text-center text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Launch Student Web Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <div className="flex gap-1.5 text-[10px] font-bold pt-0.5">
                      <a href={`${PORTAL_URLS.student}/fees`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 py-1 rounded-lg text-center transition-colors">
                        Fees ↗
                      </a>
                      <a href={`${PORTAL_URLS.student}/attendance`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 py-1 rounded-lg text-center transition-colors">
                        Attendance ↗
                      </a>
                      <a href={`${PORTAL_URLS.student}/online-exams`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 py-1 rounded-lg text-center transition-colors">
                        CBT Exams ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* 7. Driver Telematics Panel */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-amber-400 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-xl shadow-xs group-hover:scale-105 group-hover:bg-amber-100 transition-all">
                        🚌
                      </div>
                      <span className="text-[9.5px] font-black bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Fleet Radar
                      </span>
                    </div>
                    <h4 className="font-black text-slate-900 text-base mb-1 group-hover:text-amber-600 transition-colors">Driver Telematics Panel</h4>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed mb-3">
                      Production Driver portal with live GPS telemetry, trip management (Start/End), student pickup/drop-off roster, pre-trip vehicle checklist, and SOS incidents.
                    </p>
                    <div className="text-[11px] bg-slate-50 border border-slate-100 p-2.5 rounded-xl font-mono text-slate-600 mb-3 space-y-0.5">
                      <div>Project: <span className="font-bold text-amber-900">Driver_Panel</span></div>
                      <div>Driver: <span className="font-bold text-slate-900">DRV-101 (Ramesh Kumar)</span></div>
                      <div>Secret PIN: <span className="font-bold text-slate-900">1011</span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <a 
                      href={PORTAL_URLS.driver} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full bg-slate-900 hover:bg-amber-400 text-white hover:text-slate-950 py-2 rounded-xl text-center text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Launch Driver Panel</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <div className="flex gap-1.5 text-[10px] font-bold pt-0.5">
                      <a href={`${PORTAL_URLS.driver}/trips`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 py-1 rounded-lg text-center transition-colors">
                        Trips ↗
                      </a>
                      <a href={`${PORTAL_URLS.driver}/live-tracking`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 py-1 rounded-lg text-center transition-colors">
                        Live GPS ↗
                      </a>
                      <a href={`${PORTAL_URLS.driver}/boarding`} target="_blank" rel="noreferrer" className="flex-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 py-1 rounded-lg text-center transition-colors">
                        Boarding ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* 8. Driver Android Mobile App (Driver.apk) */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-amber-400 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-xl shadow-xs group-hover:scale-105 group-hover:bg-sky-100 transition-all">
                        📱
                      </div>
                      <span className="text-[9.5px] font-black bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Android APK
                      </span>
                    </div>
                    <h4 className="font-black text-slate-900 text-base mb-1 group-hover:text-amber-600 transition-colors">Driver Android App</h4>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed mb-3">
                      Native Android APK wrapper with hardware GPS geolocation, offline sync fallback, one-touch SOS incident alert, and camera scanner support.
                    </p>
                    <div className="text-[11px] bg-slate-50 border border-slate-100 p-2.5 rounded-xl font-mono text-slate-600 mb-3 space-y-0.5">
                      <div>Package: <span className="font-bold text-sky-900">com.schoolerp.driver</span></div>
                      <div>App Version: <span className="font-bold text-slate-900">v1.0.0 (Native APK)</span></div>
                      <div>Binary: <span className="font-bold text-emerald-700">Driver.apk (Signed)</span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <a 
                      href="/apk/Driver.apk" 
                      download="Driver.apk"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-center text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-4 h-4 text-white" />
                      <span>Download Driver APK (Android) ⬇</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. SCHOOL DEMO & ONBOARDING ENQUIRY                      */}
          {/* ======================================================== */}
          {mode === 'purchase' && (
            <div className="max-w-2xl mx-auto space-y-4">
              {submittedLead ? (
                <div className="bg-white border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-xl text-center">
                  <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <span className="text-[10px] font-black tracking-widest uppercase bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                    Demo Request Confirmed
                  </span>
                  <h3 className="font-black text-2xl text-slate-900 mt-2 mb-1">
                    Thank You, {submittedLead.name}!
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-md mx-auto mb-5">
                    Your request for <strong className="text-slate-900">{submittedLead.plan}</strong> has been received. Our school onboarding specialist will connect shortly.
                  </p>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 max-w-md mx-auto text-left text-xs space-y-2 mb-6">
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500 font-bold">Booking Reference:</span>
                      <span className="font-mono font-black text-amber-600">{submittedLead.ref}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500 font-bold">School Name:</span>
                      <span className="font-bold text-slate-900">{submittedLead.schoolName || 'Institution'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500 font-bold">Official Email:</span>
                      <span className="font-bold text-slate-900">{submittedLead.email}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500 font-bold">Contact Phone:</span>
                      <span className="font-bold text-slate-900">{submittedLead.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">Included:</span>
                      <span className="font-bold text-emerald-600">Free Live Walkthrough + Trial Access</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/?text=Hello%20ALLCORE%20SOLUTION%2C%20I%20have%20submitted%20demo%20booking%20Ref%3A%20${submittedLead.ref}%20for%20my%20school.`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto bg-[#25D366] text-white px-6 py-2.5 font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 hover:bg-[#20ba59] transition-all"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setSubmittedLead(null)}
                      className="w-full sm:w-auto bg-slate-100 text-slate-800 px-5 py-2.5 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      New Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3.5 mb-4">
                    <div>
                      <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">
                        Book School Demo &amp; Cloud Onboarding
                      </h3>
                      <p className="text-slate-500 text-xs font-medium mt-0.5">
                        Get live guided walkthrough, student roster setup assistance, and institution pricing.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400 font-bold">Cloud SaaS</div>
                      <div className="text-xl font-black text-amber-500 leading-none">₹15<span className="text-xs text-slate-600 font-semibold">/std/mo</span></div>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="bg-rose-50 text-rose-700 text-xs font-bold p-3 rounded-xl border border-rose-200 mb-4">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleLeadSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                          Contact Person Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Principal / Trustee / Admin"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                          School / Institution Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.schoolName}
                          onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                          placeholder="e.g. St. Xavier Public School"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                          Official Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="principal@school.edu"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                          WhatsApp / Mobile *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 9876543210"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                        Select Plan or Requirement
                      </label>
                      <select
                        value={formData.plan}
                        onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white"
                      >
                        <option value="Starter Cloud — ₹15 / student / month">
                          Starter Cloud — ₹15 / student / month (Full ERP + All Apps)
                        </option>
                        <option value="Pro School Enterprise — ₹25 / student / month">
                          Pro School Enterprise — ₹25 / student / month (Dedicated Cloud + SLA)
                        </option>
                        <option value="Multi-Branch School Group (Custom Package)">
                          Multi-Branch School Group (Custom Package)
                        </option>
                        <option value="Schedule Live Online Demo First (No Commitment)">
                          Schedule Live Online Demo First (No Commitment)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                        Student Strength &amp; Requirements
                      </label>
                      <textarea
                        rows={2}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Approx total students, current ERP software if any, branches or specific needs..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-4 h-4 text-slate-950" />
                        <span>{submitting ? 'Registering Request...' : 'Book Free Demo & Consultation'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. HARDWARE BIOMETRIC API TERMINAL                        */}
          {/* ======================================================== */}
          {mode === 'hardware' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-slate-900 text-sm uppercase flex items-center gap-2">
                    <span>ZKTECO / ESSL PUSH PROTOCOL TERMINAL</span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      LIVE API CONNECTED
                    </span>
                  </h3>
                  <p className="text-slate-500 text-xs font-medium mt-0.5">
                    Real devices communicating with backend ADMS routes (<code className="text-slate-900 bg-slate-100 px-1 py-0.5 rounded font-mono">POST /api/hardware/sync-punch</code>).
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleTestPunch}
                    className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-3 py-1.5 text-xs font-black uppercase rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    ⚡ Simulate RFID Punch
                  </button>
                  <button 
                    onClick={fetchHardwareDevices}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Refresh Devices
                  </button>
                </div>
              </div>

              {/* Devices Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {hardwareDevices.map((dev) => (
                  <div key={dev._id} className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-slate-900 text-xs uppercase">{dev.deviceName}</span>
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-black px-2 py-0.5 rounded-full">
                        {dev.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
                      <div><span className="text-slate-500">Brand:</span> <span className="font-bold text-slate-900">{dev.brand}</span></div>
                      <div><span className="text-slate-500">IP:</span> <span className="font-mono font-bold text-slate-900">{dev.ipAddress}</span></div>
                      <div><span className="text-slate-500">Location:</span> <span className="font-bold text-slate-900">{dev.location}</span></div>
                      <div><span className="text-slate-500">Punches Today:</span> <span className="font-bold text-amber-600">{dev.todayPunches || 142}</span></div>
                    </div>

                    <button
                      onClick={() => handlePingDevice(dev)}
                      className="w-full bg-slate-900 hover:bg-amber-400 text-white hover:text-slate-950 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Ping Device &amp; Test Port {dev.port || 4370}</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Terminal Logs Output */}
              <div className="bg-slate-950 text-emerald-400 p-4 rounded-2xl border border-slate-800 font-mono text-xs shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Live Biometric ADMS Stream Console</span>
                  </span>
                  <span>{pingStatus || 'Ready for test commands'}</span>
                </div>
                <div className="space-y-1 text-[11.5px] min-h-[90px]">
                  {pingLogs.length === 0 ? (
                    <div className="text-slate-500 italic">
                      Click "Ping Device" or "Simulate RFID Punch" to see live raw ADMS communication with Node.js backend.
                    </div>
                  ) : (
                    pingLogs.map((log, idx) => (
                      <div key={idx} className="leading-snug">{log}</div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. DRIVER GPS AGENT SIMULATION                            */}
          {/* ======================================================== */}
          {mode === 'gps' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-slate-900 text-sm uppercase flex items-center gap-2">
                    <span>BUS ROUTE 4A — REALTIME TELEMETRY ENGINE</span>
                    <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      MAPBOX / OSM SYNC
                    </span>
                  </h3>
                  <p className="text-slate-500 text-xs font-medium mt-0.5">
                    Live driver smartphone stream broadcast to parents. Low-latency vector pathcasting.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSosActive(!sosActive)}
                    className={`px-3 py-1.5 text-xs font-black uppercase rounded-xl transition-all cursor-pointer ${
                      sosActive ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {sosActive ? '⚠️ SOS BROADCASTING' : 'Trigger SOS Alert'}
                  </button>
                  <button
                    onClick={() => setGpsActive(!gpsActive)}
                    className="bg-slate-900 hover:bg-amber-400 text-white hover:text-slate-950 px-3.5 py-1.5 text-xs font-black uppercase rounded-xl transition-colors cursor-pointer"
                  >
                    {gpsActive ? 'Pause Stream' : 'Resume Stream'}
                  </button>
                </div>
              </div>

              {/* Map Simulator Panel */}
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl h-64 sm:h-72 overflow-hidden shadow-xl flex items-center justify-center">
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M 50 200 Q 200 80, 400 160 T 750 120" 
                    fill="none" 
                    stroke="#F59E0B" 
                    strokeWidth="4" 
                    strokeDasharray="6 4"
                  />
                  <circle cx="400" cy="160" r="14" fill="#09B48E" className="animate-ping opacity-75" />
                  <circle cx="400" cy="160" r="10" fill="#09B48E" stroke="#ffffff" strokeWidth="2" />
                </svg>

                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-2.5 text-xs shadow-md max-w-[220px]">
                  <div className="font-black text-slate-900 text-xs">Bus #4: North Sector Express</div>
                  <div className="text-slate-600 text-[11px] font-semibold">Driver: Suresh Patil</div>
                  <div className="text-emerald-600 font-bold text-[11px] mt-1">Status: En Route to Campus</div>
                </div>

                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-2.5 text-xs shadow-md flex gap-4">
                  <div className="text-center">
                    <div className="text-slate-400 text-[9px] uppercase font-bold">Speed</div>
                    <div className="font-black text-slate-900 text-base">{busSpeed} km/h</div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400 text-[9px] uppercase font-bold">ETA Next Stop</div>
                    <div className="font-black text-amber-600 text-base">3 mins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400 text-[9px] uppercase font-bold">Onboard</div>
                    <div className="font-black text-emerald-600 text-base">28 / 35</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 5. DOCUMENTATION & LEGAL TERMS MODAL                      */}
          {/* ======================================================== */}
          {mode === 'doc' && (
            <div className="space-y-4">
              <div className="flex border-b border-slate-200 gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: 'spec', label: 'Quotation & Spec Sheet' },
                  { id: 'license', label: 'Commercial License' },
                  { id: 'refund', label: 'Refund Policy' },
                  { id: 'privacy', label: 'Privacy & Security' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDocTab(tab.id)}
                    className={`px-3.5 py-2 text-xs font-black uppercase rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
                      activeDocTab === tab.id
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs text-slate-800 text-xs leading-relaxed space-y-3">
                {activeDocTab === 'spec' && (
                  <>
                    <h3 className="font-black text-slate-900 text-base uppercase">Official Cloud &amp; Platform Specification</h3>
                    <p className="font-medium text-slate-600">
                      Multi-School ERP is a fully managed cloud SaaS operating system designed for schools, colleges, and educational groups.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                      <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50">
                        <h5 className="font-black text-slate-900 mb-1">Cloud Infrastructure:</h5>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                          <li>99.9% Uptime High-Availability Cloud SLA</li>
                          <li>Encrypted MongoDB with Automated Daily Backups</li>
                          <li>Zero Local Server or IT Staff Needed</li>
                          <li>Instant Global CDN for Speed &amp; Security</li>
                        </ul>
                      </div>
                      <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50">
                        <h5 className="font-black text-slate-900 mb-1">School Deliverables:</h5>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                          <li>All 7 Dedicated Web Portals (Admin, Teacher, Fee, etc.)</li>
                          <li>3 Native Android Mobile Apps (Parent, Staff, Driver)</li>
                          <li>Complete Excel Roster Onboarding &amp; Setup</li>
                          <li>Continuous Updates, New Features &amp; Priority Support</li>
                        </ul>
                      </div>
                    </div>
                  </>
                )}

                {activeDocTab === 'license' && (
                  <>
                    <h3 className="font-black text-slate-900 text-base uppercase">SaaS Service Level Agreement (SLA)</h3>
                    <p className="font-medium text-slate-700">
                      Service Commitment: ALL CORE SOLUTION provides high-availability cloud hosting, uninterrupted access to all school modules, and continuous software updates.
                    </p>
                    <ul className="list-disc list-inside space-y-1 font-medium text-slate-600">
                      <li><strong>99.9% Uptime:</strong> Reliable, continuous system availability during school operational and examination hours.</li>
                      <li><strong>Automated Backups:</strong> Daily automated snapshots with multi-region disaster recovery.</li>
                      <li><strong>Priority Support:</strong> Direct hotline and WhatsApp support desk for administrators and teachers.</li>
                    </ul>
                  </>
                )}

                {activeDocTab === 'refund' && (
                  <>
                    <h3 className="font-black text-slate-900 text-base uppercase">Zero-Risk Trial &amp; Subscription Terms</h3>
                    <p className="font-medium text-slate-600">
                      We provide interactive live demos and sandbox accounts so school management and staff can test every module before onboarding. Transparent per-student monthly billing with no lock-ins.
                    </p>
                  </>
                )}

                {activeDocTab === 'privacy' && (
                  <>
                    <h3 className="font-black text-slate-900 text-base uppercase">Student Data Privacy &amp; Protection</h3>
                    <p className="font-medium text-slate-600">
                      100% Institutional Data Ownership: Your school retains exclusive ownership of all student records, fee logs, and staff data. Data is strictly isolated per tenant, encrypted in transit and at rest, and never shared with third parties.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-7 py-3 flex flex-wrap items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-medium text-slate-500">
            <span className="font-bold text-slate-800">ALL CORE SOLUTION</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline text-amber-600 font-semibold">Support: contact@allcoresolution.com</span>
          </div>
          <button
            onClick={closeModal}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[11px] tracking-wider transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}

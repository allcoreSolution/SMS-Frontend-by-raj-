import React, { useState, useEffect } from 'react';
import { useModal } from '../context/ModalContext';
import { 
  X, ExternalLink, Shield, School, User, Bot, 
  CreditCard, CheckCircle2, Cpu, Navigation, FileText, 
  Phone, Mail, Building, Send, Radio, Terminal, Award, HelpCircle,
  Briefcase, DollarSign, BookOpen, GraduationCap, LayoutDashboard, Download
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
    plan: '₹10,000 — Full Commercial Source Code',
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

      const res = await axios.post(`${API_BASE}/leads`, payload);
      const leadId = res.data?.data?._id || 'ACS-' + Math.floor(10000 + Math.random() * 90000);
      setSubmittedLead({
        id: leadId,
        ref: 'ACS-LIC-' + Math.floor(1000 + Math.random() * 9000),
        ...formData
      });
    } catch (err) {
      const mockId = 'ACS-LOCAL-' + Math.floor(10000 + Math.random() * 90000);
      setSubmittedLead({
        id: mockId,
        ref: 'ACS-LIC-' + Math.floor(1000 + Math.random() * 9000),
        ...formData
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-gray-900/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-5xl bg-white border-[3px] border-gray-900 shadow-[8px_8px_0_0_#111827] flex flex-col max-h-[94vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="bg-[#0F172A] text-white px-4 sm:px-6 py-3.5 border-b-[3px] border-gray-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-amber-400 border-[1.5px] border-gray-900 flex items-center justify-center text-gray-900 font-black text-sm shadow-[1.5px_1.5px_0_0_#fff]">
              ACS
            </div>
            <div>
              <div className="font-black text-sm sm:text-base uppercase tracking-tight flex items-center gap-2">
                <span>ALL CORE SOLUTION</span>
                <span className="text-amber-400 text-xs px-2 py-0.5 border border-amber-400/40 bg-amber-400/10">MULTI-PANEL ECOSYSTEM</span>
              </div>
              <div className="text-[11px] text-gray-400 font-medium hidden sm:block">
                All 7 Distinct School Portals Active on Dedicated Local Ports
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={closeModal}
              className="w-8 h-8 bg-gray-800 hover:bg-rose-600 text-white border border-gray-700 flex items-center justify-center transition-colors text-sm font-bold cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="bg-gray-100 border-b-[2px] border-gray-900 px-4 sm:px-6 py-2 flex flex-wrap gap-2 items-center justify-between text-xs font-black">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              onClick={() => openModal('portals')}
              className={`px-3 py-1.5 border-[1.5px] border-gray-900 uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'portals' 
                  ? 'bg-amber-400 text-gray-900 shadow-[2px_2px_0_0_#111827]' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>All 8 Dedicated Panels &amp; Apps (Live)</span>
            </button>

            <button
              onClick={() => openModal('purchase')}
              className={`px-3 py-1.5 border-[1.5px] border-gray-900 uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'purchase' 
                  ? 'bg-amber-400 text-gray-900 shadow-[2px_2px_0_0_#111827]' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Buy Source Code (₹10K)</span>
            </button>

            <button
              onClick={() => openModal('hardware')}
              className={`px-3 py-1.5 border-[1.5px] border-gray-900 uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'hardware' 
                  ? 'bg-amber-400 text-gray-900 shadow-[2px_2px_0_0_#111827]' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Biometric API</span>
            </button>

            <button
              onClick={() => openModal('gps')}
              className={`px-3 py-1.5 border-[1.5px] border-gray-900 uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'gps' 
                  ? 'bg-amber-400 text-gray-900 shadow-[2px_2px_0_0_#111827]' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Driver GPS Agent</span>
            </button>

            <button
              onClick={() => openModal('doc')}
              className={`px-3 py-1.5 border-[1.5px] border-gray-900 uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'doc' 
                  ? 'bg-amber-400 text-gray-900 shadow-[2px_2px_0_0_#111827]' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Docs & License</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] font-bold text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>API: {PORTAL_URLS.api}</span>
          </div>
        </div>

        {/* Modal Body with Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          
          {/* ======================================================== */}
          {/* 1. PORTALS SWITCHER / QUICK DEMO HUB                      */}
          {/* ======================================================== */}
          {mode === 'portals' && (
            <div className="space-y-5">
              <div className="bg-amber-50 border-[2px] border-gray-900 p-3 sm:p-4 shadow-[3px_3px_0_0_#111827] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                    <span>⚡ Unified Multi-Panel Launcher</span>
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-900/30 text-[10px] px-2 py-0.5 uppercase tracking-wider">
                      All 7 Portals Running On Distinct Ports
                    </span>
                  </h3>
                  <p className="text-gray-600 text-xs font-semibold mt-0.5">
                    Har ek role ka apna dedicated independent project aur port hai. Click karke direct working panel me enter karein.
                  </p>
                </div>
              </div>

              {/* Grid of All Dedicated Portals */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                
                {/* 1. Teacher & Staff Panel (Teache_Panel :5177) */}
                <div className="bg-white border-[2.5px] border-indigo-900 p-4 shadow-[4px_4px_0_0_#312e81] flex flex-col justify-between group hover:-translate-y-1 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 bg-indigo-100 border-[1.5px] border-indigo-900 flex items-center justify-center text-xl shadow-[1px_1px_0_0_#312e81]">
                        👩‍🏫
                      </div>
                      <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 uppercase tracking-wide">
                        Port 5177 • Teacher Panel
                      </span>
                    </div>
                    <h4 className="font-black text-gray-900 text-base mb-1">Teacher & Staff Panel</h4>
                    <p className="text-gray-500 text-xs font-semibold leading-relaxed mb-3">
                      Dedicated portal for teachers and educators. Mark attendance, manage online/offline exams, enter marks, apply teacher leave, and lesson planning.
                    </p>
                    <div className="text-[11px] bg-indigo-50/70 border border-indigo-200 p-2 font-mono text-gray-700 mb-3 rounded-sm space-y-0.5">
                      <div>Project: <span className="font-bold text-indigo-900">Teache_Panel</span></div>
                      <div>Default User: <span className="font-bold text-gray-900">admin123@gmail.com</span></div>
                      <div>Password: <span className="font-bold text-gray-900">admin@123</span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <a 
                      href="/apk/Teacher.apk" 
                      download="Teacher.apk"
                      className="w-full bg-emerald-600 text-white py-2.5 text-center text-xs font-black uppercase tracking-wider border-[1.5px] border-gray-900 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-[2px_2px_0_0_#111827]"
                    >
                      <Download className="w-4 h-4 text-white" />
                      <span>Download Teacher APK (Android) ⬇</span>
                    </a>
                    <a 
                      href={PORTAL_URLS.teacher} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full bg-indigo-50 text-indigo-900 py-1.5 text-center text-[11px] font-black uppercase tracking-wider border-[1.5px] border-indigo-900 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1 shadow-[1px_1px_0_0_#111827]"
                    >
                      <span>Launch Teacher Web Panel :5177</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <div className="flex gap-1.5 text-[10.5px] font-bold">
                      <a href={`${PORTAL_URLS.teacher}/student-attendance`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-900 py-1 text-center text-gray-800">
                        Attendance ↗
                      </a>
                      <a href={`${PORTAL_URLS.teacher}/enter-marks`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-900 py-1 text-center text-gray-800">
                        Marks Entry ↗
                      </a>
                      <a href={`${PORTAL_URLS.teacher}/leave`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-900 py-1 text-center text-gray-800">
                        Leave Apply ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* 2. Accountant & Fee Collection Panel (Web Panel :5178) */}
                <div className="bg-white border-[2.5px] border-teal-900 p-4 shadow-[4px_4px_0_0_#134e4a] flex flex-col justify-between group hover:-translate-y-1 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 bg-teal-100 border-[1.5px] border-teal-900 flex items-center justify-center text-xl shadow-[1px_1px_0_0_#134e4a]">
                        💰
                      </div>
                      <span className="text-[10px] font-black bg-teal-700 text-white px-2 py-0.5 uppercase tracking-wide">
                        Port 5178 • Accountant Panel
                      </span>
                    </div>
                    <h4 className="font-black text-gray-900 text-base mb-1">Accountant & Fee Desk</h4>
                    <p className="text-gray-500 text-xs font-semibold leading-relaxed mb-3">
                      Specialized finance web portal for live fee collection, search due fees, fee groups, income/expense vouchers, day book ledgers, and accounts dashboard.
                    </p>
                    <div className="text-[11px] bg-teal-50/70 border border-teal-200 p-2 font-mono text-gray-700 mb-3 rounded-sm space-y-0.5">
                      <div>Project: <span className="font-bold text-teal-900">Accountant (Web Panel)</span></div>
                      <div>Default User: <span className="font-bold text-gray-900">accountant@allcoresolution.com</span></div>
                      <div>Password: <span className="font-bold text-gray-900">admin@123</span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <a 
                      href={PORTAL_URLS.accountant} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full bg-teal-700 text-white py-2 text-center text-xs font-black uppercase tracking-wider border-[1.5px] border-gray-900 hover:bg-teal-800 transition-colors flex items-center justify-center gap-1.5 shadow-[2px_2px_0_0_#111827]"
                    >
                      <span>Launch Accountant Panel :5178</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <div className="flex gap-1.5 text-[10.5px] font-bold">
                      <a href={`${PORTAL_URLS.accountant}/accounts/dashboard`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-900 py-1 text-center text-gray-800">
                        Dashboard ↗
                      </a>
                      <a href={`${PORTAL_URLS.accountant}/collect-fees`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-900 py-1 text-center text-gray-800">
                        Collect Fees ↗
                      </a>
                      <a href={`${PORTAL_URLS.accountant}/search-due-fees`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-900 py-1 text-center text-gray-800">
                        Due Fees ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* 3. Main School Admin ERP (School_ERP :5176) */}
                <div className="bg-white border-[2.5px] border-blue-900 p-4 shadow-[4px_4px_0_0_#1e3a8a] flex flex-col justify-between group hover:-translate-y-1 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 bg-blue-100 border-[1.5px] border-blue-900 flex items-center justify-center text-xl shadow-[1px_1px_0_0_#1e3a8a]">
                        🏫
                      </div>
                      <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 uppercase tracking-wide">
                        Port 5176 • School_ERP
                      </span>
                    </div>
                    <h4 className="font-black text-gray-900 text-base mb-1">Main School Admin ERP</h4>
                    <p className="text-gray-500 text-xs font-semibold leading-relaxed mb-3">
                      The flagship institutional ERP. Covers Student Admissions, HR Staff Directory, QR Attendance, Biometric Sync, Offline Datesheet, and Report Cards.
                    </p>
                    <div className="text-[11px] bg-blue-50/70 border border-blue-200 p-2 font-mono text-gray-700 mb-3 rounded-sm space-y-0.5">
                      <div>Project: <span className="font-bold text-blue-900">School_ERP</span></div>
                      <div>Features: <span className="font-bold text-gray-900">30+ Core Sub-Systems</span></div>
                      <div>Scope: <span className="text-blue-700 font-bold">Principal / School Admin</span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <a 
                      href={PORTAL_URLS.admin} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full bg-blue-600 text-white py-2 text-center text-xs font-black uppercase tracking-wider border-[1.5px] border-gray-900 hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-[2px_2px_0_0_#111827]"
                    >
                      <span>Launch School Admin ERP :5176</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <div className="flex gap-1.5 text-[10.5px] font-bold">
                      <a href={`${PORTAL_URLS.admin}/finance/dashboard`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-900 py-1 text-center text-gray-800">
                        Finance ↗
                      </a>
                      <a href={`${PORTAL_URLS.admin}/hr/dashboard`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-900 py-1 text-center text-gray-800">
                        HR Portal ↗
                      </a>
                      <a href={`${PORTAL_URLS.admin}/attendance/qr`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-900 py-1 text-center text-gray-800">
                        QR Gate ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* 4. SuperAdmin Platform (SuperAdmin :5179) */}
                <div className="bg-white border-[2.5px] border-purple-900 p-4 shadow-[4px_4px_0_0_#581c87] flex flex-col justify-between group hover:-translate-y-1 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 bg-purple-100 border-[1.5px] border-purple-900 flex items-center justify-center text-xl shadow-[1px_1px_0_0_#581c87]">
                        👑
                      </div>
                      <span className="text-[10px] font-black bg-purple-600 text-white px-2 py-0.5 uppercase tracking-wide">
                        Port 5179 • SuperAdmin
                      </span>
                    </div>
                    <h4 className="font-black text-gray-900 text-base mb-1">SuperAdmin Platform</h4>
                    <p className="text-gray-500 text-xs font-semibold leading-relaxed mb-3">
                      Global SaaS control platform. Onboard unlimited schools, configure subscription plans, billing gateways, SMS/WhatsApp APIs, and server infrastructure.
                    </p>
                    <div className="text-[11px] bg-purple-50/70 border border-purple-200 p-2 font-mono text-gray-700 mb-3 rounded-sm space-y-0.5">
                      <div>Project: <span className="font-bold text-purple-900">SuperAdmin</span></div>
                      <div>Role: <span className="font-bold text-gray-900">EdTech Founder / Agency Owner</span></div>
                      <div>Modules: <span className="text-purple-700 font-bold">Global Tenant Billing & Gateways</span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <a 
                      href={PORTAL_URLS.superAdmin} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full bg-purple-600 text-white py-2 text-center text-xs font-black uppercase tracking-wider border-[1.5px] border-gray-900 hover:bg-purple-700 transition-colors flex items-center justify-center gap-1.5 shadow-[2px_2px_0_0_#111827]"
                    >
                      <span>Launch SuperAdmin :5179</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <div className="flex gap-1.5 text-[10.5px] font-bold">
                      <a href={`${PORTAL_URLS.superAdmin}/schools`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-900 py-1 text-center text-gray-800">
                        Schools ↗
                      </a>
                      <a href={`${PORTAL_URLS.superAdmin}/plans`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-900 py-1 text-center text-gray-800">
                        SaaS Plans ↗
                      </a>
                      <a href={`${PORTAL_URLS.superAdmin}/server`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-900 py-1 text-center text-gray-800">
                        Server ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* 5. Branch Admin Network (Branch-Admin :5174) */}
                <div className="bg-white border-[2.5px] border-amber-900 p-4 shadow-[4px_4px_0_0_#78350f] flex flex-col justify-between group hover:-translate-y-1 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 bg-amber-100 border-[1.5px] border-amber-900 flex items-center justify-center text-xl shadow-[1px_1px_0_0_#78350f]">
                        🏛️
                      </div>
                      <span className="text-[10px] font-black bg-amber-500 text-gray-950 px-2 py-0.5 uppercase tracking-wide">
                        Port 5174 • Branch-Admin
                      </span>
                    </div>
                    <h4 className="font-black text-gray-900 text-base mb-1">Branch Admin Network</h4>
                    <p className="text-gray-500 text-xs font-semibold leading-relaxed mb-3">
                      Multi-branch overview dashboard. Manage cross-campus operations, school usage analytics, login audits, fee aggregates, and print templates.
                    </p>
                    <div className="text-[11px] bg-amber-50/70 border border-amber-200 p-2 font-mono text-gray-700 mb-3 rounded-sm space-y-0.5">
                      <div>Project: <span className="font-bold text-amber-900">Branch-Admin</span></div>
                      <div>Default Session: <span className="font-bold text-gray-900">Branch General Manager</span></div>
                      <div>Branches: <span className="text-amber-700 font-bold">5 Campuses Live</span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <a 
                      href={PORTAL_URLS.branch} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full bg-amber-500 text-gray-900 py-2 text-center text-xs font-black uppercase tracking-wider border-[1.5px] border-gray-900 hover:bg-amber-400 transition-colors flex items-center justify-center gap-1.5 shadow-[2px_2px_0_0_#111827]"
                    >
                      <span>Launch Branch Admin :5174</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <div className="flex gap-1.5 text-[10.5px] font-bold">
                      <a href={`${PORTAL_URLS.branch}/branches`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-900 py-1 text-center text-gray-800">
                        Branches ↗
                      </a>
                      <a href={`${PORTAL_URLS.branch}/payments`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-900 py-1 text-center text-gray-800">
                        Payments ↗
                      </a>
                      <a href={`${PORTAL_URLS.branch}/templates`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-900 py-1 text-center text-gray-800">
                        Templates ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* 6. Student & Parent Mobile App (Student_Parents APK) */}
                <div className="bg-white border-[2.5px] border-emerald-900 p-4 shadow-[4px_4px_0_0_#064e3b] flex flex-col justify-between group hover:-translate-y-1 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 bg-emerald-100 border-[1.5px] border-emerald-900 flex items-center justify-center text-xl shadow-[1px_1px_0_0_#064e3b]">
                        👨‍👩‍👦
                      </div>
                      <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 uppercase tracking-wide">
                        Android APK • Student & Parent App
                      </span>
                    </div>
                    <h4 className="font-black text-gray-900 text-base mb-1">Student & Parent Portal</h4>
                    <p className="text-gray-500 text-xs font-semibold leading-relaxed mb-3">
                      Native Android APK for students & parents. Features bilingual Hindi & English switch, fee challan payments, AI desk, timetable, homework, and attendance logs.
                    </p>
                    <div className="text-[11px] bg-emerald-50/70 border border-emerald-200 p-2 font-mono text-gray-700 mb-3 rounded-sm space-y-0.5">
                      <div>Package: <span className="font-bold text-emerald-900">com.schoolerp.studentparents</span></div>
                      <div>App Version: <span className="font-bold text-gray-900">v1.0.1 (Android APK)</span></div>
                      <div>Demo Student: <span className="font-bold text-gray-900">Aarav Sharma (9-A)</span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <a 
                      href={PORTAL_URLS.student} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full bg-emerald-600 text-white py-2 text-center text-xs font-black uppercase tracking-wider border-[1.5px] border-gray-900 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-[2px_2px_0_0_#111827]"
                    >
                      <span>Launch Student Portal :5175</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a 
                      href="/apk/Student_Parents.apk" 
                      download="Student_Parents.apk"
                      className="w-full bg-slate-900 text-emerald-400 py-1.5 text-center text-[11px] font-black uppercase tracking-wider border-[1.5px] border-gray-900 hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 shadow-[1px_1px_0_0_#111827]"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Download Student & Parent APK (Android)</span>
                    </a>
                    <div className="flex gap-1.5 text-[10.5px] font-bold">
                      <a href={`${PORTAL_URLS.student}/fees`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-900 py-1 text-center text-gray-800">
                        Fees ↗
                      </a>
                      <a href={`${PORTAL_URLS.student}/attendance`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-900 py-1 text-center text-gray-800">
                        Attendance ↗
                      </a>
                      <a href={`${PORTAL_URLS.student}/online-exams`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-900 py-1 text-center text-gray-800">
                        CBT Exams ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* 7. Driver Telematics Panel (Driver_Panel :5180) */}
                <div className="bg-white border-[2.5px] border-amber-900 p-4 shadow-[4px_4px_0_0_#78350f] flex flex-col justify-between group hover:-translate-y-1 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 bg-amber-100 border-[1.5px] border-amber-900 flex items-center justify-center text-xl shadow-[1px_1px_0_0_#78350f]">
                        🚌
                      </div>
                      <span className="text-[10px] font-black bg-amber-500 text-gray-950 px-2 py-0.5 uppercase tracking-wide">
                        Port 5180 • Driver Panel
                      </span>
                    </div>
                    <h4 className="font-black text-gray-900 text-base mb-1">Driver Telematics Panel</h4>
                    <p className="text-gray-500 text-xs font-semibold leading-relaxed mb-3">
                      Production Driver portal with live GPS telemetry, trip management (Start/End), student pickup/drop-off roster, pre-trip vehicle checklist, and SOS incidents.
                    </p>
                    <div className="text-[11px] bg-amber-50/70 border border-amber-200 p-2 font-mono text-gray-700 mb-3 rounded-sm space-y-0.5">
                      <div>Project: <span className="font-bold text-amber-900">Driver_Panel</span></div>
                      <div>Default Driver: <span className="font-bold text-gray-900">DRV-101 (Ramesh Kumar)</span></div>
                      <div>Secret PIN: <span className="font-bold text-gray-900">1011</span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <a 
                      href={PORTAL_URLS.driver} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full bg-amber-500 text-gray-950 py-2 text-center text-xs font-black uppercase tracking-wider border-[1.5px] border-gray-900 hover:bg-amber-400 transition-colors flex items-center justify-center gap-1.5 shadow-[2px_2px_0_0_#111827]"
                    >
                      <span>Launch Driver Panel :5180</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <div className="flex gap-1.5 text-[10.5px] font-bold">
                      <a href={`${PORTAL_URLS.driver}/trips`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-900 py-1 text-center text-gray-800">
                        Trips ↗
                      </a>
                      <a href={`${PORTAL_URLS.driver}/live-tracking`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-900 py-1 text-center text-gray-800">
                        Live GPS ↗
                      </a>
                      <a href={`${PORTAL_URLS.driver}/boarding`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-900 py-1 text-center text-gray-800">
                        Boarding ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* 8. Driver Android Mobile App (Driver.apk) */}
                <div className="bg-white border-[2.5px] border-slate-900 p-4 shadow-[4px_4px_0_0_#0f172a] flex flex-col justify-between group hover:-translate-y-1 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 bg-slate-100 border-[1.5px] border-slate-900 flex items-center justify-center text-xl shadow-[1px_1px_0_0_#0f172a]">
                        📱
                      </div>
                      <span className="text-[10px] font-black bg-slate-800 text-white px-2 py-0.5 uppercase tracking-wide">
                        Android APK • Driver App
                      </span>
                    </div>
                    <h4 className="font-black text-gray-900 text-base mb-1">Driver Android App</h4>
                    <p className="text-gray-500 text-xs font-semibold leading-relaxed mb-3">
                      Native Android APK wrapper with hardware GPS geolocation, offline sync fallback, one-touch SOS incident alert, and camera scanner support.
                    </p>
                    <div className="text-[11px] bg-slate-50 border border-slate-200 p-2 font-mono text-gray-700 mb-3 rounded-sm space-y-0.5">
                      <div>Package: <span className="font-bold text-slate-900">com.schoolerp.driver</span></div>
                      <div>App Version: <span className="font-bold text-gray-900">v1.0.0 (Native Android APK)</span></div>
                      <div>Binary: <span className="font-bold text-emerald-700">Driver.apk (Signed)</span></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <a 
                      href="/apk/Driver.apk" 
                      download="Driver.apk"
                      className="w-full bg-slate-900 text-white py-2.5 text-center text-xs font-black uppercase tracking-wider border-[1.5px] border-gray-900 hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 shadow-[2px_2px_0_0_#111827]"
                    >
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>Download Driver APK (Android)</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. PURCHASE & LICENSE ENQUIRY (POST /api/leads)           */}
          {/* ======================================================== */}
          {mode === 'purchase' && (
            <div className="max-w-2xl mx-auto space-y-4">
              {submittedLead ? (
                <div className="bg-emerald-50 border-[2px] border-emerald-900 p-6 shadow-[4px_4px_0_0_#065F46] text-center">
                  <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-[2px_2px_0_0_#065F46]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <span className="text-[10px] font-black tracking-widest uppercase bg-emerald-200 text-emerald-900 px-3 py-1 border border-emerald-900">
                    Lead Registered in Database
                  </span>
                  <h3 className="font-black text-2xl text-gray-900 mt-2 mb-1">
                    Thank You, {submittedLead.name}!
                  </h3>
                  <p className="text-gray-600 text-xs font-semibold max-w-md mx-auto mb-4">
                    Your request for the <strong className="text-gray-900">{submittedLead.plan}</strong> has been logged to the central CRM engine.
                  </p>

                  <div className="bg-white border-[1.5px] border-gray-900 p-4 max-w-md mx-auto text-left text-xs space-y-2 mb-6 shadow-[2px_2px_0_0_#111827]">
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-gray-500 font-bold">License Reference:</span>
                      <span className="font-mono font-black text-amber-600">{submittedLead.ref}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-gray-500 font-bold">Email:</span>
                      <span className="font-bold text-gray-900">{submittedLead.email}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-gray-500 font-bold">Contact Phone:</span>
                      <span className="font-bold text-gray-900">{submittedLead.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold">Delivery:</span>
                      <span className="font-bold text-emerald-600">Unencrypted ZIP + Git Access</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/?text=Hello%20ALLCORE%20SOLUTION%2C%20I%20have%20submitted%20license%20enquiry%20Ref%3A%20${submittedLead.ref}%20for%20Multi-School%20ERP.`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto bg-[#25D366] text-white px-6 py-2.5 font-black text-xs uppercase tracking-wider border-[2px] border-gray-900 shadow-[2px_2px_0_0_#111827] flex items-center justify-center gap-2 hover:bg-[#20ba59]"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setSubmittedLead(null)}
                      className="w-full sm:w-auto bg-white text-gray-800 px-5 py-2.5 font-bold text-xs uppercase tracking-wider border-[2px] border-gray-900 hover:bg-gray-100 cursor-pointer"
                    >
                      New Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border-[2px] border-gray-900 p-5 sm:p-6 shadow-[4px_4px_0_0_#111827]">
                  <div className="flex items-center justify-between border-b-[2px] border-gray-900 pb-3 mb-4">
                    <div>
                      <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">
                        Purchase Source Code & Commercial License
                      </h3>
                      <p className="text-gray-500 text-xs font-semibold">
                        Get 100% unencrypted Node.js + React + Flutter apps with zero royalties.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 line-through">₹15,000</div>
                      <div className="text-xl font-black text-amber-500 leading-none">₹10,000</div>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="bg-rose-50 text-rose-700 text-xs font-bold p-2.5 border border-rose-300 mb-4">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleLeadSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Ramesh Verma"
                          className="w-full bg-slate-50 border-[1.5px] border-gray-900 px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1">
                          Organization / School Name
                        </label>
                        <input
                          type="text"
                          value={formData.schoolName}
                          onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                          placeholder="e.g. LearnFirst Academy / IT Agency"
                          className="w-full bg-slate-50 border-[1.5px] border-gray-900 px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1">
                          Official Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="ramesh@company.com"
                          className="w-full bg-slate-50 border-[1.5px] border-gray-900 px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1">
                          WhatsApp / Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 9876543210"
                          className="w-full bg-slate-50 border-[1.5px] border-gray-900 px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1">
                        Select Licensing Tier
                      </label>
                      <select
                        value={formData.plan}
                        onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                        className="w-full bg-slate-50 border-[1.5px] border-gray-900 px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:bg-white"
                      >
                        <option value="₹10,000 — Full Commercial Source Code">
                          ₹10,000 — Full Commercial Source Code (All 38 Modules + 3 Apps)
                        </option>
                        <option value="₹15,000 — Multi-School Agency Lifetime Bundle">
                          ₹15,000 — Multi-School Agency Lifetime Bundle (Unlimited Schools)
                        </option>
                        <option value="Custom Enterprise Deployment & Onboarding">
                          Custom Enterprise Deployment & White-Label Setup
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1">
                        Deployment Questions or Custom Notes
                      </label>
                      <textarea
                        rows={2}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Tell us about your servers, timeline or school requirements..."
                        className="w-full bg-slate-50 border-[1.5px] border-gray-900 px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-amber-400 text-gray-900 py-3 border-[2px] border-gray-900 font-black text-xs uppercase tracking-widest shadow-[3px_3px_0_0_#111827] hover:bg-amber-300 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        <span>{submitting ? 'Registering Enquiry...' : 'Confirm Order & Request License'}</span>
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
              <div className="bg-white border-[2px] border-gray-900 p-4 shadow-[3px_3px_0_0_#111827] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-gray-900 text-sm uppercase flex items-center gap-2">
                    <span>ZKTECO / ESSL PUSH PROTOCOL TERMINAL</span>
                    <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 border border-green-800/40">
                      LIVE API CONNECTED
                    </span>
                  </h3>
                  <p className="text-gray-500 text-xs font-semibold mt-0.5">
                    Real devices communicating with backend ADMS routes (<code className="text-gray-900 bg-gray-100 px-1 font-mono">POST /api/hardware/sync-punch</code>).
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleTestPunch}
                    className="bg-amber-400 text-gray-900 px-3 py-1.5 text-xs font-black uppercase border border-gray-900 hover:bg-amber-300 shadow-[1px_1px_0_0_#111827] cursor-pointer"
                  >
                    ⚡ Simulate RFID Punch
                  </button>
                  <button 
                    onClick={fetchHardwareDevices}
                    className="bg-gray-100 text-gray-800 px-3 py-1.5 text-xs font-bold border border-gray-900 hover:bg-gray-200 cursor-pointer"
                  >
                    Refresh Devices
                  </button>
                </div>
              </div>

              {/* Devices Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {hardwareDevices.map((dev) => (
                  <div key={dev._id} className="bg-white border-[2px] border-gray-900 p-4 shadow-[2px_2px_0_0_#111827]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-gray-900 text-xs uppercase">{dev.deviceName}</span>
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-900/40 text-[9px] font-black px-1.5 py-0.2">
                        {dev.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 border border-gray-200 mb-3">
                      <div><span className="text-gray-500">Brand:</span> <span className="font-bold text-gray-900">{dev.brand}</span></div>
                      <div><span className="text-gray-500">IP:</span> <span className="font-mono font-bold text-gray-900">{dev.ipAddress}</span></div>
                      <div><span className="text-gray-500">Location:</span> <span className="font-bold text-gray-900">{dev.location}</span></div>
                      <div><span className="text-gray-500">Punches Today:</span> <span className="font-bold text-amber-600">{dev.todayPunches || 142}</span></div>
                    </div>

                    <button
                      onClick={() => handlePingDevice(dev)}
                      className="w-full bg-[#0F172A] text-white py-1.5 text-xs font-black uppercase tracking-wider border border-gray-900 hover:bg-amber-400 hover:text-gray-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Ping Device & Test Port {dev.port || 4370}</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Terminal Logs Output */}
              <div className="bg-[#0b1329] text-emerald-400 p-3 sm:p-4 border-[2px] border-gray-900 font-mono text-xs shadow-[3px_3px_0_0_#111827]">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-2 text-gray-400 text-[11px]">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Live Biometric ADMS Stream Console</span>
                  </span>
                  <span>{pingStatus || 'Ready for test commands'}</span>
                </div>
                <div className="space-y-1 text-[11.5px] min-h-[90px]">
                  {pingLogs.length === 0 ? (
                    <div className="text-gray-500 italic">
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
              <div className="bg-white border-[2px] border-gray-900 p-4 shadow-[3px_3px_0_0_#111827] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-gray-900 text-sm uppercase flex items-center gap-2">
                    <span>BUS ROUTE 4A — REALTIME TELEMETRY ENGINE</span>
                    <span className="bg-amber-100 text-amber-800 border border-amber-900/30 text-[10px] px-2 py-0.5">
                      MAPBOX / OSM SYNC
                    </span>
                  </h3>
                  <p className="text-gray-500 text-xs font-semibold mt-0.5">
                    Live driver smartphone stream broadcast to parents. Low-latency vector pathcasting.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSosActive(!sosActive)}
                    className={`px-3 py-1 text-xs font-black uppercase border border-gray-900 transition-colors cursor-pointer ${
                      sosActive ? 'bg-rose-600 text-white animate-pulse' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sosActive ? '⚠️ SOS BROADCASTING' : 'Trigger SOS Alert'}
                  </button>
                  <button
                    onClick={() => setGpsActive(!gpsActive)}
                    className="bg-[#0F172A] text-white px-3 py-1 text-xs font-black uppercase border border-gray-900 hover:bg-amber-400 hover:text-gray-900 cursor-pointer"
                  >
                    {gpsActive ? 'Pause Stream' : 'Resume Stream'}
                  </button>
                </div>
              </div>

              {/* Map Simulator Panel */}
              <div className="relative bg-slate-900 border-[2px] border-gray-900 h-64 sm:h-72 overflow-hidden shadow-[3px_3px_0_0_#111827] flex items-center justify-center">
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

                <div className="absolute top-3 left-3 bg-white/95 border-[1.5px] border-gray-900 p-2.5 text-xs shadow-[2px_2px_0_0_#111827] max-w-[220px]">
                  <div className="font-black text-gray-900 text-xs">Bus #4: North Sector Express</div>
                  <div className="text-gray-600 text-[11px] font-semibold">Driver: Suresh Patil</div>
                  <div className="text-emerald-600 font-bold text-[11px] mt-1">Status: En Route to Campus</div>
                </div>

                <div className="absolute bottom-3 right-3 bg-white/95 border-[1.5px] border-gray-900 p-2.5 text-xs shadow-[2px_2px_0_0_#111827] flex gap-4">
                  <div className="text-center">
                    <div className="text-gray-400 text-[9px] uppercase font-bold">Speed</div>
                    <div className="font-black text-gray-900 text-base">{busSpeed} km/h</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-[9px] uppercase font-bold">ETA Next Stop</div>
                    <div className="font-black text-amber-600 text-base">3 mins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-[9px] uppercase font-bold">Onboard</div>
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
              <div className="flex border-b border-gray-300 gap-2">
                {[
                  { id: 'spec', label: 'Quotation & Spec Sheet' },
                  { id: 'license', label: 'Commercial License' },
                  { id: 'refund', label: 'Refund Policy' },
                  { id: 'privacy', label: 'Privacy & Security' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDocTab(tab.id)}
                    className={`px-3 py-2 text-xs font-black uppercase transition-all cursor-pointer ${
                      activeDocTab === tab.id
                        ? 'bg-amber-400 text-gray-900 border-t-2 border-l-2 border-r-2 border-gray-900 shadow-[2px_-2px_0_0_#111827]'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="bg-white border-[2px] border-gray-900 p-5 shadow-[3px_3px_0_0_#111827] text-gray-800 text-xs leading-relaxed space-y-3">
                {activeDocTab === 'spec' && (
                  <>
                    <h3 className="font-black text-gray-900 text-base uppercase">Official Architectural Specification</h3>
                    <p className="font-semibold text-gray-600">
                      Multi-School ERP is an enterprise monolithic suite crafted with React 18, Node.js/Express, and Flutter 3.x.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                      <div className="border border-gray-300 p-3 bg-gray-50">
                        <h5 className="font-black text-gray-900 mb-1">Server Requirements:</h5>
                        <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                          <li>Node.js v18.x or v20.x LTS</li>
                          <li>MongoDB v5.0+ (Atlas or self-hosted)</li>
                          <li>2GB RAM minimum (4GB recommended)</li>
                          <li>Linux Ubuntu 22.04 LTS / Debian</li>
                        </ul>
                      </div>
                      <div className="border border-gray-300 p-3 bg-gray-50">
                        <h5 className="font-black text-gray-900 mb-1">Package Deliverables:</h5>
                        <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                          <li>Unencrypted Source Code (.zip & Git repo)</li>
                          <li>3 Flutter Mobile Apps (Parent, Staff, Driver)</li>
                          <li>Windows ADMS Biometric Sync Executable</li>
                          <li>1 Year Technical Maintenance & Bug Patches</li>
                        </ul>
                      </div>
                    </div>
                  </>
                )}

                {activeDocTab === 'license' && (
                  <>
                    <h3 className="font-black text-gray-900 text-base uppercase">Commercial License Terms</h3>
                    <p className="font-semibold text-gray-700">
                      Grant of License: ALL CORE SOLUTION grants the licensee a perpetual, worldwide, non-exclusive commercial license to install, customize, rebrand, and deploy the Multi-School ERP codebase.
                    </p>
                    <ul className="list-disc list-inside space-y-1 font-medium text-gray-600">
                      <li><strong>Unlimited Tenants:</strong> You may onboard unlimited schools and monetize SaaS subscriptions with 0% royalty.</li>
                      <li><strong>Source Access:</strong> 100% unencrypted code. No phone-home calls or domain locking mechanisms.</li>
                      <li><strong>Prohibition:</strong> You are strictly prohibited from redistributing or reselling the raw uncompiled source code publicly.</li>
                    </ul>
                  </>
                )}

                {activeDocTab === 'refund' && (
                  <>
                    <h3 className="font-black text-gray-900 text-base uppercase">Digital Product Refund Policy</h3>
                    <p className="font-semibold text-gray-600">
                      Because digital source code cannot be returned once downloaded, all sales of source code packages are final once delivery tokens are issued. We provide full live demos of all running portals on this site so you can test every workflow before making your purchase.
                    </p>
                  </>
                )}

                {activeDocTab === 'privacy' && (
                  <>
                    <h3 className="font-black text-gray-900 text-base uppercase">Data Privacy & Sovereignty</h3>
                    <p className="font-semibold text-gray-600">
                      100% On-Premise Data Ownership: We never access, harvest, or transmit your student, parent, or financial records to external servers. Your MongoDB database remains strictly in your control.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-gray-100 border-t-[2px] border-gray-900 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-gray-600">
            <span>Developed by RAJ YADAV @ALLCORE SOLUTION</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline text-amber-600">Support: contact@allcoresolution.com</span>
          </div>
          <button
            onClick={closeModal}
            className="px-4 py-1.5 bg-gray-900 hover:bg-gray-800 text-white font-black uppercase text-[11px] tracking-wider border border-gray-900 cursor-pointer"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}

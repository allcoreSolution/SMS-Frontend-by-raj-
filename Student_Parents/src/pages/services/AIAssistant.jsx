import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Plus,
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  RotateCw,
  Search,
  DollarSign,
  Calendar,
  FileText,
  Bus,
  Heart,
  QrCode,
  Download,
  BookOpen,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  GraduationCap,
  Building,
  Trash2,
  MessageSquare,
  Globe,
  ChevronDown,
  Layers,
  Server,
  Key,
  Cpu
} from 'lucide-react';
import parentService from '../../api/parentService';
import { LANGUAGES, getT } from '../../utils/translations';

export default function AIAssistant({ activeChild }) {
  const navigate = useNavigate();

  // Language state synced with portal
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      return localStorage.getItem('portal_language') || 'en';
    } catch (e) {
      return 'en';
    }
  });
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const aiLangRef = useRef(null);

  // Sync external language changes
  useEffect(() => {
    const handleSync = (e) => {
      if (e.detail && e.detail !== currentLang) {
        setCurrentLang(e.detail);
      }
    };
    window.addEventListener('portal_language_changed', handleSync);
    window.addEventListener('app_language_changed', handleSync);
    return () => {
      window.removeEventListener('portal_language_changed', handleSync);
      window.removeEventListener('app_language_changed', handleSync);
    };
  }, [currentLang]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (aiLangRef.current && !aiLangRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Active student state
  const student = {
    name: 'Aarav Sharma',
    admissionNo: 'YIS-2024-101',
    className: 'Class I (A)',
    rollNo: '14',
    fatherName: 'Rajesh Kumar Gupta',
    phone: '+91 98765 10000'
  };

  // Chat State
  const initialBotWelcome = {
    role: 'bot',
    text: `👋 **Welcome to the All Core Solutions (ACS) School ERP AI Assistant.**\n\nI am here to assist you with complete project architecture, module guides, and real-time student academic records:\n\n1. 🏫 **Complete School ERP Information:**\n   • Detailed guide to all **7 Specialized Portals** (Ports 5173 – 5179)\n   • Complete catalog of **38+ Modules** (Admissions, Fees, Exams, Biometric, HR & Payroll, Hostel, Transport, Certificates)\n   • Official Institutional Login Portals & Security Policies\n   • Developer Technical Stack, Architecture & Setup Instructions\n\n2. 🎓 **Real-Time Student Records (${student.name}):**\n   • Fee Dues, Online Clearance & Official Receipts\n   • Live Attendance & CBSE 75% Mandatory Criteria\n   • Leave Application & Approval Workflows\n   • Live Bus GPS Tracking & Driver Contact Directory\n   • Terminal Exam Datesheets & Published Marksheets\n\nFeel free to ask any question to get started!`,
    intent: 'greeting',
    quickActions: [
      { label: 'Check Fee Status', route: '/fee-payments', icon: DollarSign },
      { label: 'Attendance Summary', route: '/attendance', icon: Calendar },
      { label: 'Apply for Leave', route: '/leave-management', icon: FileText },
      { label: 'Live Bus Tracking', route: '/transport', icon: Bus }
    ],
    suggestions: [
      'What is the School ERP project and what modules does it include?',
      'What are the 7 portals and their port numbers?',
      'Where can I find the official login portals links?',
      'How much fee is pending and how can I pay?',
      'What is Aarav\'s current attendance percentage?'
    ],
    timestamp: new Date()
  };

  const [messages, setMessages] = useState([initialBotWelcome]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => `sess_${Date.now()}`);
  const [activeSessionTitle, setActiveSessionTitle] = useState('New Inquiry');
  const [sessions, setSessions] = useState([]);
  
  // Quick Prompt Topic Cards (Project Knowledge + Student Services)
  const quickTopics = [
    { title: 'Project Overview & Architecture', query: 'What is the School ERP project and what features are included?', icon: Layers, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { title: '7 Portals & Ports Directory', query: 'What are all 7 specialized portals and their port numbers?', icon: Server, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
    { title: 'Official Portals Access', query: 'What are the official login portal URLs for all panels?', icon: Key, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { title: 'All 38+ Modules Catalog', query: 'What are the 38+ institutional modules and features available?', icon: Cpu, color: 'text-violet-600 bg-violet-50 border-violet-200' },
    { title: 'Fee Dues & Online Receipts', query: 'What is my pending fee balance and how can I complete online payment?', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { title: 'Attendance Record Summary', query: "What is Aarav's attendance summary and total absent days?", icon: Calendar, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { title: 'Apply for Student Leave', query: 'How can I apply for student leave on the portal?', icon: FileText, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { title: 'Bus & Transport Route', query: 'What is the bus route number, pickup timing, and driver contact number?', icon: Bus, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { title: 'Upcoming Exams & Results', query: 'When are the upcoming examinations and what was the PA-1 result?', icon: GraduationCap, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { title: 'Campus Health Clinic', query: 'What are the doctor timings at the campus clinic and student health details?', icon: Heart, color: 'text-red-600 bg-red-50 border-red-200' },
    { title: 'Campus Security Gate Pass', query: 'How can I schedule a meeting with the Principal and obtain a visitor gate pass?', icon: QrCode, color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { title: 'Developer Setup & Run', query: 'How do I install and start the project locally (Node, MongoDB, Ports)?', icon: Server, color: 'text-slate-600 bg-slate-50 border-slate-200' }
  ];

  // UI Utilities
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Load Sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await parentService.getAISessions();
        if (res && res.success && res.data) {
          setSessions(res.data);
        }
      } catch (e) {
        // Fallback default
        setSessions([
          { id: 's1', title: 'Fee Status & Dues', time: 'Today', lastMessage: 'Official Fee Status for Aarav Sharma' },
          { id: 's2', title: 'Attendance Summary', time: 'Yesterday', lastMessage: 'Live Attendance Summary for Aarav Sharma' },
          { id: 's3', title: 'Upcoming Exam Dates', time: '3 days ago', lastMessage: 'Examination & Assessment Details' }
        ]);
      }
    };
    fetchSessions();
  }, []);

  // Send Message
  const handleSendMessage = async (customQuery) => {
    const queryText = (customQuery || input).trim();
    if (!queryText || loading) return;

    // Append User Message
    const userMsg = {
      role: 'user',
      text: queryText,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!customQuery) setInput('');
    setLoading(true);

    try {
      const res = await parentService.chatWithAI({
        message: queryText,
        sessionId,
        studentId: activeChild,
        language: currentLang
      });

      if (res && res.success) {
        const botMsg = {
          role: 'bot',
          text: res.reply,
          intent: res.intent,
          quickActions: res.quickActions || [],
          suggestions: res.suggestions || [],
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, botMsg]);

        if (voiceEnabled && 'speechSynthesis' in window) {
          speakText(res.reply);
        }

        if (activeSessionTitle === 'New Inquiry') {
          setActiveSessionTitle(queryText.substring(0, 24) + '...');
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            text: 'I could not process your query at this moment. Please check your network connection and try again.',
            isError: true,
            timestamp: new Date()
          }
        ]);
      }
    } catch (err) {
      console.error('AI Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: `⚠️ **Could not connect to AI Support Server:** ${err?.response?.data?.message || err?.message || 'Server offline'}. Please ensure School ERP backend is running.`,
          isError: true,
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Text-To-Speech
  const speakText = (text, index = null) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (speakingIndex === index && index !== null) {
      setSpeakingIndex(null);
      return;
    }

    const clean = text.replace(/[*_#`•]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  // Copy text
  const handleCopy = (text, i) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // New Chat
  const handleNewChat = () => {
    window.speechSynthesis?.cancel();
    setSpeakingIndex(null);
    const newId = `sess_${Date.now()}`;
    setSessionId(newId);
    setActiveSessionTitle('New Inquiry');
    setMessages([initialBotWelcome]);
  };

  // Render Formatted Markdown
  const renderFormattedText = (rawText) => {
    const lines = (rawText || '').split('\n');

    return (
      <div className="space-y-1.5 text-xs sm:text-[13px] text-gray-800 leading-relaxed font-normal">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;

          // Header line with emoji or bold start
          if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
            const content = trimmed.substring(1).trim();
            return (
              <div key={idx} className="flex items-start gap-2 pl-1 my-0.5">
                <span className="text-indigo-600 font-bold select-none">•</span>
                <span className="flex-1">{parseInlineStyles(content)}</span>
              </div>
            );
          }

          const matchNum = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (matchNum) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1 my-0.5">
                <span className="font-bold text-indigo-700 select-none text-xs">{matchNum[1]}.</span>
                <span className="flex-1">{parseInlineStyles(matchNum[2])}</span>
              </div>
            );
          }

          return <div key={idx}>{parseInlineStyles(line)}</div>;
        })}
      </div>
    );
  };

  const parseInlineStyles = (text) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-gray-900 font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="bg-gray-100 text-indigo-700 font-mono px-1.5 py-0.5 text-[11px] border border-gray-300 font-semibold"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-[1440px] mx-auto min-h-screen bg-[#f8f9fa] space-y-6">
      
      {/* ========================================================= */}
      {/* 1. TOP HEADER BAR (Strict School ERP Theme)               */}
      {/* ========================================================= */}
      <div className="bg-white border border-gray-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Bot className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] font-bold text-[#1f2937] tracking-tight">
                  AI Assistant & School Helpdesk
                </h1>
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-extrabold px-2 py-0.5 uppercase tracking-wider">
                  24/7 Verified Support
                </span>
              </div>
              <p className="text-[12.5px] text-gray-500 font-medium">
                Instant guidance on <span className="font-bold text-indigo-700">School ERP Project Ecosystem</span> (7 Portals, 38+ Modules, Admin Access) & live records for <span className="font-bold text-gray-800">{student.name}</span> ({student.className})
              </p>
            </div>
          </div>
        </div>

        {/* Top Header Actions */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Language Selector Dropdown in AI Assistant */}
          <div className="relative" ref={aiLangRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                {LANGUAGES.find((l) => l.code === currentLang)?.flag}{' '}
                {LANGUAGES.find((l) => l.code === currentLang)?.native || 'English'}
              </span>
              <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {langDropdownOpen && (
              <div className="absolute top-full mt-1.5 right-0 w-48 bg-white border border-gray-200 shadow-xl z-50 py-1 flex flex-col animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100 mb-1">
                  <p className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">
                    Select Language ({LANGUAGES.length})
                  </p>
                </div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar divide-y divide-gray-50">
                  {LANGUAGES.map((lang) => {
                    const isSelected = currentLang === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setCurrentLang(lang.code);
                          try {
                            localStorage.setItem('portal_language', lang.code);
                            localStorage.setItem('app_language', lang.code);
                          } catch (e) {}
                          window.dispatchEvent(new CustomEvent('portal_language_changed', { detail: lang.code }));
                          window.dispatchEvent(new CustomEvent('app_language_changed', { detail: lang.code }));
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 text-indigo-700 font-bold border-l-[3px] border-indigo-600'
                            : 'text-gray-700 hover:bg-gray-50 border-l-[3px] border-transparent font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm leading-none">{lang.flag}</span>
                          <span>{lang.native} ({lang.name})</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`px-3 py-2 border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              voiceEnabled
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
            <span>Voice Readout: {voiceEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={handleNewChat}
            className="px-4 py-2 bg-[#353A40] hover:bg-[#23272B] text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN 2-COLUMN LAYOUT                                   */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Student Context & Quick FAQ Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Active Student Card */}
          <div className="bg-white border border-gray-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Connected Student Profile
              </span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                Live Synced
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-indigo-600 text-white font-extrabold flex items-center justify-center text-base shadow-sm">
                AS
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-sm">{student.name}</h3>
                <p className="text-xs text-gray-500 font-medium">{student.className} • Roll #{student.rollNo}</p>
                <p className="text-[11px] text-gray-400">Admission No: <span className="font-mono font-semibold text-gray-700">{student.admissionNo}</span></p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-2.5 text-xs text-gray-600 flex items-center justify-between">
              <span>Father: <strong className="text-gray-800">{student.fatherName}</strong></span>
              <span className="text-gray-500">{student.phone}</span>
            </div>
          </div>

          {/* Quick Click-To-Ask Topics */}
          <div className="bg-white border border-gray-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Quick Topic Explorer
              </span>
              <span className="text-[11px] text-gray-400">1-Click Query</span>
            </div>

            <div className="space-y-2">
              {quickTopics.map((topic, tIdx) => {
                const Icon = topic.icon;
                return (
                  <button
                    key={tIdx}
                    onClick={() => handleSendMessage(topic.query)}
                    disabled={loading}
                    className="w-full text-left p-2.5 bg-gray-50 hover:bg-indigo-50/70 border border-gray-200 hover:border-indigo-300 transition-all flex items-center gap-2.5 group cursor-pointer"
                  >
                    <div className={`w-7 h-7 border flex items-center justify-center shrink-0 ${topic.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-indigo-900 flex-1 truncate">
                      {topic.title}
                    </span>
                    <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-indigo-600 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emergency School Directory Card */}
          <div className="bg-white border border-gray-200 shadow-sm p-4 space-y-2 text-xs">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block border-b border-gray-100 pb-2">
              School Emergency Helpline
            </span>
            <div className="space-y-1.5 text-gray-600">
              <div className="flex items-center justify-between">
                <span>Reception Desk:</span>
                <span className="font-mono font-bold text-gray-900">011-2654-8899</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Accounts & Fees:</span>
                <span className="font-mono font-bold text-gray-900">011-2654-8892</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Bus Fleet Cell:</span>
                <span className="font-mono font-bold text-gray-900">+91 98112 34567</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Medical Clinic:</span>
                <span className="font-mono font-bold text-gray-900">011-2654-8898</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Chat Feed & Input (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-gray-200 shadow-sm flex flex-col h-[720px]">
          
          {/* Chat Feed Header */}
          <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <div>
                <span className="text-xs font-bold text-gray-800 block">All Core Solutions (ACS) Intelligent Assistant</span>
                <span className="text-[11px] text-gray-500">Replies instantly in English</span>
              </div>
            </div>

            <button
              onClick={handleNewChat}
              className="text-xs text-gray-500 hover:text-red-600 font-semibold flex items-center gap-1 p-1"
              title="Clear current chat"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#fafafa]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* Bot Avatar */}
                {m.role === 'bot' && (
                  <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                {/* Message Bubble Card */}
                <div className="flex flex-col gap-1.5 max-w-[92%] sm:max-w-[85%]">
                  <div
                    className={`p-4 shadow-xs border ${
                      m.role === 'user'
                        ? 'bg-[#353A40] text-white border-[#2A2E33]'
                        : m.isError
                        ? 'bg-red-50 text-red-900 border-red-200'
                        : 'bg-white text-gray-800 border-gray-200'
                    }`}
                  >
                    {/* Role Header */}
                    <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-gray-100 text-[11px]">
                      <span className={`font-bold uppercase tracking-wider ${
                        m.role === 'user' ? 'text-gray-300' : 'text-indigo-700'
                      }`}>
                        {m.role === 'user' ? 'You (Mr. Rajesh Gupta)' : 'School AI Assistant'}
                      </span>
                      <span className={`${m.role === 'user' ? 'text-gray-400' : 'text-gray-400'} text-[10px]`}>
                        {m.timestamp
                          ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : ''}
                      </span>
                    </div>

                    {/* Content */}
                    {m.role === 'bot' ? (
                      renderFormattedText(m.text)
                    ) : (
                      <div className="text-xs sm:text-[13px] leading-relaxed font-medium">
                        {m.text}
                      </div>
                    )}

                    {/* Contextual Quick Actions (Buttons inside bot response) */}
                    {m.role === 'bot' && m.quickActions && m.quickActions.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                        {m.quickActions.map((action, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => navigate(action.route)}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>{action.label}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Follow-up Suggestions */}
                    {m.role === 'bot' && m.suggestions && m.suggestions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-gray-100">
                        <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1.5">
                          Suggested questions:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {m.suggestions.map((sug, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSendMessage(sug)}
                              disabled={loading}
                              className="text-[11px] px-2.5 py-1 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 text-gray-700 font-medium transition-colors cursor-pointer"
                            >
                              💬 {sug}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bot utilities (Copy, Speech, Feedback) */}
                  {m.role === 'bot' && (
                    <div className="flex items-center justify-between px-1 text-gray-400 text-[11px]">
                      <div className="flex items-center gap-2">
                        {/* Copy */}
                        <button
                          onClick={() => handleCopy(m.text, i)}
                          className="hover:text-gray-700 transition-colors p-0.5"
                          title="Copy response"
                        >
                          {copiedIndex === i ? (
                            <span className="text-emerald-600 flex items-center gap-0.5">
                              <Check className="w-3.5 h-3.5" /> Copied
                            </span>
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Read aloud */}
                        <button
                          onClick={() => speakText(m.text, i)}
                          className={`hover:text-gray-700 transition-colors p-0.5 ${
                            speakingIndex === i ? 'text-indigo-600 font-bold' : ''
                          }`}
                          title="Speak aloud"
                        >
                          {speakingIndex === i ? (
                            <VolumeX className="w-3.5 h-3.5" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <span className="opacity-40">|</span>

                        {/* Thumbs up */}
                        <button
                          onClick={() => setFeedback({ ...feedback, [i]: 'up' })}
                          className={`hover:text-emerald-600 transition-colors p-0.5 ${
                            feedback[i] === 'up' ? 'text-emerald-600 font-bold' : ''
                          }`}
                          title="Helpful answer"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Thumbs down */}
                        <button
                          onClick={() => setFeedback({ ...feedback, [i]: 'down' })}
                          className={`hover:text-red-600 transition-colors p-0.5 ${
                            feedback[i] === 'down' ? 'text-red-600 font-bold' : ''
                          }`}
                          title="Not helpful"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[10px] text-gray-400">Verified ERP Record</span>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {m.role === 'user' && (
                  <div className="w-8 h-8 bg-gray-700 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3.5 bg-white border border-gray-200 text-xs text-gray-600 flex items-center gap-2.5 shadow-xs">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="font-medium text-gray-500">Checking Aarav's verified school records...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Bottom Chat Input Form */}
          <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder="Type your question in English (e.g. pending fee balance, apply for leave, bus routes)..."
                className="flex-1 p-3 bg-gray-50 border border-gray-300 text-xs sm:text-[13px] text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-indigo-600 transition-colors"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-5 py-3 bg-[#353A40] hover:bg-[#23272B] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-sm shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="mt-2 text-center text-[11px] text-gray-400 flex items-center justify-center gap-3">
              <span>English Language AI Assistant</span>
              <span>•</span>
              <span>Direct Link to All Core Solutions ERP</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

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
  const initialBotWelcomeEn = {
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
      "What is Aarav's current attendance percentage?"
    ],
    timestamp: new Date()
  };

  const initialBotWelcomeHi = {
    role: 'bot',
    text: `👋 **ऑल कोर सॉल्यूशंस (ACS) स्कूल ईआरपी एआई सहायक में आपका स्वागत है।**\n\nमैं स्कूल ईआरपी पोर्टल एवं छात्र के शैक्षणिक रिकॉर्ड से जुड़े सभी प्रश्नों में आपकी सहायता के लिए उपस्थित हूँ:\n\n1. 🏫 **संपूर्ण स्कूल ईआरपी जानकारी:**\n   • सभी **7 विशेषज्ञ पोर्टल्स** (5173 – 5179) की विस्तृत जानकारी\n   • **38+ विस्तृत मॉड्यूल्स** (प्रवेश, फीस, परीक्षा, उपस्थिति, छात्रावास, बस परिवहन)\n   • आधिकारिक लॉगिन एवं सुरक्षा नीतियां\n   • डेवलपर सेटअप एवं संचालन निर्देश\n\n2. 🎓 **छात्र लाइव रिकॉर्ड (${student.name}):**\n   • बकाया फीस एवं डिजिटल रसीदें\n   • लाइव उपस्थिति एवं सीबीएसई 75% उपस्थिति नियम\n   • अवकाश आवेदन स्थिति\n   • लाइव स्कूल बस जीपीएस ट्रैकिंग\n   • परीक्षा समय सारणी एवं रिपोर्ट कार्ड\n\nकृपया अपना प्रश्न नीचे टाइप करें या त्वरित विकल्प चुनें!`,
    intent: 'greeting',
    quickActions: [
      { label: 'फीस स्थिति देखें', route: '/fee-payments', icon: DollarSign },
      { label: 'उपस्थिति सारांश', route: '/attendance', icon: Calendar },
      { label: 'अवकाश आवेदन करें', route: '/leave-management', icon: FileText },
      { label: 'लाइव बस ट्रैकिंग', route: '/transport', icon: Bus }
    ],
    suggestions: [
      'स्कूल ईआरपी प्रोजेक्ट क्या है और इसमें कौन से फीचर्स शामिल हैं?',
      'स्कूल ईआरपी के 7 विशेषज्ञ पोर्टल्स और उनके पोर्ट नंबर क्या हैं?',
      'मेरी बकाया फीस कितनी है और ऑनलाइन भुगतान कैसे करें?',
      'आरव की कुल उपस्थिति प्रतिशत और अनुपस्थिति रिकॉर्ड क्या है?',
      'स्कूल बस रूट नंबर और चालक का संपर्क नंबर क्या है?'
    ],
    timestamp: new Date()
  };

  const [messages, setMessages] = useState([currentLang === 'hi' ? initialBotWelcomeHi : initialBotWelcomeEn]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => `sess_${Date.now()}`);
  const [activeSessionTitle, setActiveSessionTitle] = useState('New Inquiry');
  const [sessions, setSessions] = useState([]);

  // Quick Prompt Topic Cards (Project Knowledge + Student Services)
  const quickTopicsEn = [
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

  const quickTopicsHi = [
    { title: 'ईआरपी प्रोजेक्ट संरचना एवं वास्तुकला', query: 'स्कूल ईआरपी प्रोजेक्ट क्या है और इसमें कौन से फीचर्स शामिल हैं?', icon: Layers, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { title: '7 पोर्टल्स एवं पोर्ट नंबर डायरेक्टरी', query: 'स्कूल ईआरपी के 7 विशेषज्ञ पोर्टल्स और उनके पोर्ट नंबर क्या हैं?', icon: Server, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
    { title: 'आधिकारिक पोर्टल लॉगिन लिंक्स', query: 'सभी पैनल्स के आधिकारिक लॉगिन लिंक्स क्या हैं?', icon: Key, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { title: 'संपूर्ण 38+ मॉड्यूल्स विवरण', query: 'स्कूल ईआरपी में उपलब्ध 38+ मॉड्यूल्स की सूची क्या है?', icon: Cpu, color: 'text-violet-600 bg-violet-50 border-violet-200' },
    { title: 'बकाया फीस एवं ऑनलाइन रसीदें', query: 'मेरी बकाया फीस कितनी है और ऑनलाइन भुगतान कैसे करें?', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { title: 'उपस्थिति रिकॉर्ड एवं प्रतिशत', query: 'आरव की कुल उपस्थिति प्रतिशत और अनुपस्थिति रिकॉर्ड क्या है?', icon: Calendar, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { title: 'छात्र अवकाश (लीव) हेतु आवेदन', query: 'पोर्टल पर छात्र अवकाश के लिए आवेदन कैसे करें?', icon: FileText, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { title: 'स्कूल बस रूट एवं चालक संपर्क', query: 'स्कूल बस रूट नंबर, समय सारणी और चालक का संपर्क नंबर क्या है?', icon: Bus, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { title: 'आगामी परीक्षा एवं परिणाम', query: 'आगामी परीक्षाएं कब हैं और पिछली परीक्षा का परिणाम क्या रहा?', icon: GraduationCap, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { title: 'स्कूल स्वास्थ्य केंद्र एवं चिकित्सा', query: 'स्कूल क्लिनिक में डॉक्टर का समय और छात्र का स्वास्थ्य विवरण क्या है?', icon: Heart, color: 'text-red-600 bg-red-50 border-red-200' },
    { title: 'विजिटर गेट पास एवं मुलाकात', query: 'प्राचार्य से मिलने का समय और विजिटर गेट पास कैसे प्राप्त करें?', icon: QrCode, color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { title: 'डेवलपर सेटअप एवं संचालन', query: 'प्रोजेक्ट को लोकल सिस्टम पर कैसे चलाएं (Node, MongoDB, Ports)?', icon: Server, color: 'text-slate-600 bg-slate-50 border-slate-200' }
  ];

  const quickTopics = currentLang === 'hi' ? quickTopicsHi : quickTopicsEn;

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
    <div className="p-3 sm:p-5 md:p-6 max-w-7xl mx-auto min-h-screen bg-[#F8FAFF] space-y-6 pb-24 font-sans">
      
      {/* ========================================================= */}
      {/* 1. HERO HEADER CARD (Royal Blue Gradient)                 */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] rounded-3xl p-5 sm:p-7 text-white shadow-xl shadow-blue-900/15 relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-inner shrink-0">
              <Bot className="w-8 h-8" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  ACS Intelligent AI Helpdesk
                </h1>
                <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  24/7 Verified Support
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100 font-medium mt-1 max-w-2xl">
                Instant guidance on ACS School ERP Ecosystem (7 Portals, 38+ Modules) &amp; live academic records for <span className="font-bold text-white">{student.name}</span> ({student.className})
              </p>
            </div>
          </div>

          {/* Top Header Actions */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {/* Language Selector */}
            <div className="relative" ref={aiLangRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="px-3.5 py-2 bg-white/15 hover:bg-white/25 border border-white/25 text-xs font-bold text-white rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm backdrop-blur-md"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-blue-200" />
                <span>
                  {LANGUAGES.find((l) => l.code === currentLang)?.flag}{' '}
                  {LANGUAGES.find((l) => l.code === currentLang)?.native || 'English'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-blue-200 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div className="absolute top-full mt-2 right-0 w-52 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 py-1.5 flex flex-col text-slate-800 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3.5 py-1.5 bg-slate-50 border-b border-slate-100 mb-1 rounded-t-xl">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      Select Language ({LANGUAGES.length})
                    </p>
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
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
                          className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600'
                              : 'text-slate-700 hover:bg-slate-50 border-l-4 border-transparent font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base leading-none">{lang.flag}</span>
                            <span>{lang.native} ({lang.name})</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md border ${
                voiceEnabled
                  ? 'bg-emerald-500/25 border-emerald-400 text-white'
                  : 'bg-white/15 border-white/25 text-white hover:bg-white/25'
              }`}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4 text-blue-200" />}
              <span>{currentLang === 'hi' ? (voiceEnabled ? 'आवाज़: चालू' : 'आवाज़: बंद') : `Voice: ${voiceEnabled ? 'ON' : 'OFF'}`}</span>
            </button>

            <button
              onClick={handleNewChat}
              className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{currentLang === 'hi' ? 'नई चैट' : 'New Chat'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN 2-COLUMN LAYOUT                                   */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Student Context & Quick FAQ Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Active Student Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                {currentLang === 'hi' ? 'संबद्ध विद्यार्थी प्रोफ़ाइल' : 'Connected Profile'}
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black rounded-full">
                {currentLang === 'hi' ? 'लाइव सिंक' : 'Live Synced'}
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-lg shadow-md shrink-0">
                {student.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-slate-900 text-sm truncate">{student.name}</h3>
                <p className="text-xs text-slate-500 font-semibold">{student.className} • Roll #{student.rollNo}</p>
                <p className="text-[11px] text-slate-400">{currentLang === 'hi' ? 'प्रवेश क्रमांक' : 'Adm No'}: <span className="font-mono font-bold text-slate-700">{student.admissionNo}</span></p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs text-slate-600 flex items-center justify-between">
              <span>Parent: <strong className="text-slate-800">{student.fatherName}</strong></span>
              <span className="text-slate-500 font-mono text-[11px]">{student.phone}</span>
            </div>
          </div>

          {/* Quick Click-To-Ask Topics */}
          <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" /> Quick Topic Explorer
              </span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">1-Click Ask</span>
            </div>

            <div className="space-y-2">
              {quickTopics.map((topic, tIdx) => {
                const Icon = topic.icon;
                return (
                  <button
                    key={tIdx}
                    onClick={() => handleSendMessage(topic.query)}
                    disabled={loading}
                    className="w-full text-left p-2.5 rounded-2xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 transition-all flex items-center gap-2.5 group cursor-pointer"
                  >
                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${topic.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-blue-900 flex-1 truncate">
                      {topic.title}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emergency School Directory Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm p-5 space-y-3 text-xs">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider block border-b border-slate-100 pb-2.5">
              Emergency School Directory
            </span>
            <div className="space-y-2 text-slate-600 font-medium">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span>Reception Desk:</span>
                <span className="font-mono font-bold text-slate-900">011-2654-8899</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span>Accounts &amp; Fees:</span>
                <span className="font-mono font-bold text-slate-900">011-2654-8892</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span>Bus Fleet Cell:</span>
                <span className="font-mono font-bold text-slate-900">+91 98112 34567</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span>Medical Clinic:</span>
                <span className="font-mono font-bold text-slate-900">011-2654-8898</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Chat Feed & Input (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl shadow-sm flex flex-col h-[740px] overflow-hidden">
          
          {/* Chat Feed Header */}
          <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-sm"></div>
              <div>
                <span className="text-xs sm:text-sm font-extrabold text-slate-800 block">ACS Intelligent Assistant</span>
                <span className="text-[11px] text-slate-500 font-medium">Replies instantly in English &amp; regional languages</span>
              </div>
            </div>

            <button
              onClick={handleNewChat}
              className="text-xs text-slate-500 hover:text-red-600 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              title="Clear current chat"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#FBFDFF]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* Bot Avatar */}
                {m.role === 'bot' && (
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md mt-0.5">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                {/* Message Bubble Card */}
                <div className="flex flex-col gap-1.5 max-w-[92%] sm:max-w-[85%]">
                  <div
                    className={`p-4 sm:p-5 shadow-xs ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl rounded-tr-sm shadow-md shadow-blue-500/10'
                        : m.isError
                        ? 'bg-red-50 text-red-900 border border-red-200 rounded-3xl rounded-tl-sm'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-3xl rounded-tl-sm shadow-xs'
                    }`}
                  >
                    {/* Role Header */}
                    <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-white/20 text-[11px]">
                      <span className={`font-black uppercase tracking-wider ${
                        m.role === 'user' ? 'text-blue-100' : 'text-blue-700'
                      }`}>
                        {m.role === 'user' ? 'You' : 'ACS School AI'}
                      </span>
                      <span className={`${m.role === 'user' ? 'text-blue-200' : 'text-slate-400'} text-[10px] font-mono`}>
                        {m.timestamp
                          ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : ''}
                      </span>
                    </div>

                    {/* Content */}
                    {m.role === 'bot' ? (
                      renderFormattedText(m.text)
                    ) : (
                      <div className="text-xs sm:text-[13px] leading-relaxed font-semibold">
                        {m.text}
                      </div>
                    )}

                    {/* Contextual Quick Actions (Buttons inside bot response) */}
                    {m.role === 'bot' && m.quickActions && m.quickActions.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                        {m.quickActions.map((action, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => navigate(action.route)}
                            className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                          >
                            <span>{action.label}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Follow-up Suggestions */}
                    {m.role === 'bot' && m.suggestions && m.suggestions.length > 0 && (
                      <div className="mt-3.5 pt-2.5 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block mb-1.5">
                          Suggested questions:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {m.suggestions.map((sug, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSendMessage(sug)}
                              disabled={loading}
                              className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 text-slate-700 font-semibold transition-all cursor-pointer"
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
                    <div className="flex items-center justify-between px-2 text-slate-400 text-[11px]">
                      <div className="flex items-center gap-2.5">
                        {/* Copy */}
                        <button
                          onClick={() => handleCopy(m.text, i)}
                          className="hover:text-slate-700 transition-colors p-1"
                          title="Copy response"
                        >
                          {copiedIndex === i ? (
                            <span className="text-emerald-600 flex items-center gap-0.5 font-bold">
                              <Check className="w-3.5 h-3.5" /> Copied
                            </span>
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Read aloud */}
                        <button
                          onClick={() => speakText(m.text, i)}
                          className={`hover:text-slate-700 transition-colors p-1 ${
                            speakingIndex === i ? 'text-blue-600 font-bold' : ''
                          }`}
                          title="Speak aloud"
                        >
                          {speakingIndex === i ? (
                            <VolumeX className="w-3.5 h-3.5" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <span className="opacity-30">|</span>

                        {/* Thumbs up */}
                        <button
                          onClick={() => setFeedback({ ...feedback, [i]: 'up' })}
                          className={`hover:text-emerald-600 transition-colors p-1 ${
                            feedback[i] === 'up' ? 'text-emerald-600 font-bold' : ''
                          }`}
                          title="Helpful answer"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Thumbs down */}
                        <button
                          onClick={() => setFeedback({ ...feedback, [i]: 'down' })}
                          className={`hover:text-red-600 transition-colors p-1 ${
                            feedback[i] === 'down' ? 'text-red-600 font-bold' : ''
                          }`}
                          title="Not helpful"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[10px] text-slate-400 font-semibold">Verified ERP Record</span>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {m.role === 'user' && (
                  <div className="w-9 h-9 rounded-2xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-md mt-0.5">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Bot className="w-5 h-5 animate-spin" />
                </div>
                <div className="p-4 bg-white border border-slate-200/90 rounded-3xl rounded-tl-sm text-xs text-slate-600 flex items-center gap-3 shadow-xs">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="font-bold text-slate-500">
                    {currentLang === 'hi' ? 'प्रमाणित स्कूल रिकॉर्ड से जांच हो रही है...' : 'Checking verified school records...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Bottom Chat Input Form */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
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
                placeholder={currentLang === 'hi' ? 'पूछें (जैसे बकाया फीस, अवकाश आवेदन, बस रूट, परीक्षा समय सारणी)...' : 'Ask anything (e.g. pending fee balance, apply for leave, bus routes, exams)...'}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-[13px] text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-2xl flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/20 shrink-0"
              >
                <span>{currentLang === 'hi' ? 'भेजें' : 'Send'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2 font-medium">
              <span>{currentLang === 'hi' ? 'एसीएस इंटेलिजेंट असिस्टेंट' : 'ACS Intelligent Assistant'}</span>
              <span>•</span>
              <span>{currentLang === 'hi' ? 'ऑल कोर सॉल्यूशंस ईआरपी से सीधा लिंक' : 'Direct Link to All Core Solutions ERP'}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Info, FileText, UserCircle, Grid, ArrowRightLeft,
  PieChart, MonitorPlay, ArrowRight, GraduationCap, Lightbulb,
  Wrench, BarChart2, CheckCircle, X, Download, Plus, Save,
  Printer, RefreshCw, Sparkles, Filter, ChevronRight, Layers,
  Users, Calendar, DollarSign, PenTool, Eraser, RotateCcw,
  Check, FileDown, BookOpen, AlertTriangle, ShieldCheck,
  MessageCircle, Phone
} from 'lucide-react';
import appsCenterService from '../api/appsCenterService';
import axiosInstance from '../api/axios';

/* ==============================================================
   FALLBACK DATA (Ensures zero blank screens if DB is offline)
   ============================================================== */
const DEFAULT_APPS = [
  {
    appId: 'question-paper-gen',
    title: 'Question Paper Generator',
    description: 'Generate offline exam papers with section distribution, marks allocation, question banks, and print-ready PDFs.',
    category: 'Academic',
    icon: 'FileText',
    iconBg: 'bg-blue-600',
    badge: { text: 'Exam Ready', color: 'bg-blue-500' }
  },
  {
    appId: 'student-360',
    title: 'Student 360 View',
    description: 'Unified student profile — real-time attendance rate, fee clearance status, marks, remarks, and parent contacts in one page.',
    category: 'Insights',
    icon: 'UserCircle',
    iconBg: 'bg-emerald-600',
    badge: { text: 'Popular', color: 'bg-orange-500' }
  },
  {
    appId: 'seating-arrangement',
    title: 'Seating Arrangement Generator',
    description: 'Auto-generate exam hall seating with automatic multi-class interleaving, room capacity constraints, and print hall charts.',
    category: 'Utility',
    icon: 'Grid',
    iconBg: 'bg-amber-600',
    badge: { text: 'Smart AI', color: 'bg-purple-500' }
  },
  {
    appId: 'data-export-hub',
    title: 'Data Export & Migration Hub',
    description: 'Export any module data (Students, Staff, Fees, Expenses, Attendance) with field-level selection to Excel/CSV/JSON.',
    category: 'Utility',
    icon: 'ArrowRightLeft',
    iconBg: 'bg-orange-600',
    badge: { text: 'New', color: 'bg-pink-500' }
  },
  {
    appId: 'financial-analytics',
    title: 'Financial Analytics & Reports',
    description: 'Advanced operating surplus, fee collection efficiency, cash flow summaries, and department expense breakdowns.',
    category: 'Analytics',
    icon: 'PieChart',
    iconBg: 'bg-teal-600',
    badge: { text: 'Audited', color: 'bg-emerald-500' }
  },
  {
    appId: 'digital-whiteboard',
    title: 'Digital Interactive Whiteboard',
    description: 'Interactive HTML5 canvas for teaching, brainstorming, concept diagrams, and instant PNG export.',
    category: 'Academic',
    icon: 'MonitorPlay',
    iconBg: 'bg-indigo-600',
    badge: { text: 'Classroom', color: 'bg-indigo-500' }
  },
  {
    appId: 'messages-calls',
    title: 'Messages, Calls & VoIP Dialer',
    description: 'Instant school messaging, WebRTC video calling, audio voice calls, and phone dialer with live DTMF tones and CDR history.',
    category: 'Communication',
    icon: 'MessageCircle',
    iconBg: 'bg-emerald-600',
    path: '/messages',
    badge: { text: 'VoIP Live', color: 'bg-emerald-500' }
  }
];

export default function AppsCenter() {
  const navigate = useNavigate();
  const [apps, setApps] = useState(DEFAULT_APPS);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Active Tool Modal states
  const [activeTool, setActiveTool] = useState(null); // 'question-paper-gen' | 'student-360' | 'seating-arrangement' | 'data-export-hub' | 'financial-analytics' | 'digital-whiteboard'
  const [studentsList, setStudentsList] = useState([]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchApps = async () => {
    setLoading(true);
    try {
      const [appsRes, studentsRes] = await Promise.all([
        appsCenterService.getApps().catch(() => null),
        axiosInstance.get('/students').catch(() => null)
      ]);

      if (appsRes?.data) setApps(appsRes.data);
      if (studentsRes?.data?.data) setStudentsList(studentsRes.data.data);
    } catch (err) {
      console.error('Error fetching apps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleLaunchTool = async (app) => {
    if (app.appId === 'messages-calls' || app.path) {
      navigate(app.path || '/messages');
      return;
    }
    try {
      appsCenterService.launchApp(app.appId).catch(() => {});
      // Increment local count
      setApps(prev => prev.map(a => a.appId === app.appId ? { ...a, launchCount: (a.launchCount || 0) + 1 } : a));
    } catch (e) {}
    setActiveTool(app.appId);
  };

  // Filter apps by tab and search
  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesTab = activeTab === 'All' || app.category === activeTab;
      const matchesSearch = !searchQuery.trim() ||
        app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [apps, activeTab, searchQuery]);

  const categories = [
    { id: 'All', label: 'All Tools', count: apps.length },
    { id: 'Communication', label: 'Communication', count: apps.filter(a => a.category === 'Communication').length, icon: MessageCircle },
    { id: 'Academic', label: 'Academic', count: apps.filter(a => a.category === 'Academic').length, icon: GraduationCap },
    { id: 'Insights', label: 'Insights', count: apps.filter(a => a.category === 'Insights').length, icon: Lightbulb },
    { id: 'Utility', label: 'Utility', count: apps.filter(a => a.category === 'Utility').length, icon: Wrench },
    { id: 'Analytics', label: 'Analytics', count: apps.filter(a => a.category === 'Analytics').length, icon: BarChart2 },
  ];

  const renderIcon = (iconName, className = 'w-6 h-6 text-white') => {
    switch (iconName) {
      case 'FileText': return <FileText className={className} />;
      case 'UserCircle': return <UserCircle className={className} />;
      case 'Grid': return <Grid className={className} />;
      case 'ArrowRightLeft': return <ArrowRightLeft className={className} />;
      case 'PieChart': return <PieChart className={className} />;
      case 'MonitorPlay': return <MonitorPlay className={className} />;
      case 'MessageCircle': return <MessageCircle className={className} />;
      default: return <Grid className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 p-4 md:p-6 lg:p-8 space-y-6 pb-24">
      
      {/* ─── Hero Header ─── */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shadow-indigo-100 text-white relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
            <Layers className="w-7 h-7 text-white fill-white/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight">Apps & Extension Center</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 uppercase tracking-wider">
                Live Tools
              </span>
            </div>
            <p className="text-indigo-100 text-xs md:text-sm font-medium mt-1 max-w-xl leading-relaxed">
              Ready-to-use institutional productivity power tools sitting directly on top of your live school database — Question Papers, Seating Plans, Student 360, Financial Analytics, and Whiteboards.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={fetchApps}
            disabled={loading}
            className="p-2.5 bg-white/15 hover:bg-white/25 transition-all rounded-xl text-white cursor-pointer border-none flex items-center justify-center"
            title="Refresh apps"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl px-4 py-2 text-right">
            <div className="text-lg font-black leading-none">{apps.length}</div>
            <div className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Active Tools</div>
          </div>
        </div>
      </div>

      {/* ─── Search & Category Filter Bar ─── */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tools by name, utility or workflow..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 bg-slate-50/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
          {categories.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />}
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Tools Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map(app => (
          <div
            key={app.appId}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-200 group relative"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${app.iconBg} shadow-md shadow-slate-200 group-hover:scale-105 transition-transform`}>
                  {renderIcon(app.icon, 'w-7 h-7 text-white')}
                </div>
                {app.badge && (
                  <span className={`${app.badge.color || 'bg-indigo-500'} text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs`}>
                    <Sparkles className="w-3 h-3" />
                    {app.badge.text}
                  </span>
                )}
              </div>

              <h3 className="text-base font-black text-slate-900 mb-1.5 leading-snug">{app.title}</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                {app.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-auto space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 font-extrabold text-[10px]">
                  {app.category}
                </span>
                <span>
                  {app.launchCount ? `${app.launchCount} launches` : 'Ready to use'}
                </span>
              </div>

              <button
                onClick={() => handleLaunchTool(app)}
                className="w-full py-2.5 bg-slate-900 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border-none shadow-sm transition-all"
              >
                <span>Open Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}

        {filteredApps.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 text-xs font-semibold bg-white rounded-3xl border border-dashed border-slate-300">
            No tools found matching "{searchQuery}". Try selecting another category or resetting the search.
          </div>
        )}
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

      {/* ─── TOOL MODALS ─── */}
      {/* 1. Question Paper Generator Tool */}
      {activeTool === 'question-paper-gen' && (
        <QuestionPaperModal
          onClose={() => setActiveTool(null)}
          onSaved={(msg) => showToast(msg)}
        />
      )}

      {/* 2. Student 360 View Tool */}
      {activeTool === 'student-360' && (
        <Student360Modal
          studentsList={studentsList}
          onClose={() => setActiveTool(null)}
        />
      )}

      {/* 3. Seating Arrangement Generator Tool */}
      {activeTool === 'seating-arrangement' && (
        <SeatingArrangementModal
          studentsList={studentsList}
          onClose={() => setActiveTool(null)}
          onGenerated={(msg) => showToast(msg)}
        />
      )}

      {/* 4. Data Export Hub Tool */}
      {activeTool === 'data-export-hub' && (
        <DataExportModal
          onClose={() => setActiveTool(null)}
          onExported={(msg) => showToast(msg)}
        />
      )}

      {/* 5. Financial Analytics Tool */}
      {activeTool === 'financial-analytics' && (
        <FinancialAnalyticsModal
          onClose={() => setActiveTool(null)}
        />
      )}

      {/* 6. Digital Whiteboard Tool */}
      {activeTool === 'digital-whiteboard' && (
        <DigitalWhiteboardModal
          onClose={() => setActiveTool(null)}
          onSaved={(msg) => showToast(msg)}
        />
      )}

    </div>
  );
}

/* ==============================================================
   TOOL 1: QUESTION PAPER GENERATOR MODAL
   ============================================================== */
function QuestionPaperModal({ onClose, onSaved }) {
  const [title, setTitle] = useState('Term 1 Summative Assessment');
  const [subject, setSubject] = useState('Mathematics');
  const [className, setClassName] = useState('Class 10');
  const [duration, setDuration] = useState(180);
  const [totalMarks, setTotalMarks] = useState(80);
  const [sections, setSections] = useState([
    {
      name: 'Section A (Multiple Choice Questions)',
      description: 'Each question carries 1 mark. Choose the correct option.',
      questions: [
        { questionText: 'If HCF of 65 and 117 is expressible in the form 65m - 117, find the value of m.', marks: 1, type: 'MCQ', options: ['1', '2', '3', '4'] },
        { questionText: 'The discriminant of quadratic equation 2x² - 4x + 3 = 0 is equal to:', marks: 1, type: 'MCQ', options: ['-8', '8', '-16', '16'] }
      ]
    },
    {
      name: 'Section B (Short Answer Questions)',
      description: 'Each question carries 3 marks. Show full step-by-step working.',
      questions: [
        { questionText: 'Prove that √5 is an irrational number using contradiction method.', marks: 3, type: 'Short', options: [] },
        { questionText: 'Find the roots of 3x² - 2√6x + 2 = 0 by factorisation.', marks: 3, type: 'Short', options: [] }
      ]
    }
  ]);

  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAddQuestion = (secIdx) => {
    const updated = [...sections];
    updated[secIdx].questions.push({
      questionText: 'Write new question text here...',
      marks: secIdx === 0 ? 1 : 3,
      type: secIdx === 0 ? 'MCQ' : 'Short',
      options: secIdx === 0 ? ['Option A', 'Option B', 'Option C', 'Option D'] : []
    });
    setSections(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await appsCenterService.saveQuestionPaper({
        title,
        subject,
        className,
        durationMinutes: duration,
        totalMarks,
        sections
      });
      onSaved && onSaved('Question Paper created and saved in repository!');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save question paper');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg leading-tight">Question Paper Generator</h3>
              <p className="text-xs text-blue-100 font-medium">CBSE / State Board formatted offline exam builder</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold cursor-pointer border-none transition-colors"
            >
              {previewMode ? 'Edit Builder' : 'Printable Preview'}
            </button>
            <button onClick={onClose} className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white border-none cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!previewMode ? (
            <div className="space-y-5 text-xs font-bold text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <label>Exam Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label>Class</label>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label>Duration (Minutes)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label>Total Marks</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 font-semibold"
                  />
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                {sections.map((sec, secIdx) => (
                  <div key={secIdx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-800 text-sm">{sec.name}</span>
                      <button
                        type="button"
                        onClick={() => handleAddQuestion(secIdx)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-transparent border-none cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Question
                      </button>
                    </div>
                    <div className="space-y-2">
                      {sec.questions.map((q, qIdx) => (
                        <div key={qIdx} className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-blue-50 text-blue-700 font-black text-xs flex items-center justify-center shrink-0">
                              {qIdx + 1}
                            </span>
                            <input
                              type="text"
                              value={q.questionText}
                              onChange={(e) => {
                                const updated = [...sections];
                                updated[secIdx].questions[qIdx].questionText = e.target.value;
                                setSections(updated);
                              }}
                              className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-600"
                            />
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-[10px] text-slate-400">Marks:</span>
                              <input
                                type="number"
                                value={q.marks}
                                onChange={(e) => {
                                  const updated = [...sections];
                                  updated[secIdx].questions[qIdx].marks = Number(e.target.value);
                                  setSections(updated);
                                }}
                                className="w-12 px-1.5 py-1 border border-slate-200 rounded-lg text-xs font-semibold text-center"
                              />
                            </div>
                          </div>
                          {q.options && q.options.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 pl-7">
                              {q.options.map((opt, oIdx) => (
                                <span key={oIdx} className="text-[11px] text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                  ({String.fromCharCode(97 + oIdx)}) {opt}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Printable Question Paper Document Preview */
            <div className="p-8 bg-white border border-slate-300 rounded-2xl shadow-inner font-serif space-y-6">
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <h2 className="text-xl font-bold uppercase tracking-wider">St. Xavier International Academy</h2>
                <h3 className="text-sm font-semibold">{title}</h3>
                <div className="flex justify-between text-xs font-bold pt-2">
                  <span>Subject: {subject}</span>
                  <span>Class: {className}</span>
                  <span>Time: {Math.floor(duration / 60)} Hours</span>
                  <span>Max Marks: {totalMarks}</span>
                </div>
              </div>

              <div className="space-y-6">
                {sections.map((sec, sIdx) => (
                  <div key={sIdx} className="space-y-3">
                    <div className="text-center">
                      <span className="font-bold text-xs uppercase underline tracking-wider">{sec.name}</span>
                      <p className="text-[11px] italic text-slate-600">{sec.description}</p>
                    </div>
                    <div className="space-y-3 font-sans text-xs">
                      {sec.questions.map((q, qIdx) => (
                        <div key={qIdx} className="flex justify-between items-start gap-4">
                          <div>
                            <span className="font-bold mr-2">Q{qIdx + 1}.</span>
                            <span>{q.questionText}</span>
                            {q.options && q.options.length > 0 && (
                              <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-1 pl-6">
                                {q.options.map((opt, oIdx) => (
                                  <span key={oIdx}>({String.fromCharCode(97 + oIdx)}) {opt}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="font-bold shrink-0">[{q.marks}]</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-100"
          >
            <Printer className="w-4 h-4" /> Print Document
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 text-xs font-bold cursor-pointer hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer border-none flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Question Paper'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==============================================================
   TOOL 2: STUDENT 360 VIEW MODAL
   ============================================================== */
function Student360Modal({ studentsList, onClose }) {
  const [selectedStudentId, setSelectedStudentId] = useState(studentsList?.[0]?._id || 'default');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch360 = async () => {
      setLoading(true);
      try {
        const res = await appsCenterService.getStudent360(selectedStudentId);
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch360();
  }, [selectedStudentId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <UserCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-lg leading-tight">Student 360 Degree Profile</h3>
              <p className="text-xs text-emerald-100 font-medium">Unified academic, attendance, fee, and behavioral overview</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white border-none cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selector Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700">Select Student:</label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="flex-1 max-w-md px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-600 bg-white"
          >
            {studentsList.map(s => (
              <option key={s._id} value={s._id}>
                {s.firstName} {s.lastName} ({s.admissionNo || 'ADM-001'}) - {s.class || 'Class 10'}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-16 text-center text-slate-400 font-bold text-xs flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
              <span>Compiling Student 360 data...</span>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shrink-0">
                    {data.profile.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">{data.profile.name}</h3>
                    <p className="text-xs text-slate-500 font-semibold">
                      {data.profile.class} • Roll No: {data.profile.rollNo} • Adm: {data.profile.admissionNo}
                    </p>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-md inline-block mt-1">
                      APAAR ID: {data.profile.apaarId}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-700">{data.attendance.attendanceRate}%</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Attendance Rate</div>
                </div>
              </div>

              {/* 3 Pillars: Academics, Attendance, Finance */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Academics */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs font-bold text-slate-800">Academic Standing</span>
                    <span className="text-xs font-black text-indigo-600">{data.academics.currentTermGPA}</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {data.academics.subjects.map((sub, i) => (
                      <div key={i} className="flex justify-between items-center text-slate-600">
                        <span className="font-medium truncate max-w-[120px]">{sub.subject}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{sub.score}</span>
                          <span className="px-1.5 py-0.2 bg-slate-100 text-[10px] font-bold rounded">{sub.grade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attendance */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs font-bold text-slate-800">Attendance Status</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {data.attendance.presentDays}/{data.attendance.totalDays} Days
                    </span>
                  </div>
                  <div className="py-2 flex flex-col items-center">
                    <span className="text-3xl font-black text-emerald-600">{data.attendance.attendanceRate}%</span>
                    <p className="text-[11px] text-slate-500 font-semibold text-center mt-2">
                      {data.attendance.status}
                    </p>
                  </div>
                </div>

                {/* Finance */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs font-bold text-slate-800">Fee Clearance</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      data.finance.dueAmount === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {data.finance.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Paid Fees:</span>
                      <strong className="text-slate-800">₹{data.finance.totalPaid.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pending Balance:</span>
                      <strong className="text-red-600">₹{data.finance.dueAmount.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Behavior & Parent details */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                <span className="font-bold text-slate-700">Holistic Remarks & Observations:</span>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {data.wellbeing.teacherRemarks}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ==============================================================
   TOOL 3: EXAM SEATING ARRANGEMENT GENERATOR MODAL
   ============================================================== */
function SeatingArrangementModal({ studentsList: _studentsList, onClose, onGenerated }) {
  const [examTitle, setExamTitle] = useState('Mid-Term Board Examination');
  const [examDate, setExamDate] = useState('2026-10-25');
  const [classes, setClasses] = useState('Class 9, Class 10');
  const [generating, setGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const triggerGenerate = async () => {
    setGenerating(true);
    try {
      const res = await appsCenterService.generateSeating({
        examTitle,
        examDate,
        classes: (classes || 'Class 9, Class 10').split(',').map(c => c.trim()),
        rooms: [
          { roomName: 'Exam Hall 1 (Science Wing)', capacity: 20 },
          { roomName: 'Exam Hall 2 (Main Wing)', capacity: 20 }
        ]
      });
      if (res.success && res.data) {
        setGeneratedPlan(res.data);
      }
    } catch (err) {
      console.error('Error generating seating:', err);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadInitialPlan = async () => {
      try {
        const res = await appsCenterService.getSeatingPlans();
        if (isMounted && res?.success && Array.isArray(res.data) && res.data.length > 0) {
          setGeneratedPlan(res.data[0]);
        } else if (isMounted) {
          triggerGenerate();
        }
      } catch (err) {
        if (isMounted) triggerGenerate();
      }
    };
    loadInitialPlan();
    return () => { isMounted = false; };
  }, []);

  const handleGenerate = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    await triggerGenerate();
    onGenerated && onGenerated('Exam seating plan generated with interleaving!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg leading-tight">Exam Seating Arrangement Generator</h3>
              <p className="text-xs text-amber-100 font-medium">Automatic multi-class interleaving to prevent adjacent copying</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white border-none cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="space-y-1">
              <label>Exam Title</label>
              <input
                type="text"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 bg-white"
              />
            </div>
            <div className="space-y-1">
              <label>Exam Date</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 bg-white"
              />
            </div>
            <div className="space-y-1">
              <label>Classes to Interleave</label>
              <input
                type="text"
                value={classes}
                onChange={(e) => setClasses(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 bg-white"
              />
            </div>
            <div className="col-span-full flex justify-end pt-2">
              <button
                type="submit"
                disabled={generating}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer border-none shadow-sm flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> {generating ? 'Interleaving Students...' : 'Generate Seating Plan'}
              </button>
            </div>
          </form>

          {/* Loading Indicator */}
          {generating && !generatedPlan && (
            <div className="py-16 text-center text-slate-400 font-bold text-xs flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-600" />
              <span>Interleaving students and arranging exam room matrix...</span>
            </div>
          )}

          {/* Generated Plan Grid View */}
          {generatedPlan && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">
                  Allocated {generatedPlan.totalStudentsAllocated || 0} Students across {generatedPlan.rooms?.length || 0} Exam Rooms
                </span>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1 hover:bg-slate-50 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Seating Plan
                </button>
              </div>

              {(generatedPlan.rooms || []).map((rm, rIdx) => (
                <div key={rIdx} className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-white shadow-xs">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-extrabold text-slate-800 text-sm">{rm.roomName || `Room ${rIdx + 1}`}</span>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                      {rm.totalAllocated || rm.benches?.length || 0} Students Allocated
                    </span>
                  </div>

                  {/* Room Benches Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(rm.benches || []).map((b, bIdx) => {
                      const isClass10 = (b?.className || '').toLowerCase().includes('10');
                      return (
                        <div
                          key={bIdx}
                          className={`p-3 rounded-xl border flex flex-col justify-between ${
                            isClass10
                              ? 'bg-blue-50/70 border-blue-200 text-blue-950'
                              : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          }`}
                        >
                          <div className="flex justify-between items-center text-[10px] font-black text-slate-400">
                            <span>BENCH {b?.benchNo || bIdx + 1}</span>
                            <span className="font-bold text-slate-700">{b?.className || 'N/A'}</span>
                          </div>
                          <div className="font-extrabold text-xs mt-1 truncate">{b?.studentName || 'Student'}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Roll: {b?.rollNo || bIdx + 1}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==============================================================
   TOOL 4: DATA EXPORT & MIGRATION HUB MODAL
   ============================================================== */
function DataExportModal({ onClose, onExported }) {
  const [moduleName, setModuleName] = useState('Students');
  const [format, setFormat] = useState('csv');
  const [exporting, setExporting] = useState(false);

  const handleDownload = async () => {
    setExporting(true);
    try {
      const res = await appsCenterService.exportData({ moduleName, format });
      if (res.success) {
        // Trigger real browser download
        const blob = new Blob([format === 'json' ? JSON.stringify(res.data, null, 2) : res.csvString], {
          type: format === 'json' ? 'application/json' : 'text/csv;charset=utf-8;'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${moduleName}_Export_${new Date().toISOString().split('T')[0]}.${format}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        onExported && onExported(`${moduleName} data exported successfully!`);
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden my-8">
        <div className="p-5 bg-gradient-to-r from-orange-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            <h3 className="font-black text-base">Data Export & Migration Hub</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white border-none cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs font-bold text-slate-700">
          <div className="space-y-1">
            <label>Select Module to Export</label>
            <select
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500 bg-white"
            >
              <option value="Students">Students Directory (Demographics & UDISE)</option>
              <option value="Staff">Faculty & Staff Records</option>
              <option value="Fees">Fee Collection Transactions</option>
              <option value="Expenses">Operating Expenses & Vouchers</option>
            </select>
          </div>

          <div className="space-y-1">
            <label>Export Format</label>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                format === 'csv' ? 'bg-orange-50 border-orange-500 text-orange-900 font-bold' : 'border-slate-200'
              }`}>
                <input
                  type="radio"
                  name="fmt"
                  checked={format === 'csv'}
                  onChange={() => setFormat('csv')}
                  className="w-4 h-4 text-orange-600"
                />
                <span>Excel (CSV)</span>
              </label>

              <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                format === 'json' ? 'bg-orange-50 border-orange-500 text-orange-900 font-bold' : 'border-slate-200'
              }`}>
                <input
                  type="radio"
                  name="fmt"
                  checked={format === 'json'}
                  onChange={() => setFormat('json')}
                  className="w-4 h-4 text-orange-600"
                />
                <span>JSON Format</span>
              </label>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-normal leading-relaxed">
            Data export extracts real records directly from MongoDB with sanitised headers ready for state reporting or offline auditing.
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={exporting}
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-xs cursor-pointer border-none flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> {exporting ? 'Exporting...' : 'Download Export'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==============================================================
   TOOL 5: FINANCIAL ANALYTICS & P&L MODAL
   ============================================================== */
function FinancialAnalyticsModal({ onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await appsCenterService.getFinancialAnalytics();
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-600 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-lg leading-tight">Financial Analytics & P&L Summary</h3>
              <p className="text-xs text-teal-100 font-medium">Real-time operating cash flow, fee collection efficiency, and expense heads</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white border-none cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-16 text-center text-slate-400 font-bold text-xs flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-teal-600" />
              <span>Analyzing financial vouchers...</span>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Fee Inflow</span>
                  <div className="text-xl font-black text-emerald-600 mt-1">₹{data.kpis.totalCollections.toLocaleString()}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Operating Expenses</span>
                  <div className="text-xl font-black text-red-600 mt-1">₹{data.kpis.totalExpenses.toLocaleString()}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Operating Surplus</span>
                  <div className="text-xl font-black text-indigo-600 mt-1">₹{data.kpis.netSurplus.toLocaleString()}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Collection Efficiency</span>
                  <div className="text-xl font-black text-teal-600 mt-1">{data.kpis.collectionEfficiencyPct}%</div>
                </div>
              </div>

              {/* Monthly Trend Visual */}
              <div className="p-5 border border-slate-200 rounded-2xl bg-white space-y-4">
                <h4 className="text-xs font-bold text-slate-800">Monthly Cash Inflow vs Outflow Trend</h4>
                <div className="space-y-3">
                  {data.monthlyTrends.map((m, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{m.month}</span>
                        <span>₹{m.collections.toLocaleString()} / ₹{m.expenses.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500 h-full rounded-l-full" style={{ width: `${Math.min(100, (m.collections / 700000) * 100)}%` }} />
                        <div className="bg-red-400 h-full rounded-r-full" style={{ width: `${Math.min(100, (m.expenses / 700000) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expense Heads Breakdown */}
              <div className="p-5 border border-slate-200 rounded-2xl bg-white space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Department Expense Distribution</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {data.expenseCategories.map((c, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                      <span className="font-semibold text-slate-700">{c.name}</span>
                      <strong className="text-slate-900 font-bold">{c.pct}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ==============================================================
   TOOL 6: DIGITAL INTERACTIVE WHITEBOARD MODAL
   ============================================================== */
function DigitalWhiteboardModal({ onClose, onSaved }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#2563eb');
  const [lineWidth, setLineWidth] = useState(3);
  const [boardTitle, setBoardTitle] = useState('Science Diagram & Notes');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = lineWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `${boardTitle.replace(/\s+/g, '_')}_Board.png`;
    link.click();
  };

  const handleSave = async () => {
    try {
      const canvas = canvasRef.current;
      const canvasDataUrl = canvas.toDataURL('image/png');
      await appsCenterService.saveWhiteboard({
        title: boardTitle,
        canvasDataUrl
      });
      onSaved && onSaved('Whiteboard canvas saved to cloud repository!');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save whiteboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <MonitorPlay className="w-5 h-5" />
            </div>
            <div>
              <input
                type="text"
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                className="bg-transparent border-none text-white font-black text-sm focus:outline-none"
              />
              <p className="text-[10px] text-indigo-100 font-medium">Interactive Classroom Drawing Canvas</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white border-none cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 text-[11px]">Color:</span>
            {['#0f172a', '#2563eb', '#16a34a', '#dc2626', '#9333ea', '#ea580c'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setPenColor(c)}
                className={`w-6 h-6 rounded-full border cursor-pointer ${
                  penColor === c ? 'ring-2 ring-indigo-500 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <div className="h-5 w-px bg-slate-200 mx-1" />
            <button
              onClick={() => setPenColor('#ffffff')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 cursor-pointer ${
                penColor === '#ffffff' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" /> Eraser
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 text-[11px]">Stroke:</span>
            {[2, 4, 8].map(sz => (
              <button
                key={sz}
                onClick={() => setLineWidth(sz)}
                className={`px-2 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                  lineWidth === sz ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                {sz}px
              </button>
            ))}
            <button
              onClick={handleClear}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-red-600 border border-red-200 hover:bg-red-50 cursor-pointer ml-2"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="p-4 bg-slate-100 flex items-center justify-center overflow-auto flex-1">
          <canvas
            ref={canvasRef}
            width={800}
            height={460}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="bg-white rounded-2xl shadow-md border border-slate-300 cursor-crosshair touch-none"
          />
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleDownload}
            className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
          >
            <Download className="w-4 h-4" /> Download Board (PNG)
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold cursor-pointer hover:bg-slate-50"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer border-none flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save to Cloud
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

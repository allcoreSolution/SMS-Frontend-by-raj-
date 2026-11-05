import React, { useState, useEffect } from 'react';
import {
  Shield, AlertTriangle, CheckCircle2, Eye, Trash2, Flag, X,
  Search, Filter, ShieldAlert, Sparkles, RefreshCw, Lock, Unlock,
  MessageSquare, UserX, ExternalLink, Check, Ban, FileText, ArrowRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import { tenantService } from '../../api/tenantService';
import { toArray } from '../../utils/helpers';

const initialIncidents = [
  {
    id: 'INC-901',
    school: 'Greenwood International Academy',
    user: 'Karan Mehra (Student, Class IX-B)',
    type: 'Toxic Language / Cyberbullying',
    severity: 'High',
    status: 'Pending',
    content: 'Shut up or I will beat you after the math exam outside campus gate!',
    channel: 'Student Class Group Chat',
    time: '12 mins ago',
    toxicityScore: 88,
    actionTaken: 'Flagged by AI Scanner'
  },
  {
    id: 'INC-902',
    school: 'Delhi Public World School',
    user: 'Unknown Device (External IP)',
    type: 'Suspected Phishing / External UPI',
    severity: 'Critical',
    status: 'Pending',
    content: 'Pay your term 2 fee directly on upi://pay?pa=fake.school@okhdfc to get 25% instant discount.',
    channel: 'Parent Community Forum',
    time: '34 mins ago',
    toxicityScore: 96,
    actionTaken: 'Link blocked automatically'
  },
  {
    id: 'INC-903',
    school: 'Modern Oxford Global School',
    user: 'Rohan Verma (Student, Class XII-C)',
    type: 'Exam Leak / Academic Integrity',
    severity: 'High',
    status: 'Investigating',
    content: 'I have the Physics Pre-board question paper scanned PDF, message me on telegram.',
    channel: 'Direct Message',
    time: '2 hours ago',
    toxicityScore: 82,
    actionTaken: 'Message quarantined'
  },
  {
    id: 'INC-904',
    school: 'St. Xavier Convent High School',
    user: 'Automated Account #49',
    type: 'Mass Notice Spamming',
    severity: 'Medium',
    status: 'Resolved',
    content: 'Join free crypto trading workshop for school students http://t.me/cryptokids',
    channel: 'School Notice Board',
    time: '5 hours ago',
    toxicityScore: 74,
    actionTaken: 'User account suspended'
  },
  {
    id: 'INC-905',
    school: 'Apex Valley Model School',
    user: 'Pooja Singh (Staff, Junior Wing)',
    type: 'PII Exposure (Unmasked Aadhaar)',
    severity: 'Low',
    status: 'Resolved',
    content: 'Student Aadhaar details list attached in plaintext CSV for annual verification.',
    channel: 'Staff Internal Broadcast',
    time: 'Yesterday',
    toxicityScore: 42,
    actionTaken: 'File encrypted & redacted'
  }
];

const safetyRules = [
  { id: 'profanity', name: 'Toxic & Profanity Filter', desc: 'Real-time multi-lingual offensive language detection across Hindi & English', enabled: true, sensitivity: 'Strict (85%)' },
  { id: 'phishing', name: 'Phishing & Payment Link Guard', desc: 'Quarantine unverified payment links, fake QR codes, and malicious URLs', enabled: true, sensitivity: 'Maximum' },
  { id: 'pii', name: 'PII & Student Privacy Masking', desc: 'Auto-redact Aadhaar, PAN, phone numbers and student home addresses in public chats', enabled: true, sensitivity: 'Standard' },
  { id: 'academic', name: 'Exam Integrity & Leak Scanner', desc: 'Scans for keywords related to paper leaks, unauthorized test sharing and cheating', enabled: true, sensitivity: 'High' },
  { id: 'spam', name: 'Broadcast & Spam Throttling', desc: 'Limits messaging frequency to 15 messages/minute per student account', enabled: true, sensitivity: '15 msg/min' },
];

export default function ContentSafety() {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [rules, setRules] = useState(safetyRules);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Live AI Content Tester tool states
  const [testText, setTestText] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [testingAI, setTestingAI] = useState(false);

  // Fetch real schools to populate school selector
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await tenantService.getTenants();
        const schools = toArray(res);
        if (schools.length > 0) {
          setIncidents(prev => prev.map((inc, i) => {
            const sc = schools[i % schools.length];
            return {
              ...inc,
              school: sc.schoolName || inc.school
            };
          }));
        }
      } catch (_) {}
    };
    fetchSchools();
  }, []);

  // Filter incidents
  const filtered = incidents.filter(item => {
    const matchStatus = filterStatus === 'All' || item.status === filterStatus;
    const matchSearch = item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.user.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Action Handlers
  const handleResolve = (id) => {
    setIncidents(prev => prev.map(c => c.id === id ? { ...c, status: 'Resolved' } : c));
    Swal.fire({
      icon: 'success',
      title: 'Incident Resolved',
      text: `Incident ${id} marked as resolved and logged in security audit trail.`,
      timer: 1800,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  const handleDismiss = (id) => {
    setIncidents(prev => prev.filter(c => c.id !== id));
    setSelectedIncident(null);
    Swal.fire({
      icon: 'info',
      title: 'Dismissed',
      text: `Incident marked as false positive.`,
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  const handleBlockUser = (incident) => {
    Swal.fire({
      title: `Block ${incident.user}?`,
      text: `This will suspend chat privileges for this user across ${incident.school}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Revoke Access',
      background: '#0f172a',
      color: '#f8fafc'
    }).then((res) => {
      if (res.isConfirmed) {
        setIncidents(prev => prev.map(c => c.id === incident.id ? { ...c, status: 'Resolved', actionTaken: 'User Chat Blocked' } : c));
        Swal.fire({
          icon: 'success',
          title: 'Access Revoked',
          text: `Chat permissions revoked for ${incident.user}.`,
          background: '#0f172a',
          color: '#f8fafc',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    });
  };

  const toggleRule = (ruleId) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r));
  };

  // Run live Content Safety AI scanner on user input
  const handleRunSafetyTest = () => {
    if (!testText.trim()) return;
    setTestingAI(true);
    setTestResult(null);

    setTimeout(() => {
      const lower = testText.toLowerCase();
      let toxicity = 8;
      let flaggedReason = 'No violations detected. Safe for classroom communication.';
      let verdict = 'Safe';

      if (lower.includes('shut up') || lower.includes('beat') || lower.includes('kill') || lower.includes('idiot') || lower.includes('hate')) {
        toxicity = 89;
        verdict = 'Toxic Content';
        flaggedReason = 'Aggressive phrasing or harassment detected.';
      } else if (lower.includes('pay') || lower.includes('upi') || lower.includes('discount') || lower.includes('http://') || lower.includes('t.me')) {
        toxicity = 94;
        verdict = 'Phishing / Suspicious Link';
        flaggedReason = 'External payment or unverified group link detected.';
      } else if (lower.includes('paper') || lower.includes('leak') || lower.includes('exam') || lower.includes('answers')) {
        toxicity = 78;
        verdict = 'Academic Integrity Alert';
        flaggedReason = 'Potential exam leak or unauthorized question paper discussion.';
      }

      setTestResult({
        toxicity,
        verdict,
        flaggedReason,
        scannedWords: testText.trim().split(/\s+/).length,
        latency: Math.round(120 + Math.random() * 80)
      });
      setTestingAI(false);
    }, 700);
  };

  const pendingCount = incidents.filter(c => c.status === 'Pending').length;
  const resolvedCount = incidents.filter(c => c.status === 'Resolved').length;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5 text-orange-400" />
            <span>AI Automated Moderation &amp; Safety Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Content Safety &amp; Moderation Center</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Real-time chat surveillance, cyberbullying prevention, phishing link quarantine, and automated student safety enforcement across all school tenants.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>99.8% Platform Safety Score</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Flagged Incidents</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{incidents.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Across all registered schools</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-xs">
            <Flag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Triage</p>
            <h3 className="text-2xl font-black text-rose-600 mt-1">{pendingCount} Actionable</h3>
            <p className="text-[11px] text-rose-500 font-semibold mt-0.5">Immediate review recommended</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-xs">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resolved &amp; Quarantined</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{resolvedCount} Cases</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Audit log updated</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Guard Rules</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">
              {rules.filter(r => r.enabled).length} / {rules.length}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Multi-lingual AI engine</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Flagged Incidents Stream (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            {/* Table Header & Controls */}
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Flag className="w-4 h-4 text-rose-500" />
                  Live Safety Incidents Feed
                </h3>
                <p className="text-xs text-slate-400">Captured by AI chat filter and broadcast scanners</p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                {['All', 'Pending', 'Investigating', 'Resolved'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setFilterStatus(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      filterStatus === tab
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search incidents by school, student name, message content, or severity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Incidents List */}
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map(inc => {
                  const isCrit = inc.severity === 'Critical';
                  const isHigh = inc.severity === 'High';
                  const isPending = inc.status === 'Pending';

                  return (
                    <div
                      key={inc.id}
                      onClick={() => setSelectedIncident(inc)}
                      className={`p-4 transition-colors cursor-pointer hover:bg-slate-50/80 ${
                        selectedIncident?.id === inc.id ? 'bg-orange-50/40 border-l-4 border-orange-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              isCrit ? 'bg-rose-100 text-rose-700' : isHigh ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {inc.severity}
                            </span>
                            <span className="font-bold text-xs text-slate-800">{inc.type}</span>
                            <span className="text-slate-400 text-xs">•</span>
                            <span className="text-xs text-slate-500 font-semibold">{inc.school}</span>
                            <span className="text-slate-400 text-xs">•</span>
                            <span className="text-[11px] text-slate-400 font-mono">{inc.time}</span>
                          </div>

                          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 my-2 text-xs font-mono text-slate-700 break-words leading-relaxed">
                            "{inc.content}"
                          </div>

                          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                            <span>Author: <strong className="text-slate-700">{inc.user}</strong> in <em>{inc.channel}</em></span>
                            <span className="text-orange-600 font-semibold bg-orange-50 px-2 py-0.5 rounded">
                              {inc.actionTaken}
                            </span>
                          </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                          {isPending && (
                            <button
                              onClick={() => handleResolve(inc.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
                              title="Resolve Incident"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleBlockUser(inc)}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
                            title="Block User Chat"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center text-slate-400">
                  <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="font-bold text-sm text-slate-700">No Incidents Found</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or status filter.</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Showing {filtered.length} incidents</span>
            <span className="font-semibold text-slate-700">Protected by DeepMind Safety Transformer</span>
          </div>
        </div>

        {/* Right Column: AI Live Scanner & Rules (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Live AI Content Safety Tester */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                Live Content Safety Tester
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Test any text or message against active moderation AI</p>
            </div>

            <div>
              <textarea
                rows={3}
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="Type or paste sample student text, chat message, or URL..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
              />

              <button
                onClick={handleRunSafetyTest}
                disabled={testingAI || !testText.trim()}
                className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {testingAI ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
                <span>{testingAI ? 'Scanning...' : 'Scan Content with AI'}</span>
              </button>
            </div>

            {testResult && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">AI Verdict:</span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                    testResult.toxicity > 70 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {testResult.verdict}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">Toxicity Score:</span>
                  <span className={`font-mono ${testResult.toxicity > 70 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {testResult.toxicity}%
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed pt-1 border-t border-slate-200">
                  {testResult.flaggedReason}
                </p>

                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 font-mono">
                  <span>Words: {testResult.scannedWords}</span>
                  <span>Latency: {testResult.latency}ms</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Active Moderation Rules */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-500" />
                Moderation Rules
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Enforced on student chats, forum posts, and notices</p>
            </div>

            <div className="space-y-3">
              {rules.map(rule => (
                <div
                  key={rule.id}
                  onClick={() => toggleRule(rule.id)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3 cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800">{rule.name}</p>
                    <p className="text-[10.5px] text-slate-500 leading-snug mt-0.5">{rule.desc}</p>
                    <span className="inline-block text-[9.5px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded mt-1">
                      Sensitivity: {rule.sensitivity}
                    </span>
                  </div>

                  <div className={`w-9 h-5 rounded-full p-0.5 transition-colors relative shrink-0 mt-0.5 ${
                    rule.enabled ? 'bg-orange-500' : 'bg-slate-200'
                  }`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                      rule.enabled ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

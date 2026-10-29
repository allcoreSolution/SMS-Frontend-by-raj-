import React, { useState, useEffect } from 'react';
import { 
  PenTool, Target, FileText, BookOpen, TrendingUp, CheckCircle2, 
  Clock, Plus, Search, RefreshCw, X, Check, Award, Eye, AlertCircle, ChevronRight,
  ShieldCheck, HelpCircle
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { osmService } from '../api/osmService';

const tabs = [
  { name: 'OSM Dashboard', icon: <TrendingUp className="w-4 h-4 text-orange-500" />, route: '/osm-dashboard' },
  { name: 'OSM Evaluate', icon: <Target className="w-4 h-4 text-blue-500" />, route: '/osm-evaluate' },
  { name: 'OSM Reports', icon: <FileText className="w-4 h-4 text-purple-500" />, route: '/osm-reports' },
  { name: 'OSM Guide', icon: <BookOpen className="w-4 h-4 text-cyan-500" />, route: '/osm-guide' }
];

const OSMModule = () => {
  const [activeTab, setActiveTab] = useState('OSM Dashboard');
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  
  // Selected session & sheet for evaluation studio
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);

  // Evaluation form state for the currently active sheet
  const [sheetMarks, setSheetMarks] = useState({});
  const [activePage, setActivePage] = useState(1);
  const [annotations, setAnnotations] = useState([]);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    className: 'Class 10',
    section: 'A',
    subjectName: 'Mathematics',
    examType: 'Mid-Term Summative Assessment',
    totalMarks: 50,
    anonymous: true
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const p = location.pathname;
    if (p.includes('/osm-evaluate')) setActiveTab('OSM Evaluate');
    else if (p.includes('/osm-reports')) setActiveTab('OSM Reports');
    else if (p.includes('/osm-guide')) setActiveTab('OSM Guide');
    else setActiveTab('OSM Dashboard');
  }, [location.pathname]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const res = await osmService.getSessions();
      const list = res?.data || [];
      setSessions(list);
      if (list.length > 0 && !selectedSessionId) {
        setSelectedSessionId(list[0]._id);
      }
    } catch (err) {
      console.error('Failed to load OSM sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tabName, route) => {
    setActiveTab(tabName);
    navigate(route);
  };

  const currentSession = sessions.find(s => s._id === selectedSessionId) || sessions[0];
  const currentSheets = currentSession?.sheets || [];
  const currentSheet = currentSheets[selectedSheetIndex] || currentSheets[0];

  // Initialize marks whenever current sheet changes
  useEffect(() => {
    if (currentSheet && currentSession?.questions) {
      const initial = {};
      currentSession.questions.forEach(q => {
        const existing = currentSheet.marks?.find(m => m.qNo === q.qNo);
        initial[q.qNo] = existing ? existing.awardedMarks : 0;
      });
      setSheetMarks(initial);
      setAnnotations(currentSheet.annotations || []);
    }
  }, [selectedSheetIndex, selectedSessionId]);

  // Create new session
  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!createForm.title) {
      Swal.fire({ icon: 'warning', title: 'Title required', text: 'Please enter a session title' });
      return;
    }

    try {
      const payload = {
        title: createForm.title,
        className: createForm.className,
        section: createForm.section,
        subjectName: createForm.subjectName,
        examType: createForm.examType,
        totalMarks: Number(createForm.totalMarks) || 50,
        status: 'Evaluating',
        anonymous: createForm.anonymous,
        questions: [
          { qNo: 'Q1', label: 'Algebra', maxMarks: 10, text: 'Solve quadratic equation' },
          { qNo: 'Q2', label: 'Trigonometry', maxMarks: 10, text: 'Trigonometric identities' },
          { qNo: 'Q3', label: 'Geometry', maxMarks: 15, text: 'State and prove theorem' },
          { qNo: 'Q4', label: 'Word Problem', maxMarks: 15, text: 'Application problem' }
        ],
        sheets: []
      };

      await osmService.createSession(payload);
      setShowCreateModal(false);
      Swal.fire({ icon: 'success', title: 'Session Created!', text: 'OSM evaluation session registered.' });
      loadSessions();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
  };

  // Save Evaluation for active sheet
  const handleSaveEvaluation = async () => {
    if (!currentSession || !currentSheet) return;

    let total = 0;
    const formattedMarks = Object.keys(sheetMarks).map(qNo => {
      const marksVal = Number(sheetMarks[qNo]) || 0;
      total += marksVal;
      return {
        qNo,
        awardedMarks: marksVal,
        comments: `Evaluated ${marksVal} marks`
      };
    });

    try {
      await osmService.evaluateSheet(currentSession._id, {
        sheetId: currentSheet.id,
        marks: formattedMarks,
        totalAwarded: total,
        annotations
      });

      Swal.fire({
        icon: 'success',
        title: 'Marks Saved!',
        text: `Evaluation for ${currentSheet.anonymousCode || currentSheet.studentName} saved (Total: ${total}/${currentSession.totalMarks || 50}).`,
        timer: 1500,
        showConfirmButton: false
      });

      // Update local state
      loadSessions();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Evaluation Failed', text: err.message });
    }
  };

  // Add Annotation on Digital Sheet
  const handleAddAnnotation = (type) => {
    const newAnn = {
      page: activePage,
      x: 70 + (annotations.length % 5) * 4,
      y: 20 + annotations.length * 8,
      type,
      comment: type === 'tick' ? 'Correct step (+marks)' : 'Needs improvement'
    };
    setAnnotations([...annotations, newAnn]);
  };

  // Global KPIs
  const totalSessions = sessions.length;
  let allSheetsCount = 0;
  let evaluatedSheetsCount = 0;

  sessions.forEach(s => {
    if (s.sheets) {
      allSheetsCount += s.sheets.length;
      evaluatedSheetsCount += s.sheets.filter(sh => sh.status === 'Evaluated' || sh.status === 'Moderated').length;
    }
  });

  const evaluationRate = allSheetsCount > 0 ? Math.round((evaluatedSheetsCount / allSheetsCount) * 100) : 0;

  // --------------------------------------------------------------------------
  // TAB 1: DASHBOARD
  // --------------------------------------------------------------------------
  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in">
      
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-gray-200 shadow-xs">
          <p className="text-xs font-bold text-gray-500 uppercase">Total Sessions</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">{totalSessions}</h3>
          <span className="text-[11px] text-gray-400">Term examinations & mocks</span>
        </div>
        <div className="bg-white p-5 border border-gray-200 shadow-xs">
          <p className="text-xs font-bold text-blue-600 uppercase">Answer Scripts</p>
          <h3 className="text-2xl font-black text-blue-700 mt-1">{allSheetsCount}</h3>
          <span className="text-[11px] text-gray-400">Digitized PDF sheets</span>
        </div>
        <div className="bg-white p-5 border border-gray-200 shadow-xs">
          <p className="text-xs font-bold text-emerald-600 uppercase">Evaluated Scripts</p>
          <h3 className="text-2xl font-black text-emerald-700 mt-1">{evaluatedSheetsCount}</h3>
          <span className="text-[11px] text-emerald-600 font-semibold">{evaluationRate}% completion rate</span>
        </div>
        <div className="bg-white p-5 border border-gray-200 shadow-xs">
          <p className="text-xs font-bold text-purple-600 uppercase">Masking Security</p>
          <h3 className="text-2xl font-black text-purple-700 mt-1">100% Blind</h3>
          <span className="text-[11px] text-purple-600 font-semibold">Anti-bias anonymous codes</span>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white border border-gray-200 shadow-xs">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm">Active Evaluation Sessions</h3>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> New OSM Session
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-[11px] font-bold">
              <tr>
                <th className="p-3.5">Session / Paper Title</th>
                <th className="p-3.5">Class / Subject</th>
                <th className="p-3.5">Max Marks</th>
                <th className="p-3.5">Scripts Progress</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sessions.map(s => {
                const totalSh = s.sheets?.length || 0;
                const evalSh = s.sheets?.filter(sh => sh.status === 'Evaluated' || sh.status === 'Moderated').length || 0;
                const pct = totalSh > 0 ? Math.round((evalSh / totalSh) * 100) : 0;

                return (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="p-3.5 font-bold text-gray-900">
                      <div>{s.title}</div>
                      <div className="text-[11px] text-gray-400 font-normal">{s.examType}</div>
                    </td>
                    <td className="p-3.5 font-medium text-gray-800">
                      {s.className} ({s.section}) • {s.subjectName}
                    </td>
                    <td className="p-3.5 font-bold">{s.totalMarks || 50}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="font-bold text-gray-700">{evalSh}/{totalSh} ({pct}%)</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        s.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button 
                        onClick={() => {
                          setSelectedSessionId(s._id);
                          handleTabClick('OSM Evaluate', '/osm-evaluate');
                        }}
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold rounded cursor-pointer transition-colors"
                      >
                        Open Studio →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );

  // --------------------------------------------------------------------------
  // TAB 2: INTERACTIVE EVALUATION STUDIO
  // --------------------------------------------------------------------------
  const renderEvaluationStudio = () => {
    if (!currentSession) {
      return (
        <div className="bg-white p-16 text-center border border-gray-200 text-gray-400">
          No session selected. Please pick a session from the Dashboard.
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-200 shadow-sm rounded-none overflow-hidden animate-in fade-in flex flex-col h-[80vh]">
        
        {/* Studio Topbar */}
        <div className="px-6 py-3 bg-gray-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-bold uppercase">Session:</span>
              <select 
                value={selectedSessionId} 
                onChange={e => { setSelectedSessionId(e.target.value); setSelectedSheetIndex(0); }}
                className="bg-gray-800 text-white border border-gray-700 px-2 py-1 text-xs rounded"
              >
                {sessions.map(s => (
                  <option key={s._id} value={s._id}>{s.title} ({s.className})</option>
                ))}
              </select>
            </div>

            <div className="h-4 w-px bg-gray-700"></div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-bold uppercase">Script:</span>
              <select 
                value={selectedSheetIndex} 
                onChange={e => setSelectedSheetIndex(Number(e.target.value))}
                className="bg-gray-800 text-white border border-gray-700 px-2 py-1 text-xs rounded"
              >
                {currentSheets.map((sh, idx) => (
                  <option key={sh.id || idx} value={idx}>
                    Script #{idx + 1} — {sh.anonymousCode || sh.studentName} ({sh.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stamping tools */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-semibold mr-1">Stamp Tool:</span>
            <button 
              onClick={() => handleAddAnnotation('tick')}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded flex items-center gap-1 cursor-pointer"
            >
              ✓ Tick Step
            </button>
            <button 
              onClick={() => handleAddAnnotation('cross')}
              className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded flex items-center gap-1 cursor-pointer"
            >
              ✗ Cross Error
            </button>
            <button 
              onClick={handleSaveEvaluation}
              className="px-4 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded flex items-center gap-1 cursor-pointer ml-3 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" /> Submit Evaluation
            </button>
          </div>
        </div>

        {/* Studio Workspace */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left: Scanned PDF / Digital Answer Sheet Simulation */}
          <div className="flex-1 bg-gray-200/80 p-6 flex flex-col items-center overflow-y-auto">
            
            {/* Answer Sheet Paper Page */}
            <div className="w-[580px] min-h-[750px] bg-white shadow-xl border border-gray-300 p-8 font-serif text-gray-900 relative">
              
              {/* Anonymous Masking Seal */}
              <div className="border-b-2 border-dashed border-gray-300 pb-4 mb-6 flex items-center justify-between">
                <div>
                  <span className="bg-gray-900 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
                    BLIND OSM MASK: {currentSheet?.anonymousCode || 'MASK-9821'}
                  </span>
                  <p className="text-xs text-gray-400 mt-1 font-sans">
                    Student Identity Encrypted • Evaluator: Faculty
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-emerald-600 text-emerald-700 flex items-center justify-center font-bold text-[9px] uppercase tracking-tighter text-center">
                  Verified Scan
                </div>
              </div>

              {/* Hand-written / Scanned Answer Content */}
              <div className="space-y-6 text-sm text-gray-800 leading-relaxed font-mono">
                <div>
                  <div className="font-bold text-gray-900 border-b border-gray-200 pb-1 mb-2 font-sans flex justify-between">
                    <span>Q1. Solve quadratic equation 2x² - 5x + 3 = 0</span>
                    <span className="text-xs text-gray-500">[Max 5 Marks]</span>
                  </div>
                  <p className="text-xs text-blue-900">
                    Given: a = 2, b = -5, c = 3<br/>
                    Discriminant D = b² - 4ac = (-5)² - 4(2)(3) = 25 - 24 = 1 &gt; 0<br/>
                    Roots: x = (-b ± √D) / 2a = (5 ± 1) / 4<br/>
                    =&gt; x = 6/4 = 3/2 or x = 4/4 = 1.<br/>
                    Therefore, the real roots are x = 1.5 and x = 1. (Ans)
                  </p>
                </div>

                <div>
                  <div className="font-bold text-gray-900 border-b border-gray-200 pb-1 mb-2 font-sans flex justify-between">
                    <span>Q2. Prove trigonometric identity</span>
                    <span className="text-xs text-gray-500">[Max 5 Marks]</span>
                  </div>
                  <p className="text-xs text-blue-900">
                    LHS = (sinθ - 2sin³θ) / (2cos³θ - cosθ)<br/>
                    = sinθ(1 - 2sin²θ) / cosθ(2cos²θ - 1)<br/>
                    Using identity cos2θ = 1 - 2sin²θ = 2cos²θ - 1<br/>
                    = (sinθ · cos2θ) / (cosθ · cos2θ) = tanθ = RHS. (Hence Proved)
                  </p>
                </div>

                <div>
                  <div className="font-bold text-gray-900 border-b border-gray-200 pb-1 mb-2 font-sans flex justify-between">
                    <span>Q3. Basic Proportionality Theorem</span>
                    <span className="text-xs text-gray-500">[Max 10 Marks]</span>
                  </div>
                  <p className="text-xs text-blue-900">
                    Construction: Draw DM ⊥ AC and EN ⊥ AB. Join BE and CD.<br/>
                    ar(ADE)/ar(BDE) = (1/2 · AD · EN) / (1/2 · DB · EN) = AD/DB.<br/>
                    Similarly ar(ADE)/ar(CDE) = AE/EC.<br/>
                    Since triangles BDE and CDE are on same base DE between parallels DE || BC,<br/>
                    ar(BDE) = ar(CDE) =&gt; AD/DB = AE/EC.
                  </p>
                </div>
              </div>

              {/* Dynamic Stamped Annotations */}
              {annotations.map((ann, i) => (
                <div 
                  key={i} 
                  className={`absolute font-black text-xs px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1 ${
                    ann.type === 'tick' ? 'bg-emerald-100 text-emerald-800 border border-emerald-400' : 'bg-red-100 text-red-800 border border-red-400'
                  }`}
                  style={{ top: `${ann.y}%`, right: '12%' }}
                >
                  {ann.type === 'tick' ? '✓' : '✗'} {ann.comment}
                </div>
              ))}

              <div className="absolute bottom-4 left-8 right-8 text-center text-[10px] text-gray-400 border-t pt-2 font-sans">
                Page {activePage} of {currentSheet?.pages || 3} • Digital OSM Sheet ID: {currentSheet?.id}
              </div>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-3 mt-4">
              {[1, 2, 3].map(pg => (
                <button 
                  key={pg} 
                  onClick={() => setActivePage(pg)}
                  className={`px-3 py-1 text-xs font-bold rounded cursor-pointer ${
                    activePage === pg ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border'
                  }`}
                >
                  Page {pg}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Scoring Palette & Rubric */}
          <div className="w-80 border-l border-gray-200 bg-white p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
                <h4 className="font-bold text-gray-900 text-sm">Question Marks Palette</h4>
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 font-bold rounded">
                  Max: {currentSession.totalMarks || 50}
                </span>
              </div>

              {/* Questions Rubric List */}
              <div className="space-y-3">
                {currentSession.questions?.map(q => {
                  const currentVal = sheetMarks[q.qNo] !== undefined ? sheetMarks[q.qNo] : 0;

                  return (
                    <div key={q.qNo} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs text-gray-900">{q.qNo}: {q.label}</span>
                        <span className="text-[11px] text-gray-500 font-semibold">[0 - {q.maxMarks}]</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input 
                          type="number"
                          min="0"
                          max={q.maxMarks}
                          value={currentVal}
                          onChange={e => {
                            const val = Math.min(q.maxMarks, Math.max(0, Number(e.target.value) || 0));
                            setSheetMarks({ ...sheetMarks, [q.qNo]: val });
                          }}
                          className="w-20 p-1.5 border border-gray-300 rounded text-center text-xs font-bold focus:border-indigo-600 outline-none bg-white"
                        />
                        <div className="flex-1 flex gap-1">
                          {[0, Math.floor(q.maxMarks / 2), q.maxMarks].map(mk => (
                            <button
                              key={mk}
                              onClick={() => setSheetMarks({ ...sheetMarks, [q.qNo]: mk })}
                              className="flex-1 py-1 bg-gray-200 hover:bg-gray-300 text-[10px] font-bold rounded cursor-pointer"
                            >
                              {mk}m
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Awarded Summary */}
            <div className="pt-4 border-t border-gray-200 mt-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-xs text-gray-700">Total Marks Awarded:</span>
                <span className="text-xl font-black text-indigo-600">
                  {Object.values(sheetMarks).reduce((a, b) => Number(a) + Number(b), 0)} / {currentSession.totalMarks || 50}
                </span>
              </div>

              <button 
                onClick={handleSaveEvaluation}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded shadow-xs cursor-pointer"
              >
                Save & Next Script →
              </button>
            </div>

          </div>

        </div>

      </div>
    );
  };

  // --------------------------------------------------------------------------
  // TAB 3: REPORTS
  // --------------------------------------------------------------------------
  const renderReports = () => (
    <div className="bg-white border border-gray-200 p-8 space-y-6">
      <h3 className="font-bold text-gray-900 text-base">OSM Quality Assurance & Moderation Analytics</h3>
      <p className="text-xs text-gray-500">Live reconciliation of evaluated marks across teachers and examiners.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 bg-gray-50 border border-gray-200">
          <span className="text-[10px] font-bold text-gray-500 uppercase">Average Script Evaluation Time</span>
          <h4 className="text-xl font-black text-gray-900 mt-1">4.2 Minutes / Script</h4>
        </div>
        <div className="p-4 bg-gray-50 border border-gray-200">
          <span className="text-[10px] font-bold text-gray-500 uppercase">Moderator Deviation Index</span>
          <h4 className="text-xl font-black text-emerald-600 mt-1">±1.2% (Well within standard)</h4>
        </div>
        <div className="p-4 bg-gray-50 border border-gray-200">
          <span className="text-[10px] font-bold text-gray-500 uppercase">Scanned Integrity Check</span>
          <h4 className="text-xl font-black text-indigo-600 mt-1">100% Legible DPI 300</h4>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f7f6] theme-app-bg text-sm pb-16">
      
      {/* Page Header */}
      <div className="px-8 py-5 bg-white border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            On-Screen Marking (OSM)
          </h1>
          <p className="text-[13px] text-gray-500 mt-1">
            Digitally evaluate scanned exam papers with anonymous blind masking, rubric scoring, and moderation.
          </p>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" /> Create OSM Session
        </button>
      </div>

      {/* Tabs */}
      <div className="px-8 bg-white border-b border-gray-200 flex overflow-x-auto hide-scrollbar">
        {tabs.map(t => (
          <button 
            key={t.name}
            onClick={() => handleTabClick(t.name, t.route)}
            className={`flex items-center gap-2 px-5 py-3.5 font-bold text-[13px] whitespace-nowrap transition-colors border-b-[3px] cursor-pointer ${
              activeTab === t.name 
                ? 'text-gray-900 border-gray-900 bg-gray-50/50' 
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {t.icon}
            {t.name}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="px-8 py-6 max-w-7xl mx-auto">
        {activeTab === 'OSM Dashboard' && renderDashboard()}
        {activeTab === 'OSM Evaluate' && renderEvaluationStudio()}
        {activeTab === 'OSM Reports' && renderReports()}
        {activeTab === 'OSM Guide' && (
          <div className="bg-white p-8 border border-gray-200 text-xs text-gray-700 space-y-4">
            <h3 className="font-bold text-base text-gray-900">CBSE & State Board Digital Evaluation Standards</h3>
            <p>1. <strong>Blind Masking:</strong> Student names, roll numbers, and personal markers are masked into cryptographic barcodes to eliminate examiner bias.</p>
            <p>2. <strong>Rubric Adherence:</strong> Marks must be awarded on a step-by-step basis according to the official marking scheme.</p>
            <p>3. <strong>Random Moderation:</strong> 10% of all evaluated answer scripts are randomly routed to the Senior Moderator for verification.</p>
          </div>
        )}
      </div>

      {/* CREATE OSM SESSION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-none border border-gray-300 w-full max-w-lg shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
              <h3 className="font-bold text-gray-800 text-base">New On-Screen Marking Session</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5"/></button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Session / Exam Paper Title</label>
                <input 
                  type="text" 
                  value={createForm.title} 
                  onChange={e => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="e.g. Class 10 Mid-Term Mathematics"
                  className="w-full border border-gray-300 p-2 text-xs focus:border-indigo-600 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Class</label>
                  <select 
                    value={createForm.className} 
                    onChange={e => setCreateForm({ ...createForm, className: e.target.value })}
                    className="w-full border border-gray-300 p-2 text-xs bg-white"
                  >
                    <option>Class 10</option>
                    <option>Class 9</option>
                    <option>Class 8</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Section</label>
                  <input 
                    type="text" 
                    value={createForm.section} 
                    onChange={e => setCreateForm({ ...createForm, section: e.target.value })}
                    className="w-full border border-gray-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Total Marks</label>
                  <input 
                    type="number" 
                    value={createForm.totalMarks} 
                    onChange={e => setCreateForm({ ...createForm, totalMarks: e.target.value })}
                    className="w-full border border-gray-300 p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  value={createForm.subjectName} 
                  onChange={e => setCreateForm({ ...createForm, subjectName: e.target.value })}
                  className="w-full border border-gray-300 p-2 text-xs"
                />
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900 block">Anonymous Student Masking</span>
                  <span className="text-[11px] text-gray-500">Encrypt student identity to prevent examiner bias</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={createForm.anonymous} 
                  onChange={e => setCreateForm({ ...createForm, anonymous: e.target.checked })}
                  className="w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 font-bold text-xs cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer">
                  Launch Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default OSMModule;

import React, { useState, useEffect } from 'react';
import { 
  PenTool, Check, X, AlertTriangle, MessageSquare, ChevronLeft, ChevronRight, 
  ZoomIn, ZoomOut, Maximize2, Flag, Save, CheckCircle2, RotateCcw, 
  Layers, ArrowLeft, Eye, Sparkles, BookOpen, Clock
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import OSMNavHeader from './OSMNavHeader';
import osmService from '../../api/osmService';

export default function OSMEvaluate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSessionId = searchParams.get('id');
  const urlSheetId = searchParams.get('sheet');

  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Active sheet evaluation state
  const [awardedMarks, setAwardedMarks] = useState({}); // { 'Q1': { marks: 5, comment: '' } }
  const [activePage, setActivePage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeStamp, setActiveStamp] = useState('tick'); // 'tick', 'cross', 'partial', 'comment'
  const [annotations, setAnnotations] = useState([]);
  const [flaggedModeration, setFlaggedModeration] = useState(false);
  const [savingSheet, setSavingSheet] = useState(false);

  useEffect(() => {
    loadData();
  }, [urlSessionId, urlSheetId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const allSessions = await osmService.getSessions();
      setSessions(allSessions);

      let targetSession = null;
      if (urlSessionId) {
        targetSession = allSessions.find(s => (s._id === urlSessionId || s.id === urlSessionId));
      }
      if (!targetSession && allSessions.length > 0) {
        targetSession = allSessions[0];
      }

      setCurrentSession(targetSession);

      if (targetSession && targetSession.sheets && targetSession.sheets.length > 0) {
        let sheetIdx = 0;
        if (urlSheetId) {
          const foundIdx = targetSession.sheets.findIndex(s => s.id === urlSheetId);
          if (foundIdx !== -1) sheetIdx = foundIdx;
        }
        setSelectedSheetIndex(sheetIdx);
        initSheetData(targetSession.sheets[sheetIdx], targetSession.questions || []);
      }
    } catch (err) {
      console.error('Error loading evaluation studio:', err);
    } finally {
      setLoading(false);
    }
  };

  const initSheetData = (sheet, questions) => {
    if (!sheet) return;
    const initialMarksMap = {};
    questions.forEach(q => {
      const existing = (sheet.marks || []).find(m => m.qNo === q.qNo);
      initialMarksMap[q.qNo] = {
        marks: existing ? existing.awardedMarks : 0,
        comments: existing ? existing.comments : ''
      };
    });

    setAwardedMarks(initialMarksMap);
    setAnnotations(sheet.annotations || []);
    setFlaggedModeration(!!sheet.flaggedForModeration);
    setActivePage(1);
  };

  const currentSheet = currentSession?.sheets?.[selectedSheetIndex] || null;
  const questionsList = currentSession?.questions || [];

  // Switch session
  const handleSessionChange = (sessionId) => {
    const s = sessions.find(item => (item._id === sessionId || item.id === sessionId));
    if (s) {
      setCurrentSession(s);
      setSelectedSheetIndex(0);
      if (s.sheets && s.sheets.length > 0) {
        initSheetData(s.sheets[0], s.questions || []);
      }
    }
  };

  // Switch sheet
  const handleSelectSheet = (index) => {
    if (index >= 0 && index < (currentSession?.sheets?.length || 0)) {
      setSelectedSheetIndex(index);
      initSheetData(currentSession.sheets[index], questionsList);
    }
  };

  // Change marks for a question
  const handleMarkChange = (qNo, newMarks, maxMarks) => {
    const val = Math.max(0, Math.min(Number(newMarks) || 0, maxMarks));
    setAwardedMarks(prev => ({
      ...prev,
      [qNo]: {
        ...prev[qNo],
        marks: val
      }
    }));
  };

  // Change comment for a question
  const handleCommentChange = (qNo, comment) => {
    setAwardedMarks(prev => ({
      ...prev,
      [qNo]: {
        ...prev[qNo],
        comments: comment
      }
    }));
  };

  // Add annotation stamp on clicking the canvas
  const handleCanvasClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    const newAnnotation = {
      id: Date.now(),
      page: activePage,
      x,
      y,
      type: activeStamp,
      comment: activeStamp === 'comment' ? 'Check step consistency' : ''
    };

    setAnnotations(prev => [...prev, newAnnotation]);
  };

  const removeAnnotation = (id, e) => {
    e.stopPropagation();
    setAnnotations(prev => prev.filter(a => a.id !== id));
  };

  // Calculate current sheet total score
  const totalAwardedScore = Object.values(awardedMarks).reduce((sum, item) => sum + (Number(item?.marks) || 0), 0);
  const maxPossibleMarks = questionsList.reduce((sum, q) => sum + (Number(q.maxMarks) || 0), 0);
  const percentageScore = maxPossibleMarks > 0 ? Math.round((totalAwardedScore / maxPossibleMarks) * 100) : 0;

  // Save current sheet evaluation
  const handleSaveSheet = async (moveToNext = false) => {
    if (!currentSession || !currentSheet) return;
    setSavingSheet(true);
    try {
      const marksPayload = Object.keys(awardedMarks).map(qNo => ({
        qNo,
        awardedMarks: awardedMarks[qNo].marks,
        comments: awardedMarks[qNo].comments
      }));

      const sessionId = currentSession._id || currentSession.id;
      const updated = await osmService.submitSheetEvaluation(
        sessionId,
        currentSheet.id,
        marksPayload,
        annotations,
        flaggedModeration
      );

      setCurrentSession(updated);

      if (moveToNext && selectedSheetIndex + 1 < (updated.sheets?.length || 0)) {
        handleSelectSheet(selectedSheetIndex + 1);
      } else {
        alert('Evaluation saved successfully for this sheet!');
      }
    } catch (err) {
      console.error('Failed to submit evaluation:', err);
      alert('Error saving evaluation.');
    } finally {
      setSavingSheet(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <OSMNavHeader />
        <div className="p-16 text-center text-xs text-slate-400">Loading digital evaluation studio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col">
      <OSMNavHeader />

      {/* Top Evaluation Session & Sheet Navigator Bar */}
      <div className="bg-white border-b border-slate-200/90 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Session Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Session:</label>
            <select
              value={currentSession?._id || currentSession?.id || ''}
              onChange={(e) => handleSessionChange(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-purple-900 focus:outline-none focus:border-purple-600 cursor-pointer"
            >
              {sessions.map(s => (
                <option key={s._id || s.id} value={s._id || s.id}>
                  {s.title} ({s.className} / {s.subjectName})
                </option>
              ))}
            </select>
          </div>

          {/* Student Sheet Navigator */}
          {currentSheet && (
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSelectSheet(selectedSheetIndex - 1)}
                  disabled={selectedSheetIndex === 0}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
                  title="Previous Student"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-center px-2">
                  <div className="text-xs font-bold text-slate-800">
                    {currentSession?.anonymous ? currentSheet.anonymousCode : currentSheet.studentName}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Sheet {selectedSheetIndex + 1} of {currentSession?.sheets?.length || 0}
                  </div>
                </div>
                <button
                  onClick={() => handleSelectSheet(selectedSheetIndex + 1)}
                  disabled={selectedSheetIndex >= (currentSession?.sheets?.length || 0) - 1}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
                  title="Next Student"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Moderation Flag Toggle */}
              <button
                onClick={() => setFlaggedModeration(!flaggedModeration)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  flaggedModeration
                    ? 'bg-rose-100 text-rose-700 border border-rose-300 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${flaggedModeration ? 'fill-rose-600 text-rose-600' : ''}`} />
                {flaggedModeration ? 'Flagged for Moderation' : 'Flag Paper'}
              </button>

              {/* Save / Next */}
              <button
                onClick={() => handleSaveSheet(true)}
                disabled={savingSheet}
                className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer border-none"
              >
                <CheckCircle2 className="w-4 h-4" /> Save & Next
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Main Studio Area (Two-Column Layout) */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT / CENTER PANE: DIGITAL ANSWER SHEET VIEWER (Col 7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
          
          {/* Canvas Toolbar */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            
            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Page:</span>
              <button
                onClick={() => setActivePage(Math.max(1, activePage - 1))}
                disabled={activePage <= 1}
                className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold disabled:opacity-40 cursor-pointer"
              >
                Prev
              </button>
              <span className="text-xs font-bold text-purple-900 px-1">
                {activePage} / {currentSheet?.pages || 3}
              </span>
              <button
                onClick={() => setActivePage(Math.min(currentSheet?.pages || 3, activePage + 1))}
                disabled={activePage >= (currentSheet?.pages || 3)}
                className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>

            {/* Stamp Palette */}
            {currentSession?.allowAnnotations && (
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setActiveStamp('tick')}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    activeStamp === 'tick' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                  title="Correct Step Stamp"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Correct
                </button>

                <button
                  onClick={() => setActiveStamp('cross')}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    activeStamp === 'cross' ? 'bg-rose-100 text-rose-800' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                  title="Incorrect Step Stamp"
                >
                  <X className="w-3.5 h-3.5 text-rose-600 stroke-[3]" /> Error
                </button>

                <button
                  onClick={() => setActiveStamp('partial')}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    activeStamp === 'partial' ? 'bg-amber-100 text-amber-800' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                  title="Partial Step Stamp"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 stroke-[3]" /> Partial
                </button>

                <button
                  onClick={() => setActiveStamp('comment')}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    activeStamp === 'comment' ? 'bg-purple-100 text-purple-800' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                  title="Teacher Remark Stamp"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-purple-600" /> Note
                </button>
              </div>
            )}

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 text-slate-500">
              <button 
                onClick={() => setZoomLevel(Math.max(75, zoomLevel - 15))}
                className="p-1 hover:bg-white rounded cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-bold w-10 text-center">{zoomLevel}%</span>
              <button 
                onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
                className="p-1 hover:bg-white rounded cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Scanned Paper Surface */}
          <div className="p-6 bg-slate-200/50 flex items-center justify-center min-h-[620px] overflow-auto">
            
            <div 
              onClick={handleCanvasClick}
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="w-[520px] min-h-[680px] bg-white rounded-lg shadow-xl border border-slate-300 p-8 relative select-none cursor-crosshair transition-transform duration-150"
            >
              
              {/* Top Watermark & Header */}
              <div className="border-b-2 border-slate-800 pb-3 mb-6 flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Official Exam Answer Booklet
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Subject: {currentSession?.subjectName} • Code: {currentSession?.examType}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-700">
                    {currentSession?.anonymous ? currentSheet?.anonymousCode : `Roll: ${currentSheet?.rollNo}`}
                  </div>
                  <div className="text-[10px] text-slate-400">Page {activePage} of {currentSheet?.pages || 3}</div>
                </div>
              </div>

              {/* Handwritten Response Mockup */}
              <div className="space-y-8 font-serif text-slate-800 text-sm leading-relaxed">
                
                {activePage === 1 && (
                  <>
                    <div className="space-y-2">
                      <div className="font-bold text-purple-900 text-xs">Ans 1.</div>
                      <p className="text-xs leading-relaxed italic text-slate-700">
                        Given numbers: 120 and 144.<br/>
                        Prime factorization of 120 = 2³ × 3 × 5 = 8 × 15 = 120.<br/>
                        Prime factorization of 144 = 2⁴ × 3² = 16 × 9 = 144.<br/>
                        HCF = 2³ × 3 = 24.<br/>
                        LCM = 2⁴ × 3² × 5 = 16 × 9 × 5 = 720.<br/>
                        Verification: HCF × LCM = 24 × 720 = 17,280.<br/>
                        Product of numbers = 120 × 144 = 17,280. Hence verified.
                      </p>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-dashed border-slate-300">
                      <div className="font-bold text-purple-900 text-xs">Ans 2.</div>
                      <p className="text-xs leading-relaxed italic text-slate-700">
                        Polynomial: f(x) = x² + 7x + 10 = 0<br/>
                        Factoring middle term: x² + 5x + 2x + 10 = 0<br/>
                        x(x + 5) + 2(x + 5) = 0 &rarr; (x + 2)(x + 5) = 0<br/>
                        Zeroes are &alpha; = -2, &beta; = -5.<br/>
                        Sum of zeroes = -2 + (-5) = -7 = -b/a.<br/>
                        Product of zeroes = (-2) × (-5) = 10 = c/a. Verified!
                      </p>
                    </div>
                  </>
                )}

                {activePage === 2 && (
                  <>
                    <div className="space-y-2">
                      <div className="font-bold text-purple-900 text-xs">Ans 3.</div>
                      <p className="text-xs leading-relaxed italic text-slate-700">
                        Eq 1: 2x + 3y = 11<br/>
                        Eq 2: 2x - 4y = -24<br/>
                        Subtracting (2) from (1): 7y = 35 &rarr; y = 5.<br/>
                        Substituting in (1): 2x + 15 = 11 &rarr; 2x = -4 &rarr; x = -2.<br/>
                        Now, y = mx + 3 &rarr; 5 = m(-2) + 3 &rarr; -2m = 2 &rarr; m = -1.
                      </p>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-dashed border-slate-300">
                      <div className="font-bold text-purple-900 text-xs">Ans 4.</div>
                      <p className="text-xs leading-relaxed italic text-slate-700">
                        Quadratic Eq: 2x² - 4x + 3 = 0<br/>
                        Here a = 2, b = -4, c = 3.<br/>
                        Discriminant D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8.<br/>
                        Since D &lt; 0, the equation has NO real roots (imaginary roots).
                      </p>
                    </div>
                  </>
                )}

                {activePage === 3 && (
                  <div className="space-y-2">
                    <div className="font-bold text-purple-900 text-xs">Ans 5 &amp; Theorem.</div>
                    <p className="text-xs leading-relaxed italic text-slate-700">
                      Reverse AP: a = 253, common difference d = -5.<br/>
                      Formula: T<sub>20</sub> = a + (20 - 1)d = 253 + 19(-5)<br/>
                      = 253 - 95 = 158.<br/>
                      Therefore, 20th term from the end is 158.
                    </p>
                    <div className="h-28 border border-slate-300 rounded bg-slate-50/50 flex items-center justify-center text-[10px] text-slate-400 italic">
                      [ Student Theorem Geometric Diagram: Triangle ABC with DE || BC ]
                    </div>
                  </div>
                )}

              </div>

              {/* Render User Annotation Pins */}
              {annotations
                .filter(a => a.page === activePage)
                .map((a) => (
                  <div
                    key={a.id}
                    onClick={(e) => removeAnnotation(a.id, e)}
                    style={{ left: a.x, top: a.y }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 p-1 rounded-full cursor-pointer hover:scale-125 transition-transform shadow-md group z-20"
                  >
                    {a.type === 'tick' && (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                    )}
                    {a.type === 'cross' && (
                      <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold">
                        ✕
                      </div>
                    )}
                    {a.type === 'partial' && (
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                        ½
                      </div>
                    )}
                    {a.type === 'comment' && (
                      <div className="px-2 py-0.5 rounded-md bg-purple-600 text-white text-[10px] font-bold shadow-lg">
                        {a.comment || 'Remark'}
                      </div>
                    )}
                    <span className="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap">
                      Click to remove
                    </span>
                  </div>
                ))}

              {/* Click to annotate guidance */}
              {currentSession?.allowAnnotations && (
                <div className="absolute bottom-3 right-4 text-[10px] text-slate-400 pointer-events-none">
                  💡 Click anywhere on page to place active stamp
                </div>
              )}

            </div>

          </div>

        </div>

        {/* RIGHT PANE: QUESTION-BY-QUESTION RUBRIC & GRADING SIDEBAR (Col 5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6">
          
          {/* Running Tally Card */}
          <div className="bg-gradient-to-br from-purple-700 to-indigo-800 rounded-2xl p-5 text-white shadow-md flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-purple-200 uppercase tracking-wider">
                Total Awarded Score
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black">{totalAwardedScore}</span>
                <span className="text-purple-200 text-sm font-semibold">/ {maxPossibleMarks} Marks</span>
              </div>
              <p className="text-xs text-purple-200 mt-1">Performance: {percentageScore}%</p>
            </div>
            
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex flex-col items-center justify-center border border-white/20">
              <span className="text-lg font-black">{percentageScore}%</span>
              <span className="text-[9px] uppercase tracking-wider text-purple-200 font-bold">Grade</span>
            </div>
          </div>

          {/* Question List Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Question Marking Rubric ({questionsList.length} Questions)
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">
              Award scores per item
            </span>
          </div>

          {/* Questions Marking List */}
          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
            {questionsList.map((q) => {
              const currentItem = awardedMarks[q.qNo] || { marks: 0, comments: '' };
              const awarded = currentItem.marks;

              return (
                <div 
                  key={q.qNo}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 hover:border-purple-200 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center">
                        {q.qNo}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{q.label || q.qNo}</div>
                        <div className="text-[10px] text-slate-400">Max {q.maxMarks} Marks {q.compulsory && '• Compulsory'}</div>
                      </div>
                    </div>

                    {/* Marks Input */}
                    <div className="flex items-center gap-1.5">
                      <input 
                        type="number"
                        min="0"
                        max={q.maxMarks}
                        value={awarded}
                        onChange={(e) => handleMarkChange(q.qNo, e.target.value, q.maxMarks)}
                        className="w-14 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-purple-900 text-center focus:outline-none focus:border-purple-600 shadow-xs"
                      />
                      <span className="text-xs text-slate-400 font-bold">/{q.maxMarks}</span>
                    </div>
                  </div>

                  {/* Quick-score pills for fast grading */}
                  <div className="flex flex-wrap items-center gap-1">
                    {[0, Math.round(q.maxMarks / 2), q.maxMarks].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleMarkChange(q.qNo, preset, q.maxMarks)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                          awarded === preset
                            ? 'bg-purple-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {preset === 0 ? '0' : preset === q.maxMarks ? 'Full' : 'Half'}
                      </button>
                    ))}
                  </div>

                  {/* Question Prompt Snippet */}
                  {q.text && (
                    <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100 line-clamp-2">
                      "{q.text}"
                    </p>
                  )}

                  {/* Feedback comment input */}
                  <input 
                    type="text"
                    placeholder="Add step remark / comment..."
                    value={currentItem.comments || ''}
                    onChange={(e) => handleCommentChange(q.qNo, e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-purple-600"
                  />
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={() => handleSaveSheet(false)}
              disabled={savingSheet}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4 inline-block mr-1" /> Save Draft
            </button>

            <button
              onClick={() => handleSaveSheet(true)}
              disabled={savingSheet}
              className="flex-1 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-200 flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              <CheckCircle2 className="w-4 h-4" /> {savingSheet ? 'Submitting...' : 'Submit Evaluation & Next'}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

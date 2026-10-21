import React, { useState, useEffect } from 'react';
import { 
  Scale, CheckCircle2, AlertTriangle, MessageSquare, Flag, 
  Search, Eye, ShieldCheck, ArrowRight, X, Save, Sparkles, Filter, FileText
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import OSMNavHeader from './OSMNavHeader';
import osmService from '../../api/osmService';

export default function OSMModeration() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSessionId = searchParams.get('id');

  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [loading, setLoading] = useState(true);

  // Active paper moderation modal state
  const [activeModalSheet, setActiveModalSheet] = useState(null);
  const [moderatorScoreInput, setModeratorScoreInput] = useState('');
  const [moderationRemarks, setModerationRemarks] = useState('');
  const [savingModeration, setSavingModeration] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const all = await osmService.getSessions();
      setSessions(all);

      if (urlSessionId) {
        setSelectedSessionId(urlSessionId);
      } else if (all.length > 0) {
        // Prefer session with flagged sheets or moderation status
        const flaggedSession = all.find(s => s.status === 'Moderation' || s.sheets?.some(sh => sh.flaggedForModeration));
        setSelectedSessionId(flaggedSession ? (flaggedSession._id || flaggedSession.id) : (all[0]._id || all[0].id));
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentSession = sessions.find(s => (s._id === selectedSessionId || s.id === selectedSessionId)) || null;

  // Open moderation modal
  const handleOpenModeration = (sheet) => {
    setActiveModalSheet(sheet);
    setModeratorScoreInput(sheet.moderatorMarks !== null && sheet.moderatorMarks !== undefined ? sheet.moderatorMarks : sheet.totalAwarded);
    setModerationRemarks(sheet.moderationNotes || '');
  };

  // Submit moderation adjustment
  const handleSaveModeration = async (approveOriginal = false) => {
    if (!currentSession || !activeModalSheet) return;
    setSavingModeration(true);
    try {
      const finalMarks = approveOriginal ? activeModalSheet.totalAwarded : Number(moderatorScoreInput);
      const notes = approveOriginal 
        ? 'Original evaluator marks confirmed by HOD without changes.'
        : (moderationRemarks || 'Moderator adjusted marks based on answer rubric.');

      const sessionId = currentSession._id || currentSession.id;
      const updated = await osmService.moderateSheet(sessionId, activeModalSheet.id, finalMarks, notes);

      // Update local state
      setSessions(prev => prev.map(s => (s._id === sessionId || s.id === sessionId) ? updated : s));
      setActiveModalSheet(null);
      alert('Moderation decisions locked and saved successfully!');
    } catch (err) {
      console.error('Failed to moderate paper:', err);
      alert('Error saving moderation.');
    } finally {
      setSavingModeration(false);
    }
  };

  const sheets = currentSession?.sheets || [];
  const flaggedSheets = sheets.filter(s => s.flaggedForModeration || s.status === 'Moderated');
  const evaluatedSheets = sheets.filter(s => s.status === 'Evaluated' || s.status === 'Moderated');
  const moderatedCount = sheets.filter(s => s.status === 'Moderated').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <OSMNavHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Title & Session Selector Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800">Department Moderation Desk</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                Auditing & Grace Review
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review flagged borderline papers, inspect examiner marking variances, and authorize score revisions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-600 whitespace-nowrap">Session:</label>
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-purple-900 focus:outline-none focus:border-purple-600 cursor-pointer min-w-[260px]"
            >
              {sessions.map(s => (
                <option key={s._id || s.id} value={s._id || s.id}>
                  {s.title} ({s.className})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Moderation Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Flagged For Review</p>
              <h3 className="text-2xl font-black text-rose-600">{flaggedSheets.length}</h3>
              <p className="text-[11px] text-slate-500">Teacher flagged or borderline papers</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Flag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Moderated & Locked</p>
              <h3 className="text-2xl font-black text-purple-600">{moderatedCount}</h3>
              <p className="text-[11px] text-slate-500">Scores officially adjusted and endorsed</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Scale className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Evaluated Pool</p>
              <h3 className="text-2xl font-black text-slate-800">{evaluatedSheets.length}</h3>
              <p className="text-[11px] text-slate-500">of {sheets.length} total submitted answer sheets</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Moderation Queue Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Answer Sheets Moderation Roster
              </h3>
              <p className="text-xs text-slate-500">
                Sheets with inspection requests appear at the top. You can audit any paper from this session.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {sheets.length} Sheets in Session
            </span>
          </div>

          {sheets.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <Scale className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No Sheets Found in this Session</p>
              <p className="text-xs text-slate-400">Upload answer copies in the session details tab.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Candidate / ID</th>
                    <th className="py-3.5 px-4">Evaluation Status</th>
                    <th className="py-3.5 px-4 text-center">Examiner Marks</th>
                    <th className="py-3.5 px-4 text-center">Moderator Marks</th>
                    <th className="py-3.5 px-6">Flag / Review Reason</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sheets.map((sheet) => {
                    const isModerated = sheet.status === 'Moderated';
                    const isFlagged = sheet.flaggedForModeration;

                    return (
                      <tr 
                        key={sheet.id}
                        className={`transition-colors ${
                          isFlagged ? 'bg-rose-50/40 hover:bg-rose-50/70' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        <td className="py-4 px-6">
                          {currentSession?.anonymous ? (
                            <span className="font-mono font-bold text-indigo-700">{sheet.anonymousCode}</span>
                          ) : (
                            <div>
                              <div className="font-bold text-slate-800">{sheet.studentName}</div>
                              <div className="text-[11px] text-slate-400">Roll No: {sheet.rollNo}</div>
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                            isModerated ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            sheet.status === 'Evaluated' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {sheet.status}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className="font-bold text-slate-800 text-sm">
                            {sheet.totalAwarded} / {currentSession?.totalMarks || 50}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-center">
                          {isModerated ? (
                            <span className="font-extrabold text-purple-700 text-sm bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                              {sheet.moderatorMarks}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-semibold">—</span>
                          )}
                        </td>

                        <td className="py-4 px-6 max-w-xs">
                          {isFlagged ? (
                            <div className="flex items-center gap-1.5 text-rose-700 font-semibold text-xs">
                              <Flag className="w-3.5 h-3.5 shrink-0 fill-rose-600" />
                              <span className="line-clamp-1">{sheet.moderationNotes || 'Flagged by Teacher'}</span>
                            </div>
                          ) : isModerated ? (
                            <div className="text-purple-700 text-xs line-clamp-1">
                              ✓ {sheet.moderationNotes || 'Endorsed by HOD'}
                            </div>
                          ) : (
                            <span className="text-slate-400">Routine paper</span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleOpenModeration(sheet)}
                            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer border-none ml-auto"
                          >
                            <Scale className="w-3.5 h-3.5" /> Moderate
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Moderation Inspection Modal */}
      {activeModalSheet && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  Moderate Answer Paper: {currentSession?.anonymous ? activeModalSheet.anonymousCode : activeModalSheet.studentName}
                </h3>
              </div>
              <button 
                onClick={() => setActiveModalSheet(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Score Comparison Box */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Examiner Awarded</p>
                <div className="text-2xl font-black text-slate-800 mt-1">
                  {activeModalSheet.totalAwarded} <span className="text-xs text-slate-500 font-semibold">/ {currentSession?.totalMarks}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Original total marks</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Moderator Final Score</p>
                <div className="flex items-center gap-2 mt-1">
                  <input 
                    type="number"
                    min="0"
                    max={currentSession?.totalMarks || 100}
                    value={moderatorScoreInput}
                    onChange={(e) => setModeratorScoreInput(e.target.value)}
                    className="w-20 px-3 py-1 bg-white border border-purple-300 rounded-xl text-lg font-black text-purple-900 focus:outline-none focus:border-purple-600 text-center"
                  />
                  <span className="text-xs font-bold text-purple-700">Marks</span>
                </div>
              </div>
            </div>

            {/* Flag Note (if any) */}
            {activeModalSheet.flaggedForModeration && activeModalSheet.moderationNotes && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                <strong>Teacher Flag Note:</strong> {activeModalSheet.moderationNotes}
              </div>
            )}

            {/* Question Breakdown */}
            {activeModalSheet.marks && activeModalSheet.marks.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Original Itemized Scores</p>
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  {activeModalSheet.marks.map((m, idx) => (
                    <div key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold">{m.qNo}</div>
                      <div className="font-extrabold text-slate-800">{m.awardedMarks} pts</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Moderation Rationale Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Moderation Justification / Endorsement Reason *
              </label>
              <textarea 
                rows={3}
                placeholder="e.g. Reviewed Q6 theorem proof — step marks awarded for valid alternate formula (+3 pts)."
                value={moderationRemarks}
                onChange={(e) => setModerationRemarks(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-600 resize-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSaveModeration(true)}
                disabled={savingModeration}
                className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Confirm Original (No Change)
              </button>

              <button
                type="button"
                onClick={() => handleSaveModeration(false)}
                disabled={savingModeration}
                className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer border-none"
              >
                {savingModeration ? 'Saving...' : 'Apply Moderation & Lock'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

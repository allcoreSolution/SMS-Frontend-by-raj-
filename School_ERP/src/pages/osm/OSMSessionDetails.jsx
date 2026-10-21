import React, { useState, useEffect } from 'react';
import { 
  FileQuestion, FileText, Users, Plus, Save, Trash2, ArrowLeft, 
  PenTool, CheckCircle2, Clock, Scale, Eye, Sparkles, Upload, X, ShieldCheck
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import OSMNavHeader from './OSMNavHeader';
import osmService from '../../api/osmService';

export default function OSMSessionDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('id');

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('questions'); // 'questions', 'sheets', 'settings'
  const [saving, setSaving] = useState(false);

  // Question editing state
  const [questions, setQuestions] = useState([]);

  // Upload sheet modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newSheetData, setNewSheetData] = useState({
    studentName: '',
    rollNo: '',
    fileName: 'scanned_paper.pdf',
    pages: 3
  });

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    setLoading(true);
    try {
      let data = null;
      if (sessionId) {
        data = await osmService.getSession(sessionId);
      }
      if (!data) {
        const all = await osmService.getSessions();
        data = all[0] || null;
      }

      setSession(data);
      if (data && data.questions) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error('Failed to load session details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add Question
  const handleAddQuestion = () => {
    const nextNum = questions.length + 1;
    setQuestions([
      ...questions,
      {
        qNo: `Q${nextNum}`,
        label: `Question ${nextNum}`,
        maxMarks: 5,
        compulsory: true,
        text: '',
        rubric: ''
      }
    ]);
  };

  // Remove Question
  const handleRemoveQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  // Question change
  const handleQuestionChange = (idx, field, value) => {
    const updated = [...questions];
    updated[idx] = {
      ...updated[idx],
      [field]: field === 'maxMarks' ? Number(value) || 0 : value
    };
    setQuestions(updated);
  };

  // Save Question Paper
  const handleSaveQuestions = async () => {
    if (!session) return;
    setSaving(true);
    try {
      const currentId = session._id || session.id;
      const updated = await osmService.updateSession(currentId, {
        questions: questions
      });
      setSession(updated);
      alert('Question paper saved successfully!');
    } catch (err) {
      console.error('Failed to save questions:', err);
      alert('Failed to save questions.');
    } finally {
      setSaving(false);
    }
  };

  // Add Answer Sheet
  const handleAddSheet = async (e) => {
    e.preventDefault();
    if (!newSheetData.studentName.trim()) {
      alert('Please enter student name');
      return;
    }

    const currentId = session._id || session.id;
    const anonymousCode = `#ANON-${Math.floor(1000 + Math.random() * 9000)}`;
    const newSheet = {
      id: 'sheet-' + Date.now(),
      studentId: 'STU-' + Math.floor(1000 + Math.random() * 9000),
      studentName: newSheetData.studentName.trim(),
      rollNo: newSheetData.rollNo || String(Math.floor(1000 + Math.random() * 900)),
      anonymousCode,
      fileName: newSheetData.fileName || 'scanned_paper.pdf',
      pages: Number(newSheetData.pages) || 3,
      status: 'Pending',
      totalAwarded: 0,
      marks: [],
      annotations: [],
      flaggedForModeration: false
    };

    const updatedSheets = [...(session.sheets || []), newSheet];
    const updated = await osmService.updateSession(currentId, {
      sheets: updatedSheets,
      status: session.status === 'Draft' ? 'Evaluating' : session.status
    });

    setSession(updated);
    setShowUploadModal(false);
    setNewSheetData({ studentName: '', rollNo: '', fileName: 'scanned_paper.pdf', pages: 3 });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <OSMNavHeader />
        <div className="p-16 text-center text-xs text-slate-400">Loading evaluation session details...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <OSMNavHeader />
        <div className="p-16 text-center space-y-4">
          <p className="text-sm font-bold text-slate-700">Evaluation Session Not Found</p>
          <button 
            onClick={() => navigate('/osm-module/sessions')}
            className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  const stats = osmService.calculateStats(session);
  const totalQuestionMarks = questions.reduce((sum, q) => sum + (Number(q.maxMarks) || 0), 0);
  const currentId = session._id || session.id;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <OSMNavHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/osm-module/sessions')}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800">{session.title}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                {session.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {session.className} • Section {session.section} • {session.subjectName} • Max {totalQuestionMarks || session.totalMarks} Marks
            </p>
          </div>
        </div>

        {/* Overview Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 flex-1">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Sheets</p>
              <h4 className="text-2xl font-black text-slate-800 mt-0.5">{stats.totalSheets}</h4>
              <p className="text-[11px] text-slate-500">Student submissions</p>
            </div>

            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Evaluated</p>
              <h4 className="text-2xl font-black text-emerald-600 mt-0.5">{stats.evaluatedSheets}</h4>
              <p className="text-[11px] text-slate-500">{stats.progressPct}% marked</p>
            </div>

            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending</p>
              <h4 className="text-2xl font-black text-amber-600 mt-0.5">{stats.pendingSheets}</h4>
              <p className="text-[11px] text-slate-500">To be graded</p>
            </div>

            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Questions</p>
              <h4 className="text-2xl font-black text-indigo-600 mt-0.5">{questions.length}</h4>
              <p className="text-[11px] text-slate-500">{totalQuestionMarks} Max Marks</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch lg:self-auto border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
            <button
              onClick={() => navigate(`/osm-module/evaluate?id=${currentId}`)}
              className="flex-1 lg:flex-initial px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-200 flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              <PenTool className="w-4 h-4" /> Start Grading
            </button>
            <button
              onClick={() => navigate(`/osm-module/reports?id=${currentId}`)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4" /> Reports
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          <div className="flex border-b border-slate-100 text-xs font-bold px-6 pt-3 gap-6">
            <button
              onClick={() => setActiveTab('questions')}
              className={`flex items-center gap-2 pb-3 border-b-2 cursor-pointer transition-all ${
                activeTab === 'questions'
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <FileQuestion className="w-4 h-4" /> Question Paper ({questions.length})
            </button>

            <button
              onClick={() => setActiveTab('sheets')}
              className={`flex items-center gap-2 pb-3 border-b-2 cursor-pointer transition-all ${
                activeTab === 'sheets'
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" /> Scanned Answer Sheets ({session.sheets?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 pb-3 border-b-2 cursor-pointer transition-all ${
                activeTab === 'settings'
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Users className="w-4 h-4" /> Evaluator & Policy Settings
            </button>
          </div>

          {/* TAB 1: QUESTION PAPER */}
          {activeTab === 'questions' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                <div>
                  <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                    Rubric & Question Blueprint
                  </h4>
                  <p className="text-xs text-purple-700 mt-0.5">
                    Define each question, its max marks, and grading guidelines. Total Max Marks: <strong>{totalQuestionMarks}</strong>
                  </p>
                </div>
                <button
                  onClick={handleAddQuestion}
                  className="self-start sm:self-auto px-3.5 py-1.5 bg-white border border-purple-200 text-purple-700 hover:bg-purple-100/50 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Question
                </button>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div 
                    key={idx}
                    className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:border-purple-200 transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="w-24">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Q. No</label>
                          <input 
                            type="text" 
                            value={q.qNo} 
                            onChange={(e) => handleQuestionChange(idx, 'qNo', e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-purple-700 focus:outline-none focus:border-purple-600"
                          />
                        </div>

                        <div className="min-w-[180px] flex-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Short Label / Concept</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Quadratic Equation Proof"
                            value={q.label} 
                            onChange={(e) => handleQuestionChange(idx, 'label', e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-600"
                          />
                        </div>

                        <div className="w-24">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Max Marks</label>
                          <input 
                            type="number" 
                            min="1"
                            max="100"
                            value={q.maxMarks} 
                            onChange={(e) => handleQuestionChange(idx, 'maxMarks', e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 text-center"
                          />
                        </div>

                        <label className="flex items-center gap-2 mt-4 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={q.compulsory}
                            onChange={(e) => handleQuestionChange(idx, 'compulsory', e.target.checked)}
                            className="w-4 h-4 accent-purple-600 cursor-pointer"
                          />
                          <span className="text-xs font-semibold text-slate-600">Compulsory</span>
                        </label>
                      </div>

                      <button
                        onClick={() => handleRemoveQuestion(idx)}
                        className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Question text & Rubric */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Full Question Text / Problem Statement
                        </label>
                        <textarea 
                          rows={2}
                          placeholder="Type or paste the full problem text here..."
                          value={q.text || ''}
                          onChange={(e) => handleQuestionChange(idx, 'text', e.target.value)}
                          className="w-full p-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-600 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Marking Rubric / Step-wise Criteria
                        </label>
                        <textarea 
                          rows={2}
                          placeholder="e.g. 2 marks for formula, 2 marks for correct steps, 1 mark for final unit..."
                          value={q.rubric || ''}
                          onChange={(e) => handleQuestionChange(idx, 'rubric', e.target.value)}
                          className="w-full p-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-600 resize-none"
                        />
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* Save Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={handleAddQuestion}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Another Question
                </button>

                <button
                  onClick={handleSaveQuestions}
                  disabled={saving}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-200 flex items-center gap-2 cursor-pointer border-none"
                >
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Question Paper'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ANSWER SHEETS */}
          {activeTab === 'sheets' && (
            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Student Answer Sheets Pool
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload scanned answer copies or manage student papers ready for digital marking.
                  </p>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="self-start sm:self-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-4 h-4" /> Upload Answer Sheet
                </button>
              </div>

              {(!session.sheets || session.sheets.length === 0) ? (
                <div className="p-16 text-center space-y-3">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">No Answer Sheets Uploaded Yet</p>
                  <p className="text-xs text-slate-400">Click the button above to upload scanned student answer sheets.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-6">Student / Identifier</th>
                        <th className="py-3 px-4">Scanned File</th>
                        <th className="py-3 px-4 text-center">Pages</th>
                        <th className="py-3 px-4 text-center">Marks Awarded</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {session.sheets.map((sheet) => {
                        const isEvaluated = sheet.status === 'Evaluated' || sheet.status === 'Moderated';
                        return (
                          <tr key={sheet.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-6">
                              {session.anonymous ? (
                                <div className="font-bold text-indigo-700 font-mono">
                                  {sheet.anonymousCode || '#ANON-XXXX'}
                                </div>
                              ) : (
                                <div>
                                  <div className="font-bold text-slate-800">{sheet.studentName}</div>
                                  <div className="text-[11px] text-slate-400">Roll No: {sheet.rollNo}</div>
                                </div>
                              )}
                            </td>

                            <td className="py-4 px-4 font-mono text-[11px] text-slate-600">
                              {sheet.fileName || 'scanned_paper.pdf'}
                            </td>

                            <td className="py-4 px-4 text-center font-bold text-slate-700">
                              {sheet.pages || 3}
                            </td>

                            <td className="py-4 px-4 text-center">
                              {isEvaluated ? (
                                <span className="font-extrabold text-emerald-700 text-sm">
                                  {sheet.moderatorMarks ?? sheet.totalAwarded} / {totalQuestionMarks || session.totalMarks}
                                </span>
                              ) : (
                                <span className="text-slate-400 font-semibold">—</span>
                              )}
                            </td>

                            <td className="py-4 px-4 text-center">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                                sheet.status === 'Evaluated' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                sheet.status === 'Moderated' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {sheet.status}
                              </span>
                            </td>

                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => navigate(`/osm-module/evaluate?id=${currentId}&sheet=${sheet.id}`)}
                                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-lg text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                              >
                                <PenTool className="w-3.5 h-3.5" /> {isEvaluated ? 'Review' : 'Grade'}
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
          )}

          {/* TAB 3: SETTINGS & POLICIES */}
          {activeTab === 'settings' && (
            <div className="p-6 sm:p-8 space-y-6 max-w-2xl">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Session Configuration
                </h4>
                <p className="text-xs text-slate-500">
                  Update assigned grading educator, confidentiality flags, and deadline rules.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Lead Evaluator</label>
                  <input 
                    type="text" 
                    value={session.evaluatorName || ''}
                    onChange={(e) => setSession({ ...session, evaluatorName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="pt-2 space-y-3">
                  <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={session.anonymous}
                      onChange={(e) => setSession({ ...session, anonymous: e.target.checked })}
                      className="w-4 h-4 accent-purple-600 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Anonymous Grading</span>
                      <span className="text-[11px] text-slate-500 block">Mask student names with anonymous codes during evaluation.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={session.moderationEnabled}
                      onChange={(e) => setSession({ ...session, moderationEnabled: e.target.checked })}
                      className="w-4 h-4 accent-purple-600 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Enable Moderation</span>
                      <span className="text-[11px] text-slate-500 block">Route flagged sheets to HOD moderation queue.</span>
                    </div>
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    onClick={async () => {
                      await osmService.updateSession(currentId, {
                        evaluatorName: session.evaluatorName,
                        anonymous: session.anonymous,
                        moderationEnabled: session.moderationEnabled
                      });
                      alert('Session policies saved successfully!');
                    }}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Save Policies
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Upload Sheet Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Upload className="w-4 h-4 text-purple-600" /> Upload Student Answer Sheet
              </h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSheet} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input 
                  type="text"
                  placeholder="e.g. Ishaan Verma"
                  value={newSheetData.studentName}
                  onChange={(e) => setNewSheetData({ ...newSheetData, studentName: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Roll Number</label>
                  <input 
                    type="text"
                    placeholder="e.g. 1024"
                    value={newSheetData.rollNo}
                    onChange={(e) => setNewSheetData({ ...newSheetData, rollNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Scanned Pages</label>
                  <input 
                    type="number"
                    min="1"
                    max="20"
                    value={newSheetData.pages}
                    onChange={(e) => setNewSheetData({ ...newSheetData, pages: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">File Name / Scanned PDF</label>
                <input 
                  type="text"
                  value={newSheetData.fileName}
                  onChange={(e) => setNewSheetData({ ...newSheetData, fileName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-600 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Upload & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

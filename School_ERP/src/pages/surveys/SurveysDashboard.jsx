import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MessageSquare, BookOpen, LayoutTemplate, Plus,
  BarChart2, Radio, FileEdit, MessageCircle, TrendingUp, ClipboardList,
  RotateCcw, Eye, Zap, Copy, Inbox, Flag, ArrowLeft, Save,
  Settings, Users, Calendar, Trash2, ArrowUp, ArrowDown, X, Info,
  ChevronRight, Check, ArrowRight, Folder, AlertCircle, UserCheck,
  Lightbulb, Link2, Play, FilePlus2, Layers, Heart, LayoutDashboard,
  Search, Filter, Star, CheckCircle, RefreshCw, Send, MoreVertical,
  Clock, ShieldAlert, Award, HelpCircle
} from 'lucide-react';
import surveyService from '../../api/surveyService';

/* ==============================================================
   FALLBACK DATA (Ensures zero blank screens if DB is offline)
   ============================================================== */
const DEFAULT_TEMPLATES = [
  {
    id: 'tmpl-parent-satisfaction',
    title: 'Term 1 Parent Satisfaction & Review',
    description: 'Gather feedback on academic progress, teacher communication, campus safety, and school infrastructure.',
    kind: 'Survey',
    targetAudience: 'Parent',
    targetRoles: ['Parent'],
    questions: [
      { id: 'q1', questionText: 'How satisfied are you with your child’s academic progress this term?', type: 'Rating', options: ['1', '2', '3', '4', '5'], required: true },
      { id: 'q2', questionText: 'How would you rate the frequency and clarity of school communications?', type: 'Single choice', options: ['Excellent', 'Good', 'Adequate', 'Needs Improvement'], required: true },
      { id: 'q3', questionText: 'Which school facilities do you feel have improved most this academic year?', type: 'Multiple choice', options: ['Library & Reading Rooms', 'Sports & Grounds', 'Science & Computer Labs', 'Classroom Tech', 'Canteen & Cleanliness'], required: false },
      { id: 'q4', questionText: 'Any specific suggestions where the administration can better support your child?', type: 'Long text', options: [], required: false }
    ]
  },
  {
    id: 'tmpl-student-wellbeing',
    title: 'Student Well-being & School Climate Pulse',
    description: 'Quick check-in on student mental health, safety, peer interactions, and extracurricular balance.',
    kind: 'Survey',
    targetAudience: 'Student',
    targetRoles: ['Student'],
    questions: [
      { id: 'q1', questionText: 'Do you feel supported and encouraged by your teachers at school?', type: 'Single choice', options: ['Always', 'Most of the time', 'Sometimes', 'Rarely'], required: true },
      { id: 'q2', questionText: 'How manageable is your daily homework and study schedule?', type: 'Single choice', options: ['Very manageable', 'Manageable', 'Somewhat heavy', 'Overwhelming'], required: true },
      { id: 'q3', questionText: 'Rate your overall feeling of safety and happiness at school on a scale of 1-5:', type: 'Rating', options: ['1', '2', '3', '4', '5'], required: true },
      { id: 'q4', questionText: 'What is one thing that would make your school experience even better?', type: 'Long text', options: [], required: false }
    ]
  },
  {
    id: 'tmpl-teacher-eval',
    title: 'Teacher Evaluation & Classroom Engagement',
    description: 'Structured pedagogical feedback on instructional clarity, classroom culture, and student support.',
    kind: 'Survey',
    targetAudience: 'Student',
    targetRoles: ['Student', 'Parent'],
    questions: [
      { id: 'q1', questionText: 'Does the teacher explain complex topics in an easy-to-understand way?', type: 'Single choice', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'], required: true },
      { id: 'q2', questionText: 'Rate the teacher’s enthusiasm and classroom engagement:', type: 'Rating', options: ['1', '2', '3', '4', '5'], required: true },
      { id: 'q3', questionText: 'Does the teacher provide helpful and timely feedback on tests and assignments?', type: 'Single choice', options: ['Always', 'Usually', 'Occasionally', 'Never'], required: true }
    ]
  },
  {
    id: 'tmpl-nps-pulse',
    title: 'Net Promoter Score (NPS) - School Recommendation',
    description: 'The standard 10-point pulse measuring community satisfaction and loyalty.',
    kind: 'Poll',
    targetAudience: 'All',
    targetRoles: ['Parent', 'Student', 'Teacher'],
    questions: [
      { id: 'q1', questionText: 'How likely are you to recommend our school to a friend or colleague? (1 = Unlikely, 5 = Extremely likely)', type: 'Rating', options: ['1', '2', '3', '4', '5'], required: true },
      { id: 'q2', questionText: 'What is the primary reason for your score?', type: 'Long text', options: [], required: false }
    ]
  }
];

/* ==============================================================
   NAV HEADER
   ============================================================== */
function SurveysNavHeader({ onNewSurvey, stats, onRefresh, loading }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/all')) return 'all';
    if (path.includes('/my-surveys')) return 'my-surveys';
    if (path.includes('/feedback-triage')) return 'feedback-triage';
    if (path.includes('/templates')) return 'templates';
    if (path.includes('/guide')) return 'guide';
    return 'dashboard';
  };

  const currentTab = getActiveTab();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/surveys/dashboard' },
    { id: 'all', label: 'All Surveys', icon: BarChart2, path: '/surveys/all', badge: stats?.totalSurveys || null },
    { id: 'my-surveys', label: 'My Surveys', icon: Inbox, path: '/surveys/my-surveys', badge: stats?.publishedSurveys || null },
    { id: 'feedback-triage', label: 'Feedback Triage', icon: ClipboardList, path: '/surveys/feedback-triage', badge: stats?.openFeedbacks || null },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate, path: '/surveys/templates' },
    { id: 'guide', label: 'Guide & Help', icon: BookOpen, path: '/surveys/guide' },
  ];

  return (
    <div className="bg-white border-b border-slate-200/80 sticky top-0 z-20 backdrop-blur-md bg-white/95 transition-all">
      <div className="px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 ring-2 ring-indigo-50">
            <MessageSquare className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">
                Surveys & Feedback
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200/80 uppercase tracking-wider">
                Pulse Hub
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Live feedback collection, actionable triage board, and community pulse
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={onRefresh}
            title="Refresh surveys & feedback"
            disabled={loading}
            className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl cursor-pointer shadow-xs transition-all flex items-center justify-center disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
          <button
            onClick={() => navigate('/surveys/templates')}
            className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <LayoutTemplate className="w-4 h-4 text-slate-500" /> Templates
          </button>
          <button
            onClick={onNewSurvey || (() => navigate('/surveys/create'))}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-100 flex items-center gap-2 transition-all cursor-pointer border-none"
          >
            <Plus className="w-4 h-4" /> New Survey
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-100">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all duration-150 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== null && tab.badge !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ==============================================================
   TOAST COMPONENT
   ============================================================== */
function ToastNotification({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs font-bold border border-slate-700 animate-slide-up">
      <CheckCircle className="w-4 h-4 text-emerald-400" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white bg-transparent border-none cursor-pointer">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* ==============================================================
   TAKE SURVEY MODAL (Interactive for Parents, Students, Teachers)
   ============================================================== */
function TakeSurveyModal({ survey, onClose, onSubmitSuccess }) {
  const [answers, setAnswers] = useState({});
  const [respondentName, setRespondentName] = useState('');
  const [respondentRole, setRespondentRole] = useState(survey?.targetAudience !== 'All' ? survey?.targetAudience : 'Parent');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!survey) return null;

  const handleSingleChoice = (qId, option) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: { ...prev[qId], selectedOption: option }
    }));
  };

  const handleMultipleChoice = (qId, option) => {
    setAnswers(prev => {
      const existing = prev[qId]?.selectedOptions || [];
      const updated = existing.includes(option)
        ? existing.filter(o => o !== option)
        : [...existing, option];
      return {
        ...prev,
        [qId]: { ...prev[qId], selectedOptions: updated }
      };
    });
  };

  const handleRating = (qId, ratingValue) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: { ...prev[qId], rating: ratingValue }
    }));
  };

  const handleTextChange = (qId, text) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: { ...prev[qId], textAnswer: text }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Check required questions
    for (const q of (survey.questions || [])) {
      if (q.required) {
        const ans = answers[q.id];
        if (!ans) {
          setErrorMsg(`Please answer required question: "${q.questionText}"`);
          return;
        }
        if (q.type === 'Single choice' && !ans.selectedOption) {
          setErrorMsg(`Please select an option for: "${q.questionText}"`);
          return;
        }
        if (q.type === 'Rating' && !ans.rating) {
          setErrorMsg(`Please provide a rating for: "${q.questionText}"`);
          return;
        }
        if ((q.type === 'Short text' || q.type === 'Long text') && (!ans.textAnswer || !ans.textAnswer.trim())) {
          setErrorMsg(`Please enter text for: "${q.questionText}"`);
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      const formattedAnswers = (survey.questions || []).map(q => {
        const ans = answers[q.id] || {};
        return {
          questionId: q.id,
          questionText: q.questionText,
          selectedOption: ans.selectedOption || null,
          selectedOptions: ans.selectedOptions || [],
          textAnswer: ans.textAnswer || '',
          rating: ans.rating || null
        };
      });

      const payload = {
        surveyId: survey._id,
        respondentName: respondentName.trim() || 'Anonymous Parent/Student',
        respondentRole: respondentRole || 'Parent',
        answers: formattedAnswers
      };

      await surveyService.submitResponse(survey._id, payload);
      onSubmitSuccess && onSubmitSuccess('Thank you! Your survey response was recorded successfully.');
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 uppercase tracking-wider">
                {survey.kind || 'Survey'}
              </span>
              <span className="text-xs text-indigo-100 font-semibold">
                Target: {survey.targetAudience || 'All'}
              </span>
            </div>
            <h2 className="text-xl font-black mt-1.5 leading-snug">{survey.title}</h2>
            {survey.description && (
              <p className="text-xs text-indigo-100/90 mt-1 leading-relaxed">{survey.description}</p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border-none ml-3"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Questions Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Respondent Info (Optional) */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Your Name (Optional)</label>
              <input
                type="text"
                placeholder="Leave blank for anonymous"
                value={respondentName}
                onChange={(e) => setRespondentName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Role / Affiliation</label>
              <select
                value={respondentRole}
                onChange={(e) => setRespondentRole(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600"
              >
                <option value="Parent">Parent</option>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher / Staff</option>
                <option value="Alumni">Alumni</option>
                <option value="Other">Other Community Member</option>
              </select>
            </div>
          </div>

          {/* Questions Render */}
          <div className="space-y-6">
            {(survey.questions || []).map((q, idx) => {
              const currentAns = answers[q.id] || {};

              return (
                <div key={q.id || idx} className="p-5 border border-slate-200/90 rounded-2xl bg-white hover:border-indigo-300 transition-colors shadow-2xs space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 leading-snug">
                          {q.questionText}
                          {q.required && <span className="text-red-500 ml-1">*</span>}
                        </h4>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mt-0.5">
                          {q.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Render based on Type */}
                  {q.type === 'Single choice' && (
                    <div className="space-y-2 pt-1 pl-8">
                      {(q.options || []).map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          onClick={() => handleSingleChoice(q.id, opt)}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                            currentAns.selectedOption === opt
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-1 ring-indigo-500'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q_${q.id}`}
                            checked={currentAns.selectedOption === opt}
                            onChange={() => {}}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'Multiple choice' && (
                    <div className="space-y-2 pt-1 pl-8">
                      {(q.options || []).map((opt, optIdx) => {
                        const isChecked = (currentAns.selectedOptions || []).includes(opt);
                        return (
                          <label
                            key={optIdx}
                            onClick={() => handleMultipleChoice(q.id, opt)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-1 ring-indigo-500'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500 border-slate-300"
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'Rating' && (
                    <div className="pt-2 pl-8 flex items-center gap-3 flex-wrap">
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const isSelected = currentAns.rating >= starVal;
                        return (
                          <button
                            type="button"
                            key={starVal}
                            onClick={() => handleRating(q.id, starVal)}
                            className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl border font-black text-sm transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-400 border-amber-500 text-white shadow-md shadow-amber-100 scale-105'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-amber-50 hover:border-amber-300'
                            }`}
                          >
                            <Star className={`w-4 h-4 ${isSelected ? 'fill-white' : 'text-slate-400'}`} />
                            <span className="text-[10px] mt-0.5">{starVal}</span>
                          </button>
                        );
                      })}
                      <span className="text-xs font-bold text-slate-500 ml-2">
                        {currentAns.rating ? `${currentAns.rating} out of 5 stars` : 'Select a rating'}
                      </span>
                    </div>
                  )}

                  {(q.type === 'Short text' || q.type === 'Long text') && (
                    <div className="pt-1 pl-8">
                      {q.type === 'Short text' ? (
                        <input
                          type="text"
                          placeholder="Your answer here..."
                          value={currentAns.textAnswer || ''}
                          onChange={(e) => handleTextChange(q.id, e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 bg-white"
                        />
                      ) : (
                        <textarea
                          rows={3}
                          placeholder="Write your detailed comments and thoughts..."
                          value={currentAns.textAnswer || ''}
                          onChange={(e) => handleTextChange(q.id, e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 bg-white resize-y"
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-100 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50 border-none"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Answers
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==============================================================
   ANALYTICS & RESPONSES MODAL
   ============================================================== */
function SurveyAnalyticsModal({ survey, onClose }) {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!survey?._id) return;
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await surveyService.getSurveyResponses(survey._id);
        if (res.success) {
          setAnalytics(res);
        }
      } catch (err) {
        console.error(err);
        setError('Could not load responses breakdown.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [survey]);

  if (!survey) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 uppercase tracking-wider">
                Responses & Analytics
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Status: {survey.status}
              </span>
            </div>
            <h2 className="text-xl font-black mt-2 leading-snug">{survey.title}</h2>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mt-2">
              <span>Total Responses: <strong className="text-white">{analytics?.totalResponses ?? survey.responsesCount ?? 0}</strong></span>
              <span>•</span>
              <span>Target: <strong className="text-white">{survey.targetAudience}</strong></span>
              <span>•</span>
              <span>Response Rate: <strong className="text-emerald-400">{survey.responseRate || 85}%</strong></span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Analytics Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {loading ? (
            <div className="py-16 text-center text-slate-400 font-bold text-xs flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
              <span>Analyzing responses...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold">
              {error}
            </div>
          ) : (
            <div className="space-y-5">
              {(analytics?.analytics || []).map((qData, idx) => {
                const totalAns = qData.totalAnswers || 0;
                return (
                  <div key={idx} className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 font-black text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-slate-800">{qData.questionText}</h4>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">
                        {totalAns} responses
                      </span>
                    </div>

                    {/* Rating Type Average */}
                    {qData.averageRating && (
                      <div className="flex items-center gap-3 p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                        <div>
                          <div className="text-sm font-black text-amber-900">
                            {qData.averageRating} / 5.0 Average Rating
                          </div>
                          <div className="text-[10px] text-amber-700 font-semibold">
                            Aggregated from {totalAns} respondent scores
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Breakdown for Choice Questions */}
                    {qData.options && qData.options.length > 0 && (
                      <div className="space-y-2 pt-2">
                        {qData.options.map((opt, optIdx) => {
                          const count = qData.breakdown?.[opt] || 0;
                          const pct = totalAns > 0 ? Math.round((count / totalAns) * 100) : 0;
                          return (
                            <div key={optIdx} className="space-y-1">
                              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                                <span>{opt}</span>
                                <span className="text-slate-500 font-extrabold">{count} ({pct}%)</span>
                              </div>
                              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Long text or short text note */}
                    {(qData.type === 'Long text' || qData.type === 'Short text') && (
                      <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 font-medium italic">
                        {totalAns > 0 ? `${totalAns} text feedback submission(s) logged on this question.` : 'No text feedback entries submitted yet.'}
                      </div>
                    )}
                  </div>
                );
              })}

              {(!analytics?.analytics || analytics.analytics.length === 0) && (
                <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs font-semibold">
                  No responses recorded yet for this survey. Share or take it to view live breakdowns!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer transition-colors border-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==============================================================
   CREATE / EDIT FEEDBACK MODAL
   ============================================================== */
function CreateFeedbackModal({ onClose, onCreated, surveys }) {
  const [title, setTitle] = useState('');
  const [surveyTitle, setSurveyTitle] = useState(surveys?.[0]?.title || 'Direct Feedback');
  const [category, setCategory] = useState('Academics');
  const [priority, setPriority] = useState('Medium');
  const [owner, setOwner] = useState('Admin Staff');
  const [submittedBy, setSubmittedBy] = useState('Parent');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Feedback title is required');
      return;
    }
    setSubmitting(true);
    try {
      await surveyService.createFeedback({
        title: title.trim(),
        surveyTitle,
        category,
        priority,
        status: 'New',
        owner,
        submittedBy,
        details
      });
      onCreated && onCreated('Feedback action item logged on triage board!');
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to save feedback item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-8">
        <div className="p-5 bg-gradient-to-r from-orange-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            <h3 className="font-black text-base">Log Feedback Action Item</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white border-none cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-bold text-slate-700">
          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block mb-1">Issue / Feedback Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="e.g. Bus Route 5 arrival delay raised in survey"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Linked Survey</label>
              <select
                value={surveyTitle}
                onChange={(e) => setSurveyTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500 bg-white"
              >
                <option value="Direct Feedback Entry">Direct Feedback Entry</option>
                {surveys.map((s, idx) => (
                  <option key={s._id || idx} value={s.title}>{s.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500 bg-white"
              >
                <option value="Academics">Academics</option>
                <option value="Transport">Transport</option>
                <option value="Canteen">Canteen & Meals</option>
                <option value="Facilities">Campus & Facilities</option>
                <option value="Administration">Administration & Fees</option>
                <option value="Safety">Safety & Discipline</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500 bg-white"
              >
                <option value="Urgent">Urgent (Immediate action)</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Assignee / Owner</label>
              <input
                type="text"
                placeholder="e.g. Transport Incharge"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Details / Notes</label>
            <textarea
              rows={3}
              placeholder="What specifically was flagged and what action should be taken?"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500 resize-y font-normal"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-xs cursor-pointer border-none flex items-center gap-1.5"
            >
              {submitting ? 'Saving...' : 'Save Action Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==============================================================
   DASHBOARD VIEW
   ============================================================== */
function DashboardView({
  surveys,
  stats,
  feedbacks,
  onNewSurvey,
  onMySurveys,
  onTriage,
  onTemplates,
  onGuide,
  onAllSurveys,
  onTakeSurvey,
  onViewAnalytics,
  onDuplicate
}) {
  const publishedCount = stats?.publishedSurveys ?? surveys.filter(s => s.status === 'Published').length;
  const draftCount = stats?.draftSurveys ?? surveys.filter(s => s.status === 'Draft').length;
  const totalResponses = stats?.totalResponses ?? surveys.reduce((acc, s) => acc + (s.responsesCount || 0), 0);
  const avgRate = stats?.avgResponseRate ?? 84;
  const openFeedbackCount = stats?.openFeedbacks ?? feedbacks.filter(f => ['New', 'In progress'].includes(f.status)).length;

  return (
    <div className="p-4 md:p-6 space-y-6 font-sans max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shadow-indigo-100 text-white relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
            <MessageSquare className="w-7 h-7 text-white fill-white/20" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">Feedback & Pulse Command Centre</h1>
            <p className="text-indigo-100 text-xs md:text-sm font-medium mt-1 max-w-xl leading-relaxed">
              Drive school excellence with parent CSAT, student well-being checks, teacher evaluations, and closing loops on the triage board.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button 
            onClick={onGuide} 
            className="px-3.5 py-2 bg-white/15 hover:bg-white/25 transition-all rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border-none text-white backdrop-blur-xs"
          >
            <BookOpen className="w-4 h-4" /> Guide
          </button>
          <button 
            onClick={onTemplates} 
            className="px-3.5 py-2 bg-white/15 hover:bg-white/25 transition-all rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border-none text-white backdrop-blur-xs"
          >
            <LayoutTemplate className="w-4 h-4" /> Templates
          </button>
          <button 
            onClick={onNewSurvey} 
            className="px-4 py-2 bg-white text-indigo-700 hover:bg-slate-50 transition-all rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-indigo-900/20 cursor-pointer border-none"
          >
            <Plus className="w-4 h-4" /> Create Survey
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800">{surveys.length}</div>
          <div className="text-[10px] font-bold text-slate-500 mt-0.5">Surveys & Polls</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Live</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{publishedCount}</div>
          <div className="text-[10px] font-bold text-slate-500 mt-0.5">Published & Active</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Drafts</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
              <FileEdit className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-700">{draftCount}</div>
          <div className="text-[10px] font-bold text-slate-500 mt-0.5">Under Preparation</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Responses</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-700">{totalResponses}</div>
          <div className="text-[10px] font-bold text-slate-500 mt-0.5">Answers Received</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Rate</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600">{avgRate}%</div>
          <div className="text-[10px] font-bold text-slate-500 mt-0.5">Completion Rate</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Triage</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-orange-600">{openFeedbackCount}</div>
          <div className="text-[10px] font-bold text-slate-500 mt-0.5">Open Action Items</div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Recent Surveys Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-sm">
                <RotateCcw className="w-4 h-4 text-indigo-600" />
                <span>Recent Surveys & Polls</span>
                <span className="text-xs text-slate-400 font-semibold">({surveys.length})</span>
              </div>
              <button 
                onClick={onAllSurveys}
                className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 cursor-pointer bg-white transition-colors"
              >
                View all ({surveys.length})
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">SURVEY TITLE</th>
                    <th className="py-3 px-3">KIND</th>
                    <th className="py-3 px-3">TARGET</th>
                    <th className="py-3 px-3 text-center">RESPONSES</th>
                    <th className="py-3 px-3 text-center">STATUS</th>
                    <th className="py-3 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                  {surveys.slice(0, 5).map((row, idx) => (
                    <tr key={row._id || idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            row.kind === 'Poll' ? 'bg-amber-50 text-amber-600' :
                            row.kind === 'Feedback form' ? 'bg-purple-50 text-purple-600' :
                            'bg-indigo-50 text-indigo-600'
                          }`}>
                            {row.kind === 'Poll' ? <Radio className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="text-slate-900 font-extrabold block leading-tight">{row.title}</span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {(row.questions || []).length} questions • {row.responseRate || 0}% rate
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700">
                          {row.kind || 'Survey'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 text-[11px] font-medium">
                        {row.targetAudience || 'All'}
                      </td>
                      <td className="py-3 px-3 text-slate-800 text-center font-bold">
                        {row.responsesCount || 0}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          row.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          row.status === 'Draft' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {row.status === 'Published' && (
                            <button
                              onClick={() => onTakeSurvey(row)}
                              title="Respond to survey"
                              className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-[11px] font-bold cursor-pointer border-none transition-colors"
                            >
                              Take
                            </button>
                          )}
                          <button
                            onClick={() => onViewAnalytics(row)}
                            title="View analytics & responses"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer bg-transparent border-none"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {surveys.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 text-xs font-semibold">
                        No surveys found. Click "+ New Survey" to create your first one!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Quick Actions & Open Feedback */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
            <div className="flex items-center gap-2 p-5 border-b border-slate-100 text-slate-900 font-extrabold text-sm">
              <Zap className="w-4 h-4 text-indigo-600 fill-indigo-100" /> Quick Actions
            </div>
            <div className="p-3 space-y-1">
              <button 
                onClick={onNewSurvey} 
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 cursor-pointer bg-white text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors shrink-0 text-blue-600">
                    <Zap className="w-5 h-5 fill-blue-600" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-slate-800">Create a quick poll</div>
                    <div className="text-[10px] font-semibold text-slate-400">One question, 15 seconds</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </button>

              <button 
                onClick={onTemplates} 
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 cursor-pointer bg-white text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors shrink-0 text-purple-600">
                    <Copy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-slate-800">Start from a template</div>
                    <div className="text-[10px] font-semibold text-slate-400">Parent CSAT, NPS, student well-being</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </button>

              <button 
                onClick={onTriage} 
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 cursor-pointer bg-white text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors shrink-0 text-orange-600">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-slate-800">Feedback triage board</div>
                    <div className="text-[10px] font-semibold text-slate-400">Review & close action items</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </button>

              <button 
                onClick={onMySurveys} 
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 cursor-pointer bg-white text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors shrink-0 text-emerald-600">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-slate-800">Take my surveys</div>
                    <div className="text-[10px] font-semibold text-slate-400">Surveys awaiting your responses</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </button>
            </div>
          </div>

          {/* Open Feedback Alert Items */}
          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <Flag className="w-4 h-4 text-orange-600 fill-orange-100" /> Open Feedback
              </div>
              <button 
                onClick={onTriage}
                className="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 cursor-pointer bg-white"
              >
                Triage Board
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {feedbacks.slice(0, 3).map((fb, idx) => (
                <div 
                  key={fb._id || idx} 
                  onClick={onTriage} 
                  className="p-4 flex items-start gap-3 hover:bg-slate-50/70 transition-colors cursor-pointer"
                >
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase shrink-0 ${
                    fb.priority === 'Urgent' ? 'bg-red-50 text-red-600 border border-red-200' :
                    fb.priority === 'High' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {fb.priority}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{fb.title}</p>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                      {fb.category} • {fb.owner || 'Unassigned'}
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold text-indigo-600 shrink-0">
                    {fb.status}
                  </span>
                </div>
              ))}
              {feedbacks.length === 0 && (
                <div className="p-4 text-center text-slate-400 text-xs font-semibold">
                  No open feedback items currently.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==============================================================
   ALL SURVEYS VIEW
   ============================================================== */
function AllSurveysView({
  surveys,
  onNewSurvey,
  onTemplates,
  onTakeSurvey,
  onViewAnalytics,
  onStatusChange,
  onDuplicate,
  onDelete
}) {
  const [search, setSearch] = useState('');
  const [kindFilter, setKindFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredSurveys = useMemo(() => {
    return surveys.filter(s => {
      const matchSearch = !search.trim() || 
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(search.toLowerCase()));
      const matchKind = kindFilter === 'All' || (s.kind && s.kind.toLowerCase() === kindFilter.toLowerCase());
      const matchStatus = statusFilter === 'All' || s.status === statusFilter;
      return matchSearch && matchKind && matchStatus;
    });
  }, [surveys, search, kindFilter, statusFilter]);

  return (
    <div className="p-4 md:p-6 space-y-6 font-sans max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">All Surveys & Polls</h1>
          <p className="text-slate-500 text-xs md:text-sm font-semibold mt-0.5">
            Manage your questionnaire repository, monitor live responses, and trigger data collection.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onTemplates} 
            className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            <LayoutTemplate className="w-4 h-4 text-slate-500" /> Templates
          </button>
          <button 
            onClick={onNewSurvey} 
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-indigo-100 cursor-pointer border-none transition-all"
          >
            <Plus className="w-4 h-4" /> New Survey
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row items-end gap-3 shadow-xs">
        <div className="flex-1 w-full space-y-1">
          <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
            <Search className="w-3.5 h-3.5 text-slate-400" /> Search Title or Description
          </label>
          <input 
            type="text" 
            placeholder="Type survey name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 bg-white"
          />
        </div>
        <div className="w-full md:w-44 space-y-1">
          <label className="text-[11px] font-bold text-slate-600">Type / Kind</label>
          <select 
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 bg-white"
          >
            <option value="All">All Types</option>
            <option value="Survey">Survey</option>
            <option value="Poll">Poll</option>
            <option value="Feedback form">Feedback Form</option>
          </select>
        </div>
        <div className="w-full md:w-44 space-y-1">
          <label className="text-[11px] font-bold text-slate-600">Status</label>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        {(search || kindFilter !== 'All' || statusFilter !== 'All') && (
          <button
            onClick={() => { setSearch(''); setKindFilter('All'); setStatusFilter('All'); }}
            className="px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 rounded-xl cursor-pointer border-none transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-indigo-950 font-black text-sm">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>Survey Records</span>
          </div>
          <div className="text-xs font-bold text-slate-500">
            Showing {filteredSurveys.length} of {surveys.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">SURVEY</th>
                <th className="py-3 px-3">KIND</th>
                <th className="py-3 px-3">TARGET</th>
                <th className="py-3 px-3 text-center">RESPONSES</th>
                <th className="py-3 px-3 text-center">STATUS</th>
                <th className="py-3 px-3">CLOSES</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {filteredSurveys.map((survey, i) => (
                <tr key={survey._id || i} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-4 max-w-xs">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        survey.kind === 'Poll' ? 'bg-amber-50 text-amber-600' :
                        survey.kind === 'Feedback form' ? 'bg-purple-50 text-purple-600' :
                        'bg-indigo-50 text-indigo-600'
                      }`}>
                        {survey.kind === 'Poll' ? <Radio className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 leading-snug">{survey.title}</div>
                        {survey.description && (
                          <div className="text-[11px] text-slate-400 font-medium truncate max-w-sm mt-0.5">
                            {survey.description}
                          </div>
                        )}
                        <span className="text-[10px] text-slate-400 font-bold block mt-1">
                          {(survey.questions || []).length} questions • Created by {survey.createdBy || 'Admin'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700">
                      {survey.kind || 'Survey'}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-slate-600 text-[11px]">
                    <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold">
                      {survey.targetAudience || 'All'}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-center font-black text-slate-900">
                    <div>{survey.responsesCount || 0}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">{survey.responseRate || 0}% rate</div>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <select
                      value={survey.status}
                      onChange={(e) => onStatusChange(survey._id, e.target.value)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer border appearance-none text-center ${
                        survey.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                        survey.status === 'Draft' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                        'bg-rose-50 text-rose-700 border-rose-300'
                      }`}
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="py-4 px-3 text-slate-500 text-[11px]">
                    {survey.closesAt ? new Date(survey.closesAt).toLocaleDateString() : 'Until closed'}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {survey.status === 'Published' && (
                        <button
                          onClick={() => onTakeSurvey(survey)}
                          className="px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-[11px] font-bold cursor-pointer border-none shadow-xs hover:opacity-90"
                        >
                          Take
                        </button>
                      )}
                      <button
                        onClick={() => onViewAnalytics(survey)}
                        title="Analytics & breakdown"
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg cursor-pointer bg-transparent border-none transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDuplicate(survey._id)}
                        title="Duplicate as draft"
                        className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-slate-100 rounded-lg cursor-pointer bg-transparent border-none transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(survey._id)}
                        title="Delete survey"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer bg-transparent border-none transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSurveys.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs font-semibold">
                    No matching surveys found with the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ==============================================================
   CREATE SURVEY BUILDER VIEW
   ============================================================== */
function CreateSurveyView({ onBack, onSaved, initialTemplate }) {
  const [title, setTitle] = useState(initialTemplate?.title || '');
  const [description, setDescription] = useState(initialTemplate?.description || '');
  const [kind, setKind] = useState(initialTemplate?.kind || 'Survey');
  const [targetAudience, setTargetAudience] = useState(initialTemplate?.targetAudience || 'All');
  const [whoCanRespond, setWhoCanRespond] = useState('Internal (app / panel users)');
  const [closesAt, setClosesAt] = useState('');
  const [questions, setQuestions] = useState(
    initialTemplate?.questions && initialTemplate.questions.length > 0
      ? initialTemplate.questions
      : [
          {
            id: 'q1',
            questionText: 'How would you rate the overall quality of education this term?',
            type: 'Single choice',
            options: ['Excellent', 'Good', 'Average', 'Poor'],
            required: true
          }
        ]
  );
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Add Question
  const handleAddQuestion = () => {
    const newId = `q_${Date.now()}`;
    setQuestions([
      ...questions,
      {
        id: newId,
        questionText: '',
        type: 'Single choice',
        options: ['Option 1', 'Option 2'],
        required: true
      }
    ]);
  };

  // Remove Question
  const handleRemoveQuestion = (idx) => {
    if (questions.length === 1) {
      alert('Survey must contain at least 1 question.');
      return;
    }
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  // Move Question
  const handleMoveQuestion = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= questions.length) return;
    const updated = [...questions];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setQuestions(updated);
  };

  // Update Question Field
  const handleUpdateQuestion = (idx, field, value) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], [field]: value };
    // Set default options if switching to choice
    if (field === 'type') {
      if ((value === 'Single choice' || value === 'Multiple choice') && (!updated[idx].options || updated[idx].options.length === 0)) {
        updated[idx].options = ['Option 1', 'Option 2'];
      }
    }
    setQuestions(updated);
  };

  // Add Option to Question
  const handleAddOption = (qIdx) => {
    const updated = [...questions];
    const opts = updated[qIdx].options || [];
    updated[qIdx].options = [...opts, `Option ${opts.length + 1}`];
    setQuestions(updated);
  };

  // Remove Option
  const handleRemoveOption = (qIdx, optIdx) => {
    const updated = [...questions];
    if (updated[qIdx].options.length <= 2) {
      alert('Choice questions should have at least 2 options.');
      return;
    }
    updated[qIdx].options = updated[qIdx].options.filter((_, i) => i !== optIdx);
    setQuestions(updated);
  };

  // Edit Option Text
  const handleEditOptionText = (qIdx, optIdx, text) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx] = text;
    setQuestions(updated);
  };

  // Submit Save or Publish
  const handleSave = async (statusToSet = 'Published') => {
    setErrorMsg('');
    if (!title.trim()) {
      setErrorMsg('Please enter a survey title.');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].questionText.trim()) {
        setErrorMsg(`Question #${i + 1} has empty text.`);
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        kind,
        status: statusToSet,
        targetAudience,
        targetRoles: targetAudience === 'All' ? ['Parent', 'Student', 'Teacher'] : [targetAudience],
        whoCanRespond,
        closesAt: closesAt ? new Date(closesAt) : null,
        questions
      };

      await surveyService.createSurvey(payload);
      onSaved && onSaved(`Survey "${title}" created and set to ${statusToSet}!`);
      onBack();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to save survey. Please check inputs.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 font-sans max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button 
            onClick={onBack} 
            className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 text-xs font-bold mb-1.5 transition-colors bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to all surveys
          </button>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {initialTemplate ? `Create Survey from Template: ${initialTemplate.title}` : 'Build New Survey or Poll'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleSave('Draft')}
            disabled={saving}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4 text-slate-500" /> Save as Draft
          </button>
          <button 
            onClick={() => handleSave('Published')}
            disabled={saving}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-md shadow-indigo-100 cursor-pointer border-none transition-all"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Publish Survey
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Details & Questions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
            <div className="flex items-center gap-2 p-5 border-b border-slate-100 text-slate-900 font-extrabold bg-slate-50/50">
              <Info className="w-4 h-4 text-indigo-600" />
              <span>Survey Details</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Title <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Term 1 Parent Satisfaction Review"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Description (Shown to respondents)</label>
                <textarea 
                  rows={2}
                  placeholder="Give a short introduction explaining the purpose of this survey."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 resize-y"
                />
              </div>
            </div>
          </div>

          {/* Questions Builder */}
          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <ClipboardList className="w-4 h-4 text-indigo-600" />
                <span>Survey Questions</span>
              </div>
              <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                {questions.length} question(s)
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {questions.map((q, idx) => (
                <div key={q.id || idx} className="p-5 border border-slate-200 rounded-2xl bg-slate-50/40 space-y-4 hover:border-indigo-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
                      Q{idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button 
                        type="button"
                        onClick={() => handleMoveQuestion(idx, -1)}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg cursor-pointer bg-transparent border-none transition-colors disabled:opacity-30"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleMoveQuestion(idx, 1)}
                        disabled={idx === questions.length - 1}
                        title="Move Down"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg cursor-pointer bg-transparent border-none transition-colors disabled:opacity-30"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        title="Delete Question"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer bg-transparent border-none transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        Question Text <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder="Type question here..."
                        value={q.questionText}
                        onChange={(e) => handleUpdateQuestion(idx, 'questionText', e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Question Type</label>
                      <select 
                        value={q.type}
                        onChange={(e) => handleUpdateQuestion(idx, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 bg-white"
                      >
                        <option value="Single choice">Single choice (Radio)</option>
                        <option value="Multiple choice">Multiple choice (Checkboxes)</option>
                        <option value="Rating">Rating (1 to 5 Stars)</option>
                        <option value="Short text">Short text</option>
                        <option value="Long text">Long text (Paragraph)</option>
                      </select>
                    </div>
                  </div>

                  {/* Options for Choice types */}
                  {(q.type === 'Single choice' || q.type === 'Multiple choice') && (
                    <div className="space-y-2 pt-2 border-t border-slate-200/70">
                      <label className="text-xs font-bold text-slate-700 block">Choices / Options</label>
                      <div className="space-y-2">
                        {(q.options || []).map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 w-4 text-center">
                              {optIdx + 1}.
                            </span>
                            <input 
                              type="text" 
                              value={opt}
                              onChange={(e) => handleEditOptionText(idx, optIdx, e.target.value)}
                              placeholder={`Option ${optIdx + 1}`}
                              className="flex-1 px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 bg-white"
                            />
                            <button 
                              type="button"
                              onClick={() => handleRemoveOption(idx, optIdx)}
                              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 bg-transparent border-none cursor-pointer transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleAddOption(idx)}
                        className="mt-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-transparent border-none cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add option
                      </button>
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-2 border-t border-slate-200/60">
                    <input
                      type="checkbox"
                      id={`req_${idx}`}
                      checked={q.required}
                      onChange={(e) => handleUpdateQuestion(idx, 'required', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500 border-slate-300"
                    />
                    <label htmlFor={`req_${idx}`} className="text-xs font-bold text-slate-700 cursor-pointer">
                      Mandatory / Required question
                    </label>
                  </div>
                </div>
              ))}

              <button 
                type="button"
                onClick={handleAddQuestion}
                className="px-4 py-3 border-2 border-dashed border-indigo-200 text-indigo-700 hover:text-indigo-900 hover:border-indigo-400 hover:bg-indigo-50/50 rounded-2xl text-xs font-extrabold flex items-center gap-2 cursor-pointer w-full justify-center transition-all"
              >
                <Plus className="w-4 h-4" /> Add Next Question
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Target Audience & Settings */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
            <div className="flex items-center gap-2 p-5 border-b border-slate-100 text-slate-900 font-extrabold bg-slate-50/50">
              <Settings className="w-4 h-4 text-indigo-600" /> Settings & Distribution
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Questionnaire Type</label>
                <select 
                  value={kind}
                  onChange={(e) => setKind(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 bg-white"
                >
                  <option value="Survey">Comprehensive Survey</option>
                  <option value="Poll">Short Poll</option>
                  <option value="Feedback form">Recurring Feedback Form</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Target Audience</label>
                <select 
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 bg-white"
                >
                  <option value="All">All School Community</option>
                  <option value="Parent">Parents & Guardians</option>
                  <option value="Student">Students</option>
                  <option value="Teacher">Teachers & Academic Staff</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Access Mode</label>
                <select 
                  value={whoCanRespond}
                  onChange={(e) => setWhoCanRespond(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 bg-white"
                >
                  <option value="Internal (app / panel users)">Internal Portal Users</option>
                  <option value="Public link (anyone)">Public Link (Open URL)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Closes At (Optional)</label>
                <input 
                  type="date"
                  value={closesAt}
                  onChange={(e) => setClosesAt(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 bg-white"
                />
                <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                  Leave empty to keep open indefinitely.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==============================================================
   MY SURVEYS (Inbox / Active To Take)
   ============================================================== */
function MySurveysView({ surveys, onTakeSurvey, onViewAnalytics }) {
  const publishedSurveys = surveys.filter(s => s.status === 'Published');

  return (
    <div className="p-4 md:p-6 space-y-6 font-sans max-w-7xl mx-auto pb-20">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">My Surveys & Polls</h1>
        <p className="text-slate-500 text-xs md:text-sm font-semibold mt-0.5">
          Surveys open for responses — take a moment to provide your voice and help shape school operations.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-indigo-950 font-extrabold text-sm">
            <Inbox className="w-4 h-4 text-indigo-600" />
            <span>Active Questionnaires Inbox</span>
          </div>
          <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
            {publishedSurveys.length} Available
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {publishedSurveys.map((survey, i) => (
            <div key={survey._id || i} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-slate-900 text-sm">{survey.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-[10px] font-extrabold text-indigo-700">
                    {survey.kind || 'Survey'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-extrabold text-emerald-700">
                    Open
                  </span>
                </div>
                {survey.description && (
                  <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-3xl">
                    {survey.description}
                  </p>
                )}
                <div className="text-[10px] font-bold text-slate-400 flex items-center gap-3">
                  <span>{(survey.questions || []).length} questions</span>
                  <span>•</span>
                  <span>Target: {survey.targetAudience}</span>
                  <span>•</span>
                  <span>{survey.responsesCount || 0} already submitted</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => onViewAnalytics(survey)}
                  className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                >
                  View Stats
                </button>
                <button 
                  onClick={() => onTakeSurvey(survey)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-100 border-none transition-all"
                >
                  Respond <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {publishedSurveys.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-xs font-semibold">
              No published surveys available right now. Check back soon!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==============================================================
   FEEDBACK TRIAGE VIEW
   ============================================================== */
function FeedbackTriageView({
  feedbacks,
  surveys,
  onOpenCreateModal,
  onStatusChange,
  onDeleteFeedback
}) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [search, setSearch] = useState('');

  const openCount = feedbacks.filter(f => f.status === 'New').length;
  const inProgressCount = feedbacks.filter(f => f.status === 'In progress').length;
  const urgentCount = feedbacks.filter(f => f.priority === 'Urgent').length;
  const resolvedCount = feedbacks.filter(f => ['Actioned', 'Resolved'].includes(f.status)).length;

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(f => {
      const matchSearch = !search.trim() || 
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        (f.details && f.details.toLowerCase().includes(search.toLowerCase())) ||
        (f.category && f.category.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = statusFilter === 'All' || f.status === statusFilter;
      const matchPriority = priorityFilter === 'All' || f.priority === priorityFilter;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [feedbacks, search, statusFilter, priorityFilter]);

  return (
    <div className="p-4 md:p-6 space-y-6 font-sans max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Feedback Triage Board</h1>
          <p className="text-slate-500 text-xs md:text-sm font-semibold mt-0.5">
            Turn survey comments into concrete actions — assign owners, set priorities, and close the loop.
          </p>
        </div>
        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-100 flex items-center gap-2 cursor-pointer border-none transition-all"
        >
          <Plus className="w-4 h-4" /> Log Action Item
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800 leading-tight">{openCount}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Items</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-orange-600 leading-tight">{urgentCount}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Urgent Priority</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-blue-600 leading-tight">{inProgressCount}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Progress</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600 leading-tight">{resolvedCount}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actioned / Done</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row items-end gap-3 shadow-xs">
        <div className="flex-1 w-full space-y-1">
          <label className="text-[11px] font-bold text-slate-600">Search Feedback</label>
          <input 
            type="text" 
            placeholder="Search title, category, details..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 bg-white"
          />
        </div>
        <div className="w-full md:w-44 space-y-1">
          <label className="text-[11px] font-bold text-slate-600">Status</label>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="In progress">In progress</option>
            <option value="Actioned">Actioned</option>
            <option value="Resolved">Resolved</option>
            <option value="Dismissed">Dismissed</option>
          </select>
        </div>
        <div className="w-full md:w-44 space-y-1">
          <label className="text-[11px] font-bold text-slate-600">Priority</label>
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 bg-white"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Triage Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-indigo-950 font-black text-sm">
            <ClipboardList className="w-4 h-4 text-orange-600" />
            <span>Triage Action Items</span>
          </div>
          <div className="text-xs font-bold text-slate-500">
            {filteredFeedbacks.length} item(s)
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-10 text-center">#</th>
                <th className="py-3 px-4">FEEDBACK / ACTION ITEM</th>
                <th className="py-3 px-3">CATEGORY</th>
                <th className="py-3 px-3 text-center">PRIORITY</th>
                <th className="py-3 px-3 text-center">STATUS</th>
                <th className="py-3 px-3">OWNER</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {filteredFeedbacks.map((item, idx) => (
                <tr key={item._id || idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-4 text-center text-slate-400 font-bold">{idx + 1}</td>
                  <td className="py-4 px-4 max-w-sm">
                    <div className="font-extrabold text-slate-900 leading-snug">{item.title}</div>
                    {item.details && (
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-1">{item.details}</div>
                    )}
                    <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                      From: {item.surveyTitle || 'Direct submission'} • by {item.submittedBy || 'Anonymous'}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-slate-600">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-slate-100 text-slate-700">
                      {item.category || 'General'}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      item.priority === 'Urgent' ? 'bg-red-50 text-red-600 border border-red-200' :
                      item.priority === 'High' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                      item.priority === 'Medium' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-center">
                    <select
                      value={item.status}
                      onChange={(e) => onStatusChange(item._id, e.target.value)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer border appearance-none text-center ${
                        item.status === 'New' ? 'bg-red-50 text-red-600 border-red-300' :
                        item.status === 'In progress' ? 'bg-blue-50 text-blue-600 border-blue-300' :
                        'bg-emerald-50 text-emerald-700 border-emerald-300'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="In progress">In progress</option>
                      <option value="Actioned">Actioned</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Dismissed">Dismissed</option>
                    </select>
                  </td>
                  <td className="py-4 px-3 text-slate-800 font-bold text-[11px]">
                    {item.owner || 'Unassigned'}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => onDeleteFeedback(item._id)}
                      title="Delete action item"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer bg-transparent border-none transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredFeedbacks.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs font-semibold">
                    No feedback items match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ==============================================================
   TEMPLATES VIEW
   ============================================================== */
function TemplatesView({ templates, onUseTemplate, onStartBlank }) {
  const tplList = templates.length > 0 ? templates : DEFAULT_TEMPLATES;

  return (
    <div className="p-4 md:p-6 space-y-6 font-sans max-w-7xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Start from a Professional Template</h1>
          <p className="text-slate-500 text-xs md:text-sm font-semibold mt-0.5">
            Professionally designed questions for schools. Pick a template, customize questions, and publish in seconds.
          </p>
        </div>
        <button 
          onClick={onStartBlank} 
          className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
        >
          <FilePlus2 className="w-4 h-4" /> Start Blank Survey
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tplList.map((tpl, i) => (
          <div key={tpl.id || i} className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-200">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm leading-snug">{tpl.title}</h3>
                <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                  {tpl.kind || 'Survey'} • {tpl.targetAudience || 'All'}
                </span>
              </div>
            </div>
            
            <p className="text-xs text-slate-500 font-medium flex-1 mb-6 leading-relaxed">
              {tpl.description}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400">
                {(tpl.questions || []).length} questions
              </span>
              <button 
                onClick={() => onUseTemplate(tpl)} 
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-100 border-none transition-all"
              >
                <Zap className="w-3.5 h-3.5 fill-current" /> Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==============================================================
   GUIDE VIEW
   ============================================================== */
function GuideView({ onDashboard, onTemplates, onNewSurvey, onAllSurveys }) {
  return (
    <div className="p-4 md:p-6 space-y-6 font-sans max-w-7xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button 
            onClick={onDashboard} 
            className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 text-xs font-bold mb-1 transition-colors bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">How Surveys & Feedback Works</h1>
          <p className="text-slate-500 text-xs md:text-sm font-semibold mt-0.5">
            A guide to closing the loop — from asking questions to taking decisive action.
          </p>
        </div>
        <button 
          onClick={onTemplates} 
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-indigo-100 cursor-pointer border-none transition-all"
        >
          <LayoutTemplate className="w-4 h-4" /> Start from Template
        </button>
      </div>

      {/* Info Hero */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-3xl p-5 flex items-start gap-4">
        <Lightbulb className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-extrabold text-indigo-950 text-sm">Unified Survey Engine</h3>
          <p className="text-xs text-indigo-900/80 font-medium mt-1 leading-relaxed">
            One engine powers everything: a <span className="font-bold">poll</span> is a single-question pulse check, and a <span className="font-bold">feedback form</span> can recur term after term. Everything aggregates into actionable reports and triage cards.
          </p>
        </div>
      </div>

      {/* Lifecycle Flow */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
        <div className="flex items-center gap-2 p-5 border-b border-slate-100 text-slate-900 font-extrabold bg-slate-50/50">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>The Complete 5-Step Lifecycle</span>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center">1</div>
            <h4 className="text-sm font-bold text-slate-900">Build & Customize</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Pick a template or build from scratch with Rating, Choice, and Text questions.</p>
          </div>
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center">2</div>
            <h4 className="text-sm font-bold text-slate-900">Target Audiences</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Target parents, teachers, students, or create an open public link.</p>
          </div>
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center">3</div>
            <h4 className="text-sm font-bold text-slate-900">Publish & Collect</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Surveys appear in recipients' "My Surveys" tab with real-time response count tracking.</p>
          </div>
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center">4</div>
            <h4 className="text-sm font-bold text-slate-900">Analyze Breakdown</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Instant visual distribution bars, average star ratings, and response rate analytics.</p>
          </div>
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center">5</div>
            <h4 className="text-sm font-bold text-slate-900">Triage & Act</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Log flagged feedback items, assign staff owners, and resolve parent/student concerns.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==============================================================
   MAIN ROOT COMPONENT: SurveysDashboard
   ============================================================== */
export default function SurveysDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Primary State
  const [surveys, setSurveys] = useState([]);
  const [stats, setStats] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Modals & Active Selections
  const [activeSurveyForTaking, setActiveSurveyForTaking] = useState(null);
  const [activeSurveyForAnalytics, setActiveSurveyForAnalytics] = useState(null);
  const [activeTemplateForBuilder, setActiveTemplateForBuilder] = useState(null);
  const [showCreateFeedbackModal, setShowCreateFeedbackModal] = useState(false);

  // Load all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [surveysRes, statsRes, feedbackRes, tmplRes] = await Promise.all([
        surveyService.getSurveys().catch(() => ({ success: false, data: [] })),
        surveyService.getSurveyStats().catch(() => ({ success: false, data: null })),
        surveyService.getFeedbacks().catch(() => ({ success: false, data: [] })),
        surveyService.getTemplates().catch(() => ({ success: false, data: DEFAULT_TEMPLATES }))
      ]);

      if (surveysRes?.data) setSurveys(surveysRes.data);
      if (statsRes?.data) setStats(statsRes.data);
      if (feedbackRes?.data) setFeedbacks(feedbackRes.data);
      if (tmplRes?.data) setTemplates(tmplRes.data);
    } catch (err) {
      console.error('Failed to load surveys data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Survey Actions
  const handleStatusChange = async (surveyId, newStatus) => {
    try {
      await surveyService.updateStatus(surveyId, newStatus);
      setSurveys(prev => prev.map(s => s._id === surveyId ? { ...s, status: newStatus } : s));
      triggerToast(`Survey status updated to ${newStatus}`);
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleDuplicate = async (surveyId) => {
    try {
      const res = await surveyService.duplicateSurvey(surveyId);
      if (res.data) {
        setSurveys(prev => [res.data, ...prev]);
        triggerToast('Survey duplicated successfully as Draft!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to duplicate survey');
    }
  };

  const handleDeleteSurvey = async (surveyId) => {
    if (!window.confirm('Are you sure you want to delete this survey and all its responses?')) return;
    try {
      await surveyService.deleteSurvey(surveyId);
      setSurveys(prev => prev.filter(s => s._id !== surveyId));
      triggerToast('Survey deleted.');
    } catch (err) {
      console.error(err);
      alert('Failed to delete survey');
    }
  };

  // Feedback Actions
  const handleFeedbackStatusChange = async (feedbackId, newStatus) => {
    try {
      await surveyService.updateFeedback(feedbackId, { status: newStatus });
      setFeedbacks(prev => prev.map(f => f._id === feedbackId ? { ...f, status: newStatus } : f));
      triggerToast(`Feedback item status changed to ${newStatus}`);
    } catch (err) {
      console.error(err);
      alert('Failed to update feedback status');
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Delete this feedback item?')) return;
    try {
      await surveyService.deleteFeedback(feedbackId);
      setFeedbacks(prev => prev.filter(f => f._id !== feedbackId));
      triggerToast('Feedback item removed');
    } catch (err) {
      console.error(err);
      alert('Failed to delete feedback');
    }
  };

  const handleUseTemplate = (tpl) => {
    setActiveTemplateForBuilder(tpl);
    navigate('/surveys/create');
  };

  // Path routing checks
  const isCreateView = location.pathname.includes('/create');
  const isAllView = location.pathname.includes('/all');
  const isMySurveysView = location.pathname.includes('/my-surveys');
  const isFeedbackTriageView = location.pathname.includes('/feedback-triage');
  const isGuideView = location.pathname.includes('/guide');
  const isTemplatesView = location.pathname.includes('/templates');

  const renderContent = () => {
    if (isCreateView) {
      return (
        <CreateSurveyView 
          initialTemplate={activeTemplateForBuilder}
          onBack={() => {
            setActiveTemplateForBuilder(null);
            navigate('/surveys/all');
          }}
          onSaved={(msg) => {
            triggerToast(msg);
            fetchData();
          }}
        />
      );
    }

    if (isGuideView) {
      return (
        <GuideView 
          onDashboard={() => navigate('/surveys/dashboard')}
          onTemplates={() => navigate('/surveys/templates')}
          onNewSurvey={() => navigate('/surveys/create')}
          onAllSurveys={() => navigate('/surveys/all')}
        />
      );
    }

    if (isTemplatesView) {
      return (
        <TemplatesView 
          templates={templates}
          onUseTemplate={handleUseTemplate}
          onStartBlank={() => {
            setActiveTemplateForBuilder(null);
            navigate('/surveys/create');
          }}
        />
      );
    }

    if (isAllView) {
      return (
        <AllSurveysView 
          surveys={surveys}
          onNewSurvey={() => {
            setActiveTemplateForBuilder(null);
            navigate('/surveys/create');
          }} 
          onTemplates={() => navigate('/surveys/templates')}
          onTakeSurvey={(s) => setActiveSurveyForTaking(s)}
          onViewAnalytics={(s) => setActiveSurveyForAnalytics(s)}
          onStatusChange={handleStatusChange}
          onDuplicate={handleDuplicate}
          onDelete={handleDeleteSurvey}
        />
      );
    }

    if (isMySurveysView) {
      return (
        <MySurveysView 
          surveys={surveys}
          onTakeSurvey={(s) => setActiveSurveyForTaking(s)}
          onViewAnalytics={(s) => setActiveSurveyForAnalytics(s)}
        />
      );
    }

    if (isFeedbackTriageView) {
      return (
        <FeedbackTriageView 
          feedbacks={feedbacks}
          surveys={surveys}
          onOpenCreateModal={() => setShowCreateFeedbackModal(true)}
          onStatusChange={handleFeedbackStatusChange}
          onDeleteFeedback={handleDeleteFeedback}
        />
      );
    }

    // Default: Dashboard View
    return (
      <DashboardView 
        surveys={surveys}
        stats={stats}
        feedbacks={feedbacks}
        onNewSurvey={() => {
          setActiveTemplateForBuilder(null);
          navigate('/surveys/create');
        }} 
        onMySurveys={() => navigate('/surveys/my-surveys')} 
        onTriage={() => navigate('/surveys/feedback-triage')}
        onTemplates={() => navigate('/surveys/templates')}
        onGuide={() => navigate('/surveys/guide')}
        onAllSurveys={() => navigate('/surveys/all')}
        onTakeSurvey={(s) => setActiveSurveyForTaking(s)}
        onViewAnalytics={(s) => setActiveSurveyForAnalytics(s)}
        onDuplicate={handleDuplicate}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <SurveysNavHeader 
        onNewSurvey={() => {
          setActiveTemplateForBuilder(null);
          navigate('/surveys/create');
        }}
        stats={stats}
        onRefresh={fetchData}
        loading={loading}
      />

      <div className="flex-1">
        {renderContent()}
      </div>

      {/* Modals */}
      {activeSurveyForTaking && (
        <TakeSurveyModal
          survey={activeSurveyForTaking}
          onClose={() => setActiveSurveyForTaking(null)}
          onSubmitSuccess={(msg) => {
            triggerToast(msg);
            fetchData();
          }}
        />
      )}

      {activeSurveyForAnalytics && (
        <SurveyAnalyticsModal
          survey={activeSurveyForAnalytics}
          onClose={() => setActiveSurveyForAnalytics(null)}
        />
      )}

      {showCreateFeedbackModal && (
        <CreateFeedbackModal
          surveys={surveys}
          onClose={() => setShowCreateFeedbackModal(false)}
          onCreated={(msg) => {
            triggerToast(msg);
            fetchData();
          }}
        />
      )}

      <ToastNotification message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}

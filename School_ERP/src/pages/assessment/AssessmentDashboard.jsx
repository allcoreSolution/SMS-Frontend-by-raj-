import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
  CheckSquare, LayoutDashboard, List, BarChart3, FileText, 
  Trophy, BookOpen, Plus, Eye, History, Layers, CheckCircle, Percent,
  Filter, Edit, Trash2, Database, Search, ArrowUpRight, ArrowDownRight,
  PenSquare, MonitorPlay, Grid, Send, TrendingUp, Info, FileSpreadsheet, 
  Printer, Laptop, Calendar, Award, X, ChevronRight, User, AlertCircle,
  Clock, Download, Sparkles, HelpCircle, Save, Check, RefreshCw
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Legend, PieChart, Pie, Cell 
} from 'recharts';
import AssessmentNavHeader from './AssessmentNavHeader';
import assessmentService, { 
  CLASS_ROSTERS, 
  SUBJECT_OPTIONS, 
  calculateGrade 
} from '../../api/assessmentService';

export default function AssessmentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Determine active view from URL path
  const path = location.pathname;
  const isNew = path.includes('/new');
  const isList = path.includes('/assessments') || path.includes('/list');
  const isEnterMarks = path.includes('/enter-marks');
  const isAnalytics = path.includes('/analytics') || path.includes('/reports');
  const isStudentReport = path.includes('/student-report');
  const isRankList = path.includes('/rank-list');
  const isGuide = path.includes('/guide');
  const isDashboard = !isNew && !isList && !isEnterMarks && !isAnalytics && !isStudentReport && !isRankList && !isGuide;

  // Global State
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState({
    totalAssessments: 0,
    publishedCount: 0,
    evaluatedCount: 0,
    scheduledCount: 0,
    overallAveragePercentage: 0,
    totalSittings: 0
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Modals state
  const [showNewModal, setShowNewModal] = useState(isNew);
  const [viewModalItem, setViewModalItem] = useState(null);
  const [activeMarksAssessment, setActiveMarksAssessment] = useState(null);

  // Filters for Assessments List
  const [filterType, setFilterType] = useState('All');
  const [filterClass, setFilterClass] = useState('All');
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for New Assessment
  const [newForm, setNewForm] = useState({
    title: '',
    type: 'Quiz',
    classSec: 'Class 10-A',
    subject: 'Mathematics',
    totalMarks: 25,
    passingMarks: 10,
    date: new Date().toISOString().split('T')[0],
    recurrence: 'Weekly',
    conductedVia: 'Paper / Pen',
    instructions: ''
  });

  // Enter Marks Working State
  const [marksGridEntries, setMarksGridEntries] = useState([]);
  const [savingMarks, setSavingMarks] = useState(false);

  // Student Report State
  const [reportClass, setReportClass] = useState('Class 10-A');
  const [reportStudent, setReportStudent] = useState('Aarav Sharma');
  const [studentDossier, setStudentDossier] = useState(null);

  // Rank List State
  const [rankClass, setRankClass] = useState('Class 10-A');
  const [rankScope, setRankScope] = useState('Overall');
  const [selectedRankAssessmentId, setSelectedRankAssessmentId] = useState('');
  const [rankData, setRankData] = useState([]);

  // Analytics State
  const [analyticsClass, setAnalyticsClass] = useState('Class 10-A');
  const [analyticsSubject, setAnalyticsSubject] = useState('All');

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Load Assessments & Stats
  const loadData = async () => {
    try {
      setLoading(true);
      const [list, statsData] = await Promise.all([
        assessmentService.getAssessments(),
        assessmentService.getAssessmentStats()
      ]);
      setAssessments(list);
      setStats(statsData);

      // Check if URL has a specific ID for enter-marks
      if (params.id) {
        const found = list.find(a => a._id === params.id || a.id === params.id);
        if (found) {
          setupMarksGrid(found);
        }
      } else if (list.length > 0 && !activeMarksAssessment) {
        setupMarksGrid(list[0]);
      }
    } catch (err) {
      console.error('Error loading assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update subjects options when newForm.classSec changes
  useEffect(() => {
    const subjects = SUBJECT_OPTIONS[newForm.classSec] || ['General'];
    if (!subjects.includes(newForm.subject)) {
      setNewForm(prev => ({ ...prev, subject: subjects[0] }));
    }
  }, [newForm.classSec]);

  // Setup Marks Grid for a specific assessment
  const setupMarksGrid = (item) => {
    setActiveMarksAssessment(item);
    const entries = (item.entries && item.entries.length > 0)
      ? JSON.parse(JSON.stringify(item.entries))
      : (CLASS_ROSTERS[item.classSec] || CLASS_ROSTERS['Class 10-A']).map(s => ({
          studentName: s.studentName,
          rollNo: s.rollNo,
          admissionNo: s.admissionNo,
          marksObtained: 0,
          maxMarks: item.totalMarks,
          percentage: 0,
          grade: 'F',
          status: 'Present',
          teacherRemarks: ''
        }));
    setMarksGridEntries(entries);
  };

  // Handle Marks Entry Change
  const handleMarkChange = (index, val) => {
    const num = Math.max(0, Math.min(Number(val) || 0, activeMarksAssessment?.totalMarks || 100));
    setMarksGridEntries(prev => {
      const copy = [...prev];
      const maxM = activeMarksAssessment?.totalMarks || 25;
      const pct = maxM > 0 ? Math.round((num / maxM) * 1000) / 10 : 0;
      copy[index] = {
        ...copy[index],
        marksObtained: num,
        percentage: pct,
        grade: copy[index].status === 'Absent' ? 'F' : calculateGrade(pct)
      };
      return copy;
    });
  };

  // Handle Status Toggle (Present / Absent)
  const handleStatusToggle = (index) => {
    setMarksGridEntries(prev => {
      const copy = [...prev];
      const current = copy[index].status;
      const nextStatus = current === 'Present' ? 'Absent' : 'Present';
      const maxM = activeMarksAssessment?.totalMarks || 25;
      const pct = nextStatus === 'Absent' ? 0 : (maxM > 0 ? Math.round((copy[index].marksObtained / maxM) * 1000) / 10 : 0);
      copy[index] = {
        ...copy[index],
        status: nextStatus,
        percentage: pct,
        grade: nextStatus === 'Absent' ? 'F' : calculateGrade(pct)
      };
      return copy;
    });
  };

  // Handle Teacher Remarks Change
  const handleRemarksChange = (index, text) => {
    setMarksGridEntries(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], teacherRemarks: text };
      return copy;
    });
  };

  // Save Marks Submission
  const handleSaveMarks = async (publish = false) => {
    if (!activeMarksAssessment) return;
    try {
      setSavingMarks(true);
      const updated = await assessmentService.saveMarks(
        activeMarksAssessment._id || activeMarksAssessment.id,
        marksGridEntries,
        publish
      );
      showToast(
        publish ? 'Marks saved & results published to students!' : 'Marks evaluation draft saved successfully!',
        'success'
      );
      setActiveMarksAssessment(updated);
      loadData();
    } catch {
      showToast('Failed to save marks', 'error');
    } finally {
      setSavingMarks(false);
    }
  };

  // Create New Assessment Handler
  const handleCreateAssessment = async (e) => {
    e.preventDefault();
    if (!newForm.title.trim()) {
      showToast('Please enter an assessment title', 'error');
      return;
    }

    try {
      const created = await assessmentService.createAssessment(newForm);
      showToast(`Created "${created.title}" successfully!`);
      setShowNewModal(false);
      setNewForm({
        title: '',
        type: 'Quiz',
        classSec: 'Class 10-A',
        subject: 'Mathematics',
        totalMarks: 25,
        passingMarks: 10,
        date: new Date().toISOString().split('T')[0],
        recurrence: 'Weekly',
        conductedVia: 'Paper / Pen',
        instructions: ''
      });
      loadData();
      if (isNew) {
        navigate('/assessment/list');
      }
    } catch {
      showToast('Failed to create assessment', 'error');
    }
  };

  // Delete Assessment
  const handleDeleteAssessment = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await assessmentService.deleteAssessment(id);
        showToast('Assessment deleted successfully');
        loadData();
      } catch {
        showToast('Failed to delete assessment', 'error');
      }
    }
  };

  // Publish Quick Action
  const handleQuickPublish = async (id) => {
    try {
      await assessmentService.publishAssessment(id);
      showToast('Assessment results published!');
      loadData();
    } catch {
      showToast('Failed to publish assessment', 'error');
    }
  };

  // Load Student Dossier on Change
  useEffect(() => {
    if (isStudentReport && reportStudent) {
      assessmentService.getStudentReport(reportStudent, reportClass).then(data => {
        setStudentDossier(data);
      });
    }
  }, [isStudentReport, reportClass, reportStudent]);

  // Load Rank Data on Change
  useEffect(() => {
    if (isRankList) {
      const aId = rankScope === 'Single' ? selectedRankAssessmentId : undefined;
      assessmentService.getRankList(rankClass, aId).then(res => {
        setRankData(res.data || []);
      });
    }
  }, [isRankList, rankClass, rankScope, selectedRankAssessmentId]);

  // Filtered Assessments for List View
  const filteredAssessments = useMemo(() => {
    return assessments.filter(item => {
      const matchType = filterType === 'All' || item.type === filterType;
      const matchClass = filterClass === 'All' || (item.classSec && item.classSec.toLowerCase().includes(filterClass.toLowerCase()));
      const matchSubject = filterSubject === 'All' || item.subject === filterSubject;
      const matchStatus = filterStatus === 'All' || item.status === filterStatus;
      const matchSearch = !searchQuery || 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.classSec?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchType && matchClass && matchSubject && matchStatus && matchSearch;
    });
  }, [assessments, filterType, filterClass, filterSubject, filterStatus, searchQuery]);

  // Analytics Chart Data
  const analyticsData = useMemo(() => {
    const classFiltered = assessments.filter(a => 
      a.classSec.toLowerCase().includes(analyticsClass.toLowerCase()) &&
      (analyticsSubject === 'All' || a.subject === analyticsSubject)
    );

    // Score Bands
    let band90Plus = 0;
    let band75To89 = 0;
    let band60To74 = 0;
    let band40To59 = 0;
    let bandBelow40 = 0;

    classFiltered.forEach(a => {
      (a.entries || []).forEach(e => {
        if (e.status !== 'Absent') {
          if (e.percentage >= 90) band90Plus++;
          else if (e.percentage >= 75) band75To89++;
          else if (e.percentage >= 60) band60To74++;
          else if (e.percentage >= 40) band40To59++;
          else bandBelow40++;
        }
      });
    });

    const scoreDistribution = [
      { band: '90-100% (A+)', count: band90Plus, color: '#10b981' },
      { band: '75-89% (A)', count: band75To89, color: '#3b82f6' },
      { band: '60-74% (B+ / B)', count: band60To74, color: '#8b5cf6' },
      { band: '40-59% (C / D)', count: band40To59, color: '#f59e0b' },
      { band: '< 40% (Fail)', count: bandBelow40, color: '#ef4444' }
    ];

    // Longitudinal Trend Line
    const trendHistory = classFiltered
      .filter(a => a.stats?.averageScore > 0)
      .map(a => ({
        date: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        title: a.title.length > 18 ? a.title.slice(0, 16) + '...' : a.title,
        avgPct: a.totalMarks > 0 ? Math.round((a.stats.averageScore / a.totalMarks) * 100) : 0,
        passPct: a.stats.passPercentage || 0
      }));

    return { scoreDistribution, trendHistory };
  }, [assessments, analyticsClass, analyticsSubject]);

  return (
    <div className="min-h-screen bg-slate-50/70 font-sans pb-24 text-slate-800">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 animate-slide-up">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Navigation Sticky Header */}
      <AssessmentNavHeader 
        onOpenNewModal={() => setShowNewModal(true)}
        onOpenQuickMarks={() => navigate('/assessment/enter-marks')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ============================================================== */}
        {/* VIEW 1: DASHBOARD TAB                                          */}
        {/* ============================================================== */}
        {isDashboard && (
          <div className="space-y-6">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Total Assessments */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Assessments
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <List className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{stats.totalAssessments}</span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center">
                    <ArrowUpRight className="w-3.5 h-3.5" /> Active Session
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Sittings Scheduled</span>
                  <span className="font-bold text-slate-700">{stats.totalSittings || stats.totalAssessments}</span>
                </div>
              </div>

              {/* Card 2: Published Results */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Published & Live
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{stats.publishedCount}</span>
                  <span className="text-xs font-semibold text-emerald-600">
                    {stats.totalAssessments > 0 ? Math.round((stats.publishedCount / stats.totalAssessments) * 100) : 0}% rate
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Parent Portal Visible</span>
                  <span className="font-bold text-emerald-600">Active</span>
                </div>
              </div>

              {/* Card 3: Evaluated Drafts */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Pending Evaluation
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <PenSquare className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{stats.scheduledCount + stats.evaluatedCount}</span>
                  <span className="text-xs font-semibold text-amber-600">
                    {stats.scheduledCount} scheduled
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Need Marks Entry</span>
                  <span className="font-bold text-amber-600">{stats.scheduledCount} items</span>
                </div>
              </div>

              {/* Card 4: Average Score */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Campus Average
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{stats.overallAveragePercentage}%</span>
                  <span className="text-xs font-semibold text-purple-600">Grade B+</span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Target Benchmark</span>
                  <span className="font-bold text-slate-700">75%</span>
                </div>
              </div>

            </div>

            {/* Middle Section: Recent Evaluations & Quick Gradebook Trigger */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Recent Assessments Table */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-600" />
                    <h2 className="text-sm font-bold text-slate-900">Recent Classroom Assessments</h2>
                  </div>
                  <button 
                    onClick={() => navigate('/assessment/list')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    View all {assessments.length} <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/60 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-5">Title & Type</th>
                        <th className="py-3 px-5">Class & Subject</th>
                        <th className="py-3 px-5 text-center">Marks</th>
                        <th className="py-3 px-5 text-center">Status</th>
                        <th className="py-3 px-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium">
                      {assessments.slice(0, 5).map((item) => (
                        <tr key={item._id || item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-5">
                            <div className="font-bold text-slate-900">{item.title}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700">
                                {item.type}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {new Date(item.date).toLocaleDateString()}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-5">
                            <div className="font-semibold text-slate-800">{item.classSec}</div>
                            <div className="text-[11px] text-slate-500">{item.subject}</div>
                          </td>
                          <td className="py-3.5 px-5 text-center">
                            <div className="font-bold text-slate-900">
                              {item.stats?.averageScore ? `${item.stats.averageScore}/${item.totalMarks}` : item.totalMarks}
                            </div>
                            <div className="text-[10px] text-slate-400">Pass: {item.passingMarks}</div>
                          </td>
                          <td className="py-3.5 px-5 text-center">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === 'Published' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : item.status === 'Evaluated'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setViewModalItem(item)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                                title="View Marksheet"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setupMarksGrid(item);
                                  navigate('/assessment/enter-marks');
                                }}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                                title="Enter / Edit Marks"
                              >
                                <PenSquare className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right 1 Col: Quick Workflow & Fast Gradebook */}
              <div className="space-y-4">
                
                {/* Fast Action Card */}
                <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
                  <div className="relative z-10 space-y-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-md">
                      <Sparkles className="w-3 h-3 text-amber-300" /> Instant Mark Entry
                    </span>
                    <h3 className="text-base font-bold text-white">Speed Evaluation Gradebook</h3>
                    <p className="text-xs text-indigo-100/90 leading-relaxed">
                      Evaluate student sittings in an inline Excel-like grid with auto percentage, letter grades, and 1-click publishing.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => navigate('/assessment/enter-marks')}
                        className="w-full py-2.5 px-4 rounded-xl bg-white text-indigo-900 font-bold text-xs hover:bg-indigo-50 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                      >
                        <PenSquare className="w-3.5 h-3.5" /> Open Mark Entry Grid
                      </button>
                    </div>
                  </div>
                </div>

                {/* Top Performers Mini Leaderboard */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" /> Class 10-A Top Scorers
                    </h3>
                    <button
                      onClick={() => navigate('/assessment/rank-list')}
                      className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer"
                    >
                      Leaderboard
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { rank: '1', name: 'Aarav Sharma', score: '94.8%', badge: 'bg-amber-100 text-amber-800 border-amber-300' },
                      { rank: '2', name: 'Ananya Iyer', score: '94.3%', badge: 'bg-slate-100 text-slate-700 border-slate-300' },
                      { rank: '3', name: 'Diya Patel', score: '87.4%', badge: 'bg-orange-100 text-orange-800 border-orange-300' }
                    ].map((s) => (
                      <div key={s.rank} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black border ${s.badge}`}>
                            {s.rank}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{s.name}</span>
                        </div>
                        <span className="text-xs font-black text-indigo-700">{s.score}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: ALL ASSESSMENTS LIST TAB                               */}
        {/* ============================================================== */}
        {isList && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
            
            {/* Filter Bar */}
            <div className="p-5 border-b border-slate-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Assessments Catalogue ({filteredAssessments.length})
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowNewModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Assessment
                  </button>
                </div>
              </div>

              {/* Filters grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Search</label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Title or topic..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Type</label>
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="All">All Types</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Unit Test">Unit Test</option>
                    <option value="Periodic Test">Periodic Test</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Practical">Practical</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Class</label>
                  <select 
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="All">All Classes</option>
                    <option value="Class 10-A">Class 10-A</option>
                    <option value="Class 9-B">Class 9-B</option>
                    <option value="Class 11-A">Class 11-A</option>
                    <option value="Class 8-C">Class 8-C</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Subject</label>
                  <select 
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="All">All Subjects</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English">English</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Status</label>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Published">Published</option>
                    <option value="Evaluated">Evaluated</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-5">Title & Format</th>
                    <th className="py-3 px-5">Class & Subject</th>
                    <th className="py-3 px-5 text-center">Marks</th>
                    <th className="py-3 px-5 text-center">Class Avg</th>
                    <th className="py-3 px-5 text-center">Status</th>
                    <th className="py-3 px-5 text-center">Date</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {filteredAssessments.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">
                        No assessments match the selected criteria.
                      </td>
                    </tr>
                  ) : filteredAssessments.map((item) => (
                    <tr key={item._id || item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700">
                            {item.type}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Via: {item.conductedVia}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-800">{item.classSec}</div>
                        <div className="text-[11px] text-slate-500">{item.subject}</div>
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <div className="font-bold text-slate-900">{item.totalMarks}</div>
                        <div className="text-[10px] text-slate-400">Pass: {item.passingMarks}</div>
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        {item.stats?.averageScore ? (
                          <div>
                            <span className="font-bold text-slate-800">{item.stats.averageScore}</span>
                            <div className="text-[10px] text-emerald-600 font-semibold">{item.stats.passPercentage}% pass</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Not graded</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.status === 'Evaluated'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-center text-slate-500 text-[11px]">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewModalItem(item)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                            title="View Marksheet"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setupMarksGrid(item);
                              navigate('/assessment/enter-marks');
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="Enter Marks"
                          >
                            <PenSquare className="w-4 h-4" />
                          </button>

                          {item.status !== 'Published' && (
                            <button
                              onClick={() => handleQuickPublish(item._id || item.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                              title="Publish Results"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteAssessment(item._id || item.id, item.title)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: ENTER MARKS / FAST GRADEBOOK TAB                       */}
        {/* ============================================================== */}
        {isEnterMarks && (
          <div className="space-y-4">
            
            {/* Top Selector Banner */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  Speed Gradebook
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  Enter Marks for: {activeMarksAssessment?.title || 'Select Assessment'}
                </h2>
                <p className="text-xs text-slate-500">
                  {activeMarksAssessment?.classSec} • {activeMarksAssessment?.subject} • Max: {activeMarksAssessment?.totalMarks} Marks • Pass: {activeMarksAssessment?.passingMarks} Marks
                </p>
              </div>

              {/* Assessment Switcher Dropdown */}
              <div className="flex items-center gap-3">
                <select
                  value={activeMarksAssessment?._id || activeMarksAssessment?.id || ''}
                  onChange={(e) => {
                    const sel = assessments.find(a => (a._id === e.target.value || a.id === e.target.value));
                    if (sel) setupMarksGrid(sel);
                  }}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold bg-white"
                >
                  {assessments.map(a => (
                    <option key={a._id || a.id} value={a._id || a.id}>
                      {a.classSec}: {a.title}
                    </option>
                  ))}
                </select>

                <button
                  disabled={savingMarks}
                  onClick={() => handleSaveMarks(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-slate-500" /> Save Draft
                </button>

                <button
                  disabled={savingMarks}
                  onClick={() => handleSaveMarks(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md shadow-emerald-200 cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Save & Publish
                </button>
              </div>
            </div>

            {/* Quick Metrics of Current Marks State */}
            {activeMarksAssessment && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Total Students</div>
                  <div className="text-lg font-black text-slate-800">{marksGridEntries.length}</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Present Count</div>
                  <div className="text-lg font-black text-emerald-600">
                    {marksGridEntries.filter(e => e.status !== 'Absent').length}
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Average %</div>
                  <div className="text-lg font-black text-indigo-600">
                    {marksGridEntries.filter(e => e.status !== 'Absent').length > 0
                      ? Math.round(
                          marksGridEntries
                            .filter(e => e.status !== 'Absent')
                            .reduce((sum, e) => sum + (e.percentage || 0), 0) /
                          marksGridEntries.filter(e => e.status !== 'Absent').length
                        )
                      : 0}%
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Status</div>
                  <div className="text-sm font-black text-purple-600 mt-0.5">
                    {activeMarksAssessment.status}
                  </div>
                </div>
              </div>
            )}

            {/* Spreadsheet Gradebook Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-5 w-16 text-center">Roll</th>
                      <th className="py-3 px-5">Student Name</th>
                      <th className="py-3 px-5 text-center">Attendance</th>
                      <th className="py-3 px-5 text-center w-36">
                        Marks (Max: {activeMarksAssessment?.totalMarks || 25})
                      </th>
                      <th className="py-3 px-5 text-center w-28">Score %</th>
                      <th className="py-3 px-5 text-center w-24">Grade</th>
                      <th className="py-3 px-5">Teacher Observation / Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium">
                    {marksGridEntries.map((entry, idx) => (
                      <tr 
                        key={idx} 
                        className={`hover:bg-indigo-50/30 transition-colors ${
                          entry.status === 'Absent' ? 'bg-slate-50/70 text-slate-400' : ''
                        }`}
                      >
                        <td className="py-3 px-5 text-center font-bold text-slate-700">
                          {entry.rollNo || idx + 1}
                        </td>
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {entry.studentName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{entry.studentName}</div>
                              <div className="text-[10px] text-slate-400">{entry.admissionNo || 'ADM-2024'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-5 text-center">
                          <button
                            type="button"
                            onClick={() => handleStatusToggle(idx)}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                              entry.status === 'Present'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                                : 'bg-red-50 text-red-700 border border-red-300'
                            }`}
                          >
                            {entry.status}
                          </button>
                        </td>
                        <td className="py-3 px-5 text-center">
                          <input
                            type="number"
                            min="0"
                            max={activeMarksAssessment?.totalMarks || 100}
                            value={entry.status === 'Absent' ? 0 : entry.marksObtained}
                            disabled={entry.status === 'Absent'}
                            onChange={(e) => handleMarkChange(idx, e.target.value)}
                            className="w-24 px-3 py-1.5 text-center text-sm font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white shadow-3xs"
                          />
                        </td>
                        <td className="py-3 px-5 text-center">
                          <span className="font-bold text-slate-800 text-sm">
                            {entry.percentage}%
                          </span>
                        </td>
                        <td className="py-3 px-5 text-center">
                          <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-black ${
                            entry.grade === 'A+' ? 'bg-emerald-100 text-emerald-800' :
                            entry.grade === 'A' ? 'bg-teal-100 text-teal-800' :
                            entry.grade === 'B+' || entry.grade === 'B' ? 'bg-indigo-100 text-indigo-800' :
                            entry.grade === 'C' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {entry.grade}
                          </span>
                        </td>
                        <td className="py-3 px-5">
                          <input
                            type="text"
                            placeholder="e.g. Well formulated steps, good handwriting"
                            value={entry.teacherRemarks || ''}
                            onChange={(e) => handleRemarksChange(idx, e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Tip: Use <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[10px]">Tab</kbd> to move fast through student marks inputs.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={savingMarks}
                    onClick={() => handleSaveMarks(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Draft
                  </button>
                  <button
                    disabled={savingMarks}
                    onClick={() => handleSaveMarks(true)}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md shadow-emerald-200 cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Save & Publish Results
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 4: ANALYTICS & TRENDS TAB                                 */}
        {/* ============================================================== */}
        {isAnalytics && (
          <div className="space-y-6">
            
            {/* Filter Bar */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Formative Assessment Analytics</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Deep-dive grade distributions, longitudinal trend lines, and learning outcome mastery.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={analyticsClass}
                  onChange={(e) => setAnalyticsClass(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-bold bg-white focus:outline-none"
                >
                  <option value="Class 10-A">Class 10-A</option>
                  <option value="Class 9-B">Class 9-B</option>
                  <option value="Class 11-A">Class 11-A</option>
                  <option value="Class 8-C">Class 8-C</option>
                </select>

                <select
                  value={analyticsSubject}
                  onChange={(e) => setAnalyticsSubject(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-bold bg-white focus:outline-none"
                >
                  <option value="All">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Chart 1: Grade Band Distribution */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-600" /> Score Band Distribution
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-400">Total Attempts</span>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.scoreDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="band" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {analyticsData.scoreDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Longitudinal Progress Trend */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" /> Longitudinal Test Averages (%)
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-600">Chronological Progression</span>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.trendHistory}>
                      <defs>
                        <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" dataKey="avgPct" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAvg)" name="Class Average %" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 5: STUDENT DOSSIER / PROGRESS REPORT                      */}
        {/* ============================================================== */}
        {isStudentReport && (
          <div className="space-y-6">
            
            {/* Student Picker Bar */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Student Progress Dossier</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Longitudinal assessment tracking, test-by-test breakdown & printable diagnostic card.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={reportClass}
                  onChange={(e) => {
                    setReportClass(e.target.value);
                    const students = CLASS_ROSTERS[e.target.value] || [];
                    if (students[0]) setReportStudent(students[0].studentName);
                  }}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-bold bg-white focus:outline-none"
                >
                  <option value="Class 10-A">Class 10-A</option>
                  <option value="Class 9-B">Class 9-B</option>
                  <option value="Class 11-A">Class 11-A</option>
                  <option value="Class 8-C">Class 8-C</option>
                </select>

                <select
                  value={reportStudent}
                  onChange={(e) => setReportStudent(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-bold bg-white focus:outline-none"
                >
                  {(CLASS_ROSTERS[reportClass] || []).map(s => (
                    <option key={s.studentName} value={s.studentName}>
                      {s.studentName} ({s.rollNo})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" /> Print Dossier
                </button>
              </div>
            </div>

            {/* Student Dossier Card */}
            {studentDossier && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden print:border-none print:shadow-none space-y-6 p-6">
                
                {/* Dossier Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-100">
                      {reportStudent.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">{reportStudent}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>Class: <strong>{reportClass}</strong></span>
                        <span>•</span>
                        <span>Evaluation Tests Taken: <strong>{studentDossier.totalTests}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-indigo-50/60 border border-indigo-100/80 rounded-2xl px-5 py-3">
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase text-indigo-500 tracking-wider">Overall Average</div>
                      <div className="text-2xl font-black text-indigo-900">{studentDossier.averagePercentage}%</div>
                    </div>
                    <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                      {calculateGrade(studentDossier.averagePercentage)}
                    </span>
                  </div>
                </div>

                {/* History Table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Test-by-Test Assessment Record
                  </h4>

                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          <th className="py-2.5 px-4">Test Title</th>
                          <th className="py-2.5 px-4">Subject</th>
                          <th className="py-2.5 px-4 text-center">Marks</th>
                          <th className="py-2.5 px-4 text-center">Percentage</th>
                          <th className="py-2.5 px-4 text-center">Grade</th>
                          <th className="py-2.5 px-4">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {studentDossier.history.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="py-8 text-center text-slate-400">
                              No assessment records found for this student.
                            </td>
                          </tr>
                        ) : studentDossier.history.map((rec, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="py-3 px-4 font-bold text-slate-900">
                              {rec.title}
                              <div className="text-[10px] text-slate-400 font-normal">
                                {new Date(rec.date).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-600 font-semibold">{rec.subject}</td>
                            <td className="py-3 px-4 text-center font-bold text-slate-800">
                              {rec.marksObtained} / {rec.maxMarks}
                            </td>
                            <td className="py-3 px-4 text-center font-bold text-indigo-600">
                              {rec.percentage}%
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 text-slate-700">
                                {rec.grade}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-500 text-[11px] italic">
                              {rec.teacherRemarks || 'Satisfactory attempt'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 6: RANK LIST & LEADERBOARD TAB                            */}
        {/* ============================================================== */}
        {isRankList && (
          <div className="space-y-6">
            
            {/* Rank Filter Bar */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Class Leaderboard & Rank Podium</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time calculated ranks based on cumulative classroom performance or single sitting.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={rankClass}
                  onChange={(e) => setRankClass(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-bold bg-white focus:outline-none"
                >
                  <option value="Class 10-A">Class 10-A</option>
                  <option value="Class 9-B">Class 9-B</option>
                  <option value="Class 11-A">Class 11-A</option>
                  <option value="Class 8-C">Class 8-C</option>
                </select>

                <select
                  value={rankScope}
                  onChange={(e) => setRankScope(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-bold bg-white focus:outline-none"
                >
                  <option value="Overall">Overall Cumulative</option>
                  <option value="Single">Single Sitting</option>
                </select>

                {rankScope === 'Single' && (
                  <select
                    value={selectedRankAssessmentId}
                    onChange={(e) => setSelectedRankAssessmentId(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-bold bg-white focus:outline-none"
                  >
                    <option value="">Select assessment...</option>
                    {assessments.filter(a => a.classSec.toLowerCase().includes(rankClass.toLowerCase())).map(a => (
                      <option key={a._id || a.id} value={a._id || a.id}>{a.title}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Podium View for Top 3 */}
            {rankData.length >= 3 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-6">
                
                {/* 2nd Place */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs text-center order-2 md:order-1">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 border-2 border-slate-300 text-slate-700 flex items-center justify-center font-black text-sm">
                    🥈
                  </div>
                  <h4 className="font-bold text-slate-900 mt-2 text-sm">{rankData[1].studentName}</h4>
                  <div className="text-xl font-black text-slate-700 mt-1">{rankData[1].percentage}%</div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 mt-2">
                    Rank #2
                  </span>
                </div>

                {/* 1st Place Gold */}
                <div className="bg-gradient-to-b from-amber-50 to-white rounded-2xl border-2 border-amber-300 p-6 shadow-md text-center order-1 md:order-2 transform md:-translate-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-amber-400 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-amber-200">
                    🥇
                  </div>
                  <h4 className="font-black text-slate-900 mt-3 text-base">{rankData[0].studentName}</h4>
                  <div className="text-3xl font-black text-amber-600 mt-1">{rankData[0].percentage}%</div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-white shadow-xs mt-2">
                    Rank #1 • Distinction
                  </span>
                </div>

                {/* 3rd Place */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs text-center order-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-orange-100 border-2 border-orange-300 text-orange-700 flex items-center justify-center font-black text-sm">
                    🥉
                  </div>
                  <h4 className="font-bold text-slate-900 mt-2 text-sm">{rankData[2].studentName}</h4>
                  <div className="text-xl font-black text-orange-700 mt-1">{rankData[2].percentage}%</div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 mt-2">
                    Rank #3
                  </span>
                </div>

              </div>
            )}

            {/* Full Rank Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-5 text-center w-20">Rank</th>
                      <th className="py-3 px-5">Student Name</th>
                      <th className="py-3 px-5 text-center">Roll No</th>
                      <th className="py-3 px-5 text-center">Marks Scored</th>
                      <th className="py-3 px-5 text-center">Percentage</th>
                      <th className="py-3 px-5 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium">
                    {rankData.map((item) => (
                      <tr key={item.rank} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-5 text-center">
                          <span className={`inline-flex w-7 h-7 rounded-lg items-center justify-center font-black text-xs ${
                            item.rank === 1 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                            item.rank === 2 ? 'bg-slate-100 text-slate-700 border border-slate-300' :
                            item.rank === 3 ? 'bg-orange-100 text-orange-800 border border-orange-300' :
                            'bg-slate-50 text-slate-600'
                          }`}>
                            {item.rank}
                          </span>
                        </td>
                        <td className="py-3 px-5">
                          <div className="font-bold text-slate-900">{item.studentName}</div>
                          <div className="text-[10px] text-slate-400">{item.admissionNo}</div>
                        </td>
                        <td className="py-3 px-5 text-center text-slate-600 font-semibold">{item.rollNo}</td>
                        <td className="py-3 px-5 text-center font-bold text-slate-800">
                          {item.totalMarksObtained !== undefined 
                            ? `${item.totalMarksObtained} / ${item.totalMaxMarks}` 
                            : `${item.marksObtained} / ${item.maxMarks}`}
                        </td>
                        <td className="py-3 px-5 text-center">
                          <span className="font-black text-indigo-600 text-sm">{item.percentage}%</span>
                        </td>
                        <td className="py-3 px-5 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 text-slate-800">
                            {item.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 7: GUIDE & BEST PRACTICES                                 */}
        {/* ============================================================== */}
        {isGuide && (
          <div className="space-y-6">
            
            {/* Guide Hero */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-8 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10 space-y-3 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white backdrop-blur-md">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-300" /> Educator Guidebook
                </span>
                <h2 className="text-2xl font-black text-white">Classroom Formative Evaluations</h2>
                <p className="text-xs text-indigo-100/90 leading-relaxed">
                  A rapid-cycle testing suite designed for daily/weekly quizzes, pop tests, oral evaluations, and diagnostic rubrics without disrupting formal term datesheets or report cards.
                </p>
              </div>
            </div>

            {/* 5-Step Workflow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { step: '01', title: 'Schedule Test', desc: 'Create a title, pick class, subject, and recurrence.', icon: Calendar },
                { step: '02', title: 'Conduct Your Way', desc: 'Deliver via paper, blackboard, viva, or online exam.', icon: Laptop },
                { step: '03', title: 'Enter Marks Fast', desc: 'Inline spreadsheet gradebook with live auto-grading.', icon: PenSquare },
                { step: '04', title: 'Publish Instantly', desc: '1-click publishing pushes marks to student dossiers.', icon: Send },
                { step: '05', title: 'Track Mastery', desc: 'Longitudinal analytics reveal learning curves over time.', icon: TrendingUp }
              ].map((s) => (
                <div key={s.step} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-xs">
                      {s.step}
                    </span>
                    <s.icon className="w-4 h-4 text-slate-400" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{s.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* MODAL: NEW ASSESSMENT                                          */}
      {/* ============================================================== */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-scale-up">
            
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Create New Classroom Assessment</h3>
                  <p className="text-[11px] text-slate-500">Quick quiz, unit test, or periodic evaluation</p>
                </div>
              </div>
              <button 
                onClick={() => setShowNewModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAssessment} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Assessment Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 4: Trigonometry & Identities Quiz"
                  value={newForm.title}
                  onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Assessment Type</label>
                  <select
                    value={newForm.type}
                    onChange={(e) => setNewForm({ ...newForm, type: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    <option value="Quiz">Quiz</option>
                    <option value="Unit Test">Unit Test</option>
                    <option value="Periodic Test">Periodic Test</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Viva / Oral">Viva / Oral</option>
                    <option value="Practical">Practical</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Conducted Via</label>
                  <select
                    value={newForm.conductedVia}
                    onChange={(e) => setNewForm({ ...newForm, conductedVia: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    <option value="Paper / Pen">Paper / Pen</option>
                    <option value="Online Quiz">Online Quiz</option>
                    <option value="Oral / Viva">Oral / Viva</option>
                    <option value="Lab / Practical">Lab / Practical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Class & Section</label>
                  <select
                    value={newForm.classSec}
                    onChange={(e) => setNewForm({ ...newForm, classSec: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    <option value="Class 10-A">Class 10-A</option>
                    <option value="Class 9-B">Class 9-B</option>
                    <option value="Class 11-A">Class 11-A</option>
                    <option value="Class 8-C">Class 8-C</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                  <select
                    value={newForm.subject}
                    onChange={(e) => setNewForm({ ...newForm, subject: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    {(SUBJECT_OPTIONS[newForm.classSec] || ['General']).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Total Marks</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newForm.totalMarks}
                    onChange={(e) => setNewForm({ ...newForm, totalMarks: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Passing Marks</label>
                  <input
                    type="number"
                    min="1"
                    max={newForm.totalMarks}
                    value={newForm.passingMarks}
                    onChange={(e) => setNewForm({ ...newForm, passingMarks: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    value={newForm.date}
                    onChange={(e) => setNewForm({ ...newForm, date: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Instructions / Notes (Optional)</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Formula sheet provided. 40 minutes time limit."
                  value={newForm.instructions}
                  onChange={(e) => setNewForm({ ...newForm, instructions: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md shadow-indigo-200 cursor-pointer"
                >
                  Create & Initialize Roster
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: VIEW ASSESSMENT MARKSHEET DETAILS                       */}
      {/* ============================================================== */}
      {viewModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-scale-up">
            
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  {viewModalItem.type} Marksheet
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{viewModalItem.title}</h3>
                <div className="text-xs text-slate-500">
                  {viewModalItem.classSec} • {viewModalItem.subject} • Total: {viewModalItem.totalMarks} Marks
                </div>
              </div>
              <button 
                onClick={() => setViewModalItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Average Score</div>
                  <div className="text-base font-black text-slate-900">
                    {viewModalItem.stats?.averageScore || 0} / {viewModalItem.totalMarks}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Pass Rate</div>
                  <div className="text-base font-black text-emerald-600">
                    {viewModalItem.stats?.passPercentage || 0}%
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Status</div>
                  <div className="text-base font-black text-indigo-600">
                    {viewModalItem.status}
                  </div>
                </div>
              </div>

              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
                      <th className="py-2.5 px-3">Roll</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3 text-center">Marks</th>
                      <th className="py-2.5 px-3 text-center">Grade</th>
                      <th className="py-2.5 px-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(viewModalItem.entries || []).map((e, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-600">{e.rollNo || idx + 1}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{e.studentName}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                          {e.status === 'Absent' ? 'Absent' : `${e.marksObtained}/${viewModalItem.totalMarks}`}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 text-slate-800">
                            {e.grade}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px] italic">
                          {e.teacherRemarks || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Marksheet
              </button>

              <button
                onClick={() => {
                  setupMarksGrid(viewModalItem);
                  setViewModalItem(null);
                  navigate('/assessment/enter-marks');
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer flex items-center gap-1.5"
              >
                <PenSquare className="w-3.5 h-3.5" /> Edit Marks
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

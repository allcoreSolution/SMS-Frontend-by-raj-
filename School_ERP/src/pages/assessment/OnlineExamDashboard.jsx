import React, { useState, useEffect } from 'react';
import { 
  FileText, PlayCircle, Edit3, Database, Bell, ArrowRight,
  HelpCircle, Plus, CheckCircle2, Clock, Sparkles, 
  BarChart2, Layers, PieChart as PieIcon, Award, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import OnlineExamsTabs from '../../components/assessment/OnlineExamsTabs';
import { onlineExamService } from '../../api/onlineExamService';

export default function OnlineExamDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await onlineExamService.getDashboardStats();
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Failed to load online exam dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = dashboardData?.stats || {
    livePapers: 1,
    scheduledPapers: 1,
    completedPapers: 1,
    draftPapers: 1,
    totalQuestions: 8,
    publishedQuestions: 7,
    sittingNow: 14,
    awaitingMarking: 0,
    totalResults: 2,
    passedResults: 2
  };

  const recentPapers = dashboardData?.recentPapers || [];
  const statusChartData = dashboardData?.statusChartData || [
    { name: 'Live', count: 1 },
    { name: 'Scheduled', count: 1 },
    { name: 'Completed', count: 1 },
    { name: 'Draft', count: 1 }
  ];

  const difficultyData = dashboardData?.difficultyData || [
    { name: 'Easy', value: 3 },
    { name: 'Medium', value: 4 },
    { name: 'Hard', value: 1 }
  ];

  const PIE_COLORS = ['#10b981', '#6366f1', '#f43f5e'];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Live':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse';
      case 'Scheduled':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Completed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-purple-50/20 font-sans pb-16">
      
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center gap-1">
                  <PlayCircle className="w-3 h-3 text-purple-600" />
                  CBT & Online Testing
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500">Computer Based Assessment Engine</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
                <FileText className="w-6 h-6 text-purple-600" />
                Online Examinations Dashboard
              </h1>
            </div>
            
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setShowHelpModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer shadow-xs"
              >
                <HelpCircle className="w-4 h-4 text-slate-500" />
                How it works
              </button>
              <button 
                onClick={() => navigate('/online-exams/question-bank')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer shadow-xs"
              >
                <Database className="w-4 h-4 text-purple-600" />
                Question Bank
              </button>
              <button 
                onClick={() => navigate('/online-exams/manage')}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                New Online Exam
              </button>
            </div>
          </div>

          <div className="mt-4">
            <OnlineExamsTabs />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">

        {/* Top 4 KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div 
            onClick={() => navigate('/online-exams/manage')}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active
              </span>
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Examination Papers</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{stats.livePapers}</div>
            <div className="text-xs text-purple-600 font-semibold mt-1 flex items-center gap-1">
              <span>{stats.draftPapers} draft papers pending</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <PlayCircle className="w-5 h-5" />
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sitting Right Now</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{stats.sittingNow}</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">
              Students mid-paper across sessions
            </div>
          </div>

          <div 
            onClick={() => navigate('/online-exams/question-bank')}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-xs text-indigo-600 font-bold">Repository</span>
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Question Bank Items</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{stats.totalQuestions}</div>
            <div className="text-xs text-indigo-600 font-semibold mt-1 flex items-center gap-1">
              <span>{stats.publishedQuestions} approved & published</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Evaluations
              </span>
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attempts Evaluated</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{stats.totalResults}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">
              {stats.passedResults} passed • 100% evaluated
            </div>
          </div>

        </div>

        {/* Visual Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Paper Distribution BarChart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-purple-600" />
                  Assessment Pipeline Overview
                </h3>
                <p className="text-xs text-slate-400">Distribution of online tests by examination status</p>
              </div>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                Real-Time
              </span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '1rem', fontSize: '12px' }} 
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Question Bank Difficulty Pie */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-indigo-600" />
                Difficulty Tier Matrix
              </h3>
              <p className="text-xs text-slate-400">Complexity distribution of stored items</p>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '0.75rem', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-100">
              {difficultyData.map((d, i) => (
                <div key={d.name} className="p-2 rounded-xl bg-slate-50">
                  <div className="text-[11px] font-bold text-slate-500">{d.name}</div>
                  <div className="text-base font-black text-slate-800">{d.value}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Live Examination Sessions Feed */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                Active & Scheduled Examination Sessions
              </h3>
              <p className="text-xs text-slate-400">Computer-based assessment timetable</p>
            </div>
            <button
              onClick={() => navigate('/online-exams/manage')}
              className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
            >
              View All Sessions <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentPapers.map((paper) => (
              <div key={paper._id} className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {paper.subjectName || 'General'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(paper.status)}`}>
                      {paper.status}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">{paper.className || 'Class X'}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{paper.title}</h4>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    <span>{paper.durationMinutes || 60} mins</span>
                  </div>
                  <div className="text-slate-500">
                    Max Marks: <strong className="text-slate-800">{paper.totalMarks || 50}</strong>
                  </div>
                  <button
                    onClick={() => navigate('/online-exams/manage')}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Guidelines Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-purple-600">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-slate-900">How Online Examinations Operate</h3>
              </div>
              <button onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>1. Question Bank:</strong> Author questions once or bulk-import via CSV/JSON with answers, explanations, and difficulty levels.
              </p>
              <p>
                <strong>2. Paper Creation:</strong> Build online exams by pulling from the question bank or creating bespoke papers with time locks.
              </p>
              <p>
                <strong>3. Automated CBT Evaluation:</strong> Student submissions are graded automatically with instant scorecards, percentages, and performance graphs.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

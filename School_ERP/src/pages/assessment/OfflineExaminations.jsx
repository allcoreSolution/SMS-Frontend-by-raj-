import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OfflineExamsTabs from '../../components/assessment/OfflineExamsTabs';
import { 
  LayoutDashboard, List, Calendar, Edit3, FileText, 
  TrendingUp, Tags, CheckSquare, History, ClipboardList,
  Plus, PenTool, Award, Star, ArrowUpRight, CheckCircle2, Clock
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { examService } from '../../api/examService';

const COLORS = ['#6366f1', '#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#8b5cf6'];
const ATTENDANCE_COLORS = ['#10b981', '#ef4444'];

export default function OfflineExaminations() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Live state
  const [stats, setStats] = useState({
    examsThisSession: 0,
    upcomingExams: 0,
    ongoingExams: 0,
    marksEntryPercent: 0,
    publishedMarksheets: 0
  });
  const [scheduleData, setScheduleData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [marksProgress, setMarksProgress] = useState([]);
  const [passFailData, setPassFailData] = useState([]);
  const [recentExams, setRecentExams] = useState([]);
  const [upcomingExamsList, setUpcomingExamsList] = useState([]);
  const [operations, setOperations] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await examService.getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data.stats || {});
        setScheduleData(res.data.scheduleData || []);
        setTypeData(res.data.typeData || []);
        setAttendanceData(res.data.attendanceData || []);
        setMarksProgress(res.data.marksEntryProgress || []);
        setPassFailData(res.data.passFailData || []);
        setRecentExams(res.data.recentExams || []);
        setUpcomingExamsList(res.data.upcomingExamsList || []);
        setOperations(res.data.operations || []);
      }
    } catch (err) {
      console.error('Failed to load exam dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-y-auto">
      {/* Top Header */}
      <div className="px-8 pt-6 pb-4 bg-white border-b border-slate-200/80 shrink-0">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Offline Examinations</h1>
            <p className="text-xs text-slate-500 mt-1">
              Exam scheduling, datesheets, admit cards, grading scales, marks entry & report cards
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/offline-exams/quick-setup')}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <PenTool className="w-4 h-4 text-indigo-600" /> Quick Exam Setup
            </button>
            <button 
              onClick={() => navigate('/offline-exams/manage')}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:from-indigo-700 hover:to-indigo-800 shadow-md shadow-indigo-100 transition flex items-center gap-2 cursor-pointer"
            >
              <List className="w-4 h-4" /> Manage All Exams
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6">
          <OfflineExamsTabs />
        </div>
      </div>

      {/* Main Dashboard Area */}
      <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-500">Loading exam analytics & MongoDB metrics...</p>
          </div>
        ) : (
          <>
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Exams This Session</span>
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                    <List className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-black text-slate-800">{stats.examsThisSession}</span>
                  <span className="text-[11px] text-indigo-600 font-semibold block mt-1">
                    {stats.ongoingExams} Ongoing Right Now
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Upcoming Exams</span>
                  <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-black text-slate-800">{stats.upcomingExams}</span>
                  <span className="text-[11px] text-cyan-600 font-semibold block mt-1">
                    Scheduled in Datesheet
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Marks Entry Progress</span>
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                    <Edit3 className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-black text-slate-800">{stats.marksEntryPercent}%</span>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${stats.marksEntryPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Published Marksheets</span>
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-black text-slate-800">{stats.publishedMarksheets}</span>
                  <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                    Live for Students & Parents
                  </span>
                </div>
              </div>

            </div>

            {/* Row 2: Charts (Schedule Timeline & Exam Types Breakdown) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Area Chart: Paper Scheduling Timeline */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Exam Scheduling Density Timeline</h3>
                    <p className="text-xs text-slate-400">Papers scheduled across examination timeline</p>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                    Live Datesheet
                  </span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={scheduleData}>
                      <defs>
                        <linearGradient id="scheduleGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                      <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#scheduleGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart: Exam Types Distribution */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Exam Types Distribution</h3>
                    <p className="text-xs text-slate-400">Assessments breakdown by category</p>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {typeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Row 3: Class-wise Pass/Fail & Marks Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Bar Chart: Pass vs Needs Improvement */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Pass vs Fail Analytics by Class</h3>
                    <p className="text-xs text-slate-400">Summative result distribution per academic grade</p>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={passFailData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={70} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="passed" name="Passed (>=33%)" fill="#10b981" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="failed" name="Needs Help (<33%)" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Marks Entry Progress Roster */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-800">Marks Entry Progress by Exam</h3>
                    <span className="text-[11px] font-bold text-slate-500">Live Entries</span>
                  </div>
                  <div className="space-y-4">
                    {marksProgress.map((ex, idx) => {
                      const pct = ex.total > 0 ? Math.round((ex.current / ex.total) * 100) : 0;
                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-slate-700">{ex.name}</span>
                            <span className="text-slate-500 font-semibold">{ex.current} / {ex.total} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className={`${ex.color} h-full rounded-full transition-all`} style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button 
                    onClick={() => navigate('/offline-exams/enter-marks')}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Edit3 className="w-4 h-4 text-indigo-400" /> Open Marks Entry Terminal
                  </button>
                </div>
              </div>

            </div>

            {/* Row 4: Recent Exams & Operations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-600" /> Recent Exams
                </h3>
                <div className="divide-y divide-slate-100">
                  {recentExams.map((exam) => (
                    <div key={exam.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{exam.title}</span>
                        <span className="text-[10px] text-slate-400">{exam.date}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        exam.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        exam.status === 'Ongoing' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {exam.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-600" /> Upcoming Assessments
                </h3>
                <div className="divide-y divide-slate-100">
                  {upcomingExamsList.map((exam) => (
                    <div key={exam.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{exam.title}</span>
                        <span className="text-[10px] text-slate-400">Date: {exam.date}</span>
                      </div>
                      <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full">
                        {exam.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-emerald-600" /> Quick Operations
                  </h3>
                  <div className="space-y-2">
                    {operations.map((op, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => {
                          if (op.key === 'types') navigate('/offline-exams/types');
                          else if (op.key === 'grades') navigate('/offline-exams/manage-grades');
                          else if (op.key === 'schedules') navigate('/offline-exams/datesheet');
                          else if (op.key === 'cocurricular') navigate('/offline-exams/cocurricular-areas');
                        }}
                        className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition border border-transparent hover:border-slate-200"
                      >
                        <span className="text-xs font-bold text-slate-700">{op.label}</span>
                        <span className="text-xs font-black text-indigo-600 font-mono">{op.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/offline-exams/generate-marksheet')}
                  className="mt-4 w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-100"
                >
                  <FileText className="w-4 h-4" /> Generate Report Cards
                </button>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
}

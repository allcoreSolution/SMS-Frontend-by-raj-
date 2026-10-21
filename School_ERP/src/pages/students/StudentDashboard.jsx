import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, UserPlus, GraduationCap, CheckCircle2, 
  Search, Plus, Cake, Sparkles, Home, Tags, 
  ArrowUpRight, HeartPulse, RefreshCw, Eye
} from 'lucide-react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import StudentsTabs from '../../components/students/StudentsTabs';
import { studentService } from '../../api/studentService';

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    total: 0,
    activeStudents: 0,
    exitedCount: 0,
    onHoldCount: 0,
    attendanceRate: 0,
    totalClasses: 0,
    totalParents: 0,
    gender: { male: 0, female: 0, other: 0 },
    classDistribution: [],
    houseDistribution: [],
    categoryDistribution: [],
    recentAdmissions: [],
    upcomingBirthdays: []
  });

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await studentService.getDashboardStats();
      if (res?.success && res.stats) {
        setStatsData(res.stats);
      }
    } catch (err) {
      console.error('Failed to load student dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const genderPieData = [
    { name: 'Boys', value: statsData.gender.male || 0, fill: '#3b82f6' },
    { name: 'Girls', value: statsData.gender.female || 0, fill: '#ec4899' },
    ...(statsData.gender.other > 0 ? [{ name: 'Other', value: statsData.gender.other, fill: '#a855f7' }] : [])
  ];

  const HOUSE_COLORS = {
    'Red Phoenix': '#ef4444',
    'Blue Pegasus': '#3b82f6',
    'Green Dragon': '#10b981',
    'Yellow Hydra': '#f59e0b',
    'Red': '#ef4444',
    'Blue': '#3b82f6',
    'Green': '#10b981',
    'Yellow': '#f59e0b'
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen space-y-6">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full border border-indigo-400/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Student Information Management
            </span>
            <span className="text-xs text-slate-400">Academic Session 2026-27</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">Student Information Hub</h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Live student enrollment records, attendance analytics, family relations, conduct records, and health data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button 
            onClick={fetchDashboard}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-all border border-white/10"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          
          <Link 
            to="/students/search-photo" 
            className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-all border border-white/20 shadow-sm"
          >
            <Search className="w-4 h-4" /> Search by Photo
          </Link>
          
          <Link 
            to="/students/admission" 
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" /> Admit Student
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <StudentsTabs />

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Enrolled */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Enrolled</p>
            <p className="text-3xl font-extrabold text-slate-900">{statsData.total}</p>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="text-emerald-600 font-semibold">{statsData.activeStudents} Active</span>
              <span>•</span>
              <span>{statsData.totalClasses} Classes</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
            <GraduationCap className="w-7 h-7" />
          </div>
        </div>

        {/* Card 2: Attendance Rate */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Attendance</p>
            <p className="text-3xl font-extrabold text-slate-900">{statsData.attendanceRate}%</p>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Real-time marked on biometric & app</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>

        {/* Card 3: Gender Ratio */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Gender Breakdown</p>
            <p className="text-3xl font-extrabold text-slate-900">
              {statsData.gender.male} <span className="text-lg font-normal text-slate-400">/</span> {statsData.gender.female}
            </p>
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="text-blue-600 font-semibold">{statsData.gender.male} Boys</span>
              <span>•</span>
              <span className="text-pink-600 font-semibold">{statsData.gender.female} Girls</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
            <Users className="w-7 h-7" />
          </div>
        </div>

        {/* Card 4: Parent Accounts */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Parent Profiles</p>
            <p className="text-3xl font-extrabold text-slate-900">{statsData.totalParents}</p>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="text-purple-600 font-semibold">100% Linked</span>
              <span>•</span>
              <span>{statsData.exitedCount} Exited TC</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
            <Users className="w-7 h-7" />
          </div>
        </div>

      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Class-wise Enrollment Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900">Class Enrollment Distribution</h2>
              <p className="text-xs text-slate-400">Total active students categorized by academic grade</p>
            </div>
            <Link to="/students/list" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData.classDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                />
                <Bar dataKey="students" name="Students" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Demographics Doughnut */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Gender Ratio</h2>
            <p className="text-xs text-slate-400">Student population demographic breakdown</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={genderPieData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={50} 
                  outerRadius={75} 
                  paddingAngle={4}
                >
                  {genderPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-blue-50/60">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Boys</p>
                <p className="text-sm font-bold text-slate-800">{statsData.gender.male} ({statsData.total > 0 ? Math.round((statsData.gender.male / statsData.total) * 100) : 0}%)</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-pink-50/60">
              <span className="w-3 h-3 rounded-full bg-pink-500" />
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Girls</p>
                <p className="text-sm font-bold text-slate-800">{statsData.gender.female} ({statsData.total > 0 ? Math.round((statsData.gender.female / statsData.total) * 100) : 0}%)</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Houses & Categories Distribution Chips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Houses Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Home className="w-4 h-4 text-indigo-600" /> School Houses Allocation
            </h2>
            <Link to="/students/houses" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              Manage Houses →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statsData.houseDistribution.map((h) => (
              <div key={h.house} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: HOUSE_COLORS[h.house] || '#6366f1' }} />
                  <span className="text-xs font-semibold text-slate-700">{h.house}</span>
                </div>
                <p className="text-xl font-bold text-slate-900">{h.count}</p>
                <p className="text-[10px] text-slate-400">Enrolled Members</p>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Tags className="w-4 h-4 text-indigo-600" /> Social Categories Distribution
            </h2>
            <Link to="/students/categories" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              Manage Categories →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statsData.categoryDistribution.map((c) => (
              <div key={c.category} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-1">
                <span className="text-xs font-bold text-slate-700">{c.category}</span>
                <p className="text-xl font-bold text-slate-900">{c.count}</p>
                <p className="text-[10px] text-slate-400">Total Students</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Admissions & Quick Feed */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Student Admissions</h2>
            <p className="text-xs text-slate-400">Latest students admitted with live contact & class information</p>
          </div>
          <Link to="/students/list" className="px-3.5 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-xl hover:bg-indigo-100 transition-colors">
            View All Roster
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5">Student</th>
                <th className="py-3.5 px-4">Admission / APAR</th>
                <th className="py-3.5 px-4">Class & Section</th>
                <th className="py-3.5 px-4">Parent / Contact</th>
                <th className="py-3.5 px-4">House / Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {statsData.recentAdmissions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No recent admissions recorded.
                  </td>
                </tr>
              ) : (
                statsData.recentAdmissions.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 flex items-center gap-3">
                      <img 
                        src={s.studentPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.firstName + ' ' + (s.lastName || ''))}&background=EEEDFF&color=5F52FF`} 
                        alt="" 
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{s.firstName} {s.lastName || ''}</p>
                        <p className="text-[11px] text-slate-400">{s.gender} • Roll: {s.rollNo || '-'}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-800 font-medium">{s.admissionNo || s.aparId}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold text-[11px]">
                        {s.classId?.className || 'Unassigned'} ({s.sectionId?.sectionName || 'A'})
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800">{s.fatherName || 'Parent'}</p>
                      <p className="text-[11px] text-slate-400">{s.fatherPhone || s.studentPhone || '-'}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-slate-600">{s.house || 'Red'}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-semibold">{s.category || 'GEN'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : s.status === 'On Hold' 
                            ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {s.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link 
                        to={`/students/list?search=${encodeURIComponent(s.aparId || s.firstName)}`}
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default StudentDashboard;
